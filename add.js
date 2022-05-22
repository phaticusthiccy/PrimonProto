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

module.exports = {
  dictEmojis: dictEmojis,
};
