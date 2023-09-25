import pkg, { Query } from "pg";
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
    };

    query(query, params = []) {
        return new Promise((resolve, reject) => {
            this.pool.query(query, params, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.isArray()) {
                        results = JSON.parse(JSON.stringify(results.rows));
                    }
                    resolve(results);
                }
            });
        });
    };

    getClan(clan) {
        return new Promise((resolve, reject) => {
            if (!clan) {
                const sql = "SELECT * FROM Clans";
                this.query(sql)
                    .then(results => {
                        if (results.length===0) {
                            reject("Error 404: No Clans found");
                        } else {
                            resolve(results);
                        }
                    })
                    .catch(err => reject(err));
            } else if (clan.id) {
                const sql = "SELECT * FROM Clans WHERE id = $1";
                this.query(sql, [clan.id])
                    .then(results => {
                        if (results.length===0) {
                            reject("Error 404: Clan not found");
                        } else if (results.length===1) {
                            resolve(results[0]);
                        }
                    })
                    .catch(err => reject(err));
            } else {
                const sql = "SELECT * FROM Clans WHERE clan_name = $1";
                this.query(sql, [clan.clan_name])
                    .then(results => {
                        if (results.length===0) {
                            reject("Error 404: Clan not found");
                        } else if (results.length===1) {
                            resolve(results[0]);
                        }
                    })
                    .catch(err => reject(err));
            }
        });
    };

    addClan(clan) {
        return new Promise((resolve, reject) => {
            this.getClan(clan)
                .then(reject("Error 409: Duplicate Clan"))
                .catch(err => {
                    if (String(err).includes("Error 404")) {
                        const sql = "INSERT INTO Clans (clan_name) VALUES($1)";
                        this.query(sql, [clan.clan_name])
                            .then(resolve(`Successfully added the Clan \"${clan.clan_name}\" to the Database!`))
                            .catch(err1 => reject(err1));
                    } else {
                        reject(err);
                    }
                });
        });
    };

    remClan(clan) {
        return new Promise((resolve, reject) => {
            this.getClan(clan)
                .then(c => {
                    const sql = "DELETE FROM Clans WHERE id = $1";
                    this.query(sql, [c.id])
                        .then(resolve(`Successfully removed the Clan \"${c.clan_name}\" from the Database!`))
                        .catch(err => reject(err));
                })
                .catch(err => reject(err));
        });
    };

    getPlayer(player) {
        return new Promise((resolve, reject) => {
            if (!player) {

            } else {
                if (player.id && !player.user_id) {

                } else if (player.id) {

                } else if (player.user_id) {

                }
            }
        });
    };

    addPlayer(player) {
        return new Promise((resolve, reject) => {
            this.getPlayer(player)
                .then(reject("Error 409: Duplicate Player"))
                .catch(err => {
                    if (String(err).includes("Error 404")) {
                        const sql = "INSERT INTO players (user_id, name) VALUES($1, $2)";
                        this.query(sql, [player.id, player.username])
                            .then(resolve(`Successfully added the User \"${player.username}\" to the Database!`))
                            .catch(err1 => reject(err1));
                    } else {
                        reject(err);
                    }
                });
        });
    };

    remPlayer(player) {
        return new Promise((resolve, reject) => {
            this.getPlayer(player)
                .then(p => {
                    const sql = "DELETE FROM players WHERE id = $1 AND user_id = $2";
                    this.query(sql, [p.id, p.user_id])
                        .then(resolve(`Successfully removed the User \"${p.name}\" from the Database!`))
                        .catch(err => reject(err));
                })
                .catch(err => reject(err));
        });
    };

    updatePlayer(player) {
        return new Promise((resolve, reject) => {
            this.getPlayer(player)
                .then(p => {
                    const sql = "UPDATE players SET name = $1 WHERE user_id = $2";
                    this.query(sql, [player.username, p.user_id])
                        .then(resolve(`Successfully updated User \"${player.username}\"!`))
                        .catch(err => reject(err));
                })
                .catch(err => reject(err));
        });
    };

    getCharacter(player, char) {
        return new Promise((resolve, reject) => {
            this.getPlayer(player)
                .then(p => {
                    if (!char) {
                        const sql = "SELECT * FROM characters WHERE user_id = $1";
                        this.query(sql, [player.id])
                            .then(results => {
                                if (results.length===0) {
                                    reject("Error 404: No Characters found");
                                } else {
                                    resolve(results);
                                }
                            })
                            .catch(err => reject(err));
                    } else {
                        const sql = "SELECT * FROM characters WHERE id = $1 AND user_id = $2";
                        this.query(sql, [char.id, player.id])
                            .then(results => {
                                if (results.length===0) {
                                    reject("Error 404: Character not found");
                                } else if (results.length===1) {
                                    resolve(results[0]);
                                }
                            })
                            .catch(err => reject(err));
                    }
                })
                .catch(err => reject(err));
        });
    };

    addCharacter(player, char) {
        return new Promise((resolve, reject) => {
            this.getCharacter(player, char)
                .then(reject("Error 409: Duplicate Character"))
                .catch(err => {
                    if (String(err).includes("Error 404")) {
                        this.getClan({name: char.clan_name})
                            .then(clan => {
                                const date = moment().format("YYYY-MM-DD HH:mm:ss");
                                const sql = "INSERT INTO characters VALUES($1, $2, $3, $4, $5, $6, $7, $8)";
                                this.query(sql, [char.id, p.user_id, char.name, char.class_name, char.power, char.server_name, clan.id, date])
                                    .then(resolve(`Successfully registered Character \"${char.name}\" for User \"${p.name}\"!`))
                                    .catch(err1 => reject(err1));
                            })
                            .catch(err1 => reject(err1));
                    } else {
                        reject(err);
                    }
                });
        });
    };

    remCharacter(player, char) {
        return new Promise((resolve, reject) => {
            this.getPlayer(player)
                .then(p => {
                    this.getCharacter(player, char)
                        .then(c => {
                            const sql = "DELETE FROM characters WHERE id = $1 AND user_id = $2";
                            this.query(sql, [c.id, p.user_id])
                                .then(resolve(`Successfully removed Character \"${c.name}\" of User \"${p.name}\" from the Database!`))
                                .catch(err => reject(err));
                        })
                        .catch(err => reject(err));
                })
                .catch(err => reject(err));
        });
    };

    getPilot(player, user, char) {
        return new Promise((resolve, reject) => {
            if (!user) {
                if (!char) {
                    const sql = "SELECT * FROM pilots WHERE user_id = $1";
                    this.query(sql, [player.id])
                        .then(results => {
                            if (results.length===0) {
                                reject("Error 404: No Pilots found");
                            } else {
                                resolve(results);
                            }
                        })
                        .catch(err => reject(err));
                } else {
                    this.getCharacter(player, char)
                        .then(c => {
                            const sql = "SELECT * FROM pilots WHERE user_id = $1 AND char_id = $2";
                            this.query(sql, [player.id, c.id])
                                .then(results => {
                                    if (results.length===0) {
                                        reject("Error 404: Pilot not found");
                                    } else if (results.length===1) {
                                        resolve(results[0]);
                                    }
                                })
                        })
                        .catch(err => reject(err));
                }
            } else {
                if (!char) {
                    const sql = "SELECT * FROM pilots WHERE id = $1 AND user_id = $2";
                    this.query(sql, [user.id, player.id])
                        .then(results => {
                            if (results.length===0) {
                                reject("Error 404: Pilot not found");
                            } else if (results.length===1) {
                                resolve(results[0]);
                            } else {
                                resolve(results);
                            }
                        })
                        .catch(err => reject(err));
                } else {
                    this.getCharacter(player, char)
                        .then(c => {
                            const sql = "SELECT * FROM pilots WHERE id = $1 AND user_id = $2 AND char_id = $3";
                            this.query(sql, [user.id, player.id, c.id])
                                .then(results => {
                                    if (results.length===0) {
                                        reject("Error 404: Pilot not found");
                                    } else if (results.length===1) {
                                        resolve(results[0]);
                                    }
                                })
                                .catch(err => reject(err));
                        })
                        .catch(err => reject(err));
                }
            }
        });
    };

    addPilot(player, user, char) {
        return new Promise((resolve, reject) => {
            this.getCharacter(player, char)
                .then(c => {
                    this.getPilot(player, user)
                        .then(pilot => {
                            if (pilot.char_id == c.id) {
                                reject("Error 409: Duplicate Pilot");
                            } else {
                                const date = moment.format("YYYY-MM-DD HH:mm:ss");
                                const sql = "INSERT INTO pilots VALUES($1)"
                            }
                        })
                        .catch(err => {
                            if (String(err).includes("Error 404")) {
                                const date = moment().format("YYYY-MM-DD HH:mm:ss");
                                const sql = "INSERT INTO pilots VALUES($1, $2, $3, $4)";
                                this.query(sql, [user.id, c.id, player.id, date])
                                    .then(resolve(`Successfully added Pilot \"${user.username}\" for User \"${player.username}\"`))
                                    .catch(err1 => reject(err1));
                            } else {
                                reject(err);
                            }
                        });
                })
                .catch(err => reject(err));
        });
    };

    remPilot(player, user, char) {
        return new Promise((resolve, reject) => {
            this.getPilot(player, user, char)
                .then(pilot => {
                    const sql = "DELETE FROM pilots WHERE id = $1 AND user_id = $2 AND char_id = $3";
                    this.query(sql, [pilot.id, pilot.user_id, pilot.char_id])
                        .then(resolve(`Successfully removed Pilot \"${user.username}\" of User \"${player.username}\"!`))
                        .catch(err => reject(err));
                })
                .catch(err => reject(err));
        });
    };
};
const psql = new PSQL();
export { psql };