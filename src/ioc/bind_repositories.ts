import { Repository } from "typeorm";
import { interfaces as inversifyInterfaces } from "inversify";
import * as interfaces from "../interfaces";
import { ZAFIRO_TYPE } from "../constants/types";
import readdirContents from "../fs/readdir_contents";
import { getRepositories } from "../db/repository_factory";
import { UniversalLogger } from "../interfaces";

export default async function bindRepositories(
    logger: UniversalLogger,
    container: inversifyInterfaces.Container,
    directoryName: string,
    getPath: (dirOrFile: string[]) => string
) {

    const entities = await readdirContents(logger, directoryName, getPath);
    const entityTypes = entities.map(e => Symbol.for(`Repository<${e.name}>`));
    const repositories = await getRepositories<any>(logger, entities);

    repositories.forEach((repository, i) => {
        const repositoryType = entityTypes[i];
        logger.info("Creating Repository type binding", { ID: repositoryType.toString() });
        container.bind<Repository<any>>(repositoryType).toConstantValue(repository);
        logger.success("Success!");
    });

    return repositories;
}
