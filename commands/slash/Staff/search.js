const { ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
module.exports = {
    name: "search",
    name_localizations: {
        "en-US": "search",
        "pt-BR": "procurar",
        "es-ES": "buscar",
        "zh-CN": "搜索",
        "ko": "찾다"
    },
    description: "Command to pull up Information",
    defaultMemberPermissions: [PermissionFlagsBits.Administrator],
    options: [
        {
            name: "character",
            name_localizations: {
                "en-US": "character",
                "pt-BR": "personagem",
                "es-ES": "personaje",
                "zh-CN": "特点",
                "ko": "성격"
            },
            description: "Displays Information about a Character",
            description_localizations: {
                "en-US": "Displays Information about a Character",
                "pt-BR": "Exibe informações sobre um personagem",
                "es-ES": "Muestra información sobre un personaje",
                "zh-CN": "显示有关角色的信息",
                "ko": "캐릭터에 대한 정보를 표시합니다"
            },
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "player",
                    name_localizations: {
                        "en-US": "player",
                        "pt-BR": "jogador",
                        "es-ES": "jugador",
                        "zh-CN": "玩家",
                        "ko": "플레이어"
                    },
                    description: "Select a Player",
                    description_localizations: {
                        "en-US": "Select a Player",
                        "pt-BR": "Selecione um jogador",
                        "es-ES": "Selecciona un jugador",
                        "zh-CN": "选择一名球员",
                        "ko": "플레이어 선택"
                    },
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
            ],
        },
        {
            name: "pilot",
            name_localizations: {
                "en-US": "pilot",
                "pt-BR": "piloto",
                "es-ES": "piloto",
                "zh-CN": "飞行员",
                "ko": "조종사"
            },
            description: "Displays Information about a Player\'s pilots",
            description_localizations: {
                "en-US": "Displays Information about a Player\'s pilots",
                "pt-BR": "Exibe informações sobre os pilotos de um jogador",
                "es-ES": "Muestra información sobre los pilotos de un jugador",
                "zh-CN": "显示有关玩家飞行员的信息",
                "ko": "플레이어의 조종사에 대한 정보를 표시합니다"
            },
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "player",
                    name_localizations: {
                        "en-US": "player",
                        "pt-BR": "jogador",
                        "es-ES": "jugador",
                        "zh-CN": "玩家",
                        "ko": "플레이어"
                    },
                    description: "Select a Player",
                    description_localizations: {
                        "en-US": "Select a Player",
                        "pt-BR": "Selecione um jogador",
                        "es-ES": "Selecciona un jugador",
                        "zh-CN": "选择一名球员",
                        "ko": "플레이어 선택"
                    },
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
            ],
        },
    ],

    run: async(client, interaction) => {
        const option = interaction.options;
        const reply = await interaction.deferReply();
        const player = option.getUser("player");
        switch (option.getSubcommand()) {
            case "character":
                client.database.getCharacter(player)
                    .then(async (char) => {
                        await reply.edit({
                            content: `<@${player.id}>\'s Character:`,
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("Aqua")
                                    .setTitle("Character Information")
                                    .addFields(
                                        {
                                            name: "Name",
                                            value: `\`${char.name}\``
                                        },
                                        {
                                            name: "Class",
                                            value: `\`${char.class_name}\``
                                        },
                                        {
                                            name: "Power",
                                            value: `\`${char.power}\``
                                        },
                                        {
                                            name: "Region",
                                            value: `\`${char.region_name}\``
                                        },
                                        {
                                            name: "Clan",
                                            value: `\`${char.clan_name}\``
                                        }
                                    )
                                    .setThumbnail(client.class_icons[char.class_name])
                                    .setImage(client.class_banners[char.class_name])
                                    .setTimestamp()
                                    .setFooter({ text: "by Julexar"})
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
                                        .setDescription("That Player has not registered a Character yet!")
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
            case "pilot":
                client.database.getPilot(player)
                    .then(async (pilots) => {
                        let list = [];
                        for (const pilot of pilots) {
                            list.push(`<@${pilot.id}>`);
                        }
                        await reply.edit({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("Aqua")
                                    .setTitle(`<@${player.id}>\'s Pilots`)
                                    .setDescription(list.join(", "))
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
                                        .setDescription("This Player has not registered any Pilots!")
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
                    })
            return;
        }
    }
};