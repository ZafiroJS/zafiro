import * as express from "express";
import { BaseMiddleware, interfaces } from "inversify-express-utils";
import { Logger, MiddlewareFactory } from "../interfaces";

export const forbidden = (res: express.Response) => {
    res.status(403).send("Forbidden");
};

export const unauthorized = (res: express.Response) => {
    res.status(401).send("Unauthorized");
};

export const isAuthenticatedMiddlewareCb = (logger: Logger) => async (
    httpContext: interfaces.HttpContext,
    next: express.NextFunction
) => {
    const isAuthenticated = await httpContext.user.isAuthenticated();
    if (isAuthenticated) {
        next();
    } else {
        unauthorized(httpContext.response);
    }
};

export const isInRoleMiddlewareCb = (role: string) => (logger: Logger) => async (
    httpContext: interfaces.HttpContext,
    next: express.NextFunction
) => {
    const isAuthenticated = await httpContext.user.isAuthenticated();
    if (isAuthenticated) {
        const isInRole = await httpContext.user.isInRole(role);
        if (isInRole) {
            next();
        } else {
            forbidden(httpContext.response);
        }
    } else {
        unauthorized(httpContext.response);
    }
};
