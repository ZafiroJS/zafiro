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
        return await this._repository.find()
            .catch(reason => {
                return `couldn't find it`;
            });
    }

    @httpGet("/:id")
    private async getById( @requestParam("id") id: string) {
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
        return this.saveOrUpdate(user);
    }

    @httpPut("/")
    private async put( @requestBody() user: User) {
        const result = validate(user, User);
        if (result.error) {
            return this.httpContext.response.status(400)
                .json({
                    error: `User ${result.error.message}`
                });
        }
        return this.saveOrUpdate(user);
    }

    private async saveOrUpdate(user: User): Promise<User> {
        return await this._repository.save(user);
    }

    @httpDelete("/:id")
    private async delete( @requestParam("id") userId: string, @response() res: express.Response) {
        // Does not work
        // return await this._repository.deleteById(userId);

        // Works
        return await this._repository.deleteById(userId)
            .then(something => {
                console.log("Something Happened");
                return `deleted`;
            }).catch(error => {
                console.log("Something Didn't Happened");
                return error;
            });
    }

}

