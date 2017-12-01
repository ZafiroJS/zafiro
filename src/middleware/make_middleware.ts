import * as express from "express";
import { inject, injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import { ZAFIRO_TYPE } from "../constants/types";
import { Logger, MiddlewareFactory } from "../interfaces";

export const makeMiddleware = (cb: MiddlewareFactory) => {

    class CustomMiddleware extends BaseMiddleware {
        @inject(ZAFIRO_TYPE.Logger) private readonly _logger: Logger;
        public handler(
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
        ): void {
            (async () => {
                const middleware = cb(this._logger);
                await middleware(this.httpContext, next);
            })();
        }
    }

    return injectable()(CustomMiddleware) as { new(): BaseMiddleware };

};
