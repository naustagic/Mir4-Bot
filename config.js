require("dotenv").config();
module.exports = {
    token: process.env.BOT_TOKEN,
    default_prefix: "m!",
    owners: ["676518256282042393", "327644167276855298"],
    presence: {
        activities: [
            {
                name: "mir4info",
                type: 0,
            },
        ],
        status: "online",
    },
};