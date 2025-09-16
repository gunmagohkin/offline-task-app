import type { ErrorResponse } from "../http/HttpClientInterface";
type SingleErrorResponseData = {
    id: string;
    code: string;
    message: string;
    errors?: any;
};
type BulkRequestErrorResponseData = {
    results: Array<SingleErrorResponseData | {}>;
};
type KintoneErrorResponseData = SingleErrorResponseData | BulkRequestErrorResponseData;
export type KintoneErrorResponse = ErrorResponse<KintoneErrorResponseData>;
export declare class KintoneRestAPIError extends Error {
    id: string;
    code: string;
    status: number;
    bulkRequestIndex?: number;
    headers: any;
    errors?: any;
    private static findErrorResponseDataWithIndex;
    private static buildErrorResponseDateWithIndex;
    constructor(error: KintoneErrorResponse);
}
export {};
