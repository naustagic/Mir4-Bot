module.exports = {
    name: "ready",
    /**
     * 
     * @param {import("../../index")} client 
     */
    run: (client) => {
        const commandsArray = client.slashCommands;
        client.application.commands.set(commandsArray);
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