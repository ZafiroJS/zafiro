import { createConnection, Connection, Logger as DbLogger } from "typeorm";
import { injectable, inject } from "inversify";
import * as interfaces from "../interfaces";
import readdir from "../fs/readdir";
import { UniversalLogger } from "../interfaces";

@injectable()
export default class DbClient implements interfaces.DbClient {

    public async createConnection(
        dbLogging: boolean,
        logger: UniversalLogger,
        database: interfaces.SupportedDatabases,
        directoryName: string,
        getPath: (dirOrFile: string[]) => string
    ) {
        await this._createConnection(
            dbLogging,
            logger,
            database,
            directoryName,
            getPath
        );
    }

    private async _createConnection(
        dbLogging: boolean,
        logger: UniversalLogger,
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
            const paths = await this._getEntityPaths(
                logger,
                directoryName,
                getPath
            );
            logger.info(
                "Trying to connect to DB " +
                `host:${dbHost} ` +
                `port:${dbPort} ` +
                `user:${dbUser} ` +
                `password:${dbPassword} ` +
                `database:${dbName} ` +
                `logging:${dbLogging} `
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
                logging: dbLogging // ,
                // logger: logger
            });
            if (connection.isConnected) {
                logger.success("Success!");
            }

        } catch (err) {
            logger.fatal("Cannot connect to DB", err);
            throw err;
        }
    }

    private async _getEntityPaths(
        logger: UniversalLogger,
        directoryName: string,
        getPath: (dirOrFile: string[]) => string
    ) {
        const files = await readdir(logger, directoryName, getPath);
        return files.map(fileName => getPath([directoryName, fileName]));
    }

}
