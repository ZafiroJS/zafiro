import * as fs from "fs";
import { ERROR_MSG } from "../constants/error_msg";
import readdir from "./readdir";
import { UniversalLogger } from "../interfaces";

export default async function readdirContents(
    logger: UniversalLogger,
    directoryName: string,
    getPath: (dirOrFile: string[]) => string,
) {
    const files = await readdir(logger, directoryName, getPath);
    return files.map((fileName) => {
        const entityPath = getPath([directoryName, fileName]);
        try {
            logger.info("Loading", { path: entityPath });
            const entity = require(entityPath);
            if (entity.default === undefined) {
                logger.fatal(
                    ERROR_MSG.entity_modules_must_have_a_default_export(entityPath)
                );
            }
            logger.success("Success!");
            return entity.default;
        } catch (err) {
            logger.fatal(ERROR_MSG.cannot_read_path(entityPath), err);
            throw err;
        }
    });
}
