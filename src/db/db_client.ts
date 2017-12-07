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

            // Get entities paths
            const paths = await this._getEntityPaths(
                logger,
                directoryName,
                getPath
            );

            // Connect to DB
            const env = this._getEnv();
            logger.info("Trying to connect to DB ", env);

            const opt = {
                type: database as any,
                host: env.dbHost,
                port: env.dbPort,
                username: env.dbUser,
                password: env.dbPassword,
                database: env.dbName,
                entities: paths,
                synchronize: true
            };

            if (dbLogging) {
                (opt as any)["logging"] = true;
                // (opt as any)["logger"] = logger;
            }

            let connection = await createConnection(opt);

            if (connection.isConnected) {
                logger.success("Success!");
            }

        } catch (err) {
            logger.fatal("Cannot connect to DB", err);
            throw err;
        }
    }

    private _getEnv() {
        return {
            dbHost: process.env.DATABASE_HOST,
            dbPort: parseInt(process.env.DATABASE_PORT as any),
            dbUser: process.env.DATABASE_USER,
            dbPassword: process.env.DATABASE_PASSWORD,
            dbName: process.env.DATABASE_DB
        };
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
