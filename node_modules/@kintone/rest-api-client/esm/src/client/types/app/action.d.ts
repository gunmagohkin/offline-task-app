import type { Entity } from "../entity";
import type { AppID } from "../index";
export type AppActionsForParameter = {
    [actionName: string]: ActionPropertyForParameter;
};
type ActionPropertyForParameter = ({
    destApp: DestAppForParameter;
    mappings: Mapping[];
} | {
    mappings?: Mapping[];
}) & {
    name?: string;
    index: string | number;
    entities?: Entity[];
};
type DestAppForParameter = {
    app: AppID;
    code?: string;
} | {
    app?: AppID;
    code: string;
};
export type AppActionsForResponse = {
    [actionName: string]: ActionPropertyForResponse;
};
type ActionPropertyForResponse = {
    name: string;
    id: string;
    index: string;
    destApp: DestAppForResponse;
    mappings: Mapping[];
    entities: Entity[];
};
type DestAppForResponse = {
    app: string;
    code: string;
};
type Mapping = {
    srcType: "FIELD";
    srcField: string;
    destField: string;
} | {
    srcType: "RECORD_URL";
    destField: string;
};
export {};
