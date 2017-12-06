import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import { Container } from "inversify";
import * as path from "path";
import { InversifyExpressServer } from "inversify-express-utils";
import { coreBindings }  from "../config/ioc_config";
import bindControllers from "../ioc/bind_controllers";
import bindRepositories from "../ioc/bind_repositories";
import * as interfaces from "../interfaces";
import { ZAFIRO_TYPE } from "../constants/types";
import { AuthProvider } from "../auth/auth_provider";
import { principalFactory } from "../auth/principal_factory";
import DbClient from "../db/db_client";
import Logger from "../logging/logger";

export default async function createApp(
    options: interfaces.AppOptions
): Promise<interfaces.Result> {

    // The frameworks expects the controllers and entities
    // to be unders /src/controllers and /src/entitites
    // We need to find that folder from the zafiro folder
    // at /node_modules/zafiro/lib/core/ which means that
    // we need to go to ../../../../src/
    const dir = options.dir || ["..", "..", "..", "..", "src"];

    // Create and configure IoC container
    const container = options.container || new Container();

    // Create Logger
    const logger = new Logger(
        options.prettyLogs || true,
        options.loggerOptions,
        options.prettyOptions
    );

    // Declare app bindings
    container.load(coreBindings);
    container.bind<interfaces.Logger>(ZAFIRO_TYPE.Logger)
             .toConstantValue(logger);

    if (options.containerModules) {
        const modules = options.containerModules;
        container.load(...modules);
    }

    // Create db a unique connection
    // https://github.com/typeorm/typeorm/issues/592
    const dbClient = new DbClient();

    await dbClient.createConnection(
        options.dbLogging === true,
        logger,
        options.database,
        "entities",
        (dirOrFile: string[]) => path.join(__dirname, ...dir, ...dirOrFile)
    );

    // Create bindings for repositories
    await bindRepositories(
        logger,
        container,
        "entities",
        (dirOrFile: string[]) => path.join(__dirname, ...dir, ...dirOrFile)
    );

    // Create bindings for controllers
    await bindControllers(
        logger,
        "controllers",
        (dirOrFile: string[]) => path.join(__dirname, ...dir, ...dirOrFile)
    );

    if (options.AccountRepository) {
        container.bind<interfaces.AccountRepository>(ZAFIRO_TYPE.AccountRepository)
                 .to(options.AccountRepository);
    } else {

        const defaultAccountRepository: interfaces.AccountRepository = {
            getPrincipal: (token: string) => Promise.resolve(principalFactory(null)),
            isResourceOwner: (userDetails: any, resourceId: any) => Promise.resolve(false),
            isInRole: (userDetails: any, role: string) => Promise.resolve(false)
        };

        container.bind<interfaces.AccountRepository>(ZAFIRO_TYPE.AccountRepository)
                .toConstantValue(defaultAccountRepository);
    }

    // Create and configure Express server
    const server = new InversifyExpressServer(
        container,
        options.customRouter ? options.customRouter : null,
        options.routingConfig ? options.routingConfig : null,
        options.customApp ? options.customApp : null,
        AuthProvider
    );

    server.setConfig((expressApp: express.Application) => {

        // Set default config
        expressApp.use(helmet());
        expressApp.use(bodyParser.json());
        expressApp.use(bodyParser.urlencoded({ extended: true }));

        // Set custom config
        if (options.expressConfig) {
            options.expressConfig(expressApp);
        }

    });

    // Create and run Express app
    const app = server.build();

    const result: interfaces.Result = { app };

    return result;

}
