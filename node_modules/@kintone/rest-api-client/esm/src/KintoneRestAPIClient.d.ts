import type { EndpointName } from "./client/BulkRequestClient";
import { AppClient } from "./client/AppClient";
import { RecordClient } from "./client/RecordClient";
import { SpaceClient } from "./client/SpaceClient";
import { FileClient } from "./client/FileClient";
import { PluginClient } from "./client/PluginClient";
import type { ProxyConfig } from "./http/HttpClientInterface";
import type { BasicAuth, DiscriminatedAuth } from "./types/auth";
import type { Agent as HttpsAgent } from "https";
type OmitTypePropertyFromUnion<T> = T extends unknown ? Omit<T, "type"> : never;
type Auth = OmitTypePropertyFromUnion<DiscriminatedAuth>;
type Options = {
    baseUrl?: string;
    auth?: Auth;
    guestSpaceId?: number | string;
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
    featureFlags?: {
        enableAbortSearchError: boolean;
    };
    userAgent?: string;
    socketTimeout?: number;
};
export declare class KintoneRestAPIClient {
    record: RecordClient;
    app: AppClient;
    space: SpaceClient;
    file: FileClient;
    plugin: PluginClient;
    private bulkRequest_;
    private baseUrl?;
    constructor(options?: Options);
    static get version(): string;
    getBaseUrl(): string | undefined;
    bulkRequest(params: {
        requests: Array<{
            method: string;
            api: string;
            payload: object;
        } | {
            method: string;
            endpointName: EndpointName;
            payload: object;
        }>;
    }): Promise<{
        results: Array<{
            [K: string]: any;
        }>;
    }>;
}
export {};
