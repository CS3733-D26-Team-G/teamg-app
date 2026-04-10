import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.ts';
export type * from './prismaNamespace.ts';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: import("@prisma/client/runtime/client").DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: import("@prisma/client/runtime/client").JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: import("@prisma/client/runtime/client").AnyNullClass;
export declare const ModelName: {
    readonly Employee: "Employee";
    readonly Content: "Content";
    readonly Account: "Account";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const EmployeeScalarFieldEnum: {
    readonly uuid: "uuid";
    readonly first_name: "first_name";
    readonly last_name: "last_name";
    readonly date_of_birth: "date_of_birth";
    readonly position: "position";
    readonly department: "department";
    readonly start_date: "start_date";
    readonly supervisor: "supervisor";
    readonly phone_number: "phone_number";
    readonly personal_email: "personal_email";
    readonly corporate_email: "corporate_email";
};
export type EmployeeScalarFieldEnum = (typeof EmployeeScalarFieldEnum)[keyof typeof EmployeeScalarFieldEnum];
export declare const ContentScalarFieldEnum: {
    readonly uuid: "uuid";
    readonly title: "title";
    readonly url: "url";
    readonly content_owner: "content_owner";
    readonly for_position: "for_position";
    readonly last_modified_time: "last_modified_time";
    readonly expiration_time: "expiration_time";
    readonly content_type: "content_type";
    readonly status: "status";
};
export type ContentScalarFieldEnum = (typeof ContentScalarFieldEnum)[keyof typeof ContentScalarFieldEnum];
export declare const AccountScalarFieldEnum: {
    readonly employeeUuid: "employeeUuid";
    readonly username: "username";
    readonly password: "password";
    readonly type: "type";
};
export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
//# sourceMappingURL=prismaNamespaceBrowser.d.ts.map