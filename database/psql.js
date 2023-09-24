import pkg from "pg";
const Pool = pkg.Pool;
import "dotenv/config";
import moment from "moment";
import { config } from "../config.js";
import fs from "fs";

class PSQL {
    constructor() {
        this.pool = new Pool({
            user: process.env.PG_USER,
            host: process.env.PG_HOST,
            database: process.env.PG_NAME,
            password: process.env.PG_PWD,
            port: process.env.PG_PORT
        });
        this.pool.connect((err) => {
            if (err) {
                console.error(err);
            } else {
                console.log("Connected to Database!");
            }
        });
    }
}
const psql = new PSQL();
export { psql };