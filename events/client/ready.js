import { client } from "../../index.js";
class Event {
    constructor() {
        this.name = "ready";
    };

    async run() {
        const commandArray = client.slashCommands;
        console.log(commandArray);
        client.application.commands.set(commandArray);
        client.user.setPresence(client.config.presence);

        client.guilds.cache.forEach(guild => {
            client.database.getPlayer()
                .then(players => {
                    players.forEach(player => {
                        if (!guild.members.cache.get(`${player.user_id}`)) {
                            client.database.remPlayer({id: player.user_id})
                                .then(console.log)
                                .catch(console.error);
                        }
                    });
                    guild.members.cache.forEach(member => {
                        client.database.addPlayer(member.user)
                            .then(console.log)
                            .catch(console.error);
                    });
                })
                .catch(err => {
                    if (String(err).includes("Error 404")) {
                        guild.members.cache.forEach(member => {
                            client.database.addPlayer(member.user)
                                .then(console.log)
                                .catch(console.error);
                        });
                    } else {
                        console.error(err);
                    }
                });
        });
    }
}
export default new Event();