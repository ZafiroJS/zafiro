import { createConnection, Connection } from "typeorm";
import { injectable, inject } from "inversify";
import chalk from "chalk";
import * as interfaces from "../interfaces";
import readdir from "../fs/readdir";

@injectable()
export default class DbClient implements interfaces.DbClient {

    public async createConnection(
        dbLogging: boolean,
        database: interfaces.SupportedDatabases,
        directoryName: string,
        getPath: (dirOrFile: string[]) => string
    ) {
        await this._createConnection(
            dbLogging, database, directoryName, getPath
        );
    }

    private async _createConnection(
        dbLogging: boolean,
        database: interfaces.SupportedDatabases,
        directoryName: string,
        getPath: (dirOrFile: string[]) => string
    ) {
        try {
            const dbHost = process.env.DATABASE_HOST;
            const dbPort = parseInt(process.env.DATABASE_PORT as any);
            const dbUser = process.env.DATABASE_USER;
            const dbPassword = process.env.DATABASE_PASSWORD;
            const dbName = process.env.DATABASE_DB;
            const paths = await this._getEntityPaths(directoryName, getPath);
            console.log(
                chalk.cyan(
                    "Trying to connect to DB: \n" +
                    `- host ${dbHost}\n` +
                    `- port ${dbPort}\n` +
                    `- user ${dbUser}\n` +
                    `- password ${dbPassword}\n` +
                    `- database ${dbName}\n`
                )
            );
            let connection = await createConnection({
                type: database as any,
                host: dbHost,
                port: dbPort,
                username: dbUser,
                password: dbPassword,
                database: dbName,
                entities: paths,
                synchronize: true,
                logging: dbLogging
            });
            if (connection.isOpen) {
                console.log(chalk.green("Success!"));
            }

        } catch (err) {
            console.log(chalk.red("Cannot connect to DB"));
            console.log(err);
            throw err;
        }
    }

    private async _getEntityPaths(
        directoryName: string,
        getPath: (dirOrFile: string[]) => string
    ) {
        const files = await readdir(directoryName, getPath);
        return files.map(fileName => getPath([directoryName, fileName]));
    }

}
