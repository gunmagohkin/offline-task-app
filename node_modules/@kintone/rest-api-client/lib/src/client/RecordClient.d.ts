import type { HttpClient } from "../http";
import type { BulkRequestClient } from "./BulkRequestClient";
import type { AppID, RecordID, Revision, Record, UpdateKey, CommentID, Comment, Mention, UpdateRecordsForResponse } from "./types";
import { BaseClient } from "./BaseClient";
type RecordForParameter = {
    [fieldCode: string]: {
        value: unknown;
    };
};
export declare class RecordClient extends BaseClient {
    private bulkRequestClient;
    private didWarnMaximumOffsetValue;
    constructor(client: HttpClient, bulkRequestClient: BulkRequestClient, guestSpaceId?: number | string);
    getRecord<T extends Record>(params: {
        app: AppID;
        id: RecordID;
    }): Promise<{
        record: T;
    }>;
    addRecord(params: {
        app: AppID;
        record?: RecordForParameter;
    }): Promise<{
        id: string;
        revision: string;
    }>;
    updateRecord(params: {
        app: AppID;
        id: RecordID;
        record?: RecordForParameter;
        revision?: Revision;
    } | {
        app: AppID;
        updateKey: UpdateKey;
        record?: RecordForParameter;
        revision?: Revision;
    }): Promise<{
        revision: string;
    }>;
    upsertRecord(params: {
        app: AppID;
        updateKey: UpdateKey;
        record?: RecordForParameter;
        revision?: Revision;
    }): Promise<{
        id: string;
        revision: string;
    }>;
    getRecords<T extends Record>(params: {
        app: AppID;
        fields?: string[];
        query?: string;
        totalCount?: boolean;
    }): Promise<{
        records: T[];
        totalCount: string | null;
    }>;
    private warnMaximumOffsetValueIfNeeded;
    addRecords(params: {
        app: AppID;
        records: RecordForParameter[];
    }): Promise<{
        ids: string[];
        revisions: string[];
        records: Array<{
            id: string;
            revision: string;
        }>;
    }>;
    updateRecords(params: {
        app: AppID;
        upsert?: boolean;
        records: Array<{
            id: RecordID;
            record?: RecordForParameter;
            revision?: Revision;
        } | {
            updateKey: UpdateKey;
            record?: RecordForParameter;
            revision?: Revision;
        }>;
    }): Promise<{
        records: UpdateRecordsForResponse;
    }>;
    deleteRecords(params: {
        app: AppID;
        ids: RecordID[];
        revisions?: Revision[];
    }): Promise<{}>;
    createCursor(params: {
        app: AppID;
        fields?: string[];
        query?: string;
        size?: number | string;
    }): Promise<{
        id: string;
        totalCount: string;
    }>;
    getRecordsByCursor<T extends Record>(params: {
        id: string;
    }): Promise<{
        records: T[];
        next: boolean;
    }>;
    deleteCursor(params: {
        id: string;
    }): Promise<{}>;
    getAllRecords<T extends Record>(params: {
        app: AppID;
        fields?: string[];
        condition?: string;
        orderBy?: string;
        withCursor?: boolean;
    }): Promise<T[]>;
    getAllRecordsWithId<T extends Record>(params: {
        app: AppID;
        fields?: string[];
        condition?: string;
    }): Promise<T[]>;
    getAllRecordsWithOffset<T extends Record>(params: {
        app: AppID;
        fields?: string[];
        condition?: string;
        orderBy?: string;
    }): Promise<T[]>;
    getAllRecordsWithCursor<T extends Record>(params: {
        app: AppID;
        fields?: string[];
        query?: string;
    }): Promise<T[]>;
    addAllRecords(params: {
        app: AppID;
        records: RecordForParameter[];
    }): Promise<{
        records: Array<{
            id: string;
            revision: string;
        }>;
    }>;
    private addAllRecordsRecursive;
    private addAllRecordsWithBulkRequest;
    updateAllRecords(params: {
        app: AppID;
        upsert?: boolean;
        records: Array<{
            id: RecordID;
            record?: RecordForParameter;
            revision?: Revision;
        } | {
            updateKey: UpdateKey;
            record?: RecordForParameter;
            revision?: Revision;
        }>;
    }): Promise<{
        records: UpdateRecordsForResponse;
    }>;
    private updateAllRecordsRecursive;
    private updateAllRecordsWithBulkRequest;
    deleteAllRecords(params: {
        app: AppID;
        records: Array<{
            id: RecordID;
            revision?: Revision;
        }>;
    }): Promise<{}>;
    private deleteAllRecordsRecursive;
    private deleteAllRecordsWithBulkRequest;
    private separateArrayRecursive;
    addRecordComment(params: {
        app: AppID;
        record: RecordID;
        comment: {
            text: string;
            mentions?: Mention[];
        };
    }): Promise<{
        id: string;
    }>;
    deleteRecordComment(params: {
        app: AppID;
        record: RecordID;
        comment: CommentID;
    }): Promise<{}>;
    getRecordComments(params: {
        app: AppID;
        record: RecordID;
        order?: "asc" | "desc";
        offset?: number;
        limit?: number;
    }): Promise<{
        comments: Comment[];
        older: boolean;
        newer: boolean;
    }>;
    updateRecordAssignees(params: {
        app: AppID;
        id: RecordID;
        assignees: string[];
        revision?: Revision;
    }): Promise<{
        revision: string;
    }>;
    updateRecordStatus(params: {
        action: string;
        app: AppID;
        assignee?: string;
        id: RecordID;
        revision?: Revision;
    }): Promise<{
        revision: string;
    }>;
    updateRecordsStatus(params: {
        app: AppID;
        records: Array<{
            action: string;
            assignee?: string;
            id: RecordID;
            revision?: Revision;
        }>;
    }): Promise<{
        records: Array<{
            id: string;
            revision: string;
        }>;
    }>;
}
export {};
