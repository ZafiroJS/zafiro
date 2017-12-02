import * as express from "express";
import { interfaces as expressInterfaces } from "inversify-express-utils";
import { injectable, inject } from "inversify";
import { ZAFIRO_TYPE } from "../constants/types";
import * as interfaces from "../interfaces";
import Principal from "./principal";
import { principalFactory } from "./principal_factory";

@injectable()
export class AuthProvider implements expressInterfaces.AuthProvider {

    @inject(ZAFIRO_TYPE.AccountRepository) private readonly _accountRepository: interfaces.AccountRepository;

    // Get the current Principal, if the user is
    // authenticated the principal will contain its details
    public async getUser(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
            const token = req.headers["x-auth-token"];
            if (token !== undefined && typeof token === "string") {
                return await this._accountRepository.getPrincipal(token);
            }
            return principalFactory();
    }

}
