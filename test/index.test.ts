import { expect } from "chai";
import { createApp } from "../src/index";
import { makeMiddleware } from "../dts/middleware/make_middleware";

describe("Zafiro", () => {

    it("Should be able to close a db conenction", async () => {

        async function createMultipleApps() {
            const result1 = await createApp({
                database: "postgres",
                dir: ["..", "..", "test", "test_app"]
            });
            result1.connection.close();
            const result2 = await createApp({
                database: "postgres",
                dir: ["..", "..", "test", "test_app"]
            });
            return { result1, result2 };
        }

        const apps = await createMultipleApps();
        //

    });

});
