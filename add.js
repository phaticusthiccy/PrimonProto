// Primon Proto
// Headless WebSocket, type-safe Whatsapp UserBot
//
// Primon, lisanced under GNU GENERAL PUBLIC LICENSE. May cause some warranity problems, within Priomon.
// Multi-Device Lightweight ES5 Module (can ysable with mjs)
//
// Phaticusthiccy - 2022

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
  var emoji = ["😥", "😪", "😫", "😕", "😞", "😱", "💔", "⁉", "⚠", "❣"];
  var random = Math.floor(Math.random() * emoji.length);
  return emoji[random];
}

function textpro_links(type) {
  var url;
  if (type == "neon") {
    url =
      "https://textpro.me/create-glowing-neon-light-text-effect-online-free-1061.html";
  } else if (type == "neon2") {
    url = "https://textpro.me/neon-text-effect-online-963.html";
  } else if (type == "devil") {
    url =
      "https://textpro.me/create-neon-devil-wings-text-effect-online-free-1014.html";
  } else if (type == "batman") {
    url = "https://textpro.me/make-a-batman-logo-online-free-1066.html";
  } else if (type == "led") {
    url = "https://textpro.me/color-led-display-screen-text-effect-1059.html";
  } else if (type == "love") {
    url = "https://textpro.me/free-advanced-glow-text-effect-873.html";
  } else if (type == "love2") {
    url = "https://textpro.me/create-neon-light-on-brick-wall-online-1062.html";
  } else if (type == "glitch") {
    url =
      "https://textpro.me/create-impressive-glitch-text-effects-online-1027.html";
  } else if (type == "summer") {
    url =
      "https://textpro.me/create-a-summer-neon-light-text-effect-online-1076.html";
  } else if (type == "neon3") {
    url =
      "https://textpro.me/create-light-glow-sliced-text-effect-online-1068.html";
  } else if (type == "sea") {
    url =
      "https://textpro.me/create-3d-deep-sea-metal-text-effect-online-1053.html";
  } else if (type == "robot") {
    url =
      "https://textpro.me/create-a-transformer-text-effect-online-1035.html";
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
  return payload;
}

function String(text) {
  return text.toString();
}

module.exports = {
  dictEmojis: dictEmojis,
  textpro_links: textpro_links,
  argfinder: argfinder,
  bademojis: bademojis,
  afterarg: afterarg,
  String: String,
  react: react
};
