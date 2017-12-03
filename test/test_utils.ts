import * as express from "express";
import * as request from "supertest";
import { injectable } from "inversify";
import { Repository } from "typeorm";
import { interfaces as expressInterfaces } from "inversify-express-utils";

export function httpGet(
    app: express.Application,
    url: string,
    expectedResponseCode: number,
    requestHeaders?: ([string, string][]) | null,
    expectedResponseHeaders?: ([string, string][]) | null
) {
    return new Promise<request.Response>((resolve, reject) => {

        let r = request(app).get(url)
                            .expect(expectedResponseCode);

        if (requestHeaders) {
            requestHeaders.forEach(h => {
                r = r.set(h[0], h[1]);
            });
        }

        if (expectedResponseHeaders) {
            expectedResponseHeaders.forEach(h => {
                r = r.expect(h[0], h[1]);
            });
        }

        r.end(function(err, res) {
            if (err) {
                reject(err);
            }
            resolve(res);
        });

    });
}

export function httpPost<TData>(
    app: express.Application,
    url: string,
    data: TData,
    expectedResponseCode: number,
    requestHeaders?: ([string, string][]) | null,
    expectedResponseHeaders?: ([string, string][]) | null
) {
    return new Promise<request.Response>((resolve, reject) => {

        let r = request(app).post(url)
                            .send(data)
                            .expect(expectedResponseCode);

        if (requestHeaders) {
            requestHeaders.forEach(h => {
                r = r.set(h[0], h[1]);
            });
        }

        if (expectedResponseHeaders) {
            expectedResponseHeaders.forEach(h => {
                r = r.expect(h[0], h[1]);
            });
        }

        r.end(function(err, res) {
            if (err) {
                reject(err);
            }
            resolve(res);
        });

    });
}
