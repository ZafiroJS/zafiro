import { Connection, Repository, ConnectionOptions } from "typeorm";
import * as express from "express";
import { interfaces as inversifyInterfaces } from "inversify";
import { interfaces as expressInterfaces } from "inversify-express-utils";
import * as interfaces from "../interfaces";

export type SupportedDatabases = ConnectionOptions["type"];

export interface AppOptions {
    database: SupportedDatabases;
    containerModules?: inversifyInterfaces.ContainerModule[];
    dir?: string[];
    container?: inversifyInterfaces.Container;
    customRouter?: express.Router;
    routingConfig?: expressInterfaces.RoutingConfig;
    customApp?: express.Application;
    AccountRepository?: { new(): interfaces.AccountRepository };
    expressConfig?: (app: express.Application) => void;
}

export interface Result {
    connection: Connection;
    app: express.Application;
}

export interface DbClient {
    getConnection(
        database: SupportedDatabases,
        directoryName: string,
        getPath: (dirOrFile: string[]) => string
    ): Promise<Connection>;
}

export interface AccountRepository {
    getPrincipal(token: string): Promise<expressInterfaces.Principal>;
    isResourceOwner(userDetails: any, resourceId: any): Promise<boolean>;
    isInRole(userDetails: any, role: string): Promise<boolean>;
}

export type MiddlewareFactory = (logger: Logger) => (
    httpContext: expressInterfaces.HttpContext,
    next: express.NextFunction
) => Promise<void>;

export interface Logger {
    info(msg: string, ...args: any[]): void;
    error(msg: string, ...args: any[]): void;
    debug(msg: string, ...args: any[]): void;
    warn(msg: string, ...args: any[]): void;
    success(msg: string, ...args: any[]): void;
}
