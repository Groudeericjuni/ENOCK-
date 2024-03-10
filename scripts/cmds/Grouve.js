const fs = require('fs');
module.exports = {
  config: {
    name: "Groove",
    version: "1",
    author: "Enock",
    countDown: 5,
    role: 0,
    shortDescription: "𝗚𝗿𝗼𝘂𝘃𝗲 𝗱𝗲𝘀 𝘂𝗰𝗵𝗶𝘄𝗮 🩸🔞",
    longDescription: "no prefix",
    category: "no prefix",
  },
  onStart: async function(){},
  onChat: async function({ event, message, getLang }) {
    if (event.body && event.body.toLowerCase() === "aesther") {
      return message.reply({
        body: "ur Time is 𝗨𝗣 my Time is 𝗡𝗢𝗪✨",
        attachment: fs.createReadStream("cena.mp3"),
      });
    }
  }
};
