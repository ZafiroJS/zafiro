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
                // Some people use the same directory to store
                // both the input (ts) and output (js) files
                // used and generared by the TS compiler.
                // If JavaScript files are available we ignore
                // the TS files because we asume that compilation
                // has been completed. If for example we use
                // ts-node no JavaScript files will be available
                // in that case we don't ignore the TS files.
                const contiansJsFiles = files.find(f => f.indexOf(".js") !== -1) !== undefined;
                const contiansTsFiles = files.find(f => f.indexOf(".ts") !== -1) !== undefined;
                if (contiansJsFiles && contiansTsFiles) {
                    console.log(
                        chalk.yellow("Folder contains both .js and .ts files, .ts files will be ignored")
                    );
                    resolve(
                        files.filter(f => f.indexOf(".ts") !== -1)
                    );
                }
                resolve(files);
            }
        });
    });
}
