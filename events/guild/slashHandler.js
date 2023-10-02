const { EmbedBuilder } = require("discord.js");
module.exports = {
    name: "interactionCreate",
    nick: "Slash",
    /**
     * 
     * @param {import("discord.js").CommandInteraction} interaction 
     * @param {import("../../index")} client 
     */
    run: async(interaction, client) => {
        if (interaction.isChatInputCommand()) {
            const command = client.slashCommands.get(interaction.commandName);
            if (!command) {
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setTitle("Error 404: Command not found")
                            .setDescription("This Command doesn\'t exit within the Bot\'s files, please contact the Developer about this Issue.")
                            .setTimestamp()
                    ],
                    ephemeral: true
                });
            } else {
                if (command.permissions) {
                    if (command.permissions.bot && command.permissions.bot.length && !interaction.channel.permissionsFor(interaction.guild.me).has(command.permissions.bot)) {
                        const perms = interaction.channel.permissionsFor(interaction.guild.me).missing(command.permissions.bot);
                        return await interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("Red")
                                    .setTitle("Error 403: Bot missing Permission")
                                    .setDescription(`The Bot is missing the Permissions needed to run this command:\n${perms.join(", ")}`)
                                    .setTimestamp()
                            ],
                            ephemeral: true
                        });
                    }
                }
                command.run(client, interaction);
            }
        }
    },
};