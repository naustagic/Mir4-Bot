const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const axios = require("axios");

function getCharacterData(name) {
    return new Promise(async (resolve, reject) => {
        const api_url = "https://api.mir4info.com/v5/search/";
        const result = await axios.get(api_url + name);
        const text = await result.data;
        if (Array.isArray(text)) {
            if (text.length===1) {
                const character = text[0]
                resolve(character);
            } else if (text.length>1) {
                for (const character of text) {
                    character.clan_name = character.clan_name.replace(/[\u0080-\uffff]/g, (char) => '\\u' + ('0000' + char.charCodeAt(0).toString(16)).slice(-4));
                    if (character.match_type == "exact") {
                        resolve(character);
                    }
                }
            }
        } else if (text.error) {
            reject(text.error);
        } else {
            reject(text);
        }
    });
};

module.exports = {
    name: "character",
    name_localizations: {
        "en-US": "character",
        "pt-BR": "personagem",
        "es-ES": "personaje",
        "zh-CN": "特点",
        "ko": "성격"
    },
    description: "Character related Commands",
    options: [
        {
            name: "register",
            name_localizations: {
                "en-US": "register",
                "pt-BR": "registrar",
                "es-ES": "registrarse",
                "zh-CN": "注册",
                "ko": "등록"
            },
            description: "Registers your MIR4 Character",
            description_localizations: {
                "en-US": "Registers your MIR4 Character",
                "pt-BR": "Registrar seu personagem no MIR4",
                "es-ES": "Registrarse tu personaje de MIR4",
                "zh-CN": "注册您的 MIR4 角色",
                "ko": "MIR4 캐릭터 등록"
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
                    description: "Your exact MIR4 Character Name",
                    description_localizations: {
                        "en-US": "Your exact MIR4 Character Name",
                        "pt-BR": "Nome exato do seu personagem no MIR4",
                        "es-ES": "Tu nombre exacto de personaje de MIR4",
                        "zh-CN": "您精确的MIR4角色名称",
                        "ko": "정확한 MIR4 캐릭터 이름"
                    },
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: "level",
                    name_localizations: {
                        "en-US": "level",
                        "pt-BR": "nível",
                        "es-ES": "nivel",
                        "zh-CN": "水平",
                        "ko": "수평"
                    },
                    description: "Your MIR4 Character Level",
                    description_localizations: {
                        "en-US": "Your MIR4 Character Level",
                        "pt-BR": "Seu nível de personagem MIR4",
                        "es-ES": "Tu nivel de personaje de MIR4",
                        "zh-CN": "您的MIR4角色级别",
                        "ko": "MIR4 캐릭터 레벨"
                    },
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                    min_value: 95,
                    max_value: 140
                },
            ],
        },
        {
            name: "show",
            name_localizations: {
                "en-US": "show",
                "pt-BR": "mostrar",
                "es-ES": "espectáculo",
                "zh-CN": "展示",
                "ko": "보여주다"
            },
            description: "Shows a character\'s Information",
            description_localizations: {
                "en-US": "Shows a character\'s Information",
                "pt-BR": "Mostra as informações de um personagem",
                "es-ES": "Muestra la información de un personaje",
                "zh-CN": "显示角色信息",
                "ko": "캐릭터의 정보를 보여줍니다"
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
                    description: "A MIR4 Character Name",
                    description_localizations: {
                        "en-US": "A MIR4 Character Name",
                        "pt-BR": "Um nome de personagem MIR4",
                        "es-ES": "Un nombre de personaje MIR4",
                        "zh-CN": "MIR4 角色名称",
                        "ko": "MIR4 캐릭터 이름"
                    },
                    type: ApplicationCommandOptionType.String,
                },
            ],
        },
    ],

    run: async(client, interaction) => {
        const reply = await interaction.deferReply();
        const option = interaction.options;
        const member = interaction.member;
        const user = member.user;
        const name = option.getString("name");
        const level = option.getInteger("level");
        const server = interaction.guild;
        switch (option.getSubcommand()) {
            case "register":
                let roles = {
                    tower1: "1156764474284449802",
                    tower2: "1156764518991548486",
                    tower3: "1156764561152679966"
                };
                if (!server.roles.cache.find(r => r.name == "Torre 1") && !server.roles.cache.get(roles.tower1)) {
                    const role = await server.roles.create({
                        name: "Torre 1",
                        reason: "Add missing Role: Torre 1"
                    }).catch(console.error);
                    roles.tower1 = role.id;
                }
                if (!server.roles.cache.get(roles.tower2) && !server.roles.cache.get(roles.tower2)) {
                    const role = await server.roles.create({
                        name: "Torre 2",
                        reason: "Add missing Role: Torre 2"
                    }).catch(console.error);
                    roles.tower2 = role.id;
                }
                if (!server.roles.cache.get(roles.tower3) && !server.roles.cache.get(roles.tower3)) {
                    const role = await server.roles.create({
                        name: "Torre 3",
                        reason: "Add missing Role: Torre 3"
                    }).catch(console.error);
                    roles.tower3 = role.id;
                }
                getCharacterData(name)
                    .then(char => {
                        client.database.addCharacter(user, char)
                            .then(async (msg) => {
                                console.log(msg);
                                if (level >= 95 && level <= 120) {
                                    await member.roles.add(roles.tower1);
                                }
                                if (level >= 115 && level <= 130) {
                                    await member.roles.add(roles.tower2);
                                }
                                if (level >= 120 && level <= 140) {
                                    await member.roles.add(roles.tower3)
                                }
                                const class_role = await server.roles.cache.find(r => r.name == `${char.class_name}`);
                                const clan_role = await server.roles.cache.find(r => r.name == `${char.clan_name}`);
                                const server_role = await server.roles.cache.find(r => r.name == `${char.server_name}`);
                                if (!class_role) {
                                    server.roles.create({
                                        name: char.class_name,
                                        reason: `Create missing Role: ${char.class_name}`
                                    })
                                        .then(async (role) => {
                                            await member.roles.add(role.id);
                                        })
                                        .catch(console.error);
                                } else {
                                    await member.roles.add(class_role.id);
                                }
                                if (!clan_role) {
                                    server.roles.create({
                                        name: char.clan_name,
                                        reason: `Create missing Role: ${char.clan_name}`
                                    })
                                        .then(async (role) => {
                                            await member.roles.add(role.id);
                                        })
                                        .catch(console.error);
                                } else {
                                    await member.roles.add(clan_role.id);
                                }
                                if (!server_role) {
                                    server.roles.create({
                                        name: char.server_name,
                                        reason: `Create missing Role: ${char.server_name}`
                                    })
                                        .then(async (role) => {
                                            await member.roles.add(role.id);
                                        })
                                        .catch(console.error);
                                } else {
                                    await member.roles.add(server_role.id);
                                }
                                await member.setNickname(`${char.name}`);
                                await reply.edit({
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
                                                .setDescription("A Character with that Name is already registered!")
                                                .setTimestamp()
                                                .setFooter({ text: "by Julexar"})
                                        ],
                                        ephemeral: true
                                    });
                                } else if (String(err).includes("Error 400")) {
                                    if (String(err).includes("Clan")) {
                                        await reply.edit({
                                            embeds: [
                                                new EmbedBuilder()
                                                    .setColor("Red")
                                                    .setTitle(`${err}`)
                                                    .setDescription("You may not register a Character that is not a member of a Clan in the Alliance!")
                                                    .setTimestamp()
                                                    .setFooter({ text: "by Julexar"})
                                            ],
                                            ephemeral: true
                                        });
                                    } else {
                                        await reply.edit({
                                            embeds: [
                                                new EmbedBuilder()
                                                    .setColor("Red")
                                                    .setTitle(`${err}`)
                                                    .setDescription("You may not register more than one Character!")
                                                    .setTimestamp()
                                                    .setFooter({ text: "by Julexar"})
                                            ],
                                            ephemeral: true
                                        });
                                    }
                                } else {
                                    await reply.edit({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor("Red")
                                                .setTitle("An Error occurred...")
                                                .setDescription(`${err}`)
                                                .setTimestamp()
                                                .setFooter({ text: "by Julexar"})
                                        ],
                                        ephemeral: true
                                    });
                                }
                            });
                    })
                    .catch(async (err) => {
                        console.error(err);
                        await reply.edit({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("Red")
                                    .setDescription(`${err}`)
                                    .setTimestamp()
                                    .setFooter({ text: "by Julexar"})
                            ],
                            ephemeral: true
                        });
                    });
            return;
            case "show":
                if (name) {
                    getCharacterData(name)
                        .then(character => {
                            client.database.getCharacter(null, character)
                                .then(async (char) => {
                                    await reply.edit({
                                        content: `<@${char.user_id}>\'s Character:`,
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
                                        ]
                                    });
                                })
                                .catch(async (err) => {
                                    if (String(err).includes("Error 404")) {
                                        await reply.edit({
                                            embeds: [
                                                new EmbedBuilder()
                                                    .setColor("Red")
                                                    .setTitle(`${err}`)
                                                    .setDescription("No Character with that Name has been registered!")
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
                        })
                        .catch(async (err) => {
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
                        });
                } else {
                    client.database.getCharacter(user)
                        .then(async (char) => {
                            await reply.edit({
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
                                ]
                            });
                        })
                        .catch(async (err) => {
                            if (String(err).includes("Error 404")) {
                                await reply.edit({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor("Red")
                                            .setTitle(`${err}`)
                                            .setDescription("You have not yet registered a Character!")
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
                }
            return;
        }
    }
}