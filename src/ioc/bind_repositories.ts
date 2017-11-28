import chalk from "chalk";
import { Repository } from "typeorm";
import { interfaces as inversifyInterfaces } from "inversify";
import * as interfaces from "../interfaces";
import { TYPE } from "../constants/types";
import readdirContents from "../fs/readdir_contents";

export default async function bindRepositories(
    container: inversifyInterfaces.Container,
    directoryName: string,
    getPath: (dirOrFile: string[]) => string
) {

    const factory = container.get<interfaces.RepositoryFactory>(TYPE.RepositoryFactory);
    const entities = await readdirContents(directoryName, getPath);
    const entityTypes = entities.map(e => Symbol.for(`Repository<${e.name}>`));

    const repositories = await factory.getRepository<any>(
        entities,
        directoryName,
        getPath
    );

    repositories.forEach((repository, i) => {
        const repositoryType = entityTypes[i];
        console.log(chalk.cyan(`Creating repository binding with TYPE ${repositoryType.toString()}`));
        container.bind<Repository<any>>(repositoryType).toConstantValue(repository);
        console.log(chalk.green("Success!"));
    });

    return repositories;
}
