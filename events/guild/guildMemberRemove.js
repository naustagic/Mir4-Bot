module.exports = {
    name: "guildMemberRemove",
    nick: "memberLeave",
    /**
     * 
     * @param {import("discord.js").GuildMember} member 
     * @param {import("../../index")} client
     */
    run: async (member, client) => {
        client.database.remPlayer(member.user)
            .then(console.log)
            .catch(console.error);
    },
};