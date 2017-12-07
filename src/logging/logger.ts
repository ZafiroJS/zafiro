import * as Pino from "pino";
import * as prettyjson from "prettyjson";
import { injectable } from "inversify";
import { QueryRunner } from "typeorm";
import { Logger as DbLogger } from "typeorm";
import * as interfaces from "../interfaces";

@injectable()
export default class Logger implements interfaces.UniversalLogger {
    private readonly _pino: Pino.Logger;
    private readonly _prettyLogs: boolean;
    public constructor(
        prettyLogs?: boolean,
        loggerOptions?: Pino.LoggerOptions,
        prettyOptions?: Pino.PrettyOptions
    ) {
        if (prettyLogs) {
            this._prettyLogs = true;
            const pretty = (prettyOptions) ? Pino.pretty(prettyOptions) : Pino.pretty();
            pretty.pipe(process.stdout);
            this._pino = (loggerOptions) ? Pino(loggerOptions, pretty) : Pino({}, pretty);
        } else {
            this._prettyLogs = false;
            this._pino = (loggerOptions) ? Pino(loggerOptions) : Pino();
        }
    }
    public success(msg: string, ...args: any[]) {
        if (args.length > 0) {
            this._pino.info(msg, ...this._prettyArgs(args));
        } else {
            this._pino.info(msg);
        }
    }
    public info(msg: string, ...args: any[]) {
        if (args.length > 0) {
            this._pino.info(msg, ...this._prettyArgs(args));
        } else {
            this._pino.info(msg);
        }
    }
    public trace(msg: string, ...args: any[]) {
        if (args.length > 0) {
            this._pino.trace(msg, ...this._prettyArgs(args));
        } else {
            this._pino.trace(msg);
        }
    }
    public error(msg: string, ...args: any[]) {
        if (args.length > 0) {
            this._pino.error(msg, ...this._prettyArgs(args));
        } else {
            this._pino.error(msg);
        }
    }
    public fatal(msg: string, ...args: any[]) {
        if (args.length > 0) {
            this._pino.fatal(msg, ...this._prettyArgs(args));
        } else {
            this._pino.fatal(msg);
        }
    }
    public debug(msg: string, ...args: any[]) {
        if (args.length > 0) {
            this._pino.debug(msg, ...this._prettyArgs(args));
        } else {
            this._pino.debug(msg);
        }
    }
    public warn(msg: string, ...args: any[]) {
        if (args.length > 0) {
            this._pino.warn(msg, ...this._prettyArgs(args));
        } else {
            this._pino.warn(msg);
        }
    }
    public logQuery(query: string, parameters?: any[] | undefined, queryRunner?: QueryRunner | undefined) {
        this.trace("SQL:", query, parameters);
    }
    public logQueryError(error: string, query: string, parameters?: any[] | undefined, queryRunner?: QueryRunner | undefined) {
        this.error("SQL ERROR:", query, parameters);
    }
    public logQuerySlow(time: number, query: string, parameters?: any[] | undefined, queryRunner?: QueryRunner | undefined) {
        this.warn("SQL SLOW:", time, parameters);
    }
    public logSchemaBuild(message: string, queryRunner?: QueryRunner | undefined) {
        this.info("SQL SCHEMA:", message);
    }
    public logMigration(message: string, queryRunner?: QueryRunner | undefined) {
        this.info("SQL MIGRATION:", message);
    }
    public log(level: "log" | "info" | "warn", message: any, queryRunner?: QueryRunner | undefined) {
        switch (level) {
            case "log":
                this.trace(message);
                break;
            case "info":
                this.info(message);
                break;
            case "warn":
                this.warn(message);
                break;
            default:
                this.info(message);
        }
    }
    private _prettyArgs(...args: any[]) {
        if (this._prettyArgs) {
            return args.map(a => prettyjson.renderString(JSON.stringify(a)));
        }
        return args;
    }
}
