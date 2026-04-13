/**
 * Prisma Zod Generator - Single File (inlined)
 * Auto-generated. Do not edit.
 */
import * as z from 'zod';
// File: TransactionIsolationLevel.schema.ts
export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted', 'ReadCommitted', 'RepeatableRead', 'Serializable']);
// File: EmployeeScalarFieldEnum.schema.ts
export const EmployeeScalarFieldEnumSchema = z.enum(['uuid', 'avatar', 'first_name', 'last_name', 'date_of_birth', 'position', 'department', 'start_date', 'supervisor', 'phone_number', 'personal_email', 'corporate_email']);
// File: ContentScalarFieldEnum.schema.ts
export const ContentScalarFieldEnumSchema = z.enum(['uuid', 'title', 'url', 'content_owner', 'for_position', 'last_modified_time', 'expiration_time', 'content_type', 'status', 'is_favorite']);
// File: AccountScalarFieldEnum.schema.ts
export const AccountScalarFieldEnumSchema = z.enum(['employeeUuid', 'username', 'password', 'type']);
// File: SortOrder.schema.ts
export const SortOrderSchema = z.enum(['asc', 'desc']);
// File: QueryMode.schema.ts
export const QueryModeSchema = z.enum(['default', 'insensitive']);
// File: NullsOrder.schema.ts
export const NullsOrderSchema = z.enum(['first', 'last']);
// File: Position.schema.ts
export const PositionSchema = z.enum(['UNDERWRITER', 'BUSINESS_ANALYST', 'ADMIN']);
// File: Department.schema.ts
export const DepartmentSchema = z.enum(['OPERATION_TECHNOLOGY', 'ACCOUNTING']);
// File: ContentType.schema.ts
export const ContentTypeSchema = z.enum(['REFERENCE', 'WORKFLOW']);
// File: ContentStatus.schema.ts
export const ContentStatusSchema = z.enum(['AVAILABLE', 'IN_USE', 'UNAVAILABLE']);
// File: AccountType.schema.ts
export const AccountTypeSchema = z.enum(['ADMIN', 'EMPLOYEE']);
// File: EmployeeWhereInput.schema.ts
const employeewhereinputSchema = z.object({
    AND: z.union([z.lazy(() => EmployeeWhereInputObjectSchema), z.lazy(() => EmployeeWhereInputObjectSchema).array()]).optional(),
    OR: z.lazy(() => EmployeeWhereInputObjectSchema).array().optional(),
    NOT: z.union([z.lazy(() => EmployeeWhereInputObjectSchema), z.lazy(() => EmployeeWhereInputObjectSchema).array()]).optional(),
    uuid: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
    avatar: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
    first_name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
    last_name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
    date_of_birth: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
    position: z.union([z.lazy(() => EnumPositionFilterObjectSchema), PositionSchema]).optional(),
    department: z.union([z.lazy(() => EnumDepartmentFilterObjectSchema), DepartmentSchema]).optional(),
    start_date: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
    supervisor: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
    phone_number: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
    personal_email: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
    corporate_email: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
    account: z.union([z.lazy(() => AccountNullableScalarRelationFilterObjectSchema), z.lazy(() => AccountWhereInputObjectSchema)]).optional()
}).strict();
export const EmployeeWhereInputObjectSchema = employeewhereinputSchema;
export const EmployeeWhereInputObjectZodSchema = employeewhereinputSchema;
// File: EmployeeOrderByWithRelationInput.schema.ts
const __makeSchema_EmployeeOrderByWithRelationInput_schema = () => z.object({
    uuid: SortOrderSchema.optional(),
    avatar: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
    first_name: SortOrderSchema.optional(),
    last_name: SortOrderSchema.optional(),
    date_of_birth: SortOrderSchema.optional(),
    position: SortOrderSchema.optional(),
    department: SortOrderSchema.optional(),
    start_date: SortOrderSchema.optional(),
    supervisor: SortOrderSchema.optional(),
    phone_number: SortOrderSchema.optional(),
    personal_email: SortOrderSchema.optional(),
    corporate_email: SortOrderSchema.optional(),
    account: z.lazy(() => AccountOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const EmployeeOrderByWithRelationInputObjectSchema = __makeSchema_EmployeeOrderByWithRelationInput_schema();
export const EmployeeOrderByWithRelationInputObjectZodSchema = __makeSchema_EmployeeOrderByWithRelationInput_schema();
// File: EmployeeWhereUniqueInput.schema.ts
const __makeSchema_EmployeeWhereUniqueInput_schema = () => z.object({
    uuid: z.string().optional()
}).strict();
export const EmployeeWhereUniqueInputObjectSchema = __makeSchema_EmployeeWhereUniqueInput_schema();
export const EmployeeWhereUniqueInputObjectZodSchema = __makeSchema_EmployeeWhereUniqueInput_schema();
// File: EmployeeOrderByWithAggregationInput.schema.ts
const __makeSchema_EmployeeOrderByWithAggregationInput_schema = () => z.object({
    uuid: SortOrderSchema.optional(),
    avatar: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
    first_name: SortOrderSchema.optional(),
    last_name: SortOrderSchema.optional(),
    date_of_birth: SortOrderSchema.optional(),
    position: SortOrderSchema.optional(),
    department: SortOrderSchema.optional(),
    start_date: SortOrderSchema.optional(),
    supervisor: SortOrderSchema.optional(),
    phone_number: SortOrderSchema.optional(),
    personal_email: SortOrderSchema.optional(),
    corporate_email: SortOrderSchema.optional(),
    _count: z.lazy(() => EmployeeCountOrderByAggregateInputObjectSchema).optional(),
    _max: z.lazy(() => EmployeeMaxOrderByAggregateInputObjectSchema).optional(),
    _min: z.lazy(() => EmployeeMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const EmployeeOrderByWithAggregationInputObjectSchema = __makeSchema_EmployeeOrderByWithAggregationInput_schema();
export const EmployeeOrderByWithAggregationInputObjectZodSchema = __makeSchema_EmployeeOrderByWithAggregationInput_schema();
// File: EmployeeScalarWhereWithAggregatesInput.schema.ts
const employeescalarwherewithaggregatesinputSchema = z.object({
    AND: z.union([z.lazy(() => EmployeeScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => EmployeeScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
    OR: z.lazy(() => EmployeeScalarWhereWithAggregatesInputObjectSchema).array().optional(),
    NOT: z.union([z.lazy(() => EmployeeScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => EmployeeScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
    uuid: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
    avatar: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
    first_name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
    last_name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
    date_of_birth: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
    position: z.union([z.lazy(() => EnumPositionWithAggregatesFilterObjectSchema), PositionSchema]).optional(),
    department: z.union([z.lazy(() => EnumDepartmentWithAggregatesFilterObjectSchema), DepartmentSchema]).optional(),
    start_date: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
    supervisor: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
    phone_number: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
    personal_email: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
    corporate_email: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional()
}).strict();
export const EmployeeScalarWhereWithAggregatesInputObjectSchema = employeescalarwherewithaggregatesinputSchema;
export const EmployeeScalarWhereWithAggregatesInputObjectZodSchema = employeescalarwherewithaggregatesinputSchema;
// File: ContentWhereInput.schema.ts
const contentwhereinputSchema = z.object({
    AND: z.union([z.lazy(() => ContentWhereInputObjectSchema), z.lazy(() => ContentWhereInputObjectSchema).array()]).optional(),
    OR: z.lazy(() => ContentWhereInputObjectSchema).array().optional(),
    NOT: z.union([z.lazy(() => ContentWhereInputObjectSchema), z.lazy(() => ContentWhereInputObjectSchema).array()]).optional(),
    uuid: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
    title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
    url: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
    content_owner: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
    for_position: z.union([z.lazy(() => EnumPositionFilterObjectSchema), PositionSchema]).optional(),
    last_modified_time: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
    expiration_time: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
    content_type: z.union([z.lazy(() => EnumContentTypeFilterObjectSchema), ContentTypeSchema]).optional(),
    status: z.union([z.lazy(() => EnumContentStatusFilterObjectSchema), ContentStatusSchema]).optional(),
    is_favorite: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional()
}).strict();
export const ContentWhereInputObjectSchema = contentwhereinputSchema;
export const ContentWhereInputObjectZodSchema = contentwhereinputSchema;
// File: ContentOrderByWithRelationInput.schema.ts
const __makeSchema_ContentOrderByWithRelationInput_schema = () => z.object({
    uuid: SortOrderSchema.optional(),
    title: SortOrderSchema.optional(),
    url: SortOrderSchema.optional(),
    content_owner: SortOrderSchema.optional(),
    for_position: SortOrderSchema.optional(),
    last_modified_time: SortOrderSchema.optional(),
    expiration_time: SortOrderSchema.optional(),
    content_type: SortOrderSchema.optional(),
    status: SortOrderSchema.optional(),
    is_favorite: SortOrderSchema.optional()
}).strict();
export const ContentOrderByWithRelationInputObjectSchema = __makeSchema_ContentOrderByWithRelationInput_schema();
export const ContentOrderByWithRelationInputObjectZodSchema = __makeSchema_ContentOrderByWithRelationInput_schema();
// File: ContentWhereUniqueInput.schema.ts
const __makeSchema_ContentWhereUniqueInput_schema = () => z.object({
    uuid: z.string().optional()
}).strict();
export const ContentWhereUniqueInputObjectSchema = __makeSchema_ContentWhereUniqueInput_schema();
export const ContentWhereUniqueInputObjectZodSchema = __makeSchema_ContentWhereUniqueInput_schema();
// File: ContentOrderByWithAggregationInput.schema.ts
const __makeSchema_ContentOrderByWithAggregationInput_schema = () => z.object({
    uuid: SortOrderSchema.optional(),
    title: SortOrderSchema.optional(),
    url: SortOrderSchema.optional(),
    content_owner: SortOrderSchema.optional(),
    for_position: SortOrderSchema.optional(),
    last_modified_time: SortOrderSchema.optional(),
    expiration_time: SortOrderSchema.optional(),
    content_type: SortOrderSchema.optional(),
    status: SortOrderSchema.optional(),
    is_favorite: SortOrderSchema.optional(),
    _count: z.lazy(() => ContentCountOrderByAggregateInputObjectSchema).optional(),
    _max: z.lazy(() => ContentMaxOrderByAggregateInputObjectSchema).optional(),
    _min: z.lazy(() => ContentMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const ContentOrderByWithAggregationInputObjectSchema = __makeSchema_ContentOrderByWithAggregationInput_schema();
export const ContentOrderByWithAggregationInputObjectZodSchema = __makeSchema_ContentOrderByWithAggregationInput_schema();
// File: ContentScalarWhereWithAggregatesInput.schema.ts
const contentscalarwherewithaggregatesinputSchema = z.object({
    AND: z.union([z.lazy(() => ContentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ContentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
    OR: z.lazy(() => ContentScalarWhereWithAggregatesInputObjectSchema).array().optional(),
    NOT: z.union([z.lazy(() => ContentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ContentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
    uuid: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
    title: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
    url: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
    content_owner: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
    for_position: z.union([z.lazy(() => EnumPositionWithAggregatesFilterObjectSchema), PositionSchema]).optional(),
    last_modified_time: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
    expiration_time: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
    content_type: z.union([z.lazy(() => EnumContentTypeWithAggregatesFilterObjectSchema), ContentTypeSchema]).optional(),
    status: z.union([z.lazy(() => EnumContentStatusWithAggregatesFilterObjectSchema), ContentStatusSchema]).optional(),
    is_favorite: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional()
}).strict();
export const ContentScalarWhereWithAggregatesInputObjectSchema = contentscalarwherewithaggregatesinputSchema;
export const ContentScalarWhereWithAggregatesInputObjectZodSchema = contentscalarwherewithaggregatesinputSchema;
// File: AccountWhereInput.schema.ts
const accountwhereinputSchema = z.object({
    AND: z.union([z.lazy(() => AccountWhereInputObjectSchema), z.lazy(() => AccountWhereInputObjectSchema).array()]).optional(),
    OR: z.lazy(() => AccountWhereInputObjectSchema).array().optional(),
    NOT: z.union([z.lazy(() => AccountWhereInputObjectSchema), z.lazy(() => AccountWhereInputObjectSchema).array()]).optional(),
    employeeUuid: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
    username: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
    password: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
    type: z.union([z.lazy(() => EnumAccountTypeFilterObjectSchema), AccountTypeSchema]).optional(),
    employee: z.union([z.lazy(() => EmployeeScalarRelationFilterObjectSchema), z.lazy(() => EmployeeWhereInputObjectSchema)]).optional()
}).strict();
export const AccountWhereInputObjectSchema = accountwhereinputSchema;
export const AccountWhereInputObjectZodSchema = accountwhereinputSchema;
// File: AccountOrderByWithRelationInput.schema.ts
const __makeSchema_AccountOrderByWithRelationInput_schema = () => z.object({
    employeeUuid: SortOrderSchema.optional(),
    username: SortOrderSchema.optional(),
    password: SortOrderSchema.optional(),
    type: SortOrderSchema.optional(),
    employee: z.lazy(() => EmployeeOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const AccountOrderByWithRelationInputObjectSchema = __makeSchema_AccountOrderByWithRelationInput_schema();
export const AccountOrderByWithRelationInputObjectZodSchema = __makeSchema_AccountOrderByWithRelationInput_schema();
// File: AccountWhereUniqueInput.schema.ts
const __makeSchema_AccountWhereUniqueInput_schema = () => z.object({
    employeeUuid: z.string().optional(),
    username: z.string().optional()
}).strict();
export const AccountWhereUniqueInputObjectSchema = __makeSchema_AccountWhereUniqueInput_schema();
export const AccountWhereUniqueInputObjectZodSchema = __makeSchema_AccountWhereUniqueInput_schema();
// File: AccountOrderByWithAggregationInput.schema.ts
const __makeSchema_AccountOrderByWithAggregationInput_schema = () => z.object({
    employeeUuid: SortOrderSchema.optional(),
    username: SortOrderSchema.optional(),
    password: SortOrderSchema.optional(),
    type: SortOrderSchema.optional(),
    _count: z.lazy(() => AccountCountOrderByAggregateInputObjectSchema).optional(),
    _max: z.lazy(() => AccountMaxOrderByAggregateInputObjectSchema).optional(),
    _min: z.lazy(() => AccountMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const AccountOrderByWithAggregationInputObjectSchema = __makeSchema_AccountOrderByWithAggregationInput_schema();
export const AccountOrderByWithAggregationInputObjectZodSchema = __makeSchema_AccountOrderByWithAggregationInput_schema();
// File: AccountScalarWhereWithAggregatesInput.schema.ts
const accountscalarwherewithaggregatesinputSchema = z.object({
    AND: z.union([z.lazy(() => AccountScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => AccountScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
    OR: z.lazy(() => AccountScalarWhereWithAggregatesInputObjectSchema).array().optional(),
    NOT: z.union([z.lazy(() => AccountScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => AccountScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
    employeeUuid: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
    username: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
    password: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
    type: z.union([z.lazy(() => EnumAccountTypeWithAggregatesFilterObjectSchema), AccountTypeSchema]).optional()
}).strict();
export const AccountScalarWhereWithAggregatesInputObjectSchema = accountscalarwherewithaggregatesinputSchema;
export const AccountScalarWhereWithAggregatesInputObjectZodSchema = accountscalarwherewithaggregatesinputSchema;
// File: EmployeeCreateInput.schema.ts
const __makeSchema_EmployeeCreateInput_schema = () => z.object({
    uuid: z.string().optional(),
    avatar: z.string().optional().nullable(),
    first_name: z.string(),
    last_name: z.string(),
    date_of_birth: z.coerce.date(),
    position: PositionSchema,
    department: DepartmentSchema,
    start_date: z.coerce.date(),
    supervisor: z.string(),
    phone_number: z.string(),
    personal_email: z.string(),
    corporate_email: z.string(),
    account: z.lazy(() => AccountCreateNestedOneWithoutEmployeeInputObjectSchema).optional()
}).strict();
export const EmployeeCreateInputObjectSchema = __makeSchema_EmployeeCreateInput_schema();
export const EmployeeCreateInputObjectZodSchema = __makeSchema_EmployeeCreateInput_schema();
// File: EmployeeUncheckedCreateInput.schema.ts
const __makeSchema_EmployeeUncheckedCreateInput_schema = () => z.object({
    uuid: z.string().optional(),
    avatar: z.string().optional().nullable(),
    first_name: z.string(),
    last_name: z.string(),
    date_of_birth: z.coerce.date(),
    position: PositionSchema,
    department: DepartmentSchema,
    start_date: z.coerce.date(),
    supervisor: z.string(),
    phone_number: z.string(),
    personal_email: z.string(),
    corporate_email: z.string(),
    account: z.lazy(() => AccountUncheckedCreateNestedOneWithoutEmployeeInputObjectSchema).optional()
}).strict();
export const EmployeeUncheckedCreateInputObjectSchema = __makeSchema_EmployeeUncheckedCreateInput_schema();
export const EmployeeUncheckedCreateInputObjectZodSchema = __makeSchema_EmployeeUncheckedCreateInput_schema();
// File: EmployeeUpdateInput.schema.ts
const __makeSchema_EmployeeUpdateInput_schema = () => z.object({
    uuid: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    avatar: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
    first_name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    last_name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    date_of_birth: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
    position: z.union([PositionSchema, z.lazy(() => EnumPositionFieldUpdateOperationsInputObjectSchema)]).optional(),
    department: z.union([DepartmentSchema, z.lazy(() => EnumDepartmentFieldUpdateOperationsInputObjectSchema)]).optional(),
    start_date: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
    supervisor: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    phone_number: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    personal_email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    corporate_email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    account: z.lazy(() => AccountUpdateOneWithoutEmployeeNestedInputObjectSchema).optional()
}).strict();
export const EmployeeUpdateInputObjectSchema = __makeSchema_EmployeeUpdateInput_schema();
export const EmployeeUpdateInputObjectZodSchema = __makeSchema_EmployeeUpdateInput_schema();
// File: EmployeeUncheckedUpdateInput.schema.ts
const __makeSchema_EmployeeUncheckedUpdateInput_schema = () => z.object({
    uuid: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    avatar: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
    first_name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    last_name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    date_of_birth: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
    position: z.union([PositionSchema, z.lazy(() => EnumPositionFieldUpdateOperationsInputObjectSchema)]).optional(),
    department: z.union([DepartmentSchema, z.lazy(() => EnumDepartmentFieldUpdateOperationsInputObjectSchema)]).optional(),
    start_date: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
    supervisor: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    phone_number: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    personal_email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    corporate_email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    account: z.lazy(() => AccountUncheckedUpdateOneWithoutEmployeeNestedInputObjectSchema).optional()
}).strict();
export const EmployeeUncheckedUpdateInputObjectSchema = __makeSchema_EmployeeUncheckedUpdateInput_schema();
export const EmployeeUncheckedUpdateInputObjectZodSchema = __makeSchema_EmployeeUncheckedUpdateInput_schema();
// File: EmployeeCreateManyInput.schema.ts
const __makeSchema_EmployeeCreateManyInput_schema = () => z.object({
    uuid: z.string().optional(),
    avatar: z.string().optional().nullable(),
    first_name: z.string(),
    last_name: z.string(),
    date_of_birth: z.coerce.date(),
    position: PositionSchema,
    department: DepartmentSchema,
    start_date: z.coerce.date(),
    supervisor: z.string(),
    phone_number: z.string(),
    personal_email: z.string(),
    corporate_email: z.string()
}).strict();
export const EmployeeCreateManyInputObjectSchema = __makeSchema_EmployeeCreateManyInput_schema();
export const EmployeeCreateManyInputObjectZodSchema = __makeSchema_EmployeeCreateManyInput_schema();
// File: EmployeeUpdateManyMutationInput.schema.ts
const __makeSchema_EmployeeUpdateManyMutationInput_schema = () => z.object({
    uuid: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    avatar: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
    first_name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    last_name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    date_of_birth: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
    position: z.union([PositionSchema, z.lazy(() => EnumPositionFieldUpdateOperationsInputObjectSchema)]).optional(),
    department: z.union([DepartmentSchema, z.lazy(() => EnumDepartmentFieldUpdateOperationsInputObjectSchema)]).optional(),
    start_date: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
    supervisor: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    phone_number: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    personal_email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    corporate_email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const EmployeeUpdateManyMutationInputObjectSchema = __makeSchema_EmployeeUpdateManyMutationInput_schema();
export const EmployeeUpdateManyMutationInputObjectZodSchema = __makeSchema_EmployeeUpdateManyMutationInput_schema();
// File: EmployeeUncheckedUpdateManyInput.schema.ts
const __makeSchema_EmployeeUncheckedUpdateManyInput_schema = () => z.object({
    uuid: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    avatar: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
    first_name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    last_name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    date_of_birth: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
    position: z.union([PositionSchema, z.lazy(() => EnumPositionFieldUpdateOperationsInputObjectSchema)]).optional(),
    department: z.union([DepartmentSchema, z.lazy(() => EnumDepartmentFieldUpdateOperationsInputObjectSchema)]).optional(),
    start_date: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
    supervisor: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    phone_number: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    personal_email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    corporate_email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const EmployeeUncheckedUpdateManyInputObjectSchema = __makeSchema_EmployeeUncheckedUpdateManyInput_schema();
export const EmployeeUncheckedUpdateManyInputObjectZodSchema = __makeSchema_EmployeeUncheckedUpdateManyInput_schema();
// File: ContentCreateInput.schema.ts
const __makeSchema_ContentCreateInput_schema = () => z.object({
    uuid: z.string().optional(),
    title: z.string(),
    url: z.string(),
    content_owner: z.string(),
    for_position: PositionSchema,
    last_modified_time: z.coerce.date(),
    expiration_time: z.coerce.date(),
    content_type: ContentTypeSchema,
    status: ContentStatusSchema,
    is_favorite: z.boolean().optional()
}).strict();
export const ContentCreateInputObjectSchema = __makeSchema_ContentCreateInput_schema();
export const ContentCreateInputObjectZodSchema = __makeSchema_ContentCreateInput_schema();
// File: ContentUncheckedCreateInput.schema.ts
const __makeSchema_ContentUncheckedCreateInput_schema = () => z.object({
    uuid: z.string().optional(),
    title: z.string(),
    url: z.string(),
    content_owner: z.string(),
    for_position: PositionSchema,
    last_modified_time: z.coerce.date(),
    expiration_time: z.coerce.date(),
    content_type: ContentTypeSchema,
    status: ContentStatusSchema,
    is_favorite: z.boolean().optional()
}).strict();
export const ContentUncheckedCreateInputObjectSchema = __makeSchema_ContentUncheckedCreateInput_schema();
export const ContentUncheckedCreateInputObjectZodSchema = __makeSchema_ContentUncheckedCreateInput_schema();
// File: ContentUpdateInput.schema.ts
const __makeSchema_ContentUpdateInput_schema = () => z.object({
    uuid: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    content_owner: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    for_position: z.union([PositionSchema, z.lazy(() => EnumPositionFieldUpdateOperationsInputObjectSchema)]).optional(),
    last_modified_time: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
    expiration_time: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
    content_type: z.union([ContentTypeSchema, z.lazy(() => EnumContentTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
    status: z.union([ContentStatusSchema, z.lazy(() => EnumContentStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
    is_favorite: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const ContentUpdateInputObjectSchema = __makeSchema_ContentUpdateInput_schema();
export const ContentUpdateInputObjectZodSchema = __makeSchema_ContentUpdateInput_schema();
// File: ContentUncheckedUpdateInput.schema.ts
const __makeSchema_ContentUncheckedUpdateInput_schema = () => z.object({
    uuid: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    content_owner: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    for_position: z.union([PositionSchema, z.lazy(() => EnumPositionFieldUpdateOperationsInputObjectSchema)]).optional(),
    last_modified_time: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
    expiration_time: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
    content_type: z.union([ContentTypeSchema, z.lazy(() => EnumContentTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
    status: z.union([ContentStatusSchema, z.lazy(() => EnumContentStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
    is_favorite: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const ContentUncheckedUpdateInputObjectSchema = __makeSchema_ContentUncheckedUpdateInput_schema();
export const ContentUncheckedUpdateInputObjectZodSchema = __makeSchema_ContentUncheckedUpdateInput_schema();
// File: ContentCreateManyInput.schema.ts
const __makeSchema_ContentCreateManyInput_schema = () => z.object({
    uuid: z.string().optional(),
    title: z.string(),
    url: z.string(),
    content_owner: z.string(),
    for_position: PositionSchema,
    last_modified_time: z.coerce.date(),
    expiration_time: z.coerce.date(),
    content_type: ContentTypeSchema,
    status: ContentStatusSchema,
    is_favorite: z.boolean().optional()
}).strict();
export const ContentCreateManyInputObjectSchema = __makeSchema_ContentCreateManyInput_schema();
export const ContentCreateManyInputObjectZodSchema = __makeSchema_ContentCreateManyInput_schema();
// File: ContentUpdateManyMutationInput.schema.ts
const __makeSchema_ContentUpdateManyMutationInput_schema = () => z.object({
    uuid: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    content_owner: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    for_position: z.union([PositionSchema, z.lazy(() => EnumPositionFieldUpdateOperationsInputObjectSchema)]).optional(),
    last_modified_time: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
    expiration_time: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
    content_type: z.union([ContentTypeSchema, z.lazy(() => EnumContentTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
    status: z.union([ContentStatusSchema, z.lazy(() => EnumContentStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
    is_favorite: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const ContentUpdateManyMutationInputObjectSchema = __makeSchema_ContentUpdateManyMutationInput_schema();
export const ContentUpdateManyMutationInputObjectZodSchema = __makeSchema_ContentUpdateManyMutationInput_schema();
// File: ContentUncheckedUpdateManyInput.schema.ts
const __makeSchema_ContentUncheckedUpdateManyInput_schema = () => z.object({
    uuid: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    content_owner: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    for_position: z.union([PositionSchema, z.lazy(() => EnumPositionFieldUpdateOperationsInputObjectSchema)]).optional(),
    last_modified_time: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
    expiration_time: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
    content_type: z.union([ContentTypeSchema, z.lazy(() => EnumContentTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
    status: z.union([ContentStatusSchema, z.lazy(() => EnumContentStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
    is_favorite: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const ContentUncheckedUpdateManyInputObjectSchema = __makeSchema_ContentUncheckedUpdateManyInput_schema();
export const ContentUncheckedUpdateManyInputObjectZodSchema = __makeSchema_ContentUncheckedUpdateManyInput_schema();
// File: AccountCreateInput.schema.ts
const __makeSchema_AccountCreateInput_schema = () => z.object({
    username: z.string(),
    password: z.string(),
    type: AccountTypeSchema,
    employee: z.lazy(() => EmployeeCreateNestedOneWithoutAccountInputObjectSchema)
}).strict();
export const AccountCreateInputObjectSchema = __makeSchema_AccountCreateInput_schema();
export const AccountCreateInputObjectZodSchema = __makeSchema_AccountCreateInput_schema();
// File: AccountUncheckedCreateInput.schema.ts
const __makeSchema_AccountUncheckedCreateInput_schema = () => z.object({
    employeeUuid: z.string(),
    username: z.string(),
    password: z.string(),
    type: AccountTypeSchema
}).strict();
export const AccountUncheckedCreateInputObjectSchema = __makeSchema_AccountUncheckedCreateInput_schema();
export const AccountUncheckedCreateInputObjectZodSchema = __makeSchema_AccountUncheckedCreateInput_schema();
// File: AccountUpdateInput.schema.ts
const __makeSchema_AccountUpdateInput_schema = () => z.object({
    username: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    password: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    type: z.union([AccountTypeSchema, z.lazy(() => EnumAccountTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
    employee: z.lazy(() => EmployeeUpdateOneRequiredWithoutAccountNestedInputObjectSchema).optional()
}).strict();
export const AccountUpdateInputObjectSchema = __makeSchema_AccountUpdateInput_schema();
export const AccountUpdateInputObjectZodSchema = __makeSchema_AccountUpdateInput_schema();
// File: AccountUncheckedUpdateInput.schema.ts
const __makeSchema_AccountUncheckedUpdateInput_schema = () => z.object({
    employeeUuid: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    username: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    password: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    type: z.union([AccountTypeSchema, z.lazy(() => EnumAccountTypeFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const AccountUncheckedUpdateInputObjectSchema = __makeSchema_AccountUncheckedUpdateInput_schema();
export const AccountUncheckedUpdateInputObjectZodSchema = __makeSchema_AccountUncheckedUpdateInput_schema();
// File: AccountCreateManyInput.schema.ts
const __makeSchema_AccountCreateManyInput_schema = () => z.object({
    employeeUuid: z.string(),
    username: z.string(),
    password: z.string(),
    type: AccountTypeSchema
}).strict();
export const AccountCreateManyInputObjectSchema = __makeSchema_AccountCreateManyInput_schema();
export const AccountCreateManyInputObjectZodSchema = __makeSchema_AccountCreateManyInput_schema();
// File: AccountUpdateManyMutationInput.schema.ts
const __makeSchema_AccountUpdateManyMutationInput_schema = () => z.object({
    username: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    password: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    type: z.union([AccountTypeSchema, z.lazy(() => EnumAccountTypeFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const AccountUpdateManyMutationInputObjectSchema = __makeSchema_AccountUpdateManyMutationInput_schema();
export const AccountUpdateManyMutationInputObjectZodSchema = __makeSchema_AccountUpdateManyMutationInput_schema();
// File: AccountUncheckedUpdateManyInput.schema.ts
const __makeSchema_AccountUncheckedUpdateManyInput_schema = () => z.object({
    employeeUuid: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    username: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    password: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    type: z.union([AccountTypeSchema, z.lazy(() => EnumAccountTypeFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const AccountUncheckedUpdateManyInputObjectSchema = __makeSchema_AccountUncheckedUpdateManyInput_schema();
export const AccountUncheckedUpdateManyInputObjectZodSchema = __makeSchema_AccountUncheckedUpdateManyInput_schema();
// File: UuidFilter.schema.ts
const __makeSchema_UuidFilter_schema = () => z.object({
    equals: z.string().optional(),
    in: z.string().array().optional(),
    notIn: z.string().array().optional(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    mode: QueryModeSchema.optional(),
    not: z.union([z.string(), z.lazy(() => NestedUuidFilterObjectSchema)]).optional()
}).strict();
export const UuidFilterObjectSchema = __makeSchema_UuidFilter_schema();
export const UuidFilterObjectZodSchema = __makeSchema_UuidFilter_schema();
// File: StringNullableFilter.schema.ts
const __makeSchema_StringNullableFilter_schema = () => z.object({
    equals: z.string().optional().nullable(),
    in: z.string().array().optional().nullable(),
    notIn: z.string().array().optional().nullable(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    contains: z.string().optional(),
    startsWith: z.string().optional(),
    endsWith: z.string().optional(),
    mode: QueryModeSchema.optional(),
    not: z.union([z.string(), z.lazy(() => NestedStringNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const StringNullableFilterObjectSchema = __makeSchema_StringNullableFilter_schema();
export const StringNullableFilterObjectZodSchema = __makeSchema_StringNullableFilter_schema();
// File: StringFilter.schema.ts
const __makeSchema_StringFilter_schema = () => z.object({
    equals: z.string().optional(),
    in: z.string().array().optional(),
    notIn: z.string().array().optional(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    contains: z.string().optional(),
    startsWith: z.string().optional(),
    endsWith: z.string().optional(),
    mode: QueryModeSchema.optional(),
    not: z.union([z.string(), z.lazy(() => NestedStringFilterObjectSchema)]).optional()
}).strict();
export const StringFilterObjectSchema = __makeSchema_StringFilter_schema();
export const StringFilterObjectZodSchema = __makeSchema_StringFilter_schema();
// File: DateTimeFilter.schema.ts
const __makeSchema_DateTimeFilter_schema = () => z.object({
    equals: z.coerce.date().optional(),
    in: z.union([z.date().array(), z.string().datetime().array()]).optional(),
    notIn: z.union([z.date().array(), z.string().datetime().array()]).optional(),
    lt: z.coerce.date().optional(),
    lte: z.coerce.date().optional(),
    gt: z.coerce.date().optional(),
    gte: z.coerce.date().optional(),
    not: z.union([z.coerce.date(), z.lazy(() => NestedDateTimeFilterObjectSchema)]).optional()
}).strict();
export const DateTimeFilterObjectSchema = __makeSchema_DateTimeFilter_schema();
export const DateTimeFilterObjectZodSchema = __makeSchema_DateTimeFilter_schema();
// File: EnumPositionFilter.schema.ts
const __makeSchema_EnumPositionFilter_schema = () => z.object({
    equals: PositionSchema.optional(),
    in: PositionSchema.array().optional(),
    notIn: PositionSchema.array().optional(),
    not: z.union([PositionSchema, z.lazy(() => NestedEnumPositionFilterObjectSchema)]).optional()
}).strict();
export const EnumPositionFilterObjectSchema = __makeSchema_EnumPositionFilter_schema();
export const EnumPositionFilterObjectZodSchema = __makeSchema_EnumPositionFilter_schema();
// File: EnumDepartmentFilter.schema.ts
const __makeSchema_EnumDepartmentFilter_schema = () => z.object({
    equals: DepartmentSchema.optional(),
    in: DepartmentSchema.array().optional(),
    notIn: DepartmentSchema.array().optional(),
    not: z.union([DepartmentSchema, z.lazy(() => NestedEnumDepartmentFilterObjectSchema)]).optional()
}).strict();
export const EnumDepartmentFilterObjectSchema = __makeSchema_EnumDepartmentFilter_schema();
export const EnumDepartmentFilterObjectZodSchema = __makeSchema_EnumDepartmentFilter_schema();
// File: AccountNullableScalarRelationFilter.schema.ts
const __makeSchema_AccountNullableScalarRelationFilter_schema = () => z.object({
    is: z.lazy(() => AccountWhereInputObjectSchema).optional().nullable(),
    isNot: z.lazy(() => AccountWhereInputObjectSchema).optional().nullable()
}).strict();
export const AccountNullableScalarRelationFilterObjectSchema = __makeSchema_AccountNullableScalarRelationFilter_schema();
export const AccountNullableScalarRelationFilterObjectZodSchema = __makeSchema_AccountNullableScalarRelationFilter_schema();
// File: SortOrderInput.schema.ts
const __makeSchema_SortOrderInput_schema = () => z.object({
    sort: SortOrderSchema,
    nulls: NullsOrderSchema.optional()
}).strict();
export const SortOrderInputObjectSchema = __makeSchema_SortOrderInput_schema();
export const SortOrderInputObjectZodSchema = __makeSchema_SortOrderInput_schema();
// File: EmployeeCountOrderByAggregateInput.schema.ts
const __makeSchema_EmployeeCountOrderByAggregateInput_schema = () => z.object({
    uuid: SortOrderSchema.optional(),
    avatar: SortOrderSchema.optional(),
    first_name: SortOrderSchema.optional(),
    last_name: SortOrderSchema.optional(),
    date_of_birth: SortOrderSchema.optional(),
    position: SortOrderSchema.optional(),
    department: SortOrderSchema.optional(),
    start_date: SortOrderSchema.optional(),
    supervisor: SortOrderSchema.optional(),
    phone_number: SortOrderSchema.optional(),
    personal_email: SortOrderSchema.optional(),
    corporate_email: SortOrderSchema.optional()
}).strict();
export const EmployeeCountOrderByAggregateInputObjectSchema = __makeSchema_EmployeeCountOrderByAggregateInput_schema();
export const EmployeeCountOrderByAggregateInputObjectZodSchema = __makeSchema_EmployeeCountOrderByAggregateInput_schema();
// File: EmployeeMaxOrderByAggregateInput.schema.ts
const __makeSchema_EmployeeMaxOrderByAggregateInput_schema = () => z.object({
    uuid: SortOrderSchema.optional(),
    avatar: SortOrderSchema.optional(),
    first_name: SortOrderSchema.optional(),
    last_name: SortOrderSchema.optional(),
    date_of_birth: SortOrderSchema.optional(),
    position: SortOrderSchema.optional(),
    department: SortOrderSchema.optional(),
    start_date: SortOrderSchema.optional(),
    supervisor: SortOrderSchema.optional(),
    phone_number: SortOrderSchema.optional(),
    personal_email: SortOrderSchema.optional(),
    corporate_email: SortOrderSchema.optional()
}).strict();
export const EmployeeMaxOrderByAggregateInputObjectSchema = __makeSchema_EmployeeMaxOrderByAggregateInput_schema();
export const EmployeeMaxOrderByAggregateInputObjectZodSchema = __makeSchema_EmployeeMaxOrderByAggregateInput_schema();
// File: EmployeeMinOrderByAggregateInput.schema.ts
const __makeSchema_EmployeeMinOrderByAggregateInput_schema = () => z.object({
    uuid: SortOrderSchema.optional(),
    avatar: SortOrderSchema.optional(),
    first_name: SortOrderSchema.optional(),
    last_name: SortOrderSchema.optional(),
    date_of_birth: SortOrderSchema.optional(),
    position: SortOrderSchema.optional(),
    department: SortOrderSchema.optional(),
    start_date: SortOrderSchema.optional(),
    supervisor: SortOrderSchema.optional(),
    phone_number: SortOrderSchema.optional(),
    personal_email: SortOrderSchema.optional(),
    corporate_email: SortOrderSchema.optional()
}).strict();
export const EmployeeMinOrderByAggregateInputObjectSchema = __makeSchema_EmployeeMinOrderByAggregateInput_schema();
export const EmployeeMinOrderByAggregateInputObjectZodSchema = __makeSchema_EmployeeMinOrderByAggregateInput_schema();
// File: UuidWithAggregatesFilter.schema.ts
const __makeSchema_UuidWithAggregatesFilter_schema = () => z.object({
    equals: z.string().optional(),
    in: z.string().array().optional(),
    notIn: z.string().array().optional(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    mode: QueryModeSchema.optional(),
    not: z.union([z.string(), z.lazy(() => NestedUuidWithAggregatesFilterObjectSchema)]).optional(),
    _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
    _min: z.lazy(() => NestedStringFilterObjectSchema).optional(),
    _max: z.lazy(() => NestedStringFilterObjectSchema).optional()
}).strict();
export const UuidWithAggregatesFilterObjectSchema = __makeSchema_UuidWithAggregatesFilter_schema();
export const UuidWithAggregatesFilterObjectZodSchema = __makeSchema_UuidWithAggregatesFilter_schema();
// File: StringNullableWithAggregatesFilter.schema.ts
const __makeSchema_StringNullableWithAggregatesFilter_schema = () => z.object({
    equals: z.string().optional().nullable(),
    in: z.string().array().optional().nullable(),
    notIn: z.string().array().optional().nullable(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    contains: z.string().optional(),
    startsWith: z.string().optional(),
    endsWith: z.string().optional(),
    mode: QueryModeSchema.optional(),
    not: z.union([z.string(), z.lazy(() => NestedStringNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
    _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
    _min: z.lazy(() => NestedStringNullableFilterObjectSchema).optional(),
    _max: z.lazy(() => NestedStringNullableFilterObjectSchema).optional()
}).strict();
export const StringNullableWithAggregatesFilterObjectSchema = __makeSchema_StringNullableWithAggregatesFilter_schema();
export const StringNullableWithAggregatesFilterObjectZodSchema = __makeSchema_StringNullableWithAggregatesFilter_schema();
// File: StringWithAggregatesFilter.schema.ts
const __makeSchema_StringWithAggregatesFilter_schema = () => z.object({
    equals: z.string().optional(),
    in: z.string().array().optional(),
    notIn: z.string().array().optional(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    contains: z.string().optional(),
    startsWith: z.string().optional(),
    endsWith: z.string().optional(),
    mode: QueryModeSchema.optional(),
    not: z.union([z.string(), z.lazy(() => NestedStringWithAggregatesFilterObjectSchema)]).optional(),
    _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
    _min: z.lazy(() => NestedStringFilterObjectSchema).optional(),
    _max: z.lazy(() => NestedStringFilterObjectSchema).optional()
}).strict();
export const StringWithAggregatesFilterObjectSchema = __makeSchema_StringWithAggregatesFilter_schema();
export const StringWithAggregatesFilterObjectZodSchema = __makeSchema_StringWithAggregatesFilter_schema();
// File: DateTimeWithAggregatesFilter.schema.ts
const __makeSchema_DateTimeWithAggregatesFilter_schema = () => z.object({
    equals: z.coerce.date().optional(),
    in: z.union([z.date().array(), z.string().datetime().array()]).optional(),
    notIn: z.union([z.date().array(), z.string().datetime().array()]).optional(),
    lt: z.coerce.date().optional(),
    lte: z.coerce.date().optional(),
    gt: z.coerce.date().optional(),
    gte: z.coerce.date().optional(),
    not: z.union([z.coerce.date(), z.lazy(() => NestedDateTimeWithAggregatesFilterObjectSchema)]).optional(),
    _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
    _min: z.lazy(() => NestedDateTimeFilterObjectSchema).optional(),
    _max: z.lazy(() => NestedDateTimeFilterObjectSchema).optional()
}).strict();
export const DateTimeWithAggregatesFilterObjectSchema = __makeSchema_DateTimeWithAggregatesFilter_schema();
export const DateTimeWithAggregatesFilterObjectZodSchema = __makeSchema_DateTimeWithAggregatesFilter_schema();
// File: EnumPositionWithAggregatesFilter.schema.ts
const __makeSchema_EnumPositionWithAggregatesFilter_schema = () => z.object({
    equals: PositionSchema.optional(),
    in: PositionSchema.array().optional(),
    notIn: PositionSchema.array().optional(),
    not: z.union([PositionSchema, z.lazy(() => NestedEnumPositionWithAggregatesFilterObjectSchema)]).optional(),
    _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
    _min: z.lazy(() => NestedEnumPositionFilterObjectSchema).optional(),
    _max: z.lazy(() => NestedEnumPositionFilterObjectSchema).optional()
}).strict();
export const EnumPositionWithAggregatesFilterObjectSchema = __makeSchema_EnumPositionWithAggregatesFilter_schema();
export const EnumPositionWithAggregatesFilterObjectZodSchema = __makeSchema_EnumPositionWithAggregatesFilter_schema();
// File: EnumDepartmentWithAggregatesFilter.schema.ts
const __makeSchema_EnumDepartmentWithAggregatesFilter_schema = () => z.object({
    equals: DepartmentSchema.optional(),
    in: DepartmentSchema.array().optional(),
    notIn: DepartmentSchema.array().optional(),
    not: z.union([DepartmentSchema, z.lazy(() => NestedEnumDepartmentWithAggregatesFilterObjectSchema)]).optional(),
    _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
    _min: z.lazy(() => NestedEnumDepartmentFilterObjectSchema).optional(),
    _max: z.lazy(() => NestedEnumDepartmentFilterObjectSchema).optional()
}).strict();
export const EnumDepartmentWithAggregatesFilterObjectSchema = __makeSchema_EnumDepartmentWithAggregatesFilter_schema();
export const EnumDepartmentWithAggregatesFilterObjectZodSchema = __makeSchema_EnumDepartmentWithAggregatesFilter_schema();
// File: EnumContentTypeFilter.schema.ts
const __makeSchema_EnumContentTypeFilter_schema = () => z.object({
    equals: ContentTypeSchema.optional(),
    in: ContentTypeSchema.array().optional(),
    notIn: ContentTypeSchema.array().optional(),
    not: z.union([ContentTypeSchema, z.lazy(() => NestedEnumContentTypeFilterObjectSchema)]).optional()
}).strict();
export const EnumContentTypeFilterObjectSchema = __makeSchema_EnumContentTypeFilter_schema();
export const EnumContentTypeFilterObjectZodSchema = __makeSchema_EnumContentTypeFilter_schema();
// File: EnumContentStatusFilter.schema.ts
const __makeSchema_EnumContentStatusFilter_schema = () => z.object({
    equals: ContentStatusSchema.optional(),
    in: ContentStatusSchema.array().optional(),
    notIn: ContentStatusSchema.array().optional(),
    not: z.union([ContentStatusSchema, z.lazy(() => NestedEnumContentStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumContentStatusFilterObjectSchema = __makeSchema_EnumContentStatusFilter_schema();
export const EnumContentStatusFilterObjectZodSchema = __makeSchema_EnumContentStatusFilter_schema();
// File: BoolFilter.schema.ts
const __makeSchema_BoolFilter_schema = () => z.object({
    equals: z.boolean().optional(),
    not: z.union([z.boolean(), z.lazy(() => NestedBoolFilterObjectSchema)]).optional()
}).strict();
export const BoolFilterObjectSchema = __makeSchema_BoolFilter_schema();
export const BoolFilterObjectZodSchema = __makeSchema_BoolFilter_schema();
// File: ContentCountOrderByAggregateInput.schema.ts
const __makeSchema_ContentCountOrderByAggregateInput_schema = () => z.object({
    uuid: SortOrderSchema.optional(),
    title: SortOrderSchema.optional(),
    url: SortOrderSchema.optional(),
    content_owner: SortOrderSchema.optional(),
    for_position: SortOrderSchema.optional(),
    last_modified_time: SortOrderSchema.optional(),
    expiration_time: SortOrderSchema.optional(),
    content_type: SortOrderSchema.optional(),
    status: SortOrderSchema.optional(),
    is_favorite: SortOrderSchema.optional()
}).strict();
export const ContentCountOrderByAggregateInputObjectSchema = __makeSchema_ContentCountOrderByAggregateInput_schema();
export const ContentCountOrderByAggregateInputObjectZodSchema = __makeSchema_ContentCountOrderByAggregateInput_schema();
// File: ContentMaxOrderByAggregateInput.schema.ts
const __makeSchema_ContentMaxOrderByAggregateInput_schema = () => z.object({
    uuid: SortOrderSchema.optional(),
    title: SortOrderSchema.optional(),
    url: SortOrderSchema.optional(),
    content_owner: SortOrderSchema.optional(),
    for_position: SortOrderSchema.optional(),
    last_modified_time: SortOrderSchema.optional(),
    expiration_time: SortOrderSchema.optional(),
    content_type: SortOrderSchema.optional(),
    status: SortOrderSchema.optional(),
    is_favorite: SortOrderSchema.optional()
}).strict();
export const ContentMaxOrderByAggregateInputObjectSchema = __makeSchema_ContentMaxOrderByAggregateInput_schema();
export const ContentMaxOrderByAggregateInputObjectZodSchema = __makeSchema_ContentMaxOrderByAggregateInput_schema();
// File: ContentMinOrderByAggregateInput.schema.ts
const __makeSchema_ContentMinOrderByAggregateInput_schema = () => z.object({
    uuid: SortOrderSchema.optional(),
    title: SortOrderSchema.optional(),
    url: SortOrderSchema.optional(),
    content_owner: SortOrderSchema.optional(),
    for_position: SortOrderSchema.optional(),
    last_modified_time: SortOrderSchema.optional(),
    expiration_time: SortOrderSchema.optional(),
    content_type: SortOrderSchema.optional(),
    status: SortOrderSchema.optional(),
    is_favorite: SortOrderSchema.optional()
}).strict();
export const ContentMinOrderByAggregateInputObjectSchema = __makeSchema_ContentMinOrderByAggregateInput_schema();
export const ContentMinOrderByAggregateInputObjectZodSchema = __makeSchema_ContentMinOrderByAggregateInput_schema();
// File: EnumContentTypeWithAggregatesFilter.schema.ts
const __makeSchema_EnumContentTypeWithAggregatesFilter_schema = () => z.object({
    equals: ContentTypeSchema.optional(),
    in: ContentTypeSchema.array().optional(),
    notIn: ContentTypeSchema.array().optional(),
    not: z.union([ContentTypeSchema, z.lazy(() => NestedEnumContentTypeWithAggregatesFilterObjectSchema)]).optional(),
    _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
    _min: z.lazy(() => NestedEnumContentTypeFilterObjectSchema).optional(),
    _max: z.lazy(() => NestedEnumContentTypeFilterObjectSchema).optional()
}).strict();
export const EnumContentTypeWithAggregatesFilterObjectSchema = __makeSchema_EnumContentTypeWithAggregatesFilter_schema();
export const EnumContentTypeWithAggregatesFilterObjectZodSchema = __makeSchema_EnumContentTypeWithAggregatesFilter_schema();
// File: EnumContentStatusWithAggregatesFilter.schema.ts
const __makeSchema_EnumContentStatusWithAggregatesFilter_schema = () => z.object({
    equals: ContentStatusSchema.optional(),
    in: ContentStatusSchema.array().optional(),
    notIn: ContentStatusSchema.array().optional(),
    not: z.union([ContentStatusSchema, z.lazy(() => NestedEnumContentStatusWithAggregatesFilterObjectSchema)]).optional(),
    _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
    _min: z.lazy(() => NestedEnumContentStatusFilterObjectSchema).optional(),
    _max: z.lazy(() => NestedEnumContentStatusFilterObjectSchema).optional()
}).strict();
export const EnumContentStatusWithAggregatesFilterObjectSchema = __makeSchema_EnumContentStatusWithAggregatesFilter_schema();
export const EnumContentStatusWithAggregatesFilterObjectZodSchema = __makeSchema_EnumContentStatusWithAggregatesFilter_schema();
// File: BoolWithAggregatesFilter.schema.ts
const __makeSchema_BoolWithAggregatesFilter_schema = () => z.object({
    equals: z.boolean().optional(),
    not: z.union([z.boolean(), z.lazy(() => NestedBoolWithAggregatesFilterObjectSchema)]).optional(),
    _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
    _min: z.lazy(() => NestedBoolFilterObjectSchema).optional(),
    _max: z.lazy(() => NestedBoolFilterObjectSchema).optional()
}).strict();
export const BoolWithAggregatesFilterObjectSchema = __makeSchema_BoolWithAggregatesFilter_schema();
export const BoolWithAggregatesFilterObjectZodSchema = __makeSchema_BoolWithAggregatesFilter_schema();
// File: EnumAccountTypeFilter.schema.ts
const __makeSchema_EnumAccountTypeFilter_schema = () => z.object({
    equals: AccountTypeSchema.optional(),
    in: AccountTypeSchema.array().optional(),
    notIn: AccountTypeSchema.array().optional(),
    not: z.union([AccountTypeSchema, z.lazy(() => NestedEnumAccountTypeFilterObjectSchema)]).optional()
}).strict();
export const EnumAccountTypeFilterObjectSchema = __makeSchema_EnumAccountTypeFilter_schema();
export const EnumAccountTypeFilterObjectZodSchema = __makeSchema_EnumAccountTypeFilter_schema();
// File: EmployeeScalarRelationFilter.schema.ts
const __makeSchema_EmployeeScalarRelationFilter_schema = () => z.object({
    is: z.lazy(() => EmployeeWhereInputObjectSchema).optional(),
    isNot: z.lazy(() => EmployeeWhereInputObjectSchema).optional()
}).strict();
export const EmployeeScalarRelationFilterObjectSchema = __makeSchema_EmployeeScalarRelationFilter_schema();
export const EmployeeScalarRelationFilterObjectZodSchema = __makeSchema_EmployeeScalarRelationFilter_schema();
// File: AccountCountOrderByAggregateInput.schema.ts
const __makeSchema_AccountCountOrderByAggregateInput_schema = () => z.object({
    employeeUuid: SortOrderSchema.optional(),
    username: SortOrderSchema.optional(),
    password: SortOrderSchema.optional(),
    type: SortOrderSchema.optional()
}).strict();
export const AccountCountOrderByAggregateInputObjectSchema = __makeSchema_AccountCountOrderByAggregateInput_schema();
export const AccountCountOrderByAggregateInputObjectZodSchema = __makeSchema_AccountCountOrderByAggregateInput_schema();
// File: AccountMaxOrderByAggregateInput.schema.ts
const __makeSchema_AccountMaxOrderByAggregateInput_schema = () => z.object({
    employeeUuid: SortOrderSchema.optional(),
    username: SortOrderSchema.optional(),
    password: SortOrderSchema.optional(),
    type: SortOrderSchema.optional()
}).strict();
export const AccountMaxOrderByAggregateInputObjectSchema = __makeSchema_AccountMaxOrderByAggregateInput_schema();
export const AccountMaxOrderByAggregateInputObjectZodSchema = __makeSchema_AccountMaxOrderByAggregateInput_schema();
// File: AccountMinOrderByAggregateInput.schema.ts
const __makeSchema_AccountMinOrderByAggregateInput_schema = () => z.object({
    employeeUuid: SortOrderSchema.optional(),
    username: SortOrderSchema.optional(),
    password: SortOrderSchema.optional(),
    type: SortOrderSchema.optional()
}).strict();
export const AccountMinOrderByAggregateInputObjectSchema = __makeSchema_AccountMinOrderByAggregateInput_schema();
export const AccountMinOrderByAggregateInputObjectZodSchema = __makeSchema_AccountMinOrderByAggregateInput_schema();
// File: EnumAccountTypeWithAggregatesFilter.schema.ts
const __makeSchema_EnumAccountTypeWithAggregatesFilter_schema = () => z.object({
    equals: AccountTypeSchema.optional(),
    in: AccountTypeSchema.array().optional(),
    notIn: AccountTypeSchema.array().optional(),
    not: z.union([AccountTypeSchema, z.lazy(() => NestedEnumAccountTypeWithAggregatesFilterObjectSchema)]).optional(),
    _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
    _min: z.lazy(() => NestedEnumAccountTypeFilterObjectSchema).optional(),
    _max: z.lazy(() => NestedEnumAccountTypeFilterObjectSchema).optional()
}).strict();
export const EnumAccountTypeWithAggregatesFilterObjectSchema = __makeSchema_EnumAccountTypeWithAggregatesFilter_schema();
export const EnumAccountTypeWithAggregatesFilterObjectZodSchema = __makeSchema_EnumAccountTypeWithAggregatesFilter_schema();
// File: AccountCreateNestedOneWithoutEmployeeInput.schema.ts
const __makeSchema_AccountCreateNestedOneWithoutEmployeeInput_schema = () => z.object({
    create: z.union([z.lazy(() => AccountCreateWithoutEmployeeInputObjectSchema), z.lazy(() => AccountUncheckedCreateWithoutEmployeeInputObjectSchema)]).optional(),
    connectOrCreate: z.lazy(() => AccountCreateOrConnectWithoutEmployeeInputObjectSchema).optional(),
    connect: z.lazy(() => AccountWhereUniqueInputObjectSchema).optional()
}).strict();
export const AccountCreateNestedOneWithoutEmployeeInputObjectSchema = __makeSchema_AccountCreateNestedOneWithoutEmployeeInput_schema();
export const AccountCreateNestedOneWithoutEmployeeInputObjectZodSchema = __makeSchema_AccountCreateNestedOneWithoutEmployeeInput_schema();
// File: AccountUncheckedCreateNestedOneWithoutEmployeeInput.schema.ts
const __makeSchema_AccountUncheckedCreateNestedOneWithoutEmployeeInput_schema = () => z.object({
    create: z.union([z.lazy(() => AccountCreateWithoutEmployeeInputObjectSchema), z.lazy(() => AccountUncheckedCreateWithoutEmployeeInputObjectSchema)]).optional(),
    connectOrCreate: z.lazy(() => AccountCreateOrConnectWithoutEmployeeInputObjectSchema).optional(),
    connect: z.lazy(() => AccountWhereUniqueInputObjectSchema).optional()
}).strict();
export const AccountUncheckedCreateNestedOneWithoutEmployeeInputObjectSchema = __makeSchema_AccountUncheckedCreateNestedOneWithoutEmployeeInput_schema();
export const AccountUncheckedCreateNestedOneWithoutEmployeeInputObjectZodSchema = __makeSchema_AccountUncheckedCreateNestedOneWithoutEmployeeInput_schema();
// File: StringFieldUpdateOperationsInput.schema.ts
const __makeSchema_StringFieldUpdateOperationsInput_schema = () => z.object({
    set: z.string().optional()
}).strict();
export const StringFieldUpdateOperationsInputObjectSchema = __makeSchema_StringFieldUpdateOperationsInput_schema();
export const StringFieldUpdateOperationsInputObjectZodSchema = __makeSchema_StringFieldUpdateOperationsInput_schema();
// File: NullableStringFieldUpdateOperationsInput.schema.ts
const __makeSchema_NullableStringFieldUpdateOperationsInput_schema = () => z.object({
    set: z.string().optional()
}).strict();
export const NullableStringFieldUpdateOperationsInputObjectSchema = __makeSchema_NullableStringFieldUpdateOperationsInput_schema();
export const NullableStringFieldUpdateOperationsInputObjectZodSchema = __makeSchema_NullableStringFieldUpdateOperationsInput_schema();
// File: DateTimeFieldUpdateOperationsInput.schema.ts
const __makeSchema_DateTimeFieldUpdateOperationsInput_schema = () => z.object({
    set: z.coerce.date().optional()
}).strict();
export const DateTimeFieldUpdateOperationsInputObjectSchema = __makeSchema_DateTimeFieldUpdateOperationsInput_schema();
export const DateTimeFieldUpdateOperationsInputObjectZodSchema = __makeSchema_DateTimeFieldUpdateOperationsInput_schema();
// File: EnumPositionFieldUpdateOperationsInput.schema.ts
const __makeSchema_EnumPositionFieldUpdateOperationsInput_schema = () => z.object({
    set: PositionSchema.optional()
}).strict();
export const EnumPositionFieldUpdateOperationsInputObjectSchema = __makeSchema_EnumPositionFieldUpdateOperationsInput_schema();
export const EnumPositionFieldUpdateOperationsInputObjectZodSchema = __makeSchema_EnumPositionFieldUpdateOperationsInput_schema();
// File: EnumDepartmentFieldUpdateOperationsInput.schema.ts
const __makeSchema_EnumDepartmentFieldUpdateOperationsInput_schema = () => z.object({
    set: DepartmentSchema.optional()
}).strict();
export const EnumDepartmentFieldUpdateOperationsInputObjectSchema = __makeSchema_EnumDepartmentFieldUpdateOperationsInput_schema();
export const EnumDepartmentFieldUpdateOperationsInputObjectZodSchema = __makeSchema_EnumDepartmentFieldUpdateOperationsInput_schema();
// File: AccountUpdateOneWithoutEmployeeNestedInput.schema.ts
const __makeSchema_AccountUpdateOneWithoutEmployeeNestedInput_schema = () => z.object({
    create: z.union([z.lazy(() => AccountCreateWithoutEmployeeInputObjectSchema), z.lazy(() => AccountUncheckedCreateWithoutEmployeeInputObjectSchema)]).optional(),
    connectOrCreate: z.lazy(() => AccountCreateOrConnectWithoutEmployeeInputObjectSchema).optional(),
    upsert: z.lazy(() => AccountUpsertWithoutEmployeeInputObjectSchema).optional(),
    disconnect: z.union([z.boolean(), z.lazy(() => AccountWhereInputObjectSchema)]).optional(),
    delete: z.union([z.boolean(), z.lazy(() => AccountWhereInputObjectSchema)]).optional(),
    connect: z.lazy(() => AccountWhereUniqueInputObjectSchema).optional(),
    update: z.union([z.lazy(() => AccountUpdateToOneWithWhereWithoutEmployeeInputObjectSchema), z.lazy(() => AccountUpdateWithoutEmployeeInputObjectSchema), z.lazy(() => AccountUncheckedUpdateWithoutEmployeeInputObjectSchema)]).optional()
}).strict();
export const AccountUpdateOneWithoutEmployeeNestedInputObjectSchema = __makeSchema_AccountUpdateOneWithoutEmployeeNestedInput_schema();
export const AccountUpdateOneWithoutEmployeeNestedInputObjectZodSchema = __makeSchema_AccountUpdateOneWithoutEmployeeNestedInput_schema();
// File: AccountUncheckedUpdateOneWithoutEmployeeNestedInput.schema.ts
const __makeSchema_AccountUncheckedUpdateOneWithoutEmployeeNestedInput_schema = () => z.object({
    create: z.union([z.lazy(() => AccountCreateWithoutEmployeeInputObjectSchema), z.lazy(() => AccountUncheckedCreateWithoutEmployeeInputObjectSchema)]).optional(),
    connectOrCreate: z.lazy(() => AccountCreateOrConnectWithoutEmployeeInputObjectSchema).optional(),
    upsert: z.lazy(() => AccountUpsertWithoutEmployeeInputObjectSchema).optional(),
    disconnect: z.union([z.boolean(), z.lazy(() => AccountWhereInputObjectSchema)]).optional(),
    delete: z.union([z.boolean(), z.lazy(() => AccountWhereInputObjectSchema)]).optional(),
    connect: z.lazy(() => AccountWhereUniqueInputObjectSchema).optional(),
    update: z.union([z.lazy(() => AccountUpdateToOneWithWhereWithoutEmployeeInputObjectSchema), z.lazy(() => AccountUpdateWithoutEmployeeInputObjectSchema), z.lazy(() => AccountUncheckedUpdateWithoutEmployeeInputObjectSchema)]).optional()
}).strict();
export const AccountUncheckedUpdateOneWithoutEmployeeNestedInputObjectSchema = __makeSchema_AccountUncheckedUpdateOneWithoutEmployeeNestedInput_schema();
export const AccountUncheckedUpdateOneWithoutEmployeeNestedInputObjectZodSchema = __makeSchema_AccountUncheckedUpdateOneWithoutEmployeeNestedInput_schema();
// File: EnumContentTypeFieldUpdateOperationsInput.schema.ts
const __makeSchema_EnumContentTypeFieldUpdateOperationsInput_schema = () => z.object({
    set: ContentTypeSchema.optional()
}).strict();
export const EnumContentTypeFieldUpdateOperationsInputObjectSchema = __makeSchema_EnumContentTypeFieldUpdateOperationsInput_schema();
export const EnumContentTypeFieldUpdateOperationsInputObjectZodSchema = __makeSchema_EnumContentTypeFieldUpdateOperationsInput_schema();
// File: EnumContentStatusFieldUpdateOperationsInput.schema.ts
const __makeSchema_EnumContentStatusFieldUpdateOperationsInput_schema = () => z.object({
    set: ContentStatusSchema.optional()
}).strict();
export const EnumContentStatusFieldUpdateOperationsInputObjectSchema = __makeSchema_EnumContentStatusFieldUpdateOperationsInput_schema();
export const EnumContentStatusFieldUpdateOperationsInputObjectZodSchema = __makeSchema_EnumContentStatusFieldUpdateOperationsInput_schema();
// File: BoolFieldUpdateOperationsInput.schema.ts
const __makeSchema_BoolFieldUpdateOperationsInput_schema = () => z.object({
    set: z.boolean().optional()
}).strict();
export const BoolFieldUpdateOperationsInputObjectSchema = __makeSchema_BoolFieldUpdateOperationsInput_schema();
export const BoolFieldUpdateOperationsInputObjectZodSchema = __makeSchema_BoolFieldUpdateOperationsInput_schema();
// File: EmployeeCreateNestedOneWithoutAccountInput.schema.ts
const __makeSchema_EmployeeCreateNestedOneWithoutAccountInput_schema = () => z.object({
    create: z.union([z.lazy(() => EmployeeCreateWithoutAccountInputObjectSchema), z.lazy(() => EmployeeUncheckedCreateWithoutAccountInputObjectSchema)]).optional(),
    connectOrCreate: z.lazy(() => EmployeeCreateOrConnectWithoutAccountInputObjectSchema).optional(),
    connect: z.lazy(() => EmployeeWhereUniqueInputObjectSchema).optional()
}).strict();
export const EmployeeCreateNestedOneWithoutAccountInputObjectSchema = __makeSchema_EmployeeCreateNestedOneWithoutAccountInput_schema();
export const EmployeeCreateNestedOneWithoutAccountInputObjectZodSchema = __makeSchema_EmployeeCreateNestedOneWithoutAccountInput_schema();
// File: EnumAccountTypeFieldUpdateOperationsInput.schema.ts
const __makeSchema_EnumAccountTypeFieldUpdateOperationsInput_schema = () => z.object({
    set: AccountTypeSchema.optional()
}).strict();
export const EnumAccountTypeFieldUpdateOperationsInputObjectSchema = __makeSchema_EnumAccountTypeFieldUpdateOperationsInput_schema();
export const EnumAccountTypeFieldUpdateOperationsInputObjectZodSchema = __makeSchema_EnumAccountTypeFieldUpdateOperationsInput_schema();
// File: EmployeeUpdateOneRequiredWithoutAccountNestedInput.schema.ts
const __makeSchema_EmployeeUpdateOneRequiredWithoutAccountNestedInput_schema = () => z.object({
    create: z.union([z.lazy(() => EmployeeCreateWithoutAccountInputObjectSchema), z.lazy(() => EmployeeUncheckedCreateWithoutAccountInputObjectSchema)]).optional(),
    connectOrCreate: z.lazy(() => EmployeeCreateOrConnectWithoutAccountInputObjectSchema).optional(),
    upsert: z.lazy(() => EmployeeUpsertWithoutAccountInputObjectSchema).optional(),
    connect: z.lazy(() => EmployeeWhereUniqueInputObjectSchema).optional(),
    update: z.union([z.lazy(() => EmployeeUpdateToOneWithWhereWithoutAccountInputObjectSchema), z.lazy(() => EmployeeUpdateWithoutAccountInputObjectSchema), z.lazy(() => EmployeeUncheckedUpdateWithoutAccountInputObjectSchema)]).optional()
}).strict();
export const EmployeeUpdateOneRequiredWithoutAccountNestedInputObjectSchema = __makeSchema_EmployeeUpdateOneRequiredWithoutAccountNestedInput_schema();
export const EmployeeUpdateOneRequiredWithoutAccountNestedInputObjectZodSchema = __makeSchema_EmployeeUpdateOneRequiredWithoutAccountNestedInput_schema();
// File: NestedUuidFilter.schema.ts
const nesteduuidfilterSchema = z.object({
    equals: z.string().optional(),
    in: z.string().array().optional(),
    notIn: z.string().array().optional(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    not: z.union([z.string(), z.lazy(() => NestedUuidFilterObjectSchema)]).optional()
}).strict();
export const NestedUuidFilterObjectSchema = nesteduuidfilterSchema;
export const NestedUuidFilterObjectZodSchema = nesteduuidfilterSchema;
// File: NestedStringNullableFilter.schema.ts
const nestedstringnullablefilterSchema = z.object({
    equals: z.string().optional().nullable(),
    in: z.string().array().optional().nullable(),
    notIn: z.string().array().optional().nullable(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    contains: z.string().optional(),
    startsWith: z.string().optional(),
    endsWith: z.string().optional(),
    not: z.union([z.string(), z.lazy(() => NestedStringNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedStringNullableFilterObjectSchema = nestedstringnullablefilterSchema;
export const NestedStringNullableFilterObjectZodSchema = nestedstringnullablefilterSchema;
// File: NestedStringFilter.schema.ts
const nestedstringfilterSchema = z.object({
    equals: z.string().optional(),
    in: z.string().array().optional(),
    notIn: z.string().array().optional(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    contains: z.string().optional(),
    startsWith: z.string().optional(),
    endsWith: z.string().optional(),
    not: z.union([z.string(), z.lazy(() => NestedStringFilterObjectSchema)]).optional()
}).strict();
export const NestedStringFilterObjectSchema = nestedstringfilterSchema;
export const NestedStringFilterObjectZodSchema = nestedstringfilterSchema;
// File: NestedDateTimeFilter.schema.ts
const nesteddatetimefilterSchema = z.object({
    equals: z.coerce.date().optional(),
    in: z.union([z.date().array(), z.string().datetime().array()]).optional(),
    notIn: z.union([z.date().array(), z.string().datetime().array()]).optional(),
    lt: z.coerce.date().optional(),
    lte: z.coerce.date().optional(),
    gt: z.coerce.date().optional(),
    gte: z.coerce.date().optional(),
    not: z.union([z.coerce.date(), z.lazy(() => NestedDateTimeFilterObjectSchema)]).optional()
}).strict();
export const NestedDateTimeFilterObjectSchema = nesteddatetimefilterSchema;
export const NestedDateTimeFilterObjectZodSchema = nesteddatetimefilterSchema;
// File: NestedEnumPositionFilter.schema.ts
const nestedenumpositionfilterSchema = z.object({
    equals: PositionSchema.optional(),
    in: PositionSchema.array().optional(),
    notIn: PositionSchema.array().optional(),
    not: z.union([PositionSchema, z.lazy(() => NestedEnumPositionFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumPositionFilterObjectSchema = nestedenumpositionfilterSchema;
export const NestedEnumPositionFilterObjectZodSchema = nestedenumpositionfilterSchema;
// File: NestedEnumDepartmentFilter.schema.ts
const nestedenumdepartmentfilterSchema = z.object({
    equals: DepartmentSchema.optional(),
    in: DepartmentSchema.array().optional(),
    notIn: DepartmentSchema.array().optional(),
    not: z.union([DepartmentSchema, z.lazy(() => NestedEnumDepartmentFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumDepartmentFilterObjectSchema = nestedenumdepartmentfilterSchema;
export const NestedEnumDepartmentFilterObjectZodSchema = nestedenumdepartmentfilterSchema;
// File: NestedUuidWithAggregatesFilter.schema.ts
const nesteduuidwithaggregatesfilterSchema = z.object({
    equals: z.string().optional(),
    in: z.string().array().optional(),
    notIn: z.string().array().optional(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    not: z.union([z.string(), z.lazy(() => NestedUuidWithAggregatesFilterObjectSchema)]).optional(),
    _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
    _min: z.lazy(() => NestedStringFilterObjectSchema).optional(),
    _max: z.lazy(() => NestedStringFilterObjectSchema).optional()
}).strict();
export const NestedUuidWithAggregatesFilterObjectSchema = nesteduuidwithaggregatesfilterSchema;
export const NestedUuidWithAggregatesFilterObjectZodSchema = nesteduuidwithaggregatesfilterSchema;
// File: NestedIntFilter.schema.ts
const nestedintfilterSchema = z.object({
    equals: z.number().int().optional(),
    in: z.number().int().array().optional(),
    notIn: z.number().int().array().optional(),
    lt: z.number().int().optional(),
    lte: z.number().int().optional(),
    gt: z.number().int().optional(),
    gte: z.number().int().optional(),
    not: z.union([z.number().int(), z.lazy(() => NestedIntFilterObjectSchema)]).optional()
}).strict();
export const NestedIntFilterObjectSchema = nestedintfilterSchema;
export const NestedIntFilterObjectZodSchema = nestedintfilterSchema;
// File: NestedStringNullableWithAggregatesFilter.schema.ts
const nestedstringnullablewithaggregatesfilterSchema = z.object({
    equals: z.string().optional().nullable(),
    in: z.string().array().optional().nullable(),
    notIn: z.string().array().optional().nullable(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    contains: z.string().optional(),
    startsWith: z.string().optional(),
    endsWith: z.string().optional(),
    not: z.union([z.string(), z.lazy(() => NestedStringNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
    _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
    _min: z.lazy(() => NestedStringNullableFilterObjectSchema).optional(),
    _max: z.lazy(() => NestedStringNullableFilterObjectSchema).optional()
}).strict();
export const NestedStringNullableWithAggregatesFilterObjectSchema = nestedstringnullablewithaggregatesfilterSchema;
export const NestedStringNullableWithAggregatesFilterObjectZodSchema = nestedstringnullablewithaggregatesfilterSchema;
// File: NestedIntNullableFilter.schema.ts
const nestedintnullablefilterSchema = z.object({
    equals: z.number().int().optional().nullable(),
    in: z.number().int().array().optional().nullable(),
    notIn: z.number().int().array().optional().nullable(),
    lt: z.number().int().optional(),
    lte: z.number().int().optional(),
    gt: z.number().int().optional(),
    gte: z.number().int().optional(),
    not: z.union([z.number().int(), z.lazy(() => NestedIntNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedIntNullableFilterObjectSchema = nestedintnullablefilterSchema;
export const NestedIntNullableFilterObjectZodSchema = nestedintnullablefilterSchema;
// File: NestedStringWithAggregatesFilter.schema.ts
const nestedstringwithaggregatesfilterSchema = z.object({
    equals: z.string().optional(),
    in: z.string().array().optional(),
    notIn: z.string().array().optional(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    contains: z.string().optional(),
    startsWith: z.string().optional(),
    endsWith: z.string().optional(),
    not: z.union([z.string(), z.lazy(() => NestedStringWithAggregatesFilterObjectSchema)]).optional(),
    _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
    _min: z.lazy(() => NestedStringFilterObjectSchema).optional(),
    _max: z.lazy(() => NestedStringFilterObjectSchema).optional()
}).strict();
export const NestedStringWithAggregatesFilterObjectSchema = nestedstringwithaggregatesfilterSchema;
export const NestedStringWithAggregatesFilterObjectZodSchema = nestedstringwithaggregatesfilterSchema;
// File: NestedDateTimeWithAggregatesFilter.schema.ts
const nesteddatetimewithaggregatesfilterSchema = z.object({
    equals: z.coerce.date().optional(),
    in: z.union([z.date().array(), z.string().datetime().array()]).optional(),
    notIn: z.union([z.date().array(), z.string().datetime().array()]).optional(),
    lt: z.coerce.date().optional(),
    lte: z.coerce.date().optional(),
    gt: z.coerce.date().optional(),
    gte: z.coerce.date().optional(),
    not: z.union([z.coerce.date(), z.lazy(() => NestedDateTimeWithAggregatesFilterObjectSchema)]).optional(),
    _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
    _min: z.lazy(() => NestedDateTimeFilterObjectSchema).optional(),
    _max: z.lazy(() => NestedDateTimeFilterObjectSchema).optional()
}).strict();
export const NestedDateTimeWithAggregatesFilterObjectSchema = nesteddatetimewithaggregatesfilterSchema;
export const NestedDateTimeWithAggregatesFilterObjectZodSchema = nesteddatetimewithaggregatesfilterSchema;
// File: NestedEnumPositionWithAggregatesFilter.schema.ts
const nestedenumpositionwithaggregatesfilterSchema = z.object({
    equals: PositionSchema.optional(),
    in: PositionSchema.array().optional(),
    notIn: PositionSchema.array().optional(),
    not: z.union([PositionSchema, z.lazy(() => NestedEnumPositionWithAggregatesFilterObjectSchema)]).optional(),
    _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
    _min: z.lazy(() => NestedEnumPositionFilterObjectSchema).optional(),
    _max: z.lazy(() => NestedEnumPositionFilterObjectSchema).optional()
}).strict();
export const NestedEnumPositionWithAggregatesFilterObjectSchema = nestedenumpositionwithaggregatesfilterSchema;
export const NestedEnumPositionWithAggregatesFilterObjectZodSchema = nestedenumpositionwithaggregatesfilterSchema;
// File: NestedEnumDepartmentWithAggregatesFilter.schema.ts
const nestedenumdepartmentwithaggregatesfilterSchema = z.object({
    equals: DepartmentSchema.optional(),
    in: DepartmentSchema.array().optional(),
    notIn: DepartmentSchema.array().optional(),
    not: z.union([DepartmentSchema, z.lazy(() => NestedEnumDepartmentWithAggregatesFilterObjectSchema)]).optional(),
    _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
    _min: z.lazy(() => NestedEnumDepartmentFilterObjectSchema).optional(),
    _max: z.lazy(() => NestedEnumDepartmentFilterObjectSchema).optional()
}).strict();
export const NestedEnumDepartmentWithAggregatesFilterObjectSchema = nestedenumdepartmentwithaggregatesfilterSchema;
export const NestedEnumDepartmentWithAggregatesFilterObjectZodSchema = nestedenumdepartmentwithaggregatesfilterSchema;
// File: NestedEnumContentTypeFilter.schema.ts
const nestedenumcontenttypefilterSchema = z.object({
    equals: ContentTypeSchema.optional(),
    in: ContentTypeSchema.array().optional(),
    notIn: ContentTypeSchema.array().optional(),
    not: z.union([ContentTypeSchema, z.lazy(() => NestedEnumContentTypeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumContentTypeFilterObjectSchema = nestedenumcontenttypefilterSchema;
export const NestedEnumContentTypeFilterObjectZodSchema = nestedenumcontenttypefilterSchema;
// File: NestedEnumContentStatusFilter.schema.ts
const nestedenumcontentstatusfilterSchema = z.object({
    equals: ContentStatusSchema.optional(),
    in: ContentStatusSchema.array().optional(),
    notIn: ContentStatusSchema.array().optional(),
    not: z.union([ContentStatusSchema, z.lazy(() => NestedEnumContentStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumContentStatusFilterObjectSchema = nestedenumcontentstatusfilterSchema;
export const NestedEnumContentStatusFilterObjectZodSchema = nestedenumcontentstatusfilterSchema;
// File: NestedBoolFilter.schema.ts
const nestedboolfilterSchema = z.object({
    equals: z.boolean().optional(),
    not: z.union([z.boolean(), z.lazy(() => NestedBoolFilterObjectSchema)]).optional()
}).strict();
export const NestedBoolFilterObjectSchema = nestedboolfilterSchema;
export const NestedBoolFilterObjectZodSchema = nestedboolfilterSchema;
// File: NestedEnumContentTypeWithAggregatesFilter.schema.ts
const nestedenumcontenttypewithaggregatesfilterSchema = z.object({
    equals: ContentTypeSchema.optional(),
    in: ContentTypeSchema.array().optional(),
    notIn: ContentTypeSchema.array().optional(),
    not: z.union([ContentTypeSchema, z.lazy(() => NestedEnumContentTypeWithAggregatesFilterObjectSchema)]).optional(),
    _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
    _min: z.lazy(() => NestedEnumContentTypeFilterObjectSchema).optional(),
    _max: z.lazy(() => NestedEnumContentTypeFilterObjectSchema).optional()
}).strict();
export const NestedEnumContentTypeWithAggregatesFilterObjectSchema = nestedenumcontenttypewithaggregatesfilterSchema;
export const NestedEnumContentTypeWithAggregatesFilterObjectZodSchema = nestedenumcontenttypewithaggregatesfilterSchema;
// File: NestedEnumContentStatusWithAggregatesFilter.schema.ts
const nestedenumcontentstatuswithaggregatesfilterSchema = z.object({
    equals: ContentStatusSchema.optional(),
    in: ContentStatusSchema.array().optional(),
    notIn: ContentStatusSchema.array().optional(),
    not: z.union([ContentStatusSchema, z.lazy(() => NestedEnumContentStatusWithAggregatesFilterObjectSchema)]).optional(),
    _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
    _min: z.lazy(() => NestedEnumContentStatusFilterObjectSchema).optional(),
    _max: z.lazy(() => NestedEnumContentStatusFilterObjectSchema).optional()
}).strict();
export const NestedEnumContentStatusWithAggregatesFilterObjectSchema = nestedenumcontentstatuswithaggregatesfilterSchema;
export const NestedEnumContentStatusWithAggregatesFilterObjectZodSchema = nestedenumcontentstatuswithaggregatesfilterSchema;
// File: NestedBoolWithAggregatesFilter.schema.ts
const nestedboolwithaggregatesfilterSchema = z.object({
    equals: z.boolean().optional(),
    not: z.union([z.boolean(), z.lazy(() => NestedBoolWithAggregatesFilterObjectSchema)]).optional(),
    _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
    _min: z.lazy(() => NestedBoolFilterObjectSchema).optional(),
    _max: z.lazy(() => NestedBoolFilterObjectSchema).optional()
}).strict();
export const NestedBoolWithAggregatesFilterObjectSchema = nestedboolwithaggregatesfilterSchema;
export const NestedBoolWithAggregatesFilterObjectZodSchema = nestedboolwithaggregatesfilterSchema;
// File: NestedEnumAccountTypeFilter.schema.ts
const nestedenumaccounttypefilterSchema = z.object({
    equals: AccountTypeSchema.optional(),
    in: AccountTypeSchema.array().optional(),
    notIn: AccountTypeSchema.array().optional(),
    not: z.union([AccountTypeSchema, z.lazy(() => NestedEnumAccountTypeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumAccountTypeFilterObjectSchema = nestedenumaccounttypefilterSchema;
export const NestedEnumAccountTypeFilterObjectZodSchema = nestedenumaccounttypefilterSchema;
// File: NestedEnumAccountTypeWithAggregatesFilter.schema.ts
const nestedenumaccounttypewithaggregatesfilterSchema = z.object({
    equals: AccountTypeSchema.optional(),
    in: AccountTypeSchema.array().optional(),
    notIn: AccountTypeSchema.array().optional(),
    not: z.union([AccountTypeSchema, z.lazy(() => NestedEnumAccountTypeWithAggregatesFilterObjectSchema)]).optional(),
    _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
    _min: z.lazy(() => NestedEnumAccountTypeFilterObjectSchema).optional(),
    _max: z.lazy(() => NestedEnumAccountTypeFilterObjectSchema).optional()
}).strict();
export const NestedEnumAccountTypeWithAggregatesFilterObjectSchema = nestedenumaccounttypewithaggregatesfilterSchema;
export const NestedEnumAccountTypeWithAggregatesFilterObjectZodSchema = nestedenumaccounttypewithaggregatesfilterSchema;
// File: AccountCreateWithoutEmployeeInput.schema.ts
const __makeSchema_AccountCreateWithoutEmployeeInput_schema = () => z.object({
    username: z.string(),
    password: z.string(),
    type: AccountTypeSchema
}).strict();
export const AccountCreateWithoutEmployeeInputObjectSchema = __makeSchema_AccountCreateWithoutEmployeeInput_schema();
export const AccountCreateWithoutEmployeeInputObjectZodSchema = __makeSchema_AccountCreateWithoutEmployeeInput_schema();
// File: AccountUncheckedCreateWithoutEmployeeInput.schema.ts
const __makeSchema_AccountUncheckedCreateWithoutEmployeeInput_schema = () => z.object({
    username: z.string(),
    password: z.string(),
    type: AccountTypeSchema
}).strict();
export const AccountUncheckedCreateWithoutEmployeeInputObjectSchema = __makeSchema_AccountUncheckedCreateWithoutEmployeeInput_schema();
export const AccountUncheckedCreateWithoutEmployeeInputObjectZodSchema = __makeSchema_AccountUncheckedCreateWithoutEmployeeInput_schema();
// File: AccountCreateOrConnectWithoutEmployeeInput.schema.ts
const __makeSchema_AccountCreateOrConnectWithoutEmployeeInput_schema = () => z.object({
    where: z.lazy(() => AccountWhereUniqueInputObjectSchema),
    create: z.union([z.lazy(() => AccountCreateWithoutEmployeeInputObjectSchema), z.lazy(() => AccountUncheckedCreateWithoutEmployeeInputObjectSchema)])
}).strict();
export const AccountCreateOrConnectWithoutEmployeeInputObjectSchema = __makeSchema_AccountCreateOrConnectWithoutEmployeeInput_schema();
export const AccountCreateOrConnectWithoutEmployeeInputObjectZodSchema = __makeSchema_AccountCreateOrConnectWithoutEmployeeInput_schema();
// File: AccountUpsertWithoutEmployeeInput.schema.ts
const __makeSchema_AccountUpsertWithoutEmployeeInput_schema = () => z.object({
    update: z.union([z.lazy(() => AccountUpdateWithoutEmployeeInputObjectSchema), z.lazy(() => AccountUncheckedUpdateWithoutEmployeeInputObjectSchema)]),
    create: z.union([z.lazy(() => AccountCreateWithoutEmployeeInputObjectSchema), z.lazy(() => AccountUncheckedCreateWithoutEmployeeInputObjectSchema)]),
    where: z.lazy(() => AccountWhereInputObjectSchema).optional()
}).strict();
export const AccountUpsertWithoutEmployeeInputObjectSchema = __makeSchema_AccountUpsertWithoutEmployeeInput_schema();
export const AccountUpsertWithoutEmployeeInputObjectZodSchema = __makeSchema_AccountUpsertWithoutEmployeeInput_schema();
// File: AccountUpdateToOneWithWhereWithoutEmployeeInput.schema.ts
const __makeSchema_AccountUpdateToOneWithWhereWithoutEmployeeInput_schema = () => z.object({
    where: z.lazy(() => AccountWhereInputObjectSchema).optional(),
    data: z.union([z.lazy(() => AccountUpdateWithoutEmployeeInputObjectSchema), z.lazy(() => AccountUncheckedUpdateWithoutEmployeeInputObjectSchema)])
}).strict();
export const AccountUpdateToOneWithWhereWithoutEmployeeInputObjectSchema = __makeSchema_AccountUpdateToOneWithWhereWithoutEmployeeInput_schema();
export const AccountUpdateToOneWithWhereWithoutEmployeeInputObjectZodSchema = __makeSchema_AccountUpdateToOneWithWhereWithoutEmployeeInput_schema();
// File: AccountUpdateWithoutEmployeeInput.schema.ts
const __makeSchema_AccountUpdateWithoutEmployeeInput_schema = () => z.object({
    username: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    password: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    type: z.union([AccountTypeSchema, z.lazy(() => EnumAccountTypeFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const AccountUpdateWithoutEmployeeInputObjectSchema = __makeSchema_AccountUpdateWithoutEmployeeInput_schema();
export const AccountUpdateWithoutEmployeeInputObjectZodSchema = __makeSchema_AccountUpdateWithoutEmployeeInput_schema();
// File: AccountUncheckedUpdateWithoutEmployeeInput.schema.ts
const __makeSchema_AccountUncheckedUpdateWithoutEmployeeInput_schema = () => z.object({
    username: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    password: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    type: z.union([AccountTypeSchema, z.lazy(() => EnumAccountTypeFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const AccountUncheckedUpdateWithoutEmployeeInputObjectSchema = __makeSchema_AccountUncheckedUpdateWithoutEmployeeInput_schema();
export const AccountUncheckedUpdateWithoutEmployeeInputObjectZodSchema = __makeSchema_AccountUncheckedUpdateWithoutEmployeeInput_schema();
// File: EmployeeCreateWithoutAccountInput.schema.ts
const __makeSchema_EmployeeCreateWithoutAccountInput_schema = () => z.object({
    uuid: z.string().optional(),
    avatar: z.string().optional().nullable(),
    first_name: z.string(),
    last_name: z.string(),
    date_of_birth: z.coerce.date(),
    position: PositionSchema,
    department: DepartmentSchema,
    start_date: z.coerce.date(),
    supervisor: z.string(),
    phone_number: z.string(),
    personal_email: z.string(),
    corporate_email: z.string()
}).strict();
export const EmployeeCreateWithoutAccountInputObjectSchema = __makeSchema_EmployeeCreateWithoutAccountInput_schema();
export const EmployeeCreateWithoutAccountInputObjectZodSchema = __makeSchema_EmployeeCreateWithoutAccountInput_schema();
// File: EmployeeUncheckedCreateWithoutAccountInput.schema.ts
const __makeSchema_EmployeeUncheckedCreateWithoutAccountInput_schema = () => z.object({
    uuid: z.string().optional(),
    avatar: z.string().optional().nullable(),
    first_name: z.string(),
    last_name: z.string(),
    date_of_birth: z.coerce.date(),
    position: PositionSchema,
    department: DepartmentSchema,
    start_date: z.coerce.date(),
    supervisor: z.string(),
    phone_number: z.string(),
    personal_email: z.string(),
    corporate_email: z.string()
}).strict();
export const EmployeeUncheckedCreateWithoutAccountInputObjectSchema = __makeSchema_EmployeeUncheckedCreateWithoutAccountInput_schema();
export const EmployeeUncheckedCreateWithoutAccountInputObjectZodSchema = __makeSchema_EmployeeUncheckedCreateWithoutAccountInput_schema();
// File: EmployeeCreateOrConnectWithoutAccountInput.schema.ts
const __makeSchema_EmployeeCreateOrConnectWithoutAccountInput_schema = () => z.object({
    where: z.lazy(() => EmployeeWhereUniqueInputObjectSchema),
    create: z.union([z.lazy(() => EmployeeCreateWithoutAccountInputObjectSchema), z.lazy(() => EmployeeUncheckedCreateWithoutAccountInputObjectSchema)])
}).strict();
export const EmployeeCreateOrConnectWithoutAccountInputObjectSchema = __makeSchema_EmployeeCreateOrConnectWithoutAccountInput_schema();
export const EmployeeCreateOrConnectWithoutAccountInputObjectZodSchema = __makeSchema_EmployeeCreateOrConnectWithoutAccountInput_schema();
// File: EmployeeUpsertWithoutAccountInput.schema.ts
const __makeSchema_EmployeeUpsertWithoutAccountInput_schema = () => z.object({
    update: z.union([z.lazy(() => EmployeeUpdateWithoutAccountInputObjectSchema), z.lazy(() => EmployeeUncheckedUpdateWithoutAccountInputObjectSchema)]),
    create: z.union([z.lazy(() => EmployeeCreateWithoutAccountInputObjectSchema), z.lazy(() => EmployeeUncheckedCreateWithoutAccountInputObjectSchema)]),
    where: z.lazy(() => EmployeeWhereInputObjectSchema).optional()
}).strict();
export const EmployeeUpsertWithoutAccountInputObjectSchema = __makeSchema_EmployeeUpsertWithoutAccountInput_schema();
export const EmployeeUpsertWithoutAccountInputObjectZodSchema = __makeSchema_EmployeeUpsertWithoutAccountInput_schema();
// File: EmployeeUpdateToOneWithWhereWithoutAccountInput.schema.ts
const __makeSchema_EmployeeUpdateToOneWithWhereWithoutAccountInput_schema = () => z.object({
    where: z.lazy(() => EmployeeWhereInputObjectSchema).optional(),
    data: z.union([z.lazy(() => EmployeeUpdateWithoutAccountInputObjectSchema), z.lazy(() => EmployeeUncheckedUpdateWithoutAccountInputObjectSchema)])
}).strict();
export const EmployeeUpdateToOneWithWhereWithoutAccountInputObjectSchema = __makeSchema_EmployeeUpdateToOneWithWhereWithoutAccountInput_schema();
export const EmployeeUpdateToOneWithWhereWithoutAccountInputObjectZodSchema = __makeSchema_EmployeeUpdateToOneWithWhereWithoutAccountInput_schema();
// File: EmployeeUpdateWithoutAccountInput.schema.ts
const __makeSchema_EmployeeUpdateWithoutAccountInput_schema = () => z.object({
    uuid: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    avatar: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
    first_name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    last_name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    date_of_birth: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
    position: z.union([PositionSchema, z.lazy(() => EnumPositionFieldUpdateOperationsInputObjectSchema)]).optional(),
    department: z.union([DepartmentSchema, z.lazy(() => EnumDepartmentFieldUpdateOperationsInputObjectSchema)]).optional(),
    start_date: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
    supervisor: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    phone_number: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    personal_email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    corporate_email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const EmployeeUpdateWithoutAccountInputObjectSchema = __makeSchema_EmployeeUpdateWithoutAccountInput_schema();
export const EmployeeUpdateWithoutAccountInputObjectZodSchema = __makeSchema_EmployeeUpdateWithoutAccountInput_schema();
// File: EmployeeUncheckedUpdateWithoutAccountInput.schema.ts
const __makeSchema_EmployeeUncheckedUpdateWithoutAccountInput_schema = () => z.object({
    uuid: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    avatar: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
    first_name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    last_name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    date_of_birth: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
    position: z.union([PositionSchema, z.lazy(() => EnumPositionFieldUpdateOperationsInputObjectSchema)]).optional(),
    department: z.union([DepartmentSchema, z.lazy(() => EnumDepartmentFieldUpdateOperationsInputObjectSchema)]).optional(),
    start_date: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
    supervisor: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    phone_number: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    personal_email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
    corporate_email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const EmployeeUncheckedUpdateWithoutAccountInputObjectSchema = __makeSchema_EmployeeUncheckedUpdateWithoutAccountInput_schema();
export const EmployeeUncheckedUpdateWithoutAccountInputObjectZodSchema = __makeSchema_EmployeeUncheckedUpdateWithoutAccountInput_schema();
// File: EmployeeCountAggregateInput.schema.ts
const __makeSchema_EmployeeCountAggregateInput_schema = () => z.object({
    uuid: z.literal(true).optional(),
    avatar: z.literal(true).optional(),
    first_name: z.literal(true).optional(),
    last_name: z.literal(true).optional(),
    date_of_birth: z.literal(true).optional(),
    position: z.literal(true).optional(),
    department: z.literal(true).optional(),
    start_date: z.literal(true).optional(),
    supervisor: z.literal(true).optional(),
    phone_number: z.literal(true).optional(),
    personal_email: z.literal(true).optional(),
    corporate_email: z.literal(true).optional(),
    _all: z.literal(true).optional()
}).strict();
export const EmployeeCountAggregateInputObjectSchema = __makeSchema_EmployeeCountAggregateInput_schema();
export const EmployeeCountAggregateInputObjectZodSchema = __makeSchema_EmployeeCountAggregateInput_schema();
// File: EmployeeMinAggregateInput.schema.ts
const __makeSchema_EmployeeMinAggregateInput_schema = () => z.object({
    uuid: z.literal(true).optional(),
    avatar: z.literal(true).optional(),
    first_name: z.literal(true).optional(),
    last_name: z.literal(true).optional(),
    date_of_birth: z.literal(true).optional(),
    position: z.literal(true).optional(),
    department: z.literal(true).optional(),
    start_date: z.literal(true).optional(),
    supervisor: z.literal(true).optional(),
    phone_number: z.literal(true).optional(),
    personal_email: z.literal(true).optional(),
    corporate_email: z.literal(true).optional()
}).strict();
export const EmployeeMinAggregateInputObjectSchema = __makeSchema_EmployeeMinAggregateInput_schema();
export const EmployeeMinAggregateInputObjectZodSchema = __makeSchema_EmployeeMinAggregateInput_schema();
// File: EmployeeMaxAggregateInput.schema.ts
const __makeSchema_EmployeeMaxAggregateInput_schema = () => z.object({
    uuid: z.literal(true).optional(),
    avatar: z.literal(true).optional(),
    first_name: z.literal(true).optional(),
    last_name: z.literal(true).optional(),
    date_of_birth: z.literal(true).optional(),
    position: z.literal(true).optional(),
    department: z.literal(true).optional(),
    start_date: z.literal(true).optional(),
    supervisor: z.literal(true).optional(),
    phone_number: z.literal(true).optional(),
    personal_email: z.literal(true).optional(),
    corporate_email: z.literal(true).optional()
}).strict();
export const EmployeeMaxAggregateInputObjectSchema = __makeSchema_EmployeeMaxAggregateInput_schema();
export const EmployeeMaxAggregateInputObjectZodSchema = __makeSchema_EmployeeMaxAggregateInput_schema();
// File: ContentCountAggregateInput.schema.ts
const __makeSchema_ContentCountAggregateInput_schema = () => z.object({
    uuid: z.literal(true).optional(),
    title: z.literal(true).optional(),
    url: z.literal(true).optional(),
    content_owner: z.literal(true).optional(),
    for_position: z.literal(true).optional(),
    last_modified_time: z.literal(true).optional(),
    expiration_time: z.literal(true).optional(),
    content_type: z.literal(true).optional(),
    status: z.literal(true).optional(),
    is_favorite: z.literal(true).optional(),
    _all: z.literal(true).optional()
}).strict();
export const ContentCountAggregateInputObjectSchema = __makeSchema_ContentCountAggregateInput_schema();
export const ContentCountAggregateInputObjectZodSchema = __makeSchema_ContentCountAggregateInput_schema();
// File: ContentMinAggregateInput.schema.ts
const __makeSchema_ContentMinAggregateInput_schema = () => z.object({
    uuid: z.literal(true).optional(),
    title: z.literal(true).optional(),
    url: z.literal(true).optional(),
    content_owner: z.literal(true).optional(),
    for_position: z.literal(true).optional(),
    last_modified_time: z.literal(true).optional(),
    expiration_time: z.literal(true).optional(),
    content_type: z.literal(true).optional(),
    status: z.literal(true).optional(),
    is_favorite: z.literal(true).optional()
}).strict();
export const ContentMinAggregateInputObjectSchema = __makeSchema_ContentMinAggregateInput_schema();
export const ContentMinAggregateInputObjectZodSchema = __makeSchema_ContentMinAggregateInput_schema();
// File: ContentMaxAggregateInput.schema.ts
const __makeSchema_ContentMaxAggregateInput_schema = () => z.object({
    uuid: z.literal(true).optional(),
    title: z.literal(true).optional(),
    url: z.literal(true).optional(),
    content_owner: z.literal(true).optional(),
    for_position: z.literal(true).optional(),
    last_modified_time: z.literal(true).optional(),
    expiration_time: z.literal(true).optional(),
    content_type: z.literal(true).optional(),
    status: z.literal(true).optional(),
    is_favorite: z.literal(true).optional()
}).strict();
export const ContentMaxAggregateInputObjectSchema = __makeSchema_ContentMaxAggregateInput_schema();
export const ContentMaxAggregateInputObjectZodSchema = __makeSchema_ContentMaxAggregateInput_schema();
// File: AccountCountAggregateInput.schema.ts
const __makeSchema_AccountCountAggregateInput_schema = () => z.object({
    employeeUuid: z.literal(true).optional(),
    username: z.literal(true).optional(),
    password: z.literal(true).optional(),
    type: z.literal(true).optional(),
    _all: z.literal(true).optional()
}).strict();
export const AccountCountAggregateInputObjectSchema = __makeSchema_AccountCountAggregateInput_schema();
export const AccountCountAggregateInputObjectZodSchema = __makeSchema_AccountCountAggregateInput_schema();
// File: AccountMinAggregateInput.schema.ts
const __makeSchema_AccountMinAggregateInput_schema = () => z.object({
    employeeUuid: z.literal(true).optional(),
    username: z.literal(true).optional(),
    password: z.literal(true).optional(),
    type: z.literal(true).optional()
}).strict();
export const AccountMinAggregateInputObjectSchema = __makeSchema_AccountMinAggregateInput_schema();
export const AccountMinAggregateInputObjectZodSchema = __makeSchema_AccountMinAggregateInput_schema();
// File: AccountMaxAggregateInput.schema.ts
const __makeSchema_AccountMaxAggregateInput_schema = () => z.object({
    employeeUuid: z.literal(true).optional(),
    username: z.literal(true).optional(),
    password: z.literal(true).optional(),
    type: z.literal(true).optional()
}).strict();
export const AccountMaxAggregateInputObjectSchema = __makeSchema_AccountMaxAggregateInput_schema();
export const AccountMaxAggregateInputObjectZodSchema = __makeSchema_AccountMaxAggregateInput_schema();
// File: EmployeeSelect.schema.ts
const __makeSchema_EmployeeSelect_schema = () => z.object({
    uuid: z.boolean().optional(),
    account: z.union([z.boolean(), z.lazy(() => AccountArgsObjectSchema)]).optional(),
    avatar: z.boolean().optional(),
    first_name: z.boolean().optional(),
    last_name: z.boolean().optional(),
    date_of_birth: z.boolean().optional(),
    position: z.boolean().optional(),
    department: z.boolean().optional(),
    start_date: z.boolean().optional(),
    supervisor: z.boolean().optional(),
    phone_number: z.boolean().optional(),
    personal_email: z.boolean().optional(),
    corporate_email: z.boolean().optional()
}).strict();
export const EmployeeSelectObjectSchema = __makeSchema_EmployeeSelect_schema();
export const EmployeeSelectObjectZodSchema = __makeSchema_EmployeeSelect_schema();
// File: ContentSelect.schema.ts
const __makeSchema_ContentSelect_schema = () => z.object({
    uuid: z.boolean().optional(),
    title: z.boolean().optional(),
    url: z.boolean().optional(),
    content_owner: z.boolean().optional(),
    for_position: z.boolean().optional(),
    last_modified_time: z.boolean().optional(),
    expiration_time: z.boolean().optional(),
    content_type: z.boolean().optional(),
    status: z.boolean().optional(),
    is_favorite: z.boolean().optional()
}).strict();
export const ContentSelectObjectSchema = __makeSchema_ContentSelect_schema();
export const ContentSelectObjectZodSchema = __makeSchema_ContentSelect_schema();
// File: AccountSelect.schema.ts
const __makeSchema_AccountSelect_schema = () => z.object({
    employee: z.union([z.boolean(), z.lazy(() => EmployeeArgsObjectSchema)]).optional(),
    employeeUuid: z.boolean().optional(),
    username: z.boolean().optional(),
    password: z.boolean().optional(),
    type: z.boolean().optional()
}).strict();
export const AccountSelectObjectSchema = __makeSchema_AccountSelect_schema();
export const AccountSelectObjectZodSchema = __makeSchema_AccountSelect_schema();
// File: EmployeeArgs.schema.ts
const __makeSchema_EmployeeArgs_schema = () => z.object({
    select: z.lazy(() => EmployeeSelectObjectSchema).optional(),
    include: z.lazy(() => EmployeeIncludeObjectSchema).optional()
}).strict();
export const EmployeeArgsObjectSchema = __makeSchema_EmployeeArgs_schema();
export const EmployeeArgsObjectZodSchema = __makeSchema_EmployeeArgs_schema();
// File: ContentArgs.schema.ts
const __makeSchema_ContentArgs_schema = () => z.object({
    select: z.lazy(() => ContentSelectObjectSchema).optional()
}).strict();
export const ContentArgsObjectSchema = __makeSchema_ContentArgs_schema();
export const ContentArgsObjectZodSchema = __makeSchema_ContentArgs_schema();
// File: AccountArgs.schema.ts
const __makeSchema_AccountArgs_schema = () => z.object({
    select: z.lazy(() => AccountSelectObjectSchema).optional(),
    include: z.lazy(() => AccountIncludeObjectSchema).optional()
}).strict();
export const AccountArgsObjectSchema = __makeSchema_AccountArgs_schema();
export const AccountArgsObjectZodSchema = __makeSchema_AccountArgs_schema();
// File: EmployeeInclude.schema.ts
const __makeSchema_EmployeeInclude_schema = () => z.object({
    account: z.union([z.boolean(), z.lazy(() => AccountArgsObjectSchema)]).optional()
}).strict();
export const EmployeeIncludeObjectSchema = __makeSchema_EmployeeInclude_schema();
export const EmployeeIncludeObjectZodSchema = __makeSchema_EmployeeInclude_schema();
// File: AccountInclude.schema.ts
const __makeSchema_AccountInclude_schema = () => z.object({
    employee: z.union([z.boolean(), z.lazy(() => EmployeeArgsObjectSchema)]).optional()
}).strict();
export const AccountIncludeObjectSchema = __makeSchema_AccountInclude_schema();
export const AccountIncludeObjectZodSchema = __makeSchema_AccountInclude_schema();
// File: findUniqueEmployee.schema.ts
export const EmployeeFindUniqueSchema = z.object({ select: EmployeeSelectObjectSchema.optional(), include: EmployeeIncludeObjectSchema.optional(), where: EmployeeWhereUniqueInputObjectSchema }).strict();
export const EmployeeFindUniqueZodSchema = z.object({ select: EmployeeSelectObjectSchema.optional(), include: EmployeeIncludeObjectSchema.optional(), where: EmployeeWhereUniqueInputObjectSchema }).strict();
// File: findUniqueOrThrowEmployee.schema.ts
export const EmployeeFindUniqueOrThrowSchema = z.object({ select: EmployeeSelectObjectSchema.optional(), include: EmployeeIncludeObjectSchema.optional(), where: EmployeeWhereUniqueInputObjectSchema }).strict();
export const EmployeeFindUniqueOrThrowZodSchema = z.object({ select: EmployeeSelectObjectSchema.optional(), include: EmployeeIncludeObjectSchema.optional(), where: EmployeeWhereUniqueInputObjectSchema }).strict();
// File: findFirstEmployee.schema.ts
// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------
export const EmployeeFindFirstSelectSchema__findFirstEmployee_schema = z.object({
    uuid: z.boolean().optional(),
    account: z.boolean().optional(),
    avatar: z.boolean().optional(),
    first_name: z.boolean().optional(),
    last_name: z.boolean().optional(),
    date_of_birth: z.boolean().optional(),
    position: z.boolean().optional(),
    department: z.boolean().optional(),
    start_date: z.boolean().optional(),
    supervisor: z.boolean().optional(),
    phone_number: z.boolean().optional(),
    personal_email: z.boolean().optional(),
    corporate_email: z.boolean().optional()
}).strict();
export const EmployeeFindFirstSelectZodSchema__findFirstEmployee_schema = z.object({
    uuid: z.boolean().optional(),
    account: z.boolean().optional(),
    avatar: z.boolean().optional(),
    first_name: z.boolean().optional(),
    last_name: z.boolean().optional(),
    date_of_birth: z.boolean().optional(),
    position: z.boolean().optional(),
    department: z.boolean().optional(),
    start_date: z.boolean().optional(),
    supervisor: z.boolean().optional(),
    phone_number: z.boolean().optional(),
    personal_email: z.boolean().optional(),
    corporate_email: z.boolean().optional()
}).strict();
export const EmployeeFindFirstSchema = z.object({ select: EmployeeFindFirstSelectSchema__findFirstEmployee_schema.optional(), include: z.lazy(() => EmployeeIncludeObjectSchema.optional()), orderBy: z.union([EmployeeOrderByWithRelationInputObjectSchema, EmployeeOrderByWithRelationInputObjectSchema.array()]).optional(), where: EmployeeWhereInputObjectSchema.optional(), cursor: EmployeeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([EmployeeScalarFieldEnumSchema, EmployeeScalarFieldEnumSchema.array()]).optional() }).strict();
export const EmployeeFindFirstZodSchema = z.object({ select: EmployeeFindFirstSelectSchema__findFirstEmployee_schema.optional(), include: z.lazy(() => EmployeeIncludeObjectSchema.optional()), orderBy: z.union([EmployeeOrderByWithRelationInputObjectSchema, EmployeeOrderByWithRelationInputObjectSchema.array()]).optional(), where: EmployeeWhereInputObjectSchema.optional(), cursor: EmployeeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([EmployeeScalarFieldEnumSchema, EmployeeScalarFieldEnumSchema.array()]).optional() }).strict();
// File: findFirstOrThrowEmployee.schema.ts
// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------
export const EmployeeFindFirstOrThrowSelectSchema__findFirstOrThrowEmployee_schema = z.object({
    uuid: z.boolean().optional(),
    account: z.boolean().optional(),
    avatar: z.boolean().optional(),
    first_name: z.boolean().optional(),
    last_name: z.boolean().optional(),
    date_of_birth: z.boolean().optional(),
    position: z.boolean().optional(),
    department: z.boolean().optional(),
    start_date: z.boolean().optional(),
    supervisor: z.boolean().optional(),
    phone_number: z.boolean().optional(),
    personal_email: z.boolean().optional(),
    corporate_email: z.boolean().optional()
}).strict();
export const EmployeeFindFirstOrThrowSelectZodSchema__findFirstOrThrowEmployee_schema = z.object({
    uuid: z.boolean().optional(),
    account: z.boolean().optional(),
    avatar: z.boolean().optional(),
    first_name: z.boolean().optional(),
    last_name: z.boolean().optional(),
    date_of_birth: z.boolean().optional(),
    position: z.boolean().optional(),
    department: z.boolean().optional(),
    start_date: z.boolean().optional(),
    supervisor: z.boolean().optional(),
    phone_number: z.boolean().optional(),
    personal_email: z.boolean().optional(),
    corporate_email: z.boolean().optional()
}).strict();
export const EmployeeFindFirstOrThrowSchema = z.object({ select: EmployeeFindFirstOrThrowSelectSchema__findFirstOrThrowEmployee_schema.optional(), include: z.lazy(() => EmployeeIncludeObjectSchema.optional()), orderBy: z.union([EmployeeOrderByWithRelationInputObjectSchema, EmployeeOrderByWithRelationInputObjectSchema.array()]).optional(), where: EmployeeWhereInputObjectSchema.optional(), cursor: EmployeeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([EmployeeScalarFieldEnumSchema, EmployeeScalarFieldEnumSchema.array()]).optional() }).strict();
export const EmployeeFindFirstOrThrowZodSchema = z.object({ select: EmployeeFindFirstOrThrowSelectSchema__findFirstOrThrowEmployee_schema.optional(), include: z.lazy(() => EmployeeIncludeObjectSchema.optional()), orderBy: z.union([EmployeeOrderByWithRelationInputObjectSchema, EmployeeOrderByWithRelationInputObjectSchema.array()]).optional(), where: EmployeeWhereInputObjectSchema.optional(), cursor: EmployeeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([EmployeeScalarFieldEnumSchema, EmployeeScalarFieldEnumSchema.array()]).optional() }).strict();
// File: findManyEmployee.schema.ts
// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------
export const EmployeeFindManySelectSchema__findManyEmployee_schema = z.object({
    uuid: z.boolean().optional(),
    account: z.boolean().optional(),
    avatar: z.boolean().optional(),
    first_name: z.boolean().optional(),
    last_name: z.boolean().optional(),
    date_of_birth: z.boolean().optional(),
    position: z.boolean().optional(),
    department: z.boolean().optional(),
    start_date: z.boolean().optional(),
    supervisor: z.boolean().optional(),
    phone_number: z.boolean().optional(),
    personal_email: z.boolean().optional(),
    corporate_email: z.boolean().optional()
}).strict();
export const EmployeeFindManySelectZodSchema__findManyEmployee_schema = z.object({
    uuid: z.boolean().optional(),
    account: z.boolean().optional(),
    avatar: z.boolean().optional(),
    first_name: z.boolean().optional(),
    last_name: z.boolean().optional(),
    date_of_birth: z.boolean().optional(),
    position: z.boolean().optional(),
    department: z.boolean().optional(),
    start_date: z.boolean().optional(),
    supervisor: z.boolean().optional(),
    phone_number: z.boolean().optional(),
    personal_email: z.boolean().optional(),
    corporate_email: z.boolean().optional()
}).strict();
export const EmployeeFindManySchema = z.object({ select: EmployeeFindManySelectSchema__findManyEmployee_schema.optional(), include: z.lazy(() => EmployeeIncludeObjectSchema.optional()), orderBy: z.union([EmployeeOrderByWithRelationInputObjectSchema, EmployeeOrderByWithRelationInputObjectSchema.array()]).optional(), where: EmployeeWhereInputObjectSchema.optional(), cursor: EmployeeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([EmployeeScalarFieldEnumSchema, EmployeeScalarFieldEnumSchema.array()]).optional() }).strict();
export const EmployeeFindManyZodSchema = z.object({ select: EmployeeFindManySelectSchema__findManyEmployee_schema.optional(), include: z.lazy(() => EmployeeIncludeObjectSchema.optional()), orderBy: z.union([EmployeeOrderByWithRelationInputObjectSchema, EmployeeOrderByWithRelationInputObjectSchema.array()]).optional(), where: EmployeeWhereInputObjectSchema.optional(), cursor: EmployeeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([EmployeeScalarFieldEnumSchema, EmployeeScalarFieldEnumSchema.array()]).optional() }).strict();
// File: countEmployee.schema.ts
export const EmployeeCountSchema = z.object({ orderBy: z.union([EmployeeOrderByWithRelationInputObjectSchema, EmployeeOrderByWithRelationInputObjectSchema.array()]).optional(), where: EmployeeWhereInputObjectSchema.optional(), cursor: EmployeeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([z.literal(true), EmployeeCountAggregateInputObjectSchema]).optional() }).strict();
export const EmployeeCountZodSchema = z.object({ orderBy: z.union([EmployeeOrderByWithRelationInputObjectSchema, EmployeeOrderByWithRelationInputObjectSchema.array()]).optional(), where: EmployeeWhereInputObjectSchema.optional(), cursor: EmployeeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([z.literal(true), EmployeeCountAggregateInputObjectSchema]).optional() }).strict();
// File: createOneEmployee.schema.ts
export const EmployeeCreateOneSchema = z.object({ select: EmployeeSelectObjectSchema.optional(), include: EmployeeIncludeObjectSchema.optional(), data: z.union([EmployeeCreateInputObjectSchema, EmployeeUncheckedCreateInputObjectSchema]) }).strict();
export const EmployeeCreateOneZodSchema = z.object({ select: EmployeeSelectObjectSchema.optional(), include: EmployeeIncludeObjectSchema.optional(), data: z.union([EmployeeCreateInputObjectSchema, EmployeeUncheckedCreateInputObjectSchema]) }).strict();
// File: createManyEmployee.schema.ts
export const EmployeeCreateManySchema = z.object({ data: z.union([EmployeeCreateManyInputObjectSchema, z.array(EmployeeCreateManyInputObjectSchema)]), skipDuplicates: z.boolean().optional() }).strict();
export const EmployeeCreateManyZodSchema = z.object({ data: z.union([EmployeeCreateManyInputObjectSchema, z.array(EmployeeCreateManyInputObjectSchema)]), skipDuplicates: z.boolean().optional() }).strict();
// File: createManyAndReturnEmployee.schema.ts
export const EmployeeCreateManyAndReturnSchema = z.object({ select: EmployeeSelectObjectSchema.optional(), data: z.union([EmployeeCreateManyInputObjectSchema, z.array(EmployeeCreateManyInputObjectSchema)]), skipDuplicates: z.boolean().optional() }).strict();
export const EmployeeCreateManyAndReturnZodSchema = z.object({ select: EmployeeSelectObjectSchema.optional(), data: z.union([EmployeeCreateManyInputObjectSchema, z.array(EmployeeCreateManyInputObjectSchema)]), skipDuplicates: z.boolean().optional() }).strict();
// File: deleteOneEmployee.schema.ts
export const EmployeeDeleteOneSchema = z.object({ select: EmployeeSelectObjectSchema.optional(), include: EmployeeIncludeObjectSchema.optional(), where: EmployeeWhereUniqueInputObjectSchema }).strict();
export const EmployeeDeleteOneZodSchema = z.object({ select: EmployeeSelectObjectSchema.optional(), include: EmployeeIncludeObjectSchema.optional(), where: EmployeeWhereUniqueInputObjectSchema }).strict();
// File: deleteManyEmployee.schema.ts
export const EmployeeDeleteManySchema = z.object({ where: EmployeeWhereInputObjectSchema.optional() }).strict();
export const EmployeeDeleteManyZodSchema = z.object({ where: EmployeeWhereInputObjectSchema.optional() }).strict();
// File: updateOneEmployee.schema.ts
export const EmployeeUpdateOneSchema = z.object({ select: EmployeeSelectObjectSchema.optional(), include: EmployeeIncludeObjectSchema.optional(), data: z.union([EmployeeUpdateInputObjectSchema, EmployeeUncheckedUpdateInputObjectSchema]), where: EmployeeWhereUniqueInputObjectSchema }).strict();
export const EmployeeUpdateOneZodSchema = z.object({ select: EmployeeSelectObjectSchema.optional(), include: EmployeeIncludeObjectSchema.optional(), data: z.union([EmployeeUpdateInputObjectSchema, EmployeeUncheckedUpdateInputObjectSchema]), where: EmployeeWhereUniqueInputObjectSchema }).strict();
// File: updateManyEmployee.schema.ts
export const EmployeeUpdateManySchema = z.object({ data: EmployeeUpdateManyMutationInputObjectSchema, where: EmployeeWhereInputObjectSchema.optional() }).strict();
export const EmployeeUpdateManyZodSchema = z.object({ data: EmployeeUpdateManyMutationInputObjectSchema, where: EmployeeWhereInputObjectSchema.optional() }).strict();
// File: updateManyAndReturnEmployee.schema.ts
export const EmployeeUpdateManyAndReturnSchema = z.object({ select: EmployeeSelectObjectSchema.optional(), data: EmployeeUpdateManyMutationInputObjectSchema, where: EmployeeWhereInputObjectSchema.optional() }).strict();
export const EmployeeUpdateManyAndReturnZodSchema = z.object({ select: EmployeeSelectObjectSchema.optional(), data: EmployeeUpdateManyMutationInputObjectSchema, where: EmployeeWhereInputObjectSchema.optional() }).strict();
// File: upsertOneEmployee.schema.ts
export const EmployeeUpsertOneSchema = z.object({ select: EmployeeSelectObjectSchema.optional(), include: EmployeeIncludeObjectSchema.optional(), where: EmployeeWhereUniqueInputObjectSchema, create: z.union([EmployeeCreateInputObjectSchema, EmployeeUncheckedCreateInputObjectSchema]), update: z.union([EmployeeUpdateInputObjectSchema, EmployeeUncheckedUpdateInputObjectSchema]) }).strict();
export const EmployeeUpsertOneZodSchema = z.object({ select: EmployeeSelectObjectSchema.optional(), include: EmployeeIncludeObjectSchema.optional(), where: EmployeeWhereUniqueInputObjectSchema, create: z.union([EmployeeCreateInputObjectSchema, EmployeeUncheckedCreateInputObjectSchema]), update: z.union([EmployeeUpdateInputObjectSchema, EmployeeUncheckedUpdateInputObjectSchema]) }).strict();
// File: aggregateEmployee.schema.ts
export const EmployeeAggregateSchema = z.object({ orderBy: z.union([EmployeeOrderByWithRelationInputObjectSchema, EmployeeOrderByWithRelationInputObjectSchema.array()]).optional(), where: EmployeeWhereInputObjectSchema.optional(), cursor: EmployeeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([z.literal(true), EmployeeCountAggregateInputObjectSchema]).optional(), _min: EmployeeMinAggregateInputObjectSchema.optional(), _max: EmployeeMaxAggregateInputObjectSchema.optional() }).strict();
export const EmployeeAggregateZodSchema = z.object({ orderBy: z.union([EmployeeOrderByWithRelationInputObjectSchema, EmployeeOrderByWithRelationInputObjectSchema.array()]).optional(), where: EmployeeWhereInputObjectSchema.optional(), cursor: EmployeeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([z.literal(true), EmployeeCountAggregateInputObjectSchema]).optional(), _min: EmployeeMinAggregateInputObjectSchema.optional(), _max: EmployeeMaxAggregateInputObjectSchema.optional() }).strict();
// File: groupByEmployee.schema.ts
export const EmployeeGroupBySchema = z.object({ where: EmployeeWhereInputObjectSchema.optional(), orderBy: z.union([EmployeeOrderByWithAggregationInputObjectSchema, EmployeeOrderByWithAggregationInputObjectSchema.array()]).optional(), having: EmployeeScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(EmployeeScalarFieldEnumSchema), _count: z.union([z.literal(true), EmployeeCountAggregateInputObjectSchema]).optional(), _min: EmployeeMinAggregateInputObjectSchema.optional(), _max: EmployeeMaxAggregateInputObjectSchema.optional() }).strict();
export const EmployeeGroupByZodSchema = z.object({ where: EmployeeWhereInputObjectSchema.optional(), orderBy: z.union([EmployeeOrderByWithAggregationInputObjectSchema, EmployeeOrderByWithAggregationInputObjectSchema.array()]).optional(), having: EmployeeScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(EmployeeScalarFieldEnumSchema), _count: z.union([z.literal(true), EmployeeCountAggregateInputObjectSchema]).optional(), _min: EmployeeMinAggregateInputObjectSchema.optional(), _max: EmployeeMaxAggregateInputObjectSchema.optional() }).strict();
// File: findUniqueContent.schema.ts
export const ContentFindUniqueSchema = z.object({ select: ContentSelectObjectSchema.optional(), where: ContentWhereUniqueInputObjectSchema }).strict();
export const ContentFindUniqueZodSchema = z.object({ select: ContentSelectObjectSchema.optional(), where: ContentWhereUniqueInputObjectSchema }).strict();
// File: findUniqueOrThrowContent.schema.ts
export const ContentFindUniqueOrThrowSchema = z.object({ select: ContentSelectObjectSchema.optional(), where: ContentWhereUniqueInputObjectSchema }).strict();
export const ContentFindUniqueOrThrowZodSchema = z.object({ select: ContentSelectObjectSchema.optional(), where: ContentWhereUniqueInputObjectSchema }).strict();
// File: findFirstContent.schema.ts
// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------
export const ContentFindFirstSelectSchema__findFirstContent_schema = z.object({
    uuid: z.boolean().optional(),
    title: z.boolean().optional(),
    url: z.boolean().optional(),
    content_owner: z.boolean().optional(),
    for_position: z.boolean().optional(),
    last_modified_time: z.boolean().optional(),
    expiration_time: z.boolean().optional(),
    content_type: z.boolean().optional(),
    status: z.boolean().optional(),
    is_favorite: z.boolean().optional()
}).strict();
export const ContentFindFirstSelectZodSchema__findFirstContent_schema = z.object({
    uuid: z.boolean().optional(),
    title: z.boolean().optional(),
    url: z.boolean().optional(),
    content_owner: z.boolean().optional(),
    for_position: z.boolean().optional(),
    last_modified_time: z.boolean().optional(),
    expiration_time: z.boolean().optional(),
    content_type: z.boolean().optional(),
    status: z.boolean().optional(),
    is_favorite: z.boolean().optional()
}).strict();
export const ContentFindFirstSchema = z.object({ select: ContentFindFirstSelectSchema__findFirstContent_schema.optional(), orderBy: z.union([ContentOrderByWithRelationInputObjectSchema, ContentOrderByWithRelationInputObjectSchema.array()]).optional(), where: ContentWhereInputObjectSchema.optional(), cursor: ContentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ContentScalarFieldEnumSchema, ContentScalarFieldEnumSchema.array()]).optional() }).strict();
export const ContentFindFirstZodSchema = z.object({ select: ContentFindFirstSelectSchema__findFirstContent_schema.optional(), orderBy: z.union([ContentOrderByWithRelationInputObjectSchema, ContentOrderByWithRelationInputObjectSchema.array()]).optional(), where: ContentWhereInputObjectSchema.optional(), cursor: ContentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ContentScalarFieldEnumSchema, ContentScalarFieldEnumSchema.array()]).optional() }).strict();
// File: findFirstOrThrowContent.schema.ts
// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------
export const ContentFindFirstOrThrowSelectSchema__findFirstOrThrowContent_schema = z.object({
    uuid: z.boolean().optional(),
    title: z.boolean().optional(),
    url: z.boolean().optional(),
    content_owner: z.boolean().optional(),
    for_position: z.boolean().optional(),
    last_modified_time: z.boolean().optional(),
    expiration_time: z.boolean().optional(),
    content_type: z.boolean().optional(),
    status: z.boolean().optional(),
    is_favorite: z.boolean().optional()
}).strict();
export const ContentFindFirstOrThrowSelectZodSchema__findFirstOrThrowContent_schema = z.object({
    uuid: z.boolean().optional(),
    title: z.boolean().optional(),
    url: z.boolean().optional(),
    content_owner: z.boolean().optional(),
    for_position: z.boolean().optional(),
    last_modified_time: z.boolean().optional(),
    expiration_time: z.boolean().optional(),
    content_type: z.boolean().optional(),
    status: z.boolean().optional(),
    is_favorite: z.boolean().optional()
}).strict();
export const ContentFindFirstOrThrowSchema = z.object({ select: ContentFindFirstOrThrowSelectSchema__findFirstOrThrowContent_schema.optional(), orderBy: z.union([ContentOrderByWithRelationInputObjectSchema, ContentOrderByWithRelationInputObjectSchema.array()]).optional(), where: ContentWhereInputObjectSchema.optional(), cursor: ContentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ContentScalarFieldEnumSchema, ContentScalarFieldEnumSchema.array()]).optional() }).strict();
export const ContentFindFirstOrThrowZodSchema = z.object({ select: ContentFindFirstOrThrowSelectSchema__findFirstOrThrowContent_schema.optional(), orderBy: z.union([ContentOrderByWithRelationInputObjectSchema, ContentOrderByWithRelationInputObjectSchema.array()]).optional(), where: ContentWhereInputObjectSchema.optional(), cursor: ContentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ContentScalarFieldEnumSchema, ContentScalarFieldEnumSchema.array()]).optional() }).strict();
// File: findManyContent.schema.ts
// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------
export const ContentFindManySelectSchema__findManyContent_schema = z.object({
    uuid: z.boolean().optional(),
    title: z.boolean().optional(),
    url: z.boolean().optional(),
    content_owner: z.boolean().optional(),
    for_position: z.boolean().optional(),
    last_modified_time: z.boolean().optional(),
    expiration_time: z.boolean().optional(),
    content_type: z.boolean().optional(),
    status: z.boolean().optional(),
    is_favorite: z.boolean().optional()
}).strict();
export const ContentFindManySelectZodSchema__findManyContent_schema = z.object({
    uuid: z.boolean().optional(),
    title: z.boolean().optional(),
    url: z.boolean().optional(),
    content_owner: z.boolean().optional(),
    for_position: z.boolean().optional(),
    last_modified_time: z.boolean().optional(),
    expiration_time: z.boolean().optional(),
    content_type: z.boolean().optional(),
    status: z.boolean().optional(),
    is_favorite: z.boolean().optional()
}).strict();
export const ContentFindManySchema = z.object({ select: ContentFindManySelectSchema__findManyContent_schema.optional(), orderBy: z.union([ContentOrderByWithRelationInputObjectSchema, ContentOrderByWithRelationInputObjectSchema.array()]).optional(), where: ContentWhereInputObjectSchema.optional(), cursor: ContentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ContentScalarFieldEnumSchema, ContentScalarFieldEnumSchema.array()]).optional() }).strict();
export const ContentFindManyZodSchema = z.object({ select: ContentFindManySelectSchema__findManyContent_schema.optional(), orderBy: z.union([ContentOrderByWithRelationInputObjectSchema, ContentOrderByWithRelationInputObjectSchema.array()]).optional(), where: ContentWhereInputObjectSchema.optional(), cursor: ContentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ContentScalarFieldEnumSchema, ContentScalarFieldEnumSchema.array()]).optional() }).strict();
// File: countContent.schema.ts
export const ContentCountSchema = z.object({ orderBy: z.union([ContentOrderByWithRelationInputObjectSchema, ContentOrderByWithRelationInputObjectSchema.array()]).optional(), where: ContentWhereInputObjectSchema.optional(), cursor: ContentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([z.literal(true), ContentCountAggregateInputObjectSchema]).optional() }).strict();
export const ContentCountZodSchema = z.object({ orderBy: z.union([ContentOrderByWithRelationInputObjectSchema, ContentOrderByWithRelationInputObjectSchema.array()]).optional(), where: ContentWhereInputObjectSchema.optional(), cursor: ContentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([z.literal(true), ContentCountAggregateInputObjectSchema]).optional() }).strict();
// File: createOneContent.schema.ts
export const ContentCreateOneSchema = z.object({ select: ContentSelectObjectSchema.optional(), data: z.union([ContentCreateInputObjectSchema, ContentUncheckedCreateInputObjectSchema]) }).strict();
export const ContentCreateOneZodSchema = z.object({ select: ContentSelectObjectSchema.optional(), data: z.union([ContentCreateInputObjectSchema, ContentUncheckedCreateInputObjectSchema]) }).strict();
// File: createManyContent.schema.ts
export const ContentCreateManySchema = z.object({ data: z.union([ContentCreateManyInputObjectSchema, z.array(ContentCreateManyInputObjectSchema)]), skipDuplicates: z.boolean().optional() }).strict();
export const ContentCreateManyZodSchema = z.object({ data: z.union([ContentCreateManyInputObjectSchema, z.array(ContentCreateManyInputObjectSchema)]), skipDuplicates: z.boolean().optional() }).strict();
// File: createManyAndReturnContent.schema.ts
export const ContentCreateManyAndReturnSchema = z.object({ select: ContentSelectObjectSchema.optional(), data: z.union([ContentCreateManyInputObjectSchema, z.array(ContentCreateManyInputObjectSchema)]), skipDuplicates: z.boolean().optional() }).strict();
export const ContentCreateManyAndReturnZodSchema = z.object({ select: ContentSelectObjectSchema.optional(), data: z.union([ContentCreateManyInputObjectSchema, z.array(ContentCreateManyInputObjectSchema)]), skipDuplicates: z.boolean().optional() }).strict();
// File: deleteOneContent.schema.ts
export const ContentDeleteOneSchema = z.object({ select: ContentSelectObjectSchema.optional(), where: ContentWhereUniqueInputObjectSchema }).strict();
export const ContentDeleteOneZodSchema = z.object({ select: ContentSelectObjectSchema.optional(), where: ContentWhereUniqueInputObjectSchema }).strict();
// File: deleteManyContent.schema.ts
export const ContentDeleteManySchema = z.object({ where: ContentWhereInputObjectSchema.optional() }).strict();
export const ContentDeleteManyZodSchema = z.object({ where: ContentWhereInputObjectSchema.optional() }).strict();
// File: updateOneContent.schema.ts
export const ContentUpdateOneSchema = z.object({ select: ContentSelectObjectSchema.optional(), data: z.union([ContentUpdateInputObjectSchema, ContentUncheckedUpdateInputObjectSchema]), where: ContentWhereUniqueInputObjectSchema }).strict();
export const ContentUpdateOneZodSchema = z.object({ select: ContentSelectObjectSchema.optional(), data: z.union([ContentUpdateInputObjectSchema, ContentUncheckedUpdateInputObjectSchema]), where: ContentWhereUniqueInputObjectSchema }).strict();
// File: updateManyContent.schema.ts
export const ContentUpdateManySchema = z.object({ data: ContentUpdateManyMutationInputObjectSchema, where: ContentWhereInputObjectSchema.optional() }).strict();
export const ContentUpdateManyZodSchema = z.object({ data: ContentUpdateManyMutationInputObjectSchema, where: ContentWhereInputObjectSchema.optional() }).strict();
// File: updateManyAndReturnContent.schema.ts
export const ContentUpdateManyAndReturnSchema = z.object({ select: ContentSelectObjectSchema.optional(), data: ContentUpdateManyMutationInputObjectSchema, where: ContentWhereInputObjectSchema.optional() }).strict();
export const ContentUpdateManyAndReturnZodSchema = z.object({ select: ContentSelectObjectSchema.optional(), data: ContentUpdateManyMutationInputObjectSchema, where: ContentWhereInputObjectSchema.optional() }).strict();
// File: upsertOneContent.schema.ts
export const ContentUpsertOneSchema = z.object({ select: ContentSelectObjectSchema.optional(), where: ContentWhereUniqueInputObjectSchema, create: z.union([ContentCreateInputObjectSchema, ContentUncheckedCreateInputObjectSchema]), update: z.union([ContentUpdateInputObjectSchema, ContentUncheckedUpdateInputObjectSchema]) }).strict();
export const ContentUpsertOneZodSchema = z.object({ select: ContentSelectObjectSchema.optional(), where: ContentWhereUniqueInputObjectSchema, create: z.union([ContentCreateInputObjectSchema, ContentUncheckedCreateInputObjectSchema]), update: z.union([ContentUpdateInputObjectSchema, ContentUncheckedUpdateInputObjectSchema]) }).strict();
// File: aggregateContent.schema.ts
export const ContentAggregateSchema = z.object({ orderBy: z.union([ContentOrderByWithRelationInputObjectSchema, ContentOrderByWithRelationInputObjectSchema.array()]).optional(), where: ContentWhereInputObjectSchema.optional(), cursor: ContentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([z.literal(true), ContentCountAggregateInputObjectSchema]).optional(), _min: ContentMinAggregateInputObjectSchema.optional(), _max: ContentMaxAggregateInputObjectSchema.optional() }).strict();
export const ContentAggregateZodSchema = z.object({ orderBy: z.union([ContentOrderByWithRelationInputObjectSchema, ContentOrderByWithRelationInputObjectSchema.array()]).optional(), where: ContentWhereInputObjectSchema.optional(), cursor: ContentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([z.literal(true), ContentCountAggregateInputObjectSchema]).optional(), _min: ContentMinAggregateInputObjectSchema.optional(), _max: ContentMaxAggregateInputObjectSchema.optional() }).strict();
// File: groupByContent.schema.ts
export const ContentGroupBySchema = z.object({ where: ContentWhereInputObjectSchema.optional(), orderBy: z.union([ContentOrderByWithAggregationInputObjectSchema, ContentOrderByWithAggregationInputObjectSchema.array()]).optional(), having: ContentScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(ContentScalarFieldEnumSchema), _count: z.union([z.literal(true), ContentCountAggregateInputObjectSchema]).optional(), _min: ContentMinAggregateInputObjectSchema.optional(), _max: ContentMaxAggregateInputObjectSchema.optional() }).strict();
export const ContentGroupByZodSchema = z.object({ where: ContentWhereInputObjectSchema.optional(), orderBy: z.union([ContentOrderByWithAggregationInputObjectSchema, ContentOrderByWithAggregationInputObjectSchema.array()]).optional(), having: ContentScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(ContentScalarFieldEnumSchema), _count: z.union([z.literal(true), ContentCountAggregateInputObjectSchema]).optional(), _min: ContentMinAggregateInputObjectSchema.optional(), _max: ContentMaxAggregateInputObjectSchema.optional() }).strict();
// File: findUniqueAccount.schema.ts
export const AccountFindUniqueSchema = z.object({ select: AccountSelectObjectSchema.optional(), include: AccountIncludeObjectSchema.optional(), where: AccountWhereUniqueInputObjectSchema }).strict();
export const AccountFindUniqueZodSchema = z.object({ select: AccountSelectObjectSchema.optional(), include: AccountIncludeObjectSchema.optional(), where: AccountWhereUniqueInputObjectSchema }).strict();
// File: findUniqueOrThrowAccount.schema.ts
export const AccountFindUniqueOrThrowSchema = z.object({ select: AccountSelectObjectSchema.optional(), include: AccountIncludeObjectSchema.optional(), where: AccountWhereUniqueInputObjectSchema }).strict();
export const AccountFindUniqueOrThrowZodSchema = z.object({ select: AccountSelectObjectSchema.optional(), include: AccountIncludeObjectSchema.optional(), where: AccountWhereUniqueInputObjectSchema }).strict();
// File: findFirstAccount.schema.ts
// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------
export const AccountFindFirstSelectSchema__findFirstAccount_schema = z.object({
    employee: z.boolean().optional(),
    employeeUuid: z.boolean().optional(),
    username: z.boolean().optional(),
    password: z.boolean().optional(),
    type: z.boolean().optional()
}).strict();
export const AccountFindFirstSelectZodSchema__findFirstAccount_schema = z.object({
    employee: z.boolean().optional(),
    employeeUuid: z.boolean().optional(),
    username: z.boolean().optional(),
    password: z.boolean().optional(),
    type: z.boolean().optional()
}).strict();
export const AccountFindFirstSchema = z.object({ select: AccountFindFirstSelectSchema__findFirstAccount_schema.optional(), include: z.lazy(() => AccountIncludeObjectSchema.optional()), orderBy: z.union([AccountOrderByWithRelationInputObjectSchema, AccountOrderByWithRelationInputObjectSchema.array()]).optional(), where: AccountWhereInputObjectSchema.optional(), cursor: AccountWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AccountScalarFieldEnumSchema, AccountScalarFieldEnumSchema.array()]).optional() }).strict();
export const AccountFindFirstZodSchema = z.object({ select: AccountFindFirstSelectSchema__findFirstAccount_schema.optional(), include: z.lazy(() => AccountIncludeObjectSchema.optional()), orderBy: z.union([AccountOrderByWithRelationInputObjectSchema, AccountOrderByWithRelationInputObjectSchema.array()]).optional(), where: AccountWhereInputObjectSchema.optional(), cursor: AccountWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AccountScalarFieldEnumSchema, AccountScalarFieldEnumSchema.array()]).optional() }).strict();
// File: findFirstOrThrowAccount.schema.ts
// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------
export const AccountFindFirstOrThrowSelectSchema__findFirstOrThrowAccount_schema = z.object({
    employee: z.boolean().optional(),
    employeeUuid: z.boolean().optional(),
    username: z.boolean().optional(),
    password: z.boolean().optional(),
    type: z.boolean().optional()
}).strict();
export const AccountFindFirstOrThrowSelectZodSchema__findFirstOrThrowAccount_schema = z.object({
    employee: z.boolean().optional(),
    employeeUuid: z.boolean().optional(),
    username: z.boolean().optional(),
    password: z.boolean().optional(),
    type: z.boolean().optional()
}).strict();
export const AccountFindFirstOrThrowSchema = z.object({ select: AccountFindFirstOrThrowSelectSchema__findFirstOrThrowAccount_schema.optional(), include: z.lazy(() => AccountIncludeObjectSchema.optional()), orderBy: z.union([AccountOrderByWithRelationInputObjectSchema, AccountOrderByWithRelationInputObjectSchema.array()]).optional(), where: AccountWhereInputObjectSchema.optional(), cursor: AccountWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AccountScalarFieldEnumSchema, AccountScalarFieldEnumSchema.array()]).optional() }).strict();
export const AccountFindFirstOrThrowZodSchema = z.object({ select: AccountFindFirstOrThrowSelectSchema__findFirstOrThrowAccount_schema.optional(), include: z.lazy(() => AccountIncludeObjectSchema.optional()), orderBy: z.union([AccountOrderByWithRelationInputObjectSchema, AccountOrderByWithRelationInputObjectSchema.array()]).optional(), where: AccountWhereInputObjectSchema.optional(), cursor: AccountWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AccountScalarFieldEnumSchema, AccountScalarFieldEnumSchema.array()]).optional() }).strict();
// File: findManyAccount.schema.ts
// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------
export const AccountFindManySelectSchema__findManyAccount_schema = z.object({
    employee: z.boolean().optional(),
    employeeUuid: z.boolean().optional(),
    username: z.boolean().optional(),
    password: z.boolean().optional(),
    type: z.boolean().optional()
}).strict();
export const AccountFindManySelectZodSchema__findManyAccount_schema = z.object({
    employee: z.boolean().optional(),
    employeeUuid: z.boolean().optional(),
    username: z.boolean().optional(),
    password: z.boolean().optional(),
    type: z.boolean().optional()
}).strict();
export const AccountFindManySchema = z.object({ select: AccountFindManySelectSchema__findManyAccount_schema.optional(), include: z.lazy(() => AccountIncludeObjectSchema.optional()), orderBy: z.union([AccountOrderByWithRelationInputObjectSchema, AccountOrderByWithRelationInputObjectSchema.array()]).optional(), where: AccountWhereInputObjectSchema.optional(), cursor: AccountWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AccountScalarFieldEnumSchema, AccountScalarFieldEnumSchema.array()]).optional() }).strict();
export const AccountFindManyZodSchema = z.object({ select: AccountFindManySelectSchema__findManyAccount_schema.optional(), include: z.lazy(() => AccountIncludeObjectSchema.optional()), orderBy: z.union([AccountOrderByWithRelationInputObjectSchema, AccountOrderByWithRelationInputObjectSchema.array()]).optional(), where: AccountWhereInputObjectSchema.optional(), cursor: AccountWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AccountScalarFieldEnumSchema, AccountScalarFieldEnumSchema.array()]).optional() }).strict();
// File: countAccount.schema.ts
export const AccountCountSchema = z.object({ orderBy: z.union([AccountOrderByWithRelationInputObjectSchema, AccountOrderByWithRelationInputObjectSchema.array()]).optional(), where: AccountWhereInputObjectSchema.optional(), cursor: AccountWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([z.literal(true), AccountCountAggregateInputObjectSchema]).optional() }).strict();
export const AccountCountZodSchema = z.object({ orderBy: z.union([AccountOrderByWithRelationInputObjectSchema, AccountOrderByWithRelationInputObjectSchema.array()]).optional(), where: AccountWhereInputObjectSchema.optional(), cursor: AccountWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([z.literal(true), AccountCountAggregateInputObjectSchema]).optional() }).strict();
// File: createOneAccount.schema.ts
export const AccountCreateOneSchema = z.object({ select: AccountSelectObjectSchema.optional(), include: AccountIncludeObjectSchema.optional(), data: z.union([AccountCreateInputObjectSchema, AccountUncheckedCreateInputObjectSchema]) }).strict();
export const AccountCreateOneZodSchema = z.object({ select: AccountSelectObjectSchema.optional(), include: AccountIncludeObjectSchema.optional(), data: z.union([AccountCreateInputObjectSchema, AccountUncheckedCreateInputObjectSchema]) }).strict();
// File: createManyAccount.schema.ts
export const AccountCreateManySchema = z.object({ data: z.union([AccountCreateManyInputObjectSchema, z.array(AccountCreateManyInputObjectSchema)]), skipDuplicates: z.boolean().optional() }).strict();
export const AccountCreateManyZodSchema = z.object({ data: z.union([AccountCreateManyInputObjectSchema, z.array(AccountCreateManyInputObjectSchema)]), skipDuplicates: z.boolean().optional() }).strict();
// File: createManyAndReturnAccount.schema.ts
export const AccountCreateManyAndReturnSchema = z.object({ select: AccountSelectObjectSchema.optional(), data: z.union([AccountCreateManyInputObjectSchema, z.array(AccountCreateManyInputObjectSchema)]), skipDuplicates: z.boolean().optional() }).strict();
export const AccountCreateManyAndReturnZodSchema = z.object({ select: AccountSelectObjectSchema.optional(), data: z.union([AccountCreateManyInputObjectSchema, z.array(AccountCreateManyInputObjectSchema)]), skipDuplicates: z.boolean().optional() }).strict();
// File: deleteOneAccount.schema.ts
export const AccountDeleteOneSchema = z.object({ select: AccountSelectObjectSchema.optional(), include: AccountIncludeObjectSchema.optional(), where: AccountWhereUniqueInputObjectSchema }).strict();
export const AccountDeleteOneZodSchema = z.object({ select: AccountSelectObjectSchema.optional(), include: AccountIncludeObjectSchema.optional(), where: AccountWhereUniqueInputObjectSchema }).strict();
// File: deleteManyAccount.schema.ts
export const AccountDeleteManySchema = z.object({ where: AccountWhereInputObjectSchema.optional() }).strict();
export const AccountDeleteManyZodSchema = z.object({ where: AccountWhereInputObjectSchema.optional() }).strict();
// File: updateOneAccount.schema.ts
export const AccountUpdateOneSchema = z.object({ select: AccountSelectObjectSchema.optional(), include: AccountIncludeObjectSchema.optional(), data: z.union([AccountUpdateInputObjectSchema, AccountUncheckedUpdateInputObjectSchema]), where: AccountWhereUniqueInputObjectSchema }).strict();
export const AccountUpdateOneZodSchema = z.object({ select: AccountSelectObjectSchema.optional(), include: AccountIncludeObjectSchema.optional(), data: z.union([AccountUpdateInputObjectSchema, AccountUncheckedUpdateInputObjectSchema]), where: AccountWhereUniqueInputObjectSchema }).strict();
// File: updateManyAccount.schema.ts
export const AccountUpdateManySchema = z.object({ data: AccountUpdateManyMutationInputObjectSchema, where: AccountWhereInputObjectSchema.optional() }).strict();
export const AccountUpdateManyZodSchema = z.object({ data: AccountUpdateManyMutationInputObjectSchema, where: AccountWhereInputObjectSchema.optional() }).strict();
// File: updateManyAndReturnAccount.schema.ts
export const AccountUpdateManyAndReturnSchema = z.object({ select: AccountSelectObjectSchema.optional(), data: AccountUpdateManyMutationInputObjectSchema, where: AccountWhereInputObjectSchema.optional() }).strict();
export const AccountUpdateManyAndReturnZodSchema = z.object({ select: AccountSelectObjectSchema.optional(), data: AccountUpdateManyMutationInputObjectSchema, where: AccountWhereInputObjectSchema.optional() }).strict();
// File: upsertOneAccount.schema.ts
export const AccountUpsertOneSchema = z.object({ select: AccountSelectObjectSchema.optional(), include: AccountIncludeObjectSchema.optional(), where: AccountWhereUniqueInputObjectSchema, create: z.union([AccountCreateInputObjectSchema, AccountUncheckedCreateInputObjectSchema]), update: z.union([AccountUpdateInputObjectSchema, AccountUncheckedUpdateInputObjectSchema]) }).strict();
export const AccountUpsertOneZodSchema = z.object({ select: AccountSelectObjectSchema.optional(), include: AccountIncludeObjectSchema.optional(), where: AccountWhereUniqueInputObjectSchema, create: z.union([AccountCreateInputObjectSchema, AccountUncheckedCreateInputObjectSchema]), update: z.union([AccountUpdateInputObjectSchema, AccountUncheckedUpdateInputObjectSchema]) }).strict();
// File: aggregateAccount.schema.ts
export const AccountAggregateSchema = z.object({ orderBy: z.union([AccountOrderByWithRelationInputObjectSchema, AccountOrderByWithRelationInputObjectSchema.array()]).optional(), where: AccountWhereInputObjectSchema.optional(), cursor: AccountWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([z.literal(true), AccountCountAggregateInputObjectSchema]).optional(), _min: AccountMinAggregateInputObjectSchema.optional(), _max: AccountMaxAggregateInputObjectSchema.optional() }).strict();
export const AccountAggregateZodSchema = z.object({ orderBy: z.union([AccountOrderByWithRelationInputObjectSchema, AccountOrderByWithRelationInputObjectSchema.array()]).optional(), where: AccountWhereInputObjectSchema.optional(), cursor: AccountWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([z.literal(true), AccountCountAggregateInputObjectSchema]).optional(), _min: AccountMinAggregateInputObjectSchema.optional(), _max: AccountMaxAggregateInputObjectSchema.optional() }).strict();
// File: groupByAccount.schema.ts
export const AccountGroupBySchema = z.object({ where: AccountWhereInputObjectSchema.optional(), orderBy: z.union([AccountOrderByWithAggregationInputObjectSchema, AccountOrderByWithAggregationInputObjectSchema.array()]).optional(), having: AccountScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(AccountScalarFieldEnumSchema), _count: z.union([z.literal(true), AccountCountAggregateInputObjectSchema]).optional(), _min: AccountMinAggregateInputObjectSchema.optional(), _max: AccountMaxAggregateInputObjectSchema.optional() }).strict();
export const AccountGroupByZodSchema = z.object({ where: AccountWhereInputObjectSchema.optional(), orderBy: z.union([AccountOrderByWithAggregationInputObjectSchema, AccountOrderByWithAggregationInputObjectSchema.array()]).optional(), having: AccountScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(AccountScalarFieldEnumSchema), _count: z.union([z.literal(true), AccountCountAggregateInputObjectSchema]).optional(), _min: AccountMinAggregateInputObjectSchema.optional(), _max: AccountMaxAggregateInputObjectSchema.optional() }).strict();
// File: EmployeeFindUniqueResult.schema.ts
export const EmployeeFindUniqueResultSchema = z.nullable(z.object({
    uuid: z.string(),
    account: z.unknown().optional(),
    avatar: z.string().optional(),
    first_name: z.string(),
    last_name: z.string(),
    date_of_birth: z.date(),
    position: z.unknown(),
    department: z.unknown(),
    start_date: z.date(),
    supervisor: z.string(),
    phone_number: z.string(),
    personal_email: z.string(),
    corporate_email: z.string()
}));
// File: EmployeeFindFirstResult.schema.ts
export const EmployeeFindFirstResultSchema = z.nullable(z.object({
    uuid: z.string(),
    account: z.unknown().optional(),
    avatar: z.string().optional(),
    first_name: z.string(),
    last_name: z.string(),
    date_of_birth: z.date(),
    position: z.unknown(),
    department: z.unknown(),
    start_date: z.date(),
    supervisor: z.string(),
    phone_number: z.string(),
    personal_email: z.string(),
    corporate_email: z.string()
}));
// File: EmployeeFindManyResult.schema.ts
export const EmployeeFindManyResultSchema = z.object({
    data: z.array(z.object({
        uuid: z.string(),
        account: z.unknown().optional(),
        avatar: z.string().optional(),
        first_name: z.string(),
        last_name: z.string(),
        date_of_birth: z.date(),
        position: z.unknown(),
        department: z.unknown(),
        start_date: z.date(),
        supervisor: z.string(),
        phone_number: z.string(),
        personal_email: z.string(),
        corporate_email: z.string()
    })),
    pagination: z.object({
        page: z.number().int().min(1),
        pageSize: z.number().int().min(1),
        total: z.number().int().min(0),
        totalPages: z.number().int().min(0),
        hasNext: z.boolean(),
        hasPrev: z.boolean()
    })
});
// File: EmployeeCreateResult.schema.ts
export const EmployeeCreateResultSchema = z.object({
    uuid: z.string(),
    account: z.unknown().optional(),
    avatar: z.string().optional(),
    first_name: z.string(),
    last_name: z.string(),
    date_of_birth: z.date(),
    position: z.unknown(),
    department: z.unknown(),
    start_date: z.date(),
    supervisor: z.string(),
    phone_number: z.string(),
    personal_email: z.string(),
    corporate_email: z.string()
});
// File: EmployeeCreateManyResult.schema.ts
export const EmployeeCreateManyResultSchema = z.object({
    count: z.number()
});
// File: EmployeeUpdateResult.schema.ts
export const EmployeeUpdateResultSchema = z.nullable(z.object({
    uuid: z.string(),
    account: z.unknown().optional(),
    avatar: z.string().optional(),
    first_name: z.string(),
    last_name: z.string(),
    date_of_birth: z.date(),
    position: z.unknown(),
    department: z.unknown(),
    start_date: z.date(),
    supervisor: z.string(),
    phone_number: z.string(),
    personal_email: z.string(),
    corporate_email: z.string()
}));
// File: EmployeeUpdateManyResult.schema.ts
export const EmployeeUpdateManyResultSchema = z.object({
    count: z.number()
});
// File: EmployeeUpsertResult.schema.ts
export const EmployeeUpsertResultSchema = z.object({
    uuid: z.string(),
    account: z.unknown().optional(),
    avatar: z.string().optional(),
    first_name: z.string(),
    last_name: z.string(),
    date_of_birth: z.date(),
    position: z.unknown(),
    department: z.unknown(),
    start_date: z.date(),
    supervisor: z.string(),
    phone_number: z.string(),
    personal_email: z.string(),
    corporate_email: z.string()
});
// File: EmployeeDeleteResult.schema.ts
export const EmployeeDeleteResultSchema = z.nullable(z.object({
    uuid: z.string(),
    account: z.unknown().optional(),
    avatar: z.string().optional(),
    first_name: z.string(),
    last_name: z.string(),
    date_of_birth: z.date(),
    position: z.unknown(),
    department: z.unknown(),
    start_date: z.date(),
    supervisor: z.string(),
    phone_number: z.string(),
    personal_email: z.string(),
    corporate_email: z.string()
}));
// File: EmployeeDeleteManyResult.schema.ts
export const EmployeeDeleteManyResultSchema = z.object({
    count: z.number()
});
// File: EmployeeAggregateResult.schema.ts
export const EmployeeAggregateResultSchema = z.object({ _count: z.object({
        uuid: z.number(),
        account: z.number(),
        avatar: z.number(),
        first_name: z.number(),
        last_name: z.number(),
        date_of_birth: z.number(),
        position: z.number(),
        department: z.number(),
        start_date: z.number(),
        supervisor: z.number(),
        phone_number: z.number(),
        personal_email: z.number(),
        corporate_email: z.number()
    }).optional(),
    _min: z.object({
        uuid: z.string().nullable(),
        avatar: z.string().nullable(),
        first_name: z.string().nullable(),
        last_name: z.string().nullable(),
        date_of_birth: z.date().nullable(),
        start_date: z.date().nullable(),
        supervisor: z.string().nullable(),
        phone_number: z.string().nullable(),
        personal_email: z.string().nullable(),
        corporate_email: z.string().nullable()
    }).nullable().optional(),
    _max: z.object({
        uuid: z.string().nullable(),
        avatar: z.string().nullable(),
        first_name: z.string().nullable(),
        last_name: z.string().nullable(),
        date_of_birth: z.date().nullable(),
        start_date: z.date().nullable(),
        supervisor: z.string().nullable(),
        phone_number: z.string().nullable(),
        personal_email: z.string().nullable(),
        corporate_email: z.string().nullable()
    }).nullable().optional() });
// File: EmployeeGroupByResult.schema.ts
export const EmployeeGroupByResultSchema = z.array(z.object({
    uuid: z.string(),
    avatar: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    date_of_birth: z.date(),
    start_date: z.date(),
    supervisor: z.string(),
    phone_number: z.string(),
    personal_email: z.string(),
    corporate_email: z.string(),
    _count: z.object({
        uuid: z.number(),
        account: z.number(),
        avatar: z.number(),
        first_name: z.number(),
        last_name: z.number(),
        date_of_birth: z.number(),
        position: z.number(),
        department: z.number(),
        start_date: z.number(),
        supervisor: z.number(),
        phone_number: z.number(),
        personal_email: z.number(),
        corporate_email: z.number()
    }).optional(),
    _min: z.object({
        uuid: z.string().nullable(),
        avatar: z.string().nullable(),
        first_name: z.string().nullable(),
        last_name: z.string().nullable(),
        date_of_birth: z.date().nullable(),
        start_date: z.date().nullable(),
        supervisor: z.string().nullable(),
        phone_number: z.string().nullable(),
        personal_email: z.string().nullable(),
        corporate_email: z.string().nullable()
    }).nullable().optional(),
    _max: z.object({
        uuid: z.string().nullable(),
        avatar: z.string().nullable(),
        first_name: z.string().nullable(),
        last_name: z.string().nullable(),
        date_of_birth: z.date().nullable(),
        start_date: z.date().nullable(),
        supervisor: z.string().nullable(),
        phone_number: z.string().nullable(),
        personal_email: z.string().nullable(),
        corporate_email: z.string().nullable()
    }).nullable().optional()
}));
// File: EmployeeCountResult.schema.ts
export const EmployeeCountResultSchema = z.number();
// File: ContentFindUniqueResult.schema.ts
export const ContentFindUniqueResultSchema = z.nullable(z.object({
    uuid: z.string(),
    title: z.string(),
    url: z.string(),
    content_owner: z.string(),
    for_position: z.unknown(),
    last_modified_time: z.date(),
    expiration_time: z.date(),
    content_type: z.unknown(),
    status: z.unknown(),
    is_favorite: z.boolean()
}));
// File: ContentFindFirstResult.schema.ts
export const ContentFindFirstResultSchema = z.nullable(z.object({
    uuid: z.string(),
    title: z.string(),
    url: z.string(),
    content_owner: z.string(),
    for_position: z.unknown(),
    last_modified_time: z.date(),
    expiration_time: z.date(),
    content_type: z.unknown(),
    status: z.unknown(),
    is_favorite: z.boolean()
}));
// File: ContentFindManyResult.schema.ts
export const ContentFindManyResultSchema = z.object({
    data: z.array(z.object({
        uuid: z.string(),
        title: z.string(),
        url: z.string(),
        content_owner: z.string(),
        for_position: z.unknown(),
        last_modified_time: z.date(),
        expiration_time: z.date(),
        content_type: z.unknown(),
        status: z.unknown(),
        is_favorite: z.boolean()
    })),
    pagination: z.object({
        page: z.number().int().min(1),
        pageSize: z.number().int().min(1),
        total: z.number().int().min(0),
        totalPages: z.number().int().min(0),
        hasNext: z.boolean(),
        hasPrev: z.boolean()
    })
});
// File: ContentCreateResult.schema.ts
export const ContentCreateResultSchema = z.object({
    uuid: z.string(),
    title: z.string(),
    url: z.string(),
    content_owner: z.string(),
    for_position: z.unknown(),
    last_modified_time: z.date(),
    expiration_time: z.date(),
    content_type: z.unknown(),
    status: z.unknown(),
    is_favorite: z.boolean()
});
// File: ContentCreateManyResult.schema.ts
export const ContentCreateManyResultSchema = z.object({
    count: z.number()
});
// File: ContentUpdateResult.schema.ts
export const ContentUpdateResultSchema = z.nullable(z.object({
    uuid: z.string(),
    title: z.string(),
    url: z.string(),
    content_owner: z.string(),
    for_position: z.unknown(),
    last_modified_time: z.date(),
    expiration_time: z.date(),
    content_type: z.unknown(),
    status: z.unknown(),
    is_favorite: z.boolean()
}));
// File: ContentUpdateManyResult.schema.ts
export const ContentUpdateManyResultSchema = z.object({
    count: z.number()
});
// File: ContentUpsertResult.schema.ts
export const ContentUpsertResultSchema = z.object({
    uuid: z.string(),
    title: z.string(),
    url: z.string(),
    content_owner: z.string(),
    for_position: z.unknown(),
    last_modified_time: z.date(),
    expiration_time: z.date(),
    content_type: z.unknown(),
    status: z.unknown(),
    is_favorite: z.boolean()
});
// File: ContentDeleteResult.schema.ts
export const ContentDeleteResultSchema = z.nullable(z.object({
    uuid: z.string(),
    title: z.string(),
    url: z.string(),
    content_owner: z.string(),
    for_position: z.unknown(),
    last_modified_time: z.date(),
    expiration_time: z.date(),
    content_type: z.unknown(),
    status: z.unknown(),
    is_favorite: z.boolean()
}));
// File: ContentDeleteManyResult.schema.ts
export const ContentDeleteManyResultSchema = z.object({
    count: z.number()
});
// File: ContentAggregateResult.schema.ts
export const ContentAggregateResultSchema = z.object({ _count: z.object({
        uuid: z.number(),
        title: z.number(),
        url: z.number(),
        content_owner: z.number(),
        for_position: z.number(),
        last_modified_time: z.number(),
        expiration_time: z.number(),
        content_type: z.number(),
        status: z.number(),
        is_favorite: z.number()
    }).optional(),
    _min: z.object({
        uuid: z.string().nullable(),
        title: z.string().nullable(),
        url: z.string().nullable(),
        content_owner: z.string().nullable(),
        last_modified_time: z.date().nullable(),
        expiration_time: z.date().nullable()
    }).nullable().optional(),
    _max: z.object({
        uuid: z.string().nullable(),
        title: z.string().nullable(),
        url: z.string().nullable(),
        content_owner: z.string().nullable(),
        last_modified_time: z.date().nullable(),
        expiration_time: z.date().nullable()
    }).nullable().optional() });
// File: ContentGroupByResult.schema.ts
export const ContentGroupByResultSchema = z.array(z.object({
    uuid: z.string(),
    title: z.string(),
    url: z.string(),
    content_owner: z.string(),
    last_modified_time: z.date(),
    expiration_time: z.date(),
    is_favorite: z.boolean(),
    _count: z.object({
        uuid: z.number(),
        title: z.number(),
        url: z.number(),
        content_owner: z.number(),
        for_position: z.number(),
        last_modified_time: z.number(),
        expiration_time: z.number(),
        content_type: z.number(),
        status: z.number(),
        is_favorite: z.number()
    }).optional(),
    _min: z.object({
        uuid: z.string().nullable(),
        title: z.string().nullable(),
        url: z.string().nullable(),
        content_owner: z.string().nullable(),
        last_modified_time: z.date().nullable(),
        expiration_time: z.date().nullable()
    }).nullable().optional(),
    _max: z.object({
        uuid: z.string().nullable(),
        title: z.string().nullable(),
        url: z.string().nullable(),
        content_owner: z.string().nullable(),
        last_modified_time: z.date().nullable(),
        expiration_time: z.date().nullable()
    }).nullable().optional()
}));
// File: ContentCountResult.schema.ts
export const ContentCountResultSchema = z.number();
// File: AccountFindUniqueResult.schema.ts
export const AccountFindUniqueResultSchema = z.nullable(z.object({
    employee: z.unknown(),
    employeeUuid: z.string(),
    username: z.string(),
    password: z.string(),
    type: z.unknown()
}));
// File: AccountFindFirstResult.schema.ts
export const AccountFindFirstResultSchema = z.nullable(z.object({
    employee: z.unknown(),
    employeeUuid: z.string(),
    username: z.string(),
    password: z.string(),
    type: z.unknown()
}));
// File: AccountFindManyResult.schema.ts
export const AccountFindManyResultSchema = z.object({
    data: z.array(z.object({
        employee: z.unknown(),
        employeeUuid: z.string(),
        username: z.string(),
        password: z.string(),
        type: z.unknown()
    })),
    pagination: z.object({
        page: z.number().int().min(1),
        pageSize: z.number().int().min(1),
        total: z.number().int().min(0),
        totalPages: z.number().int().min(0),
        hasNext: z.boolean(),
        hasPrev: z.boolean()
    })
});
// File: AccountCreateResult.schema.ts
export const AccountCreateResultSchema = z.object({
    employee: z.unknown(),
    employeeUuid: z.string(),
    username: z.string(),
    password: z.string(),
    type: z.unknown()
});
// File: AccountCreateManyResult.schema.ts
export const AccountCreateManyResultSchema = z.object({
    count: z.number()
});
// File: AccountUpdateResult.schema.ts
export const AccountUpdateResultSchema = z.nullable(z.object({
    employee: z.unknown(),
    employeeUuid: z.string(),
    username: z.string(),
    password: z.string(),
    type: z.unknown()
}));
// File: AccountUpdateManyResult.schema.ts
export const AccountUpdateManyResultSchema = z.object({
    count: z.number()
});
// File: AccountUpsertResult.schema.ts
export const AccountUpsertResultSchema = z.object({
    employee: z.unknown(),
    employeeUuid: z.string(),
    username: z.string(),
    password: z.string(),
    type: z.unknown()
});
// File: AccountDeleteResult.schema.ts
export const AccountDeleteResultSchema = z.nullable(z.object({
    employee: z.unknown(),
    employeeUuid: z.string(),
    username: z.string(),
    password: z.string(),
    type: z.unknown()
}));
// File: AccountDeleteManyResult.schema.ts
export const AccountDeleteManyResultSchema = z.object({
    count: z.number()
});
// File: AccountAggregateResult.schema.ts
export const AccountAggregateResultSchema = z.object({ _count: z.object({
        employee: z.number(),
        employeeUuid: z.number(),
        username: z.number(),
        password: z.number(),
        type: z.number()
    }).optional(),
    _min: z.object({
        employeeUuid: z.string().nullable(),
        username: z.string().nullable(),
        password: z.string().nullable()
    }).nullable().optional(),
    _max: z.object({
        employeeUuid: z.string().nullable(),
        username: z.string().nullable(),
        password: z.string().nullable()
    }).nullable().optional() });
// File: AccountGroupByResult.schema.ts
export const AccountGroupByResultSchema = z.array(z.object({
    employeeUuid: z.string(),
    username: z.string(),
    password: z.string(),
    _count: z.object({
        employee: z.number(),
        employeeUuid: z.number(),
        username: z.number(),
        password: z.number(),
        type: z.number()
    }).optional(),
    _min: z.object({
        employeeUuid: z.string().nullable(),
        username: z.string().nullable(),
        password: z.string().nullable()
    }).nullable().optional(),
    _max: z.object({
        employeeUuid: z.string().nullable(),
        username: z.string().nullable(),
        password: z.string().nullable()
    }).nullable().optional()
}));
// File: AccountCountResult.schema.ts
export const AccountCountResultSchema = z.number();
// File: index.ts
// File: index.ts
