const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

function getCharacterData(name) {
    return new Promise(async (resolve, reject) => {
        const api_url = "https://api.mir4info.com/v5/search/";
        const result = await fetch(api_url + name);
        const text = await result.text();
        const char = JSON.parse(text);
        if (char.isArray()) {
            if (char.length===1) {
                resolve(char[0]);
            } else if (char.length>1) {
                for (const character of char) {
                    if (character.match_type=="exact") {
                        resolve(character);
                    }
                }
            }
        } else if (char.error) {
            reject(char.error);
        }
    });
};

module.exports = {
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
            max_value: 140,
        },
    ],

    run: async(client, interaction) => {
        const member = interaction.member;
        const user = member.user;
        const name = interaction.getString("name");
        const level = interaction.getInteger("level");
        const roles = {
            tower1: "1130689026333085816",
            tower2: "1129258746854506687",
            tower3: "1130689120994349127"
        };
        getCharacterData(name)
            .then(char => {
                client.database.getCharacter(user, char)
                    .then(async () => {
                        //Trigger if the given Character was found in the Database
                        await interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("Red")
                                    .setTitle("Error 409: Duplicate Character")
                                    .setDescription("A Character with that Name is already registered!")
                                    .setTimestamp()
                            ],
                            ephemeral: true
                        });
                    })
                    .catch(async (err) => {
                        if (String(err).includes("Error 404")) {
                            //Trigger if the Player does not have a Character
                            client.database.addCharacter(user, char)
                                .then(async () => {
                                    //Trigger if the Character has been added to the Database
                                    if (level>=95 && !level>120) {
                                        await member.roles.add(roles.tower1);
                                    }
                                    if (level>=115 && !level>130) {
                                        await member.roles.add(roles.tower2);
                                    }
                                    if (level<=120 && !level>140) {
                                        await member.roles.add(roles.tower3);
                                    }
                                    const class_role = await interaction.guild.roles.cache.find(r => r.name == `${char.class_name}`);
                                    const clan_role = await interaction.guild.roles.cache.find(r => r.name == `${char.clan_name}`);
                                    const server_role = await interaction.guild.roles.cache.find(r => r.name == `${char.server_name}`);
                                    if (!class_role) {
                                        interaction.guild.roles.create({
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
                                        interaction.guild.roles.create({
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
                                        interaction.guild.roles.create({
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

                                    await interaction.reply({
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
                                        ]
                                    });
                                })
                                .catch(async (err1) => {
                                    //Trigger if there was an Error with trying to add the Character to the Database
                                    if (String(err1).includes("Error 409")) {
                                        await interaction.reply({
                                            embeds: [
                                                new EmbedBuilder()
                                                    .setColor("Red")
                                                    .setTitle("Error 409: Duplicate Character")
                                                    .setDescription("A Character with that Name is already registered!")
                                                    .setTimestamp()
                                            ],
                                            ephemeral: true
                                        });
                                    } else if (String(err1).includes("Error 400")) {
                                        await interaction.reply({
                                            embeds: [
                                                new EmbedBuilder()
                                                    .setColor("Red")
                                                    .setTitle(`${err1}`)
                                                    .setDescription("You may not register a Character that is not a member of a Clan in the Alliance!")
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
                                })
                        } else if (String(err).includes("Error 400")) {
                            //Trigger if the Player already has a Character
                            await interaction.reply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor("Red")
                                        .setTitle(`${err}`)
                                        .setDescription("You may not register more than one Character!")
                                        .setTimestamp()
                                ],
                                ephemeral: true
                            });
                        } else {
                            //Trigger if a Database Error occurred
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
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setDescription(`${err}`)
                            .setTimestamp()
                    ],
                    ephemeral: true
                });
            });
    },
};