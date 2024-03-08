const axios = require('axios');

const Prefixes = [
  '/ai',
  'kim',
  'Nemo',
  '+ai',
  'nemo',
  'ai',
  'ask',
'madara',
];

module.exports = {
  config: {
    name: "ask",
    version: 1.0,
    author: "OtinXSandip",
    longDescription: "AI",
    category: "ai",
    guide: {
      en: "{p} questions",
    },
  },
  onStart: async function () {},
  onChat: async function ({ api, event, args, message }) {
    try {
      
      const prefix = Prefixes.find((p) => event.body && event.body.toLowerCase().startsWith(p));
      if (!prefix) {
        return; // Invalid prefix, ignore the command
      }
      const prompt = event.body.substring(prefix.length).trim();
   if (!prompt) {
        await message.reply("𝗦𝗮𝗹𝘂𝘁 𝗺𝗼𝗶 𝗰'𝗲𝘀𝘁 𝗠𝗮𝗱𝗮𝗿𝗮 𝘂𝗰𝗵𝗶𝘄𝗮 𝗷𝗲 𝘀𝘂𝗶𝘀 𝗹𝗮 𝗽𝗼𝘂𝗿 𝗿𝗲́𝗽𝗼𝗻𝗱 𝗮̀ 𝘁𝗼𝘂𝘁 𝘁𝗲𝘀 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻🧖🛀");
        return;
      }


      const response = await axios.get(`https://sandipbaruwal.onrender.com/gpt?prompt=${encodeURIComponent(prompt)}`);
      const answer = response.data.answer;

 
    await message.reply({ body: `✦𝑺𝒆𝒊𝒈𝒏𝒆𝒖𝒓♥︎ 𝗠𝗔𝗗𝗔𝗥𝗔☆     💌𝗘𝗡𝗢𝗖𝗞 𝑷𝒓𝒐𝒅𝒖𝒄𝒕𝒊𝒐𝒏✦ 
━━━━━━━━━━━━━        
${answer}
𝑬𝒏𝒐𝒄𝒌 𝒍𝒆 𝒑𝒆𝒕𝒓𝒐𝒍𝒊𝒆𝒓 💌💌☆✦☆`,
});

   } catch (error) {
      console.error("Error:", error.message);
    }
  }
};
