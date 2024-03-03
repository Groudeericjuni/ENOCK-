module.exports = {
  config: {
    name: "antiout",
    version: "1.0",
    author: "AceGun",
    countDown: 5,
    role: 0,
    shortDescription: "Enable or disable antiout",
    longDescription: "",
    category: "boxchat",
    guide: "{pn} {{[on | off]}}",
    envConfig: {
      deltaNext: 5
    }
  },
  onStart: async function({ message, event, threadsData, args }) {
    let antiout = await threadsData.get(event.threadID, "settings.antiout");
    if (antiout === undefined) {
      await threadsData.set(event.threadID, true, "settings.antiout");
      antiout = true;
    }
    if (!["on", "off"].includes(args[0])) {
      return message.reply("cmd: 𝑨𝑵𝑻𝑰𝑶𝑼𝑻\nVeuillez utiliser 'on ' ou ' off ' comme argument");
    }
    await threadsData.set(event.threadID, args[0] === "on", "settings.antiout");
    return message.reply(`cmd: 𝑨𝑵𝑻𝑰𝑶𝑼𝑻\n\n 𝑬𝑻𝑨𝑻: =>${args[0] === "on" ? "𝒂𝒄𝒕𝒊𝒗𝒆𝒓" : "𝒅𝒆́𝒔𝒂𝒄𝒕𝒊𝒗𝒆𝒓"}.`);
  },
  onEvent: async function({ api, event, threadsData }) {
    const antiout = await threadsData.get(event.threadID, "settings.antiout");
    if (antiout && event.logMessageData && event.logMessageData.leftParticipantFbId) {
      // A user has left the chat, get their user ID
      const userId = event.logMessageData.leftParticipantFbId;

      // Check if the user is still in the chat
      const threadInfo = await api.getThreadInfo(event.threadID);
      const userIndex = threadInfo.participantIDs.indexOf(userId);
      if (userIndex === -1) {
        // The user is not in the chat, add them back
        const addUser = await api.addUserToGroup(userId, event.threadID);
        if (addUser) {
          console.log(`cmd:𝑨𝑵𝑻𝑰𝑶𝑼𝑻\n\nL'utilisateur ${userId} a été rajouté au chat.`);
        } else {
          console.log(`cmd:𝑨𝑵𝑻𝑰𝑶𝑼𝑻\n\n 𝒆𝒄𝒉𝒆𝒄 𝒅𝒆 𝒍'𝒂𝒋𝒐𝒖𝒕 𝒅𝒖 𝒔𝒉𝒊𝒏𝒐𝒃𝒊 ${userId} 𝒂̀ 𝒍'𝒐𝒓𝒈𝒂𝒏𝒊𝒔𝒂𝒕𝒊𝒐𝒏.`);
        }
      }
    }
  }
};
      
