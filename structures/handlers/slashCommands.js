const Ascii = require('ascii-table');
const fs = require("fs");
/**
 * 
 * @param {import("../../index")} client 
 */
module.exports = async (client) => {
    const slashCommandsTable = new Ascii("Slash Commands").setHeading("Name", "Status", "Reason");
    const dirs = fs.readdirSync("./commands/slash");
    for (const dir of dirs) {
        const files = fs.readdirSync(`./commands/slash/${dir}`)
        for (const file of files) {
            const command = require(`../../commands/slash/${dir}/${file}`);
            let name;

            if (!command.name || !command.run) {
                return slashCommandsTable.addRow(`${command.name || file}`, "Failed", "Missing Name/Run");
            }

            name = command.name;
            if (command.nick) {
                name += ` (${command.nick})`;
            }

            client.slashCommands.set(command.name, command);
            slashCommandsTable.addRow(name, "Success");
        }
    }
    console.log(slashCommandsTable.toString());
}