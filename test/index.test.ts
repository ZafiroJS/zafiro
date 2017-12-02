import { expect } from "chai";
import { getManager } from "typeorm";
import { createApp } from "../src/index";
import { makeMiddleware } from "../dts/middleware/make_middleware";

describe("Zafiro", () => {

    it("Should not be possible to re-use a db conenction", (done) => {

        async function createAnotherConnection() {
            const result1 = await createApp({
                database: "postgres",
                dir: ["..", "..", "test", "test_app"]
            });
            const result2 = await createApp({
                database: "postgres",
                dir: ["..", "..", "test", "test_app"]
            });
            return result2;
        }

        const expectedMsg = "Cannot create a new connection named \"default\", " +
                    "because connection with such name already exist and " +
                    "it now has an active connection session.";

        createAnotherConnection().then(r => {
            expect(false).to.eq(true, "This line should never be executed!");
            done();
        }).catch(e => {
            getManager().connection.close();
            expect(e.message).to.contain(expectedMsg);
            done();
        });

    });

    it("Should be able to close previous db conenction", (done) => {

        async function createMultipleApps() {
            const result1 = await createApp({
                database: "postgres",
                dir: ["..", "..", "test", "test_app"]
            });
            getManager().connection.close();
            const result2 = await createApp({
                database: "postgres",
                dir: ["..", "..", "test", "test_app"]
            });
            return { result1, result2 };
        }

        createMultipleApps().then(r => {
            const msg = "Can create second app after closing previous db connection";
            expect(true).to.eq(true, msg);
            done();
        }).catch(e => {
            expect(false).to.eq(true, "This line should never be executed!");
            done();
        });

    });

});
