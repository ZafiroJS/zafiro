import * as fs from "fs";
import chalk from "chalk";
import { ERROR_MSG } from "../constants/error_msg";

export default async function readdir(
    directoryName: string,
    getPath: (dirOrFile: string[]) => string
) {
    return new Promise<string[]>((resolve, reject) => {
        const path = getPath([directoryName]);
        console.log(chalk.cyan(`Reading: ${path}`));
        fs.readdir(path, (err, files) => {
            if (err) {
                console.log(
                    chalk.red(
                        ERROR_MSG.cannot_read_path(path)
                    )
                );
                console.log(err);
                reject(false);
            } else {
                console.log(chalk.green("Success!"));
                resolve(files);
            }
        });
    });
}
