// Primon Proto
// Headless WebSocket, type-safe Whatsapp Bot
//
// Primon, lisanced under GNU GENERAL PUBLIC LICENSE. May cause some warranity problems, within Priomon.
// Multi-Device Lightweight ES6 Module (can usable with mjs)
//
// Phaticusthiccy - 2022

var axios = require("axios");
var fs = require("fs");
const youtubeEndpoint = `https://www.youtube.com`;
require("util").inspect.defaultOptions.depth = null;
const { Octokit } = require("@octokit/core");
const octokit = new Octokit({
  auth: process.env.GITHUB_AUTH
})


function dictEmojis() {
  var emoji = [
    "❤",
    "🧡",
    "💛",
    "💚",
    "💙",
    "💜",
    "🤎",
    "🖤",
    "🤍",
    "❣",
    "💕",
    "💞",
    "💓",
    "💗",
    "💖",
    "💘",
    "💝",
    "💟",
    "💌",
    "🎀",
    "♥",
    "🎆",
  ];
  var random = Math.floor(Math.random() * emoji.length);
  return emoji[random];
}

function bademojis() {
  var emoji = ["😥", "😪", "😫", "😕", "😞", "😱", "💔", "⁉", "⚠"];
  var random = Math.floor(Math.random() * emoji.length);
  return emoji[random];
}

function textpro_links(type) {
  var url;
  var ty = type.includes(" ") === true ? type.split(" ")[0] : type
  type = ty
  if (type == "neon") {
    url = "https://textpro.me/create-glowing-neon-light-text-effect-online-free-1061.html";
  } else if (type == "neon2") {
    url = "https://textpro.me/neon-text-effect-online-963.html";
  } else if (type == "devil") {
    url = "https://textpro.me/create-neon-devil-wings-text-effect-online-free-1014.html";
  } else if (type == "batman") {
    url = "https://textpro.me/make-a-batman-logo-online-free-1066.html";
  } else if (type == "led") {
    url = "https://textpro.me/color-led-display-screen-text-effect-1059.html";
  } else if (type == "love") {
    url = "https://textpro.me/free-advanced-glow-text-effect-873.html";
  } else if (type == "love2") {
    url = "https://textpro.me/create-neon-light-on-brick-wall-online-1062.html";
  } else if (type == "glitch") {
    url = "https://textpro.me/create-impressive-glitch-text-effects-online-1027.html";
  } else if (type == "summer") {
    url = "https://textpro.me/create-a-summer-neon-light-text-effect-online-1076.html";
  } else if (type == "neon3") {
    url = "https://textpro.me/create-light-glow-sliced-text-effect-online-1068.html";
  } else if (type == "sea") {
    url = "https://textpro.me/create-3d-deep-sea-metal-text-effect-online-1053.html";
  } else if (type == "robot") {
    url = "https://textpro.me/create-a-transformer-text-effect-online-1035.html";
  } else if (type == "bp") {
    url = "https://textpro.me/create-neon-light-blackpink-logo-text-effect-online-1081.html"
  } else if (type == "bp2") {
    url = "https://textpro.me/create-a-blackpink-logo-decorated-with-roses-online-free-1080.html"
  } else if (type == "thunder") {
    url = "https://textpro.me/online-thunder-text-effect-generator-1031.html"
  } else if (type == "hp") {
    url = "https://textpro.me/create-harry-potter-text-effect-online-1025.html"
  } else if (type == "bear") {
    url = "https://textpro.me/online-black-and-white-bear-mascot-logo-creation-1012.html"
  } else if (type == "graffiti" || type == "grafiti") {
    url = "https://textpro.me/create-wonderful-graffiti-art-text-effect-1011.html"
  } else if (type == "bp3") {
    url = "https://textpro.me/create-blackpink-logo-style-online-1001.html"
  } else if (type == "neon4") {
    url = "https://textpro.me/neon-light-text-effect-with-galaxy-style-981.html"
  } else if (type == "joker") {
    url = "https://textpro.me/create-logo-joker-online-934.html"
  } else if (type == "lv") {
    url = "https://textpro.me/natural-leaves-text-effect-931.html"
  } else if (type == "fw") {
    url = "https://textpro.me/firework-sparkle-text-effect-930.html"
  } else if (type == "matrix") {
    url = "https://textpro.me/matrix-style-text-effect-online-884.html"
  } else if (type == "neon5") {
    url = "https://textpro.me/neon-text-effect-online-879.html"
  } else {
    url = "";
  }
  return url;
}

function argfinder(text) {
  return text.split(" ")[0];
}

function react(client, type, emoji) {
  var e = "";
  if (type) {
    if (type == "bad") {
      e = bademojis();
    } else if (type == "love") {
      e = dictEmojis();
    }
  } else {
    if (emoji) {
      e = emoji;
    } else {
      e = dictEmojis();
    }
  }
  return reactionMessage = {
    react: {
      text: e,
      key: client.key,
    },
  };
}

function afterarg(text) {
  var payload = "";
  var od = text.split(" ");
  var sh = od.shift();
  if (od.length > 1) {
    od.map((Element) => {
      if (Element !== " ") {
        payload += Element + " ";
      }
    });
  } else {
    payload = od[0];
  }
  if (payload.endsWith(" ")) {
    payload = payload.split("")
    var payload2 = payload.pop()
    payload = payload.join("")
  }
  return payload;
}

function String(text) {
  return text.toString();
}

function dup(a) {
  var seen = {};
  var out = [];
  var len = a.length;
  var j = 0;
  for(var i = 0; i < len; i++) {
       var item = a[i];
       if(seen[item] !== 1) {
             seen[item] = 1;
             out[j++] = item;
       }
  }
  return out;
}

function get_db() {
  var db;
  octokit
    .request("GET /gists/{gist_id}", {
      gist_id: process.env.GITHUB_DB,
    })
    .then(async (d) => {
      db = d.data.files["primon.db.json"].content;
      return JSON.parse(db);
    });
    return JSON.parse(db);
}

async function GetYoutubeInitData (url) {
  var initdata = await {};
  var apiToken = await null;
  var context = await null;
  try {
    const page = await axios.get(encodeURI(url));
    const ytInitData = await page.data.split("var ytInitialData =");
    if (ytInitData && ytInitData.length > 1) {
      const data = await ytInitData[1].split("</script>")[0].slice(0, -1);

      if (page.data.split("innertubeApiKey").length > 0) {
        apiToken = await page.data
          .split("innertubeApiKey")[1]
          .trim()
          .split(",")[0]
          .split('"')[2];
      }

      if (page.data.split("INNERTUBE_CONTEXT").length > 0) {
        context = await JSON.parse(
          page.data.split("INNERTUBE_CONTEXT")[1].trim().slice(2, -2)
        );
      }

      initdata = await JSON.parse(data);
      return await Promise.resolve({ initdata, apiToken, context });
    } else {
      console.error("cannot_get_init_data");
      return await Promise.reject("cannot_get_init_data");
    }
  } catch (ex) {
    await console.error(ex);
    return await Promise.reject(ex);
  }
};

async function GetData (keyword, withPlaylist = false, limit = 0) {
  const endpoint = await `${youtubeEndpoint}/results?search_query=${keyword}`;

  try {
    const page = await GetYoutubeInitData(endpoint);

    const sectionListRenderer = await page.initdata.contents
      .twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer;

    let contToken = await {};

    let items = await [];

    await sectionListRenderer.contents.forEach((content) => {
      if (content.continuationItemRenderer) {
        contToken =
          content.continuationItemRenderer.continuationEndpoint
            .continuationCommand.token;
      } else if (content.itemSectionRenderer) {
        content.itemSectionRenderer.contents.forEach((item) => {
          if (item.channelRenderer) {
            let channelRenderer = item.channelRenderer;
            items.push({
              id: channelRenderer.channelId,
              type: "channel",
              thumbnail: channelRenderer.thumbnail,
              title: channelRenderer.title.simpleText,
            });
          } else {
            let videoRender = item.videoRenderer;
            let playListRender = item.playlistRenderer;

            if (videoRender && videoRender.videoId) {
              items.push(VideoRender(item));
            }
            if (withPlaylist) {
              if (playListRender && playListRender.playlistId) {
                items.push({
                  id: playListRender.playlistId,
                  type: "playlist",
                  thumbnail: playListRender.thumbnails,
                  title: playListRender.title.simpleText,
                  length: playListRender.videoCount,
                  videos: playListRender.videos,
                  videoCount: playListRender.videoCount,
                  isLive: false,
                });
              }
            }
          }
        });
      }
    });
    const apiToken = await page.apiToken;
    const context = await page.context;
    const nextPageContext = await { context: context, continuation: contToken };
    const itemsResult = limit != 0 ? items.slice(0, limit) : items;
    return await Promise.resolve({
      items: itemsResult,
      nextPage: { nextPageToken: apiToken, nextPageContext: nextPageContext },
    });
  } catch (ex) {
    await console.error(ex);
    return await Promise.reject(ex);
  }
};

async function nextPage (nextPage, withPlaylist = false, limit = 0) {
  const endpoint =
    await `${youtubeEndpoint}/youtubei/v1/search?key=${nextPage.nextPageToken}`;
  try {
    const page = await axios.post(
      encodeURI(endpoint),
      nextPage.nextPageContext
    );
    const item1 =
      page.data.onResponseReceivedCommands[0].appendContinuationItemsAction;
    let items = [];
    item1.continuationItems.forEach((conitem) => {
      if (conitem.itemSectionRenderer) {
        conitem.itemSectionRenderer.contents.forEach((item, index) => {
          let videoRender = item.videoRenderer;
          let playListRender = item.playlistRenderer;
          if (videoRender && videoRender.videoId) {
            items.push(VideoRender(item));
          }
          if (withPlaylist) {
            if (playListRender && playListRender.playlistId) {
              items.push({
                id: playListRender.playlistId,
                type: "playlist",
                thumbnail: playListRender.thumbnails,
                title: playListRender.title.simpleText,
                length: playListRender.videoCount,
                videos: GetPlaylistData(playListRender.playlistId),
              });
            }
          }
        });
      } else if (conitem.continuationItemRenderer) {
        nextPage.nextPageContext.continuation =
          conitem.continuationItemRenderer.continuationEndpoint.continuationCommand.token;
      }
    });
    const itemsResult = limit != 0 ? items.slice(0, limit) : items;
    return await Promise.resolve({ items: itemsResult, nextPage: nextPage });
  } catch (ex) {
    await console.error(ex);
    return await Promise.reject(ex);
  }
};

async function GetPlaylistData(playlistId, limit = 0) {
  const endpoint = await `${youtubeEndpoint}/playlist?list=${playlistId}`;
  try {
    const initData = await GetYoutubeInitData(endpoint);
    const sectionListRenderer = await initData.initdata;
    const metadata = await sectionListRenderer.metadata;
    if (sectionListRenderer && sectionListRenderer.contents) {
      const videoItems = await sectionListRenderer.contents
        .twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content
        .sectionListRenderer.contents[0].itemSectionRenderer.contents[0]
        .playlistVideoListRenderer.contents;
      let items = await [];
      await videoItems.forEach((item) => {
        let videoRender = item.playlistVideoRenderer;
        if (videoRender && videoRender.videoId) {
          items.push(VideoRender(item));
        }
      });
      const itemsResult = limit != 0 ? items.slice(0, limit) : items;
      return await Promise.resolve({ items: itemsResult, metadata: metadata });
    } else {
      return await Promise.reject("invalid_playlist");
    }
  } catch (ex) {
    await console.error(ex);
    return await Promise.reject(ex);
  }
};

async function GetSuggestData(limit = 0) {
  const endpoint = await `${youtubeEndpoint}`;
  try {
    const page = await GetYoutubeInitData(endpoint);
    const sectionListRenderer = await page.initdata.contents
      .twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content
      .richGridRenderer.contents;
    let items = await [];
    let otherItems = await [];
    await sectionListRenderer.forEach((item) => {
      if (item.richItemRenderer && item.richItemRenderer.content) {
        let videoRender = item.richItemRenderer.content.videoRenderer;
        if (videoRender && videoRender.videoId) {
          items.push(VideoRender(item.richItemRenderer.content));
        } else {
          otherItems.push(videoRender);
        }
      }
    });
    const itemsResult = limit != 0 ? items.slice(0, limit) : items;
    return await Promise.resolve({ items: itemsResult });
  } catch (ex) {
    await console.error(ex);
    return await Promise.reject(ex);
  }
};

async function GetChannelById(channelId) {
  const endpoint = await `${youtubeEndpoint}/channel/${channelId}`;
  try {
    const page = await GetYoutubeInitData(endpoint);
    const tabs = page.initdata.contents.twoColumnBrowseResultsRenderer.tabs;
    const items = tabs
      .map((json) => {
        if (json && json.tabRenderer) {
          const tabRenderer = json.tabRenderer;
          const title = tabRenderer.title;
          const content = tabRenderer.content;
          return { title, content };
        }
      })
      .filter((y) => typeof y != "undefined");
    return await Promise.resolve(items);
  } catch (ex) {
    return await Promise.reject(ex);
  }
};

async function GetVideoDetails(videoId) {
  const endpoint = await `${youtubeEndpoint}/watch?v=${videoId}`;
  try {
    const page = await GetYoutubeInitData(endpoint);
    const result = await page.initdata.contents.twoColumnWatchNextResults;
    const firstContent = await result.results.results.contents[0]
      .videoPrimaryInfoRenderer;
    const secondContent = await result.results.results.contents[1]
      .videoSecondaryInfoRenderer;
    const res = await {
      title: firstContent.title.runs[0].text,
      isLive: firstContent.viewCount.videoViewCountRenderer.hasOwnProperty(
        "isLive"
      )
        ? firstContent.viewCount.videoViewCountRenderer.isLive
        : false,
      channel: secondContent.owner.videoOwnerRenderer.title.runs[0].text,
      description: secondContent.description.runs
        .map((x) => x.text)
        .join()
        .toString(),
      suggestion: result.secondaryResults.secondaryResults.results
        .filter((y) => y.hasOwnProperty("compactVideoRenderer"))
        .map((x) => compactVideoRenderer(x)),
    };

    return await Promise.resolve(res);
  } catch (ex) {
    return await Promise.reject(ex);
  }
};

async function ytdl(link, downloadFolder) {
  try {
    var h = await axios({
      url: "https://api.onlinevideoconverter.pro/api/convert",
      method: "post",
      data: {
        url: link,
      },
    });

    var downs = [];
    h.data.url.map((Element) => {
      if (Element.downloadable == true && Element.name == "MP4") {
        downs.push(Element.url)
      }
    })
    const response = await axios({
      method: "GET",
      url: downs[0],
      responseType: "arraybuffer",
    });

    fs.appendFileSync(downloadFolder, Buffer.from(response.data));
    return true;
  } catch {
    ytdl(link, downloadFolder)
  }
}

function VideoRender(json) {
  try {
    if (json && (json.videoRenderer || json.playlistVideoRenderer)) {
      let videoRenderer = null;
      if (json.videoRenderer) {
        videoRenderer = json.videoRenderer;
      } else if (json.playlistVideoRenderer) {
        videoRenderer = json.playlistVideoRenderer;
      }
      var isLive = false;
      if (
        videoRenderer.badges &&
        videoRenderer.badges.length > 0 &&
        videoRenderer.badges[0].metadataBadgeRenderer &&
        videoRenderer.badges[0].metadataBadgeRenderer.style ==
          "BADGE_STYLE_TYPE_LIVE_NOW"
      ) {
        isLive = true;
      }
      if (videoRenderer.thumbnailOverlays) {
        videoRenderer.thumbnailOverlays.forEach((item) => {
          if (
            item.thumbnailOverlayTimeStatusRenderer &&
            item.thumbnailOverlayTimeStatusRenderer.style &&
            item.thumbnailOverlayTimeStatusRenderer.style == "LIVE"
          ) {
            isLive = true;
          }
        });
      }
      const id = videoRenderer.videoId;
      const thumbnail = videoRenderer.thumbnail;
      const title = videoRenderer.title.runs[0].text;
      const shortBylineText = videoRenderer.shortBylineText
        ? videoRenderer.shortBylineText
        : "";
      const lengthText = videoRenderer.lengthText
        ? videoRenderer.lengthText
        : "";
      const channelTitle =
        videoRenderer.ownerText && videoRenderer.ownerText.runs
          ? videoRenderer.ownerText.runs[0].text
          : "";
      return {
        id,
        type: "video",
        thumbnail,
        title,
        channelTitle,
        shortBylineText,
        length: lengthText,
        isLive,
      };
    } else {
      return {};
    }
  } catch (ex) {
    throw ex;
  }
};

function compactVideoRenderer(json) {
  const compactVideoRendererJson = json.compactVideoRenderer;

  var isLive = false;
  if (
    compactVideoRendererJson.badges &&
    compactVideoRendererJson.badges.length > 0 &&
    compactVideoRendererJson.badges[0].metadataBadgeRenderer &&
    compactVideoRendererJson.badges[0].metadataBadgeRenderer.style ==
      "BADGE_STYLE_TYPE_LIVE_NOW"
  ) {
    isLive = true;
  }
  const result = {
    id: compactVideoRendererJson.videoId,
    type: "video",
    thumbnail: compactVideoRendererJson.thumbnail.thumbnails,
    title: compactVideoRendererJson.title.simpleText,
    channelTitle: compactVideoRendererJson.shortBylineText.runs[0].text,
    shortBylineText: compactVideoRendererJson.shortBylineText.runs[0].text,
    length: compactVideoRendererJson.lengthText,
    isLive,
  };
  return result;
};

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();
  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0) costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

function test_diff(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (
    (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
  );
}

function cmds(text, arguments = 3, cmd) {
  let payload;
  if (arguments == 3) {
    payload = text
      .replace("{%d1}", cmdlang.command)
      .replace("{%d1}", cmdlang.info)
      .replace("{%d1}", cmdlang.example)
      .replace(/{%c}/gi, cmd);
  } else if (arguments == 4) {
    payload = text
      .replace("{%d1}", cmdlang.command)
      .replace("{%d1}", cmdlang.info)
      .replace("{%d1}", cmdlang.example)
      .replace("{%d1}", cmdlang.danger)
      .replace(/{%c}/gi, cmd);
  } else {
    payload = text
      .replace("{%d1}", cmdlang.command)
      .replace("{%d1}", cmdlang.info)
      .replace("{%d1}", cmdlang.example)
      .replace(/{%c}/gi, cmd);
  }
  return payload;
}

function randombtwtwointegers(min, max) { 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

module.exports = {
  dictEmojis: dictEmojis,
  textpro_links: textpro_links,
  argfinder: argfinder,
  bademojis: bademojis,
  afterarg: afterarg,
  String: String,
  react: react,
  get_db: get_db,
  dup: dup,
  GetListByKeyword: GetData,
  NextPage: nextPage,
  GetPlaylistData: GetPlaylistData,
  GetSuggestData: GetSuggestData,
  GetChannelById: GetChannelById,
  GetVideoDetails: GetVideoDetails,
  randombtwtwointegers: randombtwtwointegers
};
