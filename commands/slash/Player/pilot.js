const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
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
        {
            name: "remove",
            name_localizations: {
                "en-US": "remove",
                "pt-BR": "remover",
                "es-ES": "eliminar",
                "zh-CN": "消除",
                "ko": "제거하다"
            },
            description: "Removes a Pilot",
            description_localizations: {
                "en-US": "Removes a Pilot",
                "pt-BR": "Remove um piloto",
                "es-ES": "Elimina un piloto",
                "zh-CN": "删除飞行员",
                "ko": "조종사를 제거합니다"
            },
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    description: "The pilot to remove",
                    description_localizations: {
                        "en-US": "The pilot to remove",
                        "pt-BR": "O piloto para remover",
                        "es-ES": "El piloto para eliminar",
                        "zh-CN": "试点删除",
                        "ko": "제거할 파일럿"
                    },
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
            ],
        },
    ],

    run: async(client, interaction) => {
        const reply = await interaction.deferReply();
        const member = interaction.member
        const user = member.user;
        const option = interaction.options;
        const pilot = option.getUser("user");
        switch (option.getSubcommand()) {
            case "add":
                client.database.getCharacter(user)
                    .then(chars => {
                        const char = chars[0];
                        client.database.addPilot(user, pilot, char)
                            .then(async (msg) => {
                                const pilotmember = interaction.guild.members.cache.get(pilot.id);
                                pilotmember.setNickname(`[Pilot] ${user.displayName}`, "Registered Pilot");
                                await reply.edit({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor("Green")
                                            .setDescription(`${msg}`)
                                            .setTimestamp()
                                            .setFooter({ text: "by Julexar" })
                                    ],
                                    ephemeral: true
                                });
                            })
                            .catch(async (err) => {
                                if (String(err).includes("Error 409")) {
                                    //Trigger if the Player has a Pilot in the Database
                                    await reply.edit({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor("Red")
                                                .setTitle(`${err}`)
                                                .setDescription("You already registered a Pilot!")
                                                .setTimestamp()
                                                .setFooter({ text: "by Julexar" })
                                        ],
                                        ephemeral: true
                                    });
                                } else if (String(err).includes("Error 404") && String(err).includes("Character")) {
                                    //Trigger if the Character could not be found in the Database
                                    await reply.edit({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor("Red")
                                                .setTitle(`${err}`)
                                                .setDescription("Could not find a registered Character in the Database. Make sure to use \`/register\` before you use this Command!")
                                                .setTimestamp()
                                                .setFooter({ text: "by Julexar" })
                                        ],
                                        ephemeral: true
                                    });
                                } else if (String(err).includes("Error 400")) {
                                    //Trigger if the Pilot has a registerd Character
                                    await reply.edit({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor("Red")
                                                .setTitle(`${err}`)
                                                .setDescription("You may not choose a User that has a registered Character!")
                                                .setTimestamp()
                                                .setFooter({ text: "by Julexar" })
                                        ]
                                    })
                                } else {
                                    //Trigger if a Database error occurred
                                    await reply.edit({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor("Red")
                                                .setTitle("An Error occurred...")
                                                .setDescription(`${err}`)
                                                .setTimestamp()
                                                .setFooter({ text: "by Julexar" })
                                        ],
                                        ephemeral: true
                                    });
                                }
                            });
                    })
                    .catch(async (err) => {
                        if (String(err).includes("Error 404")) {
                            await reply.edit({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor("Red")
                                        .setTitle(`${err}`)
                                        .setDescription("Could not find a registered Character in the Database. Make sure to use \`/register\` before you use this Command!")
                                        .setTimestamp()
                                        .setFooter({ text: "by Julexar" })
                                ],
                                ephemeral: true
                            });
                        } else {
                            await reply.edit({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor("Red")
                                        .setTitle("An Error occurred...")
                                        .setDescription(`${err}`)
                                        .setTimestamp()
                                        .setFooter({ text: "by Julexar" })
                                ],
                                ephemeral: true
                            });
                        }
                    });
            return;
            case "remove":
                client.database.remPilot(user, pilot)
                    .then(async (msg) => {
                        console.log(msg);
                        const pilotmember = interaction.guild.members.cache.get(pilot.id);
                        await pilotmember.setNickname(`${pilotmember.user.displayName}`, "Removed pilot");
                        await reply.edit({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("Green")
                                    .setDescription(`${msg}`)
                                    .setTimestamp()
                                    .setFooter({ text: "by Julexar" })
                            ],
                            ephemeral: true
                        });
                    })
                    .catch(async (err) => {
                        console.error(err);
                        if (String(err).includes("Error 404")) {
                            await reply.edit({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor("Red")
                                        .setTitle(`${err}`)
                                        .setDescription("Could not find that Pilot in the Database!")
                                        .setTimestamp()
                                        .setFooter({ text: "by Julexar" })
                                ],
                                ephemeral: true
                            });
                        } else {
                            await reply.edit({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor("Red")
                                        .setTitle("An Error occurred...")
                                        .setDescription(`${err}`)
                                        .setTimestamp()
                                        .setFooter({ text: "by Julexar" })
                                ],
                                ephemeral: true
                            });
                        }
                    });
            return;
        }
    },
};