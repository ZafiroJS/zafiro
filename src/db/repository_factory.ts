import { getConnection, Repository } from "typeorm";
import chalk from "chalk";
import * as interfaces from "../interfaces";
import readdir from "../fs/readdir";

export async function getRepositories<T>(
    entities: Array<{ new(): T }>
): Promise<Repository<T>[]> {
    const connection = getConnection();
    const repositories = entities.map((entity) => {
        console.log(chalk.cyan(`Creating repository for entity: ${entity.name}`));
        const repository = connection.getRepository<T>(entity);
        console.log(chalk.green("Success!"));
        return repository;
    });
    return repositories;
}
