const { Client, Collection, GatewayIntentBits } = require("discord.js");
class DiscordClient extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.MessageContent
            ]
        });

        this.class_icons = {
            'Warrior': 'https://file.mir4global.com/xdraco/img/common/ranking/ico_klass_warrior.webp',
            'Sorcerer': 'https://file.mir4global.com/xdraco/img/common/ranking/ico_klass_sorcerer.webp',
            'Taoist': 'https://file.mir4global.com/xdraco/img/common/ranking/ico_klass_taoist.webp',
            'Lancer': 'https://file.mir4global.com/xdraco/img/common/ranking/ico_klass_lancer.webp',
            'Arbalist': 'https://file.mir4global.com/xdraco/img/common/ranking/ico_klass_arbalist.webp',
            'Darkist': 'https://file.mir4global.com/xdraco/img/common/ranking/ico_klass_darkist.webp'
        };
        
        this.class_banners = {
            'Warrior': 'https://file.mir4global.com/xdraco/img/common/nft-detail/nft-detail-warrior5.webp',
            'Sorcerer': 'https://file.mir4global.com/xdraco/img/common/nft-detail/nft-detail-sorcerer5.webp',
            'Taoist': 'https://file.mir4global.com/xdraco/img/common/nft-detail/nft-detail-taoist5.webp',
            'Lancer': 'https://file.mir4global.com/xdraco/img/common/nft-detail/nft-detail-lancer5.webp',
            'Arbalist': 'https://file.mir4global.com/xdraco/img/common/nft-detail/nft-detail-arbalist5.webp',
            'Darkist': 'https://file.mir4global.com/xdraco/img/common/nft-detail/nft-detail-darkist5.webp'
        };

        this.slashCommands = new Collection();
        this.config = require("../../config");
        this.database = require("../../database/psql");
    }

    start() {
        ["events", "slashCommands"].forEach(handler => {
            require(`../handlers/${handler}`)(this)
        });

        this.login(this.config.token);
    }
}
module.exports = DiscordClient;