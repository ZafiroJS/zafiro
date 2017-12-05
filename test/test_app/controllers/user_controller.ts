import { inject } from "inversify";
import { validate } from "zafiro-validators";
import { controller, httpGet, httpPost, BaseHttpController, requestBody } from "inversify-express-utils";
import { TYPE } from "../constants/types";
import { Repository } from "typeorm";
import User from "../entities/user";

@controller("/api/v1/users")
export default class UserController extends BaseHttpController {

    @inject(TYPE.UserRepository) private readonly _repository: Repository<User>;

    @httpGet("/")
    private async get() {
        return await this._repository.find();
    }

    @httpPost("/")
    private async post(@requestBody() user: User) {
        const result = validate(user, User);
        if (result.error) {
            return this.httpContext.response.status(400)
                .json({
                    error: `User ${result.error.message}`
                });
        }
        return await this._repository.save(user);
    }

}

