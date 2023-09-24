import { client } from "../../index.js";
class Event {
    constructor() {
        this.name = "ready";
    };

    async run() {
        const commandArray = client.slashCommands;
        client.application.commands.set(commandArray);
        client.user.setPresence(client.config.presence);
    }
}
export default new Event();