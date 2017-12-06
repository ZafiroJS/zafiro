import readdirContents from "../fs/readdir_contents";
import { UniversalLogger } from "../interfaces";

export default async function bindControllers(
    logger: UniversalLogger,
    directoryName: string,
    getPath: (dirOrFile: string[]) => string
) {
    const controllers = await readdirContents(logger, directoryName, getPath);
    return controllers;
}
