module.exports = {
    config: {
        name: "salut",
        version: "1.0",
        author: "kivv",
        countDown: 5,
        role: 0,
        shortDescription: "No Prefix",
        longDescription: "No Prefix",
        category: "reply",
    },
onStart: async function(){}, 
onChat: async function({
    event,
    message,
    getLang
}) {
    if (event.body && event.body.toLowerCase() == "salut") return message.reply("𝗦𝗮𝗹𝘂𝘁 𝗷𝗲𝘂𝗻𝗲(𝗲) 𝗡𝗶𝗻𝗷𝗮, 𝗾𝘂𝗲 𝗽𝘂𝗶𝘀-𝗷𝗲 𝗳𝗮𝗶𝘀 𝗽𝗼𝘂𝗿 𝘁𝗼𝗶 𝗮𝘂𝗷𝗼𝘂𝗿𝗱'𝗵𝘂𝗶❔🔮");
}
};
