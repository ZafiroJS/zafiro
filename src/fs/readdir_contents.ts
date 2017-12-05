import * as fs from "fs";
import chalk from "chalk";
import { ERROR_MSG } from "../constants/error_msg";
import readdir from "./readdir";

export default async function readdirContents(
    directoryName: string,
    getPath: (dirOrFile: string[]) => string
) {
    const files = await readdir(directoryName, getPath);
    return files.map((fileName) => {
        const entityPath = getPath([directoryName, fileName]);
        try {
            console.log(chalk.cyan(`Loading: ${entityPath}`));
            const entity = require(entityPath);
            if (entity.default === undefined) {
                console.log(
                    chalk.red(
                        ERROR_MSG.entity_modules_must_have_a_default_export(entityPath)
                    )
                );
            }
            console.log(chalk.green("Success!"));
            return entity.default;
        } catch (err) {
            console.log(
                chalk.red(
                    ERROR_MSG.cannot_read_path(entityPath)
                )
            );
            console.log(err);
        }
    });
}
