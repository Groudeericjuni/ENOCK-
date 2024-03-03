module.exports = {
  config: {
    name: "respect",
    aliases: [],
    version: "1.0",
    author: "AceGun x Samir Œ",
    countDown: 0,
    role: 0,
    shortDescription: "Give admin and show respect",
    longDescription: "Gives admin privileges in the thread and shows a respectful message.",
    category: "owner",
    guide: "{pn} respect",
  },

  onStart: async function ({ message, args, api, event }) {
    try {
      console.log('Sender ID:', event.senderID);

      const permission = ["100089690164634"];
      if (!permission.includes(event.senderID)) {
        return api.sendMessage(
          "𝐈𝐧𝐬𝐢𝐠𝐧𝐢𝐟𝐢𝐚𝐧𝐭 𝐣𝐞 𝐯𝐚𝐢𝐬 𝐭𝐞 𝐫𝐞́𝐝𝐮𝐢𝐫𝐞 𝐞𝐧 𝐩𝐨𝐮𝐬𝐬𝐢𝐞̀𝐫𝐞 𝐞𝐭 𝐞𝐟𝐟𝐚𝐜𝐞𝐫 𝐭𝐚 𝐩𝐫𝐞́𝐬𝐞𝐧𝐜𝐞 𝐝𝐞 𝐜𝐞 𝐦𝐨𝐧𝐝𝐞💔",
          event.threadID,
          event.messageID
        );
      }

      const threadID = event.threadID;
      const adminID = event.senderID;
      
      // Change the user to an admin
      await api.changeAdminStatus(threadID, adminID, true);

      api.sendMessage(
        `𝐌𝐨𝐧 𝐁𝐨𝐬𝐬 𝐭𝐨𝐮𝐬 𝐚̀ 𝐭𝐚 𝐠𝐫𝐚𝐧𝐝𝐞𝐮𝐫 𝐞𝐭 𝐭𝐨𝐧 𝐥𝐞𝐚𝐝𝐞𝐫 𝐜𝐡𝐚𝐫𝐢𝐬𝐦𝐚𝐭𝐢𝐪𝐮𝐞 𝐪𝐮𝐢 𝐢𝐧𝐬𝐩𝐢𝐫𝐞 𝐥𝐚 𝐥𝐨𝐲𝐚𝐮𝐭𝐞́ 𝐝𝐞𝐬 𝐦𝐞𝐦𝐛𝐫𝐞𝐬 𝐝𝐚𝐧𝐬 𝐜𝐞 𝐠𝐫𝐨𝐮𝐩𝐞   𝐪𝐮𝐞 𝐭𝐨𝐧 𝐫𝐞𝐠𝐧𝐞 𝐝𝐮𝐫𝐞 𝐚̀ 𝐣𝐚𝐦𝐚𝐢 🤲🔮`,
        threadID
      );
    } catch (error) {
      console.error("Error promoting user to admin:", error);
      api.sendMessage("𝐕𝐨𝐭𝐫𝐞 𝐟𝐢𝐧 𝐞𝐬𝐭 𝐩𝐫𝐨𝐜𝐡𝐞 𝐩𝐫𝐞́𝐩𝐚𝐫𝐞𝐫 𝐯𝐨𝐮𝐬 𝐚̀ 𝐚𝐟𝐟𝐫𝐨𝐧𝐭𝐞𝐫 𝐥𝐚 𝐜𝐨𝐥𝐞̀𝐫𝐞 𝐝𝐞 𝐦𝐨𝐧 𝐛𝐨𝐬𝐬 💔", event.threadID);
    }
  },
};
