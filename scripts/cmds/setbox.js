this.config = {
	name: "setbox",
	version: "1.0.1",
	author: {
		name: "NTKhang",
		contacts: ""
	},
	cooldowns: 5,
	role: 0,
	shortDescription: "Chỉnh sửa nhóm của bạn",
	longDescription: "Chỉnh sửa nhóm của bạn",
	category: "box chat",
	guide: "{p}{n} [name|emoji|avatar] <nội dung chỉnh sửa>"
		+ "\nChi tiết:"
		+ "\n {p}{n} name <tên mới>: đổi tên nhóm chat"
		+ "\n {p}{n} emoji <emoji mới>: đổi emoji nhóm"
		+ "\n {p}{n} avatar <link ảnh hoặc reply một ảnh hoặc gửi kèm 1 ảnh>: đổi avatar nhóm chat"
};

module.exports = {
	config: this.config,
	start: async function ({ message, api, event, args, threadsData, download }) {
		const fs = require("fs-extra");
		const axios = require("axios");

		if (args[0] == "name") {
			const newName = args.slice(1).join(" ");
			api.setTitle(newName, event.threadID, async function (err) {
				if (err) return message.reply("Rất tiếc, đã xảy ra lỗi");
				message.reply("Đã đổi tên nhóm thành: " + newName);
				await threadsData.setData(event.threadID, {
					name: newName
				});
			});
		}
		else if (args[0] == "emoji") {
