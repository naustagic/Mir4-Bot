import { Client, Collection, GatewayIntentBits } from "discord.js";
import { config } from "../../config.js";
import { psql } from "../../database/psql.js";
class DiscordClient extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });

        this.slashCommands = new Collection();

        this.config = config;
        this.database = psql;
    };

    async start() {
        ["events", "slashCommands"].forEach(async (handler) => {
            const module = await import(`../handlers/${handler}.js`);
            module.default.run();
        });

        this.login(this.config.token);
    };
};
export { DiscordClient };