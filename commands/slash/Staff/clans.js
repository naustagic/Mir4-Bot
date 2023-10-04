const { ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
module.exports = {
    name: "clans",
    name_localizations: {
        "en-US": "clans",
        "pt-BR": "clãs",
        "es-ES": "clanes",
        "zh-CN": "氏族",
        "ko": "씨족"
    },
    description: "Clan related Commands",
    defaultMemberPermissions: [PermissionFlagsBits.Administrator],
    options: [
        {
            name: "view",
            name_localizations: {
                "en-US": "view",
                "pt-BR": "ver",
                "es-ES": "ver",
                "zh-CN": "看",
                "ko": "보기"
            },
            description: "Shows Information about a Clan",
            description_localization: {
                "en-US": "Shows Information about a Clan",
                "pt-BR": "Mostra informações sobre um clã",
                "es-ES": "Muestra información sobre un clan",
                "zh-CN": "显示有关部落的信息",
                "ko": "클랜에 대한 정보를 표시합니다"
            },
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "name",
                    name_localizations: {
                        "en-US": "name",
                        "pt-BR": "nome",
                        "es-ES": "nombre",
                        "zh-CN": "名称",
                        "ko": "이름"
                    },
                    description: "The Clan\'s exact Name",
                    description_localization: {
                        "en-US": "The Clan\'s exact Name",
                        "pt-BR": "O nome exato do clã",
                        "es-ES": "El nombre exacto del clan",
                        "zh-CN": "氏族的确切名称",
                        "ko": "클랜의 정확한 이름"
                    },
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        },
        {
            name: "add",
            name_localizations: {
                "en-US": "add",
                "pt-BR": "adicionar",
                "es-ES": "agregar",
                "zh-CN": "添加",
                "ko": "추가하다"
            },
            description: "Adds a Clan to the Database",
            description_localization: {
                "en-US": "Adds a Clan to the Database",
                "pt-BR": "Adiciona um clã ao banco de dados",
                "es-ES": "Agrega un clan a la base de datos",
                "zh-CN": "将部落添加到数据库",
                "ko": "데이터베이스에 클랜을 추가합니다"
            },
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "name",
                    name_localizations: {
                        "en-US": "name",
                        "pt-BR": "nome",
                        "es-ES": "nombre",
                        "zh-CN": "名称",
                        "ko": "이름"
                    },
                    description: "The Clan\'s exact Name",
                    description_localization: {
                        "en-US": "The Clan\'s exact Name",
                        "pt-BR": "O nome exato do clã",
                        "es-ES": "El nombre exacto del clan",
                        "zh-CN": "氏族的确切名称",
                        "ko": "클랜의 정확한 이름"
                    },
                    type: ApplicationCommandOptionType.String,
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
            description: "Removes a Clan from the Database",
            description_localization: {
                "en-US": "Removes a Clan from the Database",
                "pt-BR": "Remove um clã do banco de dados",
                "es-ES": "Elimina un clan de la base de datos",
                "zh-CN": "从数据库中删除部落",
                "ko": "데이터베이스에서 클랜을 제거합니다"
            },
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "name",
                    name_localizations: {
                        "en-US": "name",
                        "pt-BR": "nome",
                        "es-ES": "nombre",
                        "zh-CN": "名称",
                        "ko": "이름"
                    },
                    description: "The Clan\'s exact Name",
                    description_localization: {
                        "en-US": "The Clan\'s exact Name",
                        "pt-BR": "O nome exato do clã",
                        "es-ES": "El nombre exacto del clan",
                        "zh-CN": "氏族的确切名称",
                        "ko": "클랜의 정확한 이름"
                    },
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        },
    ],

    run: async(client, interaction) => {
        const reply = await interaction.deferReply();
        const option = interaction.options;
        const opclan = {
            name: option.getString("name")
        };
        switch (option.getSubcommand()) {
            case "view":
                client.database.getClan(opclan)
                    .then(clan => {
                        client.database.getClanMembers(clan)
                            .then(async (res) => {
                                await reply.edit({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor("Aqua")
                                            .setTitle("Clan Information")
                                            .addFields(
                                                {
                                                    name: "Name",
                                                    value: `\`${clan.name}\``
                                                },
                                                {
                                                    name: "Members",
                                                    value: `\`${res}\``
                                                },
                                            )
                                            .setTimestamp()
                                            .setFooter({ text: "by Julexar" })
                                    ]
                                });
                            })
                            .catch(async (err) => {
                                console.error(err);
                                if (String(err).includes("Error 404")) {
                                    await reply.edit({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor("Aqua")
                                                .setTitle("Clan Information")
                                                .addFields(
                                                    {
                                                        name: "Name",
                                                        value: `\`${clan.name}\``
                                                    },
                                                    {
                                                        name: "Members",
                                                        value: `\`0\``
                                                    },
                                                )
                                                .setTimestamp()
                                                .setFooter({ text: "by Julexar" })
                                        ]
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
                                    })
                                }
                            })
                    })
                    .catch(async (err) => {
                        console.error(err);
                        if (String(err).includes("Error 404")) {
                            await reply.edit({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor("Red")
                                        .setTitle(`${err}`)
                                        .setDescription("Could not find a Clan with that Name in the Database!")
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
            case "add":
                client.database.addClan(opclan)
                    .then(async (msg) => {
                        console.log(msg);
                        await reply.edit({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("Green")
                                    .setDescription(`${msg}`)
                                    .setTimestamp()
                                    .setFooter({ text: "by Julexar" })
                            ]
                        });
                    })
                    .catch(async (err) => {
                        console.error(err);
                        if (String(err).includes("Error 409")) {
                            await reply.edit({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor("Red")
                                        .setTitle(`${err}`)
                                        .setDescription("This Clan already exists in the Database!")
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
            case "remove":
                client.database.remClan(opclan)
                    .then(async (msg) => {
                        console.log(msg);
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
                                        .setDescription("A Clan with that Name could not be found!")
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
                                        .setFields({ text: "by Julexar" })
                                ],
                                ephemeral: true
                            });
                        }
                    });
            return;
        }
    },
};