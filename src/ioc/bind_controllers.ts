import { getRouteInfo } from "inversify-express-utils";
import readdirContents from "../fs/readdir_contents";
import { UniversalLogger } from "../interfaces";

export default async function bindControllers(
    logger: UniversalLogger,
    directoryName: string,
    getPath: (dirOrFile: string[]) => string
) {
    const controllers = await readdirContents(
        logger,
        directoryName,
        getPath
    );

    const types = controllers.map(c => ({ ID: Symbol.for(c.name).toString() }));
    logger.info("Created Controller type bindings", ...types);
    logger.success("Success!");

    const routerInfo = controllers.map(c => {
        return getRouteInfo(c);
    });

    logger.info("Routes", routerInfo);

    return controllers;
}
