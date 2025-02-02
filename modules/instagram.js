/**
 * @module instagram
 * @requires axios
 * @requires qs
 * @requires fs
 * 
 * @thanks Ic3zy for this plugin
*/

const axios = require('axios');
const qs = require('qs');
const fs = require('fs');


/**
 * Checks if the provided URL is a redirect and returns the final path.
 * 
 * If the URL contains the "share" segment, it makes a GET request to the URL and returns the path from the request object.
 * Otherwise, it simply returns the original URL.
 * 
 * @param {string} url - The URL to check for a redirect.
 * @returns {Promise<string>} - The final path of the URL after any redirects.
 */
async function checkRedirect(url){
    let split_url = url.split("/");
    if(split_url.includes("share")){
        let res = await axios.get(url);
        return res.request.path;
    }
    return url
}

/**
 * Formats the post information from the provided request data.
 *
 * @param {object} requestData - The request data containing the post information.
 * @returns {object} - An object containing the formatted post information, including the owner's username, full name, verification status, privacy status, like count, ad status, and caption.
 * @throws {Error} - Throws an error if there is a failure in formatting the post information.
 */
function formatPostInfo(requestData){
    try{
        let mediaCapt = requestData.edge_media_to_caption.edges;
        const capt = (mediaCapt.length === 0) ? "" : mediaCapt[0].node.text;
        return {
            owner_username: requestData.owner.username,
            owner_fullname: requestData.owner.full_name,
            is_verified: requestData.owner.is_verified,
            is_private: requestData.owner.is_private,
            likes: requestData.edge_media_preview_like.count,
            is_ad: requestData.is_ad,
            caption: capt
        }
    } catch(err){
        throw new Error(`Failed to format post info: ${err.message}`);
    }
}

/**
 * Formats the media details from the provided media data.
 *
 * If the media is a video, it returns an object with the following properties:
 * - type: "video"
 * - dimensions: the dimensions of the video
 * - video_view_count: the number of views for the video
 * - url: the URL of the video
 * - thumbnail: the URL of the video thumbnail
 *
 * If the media is an image, it returns an object with the following properties:
 * - type: "image"
 * - dimensions: the dimensions of the image
 * - url: the URL of the image
 *
 * @param {object} mediaData - The media data to format.
 * @returns {object} - An object containing the formatted media details.
 * @throws {Error} - Throws an error if there is a failure in formatting the media details.
 */
function formatMediaDetails(mediaData){
    try{
        if(mediaData.is_video){
            return {
                type: "video",
                dimensions: mediaData.dimensions,
                video_view_count: mediaData.video_view_count,
                url: mediaData.video_url,
                thumbnail: mediaData.display_url
            }
        } else {
            return {
                type: "image",
                dimensions: mediaData.dimensions,
                url: mediaData.display_url
            }
        }
    } catch(err){
        throw new Error(`Failed to format media details: ${err.message}`);
    };
}

/**
 * Extracts the shortcode from the provided URL.
 * 
 * The shortcode is the string after the last occurrence of the following tags in the URL:
 * - p
 * - reel
 * - tv
 * - reels
 * 
 * @param {string} url - The URL to extract the shortcode from.
 * @returns {string} - The shortcode.
 * @throws {Error} - Throws an error if there is a failure in extracting the shortcode.
 */
function getShortcode(url){
    try{
        let split_url = url.split("/");
        let post_tags = ["p", "reel", "tv", "reels"];
        let index_shortcode = split_url.findIndex(item => post_tags.includes(item)) + 1;
        let shortcode = split_url[index_shortcode];
        return shortcode;
    } catch(err){
        throw new Error(`Failed to obtain shortcode: ${err.message}`);
    }
}

/**
 * Checks if the provided request data is a sidecar post.
 * 
 * @param {Object} requestData - The request data to check.
 * @returns {boolean} - True if the request data is a sidecar post, false otherwise.
 * @throws {Error} - Throws an error if there is a failure in checking if the request data is a sidecar post.
 */
function isSidecar(requestData){
    try{
        return requestData["__typename"] == "XDTGraphSidecar";
    } catch(err){
        throw new Error(`Failed sidecar verification: ${err.message}`);
    }
}

/**
 * Sends a request to Instagram's GraphQL API to fetch media data based on the provided shortcode.
 * 
 * The function constructs a request body with specific variables and sends a POST request
 * to fetch details about a post or reel using its shortcode. It handles errors and verifies 
 * that the response contains the expected media data.
 * 
 * @param {string} shortcode - The shortcode of the Instagram media to fetch details for.
 * @returns {Object} - The media data associated with the provided shortcode.
 * @throws {Error} - Throws an error if the request fails or if the response does not contain the expected media data.
 */

async function instagramRequest(shortcode) {
    try{
        const BASE_URL = "https://www.instagram.com/graphql/query";
        const INSTAGRAM_DOCUMENT_ID = "8845758582119845";
        let dataBody = qs.stringify({
            'variables': JSON.stringify({
                'shortcode': shortcode,
                'fetch_tagged_user_count': null,
                'hoisted_comment_id': null,
                'hoisted_reply_id': null
            }),
            'doc_id': INSTAGRAM_DOCUMENT_ID 
        });
    
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: BASE_URL,
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : dataBody
        };
    
        const {data} = await axios.request(config);
        if(!data.data?.xdt_shortcode_media) throw new Error("Only posts/reels supported, check if your link is valid.");
        return data.data.xdt_shortcode_media;
    } catch(err){
        throw new Error(`Failed instagram request: ${err.message}`)
    }
}

/**
 * Generates a structured output containing media details and URLs from the provided request data.
 * 
 * This function checks if the request data represents a sidecar post and processes each media item accordingly.
 * It extracts and formats media details using the formatMediaDetails function, and compiles a list of URLs for the media content.
 * 
 * @param {object} requestData - The request data containing information about the Instagram post.
 * @returns {object} - An object containing the number of media results, list of media URLs, formatted post information, and media details.
 * @throws {Error} - Throws an error if there is a failure in creating the output data.
 */

function createOutputData(requestData){
    try{
        let url_list = [], media_details = []
        const IS_SIDECAR = isSidecar(requestData)
        if(IS_SIDECAR){
            //Post with sidecar
            requestData.edge_sidecar_to_children.edges.forEach((media)=>{
                media_details.push(formatMediaDetails(media.node))
                if(media.node.is_video){ //Sidecar video item
                    url_list.push(media.node.video_url)
                } else { //Sidecar image item
                    url_list.push(media.node.display_url)
                }
            })
        } else {
            //Post without sidecar
            media_details.push(formatMediaDetails(requestData))
            if(requestData.is_video){ // Video media
                url_list.push(requestData.video_url)
            } else { //Image media
                url_list.push(requestData.display_url)
            }
        }

        return {
            results_number: url_list.length,
            url_list,
            post_info: formatPostInfo(requestData),
            media_details
        }
    } catch(err){
        throw new Error(`Failed to create output data: ${err.message}`)
    }
}
/**
 * Downloads Instagram media from the provided URL
 * 
 * This function first checks the URL for any redirects and
 * then extracts the shortcode from the URL. It uses this shortcode
 * to make a request to the Instagram API to retrieve details about the post.
 * The function then creates a structured output containing the URL(s) of the media
 * and other relevant information about the post.
 * 
 * @param {string} url_media - The URL of the Instagram post to download.
 * @returns {Promise<object|{error: string}>} - A promise that resolves to an object containing the media URLs and post information, or rejects to an object with an error message.
 */
async function geturl (url_media) {
    return new Promise(async (resolve,reject)=>{
        try {
            url_media = await checkRedirect(url_media)
            const SHORTCODE = getShortcode(url_media)
            const INSTAGRAM_REQUEST = await instagramRequest(SHORTCODE)
            const OUTPUT_DATA = createOutputData(INSTAGRAM_REQUEST)
            resolve(OUTPUT_DATA)
        } catch(err){
            reject({
                error: err.message
            })
        }
    })
}
/**
 * Downloads a video from the provided URL and saves it to the given path.
 * 
 * This function returns a promise that resolves to the path of the downloaded video
 * once the download is complete, or rejects to an error if the download fails.
 * The promise is resolved/rejected in the following cases:
 * - resolve: Video download completed successfully.
 * - reject: Axios request fails, file write error, or other unexpected error.
 * 
 * @param {string} url - The URL of the video to download.
 * @param {string} path - The path to save the downloaded video.
 * @returns {Promise<string|{error: string}>} - A promise that resolves to the path of the downloaded video, or rejects to an object with an error message.
 */
async function downloadVideo(url, path) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'GET',
            url: url,
            responseType: 'stream',
        }).then(response => {
            const writer = fs.createWriteStream(path);
            response.data.pipe(writer);

            writer.on('finish', () => {
                resolve(path);
            });

            writer.on('error', (err) => {
                reject(err);
            });
        }).catch(error => {
            reject(error);
        });
    });
}

/**
 * Downloads an Instagram media from the provided URL and saves it to the given path.
 * 
 * This function returns a promise that resolves to an object containing the path of the downloaded media, its caption and type
 * once the download is complete, or rejects to an error if the download fails.
 * The promise is resolved/rejected in the following cases:
 * - resolve: Media download completed successfully.
 * - reject: Axios request fails, file write error, or other unexpected error.
 * 
 * @param {string} urlr - The URL of the Instagram post to download.
 * @param {string} path - The path to save the downloaded media.
 * @returns {Promise<object|{error: string}>} - A promise that resolves to an object with the path, caption and type of the downloaded media, or rejects to an object with an error message.
 */
async function downloads(urlr, path) {
    return new Promise(async (resolve, reject) => {
        try {
            const urls = await geturl(urlr);
            var medias = {
                media: urls.url_list,
                type: urls.media_details[0].type,
                info: urls.post_info.caption
            }
            resolve(medias);
        } catch (error) {
            reject(error);
        }
    });
}


addCommand({pattern: "^insta ?(.*)", desc: "Allows you to download videos/images from Instagram.", access: "all"}, async (msg, match, sock, rawMessage) => {

    if (!match[1]) {
        if (msg.key.fromMe) {
            return await sock.sendMessage(msg.key.remoteJid, {text: "_Please provide a URL to download from Instagram._", edit: msg.key});
        } else {
            return await sock.sendMessage(msg.key.remoteJid, {text: "_Please provide a URL to download from Instagram._"}, {quoted: rawMessage.messages[0]});
        }
    }

    if (msg.key.fromMe) {
        await sock.sendMessage(msg.key.remoteJid, {text: "_📥 Downloading..._", edit: msg.key});
    } else {
        var publicMessage = await sock.sendMessage(msg.key.remoteJid, {text: "_📥 Downloading..._"}, {quoted: rawMessage.messages[0]});
    }

    try {
        var data = await downloads(match[1], "./");
    } catch {
        if (msg.key.fromMe) {
            return await sock.sendMessage(msg.key.remoteJid, {text: "_❌ An error occurred while downloading the media._", edit: msg.key});
        } else {
            await sock.sendMessage(msg.key.remoteJid, {delete: publicMessage.key});
            return await sock.sendMessage(msg.key.remoteJid, {text: "_❌ An error occurred while downloading the media._"}, {quoted: rawMessage.messages[0]});
        }
    }

    if (data.type == "video") {
        if (msg.key.fromMe) {
            await sock.sendMessage(msg.key.remoteJid, {delete: msg.key});

            for (var i = 0; i < data.media.length; i++) {
                await sock.sendMessage(msg.key.remoteJid, {video: { url: data.media[i] }, caption: data.info});
            }
            
        } else {
            await sock.sendMessage(msg.key.remoteJid, {delete: publicMessage.key});

            for (var i = 0; i < data.media.length; i++) {
                await sock.sendMessage(msg.key.remoteJid, {video: { url: data.media[i] }, caption: data.info}, {quoted: rawMessage.messages[0]});
            }
        }
    } else {
        if (msg.key.fromMe) {
            await sock.sendMessage(msg.key.remoteJid, {delete: msg.key});

            for (var i = 0; i < data.media.length; i++) {
                await sock.sendMessage(msg.key.remoteJid, {image: { url: data.media[i] }, caption: data.info});
            }
        } else {
            await sock.sendMessage(msg.key.remoteJid, {delete: publicMessage.key});

            for (var i = 0; i < data.media.length; i++) {
                await sock.sendMessage(msg.key.remoteJid, {image: { url: data.media[i] }, caption: data.info}, {quoted: rawMessage.messages[0]});
            }
        }
    }
    try { fs.unlinkSync(data.path) } catch {}
    return;
});