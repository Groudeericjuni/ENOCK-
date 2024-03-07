moment = require('moment-timezone');

module.exports = {
  config: {
    name: "info",
    version: "1.0",
    author: "Rahman Leon",
    role: 0,
    cooldown: 5,
    shortDescription: {
      vi: "",
      en: "Sends information about the bot and admin."
    },
    longDescription: {
      vi: "",
      en: "Sends information about the bot and admin."
    },
    category: "utility",
    guide: {
      en: "{pn}"
    },
    envConfig: {}
  },

  onStart: async function ({ message, prefix }) {
    const botPrefix = prefix; // Use the provided bot prefix
    const authorName = "𝗘𝗡𝗢𝗖𝗞";
    const authorFB = "https://www.facebook.com/profile.php?id=100089690164634";

    const now = moment();
    const date = now.format('MMMM Do YYYY');
    const time = now.format('h:mm:ss A');

    const uptime = process.uptime();
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / (60 * 60)) % 24);
    const days = Math.floor(uptime / (60 * 60 * 24));
    const uptimeString = `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;

    const additionalText = "✨🔮𝑴𝒐𝒏 𝒎𝒂𝒊𝒕𝒓𝒆 𝗦𝗲𝗶𝗴𝗻𝗲𝘂𝗿 𝗠𝗮𝗱𝗮𝗿𝗮 𝗨𝗰𝗵𝗶𝘄𝗮 🔮✨";

    // Combine the bot information and additional text in a single message
    message.reply(`
      ℹ Bot Information:
      🌐 Bot Prefix: ${botPrefix}
      🏆 Owner: ${authorName}
      🔗 Facebook: [${authorName}](${authorFB})
      💠 Date: ${date}
      🛐 Time: ${time}
      🪔 Uptime: ${uptimeString}
      
      ${additionalText}
    `);
  },

  onChat: async function ({ event, message, getLang, prefix }) {
    if (event.body && event.body.toLowerCase() === "info") {
      this.onStart({ message, prefix });
    }
  }
};
