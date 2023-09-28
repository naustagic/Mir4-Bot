const { Client, Collection, GatewayIntentBits } = require("discord.js");
class DiscordClient extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.MessageContent
            ]
        });

        this.slashCommands = new Collection();
        this.config = require("../../config");
        this.database = require("../../database/psql");
    }

    start() {
        ["events", "slashCommands"].forEach(handler => {
            require(`../handlers/${handler}`)(this)
        });

        this.login(this.config.token);
    }
}
module.exports = DiscordClient;