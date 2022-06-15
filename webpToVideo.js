let formData = require("form-data");
let fs = require("fs");
let axios = require("axios");
let cheerio = require("cheerio");
let baseUrl = "https://ezgif.com";

const imageToBuffer = async (url) => {
  let img = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(img.data, "utf-8");
};

const loadfile = async (file, type, source_format) => {
  file = fs.readFileSync(file);
  let data = new formData();
  data.append("new-image", file, `image.${source_format}`);
  let result = await axios({
    method: "POST",
    url: `${baseUrl}/${type}`,
    data: data,
    headers: data.getHeaders(),
  });
  let $ = cheerio.load(result.data);
  let newUrl = $("form").attr("action");
  return newUrl.includes(".com") ? newUrl : baseUrl + newUrl;
};

const optionProcess = async (newUrl, options) => {
  let data = new formData();
  let file = newUrl.substring(newUrl.lastIndexOf("/") + 1);
  data.append("file", file);
  data.append("start", options.start || 0);
  data.append("end", options.duration || 100);
  data.append("percentage", options.quality || 100);
  data.append("background", options.background || "#ffffff");
  data.append("size", options.size || "original");
  data.append("fps", options.fps || 10);
  data.append("method", options.method || "ffmpeg");
  data.append("diff", options.diff || "off");

  let processOptions = await axios({
    method: "POST",
    url: newUrl,
    data: data,
    headers: data.getHeaders(),
  });

  let cLoad = cheerio.load(processOptions.data);
  let output = cLoad("div#output").html();
  let cOutput = cheerio.load(output);
  return cOutput("a[class=save]").attr("href");
};

const ezgif = async (buffer, type, options) => {
  if (!type) return;
  let cResultData = await loadfile(buffer, type, options.source_format);
  let data = await optionProcess(cResultData, options);
  return imageToBuffer(data);
};

const optionsBuilder = (format, optionsVars) => ({
  source_format: format,
  start: 0,
  end: 100,
  quality: 100,
  background: "#ffffff",
  size: "original",
  fps: 10,
  method: "ffmpeg",
  diff: "off",
  ...optionsVars,
});

module.exports = {
  video_to_webp: (file, options = optionsBuilder("mp4")) =>
    ezgif(
      file,
      "video-to-webp",
      optionsBuilder(options.source_format || "mp4", options)
    ),

  video_to_gif: (file, options = optionsBuilder("mp4")) =>
    ezgif(
      file,
      "video-to-gif",
      optionsBuilder(options.source_format || "mp4", options)
    ),
  gif_to_mp4: (file, options = optionsBuilder("gif")) =>
    ezgif(
      file,
      "gif-to-mp4",
      optionsBuilder(options.source_format || "gif", options)
    ),
  gif_to_webp: (file, options = optionsBuilder("gif")) =>
    ezgif(
      file,
      "gif-to-webp",
      optionsBuilder(options.source_format || "gif", options)
    ),
  jpg_to_webp: (file, options = optionsBuilder("jpg")) =>
    ezgif(
      file,
      "jpg-to-webp",
      optionsBuilder(options.source_format || "jpg", options)
    ),
  png_to_webp: (file, options = optionsBuilder("png")) =>
    ezgif(
      file,
      "png-to-webp",
      optionsBuilder(options.source_format || "png", options)
    ),
  webp_to_png: (file, options = optionsBuilder("webp")) =>
    ezgif(
      file,
      "webp-to-png",
      optionsBuilder(options.source_format || "webp", options)
    ),
  webp_to_jpg: (file, options = optionsBuilder("webp")) =>
    ezgif(
      file,
      "webp-to-jpg",
      optionsBuilder(options.source_format || "webp", options)
    ),
  webp_to_gif: (file, options = optionsBuilder("webp")) =>
    ezgif(
      file,
      "webp-to-gif",
      optionsBuilder(options.source_format || "webp", options)
    ),
  webp_to_mp4: (file, options = optionsBuilder("webp")) =>
    ezgif(
      file,
      "webp-to-mp4",
      optionsBuilder(options.source_format || "webp", options)
    ),
};
