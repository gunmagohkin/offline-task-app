import type { HttpClient } from "../http";
export declare abstract class BaseClient {
    protected client: HttpClient;
    protected guestSpaceId?: number | string;
    constructor(client: HttpClient, guestSpaceId?: number | string);
    protected buildPathWithGuestSpaceId(params: {
        endpointName: string;
        preview?: boolean;
    }): string;
    /**
     * This method is used to build the endpoint for the API that does not support the guest space URL.
     * Otherwise, please use `buildPathWithGuestSpaceId` instead.
     * @param params
     * @protected
     */
    protected buildPath(params: {
        endpointName: string;
        preview?: boolean;
    }): string;
}
