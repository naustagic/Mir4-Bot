module.exports = {
    name: "pilot",
    description: "Pilot related Commands",
    options: [
        {
            name: "add",
            description: "Designate a Pilot for your Character",
            description_localizations: {
                "en-US": "Designate a Pilot for your character",
                "pt-BR": "Designar um Piloto para seu personagem",
                "es-ES": "Designar un Piloto para tu personaje",
                "zh-CN": "为您的角色指定飞行员",
                "ko": "캐릭터에 대한 파일럿 지정"
            },
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    description: "The pilot to add",
                    description_localizations: {
                        "en-US": "The pilot to add",
                        "pt-BR": "O piloto para adicionar",
                        "es-ES": "El piloto para agregar",
                        "zh-CN": "要添加的飞行员",
                        "ko": "추가 할 파일럿"
                    },
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
            ],
        },
    ],

    run: async(client, interaction) => {
        const member = interaction.member
        const user = member.user;
        const option = interaction.options;
        const pilot = option.getUser("pilot");
        switch (option.getSubcommand()) {
            case "add":
                client.database.getCharacter(user)
                    .then(chars => {
                        const char = chars[0];
                        client.database.addPilot(user, pilot, char)
                            .then(async (msg) => {
                                const pilotmember = interaction.guild.members.cache.get(pilot.id);
                                await pilotmember.setNickname(`[Pilot] ${user.displayName}`);
                                await interaction.reply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor("Green")
                                            .setDescription(`${msg}`)
                                            .setTimestamp()
                                    ],
                                    ephemeral: true
                                });
                            })
                            .catch(async (err) => {
                                if (String(err).includes("Error 409")) {
                                    //Trigger if the Player has a Pilot in the Database
                                    await interaction.reply({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor("Red")
                                                .setTitle(`${err}`)
                                                .setDescription("You already registered a Pilot!")
                                                .setTimestamp()
                                        ],
                                        ephemeral: true
                                    });
                                } else if (String(err).includes("Error 404") && String(err).includes("Character")) {
                                    //Trigger if the Character could not be found in the Database
                                    await interaction.reply({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor("Red")
                                                .setTitle(`${err}`)
                                                .setDescription("Could not find a registered Character in the Database. Make sure to use \`/register\` before you use this Command!")
                                                .setTimestamp()
                                        ],
                                        ephemeral: true
                                    });
                                } else {
                                    //Trigger if a Database error occurred
                                    await interaction.reply({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor("Red")
                                                .setTitle("An Error occurred...")
                                                .setDescription(`${err}`)
                                                .setTimestamp()
                                        ],
                                        ephemeral: true
                                    });
                                }
                            });
                    })
                    .catch(async (err) => {
                        if (String(err).includes("Error 404")) {
                            await interaction.reply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor("Red")
                                        .setTitle(`${err}`)
                                        .setDescription("Could not find a registered Character in the Database. Make sure to use \`/register\` before you use this Command!")
                                        .setTimestamp()
                                ],
                                ephemeral: true
                            });
                        } else {
                            await interaction.reply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor("Red")
                                        .setTitle("An Error occurred...")
                                        .setDescription(`${err}`)
                                        .setTimestamp()
                                ],
                                ephemeral: true
                            });
                        }
                    });
            return;
            case "remove":
                client.database.remPilot(user, pilot)
                    .then(async (msg) => {
                        await interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("Green")
                                    .setDescription(`${msg}`)
                                    .setTimestamp()
                            ],
                            ephemeral: true
                        });
                    })
                    .catch(async (err) => {
                        if (String(err).includes("Error 404")) {
                            await interaction.reply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor("Red")
                                        .setTitle(`${err}`)
                                        .setDescription("Could not find that Pilot in the Database!")
                                        .setTimestamp()
                                ],
                                ephemeral: true
                            });
                        } else {
                            await interaction.reply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor("Red")
                                        .setTitle("An Error occurred...")
                                        .setDescription(`${err}`)
                                        .setTimestamp()
                                ],
                                ephemeral: true
                            });
                        }
                    });
            return;
        }
    },
};