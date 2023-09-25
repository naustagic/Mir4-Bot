import { ApplicationCommandOptionType, SlashCommandBuilder } from "discord.js";
class Command extends SlashCommandBuilder {
    constructor() {
        this.name = "register";
        this.name_localizations = {
            "en-US": "register",
            "pt-BR": "registrar",
            "es-ES": "registrarse",
            "zh-CN": "注册",
            "ko": "등록"
        };
        this.description = "Registers your MIR4 Character",
        this.description_localizations = {
            "en-US": "Registers your MIR4 Character",
            "pt-BR": "Registrar seu personagem no MIR4",
            "es-ES": "Registrarse tu personaje de MIR4",
            "zh-CN": "注册您的 MIR4 角色",
            "ko": "MIR4 캐릭터 등록"
        };
        this.options = [
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
                    
                }
            }
        ]
    }
}