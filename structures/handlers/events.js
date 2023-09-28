const Ascii = require("ascii-table");
const fs = require("fs");
/**
 * 
 * @param {import("../../index")} client 
 */
module.exports = async (client) => {
    const eventsTable = new Ascii("Events").setHeading("Name", "Status", "Reason");
    const dirs = fs.readdirSync("./events");
    for (const dir of dirs) {
        const files = fs.readdirSync(`./events/${dir}`);
        for (const file of files) {
            const event = require(`../../events/${dir}/${file}`);
            let name;

            if (!event.name || !event.run) {
                return eventsTable.addRow(`${event.name || file}`, "Failed", "Missing Name/Run");
            }

            name = event.name;
            if (event.nick) {
                name += ` (${event.nick})`;
            }

            if (event.once) {
                client.once(event.name, (...args) => event.run(...args, client));
            } else {
                client.on(event.name, (...args) => event.run(...args, client));
            }

            eventsTable.addRow(name, "Success");
        }
    }
    console.log(eventsTable.toString());
}