import { inject } from "inversify";
import { validate } from "zafiro-validators";
import {
    controller, httpGet, httpPost, BaseHttpController, requestBody, httpPut,
    httpDelete, requestParam, response
} from "inversify-express-utils";
import * as express from "express";
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

    @httpGet("/:id")
    private async getById( @requestParam("id") id: string) {
        console.log(`GetById: ${id}`);
        return await this._repository.findOneById(id);
    }

    @httpPost("/")
    private async post( @requestBody() user: User) {
        const result = validate(user, User);
        if (result.error) {
            return this.httpContext.response.status(400)
                .json({
                    error: `User ${result.error.message}`
                });
        }
        return await this._repository.save(user);
    }

    @httpPut("/")
    private async put( @requestBody() user: any) {
        const result = validate(user, User);
        if (result.error) {
            return this.httpContext.response.status(400)
                .json({
                    error: `User ${result.error.message}`
                });
        }
        return await this._repository.save(user);
    }

    @httpDelete("/:id")
    private delete( @requestParam("id") userId: string, @response() res: express.Response) {
        this._repository.deleteById(userId);
        res.send();
    }

}

