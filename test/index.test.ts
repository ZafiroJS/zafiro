import "./env";
import { expect } from "chai";
import { getConnection } from "typeorm";
import { createApp } from "../src/index";
import { makeMiddleware } from "../src/middleware/make_middleware";
import { httpPost, httpGet, randomEmail } from "./test_utils";
import * as interfaces from "./test_app/interfaces";

describe("Zafiro", () => {

    afterEach(() => {
        const connection = getConnection();
        connection.close();
    });

    it("Should not be possible to re-use a db conenction", async () => {

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

        try {
            const response = await createAnotherConnection();
            expect(false).to.eq(
                true,
                "This line should never be executed! " +
                "Expected second createApp call to fail " +
                "because previous connection was not closed."
            );
        } catch (e) {
            expect(e.message).to.contain(expectedMsg);
        }

    });

    it("Should be able to close previous db conenction", async () => {

        async function createMultipleApps() {
            const result1 = await createApp({
                database: "postgres",
                dir: ["..", "..", "test", "test_app"]
            });
            const connection = getConnection();
            connection.close();
            const result2 = await createApp({
                database: "postgres",
                dir: ["..", "..", "test", "test_app"]
            });
            return { result1, result2 };
        }

        try {
            const response = await createMultipleApps();
            const msg = "Can create second app after closing previous db connection";
            expect(true).to.eq(true, msg);
        } catch (e) {
            expect(false).to.eq(true, "This line should never be executed!");
        }

    });

    it("Should be able to perform POST and GET http requests", async () => {

        const result = await createApp({
            database: "postgres",
            dir: ["..", "..", "test", "test_app"],
            dbLogging: true
        });

        const email = randomEmail();

        const expectedUser: interfaces.NewUser = {
            givenName: "Test Name",
            familyName: "Test Family Name",
            email: email,
            isBanned: false
        };

        const httpPostResponse = await httpPost<interfaces.NewUser>(
            result.app,
            "/api/v1/users/",
            expectedUser,
            200,
            [["Content-Type", "application/json; charset=utf-8"]]
        );

        const actualUser = httpPostResponse.body;
        expect(typeof actualUser.id).to.eql("number");
        expect(actualUser.givenName).to.eql(expectedUser.givenName);
        expect(actualUser.familyName).to.eql(expectedUser.familyName);
        expect(actualUser.email).to.eql(expectedUser.email);
        expect(actualUser.isBanned).to.eql(expectedUser.isBanned);

        const httpGetResponse = await httpGet(
            result.app,
            "/api/v1/users/",
            200,
            [["Content-Type", "application/json; charset=utf-8"]]
        );

        const actualUsers = httpGetResponse.body;
        expect(Array.isArray(actualUsers)).to.eql(true);

        const maetchedUser = actualUsers.find((u: interfaces.User) => u.email === email);
        expect(maetchedUser).not.to.eql(undefined);
        expect(typeof maetchedUser.id).to.eql("number");
        expect(maetchedUser.givenName).to.eql(expectedUser.givenName);
        expect(maetchedUser.familyName).to.eql(expectedUser.familyName);
        expect(maetchedUser.email).to.eql(expectedUser.email);
        expect(maetchedUser.isBanned).to.eql(expectedUser.isBanned);

    });

    it("Should report validation issues as 400", async () => {

        const result = await createApp({
            database: "postgres",
            dir: ["..", "..", "test", "test_app"]
        });

        const email = randomEmail();

        const expectedUser = {
            givenName: "Test Name",
            familyName: "Test Family Name",
            email: email,
            isBanned: "xxxxx"
        };

        const httpPostResponse = await httpPost<interfaces.NewUser>(
            result.app,
            "/api/v1/users/",
            expectedUser as any,
            400,
            [["Content-Type", "application/json; charset=utf-8"]]
        );

        expect(httpPostResponse.body.error).eq(
            `User child "isBanned" fails because ["isBanned" must be a boolean]`
        );

    });

});
