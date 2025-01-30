const ytdl = require("@distube/ytdl-core");
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);


addCommand( {pattern: "^video ?(.*)", access: "all", desc: "Download video from YouTube.", usage: global.handlers[0] + "video <query || url>" }, async (msg, match, sock, rawMessage) => {
    const query = match[1];
    if (!query) {
        if (msg.key.fromMe) {
            return await sock.sendMessage(msg.key.remoteJid, { text: "_❌ Please provide a video to search for._", edit: msg.key });
        } else {
            return await sock.sendMessage(msg.key.remoteJid, { text: "_❌ Please provide a video to search for._"}, { quoted: rawMessage.messages[0] });
        }
    }

    if (msg.key.fromMe) {
        await sock.sendMessage(msg.key.remoteJid, { text: "_⏳ Video Downloading.._", edit: msg.key });
    } else {
        await sock.sendMessage(msg.key.remoteJid, { text: "_⏳ Video Downloading.._"}, { quoted: rawMessage.messages[0] });
    }

    let videoId;
    if (query.match(/^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/)) {
        const urlParams = new URLSearchParams(new URL(query).search);
        videoId = urlParams.get('v');
    } else {
        const ytVideo = await import('libmuse');
        
        const searchResults = await ytVideo.search(query);
        if (!searchResults || searchResults.length === 0) {
            if (msg.key.fromMe) {
                return await sock.sendMessage(msg.key.remoteJid, { text: "_❌ No results found for this query._", edit: msg.key });
            } else {
                return await sock.sendMessage(msg.key.remoteJid, { text: "_❌ No results found for this query._"}, { quoted: rawMessage.messages[0] });
            }
        }

        const videos = searchResults.categories.find(x => x.title === "Videos");
        if (!videos || videos.results.length === 0) {
            if (msg.key.fromMe) {
                return await sock.sendMessage(msg.key.remoteJid, { text: "_❌ No videos found for this query._", edit: msg.key });
            } else {
                return await sock.sendMessage(msg.key.remoteJid, { text: "_❌ No videos found for this query._"}, { quoted: rawMessage.messages[0] });
            }
        }

        videoId = videos.results[0].videoId;
    }

    try {
        var video = await ytdl.getInfo(`https://www.youtube.com/watch?v=${videoId}`);
    } catch {
        if (msg.key.fromMe) {
            return await sock.sendMessage(msg.key.remoteJid, { text: "_❌ No video found for this query._", edit: msg.key });
        } else {
            return await sock.sendMessage(msg.key.remoteJid, { text: "_❌ No video found for this query._"}, { quoted: rawMessage.messages[0] });
        }
    }

    const url = video.videoDetails.video_url;

    const mediaPath = `./video.mp4`;
    const mp4Path = `./video_converted.mp4`;

    const downloadSuccess = await downloadVideo(url, mediaPath, video.videoDetails.lengthSeconds);
    await convertToMp4(mediaPath, mp4Path);

    if (!downloadSuccess) {
        if (msg.key.fromMe) {
            return await sock.sendMessage(msg.key.remoteJid, { text: "_❌ Failed to download video._", edit: msg.key });
        } else {
            return await sock.sendMessage(msg.key.remoteJid, { text: "_❌ Failed to download video._"}, { quoted: rawMessage.messages[0] });
        }
    }

    if (msg.key.fromMe) {
        await sock.sendMessage(msg.key.remoteJid, { delete: msg.key });
    }

    
    const messageOptions = {
        video: { url: mp4Path },
        caption: video.videoDetails.author.name + " - " + video.videoDetails.title,
    };

    if (msg.key.fromMe) {
        await sock.sendMessage(msg.key.remoteJid, messageOptions);
    } else {
        await sock.sendMessage(msg.key.remoteJid, messageOptions, { quoted: rawMessage.messages[0] });
    }

    [mediaPath, mp4Path].forEach(file => {
        if (fs.existsSync(file)) fs.unlinkSync(file);
    });

    return;

})


addCommand({ pattern: "^music ?(.*)", access: "all", desc: "Download music from YouTube.", usage: global.handlers[0] + "music <query || url>" }, async (msg, match, sock, rawMessage) => {
    const query = match[1];
    if (!query) {
        if (msg.key.fromMe) {
            return await sock.sendMessage(msg.key.remoteJid, { text: "_❌ Please provide a music to search for._", edit: msg.key });
        }
        else {
            return await sock.sendMessage(msg.key.remoteJid, { text: "_❌ Please provide a music to search for._"}, { quoted: rawMessage.messages[0] });
        }
    }

    if (msg.key.fromMe) {
        await sock.sendMessage(msg.key.remoteJid, { text: "_⏳ Music Downloading.._", edit: msg.key });
    }
    else {
        await sock.sendMessage(msg.key.remoteJid, { text: "_⏳ Music Downloading.._"}, { quoted: rawMessage.messages[0] });
    }

    let url;
    if (query.match(/^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/)) {
        const urlParams = new URLSearchParams(new URL(query).search);
        url = "https://www.youtube.com/watch?v=" + urlParams.get('v')
    } else {
        const ytMusic = await import('libmuse');
        
        const searchResults = await ytMusic.search(query);
        if (!searchResults || searchResults.length === 0) {
            if (msg.key.fromMe) {
                return await sock.sendMessage(msg.key.remoteJid, { text: "_❌ No results found for this query._", edit: msg.key });
            } else {
                return await sock.sendMessage(msg.key.remoteJid, { text: "_❌ No results found for this query._"}, { quoted: rawMessage.messages[0] });
            }
        }

        const songs = searchResults.categories.find(x => x.title === "Songs");
        if (!songs || songs.results.length === 0) {
            if (msg.key.fromMe) {
                return await sock.sendMessage(msg.key.remoteJid, { text: "_❌ No songs found for this query._", edit: msg.key });
            } else {
                return await sock.sendMessage(msg.key.remoteJid, { text: "_❌ No songs found for this query._"}, { quoted: rawMessage.messages[0] });
            }
        }

        const song = songs.results[0];
        if (!song) {
            if (msg.key.fromMe) {
                return await sock.sendMessage(msg.key.remoteJid, { text: "_❌ No song found for this query._", edit: msg.key });
            } else {
                return await sock.sendMessage(msg.key.remoteJid, { text: "_❌ No song found for this query._"}, { quoted: rawMessage.messages[0] });
            }
        }
        url = `https://www.youtube.com/watch?v=${song.videoId}`;
    }

    const audioFilePath = "./music.mp3";
    const oggFilePath = "./music.ogg";

    const downloadSuccess = await downloadAudio(url, audioFilePath);
    if (!downloadSuccess) {
        if (msg.key.fromMe) {
            return await sock.sendMessage(msg.key.remoteJid, { text: "_❌ Failed to download audio._", edit: msg.key });
        } else {
            return await sock.sendMessage(msg.key.remoteJid, { text: "_❌ Failed to download audio._"}, { quoted: rawMessage.messages[0] });
        }
    }

    await convertToOgg(audioFilePath);

    if (msg.key.fromMe) {
        await sock.sendMessage(msg.key.remoteJid, { delete: msg.key });
    }

    if (msg.key.fromMe) {
        await sock.sendMessage(msg.key.remoteJid, { audio: { url: oggFilePath }, mimetype: 'audio/ogg' });
    } else {
        await sock.sendMessage(msg.key.remoteJid, { audio: { url: oggFilePath }, mimetype: 'audio/ogg' }, { quoted: rawMessage.messages[0] });
    }

    [audioFilePath, oggFilePath].forEach(file => {
        if (fs.existsSync(file)) fs.unlinkSync(file);
    });

    return;
})

/**
 * Downloads the audio from a YouTube video and saves it to a file.
 * @param {string} link - The URL of the YouTube video.
 * @param {string} file - The path to save the downloaded audio file.
 * @returns {Promise<boolean>} - A Promise that resolves to true if the download is successful, false otherwise.
 */
async function downloadAudio(link, file) {
    try {
        if (fs.existsSync(file)) fs.unlinkSync(file);
        const stream = ytdl(link, { "quality": "highestaudio", "filter": "audioonly" }).pipe(fs.createWriteStream(file));
        
        await new Promise((resolve, reject) => {
            stream.on('finish', resolve);
            stream.on('error', reject);
        });
        
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}


/**
 * Downloads a video from a YouTube link and saves it to a file.
 * @param {string} link - The URL of the YouTube video.
 * @param {string} file - The path to save the downloaded video file.
 * @param {number} duration - The length of the video in seconds.
 * @returns {Promise<boolean>} - A Promise that resolves to true if the download is successful, false otherwise.
 */
async function downloadVideo(link, file, duration) {
    try {
        if (fs.existsSync(file)) fs.unlinkSync(file);
        const stream = ytdl(link, { "quality": duration > 300 ? "lowestVideo" : "highestvideo", "filter": "audioandvideo" }).pipe(fs.createWriteStream(file));
        
        await new Promise((resolve, reject) => {
            stream.on('finish', resolve);
            stream.on('error', reject);
        });
        
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

/**
 * Converts an audio file to ogg format.
 * @param {string} file - The path to the audio file to convert.
 * @returns {Promise<void>} - A Promise that resolves when the conversion is complete.
 */
async function convertToOgg(file) {
    return new Promise((resolve, reject) => {
      ffmpeg(file)
        .audioChannels(1)
        .output(file.replace(".mp3", ".ogg"))
        .on('end', () => {
          resolve();
        })
        .on('error', (err) => {
          reject(err);
        })
        .run();
    });
}


/**
 * Converts a video file to MP4 format.
 * @param {string} file - The path to the video file to convert.
 * @param {string} output - The path to save the converted video file.
 * @returns {Promise<void>} - A Promise that resolves when the conversion is complete.
 */
async function convertToMp4(file, output) {
    return new Promise((resolve, reject) => {
      ffmpeg(file)
        .videoCodec('libx264')
        .outputOptions('-preset', 'fast')
        .output(output)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });
}