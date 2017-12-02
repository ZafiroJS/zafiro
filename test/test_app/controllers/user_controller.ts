import { inject } from "inversify";
import { controller, httpGet, BaseHttpController } from "inversify-express-utils";
import { TYPE } from "../constants/types";
import { Repository } from "typeorm";
import { User } from "../interfaces";

@controller("/api/v1/users")
export default class UserController extends BaseHttpController {

    @inject(TYPE.UserRepository) private readonly _repository: Repository<User>;

    @httpGet("/")
    private async get() {
        return await this._repository.find();
    }

}
