import * as Pino from "pino";
import { injectable } from "inversify";
import { QueryRunner } from "typeorm";
import { Logger as DbLogger } from "typeorm";
import * as interfaces from "../interfaces";

export default function makeLogger(options?: Pino.LoggerOptions) {

    let pino = (options) ? Pino(options) : Pino();

    @injectable()
    class Logger implements interfaces.Logger, DbLogger {
        private readonly _pino: typeof pino;
        public constructor() {
            this._pino = pino;
        }
        public success(msg: string, ...args: any[]) {
            this._pino.success(msg, ...args);
        }
        public info(msg: string, ...args: any[]) {
            this._pino.info(msg, ...args);
        }
        public trace(msg: string, ...args: any[]) {
            this._pino.trace(msg, ...args);
        }
        public error(msg: string, ...args: any[]) {
            this._pino.error(msg, ...args);
        }
        public debug(msg: string, ...args: any[]) {
            this._pino.debug(msg, ...args);
        }
        public warn(msg: string, ...args: any[]) {
            this._pino.warn(msg, ...args);
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
            this.info("SQL:", message);
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
            }
        }
    }

    return Logger;

}
