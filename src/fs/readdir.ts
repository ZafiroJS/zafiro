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
                // If we are using ts-node we ignore js file
                // otherwise we ignore ts files, we do this
                // because some people use the same directory
                // to store both the input (ts) and output (js)
                if (process.env.TS_NODE_COMPILER) {
                    resolve(
                        files.filter(f => f.indexOf(".js") === -1)
                    );
                } else {
                    resolve(
                        files.filter(f => f.indexOf(".ts") === -1)
                    );
                }
            }
        });
    });
}
