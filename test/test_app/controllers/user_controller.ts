import { inject } from "inversify";
import { controller, httpGet, httpPost, BaseHttpController } from "inversify-express-utils";
import { TYPE } from "../constants/types";
import { Repository } from "typeorm";
import { User } from "../interfaces";

function validateUser(user: User) {
    if (
        user == null ||
        user === undefined ||
        typeof user.email !== "string" ||
        typeof user.givenName !== "string" ||
        typeof user.familyName !== "string" ||
        typeof user.isBanned !== "boolean"
    ) {
        throw new Error("Invalid User!");
    }
}

@controller("/api/v1/users")
export default class UserController extends BaseHttpController {

    @inject(TYPE.UserRepository) private readonly _repository: Repository<User>;

    @httpGet("/")
    private async get() {
        return await this._repository.find();
    }

    @httpPost("/")
    private async post() {
        const user = this.httpContext.request.body;
        validateUser(user);
        return await this._repository.save(user);
    }

}
