const DiscordClient = require("./structures/lib/DiscordClient");
const client = new DiscordClient();

client.start();
console.log("Client started!");

module.exports = client;