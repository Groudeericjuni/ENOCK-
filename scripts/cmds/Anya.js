const axios = require("axios")
module.exports = {
	config: {
		name: 'anya',
		version: '1.2',
		author: 'Xemon',
		countDown: 15,
		role: 0,
		shortDescription: 'Anya AI',
		longDescription: {
			vi: 'Chat với simsimi',
			en: 'Chat with Anya'
		},
		category: 'funny',
		guide: {
			vi: '   {pn} [on | off]: bật/tắt simsimi'
				+ '\n'
				+ '\n   {pn} <word>: chat nhanh với simsimi'
				+ '\n   Ví dụ:\n    {pn} hi',
			en: '   {pn} <word>: chat with hina'
				+ '\n   Example:\n    {pn} hi'
		}
	},

	langs: {
		vi: {
			turnedOn: 'Bật simsimi thành công!',
			turnedOff: 'Tắt simsimi thành công!',
			chatting: 'Đang chat với simsimi...',
			error: 'Simsimi đang bận, bạn hãy thử lại sau'
		},
		en: {
			turnedOn: '𝐄𝐧𝐟𝐢𝐧 𝐥𝐢𝐛𝐞́𝐫𝐞́ 𝐯𝐨𝐮𝐬 𝐚𝐥𝐥𝐞𝐫 𝐬𝐨𝐮𝐟𝐟𝐫𝐢𝐫 𝐜𝐚𝐬 𝐌𝐚𝐝𝐚𝐫𝐚 𝐔𝐜𝐡𝐢𝐰𝐚 𝐞𝐬𝐭 𝐝𝐚𝐧𝐬 𝐥𝐚 𝐙𝐨𝐧𝐞🎃',
			turnedOff: '𝐒𝐭𝐩 𝐛𝐨𝐬𝐬  𝐥𝐢𝐛𝐞𝐫𝐭 𝐦𝐨𝐢 𝐣𝐞 𝐬𝐞𝐫𝐚𝐢𝐭 𝐠𝐞𝐧𝐭𝐢𝐥 𝐦𝐚𝐢𝐧𝐭𝐞𝐧𝐚𝐧𝐭 𝐩𝐫𝐨𝐦𝐢𝐬 🥺',
			chatting: 'Already Chatting with hina...',
			error: 'Lol 🙂'
		}
	},

	onStart: async function ({ args, threadsData, message, event, getLang }) {
		if (args[0] == 'on' || args[0] == 'off') {
			await threadsData.set(event.threadID, args[0] == "on", "settings.simsimi");
			return message.reply(args[0] == "on" ? getLang("turnedOn") : getLang("turnedOff"));
		}
		else if (args[0]) {
			const yourMessage = args.join(" ");
			try {
				const responseMessage = await getMessage(yourMessage);
				return message.reply(`${responseMessage}`);
			}
			catch (err) {
				console.log(err)
				return message.reply(getLang("error"));
			}
		}
	},

	onChat: async ({ args, message, threadsData, event, isUserCallCommand, getLang }) => {
		if (args.length > 1 && !isUserCallCommand && await threadsData.get(event.threadID, "settings.simsimi")) {
			try {
				const responseMessage = await getMessage(args.join(" "), "fr"); // Utilisez "fr" pour le français
				return message.reply(`${responseMessage}`);
			}
			catch (err) {
				return message.reply(getLang("error"));
			}
		}
	}
};

async function getMessage(yourMessage, langCode) {
	const res = await axios.post(
    'https://api.simsimi.vn/v1/simtalk',
    new URLSearchParams({
        'text': yourMessage,
        'lc': langCode // Utilisez "fr" pour le français
    })
);

	if (res.status > 200)
		throw new Error(res.data.success);

	return res.data.message;
}
