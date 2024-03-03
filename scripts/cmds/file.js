const fs = require('fs');

module.exports = {
  config: {
    name: "file",
    version: "1.0",
    author: "OtinXShiva",
    countDown: 5,
    role: 0,
    shortDescription: "Send bot script",
    longDescription: "Send bot specified file ",
    category: "owner",
    guide: "{pn} file name. Ex: .{pn} filename"
  },

  onStart: async function ({ message, args, api, event }) {
    const permission = ["100089690164634"];
    if (!permission.includes(event.senderID)) {
      return api.sendMessage("𝐁𝐚𝐫𝐭𝐚𝐫 𝐬𝐢 𝐭𝐮 𝐨𝐬𝐞́ 𝐦𝐞 𝐝𝐞𝐦𝐚𝐧𝐝𝐞𝐫 𝐜𝐚 𝐞𝐧𝐜𝐨𝐫𝐞 𝐣𝐞 𝐯𝐚𝐢𝐬 𝐛𝐫𝐢𝐬𝐞𝐫 𝐭𝐨𝐧 𝐞𝐬𝐩𝐫𝐢𝐭 𝐞𝐭 𝐝𝐞́𝐭𝐫𝐮𝐢𝐭 𝐭𝐨𝐧 𝐚̂𝐦𝐞 𝐣𝐮𝐬𝐪𝐮'𝐚̀ 𝐜𝐞 𝐪𝐮'𝐢𝐥 𝐧𝐞 𝐫𝐞𝐬𝐭𝐞 𝐩𝐥𝐮𝐬 𝐫𝐢𝐞𝐧 𝐝𝐞 𝐭𝐨𝐢 💔", event.threadID, event.messageID);
    }
    
    const fileName = args[0];
    if (!fileName) {
      return api.sendMessage("𝚕𝚎 𝚏𝚒𝚌𝚑𝚒𝚎𝚛 ?? ಠωಠ.", event.threadID, event.messageID);
    }

    const filePath = __dirname + `/${fileName}.js`;
    if (!fs.existsSync(filePath)) {
      return api.sendMessage(`𝐃𝐞𝐬𝐨𝐥𝐞́ 𝐛𝐨𝐬𝐬 𝐜𝐞𝐭𝐭𝐞 𝐜𝐦𝐝 𝐧'𝐞𝐱𝐢𝐬𝐭𝐞 𝐩𝐚𝐬 𝐝𝐚𝐧𝐬 𝐦𝐞𝐬 𝐜𝐦𝐝𝐬 [✖]: ${fileName}.js`, event.threadID, event.messageID);
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    api.sendMessage({ body: fileContent }, event.threadID);
  }
};
