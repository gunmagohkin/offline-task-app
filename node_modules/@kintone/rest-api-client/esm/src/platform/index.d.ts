import type { DiscriminatedAuth } from "../types/auth";
type PlatformDeps = {
    readFileFromPath: (filePath: string) => Promise<{
        name: string;
        data: unknown;
    }>;
    getRequestToken: () => Promise<string>;
    getDefaultAuth: () => DiscriminatedAuth;
    buildPlatformDependentConfig: (params: object) => object;
    buildHeaders: (params: {
        userAgent?: string;
    }) => Record<string, string>;
    buildFormDataValue: (data: unknown, fileName?: string) => unknown;
    buildBaseUrl: (baseUrl?: string) => string;
    getVersion: () => string;
};
export declare const platformDeps: PlatformDeps;
export declare const injectPlatformDeps: (deps: Partial<PlatformDeps>) => void;
export {};
