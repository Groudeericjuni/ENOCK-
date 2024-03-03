const axios = require('axios');

const Prefixes = [
  '/ai',
  'Salut',
  'nemoo',
  '+ai',
  'Wendy',
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
        await message.reply("𝗦𝗮𝗹𝘂𝘁 𝗷𝗲𝘂𝗻𝗲(𝗲) 𝗡𝗶𝗻𝗷𝗮 𝗺𝗼𝗻 𝗺𝗮𝗶̂𝘁𝗿𝗲 𝘀𝗲𝗶𝗴𝗻𝗲𝘂𝗿 𝗺𝗮𝗱𝗮𝗿𝗮 𝗺'𝗮 𝗽𝗿𝗼𝗴𝗿𝗮𝗺𝗺𝗲́ 𝗽𝗼𝘂𝗿 𝘁'𝗮𝗶𝗱𝗲𝗿 𝗮𝘃𝗲𝗰 𝘁𝗼𝘂𝘁 𝘁𝗲𝘀 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻𝘀,🔮 𝗟𝗲 𝗿𝗶𝗻𝗻𝗴𝗮𝗻 𝗲́𝘁𝗮𝗻𝘁 𝘂𝗻𝗲 𝘁𝗲𝗰𝗵𝗻𝗶𝗾𝘂𝗲 𝗼𝗰𝘂𝗹𝗮𝗶𝗿𝗲 𝘀𝘁𝗼𝗰𝗸 𝗺𝗮 𝘀𝗮𝗴𝗲𝘀𝘀𝗲🔮");
        return;
      }


      const response = await axios.get(`https://sandipbaruwal.onrender.com/gpt?prompt=${encodeURIComponent(prompt)}`);
      const answer = response.data.answer;

 
    await message.reply(answer);

    } catch (error) {
      console.error("Error:", error.message);
    }
  }
};
