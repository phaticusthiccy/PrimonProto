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
