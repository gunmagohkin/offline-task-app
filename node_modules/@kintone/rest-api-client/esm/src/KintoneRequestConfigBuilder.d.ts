import FormData from "form-data";
import type { RequestConfigBuilder, HttpMethod, Params, ProxyConfig } from "./http/HttpClientInterface";
import type { BasicAuth, DiscriminatedAuth } from "./types/auth";
import type { Agent as HttpsAgent } from "https";
type Data = Params | FormData;
type Options = {
    baseUrl: string;
    auth: DiscriminatedAuth;
    basicAuth?: BasicAuth;
    proxy?: ProxyConfig;
    httpsAgent?: HttpsAgent;
    clientCertAuth?: {
        pfx: Buffer;
        password: string;
    } | {
        pfxFilePath: string;
        password: string;
    };
    userAgent?: string;
    socketTimeout?: number;
};
export declare class KintoneRequestConfigBuilder implements RequestConfigBuilder {
    private readonly baseUrl;
    private readonly headers;
    private readonly auth;
    private readonly httpsAgent?;
    private readonly clientCertAuth?;
    private readonly proxy?;
    private readonly socketTimeout?;
    private requestToken;
    constructor(options: Options);
    build(method: HttpMethod, path: string, params: Data, options?: {
        responseType: "arraybuffer";
    }): Promise<{
        url: string;
        method: HttpMethod;
        headers: any;
        httpsAgent?: any;
        data?: any;
        proxy?: ProxyConfig;
    }>;
    private buildProxyConfig;
    private buildRequestUrl;
    private buildData;
    private buildHeaders;
    private getRequestToken;
}
export {};
