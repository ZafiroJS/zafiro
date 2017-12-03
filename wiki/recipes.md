# Recipes

## Writign tests

If you invoke `createApp` a new app is created. Two apps cannot run at the same time but because they cannot share the database connection.

You can overcome this limitation by ensuring that the database connection is reset before a new call to `createApp`. We can achieve this using a hook that will be executed after each tests:

```ts
afterEach(async () => {
    const connection = getConnection();
    connection.close();
});
```

The following is an example of one of our tests:

```ts
import "./env";
import { expect } from "chai";
import { getConnection } from "typeorm";
import { createApp } from "../src/index";
import { makeMiddleware } from "../dts/middleware/make_middleware";
import { httpPost, httpGet } from "./test_utils";
import * as interfaces from "./test_app/interfaces";

describe("User Services", () => {

    afterEach(async () => {
        const connection = getConnection();
        connection.close();
    });

    it("Should be able to create an User", async () => {

        const result = await createApp({
            database: "postgres",
            dir: ["..", "..", "test", "test_app"]
        });

        const expectedUser: interfaces.NewUser = {
            givenName: "Test Name",
            familyName: "Test Family Name",
            email: "tes@test.com",
            isBanned: false
        };

        const httpPostResponse = await httpPost<interfaces.NewUser>(
            result.app,
            "/api/v1/users/",
            expectedUser,
            200,
            [["x-auth-token", "fake_credentials"]],
            [["Content-Type", "application/json; charset=utf-8"]]
        );

        const actualUser = httpPostResponse.body;
        expect(typeof actualUser.id).to.eql("number");
        expect(actualUser.givenName).to.eql(expectedUser.givenName);
        expect(actualUser.familyName).to.eql(expectedUser.familyName);
        expect(actualUser.email).to.eql(expectedUser.email);
        expect(actualUser.isBanned).to.eql(expectedUser.isBanned);

    });

});
```
