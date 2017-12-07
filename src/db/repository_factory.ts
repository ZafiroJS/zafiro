import { getConnection, Repository } from "typeorm";
import * as interfaces from "../interfaces";
import readdir from "../fs/readdir";
import { UniversalLogger } from "../interfaces";

export async function getRepositories<T>(
    logger: UniversalLogger,
    entities: Array<{ new(): T }>
): Promise<Repository<T>[]> {
    const connection = getConnection();
    const repositories = entities.map((entity) => {
        logger.info(`Creating repository for entity: ${entity.name}`);
        const repository = connection.getRepository<T>(entity);
        logger.success("Success!");
        return repository;
    });
    return repositories;
}
