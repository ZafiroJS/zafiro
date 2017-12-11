import * as express from "express";
import * as request from "supertest";
import { injectable } from "inversify";
import { Repository } from "typeorm";
import { interfaces as expressInterfaces } from "inversify-express-utils";

export function randomEmail() {
    const randomNumber = Math.floor(Math.random() * 100000) + 1;
    const randomWithTime = new Date().getTime() + randomNumber;
    return `tes_${randomWithTime}@test.com`;
}

export function httpGet(
    app: express.Application,
    url: string,
    expectedResponseCode: number,
    requestHeaders?: ([string, string][]) | null,
    expectedResponseHeaders?: ([string, string][]) | null
) {
    let data = "";
    return handleRequest(new RequestConfig("get", app, url, expectedResponseCode, data, requestHeaders, expectedResponseHeaders));
}

export function httpPost<TData>(
    app: express.Application,
    url: string,
    data: TData,
    expectedResponseCode: number,
    requestHeaders?: ([string, string][]) | null,
    expectedResponseHeaders?: ([string, string][]) | null
) {
    return handleRequest(new RequestConfig("post", app, url, expectedResponseCode, data, requestHeaders, expectedResponseHeaders));
}

export function httpPut<TData>(
    app: express.Application,
    url: string,
    data: TData,
    expectedResponseCode: number,
    requestHeaders?: ([string, string][]) | null,
    expectedResponseHeaders?: ([string, string][]) | null
) {
    return handleRequest(new RequestConfig("put", app, url, expectedResponseCode, data, requestHeaders, expectedResponseHeaders));
}

export function httpDelete<TData>(
    app: express.Application,
    url: string,
    expectedResponseCode: number,
    requestHeaders?: ([string, string][]) | null,
    expectedResponseHeaders?: ([string, string][]) | null
) {
    let data = "";
    return handleRequest(new RequestConfig("delete", app, url, expectedResponseCode, data, requestHeaders, expectedResponseHeaders));
}

export class RequestConfig<TData> {
    constructor(public type: string,
        public app: express.Application,
        public url: string,
        public expectedResponseCode: number,
        public data?: TData,
        public requestHeaders?: ([string, string][]) | null,
        public expectedResponseHeaders?: ([string, string][]) | null,
    ) { }
}

export async function handleRequest<TData>(requestConfig: RequestConfig<TData>) {
    return new Promise<request.Response>((resolve, reject) => {
        let r: any;
        if (requestConfig.data) {
            r = request(requestConfig.app)[requestConfig.type](requestConfig.url)
                .send(requestConfig.data)
                .expect(requestConfig.expectedResponseCode);
        } else {
            r = request(requestConfig.app)[requestConfig.type](requestConfig.url)
                .expect(requestConfig.expectedResponseCode);
        }

        if (requestConfig.requestHeaders) {
            requestConfig.requestHeaders.forEach(h => {
                r = r.set(h[0], h[1]);
            });
        }

        if (requestConfig.expectedResponseHeaders) {
            requestConfig.expectedResponseHeaders.forEach(h => {
                r = r.expect(h[0], h[1]);
            });
        }

        r.end(function (err: any, res: any) {
            if (err) {
                reject(err);
            }
            resolve(res);
        });

    });
}
