const { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
module.exports = {
    name: "help",
    name_localizations: {
        "en-US": "help",
        "pt-BR": "ajuda",
        "es-ES": "ayuda",
        "zh-CN": "帮助",
        "ko": "돕다"
    },
    description: "Displays available Commands",
    description_localizations: {
        "en-US": "Displays available Commands",
        "pt-BR": "Exibe os comandos disponíveis",
        "es-ES": "Muestra los comandos disponibles",
        "zh-CN": "显示可用命令",
        "ko": "사용 가능한 명령을 표시합니다"
    },
    options: [
        {
            name: "command",
            name_localizations: {
                "en-US": "command",
                "pt-BR": "comando",
                "es-ES": "comando",
                "zh-CN": "命令",
                "ko": "명령"
            },
            description: "The exact name of the Command",
            description_localizations: {
                "en-US": "The exact name of the Command",
                "pt-BR": "O nome exato do Comando",
                "es-ES": "El nombre exacto del Comando",
                "zh-CN": "命令的确切名称",
                "ko": "명령의 정확한 이름"
            },
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],

    run: async(client, interaction) => {
        const option = interaction.options;
        const cmd = option.getString("command");
        const member = interaction.member;
        const user = member.user;
        const reply = await interaction.deferReply();
        const menu = new EmbedBuilder();
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("prev")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("⏪")
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId("next")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("⏩")
            );
        if (cmd) {
            const command = await client.application.commands.cache.find(c => c.name == cmd);
            menu.setFooter({ text: "by Julexar" });
            menu.setTimestamp();
            if (command.defaultMemberPermissions) {
                if (member.permissions.has(command.defaultMemberPermissions)) {
                    if (!command.options) {
                        menu.setTitle(`</${command.name}:${command.id}>`);
                        menu.setDescription(`${command.description}`);
                        await reply.edit({
                            embeds: [menu]
                        });
                    } else {
                        menu.setTitle(`</${command.name}:${command.id}>`);
                        menu.setDescription(`${command.description}`);
                        const menus = [];
                        let num = 0;
                        let count = 0;
                        menus.push(menu);
                        for (const opt of command.options) {
                            if (count == 10) {
                                menus.push(embed);
                                num++;
                                count = 0;
                            }
                            if (opt.type == ApplicationCommandOptionType.SubcommandGroup) {
                                for (const opt2 of opt.options) {
                                    if (opt2.type == ApplicationCommandOptionType.Subcommand) {
                                        menus[num].addFields({
                                            name: `</${command.name} ${opt.name} ${opt2.name}:${command.id}>`,
                                            value: `${opt2.description}`,
                                        });
                                        count++;
                                    }
                                }
                            } else if (opt.type == ApplicationCommandOptionType.Subcommand) {
                                menus[num].addFields({
                                    name: `</${command.name} ${opt.name}:${command.id}>`,
                                    value: `${opt.description}`,
                                });
                                count++;
                            }
                        }
                        let page = 0;
                        await reply.edit({
                            embeds: [menus[page]],
                            components: [row]
                        });
                        const filter = m => m.user.id == user.id;
                        const collector = reply.createMessageComponentCollector({
                            filter,
                            time: 90000
                        });
                        collector.on("collect", async (i) => {
                            await i.deferUpdate();
                            if (i.customId == "prev") {
                                if (page > 0) {
                                    page--;
                                    if (page == 0) {
                                        row.components[0].setDisabled(true);
                                        row.components[1].setDisabled(false);
                                    } else {
                                        row.components[0].setDisabled(false);
                                        row.components[1].setDisabled(false);
                                    }
                                    await reply.edit({
                                        embeds: [menus[page]],
                                        components: [row]
                                    });
                                }
                            } else if (i.customId == "next") {
                                if (page < menus.length - 1) {
                                    page++;
                                    if (page == menus.length - 1) {
                                        row.components[0].setDisabled(false);
                                        row.components[1].setDisabled(true);
                                    } else {
                                        row.components[0].setDisabled(false);
                                        row.components[1].setDisabled(false);
                                    }
                                    await reply.edit({
                                        embeds: [menus[page]],
                                        components: [row]
                                    });
                                }
                            }
                        });
                        collector.on("end", async (collected) => {
                            if (collected.size >= 1) {
                                console.log(`Collected ${collected.size} Interactions`);
                            }
                            row.components[0].setDisabled(true);
                            row.components[1].setDisabled(true);
                            await reply.edit({
                                embeds: [menus[page]],
                                components: [row]
                            });
                        });
                    }
                } else {
                    const perms = member.permissions.missing(command.defaultMemberPermissions);
                    await reply.edit({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Red")
                                .setTitle("Error 403: Missing Permissions")
                                .setDescription("You are missing the Permissions needed to view this Command: \n" + perms.join(", "))
                                .setTimestamp()
                                .setFooter({ text: "by Julexar" })
                        ],
                        ephemeral: true
                    });
                }
            }  else {
                if (!command.options) {
                    menu.setTitle(`</${command.name}:${command.id}>`);
                    menu.setDescription(`${command.description}`);
                } else {
                    for (const opt in command.options) {
                        if (opt.type == ApplicationCommandOptionType.SubcommandGroup) {
                            for (const opt2 in opt.options) {
                                if (opt2.type == ApplicationCommandOptionType.Subcommand) {
                                    menu.setTitle(`</${command.name} ${opt.name} ${opt2.name}:${command.id}>`);
                                    menu.setDescription(`${opt2.description}`);
                                }
                            }
                        } else if (opt.type == ApplicationCommandOptionType.Subcommand) {
                            menu.setTitle(`</${command.name} ${opt.name}:${command.id}>`);
                            menu.setDescription(`${opt.description}`);
                        }
                    }
                }
                await reply.edit({
                    embeds: [embed],
                    ephemeral: true
                });
            }
        } else {
            menu.setColor("Aqua")
            menu.setTitle("Slash Command List")
            menu.setTimestamp();
            menu.setFooter({ text: "by Julexar" });
            const menus = [];
            menus.push(menu);
            let count = 0;
            let num = 0;
            client.application.commands.cache.forEach(command => {
                if (command.defaultMemberPermissions) {
                    if (member.permissions.has(command.defaultMemberPermissions)) {
                        if (count == 10) {
                            menus.push(
                                new EmbedBuilder()
                                    .setColor("Aqua")
                                    .setTitle("Slash Command List")
                                    .setTimestamp()
                            );
                            count = 0;
                            num++;
                        }
                        menus[num].addFields({
                            name: `</${command.name}:${command.id}>`,
                            value: `${command.description}`
                        });
                        count++;
                    } else if (!member.permissions.has(command.defaultMemberPermissions)) {
                        return;
                    }
                } else {
                    if (count == 10) {
                        menus.push(
                            new EmbedBuilder()
                                .setColor("Aqua")
                                .setTitle("Slash Command List")
                                .setTimestamp()
                        );
                        count = 0;
                        num++;
                    }
                    menus[num].addFields({
                        name: `</${command.name}:${command.id}>`,
                        value: `${command.description}`
                    });
                    count++;
                }
            });
            let page = 0;
            if (menus.length === 1) {
                row.components[1].setDisabled(true)
                await reply.edit({
                    embeds: [menus[page]],
                    components: [row]
                });
            } else if (menus.length > 1) {
                const filter = m => m.user.id == user.id;
                await reply.edit({
                    embeds: [menus[page]],
                    components: [row]
                });
                const collector = reply.createMessageComponentCollector({
                    filter,
                    time: 90000
                });
                collector.on("collect", async (i) => {
                    await i.deferUpdate();
                    if (i.customId == "prev") {
                        if (page > 0) {
                            page--;
                            if (page == 0) {
                                row.components[0].setDisabled(true);
                                row.components[1].setDisabled(false);
                            } else {
                                row.components[0].setDisabled(false);
                                row.components[1].setDisabled(false);
                            }
                            await reply.edit({
                                embeds: [menus[page]],
                                components: [row]
                            });
                        }
                    } else if (i.customId == "next") {
                        if (page < menus.length - 1) {
                            page++;
                            if (page == menus.length - 1) {
                                row.components[0].setDisabled(false);
                                row.components[1].setDisabled(true);
                            } else {
                                row.components[0].setDisabled(false);
                                row.components[1].setDisabled(false);
                            }
                            await reply.edit({
                                embeds: [menus[page]],
                                components: [row]
                            });
                        }
                    }
                });
                collector.on("end", async (collected) => {
                    if (collected.size >= 1) {
                        console.log(`Collected ${collected.size} Interactions`);
                    }
                    row.components[0].setDisabled(true);
                    row.components[1].setDisabled(true);
                    await reply.edit({
                        embeds: [menus[page]],
                        components: [row]
                    });
                });
            }
        }
    }
}