import * as fs from "fs";
import { ERROR_MSG } from "../constants/error_msg";
import { UniversalLogger } from "../interfaces";

export default async function readdir(
    logger: UniversalLogger,
    directoryName: string,
    getPath: (dirOrFile: string[]) => string
) {
    return new Promise<string[]>((resolve, reject) => {
        const path = getPath([directoryName]);
        logger.info(`Reading: ${path}`);
        fs.readdir(path, (err, files) => {
            if (err) {
                logger.fatal(ERROR_MSG.cannot_read_path(path), err);
                reject(false);
            } else {
                logger.success("Success!");
                // Ignore source map files
                files = files.filter(f => f.indexOf(".map") === -1);
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
                    const filteredFiles = files.filter(f => f.indexOf(".ts") === -1);
                    logger.info("Folder contains both .js and .ts files:");
                    logger.info(JSON.stringify(files));
                    logger.info("All .ts files will be ignored:");
                    logger.info(JSON.stringify(filteredFiles));
                    resolve(filteredFiles);
                }
                resolve(files);
            }
        });
    });
}
