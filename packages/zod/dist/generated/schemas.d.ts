/**
 * Prisma Zod Generator - Single File (inlined)
 * Auto-generated. Do not edit.
 */
import * as z from 'zod';
import type { Prisma } from '@repo/db';
export declare const TransactionIsolationLevelSchema: z.ZodEnum<{
    ReadUncommitted: "ReadUncommitted";
    ReadCommitted: "ReadCommitted";
    RepeatableRead: "RepeatableRead";
    Serializable: "Serializable";
}>;
export type TransactionIsolationLevel = z.infer<typeof TransactionIsolationLevelSchema>;
export declare const EmployeeScalarFieldEnumSchema: z.ZodEnum<{
    uuid: "uuid";
    avatar: "avatar";
    first_name: "first_name";
    last_name: "last_name";
    date_of_birth: "date_of_birth";
    position: "position";
    department: "department";
    start_date: "start_date";
    supervisor: "supervisor";
    phone_number: "phone_number";
    personal_email: "personal_email";
    corporate_email: "corporate_email";
}>;
export type EmployeeScalarFieldEnum = z.infer<typeof EmployeeScalarFieldEnumSchema>;
export declare const ContentScalarFieldEnumSchema: z.ZodEnum<{
    uuid: "uuid";
    url: "url";
    title: "title";
    content_owner: "content_owner";
    for_position: "for_position";
    last_modified_time: "last_modified_time";
    expiration_time: "expiration_time";
    content_type: "content_type";
    status: "status";
    is_favorite: "is_favorite";
}>;
export type ContentScalarFieldEnum = z.infer<typeof ContentScalarFieldEnumSchema>;
export declare const AccountScalarFieldEnumSchema: z.ZodEnum<{
    employeeUuid: "employeeUuid";
    username: "username";
    password: "password";
    type: "type";
}>;
export type AccountScalarFieldEnum = z.infer<typeof AccountScalarFieldEnumSchema>;
export declare const SortOrderSchema: z.ZodEnum<{
    asc: "asc";
    desc: "desc";
}>;
export type SortOrder = z.infer<typeof SortOrderSchema>;
export declare const QueryModeSchema: z.ZodEnum<{
    default: "default";
    insensitive: "insensitive";
}>;
export type QueryMode = z.infer<typeof QueryModeSchema>;
export declare const NullsOrderSchema: z.ZodEnum<{
    first: "first";
    last: "last";
}>;
export type NullsOrder = z.infer<typeof NullsOrderSchema>;
export declare const PositionSchema: z.ZodEnum<{
    UNDERWRITER: "UNDERWRITER";
    BUSINESS_ANALYST: "BUSINESS_ANALYST";
    ADMIN: "ADMIN";
}>;
export type Position = z.infer<typeof PositionSchema>;
export declare const DepartmentSchema: z.ZodEnum<{
    OPERATION_TECHNOLOGY: "OPERATION_TECHNOLOGY";
    ACCOUNTING: "ACCOUNTING";
}>;
export type Department = z.infer<typeof DepartmentSchema>;
export declare const ContentTypeSchema: z.ZodEnum<{
    REFERENCE: "REFERENCE";
    WORKFLOW: "WORKFLOW";
}>;
export type ContentType = z.infer<typeof ContentTypeSchema>;
export declare const ContentStatusSchema: z.ZodEnum<{
    AVAILABLE: "AVAILABLE";
    IN_USE: "IN_USE";
    UNAVAILABLE: "UNAVAILABLE";
}>;
export type ContentStatus = z.infer<typeof ContentStatusSchema>;
export declare const AccountTypeSchema: z.ZodEnum<{
    ADMIN: "ADMIN";
    EMPLOYEE: "EMPLOYEE";
}>;
export type AccountType = z.infer<typeof AccountTypeSchema>;
export declare const EmployeeWhereInputObjectSchema: z.ZodType<Prisma.EmployeeWhereInput>;
export declare const EmployeeWhereInputObjectZodSchema: z.ZodObject<{
    AND: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.EmployeeWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeWhereInput, unknown>>>, z.ZodArray<z.ZodLazy<z.ZodType<Prisma.EmployeeWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeWhereInput, unknown>>>>]>>;
    OR: z.ZodOptional<z.ZodArray<z.ZodLazy<z.ZodType<Prisma.EmployeeWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeWhereInput, unknown>>>>>;
    NOT: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.EmployeeWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeWhereInput, unknown>>>, z.ZodArray<z.ZodLazy<z.ZodType<Prisma.EmployeeWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeWhereInput, unknown>>>>]>>;
    uuid: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.UuidFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.UuidFilter<never>, unknown>>>, z.ZodString]>>;
    avatar: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.StringNullableFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.StringNullableFilter<never>, unknown>>>, z.ZodString]>>>;
    first_name: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.StringFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.StringFilter<never>, unknown>>>, z.ZodString]>>;
    last_name: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.StringFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.StringFilter<never>, unknown>>>, z.ZodString]>>;
    date_of_birth: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.DateTimeFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.DateTimeFilter<never>, unknown>>>, z.ZodCoercedDate<unknown>]>>;
    position: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.EnumPositionFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.EnumPositionFilter<never>, unknown>>>, z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>]>>;
    department: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.EnumDepartmentFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.EnumDepartmentFilter<never>, unknown>>>, z.ZodEnum<{
        OPERATION_TECHNOLOGY: "OPERATION_TECHNOLOGY";
        ACCOUNTING: "ACCOUNTING";
    }>]>>;
    start_date: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.DateTimeFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.DateTimeFilter<never>, unknown>>>, z.ZodCoercedDate<unknown>]>>;
    supervisor: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.StringFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.StringFilter<never>, unknown>>>, z.ZodString]>>;
    phone_number: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.StringFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.StringFilter<never>, unknown>>>, z.ZodString]>>;
    personal_email: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.StringFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.StringFilter<never>, unknown>>>, z.ZodString]>>;
    corporate_email: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.StringFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.StringFilter<never>, unknown>>>, z.ZodString]>>;
    account: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.AccountNullableScalarRelationFilter, unknown, z.core.$ZodTypeInternals<Prisma.AccountNullableScalarRelationFilter, unknown>>>, z.ZodLazy<z.ZodType<Prisma.AccountWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereInput, unknown>>>]>>;
}, z.core.$strict>;
export declare const EmployeeOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.EmployeeOrderByWithRelationInput>;
export declare const EmployeeOrderByWithRelationInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    avatar: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>, z.ZodLazy<z.ZodType<Prisma.SortOrderInput, unknown, z.core.$ZodTypeInternals<Prisma.SortOrderInput, unknown>>>]>>;
    first_name: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    last_name: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    date_of_birth: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    position: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    department: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    start_date: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    supervisor: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    phone_number: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    personal_email: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    corporate_email: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    account: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.AccountOrderByWithRelationInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountOrderByWithRelationInput, unknown>>>>;
}, z.core.$strict>;
export declare const EmployeeWhereUniqueInputObjectSchema: z.ZodType<Prisma.EmployeeWhereUniqueInput>;
export declare const EmployeeWhereUniqueInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const EmployeeOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.EmployeeOrderByWithAggregationInput>;
export declare const EmployeeOrderByWithAggregationInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    avatar: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>, z.ZodLazy<z.ZodType<Prisma.SortOrderInput, unknown, z.core.$ZodTypeInternals<Prisma.SortOrderInput, unknown>>>]>>;
    first_name: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    last_name: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    date_of_birth: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    position: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    department: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    start_date: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    supervisor: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    phone_number: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    personal_email: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    corporate_email: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    _count: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.EmployeeCountOrderByAggregateInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeCountOrderByAggregateInput, unknown>>>>;
    _max: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.EmployeeMaxOrderByAggregateInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeMaxOrderByAggregateInput, unknown>>>>;
    _min: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.EmployeeMinOrderByAggregateInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeMinOrderByAggregateInput, unknown>>>>;
}, z.core.$strict>;
export declare const EmployeeScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.EmployeeScalarWhereWithAggregatesInput>;
export declare const EmployeeScalarWhereWithAggregatesInputObjectZodSchema: z.ZodObject<{
    AND: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.EmployeeScalarWhereWithAggregatesInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeScalarWhereWithAggregatesInput, unknown>>>, z.ZodArray<z.ZodLazy<z.ZodType<Prisma.EmployeeScalarWhereWithAggregatesInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeScalarWhereWithAggregatesInput, unknown>>>>]>>;
    OR: z.ZodOptional<z.ZodArray<z.ZodLazy<z.ZodType<Prisma.EmployeeScalarWhereWithAggregatesInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeScalarWhereWithAggregatesInput, unknown>>>>>;
    NOT: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.EmployeeScalarWhereWithAggregatesInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeScalarWhereWithAggregatesInput, unknown>>>, z.ZodArray<z.ZodLazy<z.ZodType<Prisma.EmployeeScalarWhereWithAggregatesInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeScalarWhereWithAggregatesInput, unknown>>>>]>>;
    uuid: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.UuidWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.UuidWithAggregatesFilter<never>, unknown>>>, z.ZodString]>>;
    avatar: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.StringNullableWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.StringNullableWithAggregatesFilter<never>, unknown>>>, z.ZodString]>>>;
    first_name: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.StringWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.StringWithAggregatesFilter<never>, unknown>>>, z.ZodString]>>;
    last_name: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.StringWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.StringWithAggregatesFilter<never>, unknown>>>, z.ZodString]>>;
    date_of_birth: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.DateTimeWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.DateTimeWithAggregatesFilter<never>, unknown>>>, z.ZodCoercedDate<unknown>]>>;
    position: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.EnumPositionWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.EnumPositionWithAggregatesFilter<never>, unknown>>>, z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>]>>;
    department: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.EnumDepartmentWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.EnumDepartmentWithAggregatesFilter<never>, unknown>>>, z.ZodEnum<{
        OPERATION_TECHNOLOGY: "OPERATION_TECHNOLOGY";
        ACCOUNTING: "ACCOUNTING";
    }>]>>;
    start_date: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.DateTimeWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.DateTimeWithAggregatesFilter<never>, unknown>>>, z.ZodCoercedDate<unknown>]>>;
    supervisor: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.StringWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.StringWithAggregatesFilter<never>, unknown>>>, z.ZodString]>>;
    phone_number: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.StringWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.StringWithAggregatesFilter<never>, unknown>>>, z.ZodString]>>;
    personal_email: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.StringWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.StringWithAggregatesFilter<never>, unknown>>>, z.ZodString]>>;
    corporate_email: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.StringWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.StringWithAggregatesFilter<never>, unknown>>>, z.ZodString]>>;
}, z.core.$strict>;
export declare const ContentWhereInputObjectSchema: z.ZodType<Prisma.ContentWhereInput>;
export declare const ContentWhereInputObjectZodSchema: z.ZodObject<{
    AND: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.ContentWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentWhereInput, unknown>>>, z.ZodArray<z.ZodLazy<z.ZodType<Prisma.ContentWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentWhereInput, unknown>>>>]>>;
    OR: z.ZodOptional<z.ZodArray<z.ZodLazy<z.ZodType<Prisma.ContentWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentWhereInput, unknown>>>>>;
    NOT: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.ContentWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentWhereInput, unknown>>>, z.ZodArray<z.ZodLazy<z.ZodType<Prisma.ContentWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentWhereInput, unknown>>>>]>>;
    uuid: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.UuidFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.UuidFilter<never>, unknown>>>, z.ZodString]>>;
    title: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.StringFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.StringFilter<never>, unknown>>>, z.ZodString]>>;
    url: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.StringFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.StringFilter<never>, unknown>>>, z.ZodString]>>;
    content_owner: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.StringFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.StringFilter<never>, unknown>>>, z.ZodString]>>;
    for_position: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.EnumPositionFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.EnumPositionFilter<never>, unknown>>>, z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>]>>;
    last_modified_time: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.DateTimeFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.DateTimeFilter<never>, unknown>>>, z.ZodCoercedDate<unknown>]>>;
    expiration_time: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.DateTimeFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.DateTimeFilter<never>, unknown>>>, z.ZodCoercedDate<unknown>]>>;
    content_type: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.EnumContentTypeFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.EnumContentTypeFilter<never>, unknown>>>, z.ZodEnum<{
        REFERENCE: "REFERENCE";
        WORKFLOW: "WORKFLOW";
    }>]>>;
    status: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.EnumContentStatusFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.EnumContentStatusFilter<never>, unknown>>>, z.ZodEnum<{
        AVAILABLE: "AVAILABLE";
        IN_USE: "IN_USE";
        UNAVAILABLE: "UNAVAILABLE";
    }>]>>;
    is_favorite: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.BoolFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.BoolFilter<never>, unknown>>>, z.ZodBoolean]>>;
}, z.core.$strict>;
export declare const ContentOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.ContentOrderByWithRelationInput>;
export declare const ContentOrderByWithRelationInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    title: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    url: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    content_owner: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    for_position: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    last_modified_time: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    expiration_time: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    content_type: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    is_favorite: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strict>;
export declare const ContentWhereUniqueInputObjectSchema: z.ZodType<Prisma.ContentWhereUniqueInput>;
export declare const ContentWhereUniqueInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const ContentOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.ContentOrderByWithAggregationInput>;
export declare const ContentOrderByWithAggregationInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    title: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    url: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    content_owner: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    for_position: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    last_modified_time: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    expiration_time: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    content_type: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    is_favorite: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    _count: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.ContentCountOrderByAggregateInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentCountOrderByAggregateInput, unknown>>>>;
    _max: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.ContentMaxOrderByAggregateInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentMaxOrderByAggregateInput, unknown>>>>;
    _min: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.ContentMinOrderByAggregateInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentMinOrderByAggregateInput, unknown>>>>;
}, z.core.$strict>;
export declare const ContentScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.ContentScalarWhereWithAggregatesInput>;
export declare const ContentScalarWhereWithAggregatesInputObjectZodSchema: z.ZodObject<{
    AND: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.ContentScalarWhereWithAggregatesInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentScalarWhereWithAggregatesInput, unknown>>>, z.ZodArray<z.ZodLazy<z.ZodType<Prisma.ContentScalarWhereWithAggregatesInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentScalarWhereWithAggregatesInput, unknown>>>>]>>;
    OR: z.ZodOptional<z.ZodArray<z.ZodLazy<z.ZodType<Prisma.ContentScalarWhereWithAggregatesInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentScalarWhereWithAggregatesInput, unknown>>>>>;
    NOT: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.ContentScalarWhereWithAggregatesInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentScalarWhereWithAggregatesInput, unknown>>>, z.ZodArray<z.ZodLazy<z.ZodType<Prisma.ContentScalarWhereWithAggregatesInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentScalarWhereWithAggregatesInput, unknown>>>>]>>;
    uuid: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.UuidWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.UuidWithAggregatesFilter<never>, unknown>>>, z.ZodString]>>;
    title: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.StringWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.StringWithAggregatesFilter<never>, unknown>>>, z.ZodString]>>;
    url: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.StringWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.StringWithAggregatesFilter<never>, unknown>>>, z.ZodString]>>;
    content_owner: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.StringWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.StringWithAggregatesFilter<never>, unknown>>>, z.ZodString]>>;
    for_position: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.EnumPositionWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.EnumPositionWithAggregatesFilter<never>, unknown>>>, z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>]>>;
    last_modified_time: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.DateTimeWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.DateTimeWithAggregatesFilter<never>, unknown>>>, z.ZodCoercedDate<unknown>]>>;
    expiration_time: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.DateTimeWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.DateTimeWithAggregatesFilter<never>, unknown>>>, z.ZodCoercedDate<unknown>]>>;
    content_type: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.EnumContentTypeWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.EnumContentTypeWithAggregatesFilter<never>, unknown>>>, z.ZodEnum<{
        REFERENCE: "REFERENCE";
        WORKFLOW: "WORKFLOW";
    }>]>>;
    status: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.EnumContentStatusWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.EnumContentStatusWithAggregatesFilter<never>, unknown>>>, z.ZodEnum<{
        AVAILABLE: "AVAILABLE";
        IN_USE: "IN_USE";
        UNAVAILABLE: "UNAVAILABLE";
    }>]>>;
    is_favorite: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.BoolWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.BoolWithAggregatesFilter<never>, unknown>>>, z.ZodBoolean]>>;
}, z.core.$strict>;
export declare const AccountWhereInputObjectSchema: z.ZodType<Prisma.AccountWhereInput>;
export declare const AccountWhereInputObjectZodSchema: z.ZodObject<{
    AND: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.AccountWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereInput, unknown>>>, z.ZodArray<z.ZodLazy<z.ZodType<Prisma.AccountWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereInput, unknown>>>>]>>;
    OR: z.ZodOptional<z.ZodArray<z.ZodLazy<z.ZodType<Prisma.AccountWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereInput, unknown>>>>>;
    NOT: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.AccountWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereInput, unknown>>>, z.ZodArray<z.ZodLazy<z.ZodType<Prisma.AccountWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereInput, unknown>>>>]>>;
    employeeUuid: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.UuidFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.UuidFilter<never>, unknown>>>, z.ZodString]>>;
    username: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.StringFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.StringFilter<never>, unknown>>>, z.ZodString]>>;
    password: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.StringFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.StringFilter<never>, unknown>>>, z.ZodString]>>;
    type: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.EnumAccountTypeFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.EnumAccountTypeFilter<never>, unknown>>>, z.ZodEnum<{
        ADMIN: "ADMIN";
        EMPLOYEE: "EMPLOYEE";
    }>]>>;
    employee: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.EmployeeScalarRelationFilter, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeScalarRelationFilter, unknown>>>, z.ZodLazy<z.ZodType<Prisma.EmployeeWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeWhereInput, unknown>>>]>>;
}, z.core.$strict>;
export declare const AccountOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.AccountOrderByWithRelationInput>;
export declare const AccountOrderByWithRelationInputObjectZodSchema: z.ZodObject<{
    employeeUuid: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    username: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    password: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    type: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    employee: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.EmployeeOrderByWithRelationInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeOrderByWithRelationInput, unknown>>>>;
}, z.core.$strict>;
export declare const AccountWhereUniqueInputObjectSchema: z.ZodType<Prisma.AccountWhereUniqueInput>;
export declare const AccountWhereUniqueInputObjectZodSchema: z.ZodObject<{
    employeeUuid: z.ZodOptional<z.ZodString>;
    username: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const AccountOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.AccountOrderByWithAggregationInput>;
export declare const AccountOrderByWithAggregationInputObjectZodSchema: z.ZodObject<{
    employeeUuid: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    username: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    password: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    type: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    _count: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.AccountCountOrderByAggregateInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountCountOrderByAggregateInput, unknown>>>>;
    _max: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.AccountMaxOrderByAggregateInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountMaxOrderByAggregateInput, unknown>>>>;
    _min: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.AccountMinOrderByAggregateInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountMinOrderByAggregateInput, unknown>>>>;
}, z.core.$strict>;
export declare const AccountScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.AccountScalarWhereWithAggregatesInput>;
export declare const AccountScalarWhereWithAggregatesInputObjectZodSchema: z.ZodObject<{
    AND: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.AccountScalarWhereWithAggregatesInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountScalarWhereWithAggregatesInput, unknown>>>, z.ZodArray<z.ZodLazy<z.ZodType<Prisma.AccountScalarWhereWithAggregatesInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountScalarWhereWithAggregatesInput, unknown>>>>]>>;
    OR: z.ZodOptional<z.ZodArray<z.ZodLazy<z.ZodType<Prisma.AccountScalarWhereWithAggregatesInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountScalarWhereWithAggregatesInput, unknown>>>>>;
    NOT: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.AccountScalarWhereWithAggregatesInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountScalarWhereWithAggregatesInput, unknown>>>, z.ZodArray<z.ZodLazy<z.ZodType<Prisma.AccountScalarWhereWithAggregatesInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountScalarWhereWithAggregatesInput, unknown>>>>]>>;
    employeeUuid: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.UuidWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.UuidWithAggregatesFilter<never>, unknown>>>, z.ZodString]>>;
    username: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.StringWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.StringWithAggregatesFilter<never>, unknown>>>, z.ZodString]>>;
    password: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.StringWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.StringWithAggregatesFilter<never>, unknown>>>, z.ZodString]>>;
    type: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.EnumAccountTypeWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.EnumAccountTypeWithAggregatesFilter<never>, unknown>>>, z.ZodEnum<{
        ADMIN: "ADMIN";
        EMPLOYEE: "EMPLOYEE";
    }>]>>;
}, z.core.$strict>;
export declare const EmployeeCreateInputObjectSchema: z.ZodType<Prisma.EmployeeCreateInput>;
export declare const EmployeeCreateInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodString>;
    avatar: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    first_name: z.ZodString;
    last_name: z.ZodString;
    date_of_birth: z.ZodCoercedDate<unknown>;
    position: z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>;
    department: z.ZodEnum<{
        OPERATION_TECHNOLOGY: "OPERATION_TECHNOLOGY";
        ACCOUNTING: "ACCOUNTING";
    }>;
    start_date: z.ZodCoercedDate<unknown>;
    supervisor: z.ZodString;
    phone_number: z.ZodString;
    personal_email: z.ZodString;
    corporate_email: z.ZodString;
    account: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.AccountCreateNestedOneWithoutEmployeeInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountCreateNestedOneWithoutEmployeeInput, unknown>>>>;
}, z.core.$strict>;
export declare const EmployeeUncheckedCreateInputObjectSchema: z.ZodType<Prisma.EmployeeUncheckedCreateInput>;
export declare const EmployeeUncheckedCreateInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodString>;
    avatar: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    first_name: z.ZodString;
    last_name: z.ZodString;
    date_of_birth: z.ZodCoercedDate<unknown>;
    position: z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>;
    department: z.ZodEnum<{
        OPERATION_TECHNOLOGY: "OPERATION_TECHNOLOGY";
        ACCOUNTING: "ACCOUNTING";
    }>;
    start_date: z.ZodCoercedDate<unknown>;
    supervisor: z.ZodString;
    phone_number: z.ZodString;
    personal_email: z.ZodString;
    corporate_email: z.ZodString;
    account: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.AccountUncheckedCreateNestedOneWithoutEmployeeInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountUncheckedCreateNestedOneWithoutEmployeeInput, unknown>>>>;
}, z.core.$strict>;
export declare const EmployeeUpdateInputObjectSchema: z.ZodType<Prisma.EmployeeUpdateInput>;
export declare const EmployeeUpdateInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    avatar: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.NullableStringFieldUpdateOperationsInput, unknown>>>]>>>;
    first_name: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    last_name: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    date_of_birth: z.ZodOptional<z.ZodUnion<readonly [z.ZodCoercedDate<unknown>, z.ZodLazy<z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.DateTimeFieldUpdateOperationsInput, unknown>>>]>>;
    position: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>, z.ZodLazy<z.ZodType<Prisma.EnumPositionFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.EnumPositionFieldUpdateOperationsInput, unknown>>>]>>;
    department: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        OPERATION_TECHNOLOGY: "OPERATION_TECHNOLOGY";
        ACCOUNTING: "ACCOUNTING";
    }>, z.ZodLazy<z.ZodType<Prisma.EnumDepartmentFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.EnumDepartmentFieldUpdateOperationsInput, unknown>>>]>>;
    start_date: z.ZodOptional<z.ZodUnion<readonly [z.ZodCoercedDate<unknown>, z.ZodLazy<z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.DateTimeFieldUpdateOperationsInput, unknown>>>]>>;
    supervisor: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    phone_number: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    personal_email: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    corporate_email: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    account: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.AccountUpdateOneWithoutEmployeeNestedInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountUpdateOneWithoutEmployeeNestedInput, unknown>>>>;
}, z.core.$strict>;
export declare const EmployeeUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.EmployeeUncheckedUpdateInput>;
export declare const EmployeeUncheckedUpdateInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    avatar: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.NullableStringFieldUpdateOperationsInput, unknown>>>]>>>;
    first_name: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    last_name: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    date_of_birth: z.ZodOptional<z.ZodUnion<readonly [z.ZodCoercedDate<unknown>, z.ZodLazy<z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.DateTimeFieldUpdateOperationsInput, unknown>>>]>>;
    position: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>, z.ZodLazy<z.ZodType<Prisma.EnumPositionFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.EnumPositionFieldUpdateOperationsInput, unknown>>>]>>;
    department: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        OPERATION_TECHNOLOGY: "OPERATION_TECHNOLOGY";
        ACCOUNTING: "ACCOUNTING";
    }>, z.ZodLazy<z.ZodType<Prisma.EnumDepartmentFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.EnumDepartmentFieldUpdateOperationsInput, unknown>>>]>>;
    start_date: z.ZodOptional<z.ZodUnion<readonly [z.ZodCoercedDate<unknown>, z.ZodLazy<z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.DateTimeFieldUpdateOperationsInput, unknown>>>]>>;
    supervisor: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    phone_number: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    personal_email: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    corporate_email: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    account: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.AccountUncheckedUpdateOneWithoutEmployeeNestedInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountUncheckedUpdateOneWithoutEmployeeNestedInput, unknown>>>>;
}, z.core.$strict>;
export declare const EmployeeCreateManyInputObjectSchema: z.ZodType<Prisma.EmployeeCreateManyInput>;
export declare const EmployeeCreateManyInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodString>;
    avatar: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    first_name: z.ZodString;
    last_name: z.ZodString;
    date_of_birth: z.ZodCoercedDate<unknown>;
    position: z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>;
    department: z.ZodEnum<{
        OPERATION_TECHNOLOGY: "OPERATION_TECHNOLOGY";
        ACCOUNTING: "ACCOUNTING";
    }>;
    start_date: z.ZodCoercedDate<unknown>;
    supervisor: z.ZodString;
    phone_number: z.ZodString;
    personal_email: z.ZodString;
    corporate_email: z.ZodString;
}, z.core.$strict>;
export declare const EmployeeUpdateManyMutationInputObjectSchema: z.ZodType<Prisma.EmployeeUpdateManyMutationInput>;
export declare const EmployeeUpdateManyMutationInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    avatar: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.NullableStringFieldUpdateOperationsInput, unknown>>>]>>>;
    first_name: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    last_name: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    date_of_birth: z.ZodOptional<z.ZodUnion<readonly [z.ZodCoercedDate<unknown>, z.ZodLazy<z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.DateTimeFieldUpdateOperationsInput, unknown>>>]>>;
    position: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>, z.ZodLazy<z.ZodType<Prisma.EnumPositionFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.EnumPositionFieldUpdateOperationsInput, unknown>>>]>>;
    department: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        OPERATION_TECHNOLOGY: "OPERATION_TECHNOLOGY";
        ACCOUNTING: "ACCOUNTING";
    }>, z.ZodLazy<z.ZodType<Prisma.EnumDepartmentFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.EnumDepartmentFieldUpdateOperationsInput, unknown>>>]>>;
    start_date: z.ZodOptional<z.ZodUnion<readonly [z.ZodCoercedDate<unknown>, z.ZodLazy<z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.DateTimeFieldUpdateOperationsInput, unknown>>>]>>;
    supervisor: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    phone_number: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    personal_email: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    corporate_email: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
}, z.core.$strict>;
export declare const EmployeeUncheckedUpdateManyInputObjectSchema: z.ZodType<Prisma.EmployeeUncheckedUpdateManyInput>;
export declare const EmployeeUncheckedUpdateManyInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    avatar: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.NullableStringFieldUpdateOperationsInput, unknown>>>]>>>;
    first_name: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    last_name: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    date_of_birth: z.ZodOptional<z.ZodUnion<readonly [z.ZodCoercedDate<unknown>, z.ZodLazy<z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.DateTimeFieldUpdateOperationsInput, unknown>>>]>>;
    position: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>, z.ZodLazy<z.ZodType<Prisma.EnumPositionFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.EnumPositionFieldUpdateOperationsInput, unknown>>>]>>;
    department: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        OPERATION_TECHNOLOGY: "OPERATION_TECHNOLOGY";
        ACCOUNTING: "ACCOUNTING";
    }>, z.ZodLazy<z.ZodType<Prisma.EnumDepartmentFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.EnumDepartmentFieldUpdateOperationsInput, unknown>>>]>>;
    start_date: z.ZodOptional<z.ZodUnion<readonly [z.ZodCoercedDate<unknown>, z.ZodLazy<z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.DateTimeFieldUpdateOperationsInput, unknown>>>]>>;
    supervisor: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    phone_number: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    personal_email: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    corporate_email: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
}, z.core.$strict>;
export declare const ContentCreateInputObjectSchema: z.ZodType<Prisma.ContentCreateInput>;
export declare const ContentCreateInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    url: z.ZodString;
    content_owner: z.ZodString;
    for_position: z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>;
    last_modified_time: z.ZodCoercedDate<unknown>;
    expiration_time: z.ZodCoercedDate<unknown>;
    content_type: z.ZodEnum<{
        REFERENCE: "REFERENCE";
        WORKFLOW: "WORKFLOW";
    }>;
    status: z.ZodEnum<{
        AVAILABLE: "AVAILABLE";
        IN_USE: "IN_USE";
        UNAVAILABLE: "UNAVAILABLE";
    }>;
    is_favorite: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const ContentUncheckedCreateInputObjectSchema: z.ZodType<Prisma.ContentUncheckedCreateInput>;
export declare const ContentUncheckedCreateInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    url: z.ZodString;
    content_owner: z.ZodString;
    for_position: z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>;
    last_modified_time: z.ZodCoercedDate<unknown>;
    expiration_time: z.ZodCoercedDate<unknown>;
    content_type: z.ZodEnum<{
        REFERENCE: "REFERENCE";
        WORKFLOW: "WORKFLOW";
    }>;
    status: z.ZodEnum<{
        AVAILABLE: "AVAILABLE";
        IN_USE: "IN_USE";
        UNAVAILABLE: "UNAVAILABLE";
    }>;
    is_favorite: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const ContentUpdateInputObjectSchema: z.ZodType<Prisma.ContentUpdateInput>;
export declare const ContentUpdateInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    title: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    url: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    content_owner: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    for_position: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>, z.ZodLazy<z.ZodType<Prisma.EnumPositionFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.EnumPositionFieldUpdateOperationsInput, unknown>>>]>>;
    last_modified_time: z.ZodOptional<z.ZodUnion<readonly [z.ZodCoercedDate<unknown>, z.ZodLazy<z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.DateTimeFieldUpdateOperationsInput, unknown>>>]>>;
    expiration_time: z.ZodOptional<z.ZodUnion<readonly [z.ZodCoercedDate<unknown>, z.ZodLazy<z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.DateTimeFieldUpdateOperationsInput, unknown>>>]>>;
    content_type: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        REFERENCE: "REFERENCE";
        WORKFLOW: "WORKFLOW";
    }>, z.ZodLazy<z.ZodType<Prisma.EnumContentTypeFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.EnumContentTypeFieldUpdateOperationsInput, unknown>>>]>>;
    status: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        AVAILABLE: "AVAILABLE";
        IN_USE: "IN_USE";
        UNAVAILABLE: "UNAVAILABLE";
    }>, z.ZodLazy<z.ZodType<Prisma.EnumContentStatusFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.EnumContentStatusFieldUpdateOperationsInput, unknown>>>]>>;
    is_favorite: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLazy<z.ZodType<Prisma.BoolFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.BoolFieldUpdateOperationsInput, unknown>>>]>>;
}, z.core.$strict>;
export declare const ContentUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.ContentUncheckedUpdateInput>;
export declare const ContentUncheckedUpdateInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    title: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    url: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    content_owner: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    for_position: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>, z.ZodLazy<z.ZodType<Prisma.EnumPositionFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.EnumPositionFieldUpdateOperationsInput, unknown>>>]>>;
    last_modified_time: z.ZodOptional<z.ZodUnion<readonly [z.ZodCoercedDate<unknown>, z.ZodLazy<z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.DateTimeFieldUpdateOperationsInput, unknown>>>]>>;
    expiration_time: z.ZodOptional<z.ZodUnion<readonly [z.ZodCoercedDate<unknown>, z.ZodLazy<z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.DateTimeFieldUpdateOperationsInput, unknown>>>]>>;
    content_type: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        REFERENCE: "REFERENCE";
        WORKFLOW: "WORKFLOW";
    }>, z.ZodLazy<z.ZodType<Prisma.EnumContentTypeFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.EnumContentTypeFieldUpdateOperationsInput, unknown>>>]>>;
    status: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        AVAILABLE: "AVAILABLE";
        IN_USE: "IN_USE";
        UNAVAILABLE: "UNAVAILABLE";
    }>, z.ZodLazy<z.ZodType<Prisma.EnumContentStatusFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.EnumContentStatusFieldUpdateOperationsInput, unknown>>>]>>;
    is_favorite: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLazy<z.ZodType<Prisma.BoolFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.BoolFieldUpdateOperationsInput, unknown>>>]>>;
}, z.core.$strict>;
export declare const ContentCreateManyInputObjectSchema: z.ZodType<Prisma.ContentCreateManyInput>;
export declare const ContentCreateManyInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    url: z.ZodString;
    content_owner: z.ZodString;
    for_position: z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>;
    last_modified_time: z.ZodCoercedDate<unknown>;
    expiration_time: z.ZodCoercedDate<unknown>;
    content_type: z.ZodEnum<{
        REFERENCE: "REFERENCE";
        WORKFLOW: "WORKFLOW";
    }>;
    status: z.ZodEnum<{
        AVAILABLE: "AVAILABLE";
        IN_USE: "IN_USE";
        UNAVAILABLE: "UNAVAILABLE";
    }>;
    is_favorite: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const ContentUpdateManyMutationInputObjectSchema: z.ZodType<Prisma.ContentUpdateManyMutationInput>;
export declare const ContentUpdateManyMutationInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    title: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    url: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    content_owner: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    for_position: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>, z.ZodLazy<z.ZodType<Prisma.EnumPositionFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.EnumPositionFieldUpdateOperationsInput, unknown>>>]>>;
    last_modified_time: z.ZodOptional<z.ZodUnion<readonly [z.ZodCoercedDate<unknown>, z.ZodLazy<z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.DateTimeFieldUpdateOperationsInput, unknown>>>]>>;
    expiration_time: z.ZodOptional<z.ZodUnion<readonly [z.ZodCoercedDate<unknown>, z.ZodLazy<z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.DateTimeFieldUpdateOperationsInput, unknown>>>]>>;
    content_type: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        REFERENCE: "REFERENCE";
        WORKFLOW: "WORKFLOW";
    }>, z.ZodLazy<z.ZodType<Prisma.EnumContentTypeFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.EnumContentTypeFieldUpdateOperationsInput, unknown>>>]>>;
    status: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        AVAILABLE: "AVAILABLE";
        IN_USE: "IN_USE";
        UNAVAILABLE: "UNAVAILABLE";
    }>, z.ZodLazy<z.ZodType<Prisma.EnumContentStatusFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.EnumContentStatusFieldUpdateOperationsInput, unknown>>>]>>;
    is_favorite: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLazy<z.ZodType<Prisma.BoolFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.BoolFieldUpdateOperationsInput, unknown>>>]>>;
}, z.core.$strict>;
export declare const ContentUncheckedUpdateManyInputObjectSchema: z.ZodType<Prisma.ContentUncheckedUpdateManyInput>;
export declare const ContentUncheckedUpdateManyInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    title: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    url: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    content_owner: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    for_position: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>, z.ZodLazy<z.ZodType<Prisma.EnumPositionFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.EnumPositionFieldUpdateOperationsInput, unknown>>>]>>;
    last_modified_time: z.ZodOptional<z.ZodUnion<readonly [z.ZodCoercedDate<unknown>, z.ZodLazy<z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.DateTimeFieldUpdateOperationsInput, unknown>>>]>>;
    expiration_time: z.ZodOptional<z.ZodUnion<readonly [z.ZodCoercedDate<unknown>, z.ZodLazy<z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.DateTimeFieldUpdateOperationsInput, unknown>>>]>>;
    content_type: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        REFERENCE: "REFERENCE";
        WORKFLOW: "WORKFLOW";
    }>, z.ZodLazy<z.ZodType<Prisma.EnumContentTypeFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.EnumContentTypeFieldUpdateOperationsInput, unknown>>>]>>;
    status: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        AVAILABLE: "AVAILABLE";
        IN_USE: "IN_USE";
        UNAVAILABLE: "UNAVAILABLE";
    }>, z.ZodLazy<z.ZodType<Prisma.EnumContentStatusFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.EnumContentStatusFieldUpdateOperationsInput, unknown>>>]>>;
    is_favorite: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLazy<z.ZodType<Prisma.BoolFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.BoolFieldUpdateOperationsInput, unknown>>>]>>;
}, z.core.$strict>;
export declare const AccountCreateInputObjectSchema: z.ZodType<Prisma.AccountCreateInput>;
export declare const AccountCreateInputObjectZodSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
    type: z.ZodEnum<{
        ADMIN: "ADMIN";
        EMPLOYEE: "EMPLOYEE";
    }>;
    employee: z.ZodLazy<z.ZodType<Prisma.EmployeeCreateNestedOneWithoutAccountInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeCreateNestedOneWithoutAccountInput, unknown>>>;
}, z.core.$strict>;
export declare const AccountUncheckedCreateInputObjectSchema: z.ZodType<Prisma.AccountUncheckedCreateInput>;
export declare const AccountUncheckedCreateInputObjectZodSchema: z.ZodObject<{
    employeeUuid: z.ZodString;
    username: z.ZodString;
    password: z.ZodString;
    type: z.ZodEnum<{
        ADMIN: "ADMIN";
        EMPLOYEE: "EMPLOYEE";
    }>;
}, z.core.$strict>;
export declare const AccountUpdateInputObjectSchema: z.ZodType<Prisma.AccountUpdateInput>;
export declare const AccountUpdateInputObjectZodSchema: z.ZodObject<{
    username: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    password: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    type: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        ADMIN: "ADMIN";
        EMPLOYEE: "EMPLOYEE";
    }>, z.ZodLazy<z.ZodType<Prisma.EnumAccountTypeFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.EnumAccountTypeFieldUpdateOperationsInput, unknown>>>]>>;
    employee: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.EmployeeUpdateOneRequiredWithoutAccountNestedInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeUpdateOneRequiredWithoutAccountNestedInput, unknown>>>>;
}, z.core.$strict>;
export declare const AccountUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.AccountUncheckedUpdateInput>;
export declare const AccountUncheckedUpdateInputObjectZodSchema: z.ZodObject<{
    employeeUuid: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    username: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    password: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    type: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        ADMIN: "ADMIN";
        EMPLOYEE: "EMPLOYEE";
    }>, z.ZodLazy<z.ZodType<Prisma.EnumAccountTypeFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.EnumAccountTypeFieldUpdateOperationsInput, unknown>>>]>>;
}, z.core.$strict>;
export declare const AccountCreateManyInputObjectSchema: z.ZodType<Prisma.AccountCreateManyInput>;
export declare const AccountCreateManyInputObjectZodSchema: z.ZodObject<{
    employeeUuid: z.ZodString;
    username: z.ZodString;
    password: z.ZodString;
    type: z.ZodEnum<{
        ADMIN: "ADMIN";
        EMPLOYEE: "EMPLOYEE";
    }>;
}, z.core.$strict>;
export declare const AccountUpdateManyMutationInputObjectSchema: z.ZodType<Prisma.AccountUpdateManyMutationInput>;
export declare const AccountUpdateManyMutationInputObjectZodSchema: z.ZodObject<{
    username: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    password: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    type: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        ADMIN: "ADMIN";
        EMPLOYEE: "EMPLOYEE";
    }>, z.ZodLazy<z.ZodType<Prisma.EnumAccountTypeFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.EnumAccountTypeFieldUpdateOperationsInput, unknown>>>]>>;
}, z.core.$strict>;
export declare const AccountUncheckedUpdateManyInputObjectSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyInput>;
export declare const AccountUncheckedUpdateManyInputObjectZodSchema: z.ZodObject<{
    employeeUuid: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    username: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    password: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    type: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        ADMIN: "ADMIN";
        EMPLOYEE: "EMPLOYEE";
    }>, z.ZodLazy<z.ZodType<Prisma.EnumAccountTypeFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.EnumAccountTypeFieldUpdateOperationsInput, unknown>>>]>>;
}, z.core.$strict>;
export declare const UuidFilterObjectSchema: z.ZodType<Prisma.UuidFilter>;
export declare const UuidFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodString>;
    in: z.ZodOptional<z.ZodArray<z.ZodString>>;
    notIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
    lt: z.ZodOptional<z.ZodString>;
    lte: z.ZodOptional<z.ZodString>;
    gt: z.ZodOptional<z.ZodString>;
    gte: z.ZodOptional<z.ZodString>;
    mode: z.ZodOptional<z.ZodEnum<{
        default: "default";
        insensitive: "insensitive";
    }>>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.NestedUuidFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedUuidFilter<never>, unknown>>>]>>;
}, z.core.$strict>;
export declare const StringNullableFilterObjectSchema: z.ZodType<Prisma.StringNullableFilter>;
export declare const StringNullableFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    in: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    notIn: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    lt: z.ZodOptional<z.ZodString>;
    lte: z.ZodOptional<z.ZodString>;
    gt: z.ZodOptional<z.ZodString>;
    gte: z.ZodOptional<z.ZodString>;
    contains: z.ZodOptional<z.ZodString>;
    startsWith: z.ZodOptional<z.ZodString>;
    endsWith: z.ZodOptional<z.ZodString>;
    mode: z.ZodOptional<z.ZodEnum<{
        default: "default";
        insensitive: "insensitive";
    }>>;
    not: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.NestedStringNullableFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedStringNullableFilter<never>, unknown>>>]>>>;
}, z.core.$strict>;
export declare const StringFilterObjectSchema: z.ZodType<Prisma.StringFilter>;
export declare const StringFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodString>;
    in: z.ZodOptional<z.ZodArray<z.ZodString>>;
    notIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
    lt: z.ZodOptional<z.ZodString>;
    lte: z.ZodOptional<z.ZodString>;
    gt: z.ZodOptional<z.ZodString>;
    gte: z.ZodOptional<z.ZodString>;
    contains: z.ZodOptional<z.ZodString>;
    startsWith: z.ZodOptional<z.ZodString>;
    endsWith: z.ZodOptional<z.ZodString>;
    mode: z.ZodOptional<z.ZodEnum<{
        default: "default";
        insensitive: "insensitive";
    }>>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.NestedStringFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedStringFilter<never>, unknown>>>]>>;
}, z.core.$strict>;
export declare const DateTimeFilterObjectSchema: z.ZodType<Prisma.DateTimeFilter>;
export declare const DateTimeFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    in: z.ZodOptional<z.ZodUnion<readonly [z.ZodArray<z.ZodDate>, z.ZodArray<z.ZodString>]>>;
    notIn: z.ZodOptional<z.ZodUnion<readonly [z.ZodArray<z.ZodDate>, z.ZodArray<z.ZodString>]>>;
    lt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    lte: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    gt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    gte: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodCoercedDate<unknown>, z.ZodLazy<z.ZodType<Prisma.NestedDateTimeFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedDateTimeFilter<never>, unknown>>>]>>;
}, z.core.$strict>;
export declare const EnumPositionFilterObjectSchema: z.ZodType<Prisma.EnumPositionFilter>;
export declare const EnumPositionFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>>;
    in: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>>>;
    notIn: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>>>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>, z.ZodLazy<z.ZodType<Prisma.NestedEnumPositionFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumPositionFilter<never>, unknown>>>]>>;
}, z.core.$strict>;
export declare const EnumDepartmentFilterObjectSchema: z.ZodType<Prisma.EnumDepartmentFilter>;
export declare const EnumDepartmentFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodEnum<{
        OPERATION_TECHNOLOGY: "OPERATION_TECHNOLOGY";
        ACCOUNTING: "ACCOUNTING";
    }>>;
    in: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        OPERATION_TECHNOLOGY: "OPERATION_TECHNOLOGY";
        ACCOUNTING: "ACCOUNTING";
    }>>>;
    notIn: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        OPERATION_TECHNOLOGY: "OPERATION_TECHNOLOGY";
        ACCOUNTING: "ACCOUNTING";
    }>>>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        OPERATION_TECHNOLOGY: "OPERATION_TECHNOLOGY";
        ACCOUNTING: "ACCOUNTING";
    }>, z.ZodLazy<z.ZodType<Prisma.NestedEnumDepartmentFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumDepartmentFilter<never>, unknown>>>]>>;
}, z.core.$strict>;
export declare const AccountNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.AccountNullableScalarRelationFilter>;
export declare const AccountNullableScalarRelationFilterObjectZodSchema: z.ZodObject<{
    is: z.ZodNullable<z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.AccountWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereInput, unknown>>>>>;
    isNot: z.ZodNullable<z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.AccountWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereInput, unknown>>>>>;
}, z.core.$strict>;
export declare const SortOrderInputObjectSchema: z.ZodType<Prisma.SortOrderInput>;
export declare const SortOrderInputObjectZodSchema: z.ZodObject<{
    sort: z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>;
    nulls: z.ZodOptional<z.ZodEnum<{
        first: "first";
        last: "last";
    }>>;
}, z.core.$strict>;
export declare const EmployeeCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.EmployeeCountOrderByAggregateInput>;
export declare const EmployeeCountOrderByAggregateInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    avatar: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    first_name: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    last_name: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    date_of_birth: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    position: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    department: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    start_date: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    supervisor: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    phone_number: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    personal_email: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    corporate_email: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strict>;
export declare const EmployeeMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.EmployeeMaxOrderByAggregateInput>;
export declare const EmployeeMaxOrderByAggregateInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    avatar: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    first_name: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    last_name: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    date_of_birth: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    position: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    department: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    start_date: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    supervisor: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    phone_number: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    personal_email: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    corporate_email: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strict>;
export declare const EmployeeMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.EmployeeMinOrderByAggregateInput>;
export declare const EmployeeMinOrderByAggregateInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    avatar: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    first_name: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    last_name: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    date_of_birth: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    position: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    department: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    start_date: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    supervisor: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    phone_number: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    personal_email: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    corporate_email: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strict>;
export declare const UuidWithAggregatesFilterObjectSchema: z.ZodType<Prisma.UuidWithAggregatesFilter>;
export declare const UuidWithAggregatesFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodString>;
    in: z.ZodOptional<z.ZodArray<z.ZodString>>;
    notIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
    lt: z.ZodOptional<z.ZodString>;
    lte: z.ZodOptional<z.ZodString>;
    gt: z.ZodOptional<z.ZodString>;
    gte: z.ZodOptional<z.ZodString>;
    mode: z.ZodOptional<z.ZodEnum<{
        default: "default";
        insensitive: "insensitive";
    }>>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.NestedUuidWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedUuidWithAggregatesFilter<never>, unknown>>>]>>;
    _count: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedIntFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedIntFilter<never>, unknown>>>>;
    _min: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedStringFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedStringFilter<never>, unknown>>>>;
    _max: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedStringFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedStringFilter<never>, unknown>>>>;
}, z.core.$strict>;
export declare const StringNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter>;
export declare const StringNullableWithAggregatesFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    in: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    notIn: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    lt: z.ZodOptional<z.ZodString>;
    lte: z.ZodOptional<z.ZodString>;
    gt: z.ZodOptional<z.ZodString>;
    gte: z.ZodOptional<z.ZodString>;
    contains: z.ZodOptional<z.ZodString>;
    startsWith: z.ZodOptional<z.ZodString>;
    endsWith: z.ZodOptional<z.ZodString>;
    mode: z.ZodOptional<z.ZodEnum<{
        default: "default";
        insensitive: "insensitive";
    }>>;
    not: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedStringNullableWithAggregatesFilter<never>, unknown>>>]>>>;
    _count: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedIntNullableFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedIntNullableFilter<never>, unknown>>>>;
    _min: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedStringNullableFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedStringNullableFilter<never>, unknown>>>>;
    _max: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedStringNullableFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedStringNullableFilter<never>, unknown>>>>;
}, z.core.$strict>;
export declare const StringWithAggregatesFilterObjectSchema: z.ZodType<Prisma.StringWithAggregatesFilter>;
export declare const StringWithAggregatesFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodString>;
    in: z.ZodOptional<z.ZodArray<z.ZodString>>;
    notIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
    lt: z.ZodOptional<z.ZodString>;
    lte: z.ZodOptional<z.ZodString>;
    gt: z.ZodOptional<z.ZodString>;
    gte: z.ZodOptional<z.ZodString>;
    contains: z.ZodOptional<z.ZodString>;
    startsWith: z.ZodOptional<z.ZodString>;
    endsWith: z.ZodOptional<z.ZodString>;
    mode: z.ZodOptional<z.ZodEnum<{
        default: "default";
        insensitive: "insensitive";
    }>>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.NestedStringWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedStringWithAggregatesFilter<never>, unknown>>>]>>;
    _count: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedIntFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedIntFilter<never>, unknown>>>>;
    _min: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedStringFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedStringFilter<never>, unknown>>>>;
    _max: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedStringFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedStringFilter<never>, unknown>>>>;
}, z.core.$strict>;
export declare const DateTimeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter>;
export declare const DateTimeWithAggregatesFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    in: z.ZodOptional<z.ZodUnion<readonly [z.ZodArray<z.ZodDate>, z.ZodArray<z.ZodString>]>>;
    notIn: z.ZodOptional<z.ZodUnion<readonly [z.ZodArray<z.ZodDate>, z.ZodArray<z.ZodString>]>>;
    lt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    lte: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    gt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    gte: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodCoercedDate<unknown>, z.ZodLazy<z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedDateTimeWithAggregatesFilter<never>, unknown>>>]>>;
    _count: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedIntFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedIntFilter<never>, unknown>>>>;
    _min: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedDateTimeFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedDateTimeFilter<never>, unknown>>>>;
    _max: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedDateTimeFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedDateTimeFilter<never>, unknown>>>>;
}, z.core.$strict>;
export declare const EnumPositionWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumPositionWithAggregatesFilter>;
export declare const EnumPositionWithAggregatesFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>>;
    in: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>>>;
    notIn: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>>>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>, z.ZodLazy<z.ZodType<Prisma.NestedEnumPositionWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumPositionWithAggregatesFilter<never>, unknown>>>]>>;
    _count: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedIntFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedIntFilter<never>, unknown>>>>;
    _min: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedEnumPositionFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumPositionFilter<never>, unknown>>>>;
    _max: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedEnumPositionFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumPositionFilter<never>, unknown>>>>;
}, z.core.$strict>;
export declare const EnumDepartmentWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumDepartmentWithAggregatesFilter>;
export declare const EnumDepartmentWithAggregatesFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodEnum<{
        OPERATION_TECHNOLOGY: "OPERATION_TECHNOLOGY";
        ACCOUNTING: "ACCOUNTING";
    }>>;
    in: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        OPERATION_TECHNOLOGY: "OPERATION_TECHNOLOGY";
        ACCOUNTING: "ACCOUNTING";
    }>>>;
    notIn: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        OPERATION_TECHNOLOGY: "OPERATION_TECHNOLOGY";
        ACCOUNTING: "ACCOUNTING";
    }>>>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        OPERATION_TECHNOLOGY: "OPERATION_TECHNOLOGY";
        ACCOUNTING: "ACCOUNTING";
    }>, z.ZodLazy<z.ZodType<Prisma.NestedEnumDepartmentWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumDepartmentWithAggregatesFilter<never>, unknown>>>]>>;
    _count: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedIntFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedIntFilter<never>, unknown>>>>;
    _min: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedEnumDepartmentFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumDepartmentFilter<never>, unknown>>>>;
    _max: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedEnumDepartmentFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumDepartmentFilter<never>, unknown>>>>;
}, z.core.$strict>;
export declare const EnumContentTypeFilterObjectSchema: z.ZodType<Prisma.EnumContentTypeFilter>;
export declare const EnumContentTypeFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodEnum<{
        REFERENCE: "REFERENCE";
        WORKFLOW: "WORKFLOW";
    }>>;
    in: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        REFERENCE: "REFERENCE";
        WORKFLOW: "WORKFLOW";
    }>>>;
    notIn: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        REFERENCE: "REFERENCE";
        WORKFLOW: "WORKFLOW";
    }>>>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        REFERENCE: "REFERENCE";
        WORKFLOW: "WORKFLOW";
    }>, z.ZodLazy<z.ZodType<Prisma.NestedEnumContentTypeFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumContentTypeFilter<never>, unknown>>>]>>;
}, z.core.$strict>;
export declare const EnumContentStatusFilterObjectSchema: z.ZodType<Prisma.EnumContentStatusFilter>;
export declare const EnumContentStatusFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodEnum<{
        AVAILABLE: "AVAILABLE";
        IN_USE: "IN_USE";
        UNAVAILABLE: "UNAVAILABLE";
    }>>;
    in: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        AVAILABLE: "AVAILABLE";
        IN_USE: "IN_USE";
        UNAVAILABLE: "UNAVAILABLE";
    }>>>;
    notIn: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        AVAILABLE: "AVAILABLE";
        IN_USE: "IN_USE";
        UNAVAILABLE: "UNAVAILABLE";
    }>>>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        AVAILABLE: "AVAILABLE";
        IN_USE: "IN_USE";
        UNAVAILABLE: "UNAVAILABLE";
    }>, z.ZodLazy<z.ZodType<Prisma.NestedEnumContentStatusFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumContentStatusFilter<never>, unknown>>>]>>;
}, z.core.$strict>;
export declare const BoolFilterObjectSchema: z.ZodType<Prisma.BoolFilter>;
export declare const BoolFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodBoolean>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLazy<z.ZodType<Prisma.NestedBoolFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedBoolFilter<never>, unknown>>>]>>;
}, z.core.$strict>;
export declare const ContentCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ContentCountOrderByAggregateInput>;
export declare const ContentCountOrderByAggregateInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    title: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    url: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    content_owner: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    for_position: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    last_modified_time: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    expiration_time: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    content_type: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    is_favorite: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strict>;
export declare const ContentMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ContentMaxOrderByAggregateInput>;
export declare const ContentMaxOrderByAggregateInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    title: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    url: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    content_owner: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    for_position: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    last_modified_time: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    expiration_time: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    content_type: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    is_favorite: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strict>;
export declare const ContentMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ContentMinOrderByAggregateInput>;
export declare const ContentMinOrderByAggregateInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    title: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    url: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    content_owner: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    for_position: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    last_modified_time: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    expiration_time: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    content_type: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    is_favorite: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strict>;
export declare const EnumContentTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumContentTypeWithAggregatesFilter>;
export declare const EnumContentTypeWithAggregatesFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodEnum<{
        REFERENCE: "REFERENCE";
        WORKFLOW: "WORKFLOW";
    }>>;
    in: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        REFERENCE: "REFERENCE";
        WORKFLOW: "WORKFLOW";
    }>>>;
    notIn: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        REFERENCE: "REFERENCE";
        WORKFLOW: "WORKFLOW";
    }>>>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        REFERENCE: "REFERENCE";
        WORKFLOW: "WORKFLOW";
    }>, z.ZodLazy<z.ZodType<Prisma.NestedEnumContentTypeWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumContentTypeWithAggregatesFilter<never>, unknown>>>]>>;
    _count: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedIntFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedIntFilter<never>, unknown>>>>;
    _min: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedEnumContentTypeFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumContentTypeFilter<never>, unknown>>>>;
    _max: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedEnumContentTypeFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumContentTypeFilter<never>, unknown>>>>;
}, z.core.$strict>;
export declare const EnumContentStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumContentStatusWithAggregatesFilter>;
export declare const EnumContentStatusWithAggregatesFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodEnum<{
        AVAILABLE: "AVAILABLE";
        IN_USE: "IN_USE";
        UNAVAILABLE: "UNAVAILABLE";
    }>>;
    in: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        AVAILABLE: "AVAILABLE";
        IN_USE: "IN_USE";
        UNAVAILABLE: "UNAVAILABLE";
    }>>>;
    notIn: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        AVAILABLE: "AVAILABLE";
        IN_USE: "IN_USE";
        UNAVAILABLE: "UNAVAILABLE";
    }>>>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        AVAILABLE: "AVAILABLE";
        IN_USE: "IN_USE";
        UNAVAILABLE: "UNAVAILABLE";
    }>, z.ZodLazy<z.ZodType<Prisma.NestedEnumContentStatusWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumContentStatusWithAggregatesFilter<never>, unknown>>>]>>;
    _count: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedIntFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedIntFilter<never>, unknown>>>>;
    _min: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedEnumContentStatusFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumContentStatusFilter<never>, unknown>>>>;
    _max: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedEnumContentStatusFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumContentStatusFilter<never>, unknown>>>>;
}, z.core.$strict>;
export declare const BoolWithAggregatesFilterObjectSchema: z.ZodType<Prisma.BoolWithAggregatesFilter>;
export declare const BoolWithAggregatesFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodBoolean>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLazy<z.ZodType<Prisma.NestedBoolWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedBoolWithAggregatesFilter<never>, unknown>>>]>>;
    _count: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedIntFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedIntFilter<never>, unknown>>>>;
    _min: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedBoolFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedBoolFilter<never>, unknown>>>>;
    _max: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedBoolFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedBoolFilter<never>, unknown>>>>;
}, z.core.$strict>;
export declare const EnumAccountTypeFilterObjectSchema: z.ZodType<Prisma.EnumAccountTypeFilter>;
export declare const EnumAccountTypeFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodEnum<{
        ADMIN: "ADMIN";
        EMPLOYEE: "EMPLOYEE";
    }>>;
    in: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        ADMIN: "ADMIN";
        EMPLOYEE: "EMPLOYEE";
    }>>>;
    notIn: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        ADMIN: "ADMIN";
        EMPLOYEE: "EMPLOYEE";
    }>>>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        ADMIN: "ADMIN";
        EMPLOYEE: "EMPLOYEE";
    }>, z.ZodLazy<z.ZodType<Prisma.NestedEnumAccountTypeFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumAccountTypeFilter<never>, unknown>>>]>>;
}, z.core.$strict>;
export declare const EmployeeScalarRelationFilterObjectSchema: z.ZodType<Prisma.EmployeeScalarRelationFilter>;
export declare const EmployeeScalarRelationFilterObjectZodSchema: z.ZodObject<{
    is: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.EmployeeWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeWhereInput, unknown>>>>;
    isNot: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.EmployeeWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeWhereInput, unknown>>>>;
}, z.core.$strict>;
export declare const AccountCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.AccountCountOrderByAggregateInput>;
export declare const AccountCountOrderByAggregateInputObjectZodSchema: z.ZodObject<{
    employeeUuid: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    username: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    password: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    type: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strict>;
export declare const AccountMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.AccountMaxOrderByAggregateInput>;
export declare const AccountMaxOrderByAggregateInputObjectZodSchema: z.ZodObject<{
    employeeUuid: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    username: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    password: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    type: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strict>;
export declare const AccountMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.AccountMinOrderByAggregateInput>;
export declare const AccountMinOrderByAggregateInputObjectZodSchema: z.ZodObject<{
    employeeUuid: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    username: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    password: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    type: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strict>;
export declare const EnumAccountTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumAccountTypeWithAggregatesFilter>;
export declare const EnumAccountTypeWithAggregatesFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodEnum<{
        ADMIN: "ADMIN";
        EMPLOYEE: "EMPLOYEE";
    }>>;
    in: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        ADMIN: "ADMIN";
        EMPLOYEE: "EMPLOYEE";
    }>>>;
    notIn: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        ADMIN: "ADMIN";
        EMPLOYEE: "EMPLOYEE";
    }>>>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        ADMIN: "ADMIN";
        EMPLOYEE: "EMPLOYEE";
    }>, z.ZodLazy<z.ZodType<Prisma.NestedEnumAccountTypeWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumAccountTypeWithAggregatesFilter<never>, unknown>>>]>>;
    _count: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedIntFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedIntFilter<never>, unknown>>>>;
    _min: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedEnumAccountTypeFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumAccountTypeFilter<never>, unknown>>>>;
    _max: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedEnumAccountTypeFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumAccountTypeFilter<never>, unknown>>>>;
}, z.core.$strict>;
export declare const AccountCreateNestedOneWithoutEmployeeInputObjectSchema: z.ZodType<Prisma.AccountCreateNestedOneWithoutEmployeeInput>;
export declare const AccountCreateNestedOneWithoutEmployeeInputObjectZodSchema: z.ZodObject<{
    create: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.AccountCreateWithoutEmployeeInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountCreateWithoutEmployeeInput, unknown>>>, z.ZodLazy<z.ZodType<Prisma.AccountUncheckedCreateWithoutEmployeeInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountUncheckedCreateWithoutEmployeeInput, unknown>>>]>>;
    connectOrCreate: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.AccountCreateOrConnectWithoutEmployeeInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountCreateOrConnectWithoutEmployeeInput, unknown>>>>;
    connect: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.AccountWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereUniqueInput, unknown>>>>;
}, z.core.$strict>;
export declare const AccountUncheckedCreateNestedOneWithoutEmployeeInputObjectSchema: z.ZodType<Prisma.AccountUncheckedCreateNestedOneWithoutEmployeeInput>;
export declare const AccountUncheckedCreateNestedOneWithoutEmployeeInputObjectZodSchema: z.ZodObject<{
    create: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.AccountCreateWithoutEmployeeInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountCreateWithoutEmployeeInput, unknown>>>, z.ZodLazy<z.ZodType<Prisma.AccountUncheckedCreateWithoutEmployeeInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountUncheckedCreateWithoutEmployeeInput, unknown>>>]>>;
    connectOrCreate: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.AccountCreateOrConnectWithoutEmployeeInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountCreateOrConnectWithoutEmployeeInput, unknown>>>>;
    connect: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.AccountWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereUniqueInput, unknown>>>>;
}, z.core.$strict>;
export declare const StringFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput>;
export declare const StringFieldUpdateOperationsInputObjectZodSchema: z.ZodObject<{
    set: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const NullableStringFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput>;
export declare const NullableStringFieldUpdateOperationsInputObjectZodSchema: z.ZodObject<{
    set: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const DateTimeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput>;
export declare const DateTimeFieldUpdateOperationsInputObjectZodSchema: z.ZodObject<{
    set: z.ZodOptional<z.ZodCoercedDate<unknown>>;
}, z.core.$strict>;
export declare const EnumPositionFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumPositionFieldUpdateOperationsInput>;
export declare const EnumPositionFieldUpdateOperationsInputObjectZodSchema: z.ZodObject<{
    set: z.ZodOptional<z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>>;
}, z.core.$strict>;
export declare const EnumDepartmentFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumDepartmentFieldUpdateOperationsInput>;
export declare const EnumDepartmentFieldUpdateOperationsInputObjectZodSchema: z.ZodObject<{
    set: z.ZodOptional<z.ZodEnum<{
        OPERATION_TECHNOLOGY: "OPERATION_TECHNOLOGY";
        ACCOUNTING: "ACCOUNTING";
    }>>;
}, z.core.$strict>;
export declare const AccountUpdateOneWithoutEmployeeNestedInputObjectSchema: z.ZodType<Prisma.AccountUpdateOneWithoutEmployeeNestedInput>;
export declare const AccountUpdateOneWithoutEmployeeNestedInputObjectZodSchema: z.ZodObject<{
    create: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.AccountCreateWithoutEmployeeInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountCreateWithoutEmployeeInput, unknown>>>, z.ZodLazy<z.ZodType<Prisma.AccountUncheckedCreateWithoutEmployeeInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountUncheckedCreateWithoutEmployeeInput, unknown>>>]>>;
    connectOrCreate: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.AccountCreateOrConnectWithoutEmployeeInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountCreateOrConnectWithoutEmployeeInput, unknown>>>>;
    upsert: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.AccountUpsertWithoutEmployeeInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountUpsertWithoutEmployeeInput, unknown>>>>;
    disconnect: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLazy<z.ZodType<Prisma.AccountWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereInput, unknown>>>]>>;
    delete: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLazy<z.ZodType<Prisma.AccountWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereInput, unknown>>>]>>;
    connect: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.AccountWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereUniqueInput, unknown>>>>;
    update: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.AccountUpdateToOneWithWhereWithoutEmployeeInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountUpdateToOneWithWhereWithoutEmployeeInput, unknown>>>, z.ZodLazy<z.ZodType<Prisma.AccountUpdateWithoutEmployeeInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountUpdateWithoutEmployeeInput, unknown>>>, z.ZodLazy<z.ZodType<Prisma.AccountUncheckedUpdateWithoutEmployeeInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountUncheckedUpdateWithoutEmployeeInput, unknown>>>]>>;
}, z.core.$strict>;
export declare const AccountUncheckedUpdateOneWithoutEmployeeNestedInputObjectSchema: z.ZodType<Prisma.AccountUncheckedUpdateOneWithoutEmployeeNestedInput>;
export declare const AccountUncheckedUpdateOneWithoutEmployeeNestedInputObjectZodSchema: z.ZodObject<{
    create: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.AccountCreateWithoutEmployeeInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountCreateWithoutEmployeeInput, unknown>>>, z.ZodLazy<z.ZodType<Prisma.AccountUncheckedCreateWithoutEmployeeInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountUncheckedCreateWithoutEmployeeInput, unknown>>>]>>;
    connectOrCreate: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.AccountCreateOrConnectWithoutEmployeeInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountCreateOrConnectWithoutEmployeeInput, unknown>>>>;
    upsert: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.AccountUpsertWithoutEmployeeInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountUpsertWithoutEmployeeInput, unknown>>>>;
    disconnect: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLazy<z.ZodType<Prisma.AccountWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereInput, unknown>>>]>>;
    delete: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLazy<z.ZodType<Prisma.AccountWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereInput, unknown>>>]>>;
    connect: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.AccountWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereUniqueInput, unknown>>>>;
    update: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.AccountUpdateToOneWithWhereWithoutEmployeeInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountUpdateToOneWithWhereWithoutEmployeeInput, unknown>>>, z.ZodLazy<z.ZodType<Prisma.AccountUpdateWithoutEmployeeInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountUpdateWithoutEmployeeInput, unknown>>>, z.ZodLazy<z.ZodType<Prisma.AccountUncheckedUpdateWithoutEmployeeInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountUncheckedUpdateWithoutEmployeeInput, unknown>>>]>>;
}, z.core.$strict>;
export declare const EnumContentTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumContentTypeFieldUpdateOperationsInput>;
export declare const EnumContentTypeFieldUpdateOperationsInputObjectZodSchema: z.ZodObject<{
    set: z.ZodOptional<z.ZodEnum<{
        REFERENCE: "REFERENCE";
        WORKFLOW: "WORKFLOW";
    }>>;
}, z.core.$strict>;
export declare const EnumContentStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumContentStatusFieldUpdateOperationsInput>;
export declare const EnumContentStatusFieldUpdateOperationsInputObjectZodSchema: z.ZodObject<{
    set: z.ZodOptional<z.ZodEnum<{
        AVAILABLE: "AVAILABLE";
        IN_USE: "IN_USE";
        UNAVAILABLE: "UNAVAILABLE";
    }>>;
}, z.core.$strict>;
export declare const BoolFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput>;
export declare const BoolFieldUpdateOperationsInputObjectZodSchema: z.ZodObject<{
    set: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const EmployeeCreateNestedOneWithoutAccountInputObjectSchema: z.ZodType<Prisma.EmployeeCreateNestedOneWithoutAccountInput>;
export declare const EmployeeCreateNestedOneWithoutAccountInputObjectZodSchema: z.ZodObject<{
    create: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.EmployeeCreateWithoutAccountInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeCreateWithoutAccountInput, unknown>>>, z.ZodLazy<z.ZodType<Prisma.EmployeeUncheckedCreateWithoutAccountInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeUncheckedCreateWithoutAccountInput, unknown>>>]>>;
    connectOrCreate: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.EmployeeCreateOrConnectWithoutAccountInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeCreateOrConnectWithoutAccountInput, unknown>>>>;
    connect: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.EmployeeWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeWhereUniqueInput, unknown>>>>;
}, z.core.$strict>;
export declare const EnumAccountTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumAccountTypeFieldUpdateOperationsInput>;
export declare const EnumAccountTypeFieldUpdateOperationsInputObjectZodSchema: z.ZodObject<{
    set: z.ZodOptional<z.ZodEnum<{
        ADMIN: "ADMIN";
        EMPLOYEE: "EMPLOYEE";
    }>>;
}, z.core.$strict>;
export declare const EmployeeUpdateOneRequiredWithoutAccountNestedInputObjectSchema: z.ZodType<Prisma.EmployeeUpdateOneRequiredWithoutAccountNestedInput>;
export declare const EmployeeUpdateOneRequiredWithoutAccountNestedInputObjectZodSchema: z.ZodObject<{
    create: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.EmployeeCreateWithoutAccountInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeCreateWithoutAccountInput, unknown>>>, z.ZodLazy<z.ZodType<Prisma.EmployeeUncheckedCreateWithoutAccountInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeUncheckedCreateWithoutAccountInput, unknown>>>]>>;
    connectOrCreate: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.EmployeeCreateOrConnectWithoutAccountInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeCreateOrConnectWithoutAccountInput, unknown>>>>;
    upsert: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.EmployeeUpsertWithoutAccountInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeUpsertWithoutAccountInput, unknown>>>>;
    connect: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.EmployeeWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeWhereUniqueInput, unknown>>>>;
    update: z.ZodOptional<z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.EmployeeUpdateToOneWithWhereWithoutAccountInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeUpdateToOneWithWhereWithoutAccountInput, unknown>>>, z.ZodLazy<z.ZodType<Prisma.EmployeeUpdateWithoutAccountInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeUpdateWithoutAccountInput, unknown>>>, z.ZodLazy<z.ZodType<Prisma.EmployeeUncheckedUpdateWithoutAccountInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeUncheckedUpdateWithoutAccountInput, unknown>>>]>>;
}, z.core.$strict>;
export declare const NestedUuidFilterObjectSchema: z.ZodType<Prisma.NestedUuidFilter>;
export declare const NestedUuidFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodString>;
    in: z.ZodOptional<z.ZodArray<z.ZodString>>;
    notIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
    lt: z.ZodOptional<z.ZodString>;
    lte: z.ZodOptional<z.ZodString>;
    gt: z.ZodOptional<z.ZodString>;
    gte: z.ZodOptional<z.ZodString>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.NestedUuidFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedUuidFilter<never>, unknown>>>]>>;
}, z.core.$strict>;
export declare const NestedStringNullableFilterObjectSchema: z.ZodType<Prisma.NestedStringNullableFilter>;
export declare const NestedStringNullableFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    in: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    notIn: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    lt: z.ZodOptional<z.ZodString>;
    lte: z.ZodOptional<z.ZodString>;
    gt: z.ZodOptional<z.ZodString>;
    gte: z.ZodOptional<z.ZodString>;
    contains: z.ZodOptional<z.ZodString>;
    startsWith: z.ZodOptional<z.ZodString>;
    endsWith: z.ZodOptional<z.ZodString>;
    not: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.NestedStringNullableFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedStringNullableFilter<never>, unknown>>>]>>>;
}, z.core.$strict>;
export declare const NestedStringFilterObjectSchema: z.ZodType<Prisma.NestedStringFilter>;
export declare const NestedStringFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodString>;
    in: z.ZodOptional<z.ZodArray<z.ZodString>>;
    notIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
    lt: z.ZodOptional<z.ZodString>;
    lte: z.ZodOptional<z.ZodString>;
    gt: z.ZodOptional<z.ZodString>;
    gte: z.ZodOptional<z.ZodString>;
    contains: z.ZodOptional<z.ZodString>;
    startsWith: z.ZodOptional<z.ZodString>;
    endsWith: z.ZodOptional<z.ZodString>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.NestedStringFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedStringFilter<never>, unknown>>>]>>;
}, z.core.$strict>;
export declare const NestedDateTimeFilterObjectSchema: z.ZodType<Prisma.NestedDateTimeFilter>;
export declare const NestedDateTimeFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    in: z.ZodOptional<z.ZodUnion<readonly [z.ZodArray<z.ZodDate>, z.ZodArray<z.ZodString>]>>;
    notIn: z.ZodOptional<z.ZodUnion<readonly [z.ZodArray<z.ZodDate>, z.ZodArray<z.ZodString>]>>;
    lt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    lte: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    gt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    gte: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodCoercedDate<unknown>, z.ZodLazy<z.ZodType<Prisma.NestedDateTimeFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedDateTimeFilter<never>, unknown>>>]>>;
}, z.core.$strict>;
export declare const NestedEnumPositionFilterObjectSchema: z.ZodType<Prisma.NestedEnumPositionFilter>;
export declare const NestedEnumPositionFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>>;
    in: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>>>;
    notIn: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>>>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>, z.ZodLazy<z.ZodType<Prisma.NestedEnumPositionFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumPositionFilter<never>, unknown>>>]>>;
}, z.core.$strict>;
export declare const NestedEnumDepartmentFilterObjectSchema: z.ZodType<Prisma.NestedEnumDepartmentFilter>;
export declare const NestedEnumDepartmentFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodEnum<{
        OPERATION_TECHNOLOGY: "OPERATION_TECHNOLOGY";
        ACCOUNTING: "ACCOUNTING";
    }>>;
    in: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        OPERATION_TECHNOLOGY: "OPERATION_TECHNOLOGY";
        ACCOUNTING: "ACCOUNTING";
    }>>>;
    notIn: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        OPERATION_TECHNOLOGY: "OPERATION_TECHNOLOGY";
        ACCOUNTING: "ACCOUNTING";
    }>>>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        OPERATION_TECHNOLOGY: "OPERATION_TECHNOLOGY";
        ACCOUNTING: "ACCOUNTING";
    }>, z.ZodLazy<z.ZodType<Prisma.NestedEnumDepartmentFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumDepartmentFilter<never>, unknown>>>]>>;
}, z.core.$strict>;
export declare const NestedUuidWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedUuidWithAggregatesFilter>;
export declare const NestedUuidWithAggregatesFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodString>;
    in: z.ZodOptional<z.ZodArray<z.ZodString>>;
    notIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
    lt: z.ZodOptional<z.ZodString>;
    lte: z.ZodOptional<z.ZodString>;
    gt: z.ZodOptional<z.ZodString>;
    gte: z.ZodOptional<z.ZodString>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.NestedUuidWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedUuidWithAggregatesFilter<never>, unknown>>>]>>;
    _count: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedIntFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedIntFilter<never>, unknown>>>>;
    _min: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedStringFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedStringFilter<never>, unknown>>>>;
    _max: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedStringFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedStringFilter<never>, unknown>>>>;
}, z.core.$strict>;
export declare const NestedIntFilterObjectSchema: z.ZodType<Prisma.NestedIntFilter>;
export declare const NestedIntFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodNumber>;
    in: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    notIn: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    lt: z.ZodOptional<z.ZodNumber>;
    lte: z.ZodOptional<z.ZodNumber>;
    gt: z.ZodOptional<z.ZodNumber>;
    gte: z.ZodOptional<z.ZodNumber>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodLazy<z.ZodType<Prisma.NestedIntFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedIntFilter<never>, unknown>>>]>>;
}, z.core.$strict>;
export declare const NestedStringNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter>;
export declare const NestedStringNullableWithAggregatesFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    in: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    notIn: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    lt: z.ZodOptional<z.ZodString>;
    lte: z.ZodOptional<z.ZodString>;
    gt: z.ZodOptional<z.ZodString>;
    gte: z.ZodOptional<z.ZodString>;
    contains: z.ZodOptional<z.ZodString>;
    startsWith: z.ZodOptional<z.ZodString>;
    endsWith: z.ZodOptional<z.ZodString>;
    not: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedStringNullableWithAggregatesFilter<never>, unknown>>>]>>>;
    _count: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedIntNullableFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedIntNullableFilter<never>, unknown>>>>;
    _min: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedStringNullableFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedStringNullableFilter<never>, unknown>>>>;
    _max: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedStringNullableFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedStringNullableFilter<never>, unknown>>>>;
}, z.core.$strict>;
export declare const NestedIntNullableFilterObjectSchema: z.ZodType<Prisma.NestedIntNullableFilter>;
export declare const NestedIntNullableFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    in: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodNumber>>>;
    notIn: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodNumber>>>;
    lt: z.ZodOptional<z.ZodNumber>;
    lte: z.ZodOptional<z.ZodNumber>;
    gt: z.ZodOptional<z.ZodNumber>;
    gte: z.ZodOptional<z.ZodNumber>;
    not: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodLazy<z.ZodType<Prisma.NestedIntNullableFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedIntNullableFilter<never>, unknown>>>]>>>;
}, z.core.$strict>;
export declare const NestedStringWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter>;
export declare const NestedStringWithAggregatesFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodString>;
    in: z.ZodOptional<z.ZodArray<z.ZodString>>;
    notIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
    lt: z.ZodOptional<z.ZodString>;
    lte: z.ZodOptional<z.ZodString>;
    gt: z.ZodOptional<z.ZodString>;
    gte: z.ZodOptional<z.ZodString>;
    contains: z.ZodOptional<z.ZodString>;
    startsWith: z.ZodOptional<z.ZodString>;
    endsWith: z.ZodOptional<z.ZodString>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.NestedStringWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedStringWithAggregatesFilter<never>, unknown>>>]>>;
    _count: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedIntFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedIntFilter<never>, unknown>>>>;
    _min: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedStringFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedStringFilter<never>, unknown>>>>;
    _max: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedStringFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedStringFilter<never>, unknown>>>>;
}, z.core.$strict>;
export declare const NestedDateTimeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter>;
export declare const NestedDateTimeWithAggregatesFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    in: z.ZodOptional<z.ZodUnion<readonly [z.ZodArray<z.ZodDate>, z.ZodArray<z.ZodString>]>>;
    notIn: z.ZodOptional<z.ZodUnion<readonly [z.ZodArray<z.ZodDate>, z.ZodArray<z.ZodString>]>>;
    lt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    lte: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    gt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    gte: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodCoercedDate<unknown>, z.ZodLazy<z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedDateTimeWithAggregatesFilter<never>, unknown>>>]>>;
    _count: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedIntFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedIntFilter<never>, unknown>>>>;
    _min: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedDateTimeFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedDateTimeFilter<never>, unknown>>>>;
    _max: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedDateTimeFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedDateTimeFilter<never>, unknown>>>>;
}, z.core.$strict>;
export declare const NestedEnumPositionWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumPositionWithAggregatesFilter>;
export declare const NestedEnumPositionWithAggregatesFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>>;
    in: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>>>;
    notIn: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>>>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>, z.ZodLazy<z.ZodType<Prisma.NestedEnumPositionWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumPositionWithAggregatesFilter<never>, unknown>>>]>>;
    _count: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedIntFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedIntFilter<never>, unknown>>>>;
    _min: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedEnumPositionFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumPositionFilter<never>, unknown>>>>;
    _max: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedEnumPositionFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumPositionFilter<never>, unknown>>>>;
}, z.core.$strict>;
export declare const NestedEnumDepartmentWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumDepartmentWithAggregatesFilter>;
export declare const NestedEnumDepartmentWithAggregatesFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodEnum<{
        OPERATION_TECHNOLOGY: "OPERATION_TECHNOLOGY";
        ACCOUNTING: "ACCOUNTING";
    }>>;
    in: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        OPERATION_TECHNOLOGY: "OPERATION_TECHNOLOGY";
        ACCOUNTING: "ACCOUNTING";
    }>>>;
    notIn: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        OPERATION_TECHNOLOGY: "OPERATION_TECHNOLOGY";
        ACCOUNTING: "ACCOUNTING";
    }>>>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        OPERATION_TECHNOLOGY: "OPERATION_TECHNOLOGY";
        ACCOUNTING: "ACCOUNTING";
    }>, z.ZodLazy<z.ZodType<Prisma.NestedEnumDepartmentWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumDepartmentWithAggregatesFilter<never>, unknown>>>]>>;
    _count: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedIntFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedIntFilter<never>, unknown>>>>;
    _min: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedEnumDepartmentFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumDepartmentFilter<never>, unknown>>>>;
    _max: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedEnumDepartmentFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumDepartmentFilter<never>, unknown>>>>;
}, z.core.$strict>;
export declare const NestedEnumContentTypeFilterObjectSchema: z.ZodType<Prisma.NestedEnumContentTypeFilter>;
export declare const NestedEnumContentTypeFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodEnum<{
        REFERENCE: "REFERENCE";
        WORKFLOW: "WORKFLOW";
    }>>;
    in: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        REFERENCE: "REFERENCE";
        WORKFLOW: "WORKFLOW";
    }>>>;
    notIn: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        REFERENCE: "REFERENCE";
        WORKFLOW: "WORKFLOW";
    }>>>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        REFERENCE: "REFERENCE";
        WORKFLOW: "WORKFLOW";
    }>, z.ZodLazy<z.ZodType<Prisma.NestedEnumContentTypeFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumContentTypeFilter<never>, unknown>>>]>>;
}, z.core.$strict>;
export declare const NestedEnumContentStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumContentStatusFilter>;
export declare const NestedEnumContentStatusFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodEnum<{
        AVAILABLE: "AVAILABLE";
        IN_USE: "IN_USE";
        UNAVAILABLE: "UNAVAILABLE";
    }>>;
    in: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        AVAILABLE: "AVAILABLE";
        IN_USE: "IN_USE";
        UNAVAILABLE: "UNAVAILABLE";
    }>>>;
    notIn: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        AVAILABLE: "AVAILABLE";
        IN_USE: "IN_USE";
        UNAVAILABLE: "UNAVAILABLE";
    }>>>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        AVAILABLE: "AVAILABLE";
        IN_USE: "IN_USE";
        UNAVAILABLE: "UNAVAILABLE";
    }>, z.ZodLazy<z.ZodType<Prisma.NestedEnumContentStatusFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumContentStatusFilter<never>, unknown>>>]>>;
}, z.core.$strict>;
export declare const NestedBoolFilterObjectSchema: z.ZodType<Prisma.NestedBoolFilter>;
export declare const NestedBoolFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodBoolean>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLazy<z.ZodType<Prisma.NestedBoolFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedBoolFilter<never>, unknown>>>]>>;
}, z.core.$strict>;
export declare const NestedEnumContentTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumContentTypeWithAggregatesFilter>;
export declare const NestedEnumContentTypeWithAggregatesFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodEnum<{
        REFERENCE: "REFERENCE";
        WORKFLOW: "WORKFLOW";
    }>>;
    in: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        REFERENCE: "REFERENCE";
        WORKFLOW: "WORKFLOW";
    }>>>;
    notIn: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        REFERENCE: "REFERENCE";
        WORKFLOW: "WORKFLOW";
    }>>>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        REFERENCE: "REFERENCE";
        WORKFLOW: "WORKFLOW";
    }>, z.ZodLazy<z.ZodType<Prisma.NestedEnumContentTypeWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumContentTypeWithAggregatesFilter<never>, unknown>>>]>>;
    _count: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedIntFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedIntFilter<never>, unknown>>>>;
    _min: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedEnumContentTypeFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumContentTypeFilter<never>, unknown>>>>;
    _max: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedEnumContentTypeFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumContentTypeFilter<never>, unknown>>>>;
}, z.core.$strict>;
export declare const NestedEnumContentStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumContentStatusWithAggregatesFilter>;
export declare const NestedEnumContentStatusWithAggregatesFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodEnum<{
        AVAILABLE: "AVAILABLE";
        IN_USE: "IN_USE";
        UNAVAILABLE: "UNAVAILABLE";
    }>>;
    in: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        AVAILABLE: "AVAILABLE";
        IN_USE: "IN_USE";
        UNAVAILABLE: "UNAVAILABLE";
    }>>>;
    notIn: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        AVAILABLE: "AVAILABLE";
        IN_USE: "IN_USE";
        UNAVAILABLE: "UNAVAILABLE";
    }>>>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        AVAILABLE: "AVAILABLE";
        IN_USE: "IN_USE";
        UNAVAILABLE: "UNAVAILABLE";
    }>, z.ZodLazy<z.ZodType<Prisma.NestedEnumContentStatusWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumContentStatusWithAggregatesFilter<never>, unknown>>>]>>;
    _count: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedIntFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedIntFilter<never>, unknown>>>>;
    _min: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedEnumContentStatusFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumContentStatusFilter<never>, unknown>>>>;
    _max: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedEnumContentStatusFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumContentStatusFilter<never>, unknown>>>>;
}, z.core.$strict>;
export declare const NestedBoolWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter>;
export declare const NestedBoolWithAggregatesFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodBoolean>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLazy<z.ZodType<Prisma.NestedBoolWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedBoolWithAggregatesFilter<never>, unknown>>>]>>;
    _count: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedIntFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedIntFilter<never>, unknown>>>>;
    _min: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedBoolFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedBoolFilter<never>, unknown>>>>;
    _max: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedBoolFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedBoolFilter<never>, unknown>>>>;
}, z.core.$strict>;
export declare const NestedEnumAccountTypeFilterObjectSchema: z.ZodType<Prisma.NestedEnumAccountTypeFilter>;
export declare const NestedEnumAccountTypeFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodEnum<{
        ADMIN: "ADMIN";
        EMPLOYEE: "EMPLOYEE";
    }>>;
    in: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        ADMIN: "ADMIN";
        EMPLOYEE: "EMPLOYEE";
    }>>>;
    notIn: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        ADMIN: "ADMIN";
        EMPLOYEE: "EMPLOYEE";
    }>>>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        ADMIN: "ADMIN";
        EMPLOYEE: "EMPLOYEE";
    }>, z.ZodLazy<z.ZodType<Prisma.NestedEnumAccountTypeFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumAccountTypeFilter<never>, unknown>>>]>>;
}, z.core.$strict>;
export declare const NestedEnumAccountTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumAccountTypeWithAggregatesFilter>;
export declare const NestedEnumAccountTypeWithAggregatesFilterObjectZodSchema: z.ZodObject<{
    equals: z.ZodOptional<z.ZodEnum<{
        ADMIN: "ADMIN";
        EMPLOYEE: "EMPLOYEE";
    }>>;
    in: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        ADMIN: "ADMIN";
        EMPLOYEE: "EMPLOYEE";
    }>>>;
    notIn: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        ADMIN: "ADMIN";
        EMPLOYEE: "EMPLOYEE";
    }>>>;
    not: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        ADMIN: "ADMIN";
        EMPLOYEE: "EMPLOYEE";
    }>, z.ZodLazy<z.ZodType<Prisma.NestedEnumAccountTypeWithAggregatesFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumAccountTypeWithAggregatesFilter<never>, unknown>>>]>>;
    _count: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedIntFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedIntFilter<never>, unknown>>>>;
    _min: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedEnumAccountTypeFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumAccountTypeFilter<never>, unknown>>>>;
    _max: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.NestedEnumAccountTypeFilter<never>, unknown, z.core.$ZodTypeInternals<Prisma.NestedEnumAccountTypeFilter<never>, unknown>>>>;
}, z.core.$strict>;
export declare const AccountCreateWithoutEmployeeInputObjectSchema: z.ZodType<Prisma.AccountCreateWithoutEmployeeInput>;
export declare const AccountCreateWithoutEmployeeInputObjectZodSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
    type: z.ZodEnum<{
        ADMIN: "ADMIN";
        EMPLOYEE: "EMPLOYEE";
    }>;
}, z.core.$strict>;
export declare const AccountUncheckedCreateWithoutEmployeeInputObjectSchema: z.ZodType<Prisma.AccountUncheckedCreateWithoutEmployeeInput>;
export declare const AccountUncheckedCreateWithoutEmployeeInputObjectZodSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
    type: z.ZodEnum<{
        ADMIN: "ADMIN";
        EMPLOYEE: "EMPLOYEE";
    }>;
}, z.core.$strict>;
export declare const AccountCreateOrConnectWithoutEmployeeInputObjectSchema: z.ZodType<Prisma.AccountCreateOrConnectWithoutEmployeeInput>;
export declare const AccountCreateOrConnectWithoutEmployeeInputObjectZodSchema: z.ZodObject<{
    where: z.ZodLazy<z.ZodType<Prisma.AccountWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereUniqueInput, unknown>>>;
    create: z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.AccountCreateWithoutEmployeeInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountCreateWithoutEmployeeInput, unknown>>>, z.ZodLazy<z.ZodType<Prisma.AccountUncheckedCreateWithoutEmployeeInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountUncheckedCreateWithoutEmployeeInput, unknown>>>]>;
}, z.core.$strict>;
export declare const AccountUpsertWithoutEmployeeInputObjectSchema: z.ZodType<Prisma.AccountUpsertWithoutEmployeeInput>;
export declare const AccountUpsertWithoutEmployeeInputObjectZodSchema: z.ZodObject<{
    update: z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.AccountUpdateWithoutEmployeeInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountUpdateWithoutEmployeeInput, unknown>>>, z.ZodLazy<z.ZodType<Prisma.AccountUncheckedUpdateWithoutEmployeeInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountUncheckedUpdateWithoutEmployeeInput, unknown>>>]>;
    create: z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.AccountCreateWithoutEmployeeInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountCreateWithoutEmployeeInput, unknown>>>, z.ZodLazy<z.ZodType<Prisma.AccountUncheckedCreateWithoutEmployeeInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountUncheckedCreateWithoutEmployeeInput, unknown>>>]>;
    where: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.AccountWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereInput, unknown>>>>;
}, z.core.$strict>;
export declare const AccountUpdateToOneWithWhereWithoutEmployeeInputObjectSchema: z.ZodType<Prisma.AccountUpdateToOneWithWhereWithoutEmployeeInput>;
export declare const AccountUpdateToOneWithWhereWithoutEmployeeInputObjectZodSchema: z.ZodObject<{
    where: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.AccountWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereInput, unknown>>>>;
    data: z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.AccountUpdateWithoutEmployeeInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountUpdateWithoutEmployeeInput, unknown>>>, z.ZodLazy<z.ZodType<Prisma.AccountUncheckedUpdateWithoutEmployeeInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountUncheckedUpdateWithoutEmployeeInput, unknown>>>]>;
}, z.core.$strict>;
export declare const AccountUpdateWithoutEmployeeInputObjectSchema: z.ZodType<Prisma.AccountUpdateWithoutEmployeeInput>;
export declare const AccountUpdateWithoutEmployeeInputObjectZodSchema: z.ZodObject<{
    username: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    password: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    type: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        ADMIN: "ADMIN";
        EMPLOYEE: "EMPLOYEE";
    }>, z.ZodLazy<z.ZodType<Prisma.EnumAccountTypeFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.EnumAccountTypeFieldUpdateOperationsInput, unknown>>>]>>;
}, z.core.$strict>;
export declare const AccountUncheckedUpdateWithoutEmployeeInputObjectSchema: z.ZodType<Prisma.AccountUncheckedUpdateWithoutEmployeeInput>;
export declare const AccountUncheckedUpdateWithoutEmployeeInputObjectZodSchema: z.ZodObject<{
    username: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    password: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    type: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        ADMIN: "ADMIN";
        EMPLOYEE: "EMPLOYEE";
    }>, z.ZodLazy<z.ZodType<Prisma.EnumAccountTypeFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.EnumAccountTypeFieldUpdateOperationsInput, unknown>>>]>>;
}, z.core.$strict>;
export declare const EmployeeCreateWithoutAccountInputObjectSchema: z.ZodType<Prisma.EmployeeCreateWithoutAccountInput>;
export declare const EmployeeCreateWithoutAccountInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodString>;
    avatar: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    first_name: z.ZodString;
    last_name: z.ZodString;
    date_of_birth: z.ZodCoercedDate<unknown>;
    position: z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>;
    department: z.ZodEnum<{
        OPERATION_TECHNOLOGY: "OPERATION_TECHNOLOGY";
        ACCOUNTING: "ACCOUNTING";
    }>;
    start_date: z.ZodCoercedDate<unknown>;
    supervisor: z.ZodString;
    phone_number: z.ZodString;
    personal_email: z.ZodString;
    corporate_email: z.ZodString;
}, z.core.$strict>;
export declare const EmployeeUncheckedCreateWithoutAccountInputObjectSchema: z.ZodType<Prisma.EmployeeUncheckedCreateWithoutAccountInput>;
export declare const EmployeeUncheckedCreateWithoutAccountInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodString>;
    avatar: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    first_name: z.ZodString;
    last_name: z.ZodString;
    date_of_birth: z.ZodCoercedDate<unknown>;
    position: z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>;
    department: z.ZodEnum<{
        OPERATION_TECHNOLOGY: "OPERATION_TECHNOLOGY";
        ACCOUNTING: "ACCOUNTING";
    }>;
    start_date: z.ZodCoercedDate<unknown>;
    supervisor: z.ZodString;
    phone_number: z.ZodString;
    personal_email: z.ZodString;
    corporate_email: z.ZodString;
}, z.core.$strict>;
export declare const EmployeeCreateOrConnectWithoutAccountInputObjectSchema: z.ZodType<Prisma.EmployeeCreateOrConnectWithoutAccountInput>;
export declare const EmployeeCreateOrConnectWithoutAccountInputObjectZodSchema: z.ZodObject<{
    where: z.ZodLazy<z.ZodType<Prisma.EmployeeWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeWhereUniqueInput, unknown>>>;
    create: z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.EmployeeCreateWithoutAccountInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeCreateWithoutAccountInput, unknown>>>, z.ZodLazy<z.ZodType<Prisma.EmployeeUncheckedCreateWithoutAccountInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeUncheckedCreateWithoutAccountInput, unknown>>>]>;
}, z.core.$strict>;
export declare const EmployeeUpsertWithoutAccountInputObjectSchema: z.ZodType<Prisma.EmployeeUpsertWithoutAccountInput>;
export declare const EmployeeUpsertWithoutAccountInputObjectZodSchema: z.ZodObject<{
    update: z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.EmployeeUpdateWithoutAccountInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeUpdateWithoutAccountInput, unknown>>>, z.ZodLazy<z.ZodType<Prisma.EmployeeUncheckedUpdateWithoutAccountInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeUncheckedUpdateWithoutAccountInput, unknown>>>]>;
    create: z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.EmployeeCreateWithoutAccountInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeCreateWithoutAccountInput, unknown>>>, z.ZodLazy<z.ZodType<Prisma.EmployeeUncheckedCreateWithoutAccountInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeUncheckedCreateWithoutAccountInput, unknown>>>]>;
    where: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.EmployeeWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeWhereInput, unknown>>>>;
}, z.core.$strict>;
export declare const EmployeeUpdateToOneWithWhereWithoutAccountInputObjectSchema: z.ZodType<Prisma.EmployeeUpdateToOneWithWhereWithoutAccountInput>;
export declare const EmployeeUpdateToOneWithWhereWithoutAccountInputObjectZodSchema: z.ZodObject<{
    where: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.EmployeeWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeWhereInput, unknown>>>>;
    data: z.ZodUnion<readonly [z.ZodLazy<z.ZodType<Prisma.EmployeeUpdateWithoutAccountInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeUpdateWithoutAccountInput, unknown>>>, z.ZodLazy<z.ZodType<Prisma.EmployeeUncheckedUpdateWithoutAccountInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeUncheckedUpdateWithoutAccountInput, unknown>>>]>;
}, z.core.$strict>;
export declare const EmployeeUpdateWithoutAccountInputObjectSchema: z.ZodType<Prisma.EmployeeUpdateWithoutAccountInput>;
export declare const EmployeeUpdateWithoutAccountInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    avatar: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.NullableStringFieldUpdateOperationsInput, unknown>>>]>>>;
    first_name: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    last_name: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    date_of_birth: z.ZodOptional<z.ZodUnion<readonly [z.ZodCoercedDate<unknown>, z.ZodLazy<z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.DateTimeFieldUpdateOperationsInput, unknown>>>]>>;
    position: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>, z.ZodLazy<z.ZodType<Prisma.EnumPositionFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.EnumPositionFieldUpdateOperationsInput, unknown>>>]>>;
    department: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        OPERATION_TECHNOLOGY: "OPERATION_TECHNOLOGY";
        ACCOUNTING: "ACCOUNTING";
    }>, z.ZodLazy<z.ZodType<Prisma.EnumDepartmentFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.EnumDepartmentFieldUpdateOperationsInput, unknown>>>]>>;
    start_date: z.ZodOptional<z.ZodUnion<readonly [z.ZodCoercedDate<unknown>, z.ZodLazy<z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.DateTimeFieldUpdateOperationsInput, unknown>>>]>>;
    supervisor: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    phone_number: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    personal_email: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    corporate_email: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
}, z.core.$strict>;
export declare const EmployeeUncheckedUpdateWithoutAccountInputObjectSchema: z.ZodType<Prisma.EmployeeUncheckedUpdateWithoutAccountInput>;
export declare const EmployeeUncheckedUpdateWithoutAccountInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    avatar: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.NullableStringFieldUpdateOperationsInput, unknown>>>]>>>;
    first_name: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    last_name: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    date_of_birth: z.ZodOptional<z.ZodUnion<readonly [z.ZodCoercedDate<unknown>, z.ZodLazy<z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.DateTimeFieldUpdateOperationsInput, unknown>>>]>>;
    position: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        UNDERWRITER: "UNDERWRITER";
        BUSINESS_ANALYST: "BUSINESS_ANALYST";
        ADMIN: "ADMIN";
    }>, z.ZodLazy<z.ZodType<Prisma.EnumPositionFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.EnumPositionFieldUpdateOperationsInput, unknown>>>]>>;
    department: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        OPERATION_TECHNOLOGY: "OPERATION_TECHNOLOGY";
        ACCOUNTING: "ACCOUNTING";
    }>, z.ZodLazy<z.ZodType<Prisma.EnumDepartmentFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.EnumDepartmentFieldUpdateOperationsInput, unknown>>>]>>;
    start_date: z.ZodOptional<z.ZodUnion<readonly [z.ZodCoercedDate<unknown>, z.ZodLazy<z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.DateTimeFieldUpdateOperationsInput, unknown>>>]>>;
    supervisor: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    phone_number: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    personal_email: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
    corporate_email: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLazy<z.ZodType<Prisma.StringFieldUpdateOperationsInput, unknown, z.core.$ZodTypeInternals<Prisma.StringFieldUpdateOperationsInput, unknown>>>]>>;
}, z.core.$strict>;
export declare const EmployeeCountAggregateInputObjectSchema: z.ZodType<Prisma.EmployeeCountAggregateInputType>;
export declare const EmployeeCountAggregateInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodLiteral<true>>;
    avatar: z.ZodOptional<z.ZodLiteral<true>>;
    first_name: z.ZodOptional<z.ZodLiteral<true>>;
    last_name: z.ZodOptional<z.ZodLiteral<true>>;
    date_of_birth: z.ZodOptional<z.ZodLiteral<true>>;
    position: z.ZodOptional<z.ZodLiteral<true>>;
    department: z.ZodOptional<z.ZodLiteral<true>>;
    start_date: z.ZodOptional<z.ZodLiteral<true>>;
    supervisor: z.ZodOptional<z.ZodLiteral<true>>;
    phone_number: z.ZodOptional<z.ZodLiteral<true>>;
    personal_email: z.ZodOptional<z.ZodLiteral<true>>;
    corporate_email: z.ZodOptional<z.ZodLiteral<true>>;
    _all: z.ZodOptional<z.ZodLiteral<true>>;
}, z.core.$strict>;
export declare const EmployeeMinAggregateInputObjectSchema: z.ZodType<Prisma.EmployeeMinAggregateInputType>;
export declare const EmployeeMinAggregateInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodLiteral<true>>;
    avatar: z.ZodOptional<z.ZodLiteral<true>>;
    first_name: z.ZodOptional<z.ZodLiteral<true>>;
    last_name: z.ZodOptional<z.ZodLiteral<true>>;
    date_of_birth: z.ZodOptional<z.ZodLiteral<true>>;
    position: z.ZodOptional<z.ZodLiteral<true>>;
    department: z.ZodOptional<z.ZodLiteral<true>>;
    start_date: z.ZodOptional<z.ZodLiteral<true>>;
    supervisor: z.ZodOptional<z.ZodLiteral<true>>;
    phone_number: z.ZodOptional<z.ZodLiteral<true>>;
    personal_email: z.ZodOptional<z.ZodLiteral<true>>;
    corporate_email: z.ZodOptional<z.ZodLiteral<true>>;
}, z.core.$strict>;
export declare const EmployeeMaxAggregateInputObjectSchema: z.ZodType<Prisma.EmployeeMaxAggregateInputType>;
export declare const EmployeeMaxAggregateInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodLiteral<true>>;
    avatar: z.ZodOptional<z.ZodLiteral<true>>;
    first_name: z.ZodOptional<z.ZodLiteral<true>>;
    last_name: z.ZodOptional<z.ZodLiteral<true>>;
    date_of_birth: z.ZodOptional<z.ZodLiteral<true>>;
    position: z.ZodOptional<z.ZodLiteral<true>>;
    department: z.ZodOptional<z.ZodLiteral<true>>;
    start_date: z.ZodOptional<z.ZodLiteral<true>>;
    supervisor: z.ZodOptional<z.ZodLiteral<true>>;
    phone_number: z.ZodOptional<z.ZodLiteral<true>>;
    personal_email: z.ZodOptional<z.ZodLiteral<true>>;
    corporate_email: z.ZodOptional<z.ZodLiteral<true>>;
}, z.core.$strict>;
export declare const ContentCountAggregateInputObjectSchema: z.ZodType<Prisma.ContentCountAggregateInputType>;
export declare const ContentCountAggregateInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodLiteral<true>>;
    title: z.ZodOptional<z.ZodLiteral<true>>;
    url: z.ZodOptional<z.ZodLiteral<true>>;
    content_owner: z.ZodOptional<z.ZodLiteral<true>>;
    for_position: z.ZodOptional<z.ZodLiteral<true>>;
    last_modified_time: z.ZodOptional<z.ZodLiteral<true>>;
    expiration_time: z.ZodOptional<z.ZodLiteral<true>>;
    content_type: z.ZodOptional<z.ZodLiteral<true>>;
    status: z.ZodOptional<z.ZodLiteral<true>>;
    is_favorite: z.ZodOptional<z.ZodLiteral<true>>;
    _all: z.ZodOptional<z.ZodLiteral<true>>;
}, z.core.$strict>;
export declare const ContentMinAggregateInputObjectSchema: z.ZodType<Prisma.ContentMinAggregateInputType>;
export declare const ContentMinAggregateInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodLiteral<true>>;
    title: z.ZodOptional<z.ZodLiteral<true>>;
    url: z.ZodOptional<z.ZodLiteral<true>>;
    content_owner: z.ZodOptional<z.ZodLiteral<true>>;
    for_position: z.ZodOptional<z.ZodLiteral<true>>;
    last_modified_time: z.ZodOptional<z.ZodLiteral<true>>;
    expiration_time: z.ZodOptional<z.ZodLiteral<true>>;
    content_type: z.ZodOptional<z.ZodLiteral<true>>;
    status: z.ZodOptional<z.ZodLiteral<true>>;
    is_favorite: z.ZodOptional<z.ZodLiteral<true>>;
}, z.core.$strict>;
export declare const ContentMaxAggregateInputObjectSchema: z.ZodType<Prisma.ContentMaxAggregateInputType>;
export declare const ContentMaxAggregateInputObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodLiteral<true>>;
    title: z.ZodOptional<z.ZodLiteral<true>>;
    url: z.ZodOptional<z.ZodLiteral<true>>;
    content_owner: z.ZodOptional<z.ZodLiteral<true>>;
    for_position: z.ZodOptional<z.ZodLiteral<true>>;
    last_modified_time: z.ZodOptional<z.ZodLiteral<true>>;
    expiration_time: z.ZodOptional<z.ZodLiteral<true>>;
    content_type: z.ZodOptional<z.ZodLiteral<true>>;
    status: z.ZodOptional<z.ZodLiteral<true>>;
    is_favorite: z.ZodOptional<z.ZodLiteral<true>>;
}, z.core.$strict>;
export declare const AccountCountAggregateInputObjectSchema: z.ZodType<Prisma.AccountCountAggregateInputType>;
export declare const AccountCountAggregateInputObjectZodSchema: z.ZodObject<{
    employeeUuid: z.ZodOptional<z.ZodLiteral<true>>;
    username: z.ZodOptional<z.ZodLiteral<true>>;
    password: z.ZodOptional<z.ZodLiteral<true>>;
    type: z.ZodOptional<z.ZodLiteral<true>>;
    _all: z.ZodOptional<z.ZodLiteral<true>>;
}, z.core.$strict>;
export declare const AccountMinAggregateInputObjectSchema: z.ZodType<Prisma.AccountMinAggregateInputType>;
export declare const AccountMinAggregateInputObjectZodSchema: z.ZodObject<{
    employeeUuid: z.ZodOptional<z.ZodLiteral<true>>;
    username: z.ZodOptional<z.ZodLiteral<true>>;
    password: z.ZodOptional<z.ZodLiteral<true>>;
    type: z.ZodOptional<z.ZodLiteral<true>>;
}, z.core.$strict>;
export declare const AccountMaxAggregateInputObjectSchema: z.ZodType<Prisma.AccountMaxAggregateInputType>;
export declare const AccountMaxAggregateInputObjectZodSchema: z.ZodObject<{
    employeeUuid: z.ZodOptional<z.ZodLiteral<true>>;
    username: z.ZodOptional<z.ZodLiteral<true>>;
    password: z.ZodOptional<z.ZodLiteral<true>>;
    type: z.ZodOptional<z.ZodLiteral<true>>;
}, z.core.$strict>;
export declare const EmployeeSelectObjectSchema: z.ZodType<Prisma.EmployeeSelect>;
export declare const EmployeeSelectObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodBoolean>;
    account: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLazy<z.ZodObject<{
        select: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.AccountSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.AccountSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>>;
        include: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.AccountInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.AccountInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>>;
    }, z.core.$strict>>]>>;
    avatar: z.ZodOptional<z.ZodBoolean>;
    first_name: z.ZodOptional<z.ZodBoolean>;
    last_name: z.ZodOptional<z.ZodBoolean>;
    date_of_birth: z.ZodOptional<z.ZodBoolean>;
    position: z.ZodOptional<z.ZodBoolean>;
    department: z.ZodOptional<z.ZodBoolean>;
    start_date: z.ZodOptional<z.ZodBoolean>;
    supervisor: z.ZodOptional<z.ZodBoolean>;
    phone_number: z.ZodOptional<z.ZodBoolean>;
    personal_email: z.ZodOptional<z.ZodBoolean>;
    corporate_email: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const ContentSelectObjectSchema: z.ZodType<Prisma.ContentSelect>;
export declare const ContentSelectObjectZodSchema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodBoolean>;
    title: z.ZodOptional<z.ZodBoolean>;
    url: z.ZodOptional<z.ZodBoolean>;
    content_owner: z.ZodOptional<z.ZodBoolean>;
    for_position: z.ZodOptional<z.ZodBoolean>;
    last_modified_time: z.ZodOptional<z.ZodBoolean>;
    expiration_time: z.ZodOptional<z.ZodBoolean>;
    content_type: z.ZodOptional<z.ZodBoolean>;
    status: z.ZodOptional<z.ZodBoolean>;
    is_favorite: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const AccountSelectObjectSchema: z.ZodType<Prisma.AccountSelect>;
export declare const AccountSelectObjectZodSchema: z.ZodObject<{
    employee: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLazy<z.ZodObject<{
        select: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.EmployeeSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>>;
        include: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.EmployeeInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>>;
    }, z.core.$strict>>]>>;
    employeeUuid: z.ZodOptional<z.ZodBoolean>;
    username: z.ZodOptional<z.ZodBoolean>;
    password: z.ZodOptional<z.ZodBoolean>;
    type: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const EmployeeArgsObjectSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.EmployeeSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>>;
    include: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.EmployeeInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>>;
}, z.core.$strict>;
export declare const EmployeeArgsObjectZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.EmployeeSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>>;
    include: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.EmployeeInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>>;
}, z.core.$strict>;
export declare const ContentArgsObjectSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.ContentSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.ContentSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>>;
}, z.core.$strict>;
export declare const ContentArgsObjectZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.ContentSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.ContentSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>>;
}, z.core.$strict>;
export declare const AccountArgsObjectSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.AccountSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.AccountSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>>;
    include: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.AccountInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.AccountInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>>;
}, z.core.$strict>;
export declare const AccountArgsObjectZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.AccountSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.AccountSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>>;
    include: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.AccountInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.AccountInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>>;
}, z.core.$strict>;
export declare const EmployeeIncludeObjectSchema: z.ZodType<Prisma.EmployeeInclude>;
export declare const EmployeeIncludeObjectZodSchema: z.ZodObject<{
    account: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLazy<z.ZodObject<{
        select: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.AccountSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.AccountSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>>;
        include: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.AccountInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.AccountInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>>;
    }, z.core.$strict>>]>>;
}, z.core.$strict>;
export declare const AccountIncludeObjectSchema: z.ZodType<Prisma.AccountInclude>;
export declare const AccountIncludeObjectZodSchema: z.ZodObject<{
    employee: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLazy<z.ZodObject<{
        select: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.EmployeeSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>>;
        include: z.ZodOptional<z.ZodLazy<z.ZodType<Prisma.EmployeeInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>>;
    }, z.core.$strict>>]>>;
}, z.core.$strict>;
export declare const EmployeeFindUniqueSchema: z.ZodType<Prisma.EmployeeFindUniqueArgs>;
export declare const EmployeeFindUniqueZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodType<Prisma.EmployeeSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    include: z.ZodOptional<z.ZodType<Prisma.EmployeeInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    where: z.ZodType<Prisma.EmployeeWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeWhereUniqueInput, unknown>>;
}, z.core.$strict>;
export declare const EmployeeFindUniqueOrThrowSchema: z.ZodType<Prisma.EmployeeFindUniqueOrThrowArgs>;
export declare const EmployeeFindUniqueOrThrowZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodType<Prisma.EmployeeSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    include: z.ZodOptional<z.ZodType<Prisma.EmployeeInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    where: z.ZodType<Prisma.EmployeeWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeWhereUniqueInput, unknown>>;
}, z.core.$strict>;
export declare const EmployeeFindFirstSelectSchema__findFirstEmployee_schema: z.ZodType<Prisma.EmployeeSelect>;
export declare const EmployeeFindFirstSelectZodSchema__findFirstEmployee_schema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodBoolean>;
    account: z.ZodOptional<z.ZodBoolean>;
    avatar: z.ZodOptional<z.ZodBoolean>;
    first_name: z.ZodOptional<z.ZodBoolean>;
    last_name: z.ZodOptional<z.ZodBoolean>;
    date_of_birth: z.ZodOptional<z.ZodBoolean>;
    position: z.ZodOptional<z.ZodBoolean>;
    department: z.ZodOptional<z.ZodBoolean>;
    start_date: z.ZodOptional<z.ZodBoolean>;
    supervisor: z.ZodOptional<z.ZodBoolean>;
    phone_number: z.ZodOptional<z.ZodBoolean>;
    personal_email: z.ZodOptional<z.ZodBoolean>;
    corporate_email: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const EmployeeFindFirstSchema: z.ZodType<Prisma.EmployeeFindFirstArgs>;
export declare const EmployeeFindFirstZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodType<Prisma.EmployeeSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    include: z.ZodLazy<z.ZodOptional<z.ZodType<Prisma.EmployeeInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>>;
    orderBy: z.ZodOptional<z.ZodUnion<readonly [z.ZodType<Prisma.EmployeeOrderByWithRelationInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeOrderByWithRelationInput, unknown>>, z.ZodArray<z.ZodType<Prisma.EmployeeOrderByWithRelationInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeOrderByWithRelationInput, unknown>>>]>>;
    where: z.ZodOptional<z.ZodType<Prisma.EmployeeWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeWhereInput, unknown>>>;
    cursor: z.ZodOptional<z.ZodType<Prisma.EmployeeWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeWhereUniqueInput, unknown>>>;
    take: z.ZodOptional<z.ZodNumber>;
    skip: z.ZodOptional<z.ZodNumber>;
    distinct: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        uuid: "uuid";
        avatar: "avatar";
        first_name: "first_name";
        last_name: "last_name";
        date_of_birth: "date_of_birth";
        position: "position";
        department: "department";
        start_date: "start_date";
        supervisor: "supervisor";
        phone_number: "phone_number";
        personal_email: "personal_email";
        corporate_email: "corporate_email";
    }>, z.ZodArray<z.ZodEnum<{
        uuid: "uuid";
        avatar: "avatar";
        first_name: "first_name";
        last_name: "last_name";
        date_of_birth: "date_of_birth";
        position: "position";
        department: "department";
        start_date: "start_date";
        supervisor: "supervisor";
        phone_number: "phone_number";
        personal_email: "personal_email";
        corporate_email: "corporate_email";
    }>>]>>;
}, z.core.$strict>;
export declare const EmployeeFindFirstOrThrowSelectSchema__findFirstOrThrowEmployee_schema: z.ZodType<Prisma.EmployeeSelect>;
export declare const EmployeeFindFirstOrThrowSelectZodSchema__findFirstOrThrowEmployee_schema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodBoolean>;
    account: z.ZodOptional<z.ZodBoolean>;
    avatar: z.ZodOptional<z.ZodBoolean>;
    first_name: z.ZodOptional<z.ZodBoolean>;
    last_name: z.ZodOptional<z.ZodBoolean>;
    date_of_birth: z.ZodOptional<z.ZodBoolean>;
    position: z.ZodOptional<z.ZodBoolean>;
    department: z.ZodOptional<z.ZodBoolean>;
    start_date: z.ZodOptional<z.ZodBoolean>;
    supervisor: z.ZodOptional<z.ZodBoolean>;
    phone_number: z.ZodOptional<z.ZodBoolean>;
    personal_email: z.ZodOptional<z.ZodBoolean>;
    corporate_email: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const EmployeeFindFirstOrThrowSchema: z.ZodType<Prisma.EmployeeFindFirstOrThrowArgs>;
export declare const EmployeeFindFirstOrThrowZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodType<Prisma.EmployeeSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    include: z.ZodLazy<z.ZodOptional<z.ZodType<Prisma.EmployeeInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>>;
    orderBy: z.ZodOptional<z.ZodUnion<readonly [z.ZodType<Prisma.EmployeeOrderByWithRelationInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeOrderByWithRelationInput, unknown>>, z.ZodArray<z.ZodType<Prisma.EmployeeOrderByWithRelationInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeOrderByWithRelationInput, unknown>>>]>>;
    where: z.ZodOptional<z.ZodType<Prisma.EmployeeWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeWhereInput, unknown>>>;
    cursor: z.ZodOptional<z.ZodType<Prisma.EmployeeWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeWhereUniqueInput, unknown>>>;
    take: z.ZodOptional<z.ZodNumber>;
    skip: z.ZodOptional<z.ZodNumber>;
    distinct: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        uuid: "uuid";
        avatar: "avatar";
        first_name: "first_name";
        last_name: "last_name";
        date_of_birth: "date_of_birth";
        position: "position";
        department: "department";
        start_date: "start_date";
        supervisor: "supervisor";
        phone_number: "phone_number";
        personal_email: "personal_email";
        corporate_email: "corporate_email";
    }>, z.ZodArray<z.ZodEnum<{
        uuid: "uuid";
        avatar: "avatar";
        first_name: "first_name";
        last_name: "last_name";
        date_of_birth: "date_of_birth";
        position: "position";
        department: "department";
        start_date: "start_date";
        supervisor: "supervisor";
        phone_number: "phone_number";
        personal_email: "personal_email";
        corporate_email: "corporate_email";
    }>>]>>;
}, z.core.$strict>;
export declare const EmployeeFindManySelectSchema__findManyEmployee_schema: z.ZodType<Prisma.EmployeeSelect>;
export declare const EmployeeFindManySelectZodSchema__findManyEmployee_schema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodBoolean>;
    account: z.ZodOptional<z.ZodBoolean>;
    avatar: z.ZodOptional<z.ZodBoolean>;
    first_name: z.ZodOptional<z.ZodBoolean>;
    last_name: z.ZodOptional<z.ZodBoolean>;
    date_of_birth: z.ZodOptional<z.ZodBoolean>;
    position: z.ZodOptional<z.ZodBoolean>;
    department: z.ZodOptional<z.ZodBoolean>;
    start_date: z.ZodOptional<z.ZodBoolean>;
    supervisor: z.ZodOptional<z.ZodBoolean>;
    phone_number: z.ZodOptional<z.ZodBoolean>;
    personal_email: z.ZodOptional<z.ZodBoolean>;
    corporate_email: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const EmployeeFindManySchema: z.ZodType<Prisma.EmployeeFindManyArgs>;
export declare const EmployeeFindManyZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodType<Prisma.EmployeeSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    include: z.ZodLazy<z.ZodOptional<z.ZodType<Prisma.EmployeeInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>>;
    orderBy: z.ZodOptional<z.ZodUnion<readonly [z.ZodType<Prisma.EmployeeOrderByWithRelationInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeOrderByWithRelationInput, unknown>>, z.ZodArray<z.ZodType<Prisma.EmployeeOrderByWithRelationInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeOrderByWithRelationInput, unknown>>>]>>;
    where: z.ZodOptional<z.ZodType<Prisma.EmployeeWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeWhereInput, unknown>>>;
    cursor: z.ZodOptional<z.ZodType<Prisma.EmployeeWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeWhereUniqueInput, unknown>>>;
    take: z.ZodOptional<z.ZodNumber>;
    skip: z.ZodOptional<z.ZodNumber>;
    distinct: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        uuid: "uuid";
        avatar: "avatar";
        first_name: "first_name";
        last_name: "last_name";
        date_of_birth: "date_of_birth";
        position: "position";
        department: "department";
        start_date: "start_date";
        supervisor: "supervisor";
        phone_number: "phone_number";
        personal_email: "personal_email";
        corporate_email: "corporate_email";
    }>, z.ZodArray<z.ZodEnum<{
        uuid: "uuid";
        avatar: "avatar";
        first_name: "first_name";
        last_name: "last_name";
        date_of_birth: "date_of_birth";
        position: "position";
        department: "department";
        start_date: "start_date";
        supervisor: "supervisor";
        phone_number: "phone_number";
        personal_email: "personal_email";
        corporate_email: "corporate_email";
    }>>]>>;
}, z.core.$strict>;
export declare const EmployeeCountSchema: z.ZodType<Prisma.EmployeeCountArgs>;
export declare const EmployeeCountZodSchema: z.ZodObject<{
    orderBy: z.ZodOptional<z.ZodUnion<readonly [z.ZodType<Prisma.EmployeeOrderByWithRelationInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeOrderByWithRelationInput, unknown>>, z.ZodArray<z.ZodType<Prisma.EmployeeOrderByWithRelationInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeOrderByWithRelationInput, unknown>>>]>>;
    where: z.ZodOptional<z.ZodType<Prisma.EmployeeWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeWhereInput, unknown>>>;
    cursor: z.ZodOptional<z.ZodType<Prisma.EmployeeWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeWhereUniqueInput, unknown>>>;
    take: z.ZodOptional<z.ZodNumber>;
    skip: z.ZodOptional<z.ZodNumber>;
    select: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<true>, z.ZodType<Prisma.EmployeeCountAggregateInputType, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeCountAggregateInputType, unknown>>]>>;
}, z.core.$strict>;
export declare const EmployeeCreateOneSchema: z.ZodType<Prisma.EmployeeCreateArgs>;
export declare const EmployeeCreateOneZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodType<Prisma.EmployeeSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    include: z.ZodOptional<z.ZodType<Prisma.EmployeeInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    data: z.ZodUnion<readonly [z.ZodType<Prisma.EmployeeCreateInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeCreateInput, unknown>>, z.ZodType<Prisma.EmployeeUncheckedCreateInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeUncheckedCreateInput, unknown>>]>;
}, z.core.$strict>;
export declare const EmployeeCreateManySchema: z.ZodType<Prisma.EmployeeCreateManyArgs>;
export declare const EmployeeCreateManyZodSchema: z.ZodObject<{
    data: z.ZodUnion<readonly [z.ZodType<Prisma.EmployeeCreateManyInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeCreateManyInput, unknown>>, z.ZodArray<z.ZodType<Prisma.EmployeeCreateManyInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeCreateManyInput, unknown>>>]>;
    skipDuplicates: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const EmployeeCreateManyAndReturnSchema: z.ZodType<Prisma.EmployeeCreateManyAndReturnArgs>;
export declare const EmployeeCreateManyAndReturnZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodType<Prisma.EmployeeSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    data: z.ZodUnion<readonly [z.ZodType<Prisma.EmployeeCreateManyInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeCreateManyInput, unknown>>, z.ZodArray<z.ZodType<Prisma.EmployeeCreateManyInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeCreateManyInput, unknown>>>]>;
    skipDuplicates: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const EmployeeDeleteOneSchema: z.ZodType<Prisma.EmployeeDeleteArgs>;
export declare const EmployeeDeleteOneZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodType<Prisma.EmployeeSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    include: z.ZodOptional<z.ZodType<Prisma.EmployeeInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    where: z.ZodType<Prisma.EmployeeWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeWhereUniqueInput, unknown>>;
}, z.core.$strict>;
export declare const EmployeeDeleteManySchema: z.ZodType<Prisma.EmployeeDeleteManyArgs>;
export declare const EmployeeDeleteManyZodSchema: z.ZodObject<{
    where: z.ZodOptional<z.ZodType<Prisma.EmployeeWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeWhereInput, unknown>>>;
}, z.core.$strict>;
export declare const EmployeeUpdateOneSchema: z.ZodType<Prisma.EmployeeUpdateArgs>;
export declare const EmployeeUpdateOneZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodType<Prisma.EmployeeSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    include: z.ZodOptional<z.ZodType<Prisma.EmployeeInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    data: z.ZodUnion<readonly [z.ZodType<Prisma.EmployeeUpdateInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeUpdateInput, unknown>>, z.ZodType<Prisma.EmployeeUncheckedUpdateInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeUncheckedUpdateInput, unknown>>]>;
    where: z.ZodType<Prisma.EmployeeWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeWhereUniqueInput, unknown>>;
}, z.core.$strict>;
export declare const EmployeeUpdateManySchema: z.ZodType<Prisma.EmployeeUpdateManyArgs>;
export declare const EmployeeUpdateManyZodSchema: z.ZodObject<{
    data: z.ZodType<Prisma.EmployeeUpdateManyMutationInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeUpdateManyMutationInput, unknown>>;
    where: z.ZodOptional<z.ZodType<Prisma.EmployeeWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeWhereInput, unknown>>>;
}, z.core.$strict>;
export declare const EmployeeUpdateManyAndReturnSchema: z.ZodType<Prisma.EmployeeUpdateManyAndReturnArgs>;
export declare const EmployeeUpdateManyAndReturnZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodType<Prisma.EmployeeSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    data: z.ZodType<Prisma.EmployeeUpdateManyMutationInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeUpdateManyMutationInput, unknown>>;
    where: z.ZodOptional<z.ZodType<Prisma.EmployeeWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeWhereInput, unknown>>>;
}, z.core.$strict>;
export declare const EmployeeUpsertOneSchema: z.ZodType<Prisma.EmployeeUpsertArgs>;
export declare const EmployeeUpsertOneZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodType<Prisma.EmployeeSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    include: z.ZodOptional<z.ZodType<Prisma.EmployeeInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    where: z.ZodType<Prisma.EmployeeWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeWhereUniqueInput, unknown>>;
    create: z.ZodUnion<readonly [z.ZodType<Prisma.EmployeeCreateInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeCreateInput, unknown>>, z.ZodType<Prisma.EmployeeUncheckedCreateInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeUncheckedCreateInput, unknown>>]>;
    update: z.ZodUnion<readonly [z.ZodType<Prisma.EmployeeUpdateInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeUpdateInput, unknown>>, z.ZodType<Prisma.EmployeeUncheckedUpdateInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeUncheckedUpdateInput, unknown>>]>;
}, z.core.$strict>;
export declare const EmployeeAggregateSchema: z.ZodType<Prisma.EmployeeAggregateArgs>;
export declare const EmployeeAggregateZodSchema: z.ZodObject<{
    orderBy: z.ZodOptional<z.ZodUnion<readonly [z.ZodType<Prisma.EmployeeOrderByWithRelationInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeOrderByWithRelationInput, unknown>>, z.ZodArray<z.ZodType<Prisma.EmployeeOrderByWithRelationInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeOrderByWithRelationInput, unknown>>>]>>;
    where: z.ZodOptional<z.ZodType<Prisma.EmployeeWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeWhereInput, unknown>>>;
    cursor: z.ZodOptional<z.ZodType<Prisma.EmployeeWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeWhereUniqueInput, unknown>>>;
    take: z.ZodOptional<z.ZodNumber>;
    skip: z.ZodOptional<z.ZodNumber>;
    _count: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<true>, z.ZodType<Prisma.EmployeeCountAggregateInputType, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeCountAggregateInputType, unknown>>]>>;
    _min: z.ZodOptional<z.ZodType<Prisma.EmployeeMinAggregateInputType, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeMinAggregateInputType, unknown>>>;
    _max: z.ZodOptional<z.ZodType<Prisma.EmployeeMaxAggregateInputType, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeMaxAggregateInputType, unknown>>>;
}, z.core.$strict>;
export declare const EmployeeGroupBySchema: z.ZodType<Prisma.EmployeeGroupByArgs>;
export declare const EmployeeGroupByZodSchema: z.ZodObject<{
    where: z.ZodOptional<z.ZodType<Prisma.EmployeeWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeWhereInput, unknown>>>;
    orderBy: z.ZodOptional<z.ZodUnion<readonly [z.ZodType<Prisma.EmployeeOrderByWithAggregationInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeOrderByWithAggregationInput, unknown>>, z.ZodArray<z.ZodType<Prisma.EmployeeOrderByWithAggregationInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeOrderByWithAggregationInput, unknown>>>]>>;
    having: z.ZodOptional<z.ZodType<Prisma.EmployeeScalarWhereWithAggregatesInput, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeScalarWhereWithAggregatesInput, unknown>>>;
    take: z.ZodOptional<z.ZodNumber>;
    skip: z.ZodOptional<z.ZodNumber>;
    by: z.ZodArray<z.ZodEnum<{
        uuid: "uuid";
        avatar: "avatar";
        first_name: "first_name";
        last_name: "last_name";
        date_of_birth: "date_of_birth";
        position: "position";
        department: "department";
        start_date: "start_date";
        supervisor: "supervisor";
        phone_number: "phone_number";
        personal_email: "personal_email";
        corporate_email: "corporate_email";
    }>>;
    _count: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<true>, z.ZodType<Prisma.EmployeeCountAggregateInputType, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeCountAggregateInputType, unknown>>]>>;
    _min: z.ZodOptional<z.ZodType<Prisma.EmployeeMinAggregateInputType, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeMinAggregateInputType, unknown>>>;
    _max: z.ZodOptional<z.ZodType<Prisma.EmployeeMaxAggregateInputType, unknown, z.core.$ZodTypeInternals<Prisma.EmployeeMaxAggregateInputType, unknown>>>;
}, z.core.$strict>;
export declare const ContentFindUniqueSchema: z.ZodType<Prisma.ContentFindUniqueArgs>;
export declare const ContentFindUniqueZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodType<Prisma.ContentSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.ContentSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    where: z.ZodType<Prisma.ContentWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentWhereUniqueInput, unknown>>;
}, z.core.$strict>;
export declare const ContentFindUniqueOrThrowSchema: z.ZodType<Prisma.ContentFindUniqueOrThrowArgs>;
export declare const ContentFindUniqueOrThrowZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodType<Prisma.ContentSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.ContentSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    where: z.ZodType<Prisma.ContentWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentWhereUniqueInput, unknown>>;
}, z.core.$strict>;
export declare const ContentFindFirstSelectSchema__findFirstContent_schema: z.ZodType<Prisma.ContentSelect>;
export declare const ContentFindFirstSelectZodSchema__findFirstContent_schema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodBoolean>;
    title: z.ZodOptional<z.ZodBoolean>;
    url: z.ZodOptional<z.ZodBoolean>;
    content_owner: z.ZodOptional<z.ZodBoolean>;
    for_position: z.ZodOptional<z.ZodBoolean>;
    last_modified_time: z.ZodOptional<z.ZodBoolean>;
    expiration_time: z.ZodOptional<z.ZodBoolean>;
    content_type: z.ZodOptional<z.ZodBoolean>;
    status: z.ZodOptional<z.ZodBoolean>;
    is_favorite: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const ContentFindFirstSchema: z.ZodType<Prisma.ContentFindFirstArgs>;
export declare const ContentFindFirstZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodType<Prisma.ContentSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.ContentSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    orderBy: z.ZodOptional<z.ZodUnion<readonly [z.ZodType<Prisma.ContentOrderByWithRelationInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentOrderByWithRelationInput, unknown>>, z.ZodArray<z.ZodType<Prisma.ContentOrderByWithRelationInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentOrderByWithRelationInput, unknown>>>]>>;
    where: z.ZodOptional<z.ZodType<Prisma.ContentWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentWhereInput, unknown>>>;
    cursor: z.ZodOptional<z.ZodType<Prisma.ContentWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentWhereUniqueInput, unknown>>>;
    take: z.ZodOptional<z.ZodNumber>;
    skip: z.ZodOptional<z.ZodNumber>;
    distinct: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        uuid: "uuid";
        url: "url";
        title: "title";
        content_owner: "content_owner";
        for_position: "for_position";
        last_modified_time: "last_modified_time";
        expiration_time: "expiration_time";
        content_type: "content_type";
        status: "status";
        is_favorite: "is_favorite";
    }>, z.ZodArray<z.ZodEnum<{
        uuid: "uuid";
        url: "url";
        title: "title";
        content_owner: "content_owner";
        for_position: "for_position";
        last_modified_time: "last_modified_time";
        expiration_time: "expiration_time";
        content_type: "content_type";
        status: "status";
        is_favorite: "is_favorite";
    }>>]>>;
}, z.core.$strict>;
export declare const ContentFindFirstOrThrowSelectSchema__findFirstOrThrowContent_schema: z.ZodType<Prisma.ContentSelect>;
export declare const ContentFindFirstOrThrowSelectZodSchema__findFirstOrThrowContent_schema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodBoolean>;
    title: z.ZodOptional<z.ZodBoolean>;
    url: z.ZodOptional<z.ZodBoolean>;
    content_owner: z.ZodOptional<z.ZodBoolean>;
    for_position: z.ZodOptional<z.ZodBoolean>;
    last_modified_time: z.ZodOptional<z.ZodBoolean>;
    expiration_time: z.ZodOptional<z.ZodBoolean>;
    content_type: z.ZodOptional<z.ZodBoolean>;
    status: z.ZodOptional<z.ZodBoolean>;
    is_favorite: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const ContentFindFirstOrThrowSchema: z.ZodType<Prisma.ContentFindFirstOrThrowArgs>;
export declare const ContentFindFirstOrThrowZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodType<Prisma.ContentSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.ContentSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    orderBy: z.ZodOptional<z.ZodUnion<readonly [z.ZodType<Prisma.ContentOrderByWithRelationInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentOrderByWithRelationInput, unknown>>, z.ZodArray<z.ZodType<Prisma.ContentOrderByWithRelationInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentOrderByWithRelationInput, unknown>>>]>>;
    where: z.ZodOptional<z.ZodType<Prisma.ContentWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentWhereInput, unknown>>>;
    cursor: z.ZodOptional<z.ZodType<Prisma.ContentWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentWhereUniqueInput, unknown>>>;
    take: z.ZodOptional<z.ZodNumber>;
    skip: z.ZodOptional<z.ZodNumber>;
    distinct: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        uuid: "uuid";
        url: "url";
        title: "title";
        content_owner: "content_owner";
        for_position: "for_position";
        last_modified_time: "last_modified_time";
        expiration_time: "expiration_time";
        content_type: "content_type";
        status: "status";
        is_favorite: "is_favorite";
    }>, z.ZodArray<z.ZodEnum<{
        uuid: "uuid";
        url: "url";
        title: "title";
        content_owner: "content_owner";
        for_position: "for_position";
        last_modified_time: "last_modified_time";
        expiration_time: "expiration_time";
        content_type: "content_type";
        status: "status";
        is_favorite: "is_favorite";
    }>>]>>;
}, z.core.$strict>;
export declare const ContentFindManySelectSchema__findManyContent_schema: z.ZodType<Prisma.ContentSelect>;
export declare const ContentFindManySelectZodSchema__findManyContent_schema: z.ZodObject<{
    uuid: z.ZodOptional<z.ZodBoolean>;
    title: z.ZodOptional<z.ZodBoolean>;
    url: z.ZodOptional<z.ZodBoolean>;
    content_owner: z.ZodOptional<z.ZodBoolean>;
    for_position: z.ZodOptional<z.ZodBoolean>;
    last_modified_time: z.ZodOptional<z.ZodBoolean>;
    expiration_time: z.ZodOptional<z.ZodBoolean>;
    content_type: z.ZodOptional<z.ZodBoolean>;
    status: z.ZodOptional<z.ZodBoolean>;
    is_favorite: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const ContentFindManySchema: z.ZodType<Prisma.ContentFindManyArgs>;
export declare const ContentFindManyZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodType<Prisma.ContentSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.ContentSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    orderBy: z.ZodOptional<z.ZodUnion<readonly [z.ZodType<Prisma.ContentOrderByWithRelationInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentOrderByWithRelationInput, unknown>>, z.ZodArray<z.ZodType<Prisma.ContentOrderByWithRelationInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentOrderByWithRelationInput, unknown>>>]>>;
    where: z.ZodOptional<z.ZodType<Prisma.ContentWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentWhereInput, unknown>>>;
    cursor: z.ZodOptional<z.ZodType<Prisma.ContentWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentWhereUniqueInput, unknown>>>;
    take: z.ZodOptional<z.ZodNumber>;
    skip: z.ZodOptional<z.ZodNumber>;
    distinct: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        uuid: "uuid";
        url: "url";
        title: "title";
        content_owner: "content_owner";
        for_position: "for_position";
        last_modified_time: "last_modified_time";
        expiration_time: "expiration_time";
        content_type: "content_type";
        status: "status";
        is_favorite: "is_favorite";
    }>, z.ZodArray<z.ZodEnum<{
        uuid: "uuid";
        url: "url";
        title: "title";
        content_owner: "content_owner";
        for_position: "for_position";
        last_modified_time: "last_modified_time";
        expiration_time: "expiration_time";
        content_type: "content_type";
        status: "status";
        is_favorite: "is_favorite";
    }>>]>>;
}, z.core.$strict>;
export declare const ContentCountSchema: z.ZodType<Prisma.ContentCountArgs>;
export declare const ContentCountZodSchema: z.ZodObject<{
    orderBy: z.ZodOptional<z.ZodUnion<readonly [z.ZodType<Prisma.ContentOrderByWithRelationInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentOrderByWithRelationInput, unknown>>, z.ZodArray<z.ZodType<Prisma.ContentOrderByWithRelationInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentOrderByWithRelationInput, unknown>>>]>>;
    where: z.ZodOptional<z.ZodType<Prisma.ContentWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentWhereInput, unknown>>>;
    cursor: z.ZodOptional<z.ZodType<Prisma.ContentWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentWhereUniqueInput, unknown>>>;
    take: z.ZodOptional<z.ZodNumber>;
    skip: z.ZodOptional<z.ZodNumber>;
    select: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<true>, z.ZodType<Prisma.ContentCountAggregateInputType, unknown, z.core.$ZodTypeInternals<Prisma.ContentCountAggregateInputType, unknown>>]>>;
}, z.core.$strict>;
export declare const ContentCreateOneSchema: z.ZodType<Prisma.ContentCreateArgs>;
export declare const ContentCreateOneZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodType<Prisma.ContentSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.ContentSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    data: z.ZodUnion<readonly [z.ZodType<Prisma.ContentCreateInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentCreateInput, unknown>>, z.ZodType<Prisma.ContentUncheckedCreateInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentUncheckedCreateInput, unknown>>]>;
}, z.core.$strict>;
export declare const ContentCreateManySchema: z.ZodType<Prisma.ContentCreateManyArgs>;
export declare const ContentCreateManyZodSchema: z.ZodObject<{
    data: z.ZodUnion<readonly [z.ZodType<Prisma.ContentCreateManyInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentCreateManyInput, unknown>>, z.ZodArray<z.ZodType<Prisma.ContentCreateManyInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentCreateManyInput, unknown>>>]>;
    skipDuplicates: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const ContentCreateManyAndReturnSchema: z.ZodType<Prisma.ContentCreateManyAndReturnArgs>;
export declare const ContentCreateManyAndReturnZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodType<Prisma.ContentSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.ContentSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    data: z.ZodUnion<readonly [z.ZodType<Prisma.ContentCreateManyInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentCreateManyInput, unknown>>, z.ZodArray<z.ZodType<Prisma.ContentCreateManyInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentCreateManyInput, unknown>>>]>;
    skipDuplicates: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const ContentDeleteOneSchema: z.ZodType<Prisma.ContentDeleteArgs>;
export declare const ContentDeleteOneZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodType<Prisma.ContentSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.ContentSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    where: z.ZodType<Prisma.ContentWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentWhereUniqueInput, unknown>>;
}, z.core.$strict>;
export declare const ContentDeleteManySchema: z.ZodType<Prisma.ContentDeleteManyArgs>;
export declare const ContentDeleteManyZodSchema: z.ZodObject<{
    where: z.ZodOptional<z.ZodType<Prisma.ContentWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentWhereInput, unknown>>>;
}, z.core.$strict>;
export declare const ContentUpdateOneSchema: z.ZodType<Prisma.ContentUpdateArgs>;
export declare const ContentUpdateOneZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodType<Prisma.ContentSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.ContentSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    data: z.ZodUnion<readonly [z.ZodType<Prisma.ContentUpdateInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentUpdateInput, unknown>>, z.ZodType<Prisma.ContentUncheckedUpdateInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentUncheckedUpdateInput, unknown>>]>;
    where: z.ZodType<Prisma.ContentWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentWhereUniqueInput, unknown>>;
}, z.core.$strict>;
export declare const ContentUpdateManySchema: z.ZodType<Prisma.ContentUpdateManyArgs>;
export declare const ContentUpdateManyZodSchema: z.ZodObject<{
    data: z.ZodType<Prisma.ContentUpdateManyMutationInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentUpdateManyMutationInput, unknown>>;
    where: z.ZodOptional<z.ZodType<Prisma.ContentWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentWhereInput, unknown>>>;
}, z.core.$strict>;
export declare const ContentUpdateManyAndReturnSchema: z.ZodType<Prisma.ContentUpdateManyAndReturnArgs>;
export declare const ContentUpdateManyAndReturnZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodType<Prisma.ContentSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.ContentSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    data: z.ZodType<Prisma.ContentUpdateManyMutationInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentUpdateManyMutationInput, unknown>>;
    where: z.ZodOptional<z.ZodType<Prisma.ContentWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentWhereInput, unknown>>>;
}, z.core.$strict>;
export declare const ContentUpsertOneSchema: z.ZodType<Prisma.ContentUpsertArgs>;
export declare const ContentUpsertOneZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodType<Prisma.ContentSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.ContentSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    where: z.ZodType<Prisma.ContentWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentWhereUniqueInput, unknown>>;
    create: z.ZodUnion<readonly [z.ZodType<Prisma.ContentCreateInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentCreateInput, unknown>>, z.ZodType<Prisma.ContentUncheckedCreateInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentUncheckedCreateInput, unknown>>]>;
    update: z.ZodUnion<readonly [z.ZodType<Prisma.ContentUpdateInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentUpdateInput, unknown>>, z.ZodType<Prisma.ContentUncheckedUpdateInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentUncheckedUpdateInput, unknown>>]>;
}, z.core.$strict>;
export declare const ContentAggregateSchema: z.ZodType<Prisma.ContentAggregateArgs>;
export declare const ContentAggregateZodSchema: z.ZodObject<{
    orderBy: z.ZodOptional<z.ZodUnion<readonly [z.ZodType<Prisma.ContentOrderByWithRelationInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentOrderByWithRelationInput, unknown>>, z.ZodArray<z.ZodType<Prisma.ContentOrderByWithRelationInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentOrderByWithRelationInput, unknown>>>]>>;
    where: z.ZodOptional<z.ZodType<Prisma.ContentWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentWhereInput, unknown>>>;
    cursor: z.ZodOptional<z.ZodType<Prisma.ContentWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentWhereUniqueInput, unknown>>>;
    take: z.ZodOptional<z.ZodNumber>;
    skip: z.ZodOptional<z.ZodNumber>;
    _count: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<true>, z.ZodType<Prisma.ContentCountAggregateInputType, unknown, z.core.$ZodTypeInternals<Prisma.ContentCountAggregateInputType, unknown>>]>>;
    _min: z.ZodOptional<z.ZodType<Prisma.ContentMinAggregateInputType, unknown, z.core.$ZodTypeInternals<Prisma.ContentMinAggregateInputType, unknown>>>;
    _max: z.ZodOptional<z.ZodType<Prisma.ContentMaxAggregateInputType, unknown, z.core.$ZodTypeInternals<Prisma.ContentMaxAggregateInputType, unknown>>>;
}, z.core.$strict>;
export declare const ContentGroupBySchema: z.ZodType<Prisma.ContentGroupByArgs>;
export declare const ContentGroupByZodSchema: z.ZodObject<{
    where: z.ZodOptional<z.ZodType<Prisma.ContentWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentWhereInput, unknown>>>;
    orderBy: z.ZodOptional<z.ZodUnion<readonly [z.ZodType<Prisma.ContentOrderByWithAggregationInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentOrderByWithAggregationInput, unknown>>, z.ZodArray<z.ZodType<Prisma.ContentOrderByWithAggregationInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentOrderByWithAggregationInput, unknown>>>]>>;
    having: z.ZodOptional<z.ZodType<Prisma.ContentScalarWhereWithAggregatesInput, unknown, z.core.$ZodTypeInternals<Prisma.ContentScalarWhereWithAggregatesInput, unknown>>>;
    take: z.ZodOptional<z.ZodNumber>;
    skip: z.ZodOptional<z.ZodNumber>;
    by: z.ZodArray<z.ZodEnum<{
        uuid: "uuid";
        url: "url";
        title: "title";
        content_owner: "content_owner";
        for_position: "for_position";
        last_modified_time: "last_modified_time";
        expiration_time: "expiration_time";
        content_type: "content_type";
        status: "status";
        is_favorite: "is_favorite";
    }>>;
    _count: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<true>, z.ZodType<Prisma.ContentCountAggregateInputType, unknown, z.core.$ZodTypeInternals<Prisma.ContentCountAggregateInputType, unknown>>]>>;
    _min: z.ZodOptional<z.ZodType<Prisma.ContentMinAggregateInputType, unknown, z.core.$ZodTypeInternals<Prisma.ContentMinAggregateInputType, unknown>>>;
    _max: z.ZodOptional<z.ZodType<Prisma.ContentMaxAggregateInputType, unknown, z.core.$ZodTypeInternals<Prisma.ContentMaxAggregateInputType, unknown>>>;
}, z.core.$strict>;
export declare const AccountFindUniqueSchema: z.ZodType<Prisma.AccountFindUniqueArgs>;
export declare const AccountFindUniqueZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodType<Prisma.AccountSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.AccountSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    include: z.ZodOptional<z.ZodType<Prisma.AccountInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.AccountInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    where: z.ZodType<Prisma.AccountWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereUniqueInput, unknown>>;
}, z.core.$strict>;
export declare const AccountFindUniqueOrThrowSchema: z.ZodType<Prisma.AccountFindUniqueOrThrowArgs>;
export declare const AccountFindUniqueOrThrowZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodType<Prisma.AccountSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.AccountSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    include: z.ZodOptional<z.ZodType<Prisma.AccountInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.AccountInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    where: z.ZodType<Prisma.AccountWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereUniqueInput, unknown>>;
}, z.core.$strict>;
export declare const AccountFindFirstSelectSchema__findFirstAccount_schema: z.ZodType<Prisma.AccountSelect>;
export declare const AccountFindFirstSelectZodSchema__findFirstAccount_schema: z.ZodObject<{
    employee: z.ZodOptional<z.ZodBoolean>;
    employeeUuid: z.ZodOptional<z.ZodBoolean>;
    username: z.ZodOptional<z.ZodBoolean>;
    password: z.ZodOptional<z.ZodBoolean>;
    type: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const AccountFindFirstSchema: z.ZodType<Prisma.AccountFindFirstArgs>;
export declare const AccountFindFirstZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodType<Prisma.AccountSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.AccountSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    include: z.ZodLazy<z.ZodOptional<z.ZodType<Prisma.AccountInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.AccountInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>>;
    orderBy: z.ZodOptional<z.ZodUnion<readonly [z.ZodType<Prisma.AccountOrderByWithRelationInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountOrderByWithRelationInput, unknown>>, z.ZodArray<z.ZodType<Prisma.AccountOrderByWithRelationInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountOrderByWithRelationInput, unknown>>>]>>;
    where: z.ZodOptional<z.ZodType<Prisma.AccountWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereInput, unknown>>>;
    cursor: z.ZodOptional<z.ZodType<Prisma.AccountWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereUniqueInput, unknown>>>;
    take: z.ZodOptional<z.ZodNumber>;
    skip: z.ZodOptional<z.ZodNumber>;
    distinct: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        employeeUuid: "employeeUuid";
        username: "username";
        password: "password";
        type: "type";
    }>, z.ZodArray<z.ZodEnum<{
        employeeUuid: "employeeUuid";
        username: "username";
        password: "password";
        type: "type";
    }>>]>>;
}, z.core.$strict>;
export declare const AccountFindFirstOrThrowSelectSchema__findFirstOrThrowAccount_schema: z.ZodType<Prisma.AccountSelect>;
export declare const AccountFindFirstOrThrowSelectZodSchema__findFirstOrThrowAccount_schema: z.ZodObject<{
    employee: z.ZodOptional<z.ZodBoolean>;
    employeeUuid: z.ZodOptional<z.ZodBoolean>;
    username: z.ZodOptional<z.ZodBoolean>;
    password: z.ZodOptional<z.ZodBoolean>;
    type: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const AccountFindFirstOrThrowSchema: z.ZodType<Prisma.AccountFindFirstOrThrowArgs>;
export declare const AccountFindFirstOrThrowZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodType<Prisma.AccountSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.AccountSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    include: z.ZodLazy<z.ZodOptional<z.ZodType<Prisma.AccountInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.AccountInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>>;
    orderBy: z.ZodOptional<z.ZodUnion<readonly [z.ZodType<Prisma.AccountOrderByWithRelationInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountOrderByWithRelationInput, unknown>>, z.ZodArray<z.ZodType<Prisma.AccountOrderByWithRelationInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountOrderByWithRelationInput, unknown>>>]>>;
    where: z.ZodOptional<z.ZodType<Prisma.AccountWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereInput, unknown>>>;
    cursor: z.ZodOptional<z.ZodType<Prisma.AccountWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereUniqueInput, unknown>>>;
    take: z.ZodOptional<z.ZodNumber>;
    skip: z.ZodOptional<z.ZodNumber>;
    distinct: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        employeeUuid: "employeeUuid";
        username: "username";
        password: "password";
        type: "type";
    }>, z.ZodArray<z.ZodEnum<{
        employeeUuid: "employeeUuid";
        username: "username";
        password: "password";
        type: "type";
    }>>]>>;
}, z.core.$strict>;
export declare const AccountFindManySelectSchema__findManyAccount_schema: z.ZodType<Prisma.AccountSelect>;
export declare const AccountFindManySelectZodSchema__findManyAccount_schema: z.ZodObject<{
    employee: z.ZodOptional<z.ZodBoolean>;
    employeeUuid: z.ZodOptional<z.ZodBoolean>;
    username: z.ZodOptional<z.ZodBoolean>;
    password: z.ZodOptional<z.ZodBoolean>;
    type: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const AccountFindManySchema: z.ZodType<Prisma.AccountFindManyArgs>;
export declare const AccountFindManyZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodType<Prisma.AccountSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.AccountSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    include: z.ZodLazy<z.ZodOptional<z.ZodType<Prisma.AccountInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.AccountInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>>;
    orderBy: z.ZodOptional<z.ZodUnion<readonly [z.ZodType<Prisma.AccountOrderByWithRelationInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountOrderByWithRelationInput, unknown>>, z.ZodArray<z.ZodType<Prisma.AccountOrderByWithRelationInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountOrderByWithRelationInput, unknown>>>]>>;
    where: z.ZodOptional<z.ZodType<Prisma.AccountWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereInput, unknown>>>;
    cursor: z.ZodOptional<z.ZodType<Prisma.AccountWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereUniqueInput, unknown>>>;
    take: z.ZodOptional<z.ZodNumber>;
    skip: z.ZodOptional<z.ZodNumber>;
    distinct: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        employeeUuid: "employeeUuid";
        username: "username";
        password: "password";
        type: "type";
    }>, z.ZodArray<z.ZodEnum<{
        employeeUuid: "employeeUuid";
        username: "username";
        password: "password";
        type: "type";
    }>>]>>;
}, z.core.$strict>;
export declare const AccountCountSchema: z.ZodType<Prisma.AccountCountArgs>;
export declare const AccountCountZodSchema: z.ZodObject<{
    orderBy: z.ZodOptional<z.ZodUnion<readonly [z.ZodType<Prisma.AccountOrderByWithRelationInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountOrderByWithRelationInput, unknown>>, z.ZodArray<z.ZodType<Prisma.AccountOrderByWithRelationInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountOrderByWithRelationInput, unknown>>>]>>;
    where: z.ZodOptional<z.ZodType<Prisma.AccountWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereInput, unknown>>>;
    cursor: z.ZodOptional<z.ZodType<Prisma.AccountWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereUniqueInput, unknown>>>;
    take: z.ZodOptional<z.ZodNumber>;
    skip: z.ZodOptional<z.ZodNumber>;
    select: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<true>, z.ZodType<Prisma.AccountCountAggregateInputType, unknown, z.core.$ZodTypeInternals<Prisma.AccountCountAggregateInputType, unknown>>]>>;
}, z.core.$strict>;
export declare const AccountCreateOneSchema: z.ZodType<Prisma.AccountCreateArgs>;
export declare const AccountCreateOneZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodType<Prisma.AccountSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.AccountSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    include: z.ZodOptional<z.ZodType<Prisma.AccountInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.AccountInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    data: z.ZodUnion<readonly [z.ZodType<Prisma.AccountCreateInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountCreateInput, unknown>>, z.ZodType<Prisma.AccountUncheckedCreateInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountUncheckedCreateInput, unknown>>]>;
}, z.core.$strict>;
export declare const AccountCreateManySchema: z.ZodType<Prisma.AccountCreateManyArgs>;
export declare const AccountCreateManyZodSchema: z.ZodObject<{
    data: z.ZodUnion<readonly [z.ZodType<Prisma.AccountCreateManyInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountCreateManyInput, unknown>>, z.ZodArray<z.ZodType<Prisma.AccountCreateManyInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountCreateManyInput, unknown>>>]>;
    skipDuplicates: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const AccountCreateManyAndReturnSchema: z.ZodType<Prisma.AccountCreateManyAndReturnArgs>;
export declare const AccountCreateManyAndReturnZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodType<Prisma.AccountSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.AccountSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    data: z.ZodUnion<readonly [z.ZodType<Prisma.AccountCreateManyInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountCreateManyInput, unknown>>, z.ZodArray<z.ZodType<Prisma.AccountCreateManyInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountCreateManyInput, unknown>>>]>;
    skipDuplicates: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const AccountDeleteOneSchema: z.ZodType<Prisma.AccountDeleteArgs>;
export declare const AccountDeleteOneZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodType<Prisma.AccountSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.AccountSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    include: z.ZodOptional<z.ZodType<Prisma.AccountInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.AccountInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    where: z.ZodType<Prisma.AccountWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereUniqueInput, unknown>>;
}, z.core.$strict>;
export declare const AccountDeleteManySchema: z.ZodType<Prisma.AccountDeleteManyArgs>;
export declare const AccountDeleteManyZodSchema: z.ZodObject<{
    where: z.ZodOptional<z.ZodType<Prisma.AccountWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereInput, unknown>>>;
}, z.core.$strict>;
export declare const AccountUpdateOneSchema: z.ZodType<Prisma.AccountUpdateArgs>;
export declare const AccountUpdateOneZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodType<Prisma.AccountSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.AccountSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    include: z.ZodOptional<z.ZodType<Prisma.AccountInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.AccountInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    data: z.ZodUnion<readonly [z.ZodType<Prisma.AccountUpdateInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountUpdateInput, unknown>>, z.ZodType<Prisma.AccountUncheckedUpdateInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountUncheckedUpdateInput, unknown>>]>;
    where: z.ZodType<Prisma.AccountWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereUniqueInput, unknown>>;
}, z.core.$strict>;
export declare const AccountUpdateManySchema: z.ZodType<Prisma.AccountUpdateManyArgs>;
export declare const AccountUpdateManyZodSchema: z.ZodObject<{
    data: z.ZodType<Prisma.AccountUpdateManyMutationInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountUpdateManyMutationInput, unknown>>;
    where: z.ZodOptional<z.ZodType<Prisma.AccountWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereInput, unknown>>>;
}, z.core.$strict>;
export declare const AccountUpdateManyAndReturnSchema: z.ZodType<Prisma.AccountUpdateManyAndReturnArgs>;
export declare const AccountUpdateManyAndReturnZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodType<Prisma.AccountSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.AccountSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    data: z.ZodType<Prisma.AccountUpdateManyMutationInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountUpdateManyMutationInput, unknown>>;
    where: z.ZodOptional<z.ZodType<Prisma.AccountWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereInput, unknown>>>;
}, z.core.$strict>;
export declare const AccountUpsertOneSchema: z.ZodType<Prisma.AccountUpsertArgs>;
export declare const AccountUpsertOneZodSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodType<Prisma.AccountSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.AccountSelect<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    include: z.ZodOptional<z.ZodType<Prisma.AccountInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown, z.core.$ZodTypeInternals<Prisma.AccountInclude<import("@prisma/client/runtime/client").DefaultArgs>, unknown>>>;
    where: z.ZodType<Prisma.AccountWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereUniqueInput, unknown>>;
    create: z.ZodUnion<readonly [z.ZodType<Prisma.AccountCreateInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountCreateInput, unknown>>, z.ZodType<Prisma.AccountUncheckedCreateInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountUncheckedCreateInput, unknown>>]>;
    update: z.ZodUnion<readonly [z.ZodType<Prisma.AccountUpdateInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountUpdateInput, unknown>>, z.ZodType<Prisma.AccountUncheckedUpdateInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountUncheckedUpdateInput, unknown>>]>;
}, z.core.$strict>;
export declare const AccountAggregateSchema: z.ZodType<Prisma.AccountAggregateArgs>;
export declare const AccountAggregateZodSchema: z.ZodObject<{
    orderBy: z.ZodOptional<z.ZodUnion<readonly [z.ZodType<Prisma.AccountOrderByWithRelationInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountOrderByWithRelationInput, unknown>>, z.ZodArray<z.ZodType<Prisma.AccountOrderByWithRelationInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountOrderByWithRelationInput, unknown>>>]>>;
    where: z.ZodOptional<z.ZodType<Prisma.AccountWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereInput, unknown>>>;
    cursor: z.ZodOptional<z.ZodType<Prisma.AccountWhereUniqueInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereUniqueInput, unknown>>>;
    take: z.ZodOptional<z.ZodNumber>;
    skip: z.ZodOptional<z.ZodNumber>;
    _count: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<true>, z.ZodType<Prisma.AccountCountAggregateInputType, unknown, z.core.$ZodTypeInternals<Prisma.AccountCountAggregateInputType, unknown>>]>>;
    _min: z.ZodOptional<z.ZodType<Prisma.AccountMinAggregateInputType, unknown, z.core.$ZodTypeInternals<Prisma.AccountMinAggregateInputType, unknown>>>;
    _max: z.ZodOptional<z.ZodType<Prisma.AccountMaxAggregateInputType, unknown, z.core.$ZodTypeInternals<Prisma.AccountMaxAggregateInputType, unknown>>>;
}, z.core.$strict>;
export declare const AccountGroupBySchema: z.ZodType<Prisma.AccountGroupByArgs>;
export declare const AccountGroupByZodSchema: z.ZodObject<{
    where: z.ZodOptional<z.ZodType<Prisma.AccountWhereInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountWhereInput, unknown>>>;
    orderBy: z.ZodOptional<z.ZodUnion<readonly [z.ZodType<Prisma.AccountOrderByWithAggregationInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountOrderByWithAggregationInput, unknown>>, z.ZodArray<z.ZodType<Prisma.AccountOrderByWithAggregationInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountOrderByWithAggregationInput, unknown>>>]>>;
    having: z.ZodOptional<z.ZodType<Prisma.AccountScalarWhereWithAggregatesInput, unknown, z.core.$ZodTypeInternals<Prisma.AccountScalarWhereWithAggregatesInput, unknown>>>;
    take: z.ZodOptional<z.ZodNumber>;
    skip: z.ZodOptional<z.ZodNumber>;
    by: z.ZodArray<z.ZodEnum<{
        employeeUuid: "employeeUuid";
        username: "username";
        password: "password";
        type: "type";
    }>>;
    _count: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<true>, z.ZodType<Prisma.AccountCountAggregateInputType, unknown, z.core.$ZodTypeInternals<Prisma.AccountCountAggregateInputType, unknown>>]>>;
    _min: z.ZodOptional<z.ZodType<Prisma.AccountMinAggregateInputType, unknown, z.core.$ZodTypeInternals<Prisma.AccountMinAggregateInputType, unknown>>>;
    _max: z.ZodOptional<z.ZodType<Prisma.AccountMaxAggregateInputType, unknown, z.core.$ZodTypeInternals<Prisma.AccountMaxAggregateInputType, unknown>>>;
}, z.core.$strict>;
export declare const EmployeeFindUniqueResultSchema: z.ZodNullable<z.ZodObject<{
    uuid: z.ZodString;
    account: z.ZodOptional<z.ZodUnknown>;
    avatar: z.ZodOptional<z.ZodString>;
    first_name: z.ZodString;
    last_name: z.ZodString;
    date_of_birth: z.ZodDate;
    position: z.ZodUnknown;
    department: z.ZodUnknown;
    start_date: z.ZodDate;
    supervisor: z.ZodString;
    phone_number: z.ZodString;
    personal_email: z.ZodString;
    corporate_email: z.ZodString;
}, z.core.$strip>>;
export declare const EmployeeFindFirstResultSchema: z.ZodNullable<z.ZodObject<{
    uuid: z.ZodString;
    account: z.ZodOptional<z.ZodUnknown>;
    avatar: z.ZodOptional<z.ZodString>;
    first_name: z.ZodString;
    last_name: z.ZodString;
    date_of_birth: z.ZodDate;
    position: z.ZodUnknown;
    department: z.ZodUnknown;
    start_date: z.ZodDate;
    supervisor: z.ZodString;
    phone_number: z.ZodString;
    personal_email: z.ZodString;
    corporate_email: z.ZodString;
}, z.core.$strip>>;
export declare const EmployeeFindManyResultSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        uuid: z.ZodString;
        account: z.ZodOptional<z.ZodUnknown>;
        avatar: z.ZodOptional<z.ZodString>;
        first_name: z.ZodString;
        last_name: z.ZodString;
        date_of_birth: z.ZodDate;
        position: z.ZodUnknown;
        department: z.ZodUnknown;
        start_date: z.ZodDate;
        supervisor: z.ZodString;
        phone_number: z.ZodString;
        personal_email: z.ZodString;
        corporate_email: z.ZodString;
    }, z.core.$strip>>;
    pagination: z.ZodObject<{
        page: z.ZodNumber;
        pageSize: z.ZodNumber;
        total: z.ZodNumber;
        totalPages: z.ZodNumber;
        hasNext: z.ZodBoolean;
        hasPrev: z.ZodBoolean;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const EmployeeCreateResultSchema: z.ZodObject<{
    uuid: z.ZodString;
    account: z.ZodOptional<z.ZodUnknown>;
    avatar: z.ZodOptional<z.ZodString>;
    first_name: z.ZodString;
    last_name: z.ZodString;
    date_of_birth: z.ZodDate;
    position: z.ZodUnknown;
    department: z.ZodUnknown;
    start_date: z.ZodDate;
    supervisor: z.ZodString;
    phone_number: z.ZodString;
    personal_email: z.ZodString;
    corporate_email: z.ZodString;
}, z.core.$strip>;
export declare const EmployeeCreateManyResultSchema: z.ZodObject<{
    count: z.ZodNumber;
}, z.core.$strip>;
export declare const EmployeeUpdateResultSchema: z.ZodNullable<z.ZodObject<{
    uuid: z.ZodString;
    account: z.ZodOptional<z.ZodUnknown>;
    avatar: z.ZodOptional<z.ZodString>;
    first_name: z.ZodString;
    last_name: z.ZodString;
    date_of_birth: z.ZodDate;
    position: z.ZodUnknown;
    department: z.ZodUnknown;
    start_date: z.ZodDate;
    supervisor: z.ZodString;
    phone_number: z.ZodString;
    personal_email: z.ZodString;
    corporate_email: z.ZodString;
}, z.core.$strip>>;
export declare const EmployeeUpdateManyResultSchema: z.ZodObject<{
    count: z.ZodNumber;
}, z.core.$strip>;
export declare const EmployeeUpsertResultSchema: z.ZodObject<{
    uuid: z.ZodString;
    account: z.ZodOptional<z.ZodUnknown>;
    avatar: z.ZodOptional<z.ZodString>;
    first_name: z.ZodString;
    last_name: z.ZodString;
    date_of_birth: z.ZodDate;
    position: z.ZodUnknown;
    department: z.ZodUnknown;
    start_date: z.ZodDate;
    supervisor: z.ZodString;
    phone_number: z.ZodString;
    personal_email: z.ZodString;
    corporate_email: z.ZodString;
}, z.core.$strip>;
export declare const EmployeeDeleteResultSchema: z.ZodNullable<z.ZodObject<{
    uuid: z.ZodString;
    account: z.ZodOptional<z.ZodUnknown>;
    avatar: z.ZodOptional<z.ZodString>;
    first_name: z.ZodString;
    last_name: z.ZodString;
    date_of_birth: z.ZodDate;
    position: z.ZodUnknown;
    department: z.ZodUnknown;
    start_date: z.ZodDate;
    supervisor: z.ZodString;
    phone_number: z.ZodString;
    personal_email: z.ZodString;
    corporate_email: z.ZodString;
}, z.core.$strip>>;
export declare const EmployeeDeleteManyResultSchema: z.ZodObject<{
    count: z.ZodNumber;
}, z.core.$strip>;
export declare const EmployeeAggregateResultSchema: z.ZodObject<{
    _count: z.ZodOptional<z.ZodObject<{
        uuid: z.ZodNumber;
        account: z.ZodNumber;
        avatar: z.ZodNumber;
        first_name: z.ZodNumber;
        last_name: z.ZodNumber;
        date_of_birth: z.ZodNumber;
        position: z.ZodNumber;
        department: z.ZodNumber;
        start_date: z.ZodNumber;
        supervisor: z.ZodNumber;
        phone_number: z.ZodNumber;
        personal_email: z.ZodNumber;
        corporate_email: z.ZodNumber;
    }, z.core.$strip>>;
    _min: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        uuid: z.ZodNullable<z.ZodString>;
        avatar: z.ZodNullable<z.ZodString>;
        first_name: z.ZodNullable<z.ZodString>;
        last_name: z.ZodNullable<z.ZodString>;
        date_of_birth: z.ZodNullable<z.ZodDate>;
        start_date: z.ZodNullable<z.ZodDate>;
        supervisor: z.ZodNullable<z.ZodString>;
        phone_number: z.ZodNullable<z.ZodString>;
        personal_email: z.ZodNullable<z.ZodString>;
        corporate_email: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>>;
    _max: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        uuid: z.ZodNullable<z.ZodString>;
        avatar: z.ZodNullable<z.ZodString>;
        first_name: z.ZodNullable<z.ZodString>;
        last_name: z.ZodNullable<z.ZodString>;
        date_of_birth: z.ZodNullable<z.ZodDate>;
        start_date: z.ZodNullable<z.ZodDate>;
        supervisor: z.ZodNullable<z.ZodString>;
        phone_number: z.ZodNullable<z.ZodString>;
        personal_email: z.ZodNullable<z.ZodString>;
        corporate_email: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const EmployeeGroupByResultSchema: z.ZodArray<z.ZodObject<{
    uuid: z.ZodString;
    avatar: z.ZodString;
    first_name: z.ZodString;
    last_name: z.ZodString;
    date_of_birth: z.ZodDate;
    start_date: z.ZodDate;
    supervisor: z.ZodString;
    phone_number: z.ZodString;
    personal_email: z.ZodString;
    corporate_email: z.ZodString;
    _count: z.ZodOptional<z.ZodObject<{
        uuid: z.ZodNumber;
        account: z.ZodNumber;
        avatar: z.ZodNumber;
        first_name: z.ZodNumber;
        last_name: z.ZodNumber;
        date_of_birth: z.ZodNumber;
        position: z.ZodNumber;
        department: z.ZodNumber;
        start_date: z.ZodNumber;
        supervisor: z.ZodNumber;
        phone_number: z.ZodNumber;
        personal_email: z.ZodNumber;
        corporate_email: z.ZodNumber;
    }, z.core.$strip>>;
    _min: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        uuid: z.ZodNullable<z.ZodString>;
        avatar: z.ZodNullable<z.ZodString>;
        first_name: z.ZodNullable<z.ZodString>;
        last_name: z.ZodNullable<z.ZodString>;
        date_of_birth: z.ZodNullable<z.ZodDate>;
        start_date: z.ZodNullable<z.ZodDate>;
        supervisor: z.ZodNullable<z.ZodString>;
        phone_number: z.ZodNullable<z.ZodString>;
        personal_email: z.ZodNullable<z.ZodString>;
        corporate_email: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>>;
    _max: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        uuid: z.ZodNullable<z.ZodString>;
        avatar: z.ZodNullable<z.ZodString>;
        first_name: z.ZodNullable<z.ZodString>;
        last_name: z.ZodNullable<z.ZodString>;
        date_of_birth: z.ZodNullable<z.ZodDate>;
        start_date: z.ZodNullable<z.ZodDate>;
        supervisor: z.ZodNullable<z.ZodString>;
        phone_number: z.ZodNullable<z.ZodString>;
        personal_email: z.ZodNullable<z.ZodString>;
        corporate_email: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>>;
export declare const EmployeeCountResultSchema: z.ZodNumber;
export declare const ContentFindUniqueResultSchema: z.ZodNullable<z.ZodObject<{
    uuid: z.ZodString;
    title: z.ZodString;
    url: z.ZodString;
    content_owner: z.ZodString;
    for_position: z.ZodUnknown;
    last_modified_time: z.ZodDate;
    expiration_time: z.ZodDate;
    content_type: z.ZodUnknown;
    status: z.ZodUnknown;
    is_favorite: z.ZodBoolean;
}, z.core.$strip>>;
export declare const ContentFindFirstResultSchema: z.ZodNullable<z.ZodObject<{
    uuid: z.ZodString;
    title: z.ZodString;
    url: z.ZodString;
    content_owner: z.ZodString;
    for_position: z.ZodUnknown;
    last_modified_time: z.ZodDate;
    expiration_time: z.ZodDate;
    content_type: z.ZodUnknown;
    status: z.ZodUnknown;
    is_favorite: z.ZodBoolean;
}, z.core.$strip>>;
export declare const ContentFindManyResultSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        uuid: z.ZodString;
        title: z.ZodString;
        url: z.ZodString;
        content_owner: z.ZodString;
        for_position: z.ZodUnknown;
        last_modified_time: z.ZodDate;
        expiration_time: z.ZodDate;
        content_type: z.ZodUnknown;
        status: z.ZodUnknown;
        is_favorite: z.ZodBoolean;
    }, z.core.$strip>>;
    pagination: z.ZodObject<{
        page: z.ZodNumber;
        pageSize: z.ZodNumber;
        total: z.ZodNumber;
        totalPages: z.ZodNumber;
        hasNext: z.ZodBoolean;
        hasPrev: z.ZodBoolean;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const ContentCreateResultSchema: z.ZodObject<{
    uuid: z.ZodString;
    title: z.ZodString;
    url: z.ZodString;
    content_owner: z.ZodString;
    for_position: z.ZodUnknown;
    last_modified_time: z.ZodDate;
    expiration_time: z.ZodDate;
    content_type: z.ZodUnknown;
    status: z.ZodUnknown;
    is_favorite: z.ZodBoolean;
}, z.core.$strip>;
export declare const ContentCreateManyResultSchema: z.ZodObject<{
    count: z.ZodNumber;
}, z.core.$strip>;
export declare const ContentUpdateResultSchema: z.ZodNullable<z.ZodObject<{
    uuid: z.ZodString;
    title: z.ZodString;
    url: z.ZodString;
    content_owner: z.ZodString;
    for_position: z.ZodUnknown;
    last_modified_time: z.ZodDate;
    expiration_time: z.ZodDate;
    content_type: z.ZodUnknown;
    status: z.ZodUnknown;
    is_favorite: z.ZodBoolean;
}, z.core.$strip>>;
export declare const ContentUpdateManyResultSchema: z.ZodObject<{
    count: z.ZodNumber;
}, z.core.$strip>;
export declare const ContentUpsertResultSchema: z.ZodObject<{
    uuid: z.ZodString;
    title: z.ZodString;
    url: z.ZodString;
    content_owner: z.ZodString;
    for_position: z.ZodUnknown;
    last_modified_time: z.ZodDate;
    expiration_time: z.ZodDate;
    content_type: z.ZodUnknown;
    status: z.ZodUnknown;
    is_favorite: z.ZodBoolean;
}, z.core.$strip>;
export declare const ContentDeleteResultSchema: z.ZodNullable<z.ZodObject<{
    uuid: z.ZodString;
    title: z.ZodString;
    url: z.ZodString;
    content_owner: z.ZodString;
    for_position: z.ZodUnknown;
    last_modified_time: z.ZodDate;
    expiration_time: z.ZodDate;
    content_type: z.ZodUnknown;
    status: z.ZodUnknown;
    is_favorite: z.ZodBoolean;
}, z.core.$strip>>;
export declare const ContentDeleteManyResultSchema: z.ZodObject<{
    count: z.ZodNumber;
}, z.core.$strip>;
export declare const ContentAggregateResultSchema: z.ZodObject<{
    _count: z.ZodOptional<z.ZodObject<{
        uuid: z.ZodNumber;
        title: z.ZodNumber;
        url: z.ZodNumber;
        content_owner: z.ZodNumber;
        for_position: z.ZodNumber;
        last_modified_time: z.ZodNumber;
        expiration_time: z.ZodNumber;
        content_type: z.ZodNumber;
        status: z.ZodNumber;
        is_favorite: z.ZodNumber;
    }, z.core.$strip>>;
    _min: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        uuid: z.ZodNullable<z.ZodString>;
        title: z.ZodNullable<z.ZodString>;
        url: z.ZodNullable<z.ZodString>;
        content_owner: z.ZodNullable<z.ZodString>;
        last_modified_time: z.ZodNullable<z.ZodDate>;
        expiration_time: z.ZodNullable<z.ZodDate>;
    }, z.core.$strip>>>;
    _max: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        uuid: z.ZodNullable<z.ZodString>;
        title: z.ZodNullable<z.ZodString>;
        url: z.ZodNullable<z.ZodString>;
        content_owner: z.ZodNullable<z.ZodString>;
        last_modified_time: z.ZodNullable<z.ZodDate>;
        expiration_time: z.ZodNullable<z.ZodDate>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const ContentGroupByResultSchema: z.ZodArray<z.ZodObject<{
    uuid: z.ZodString;
    title: z.ZodString;
    url: z.ZodString;
    content_owner: z.ZodString;
    last_modified_time: z.ZodDate;
    expiration_time: z.ZodDate;
    is_favorite: z.ZodBoolean;
    _count: z.ZodOptional<z.ZodObject<{
        uuid: z.ZodNumber;
        title: z.ZodNumber;
        url: z.ZodNumber;
        content_owner: z.ZodNumber;
        for_position: z.ZodNumber;
        last_modified_time: z.ZodNumber;
        expiration_time: z.ZodNumber;
        content_type: z.ZodNumber;
        status: z.ZodNumber;
        is_favorite: z.ZodNumber;
    }, z.core.$strip>>;
    _min: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        uuid: z.ZodNullable<z.ZodString>;
        title: z.ZodNullable<z.ZodString>;
        url: z.ZodNullable<z.ZodString>;
        content_owner: z.ZodNullable<z.ZodString>;
        last_modified_time: z.ZodNullable<z.ZodDate>;
        expiration_time: z.ZodNullable<z.ZodDate>;
    }, z.core.$strip>>>;
    _max: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        uuid: z.ZodNullable<z.ZodString>;
        title: z.ZodNullable<z.ZodString>;
        url: z.ZodNullable<z.ZodString>;
        content_owner: z.ZodNullable<z.ZodString>;
        last_modified_time: z.ZodNullable<z.ZodDate>;
        expiration_time: z.ZodNullable<z.ZodDate>;
    }, z.core.$strip>>>;
}, z.core.$strip>>;
export declare const ContentCountResultSchema: z.ZodNumber;
export declare const AccountFindUniqueResultSchema: z.ZodNullable<z.ZodObject<{
    employee: z.ZodUnknown;
    employeeUuid: z.ZodString;
    username: z.ZodString;
    password: z.ZodString;
    type: z.ZodUnknown;
}, z.core.$strip>>;
export declare const AccountFindFirstResultSchema: z.ZodNullable<z.ZodObject<{
    employee: z.ZodUnknown;
    employeeUuid: z.ZodString;
    username: z.ZodString;
    password: z.ZodString;
    type: z.ZodUnknown;
}, z.core.$strip>>;
export declare const AccountFindManyResultSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        employee: z.ZodUnknown;
        employeeUuid: z.ZodString;
        username: z.ZodString;
        password: z.ZodString;
        type: z.ZodUnknown;
    }, z.core.$strip>>;
    pagination: z.ZodObject<{
        page: z.ZodNumber;
        pageSize: z.ZodNumber;
        total: z.ZodNumber;
        totalPages: z.ZodNumber;
        hasNext: z.ZodBoolean;
        hasPrev: z.ZodBoolean;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const AccountCreateResultSchema: z.ZodObject<{
    employee: z.ZodUnknown;
    employeeUuid: z.ZodString;
    username: z.ZodString;
    password: z.ZodString;
    type: z.ZodUnknown;
}, z.core.$strip>;
export declare const AccountCreateManyResultSchema: z.ZodObject<{
    count: z.ZodNumber;
}, z.core.$strip>;
export declare const AccountUpdateResultSchema: z.ZodNullable<z.ZodObject<{
    employee: z.ZodUnknown;
    employeeUuid: z.ZodString;
    username: z.ZodString;
    password: z.ZodString;
    type: z.ZodUnknown;
}, z.core.$strip>>;
export declare const AccountUpdateManyResultSchema: z.ZodObject<{
    count: z.ZodNumber;
}, z.core.$strip>;
export declare const AccountUpsertResultSchema: z.ZodObject<{
    employee: z.ZodUnknown;
    employeeUuid: z.ZodString;
    username: z.ZodString;
    password: z.ZodString;
    type: z.ZodUnknown;
}, z.core.$strip>;
export declare const AccountDeleteResultSchema: z.ZodNullable<z.ZodObject<{
    employee: z.ZodUnknown;
    employeeUuid: z.ZodString;
    username: z.ZodString;
    password: z.ZodString;
    type: z.ZodUnknown;
}, z.core.$strip>>;
export declare const AccountDeleteManyResultSchema: z.ZodObject<{
    count: z.ZodNumber;
}, z.core.$strip>;
export declare const AccountAggregateResultSchema: z.ZodObject<{
    _count: z.ZodOptional<z.ZodObject<{
        employee: z.ZodNumber;
        employeeUuid: z.ZodNumber;
        username: z.ZodNumber;
        password: z.ZodNumber;
        type: z.ZodNumber;
    }, z.core.$strip>>;
    _min: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        employeeUuid: z.ZodNullable<z.ZodString>;
        username: z.ZodNullable<z.ZodString>;
        password: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>>;
    _max: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        employeeUuid: z.ZodNullable<z.ZodString>;
        username: z.ZodNullable<z.ZodString>;
        password: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const AccountGroupByResultSchema: z.ZodArray<z.ZodObject<{
    employeeUuid: z.ZodString;
    username: z.ZodString;
    password: z.ZodString;
    _count: z.ZodOptional<z.ZodObject<{
        employee: z.ZodNumber;
        employeeUuid: z.ZodNumber;
        username: z.ZodNumber;
        password: z.ZodNumber;
        type: z.ZodNumber;
    }, z.core.$strip>>;
    _min: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        employeeUuid: z.ZodNullable<z.ZodString>;
        username: z.ZodNullable<z.ZodString>;
        password: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>>;
    _max: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        employeeUuid: z.ZodNullable<z.ZodString>;
        username: z.ZodNullable<z.ZodString>;
        password: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>>;
export declare const AccountCountResultSchema: z.ZodNumber;
//# sourceMappingURL=schemas.d.ts.map