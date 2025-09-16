import { BaseClient } from "./BaseClient";
export declare class FileClient extends BaseClient {
    uploadFile(params: {
        file: {
            name: string;
            data: unknown;
        } | {
            path: string;
        };
    }): Promise<{
        fileKey: string;
    }>;
    downloadFile(params: {
        fileKey: string;
    }): Promise<ArrayBuffer>;
}
