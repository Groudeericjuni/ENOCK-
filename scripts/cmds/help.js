const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "[ 🌐 | 𝑴𝑨𝑫𝑨𝑹𝑨 V2 ]"; // changing this wont change the goatbot V2 of list cmd it is just a decoyy

module.exports = {
  config: {
    name: "help",
    version: "1.17",
    author: "𝗘𝗻𝗼𝗰𝗸", // original author Kshitiz 
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View command usage and list all commands directly",
    },
    longDescription: {
      en: "View command usage and list all commands directly",
    },
    category: "info",
    guide: {
      en: "{pn} / help cmdName ",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);

    if (args.length === 0) {
      const categories = {};
      let msg = "";

      msg += `╔═══════════╗\n     𝑴𝑨𝑫𝑨𝑹𝑨 𝑪𝑴𝑫\n╚═══════════╝`; // replace with your name 

      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;

        const category = value.config.category || "Uncategorized";
        categories[category] = categories[category] || { commands: [] };
        categories[category].commands.push(name);
      }

      Object.keys(categories).forEach((category) => {
        if (category !== "info") {
          msg += `\n╭───────────\n│ 💌『  ${category.toUpperCase()}  』`;


          const names = categories[category].commands.sort();
          for (let i = 0; i < names.length; i += 3) {
            const cmds = names.slice(i, i + 1).map((item) => `🌹${item}🪔`);
            msg += `\n│ ${cmds.join(" ".repeat(Math.max(1, 10 - cmds.join("").length)))}`;
          }

          msg += `\n╰────────────`;
        }
      });

      const totalCommands = commands.size;
      msg += `\n𝒋𝒆 𝒅𝒊𝒔𝒑𝒐𝒔𝒆 𝒅𝒆  ${totalCommands} 𝒄𝒐𝒎𝒎𝒂𝒏𝒅𝒆𝒔\n\n`;
      msg += `💡 Pour voir 𝗹𝗲𝘀 𝗶𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻𝘀 d'une commande spécifique, tapez ${prefix} 𝗵𝗲𝗹𝗽 [𝗻𝗼𝗺 𝗱𝗲 𝗹𝗮 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝗲]' 
 - Ex: $𝗵𝗲𝗹𝗽 𝗮𝗶 

 
 🗂 Pour voir 𝗰𝗼𝗺𝗺𝗲𝗻𝘁 𝘂𝘁𝗶𝗹𝗶𝘀𝗲𝗿 𝘂𝗻𝗲 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝗲, écrivez simplement 𝗹𝗲 𝗻𝗼𝗺 𝗱𝗲 𝗹𝗮 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝗲.
 - Ex: 𝗔𝗶

 🤖 𝗣𝗼𝘂𝗿 𝗮𝘃𝗼𝗶𝗿 𝘃𝗼𝘁𝗿𝗲 𝗽𝗿𝗼𝗽𝗿𝗲 𝗖𝗵𝗮𝘁𝗯𝗼𝘁, 𝗖𝗼𝗻𝘁𝗮𝗰𝘁𝗲𝗿 𝗺𝗼𝗻 𝗺𝗮𝗶̂𝘁𝗿𝗲 :  𝗦𝗲𝗶𝗴𝗻𝗲𝘂𝗿 𝗠𝗮𝗱𝗮𝗿𝗮 𝗨𝗰𝗵𝗶𝘄𝗮💮♨️ \n\n`;
      msg += `🌐 | 𝗘𝗻𝗼𝗰𝗸 V16`; // its not decoy so change it if you want 

      const helpListImages = [
        "https://i.ibb.co/7CZYTQm/image.jpg", // add image link here
                "https://i.ibb.co/7CZYTQm/image.jpg",
        "https://i.ibb.co/7CZYTQm/image.jpg",
        // Add more image links as needed
      ];

      const helpListImage = helpListImages[Math.floor(Math.random() * helpListImages.length)];

      await message.reply({
        body: msg,
        attachment: await global.utils.getStreamFromURL(helpListImage),
      });
    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`Command "${commandName}" not found.`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "Unknown";

        const longDescription = configCommand.longDescription ? configCommand.longDescription.en || "No description" : "No description";

        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);

        const response = `╭── NOM ────⭓
  │ ${configCommand.name}
  ├── INFO
  │ Description: ${longDescription}
  │ Autres noms : ${configCommand.aliases ? configCommand.aliases.join(", ") : "Ne pas avoir"}
  │ Autres noms dans votre groupe : Je n'en ai pas
  │ Version: ${configCommand.version || "1.0"}
  │ Rôle : \n${roleText}
  │ Time per command: ${configCommand.countDown || 1}s
  │ Author: \n${author}
  ├── utilisation
  │ ${usage}
  ├── Notes
  │ The content inside <XXXXX> can be changed
  │ The content inside [a|b|c] is a or b or c
  ╰━━━━━━━🔮`;

        await message.reply(response);
      }
    }
  },
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0:
      return "0 (All users)";
    case 1:
      return "1 (Group administrators)";
    case 2:
      return "2 (Admin bot)";
    default:
      return "Unknown role";
  }
	  }
	
