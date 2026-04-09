/**
 * Prisma Zod Generator - Single File (inlined)
 * Auto-generated. Do not edit.
 */

import * as z from 'zod';
import type { Prisma } from '../../db/generated/prisma/client';
// File: TransactionIsolationLevel.schema.ts

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted', 'ReadCommitted', 'RepeatableRead', 'Serializable'])

export type TransactionIsolationLevel = z.infer<typeof TransactionIsolationLevelSchema>;

// File: EmployeeScalarFieldEnum.schema.ts

export const EmployeeScalarFieldEnumSchema = z.enum(['uuid', 'first_name', 'last_name', 'date_of_birth', 'position', 'department', 'start_date', 'supervisor', 'phone_number', 'personal_email', 'corporate_email'])

export type EmployeeScalarFieldEnum = z.infer<typeof EmployeeScalarFieldEnumSchema>;

// File: ContentScalarFieldEnum.schema.ts

export const ContentScalarFieldEnumSchema = z.enum(['uuid', 'title', 'url', 'content_owner', 'for_position', 'last_modified_time', 'expiration_time', 'content_type', 'status'])

export type ContentScalarFieldEnum = z.infer<typeof ContentScalarFieldEnumSchema>;

// File: AccountScalarFieldEnum.schema.ts

export const AccountScalarFieldEnumSchema = z.enum(['employeeUuid', 'username', 'password', 'type'])

export type AccountScalarFieldEnum = z.infer<typeof AccountScalarFieldEnumSchema>;

// File: SortOrder.schema.ts

export const SortOrderSchema = z.enum(['asc', 'desc'])

export type SortOrder = z.infer<typeof SortOrderSchema>;

// File: QueryMode.schema.ts

export const QueryModeSchema = z.enum(['default', 'insensitive'])

export type QueryMode = z.infer<typeof QueryModeSchema>;

// File: Position.schema.ts

export const PositionSchema = z.enum(['UNDERWRITER', 'BUSINESS_ANALYST', 'ADMIN'])

export type Position = z.infer<typeof PositionSchema>;

// File: Department.schema.ts

export const DepartmentSchema = z.enum(['OPERATION_TECHNOLOGY', 'ACCOUNTING'])

export type Department = z.infer<typeof DepartmentSchema>;

// File: ContentType.schema.ts

export const ContentTypeSchema = z.enum(['REFERENCE', 'WORKFLOW'])

export type ContentType = z.infer<typeof ContentTypeSchema>;

// File: ContentStatus.schema.ts

export const ContentStatusSchema = z.enum(['AVAILABLE', 'IN_USE', 'UNAVAILABLE'])

export type ContentStatus = z.infer<typeof ContentStatusSchema>;

// File: AccountType.schema.ts

export const AccountTypeSchema = z.enum(['ADMIN', 'EMPLOYEE'])

export type AccountType = z.infer<typeof AccountTypeSchema>;

// File: EmployeeWhereInput.schema.ts

const employeewhereinputSchema = z.object({
  AND: z.union([z.lazy(() => EmployeeWhereInputObjectSchema), z.lazy(() => EmployeeWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => EmployeeWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => EmployeeWhereInputObjectSchema), z.lazy(() => EmployeeWhereInputObjectSchema).array()]).optional(),
  uuid: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
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
export const EmployeeWhereInputObjectSchema: z.ZodType<Prisma.EmployeeWhereInput> = employeewhereinputSchema as unknown as z.ZodType<Prisma.EmployeeWhereInput>;
export const EmployeeWhereInputObjectZodSchema = employeewhereinputSchema;


// File: EmployeeOrderByWithRelationInput.schema.ts
const __makeSchema_EmployeeOrderByWithRelationInput_schema = () => z.object({
  uuid: SortOrderSchema.optional(),
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
export const EmployeeOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.EmployeeOrderByWithRelationInput> = __makeSchema_EmployeeOrderByWithRelationInput_schema() as unknown as z.ZodType<Prisma.EmployeeOrderByWithRelationInput>;
export const EmployeeOrderByWithRelationInputObjectZodSchema = __makeSchema_EmployeeOrderByWithRelationInput_schema();


// File: EmployeeWhereUniqueInput.schema.ts
const __makeSchema_EmployeeWhereUniqueInput_schema = () => z.object({
  uuid: z.string().optional()
}).strict();
export const EmployeeWhereUniqueInputObjectSchema: z.ZodType<Prisma.EmployeeWhereUniqueInput> = __makeSchema_EmployeeWhereUniqueInput_schema() as unknown as z.ZodType<Prisma.EmployeeWhereUniqueInput>;
export const EmployeeWhereUniqueInputObjectZodSchema = __makeSchema_EmployeeWhereUniqueInput_schema();


// File: EmployeeOrderByWithAggregationInput.schema.ts
const __makeSchema_EmployeeOrderByWithAggregationInput_schema = () => z.object({
  uuid: SortOrderSchema.optional(),
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
export const EmployeeOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.EmployeeOrderByWithAggregationInput> = __makeSchema_EmployeeOrderByWithAggregationInput_schema() as unknown as z.ZodType<Prisma.EmployeeOrderByWithAggregationInput>;
export const EmployeeOrderByWithAggregationInputObjectZodSchema = __makeSchema_EmployeeOrderByWithAggregationInput_schema();


// File: EmployeeScalarWhereWithAggregatesInput.schema.ts

const employeescalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => EmployeeScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => EmployeeScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => EmployeeScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => EmployeeScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => EmployeeScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  uuid: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
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
export const EmployeeScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.EmployeeScalarWhereWithAggregatesInput> = employeescalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.EmployeeScalarWhereWithAggregatesInput>;
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
  status: z.union([z.lazy(() => EnumContentStatusFilterObjectSchema), ContentStatusSchema]).optional()
}).strict();
export const ContentWhereInputObjectSchema: z.ZodType<Prisma.ContentWhereInput> = contentwhereinputSchema as unknown as z.ZodType<Prisma.ContentWhereInput>;
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
  status: SortOrderSchema.optional()
}).strict();
export const ContentOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.ContentOrderByWithRelationInput> = __makeSchema_ContentOrderByWithRelationInput_schema() as unknown as z.ZodType<Prisma.ContentOrderByWithRelationInput>;
export const ContentOrderByWithRelationInputObjectZodSchema = __makeSchema_ContentOrderByWithRelationInput_schema();


// File: ContentWhereUniqueInput.schema.ts
const __makeSchema_ContentWhereUniqueInput_schema = () => z.object({
  uuid: z.string().optional()
}).strict();
export const ContentWhereUniqueInputObjectSchema: z.ZodType<Prisma.ContentWhereUniqueInput> = __makeSchema_ContentWhereUniqueInput_schema() as unknown as z.ZodType<Prisma.ContentWhereUniqueInput>;
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
  _count: z.lazy(() => ContentCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => ContentMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => ContentMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const ContentOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.ContentOrderByWithAggregationInput> = __makeSchema_ContentOrderByWithAggregationInput_schema() as unknown as z.ZodType<Prisma.ContentOrderByWithAggregationInput>;
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
  status: z.union([z.lazy(() => EnumContentStatusWithAggregatesFilterObjectSchema), ContentStatusSchema]).optional()
}).strict();
export const ContentScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.ContentScalarWhereWithAggregatesInput> = contentscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.ContentScalarWhereWithAggregatesInput>;
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
export const AccountWhereInputObjectSchema: z.ZodType<Prisma.AccountWhereInput> = accountwhereinputSchema as unknown as z.ZodType<Prisma.AccountWhereInput>;
export const AccountWhereInputObjectZodSchema = accountwhereinputSchema;


// File: AccountOrderByWithRelationInput.schema.ts
const __makeSchema_AccountOrderByWithRelationInput_schema = () => z.object({
  employeeUuid: SortOrderSchema.optional(),
  username: SortOrderSchema.optional(),
  password: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  employee: z.lazy(() => EmployeeOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const AccountOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.AccountOrderByWithRelationInput> = __makeSchema_AccountOrderByWithRelationInput_schema() as unknown as z.ZodType<Prisma.AccountOrderByWithRelationInput>;
export const AccountOrderByWithRelationInputObjectZodSchema = __makeSchema_AccountOrderByWithRelationInput_schema();


// File: AccountWhereUniqueInput.schema.ts
const __makeSchema_AccountWhereUniqueInput_schema = () => z.object({
  employeeUuid: z.string().optional(),
  username: z.string().optional()
}).strict();
export const AccountWhereUniqueInputObjectSchema: z.ZodType<Prisma.AccountWhereUniqueInput> = __makeSchema_AccountWhereUniqueInput_schema() as unknown as z.ZodType<Prisma.AccountWhereUniqueInput>;
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
export const AccountOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.AccountOrderByWithAggregationInput> = __makeSchema_AccountOrderByWithAggregationInput_schema() as unknown as z.ZodType<Prisma.AccountOrderByWithAggregationInput>;
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
export const AccountScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.AccountScalarWhereWithAggregatesInput> = accountscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.AccountScalarWhereWithAggregatesInput>;
export const AccountScalarWhereWithAggregatesInputObjectZodSchema = accountscalarwherewithaggregatesinputSchema;


// File: EmployeeCreateInput.schema.ts
const __makeSchema_EmployeeCreateInput_schema = () => z.object({
  uuid: z.string().optional(),
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
export const EmployeeCreateInputObjectSchema: z.ZodType<Prisma.EmployeeCreateInput> = __makeSchema_EmployeeCreateInput_schema() as unknown as z.ZodType<Prisma.EmployeeCreateInput>;
export const EmployeeCreateInputObjectZodSchema = __makeSchema_EmployeeCreateInput_schema();


// File: EmployeeUncheckedCreateInput.schema.ts
const __makeSchema_EmployeeUncheckedCreateInput_schema = () => z.object({
  uuid: z.string().optional(),
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
export const EmployeeUncheckedCreateInputObjectSchema: z.ZodType<Prisma.EmployeeUncheckedCreateInput> = __makeSchema_EmployeeUncheckedCreateInput_schema() as unknown as z.ZodType<Prisma.EmployeeUncheckedCreateInput>;
export const EmployeeUncheckedCreateInputObjectZodSchema = __makeSchema_EmployeeUncheckedCreateInput_schema();


// File: EmployeeUpdateInput.schema.ts
const __makeSchema_EmployeeUpdateInput_schema = () => z.object({
  uuid: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
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
export const EmployeeUpdateInputObjectSchema: z.ZodType<Prisma.EmployeeUpdateInput> = __makeSchema_EmployeeUpdateInput_schema() as unknown as z.ZodType<Prisma.EmployeeUpdateInput>;
export const EmployeeUpdateInputObjectZodSchema = __makeSchema_EmployeeUpdateInput_schema();


// File: EmployeeUncheckedUpdateInput.schema.ts
const __makeSchema_EmployeeUncheckedUpdateInput_schema = () => z.object({
  uuid: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
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
export const EmployeeUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.EmployeeUncheckedUpdateInput> = __makeSchema_EmployeeUncheckedUpdateInput_schema() as unknown as z.ZodType<Prisma.EmployeeUncheckedUpdateInput>;
export const EmployeeUncheckedUpdateInputObjectZodSchema = __makeSchema_EmployeeUncheckedUpdateInput_schema();


// File: EmployeeCreateManyInput.schema.ts
const __makeSchema_EmployeeCreateManyInput_schema = () => z.object({
  uuid: z.string().optional(),
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
export const EmployeeCreateManyInputObjectSchema: z.ZodType<Prisma.EmployeeCreateManyInput> = __makeSchema_EmployeeCreateManyInput_schema() as unknown as z.ZodType<Prisma.EmployeeCreateManyInput>;
export const EmployeeCreateManyInputObjectZodSchema = __makeSchema_EmployeeCreateManyInput_schema();


// File: EmployeeUpdateManyMutationInput.schema.ts
const __makeSchema_EmployeeUpdateManyMutationInput_schema = () => z.object({
  uuid: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
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
export const EmployeeUpdateManyMutationInputObjectSchema: z.ZodType<Prisma.EmployeeUpdateManyMutationInput> = __makeSchema_EmployeeUpdateManyMutationInput_schema() as unknown as z.ZodType<Prisma.EmployeeUpdateManyMutationInput>;
export const EmployeeUpdateManyMutationInputObjectZodSchema = __makeSchema_EmployeeUpdateManyMutationInput_schema();


// File: EmployeeUncheckedUpdateManyInput.schema.ts
const __makeSchema_EmployeeUncheckedUpdateManyInput_schema = () => z.object({
  uuid: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
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
export const EmployeeUncheckedUpdateManyInputObjectSchema: z.ZodType<Prisma.EmployeeUncheckedUpdateManyInput> = __makeSchema_EmployeeUncheckedUpdateManyInput_schema() as unknown as z.ZodType<Prisma.EmployeeUncheckedUpdateManyInput>;
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
  status: ContentStatusSchema
}).strict();
export const ContentCreateInputObjectSchema: z.ZodType<Prisma.ContentCreateInput> = __makeSchema_ContentCreateInput_schema() as unknown as z.ZodType<Prisma.ContentCreateInput>;
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
  status: ContentStatusSchema
}).strict();
export const ContentUncheckedCreateInputObjectSchema: z.ZodType<Prisma.ContentUncheckedCreateInput> = __makeSchema_ContentUncheckedCreateInput_schema() as unknown as z.ZodType<Prisma.ContentUncheckedCreateInput>;
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
  status: z.union([ContentStatusSchema, z.lazy(() => EnumContentStatusFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const ContentUpdateInputObjectSchema: z.ZodType<Prisma.ContentUpdateInput> = __makeSchema_ContentUpdateInput_schema() as unknown as z.ZodType<Prisma.ContentUpdateInput>;
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
  status: z.union([ContentStatusSchema, z.lazy(() => EnumContentStatusFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const ContentUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.ContentUncheckedUpdateInput> = __makeSchema_ContentUncheckedUpdateInput_schema() as unknown as z.ZodType<Prisma.ContentUncheckedUpdateInput>;
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
  status: ContentStatusSchema
}).strict();
export const ContentCreateManyInputObjectSchema: z.ZodType<Prisma.ContentCreateManyInput> = __makeSchema_ContentCreateManyInput_schema() as unknown as z.ZodType<Prisma.ContentCreateManyInput>;
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
  status: z.union([ContentStatusSchema, z.lazy(() => EnumContentStatusFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const ContentUpdateManyMutationInputObjectSchema: z.ZodType<Prisma.ContentUpdateManyMutationInput> = __makeSchema_ContentUpdateManyMutationInput_schema() as unknown as z.ZodType<Prisma.ContentUpdateManyMutationInput>;
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
  status: z.union([ContentStatusSchema, z.lazy(() => EnumContentStatusFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const ContentUncheckedUpdateManyInputObjectSchema: z.ZodType<Prisma.ContentUncheckedUpdateManyInput> = __makeSchema_ContentUncheckedUpdateManyInput_schema() as unknown as z.ZodType<Prisma.ContentUncheckedUpdateManyInput>;
export const ContentUncheckedUpdateManyInputObjectZodSchema = __makeSchema_ContentUncheckedUpdateManyInput_schema();


// File: AccountCreateInput.schema.ts
const __makeSchema_AccountCreateInput_schema = () => z.object({
  username: z.string(),
  password: z.string(),
  type: AccountTypeSchema,
  employee: z.lazy(() => EmployeeCreateNestedOneWithoutAccountInputObjectSchema)
}).strict();
export const AccountCreateInputObjectSchema: z.ZodType<Prisma.AccountCreateInput> = __makeSchema_AccountCreateInput_schema() as unknown as z.ZodType<Prisma.AccountCreateInput>;
export const AccountCreateInputObjectZodSchema = __makeSchema_AccountCreateInput_schema();


// File: AccountUncheckedCreateInput.schema.ts
const __makeSchema_AccountUncheckedCreateInput_schema = () => z.object({
  employeeUuid: z.string(),
  username: z.string(),
  password: z.string(),
  type: AccountTypeSchema
}).strict();
export const AccountUncheckedCreateInputObjectSchema: z.ZodType<Prisma.AccountUncheckedCreateInput> = __makeSchema_AccountUncheckedCreateInput_schema() as unknown as z.ZodType<Prisma.AccountUncheckedCreateInput>;
export const AccountUncheckedCreateInputObjectZodSchema = __makeSchema_AccountUncheckedCreateInput_schema();


// File: AccountUpdateInput.schema.ts
const __makeSchema_AccountUpdateInput_schema = () => z.object({
  username: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  password: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  type: z.union([AccountTypeSchema, z.lazy(() => EnumAccountTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  employee: z.lazy(() => EmployeeUpdateOneRequiredWithoutAccountNestedInputObjectSchema).optional()
}).strict();
export const AccountUpdateInputObjectSchema: z.ZodType<Prisma.AccountUpdateInput> = __makeSchema_AccountUpdateInput_schema() as unknown as z.ZodType<Prisma.AccountUpdateInput>;
export const AccountUpdateInputObjectZodSchema = __makeSchema_AccountUpdateInput_schema();


// File: AccountUncheckedUpdateInput.schema.ts
const __makeSchema_AccountUncheckedUpdateInput_schema = () => z.object({
  employeeUuid: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  username: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  password: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  type: z.union([AccountTypeSchema, z.lazy(() => EnumAccountTypeFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const AccountUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.AccountUncheckedUpdateInput> = __makeSchema_AccountUncheckedUpdateInput_schema() as unknown as z.ZodType<Prisma.AccountUncheckedUpdateInput>;
export const AccountUncheckedUpdateInputObjectZodSchema = __makeSchema_AccountUncheckedUpdateInput_schema();


// File: AccountCreateManyInput.schema.ts
const __makeSchema_AccountCreateManyInput_schema = () => z.object({
  employeeUuid: z.string(),
  username: z.string(),
  password: z.string(),
  type: AccountTypeSchema
}).strict();
export const AccountCreateManyInputObjectSchema: z.ZodType<Prisma.AccountCreateManyInput> = __makeSchema_AccountCreateManyInput_schema() as unknown as z.ZodType<Prisma.AccountCreateManyInput>;
export const AccountCreateManyInputObjectZodSchema = __makeSchema_AccountCreateManyInput_schema();


// File: AccountUpdateManyMutationInput.schema.ts
const __makeSchema_AccountUpdateManyMutationInput_schema = () => z.object({
  username: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  password: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  type: z.union([AccountTypeSchema, z.lazy(() => EnumAccountTypeFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const AccountUpdateManyMutationInputObjectSchema: z.ZodType<Prisma.AccountUpdateManyMutationInput> = __makeSchema_AccountUpdateManyMutationInput_schema() as unknown as z.ZodType<Prisma.AccountUpdateManyMutationInput>;
export const AccountUpdateManyMutationInputObjectZodSchema = __makeSchema_AccountUpdateManyMutationInput_schema();


// File: AccountUncheckedUpdateManyInput.schema.ts
const __makeSchema_AccountUncheckedUpdateManyInput_schema = () => z.object({
  employeeUuid: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  username: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  password: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  type: z.union([AccountTypeSchema, z.lazy(() => EnumAccountTypeFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const AccountUncheckedUpdateManyInputObjectSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyInput> = __makeSchema_AccountUncheckedUpdateManyInput_schema() as unknown as z.ZodType<Prisma.AccountUncheckedUpdateManyInput>;
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
export const UuidFilterObjectSchema: z.ZodType<Prisma.UuidFilter> = __makeSchema_UuidFilter_schema() as unknown as z.ZodType<Prisma.UuidFilter>;
export const UuidFilterObjectZodSchema = __makeSchema_UuidFilter_schema();


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
export const StringFilterObjectSchema: z.ZodType<Prisma.StringFilter> = __makeSchema_StringFilter_schema() as unknown as z.ZodType<Prisma.StringFilter>;
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
export const DateTimeFilterObjectSchema: z.ZodType<Prisma.DateTimeFilter> = __makeSchema_DateTimeFilter_schema() as unknown as z.ZodType<Prisma.DateTimeFilter>;
export const DateTimeFilterObjectZodSchema = __makeSchema_DateTimeFilter_schema();


// File: EnumPositionFilter.schema.ts
const __makeSchema_EnumPositionFilter_schema = () => z.object({
  equals: PositionSchema.optional(),
  in: PositionSchema.array().optional(),
  notIn: PositionSchema.array().optional(),
  not: z.union([PositionSchema, z.lazy(() => NestedEnumPositionFilterObjectSchema)]).optional()
}).strict();
export const EnumPositionFilterObjectSchema: z.ZodType<Prisma.EnumPositionFilter> = __makeSchema_EnumPositionFilter_schema() as unknown as z.ZodType<Prisma.EnumPositionFilter>;
export const EnumPositionFilterObjectZodSchema = __makeSchema_EnumPositionFilter_schema();


// File: EnumDepartmentFilter.schema.ts
const __makeSchema_EnumDepartmentFilter_schema = () => z.object({
  equals: DepartmentSchema.optional(),
  in: DepartmentSchema.array().optional(),
  notIn: DepartmentSchema.array().optional(),
  not: z.union([DepartmentSchema, z.lazy(() => NestedEnumDepartmentFilterObjectSchema)]).optional()
}).strict();
export const EnumDepartmentFilterObjectSchema: z.ZodType<Prisma.EnumDepartmentFilter> = __makeSchema_EnumDepartmentFilter_schema() as unknown as z.ZodType<Prisma.EnumDepartmentFilter>;
export const EnumDepartmentFilterObjectZodSchema = __makeSchema_EnumDepartmentFilter_schema();


// File: AccountNullableScalarRelationFilter.schema.ts
const __makeSchema_AccountNullableScalarRelationFilter_schema = () => z.object({
  is: z.lazy(() => AccountWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => AccountWhereInputObjectSchema).optional().nullable()
}).strict();
export const AccountNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.AccountNullableScalarRelationFilter> = __makeSchema_AccountNullableScalarRelationFilter_schema() as unknown as z.ZodType<Prisma.AccountNullableScalarRelationFilter>;
export const AccountNullableScalarRelationFilterObjectZodSchema = __makeSchema_AccountNullableScalarRelationFilter_schema();


// File: EmployeeCountOrderByAggregateInput.schema.ts
const __makeSchema_EmployeeCountOrderByAggregateInput_schema = () => z.object({
  uuid: SortOrderSchema.optional(),
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
export const EmployeeCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.EmployeeCountOrderByAggregateInput> = __makeSchema_EmployeeCountOrderByAggregateInput_schema() as unknown as z.ZodType<Prisma.EmployeeCountOrderByAggregateInput>;
export const EmployeeCountOrderByAggregateInputObjectZodSchema = __makeSchema_EmployeeCountOrderByAggregateInput_schema();


// File: EmployeeMaxOrderByAggregateInput.schema.ts
const __makeSchema_EmployeeMaxOrderByAggregateInput_schema = () => z.object({
  uuid: SortOrderSchema.optional(),
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
export const EmployeeMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.EmployeeMaxOrderByAggregateInput> = __makeSchema_EmployeeMaxOrderByAggregateInput_schema() as unknown as z.ZodType<Prisma.EmployeeMaxOrderByAggregateInput>;
export const EmployeeMaxOrderByAggregateInputObjectZodSchema = __makeSchema_EmployeeMaxOrderByAggregateInput_schema();


// File: EmployeeMinOrderByAggregateInput.schema.ts
const __makeSchema_EmployeeMinOrderByAggregateInput_schema = () => z.object({
  uuid: SortOrderSchema.optional(),
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
export const EmployeeMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.EmployeeMinOrderByAggregateInput> = __makeSchema_EmployeeMinOrderByAggregateInput_schema() as unknown as z.ZodType<Prisma.EmployeeMinOrderByAggregateInput>;
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
export const UuidWithAggregatesFilterObjectSchema: z.ZodType<Prisma.UuidWithAggregatesFilter> = __makeSchema_UuidWithAggregatesFilter_schema() as unknown as z.ZodType<Prisma.UuidWithAggregatesFilter>;
export const UuidWithAggregatesFilterObjectZodSchema = __makeSchema_UuidWithAggregatesFilter_schema();


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
export const StringWithAggregatesFilterObjectSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = __makeSchema_StringWithAggregatesFilter_schema() as unknown as z.ZodType<Prisma.StringWithAggregatesFilter>;
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
export const DateTimeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = __makeSchema_DateTimeWithAggregatesFilter_schema() as unknown as z.ZodType<Prisma.DateTimeWithAggregatesFilter>;
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
export const EnumPositionWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumPositionWithAggregatesFilter> = __makeSchema_EnumPositionWithAggregatesFilter_schema() as unknown as z.ZodType<Prisma.EnumPositionWithAggregatesFilter>;
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
export const EnumDepartmentWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumDepartmentWithAggregatesFilter> = __makeSchema_EnumDepartmentWithAggregatesFilter_schema() as unknown as z.ZodType<Prisma.EnumDepartmentWithAggregatesFilter>;
export const EnumDepartmentWithAggregatesFilterObjectZodSchema = __makeSchema_EnumDepartmentWithAggregatesFilter_schema();


// File: EnumContentTypeFilter.schema.ts
const __makeSchema_EnumContentTypeFilter_schema = () => z.object({
  equals: ContentTypeSchema.optional(),
  in: ContentTypeSchema.array().optional(),
  notIn: ContentTypeSchema.array().optional(),
  not: z.union([ContentTypeSchema, z.lazy(() => NestedEnumContentTypeFilterObjectSchema)]).optional()
}).strict();
export const EnumContentTypeFilterObjectSchema: z.ZodType<Prisma.EnumContentTypeFilter> = __makeSchema_EnumContentTypeFilter_schema() as unknown as z.ZodType<Prisma.EnumContentTypeFilter>;
export const EnumContentTypeFilterObjectZodSchema = __makeSchema_EnumContentTypeFilter_schema();


// File: EnumContentStatusFilter.schema.ts
const __makeSchema_EnumContentStatusFilter_schema = () => z.object({
  equals: ContentStatusSchema.optional(),
  in: ContentStatusSchema.array().optional(),
  notIn: ContentStatusSchema.array().optional(),
  not: z.union([ContentStatusSchema, z.lazy(() => NestedEnumContentStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumContentStatusFilterObjectSchema: z.ZodType<Prisma.EnumContentStatusFilter> = __makeSchema_EnumContentStatusFilter_schema() as unknown as z.ZodType<Prisma.EnumContentStatusFilter>;
export const EnumContentStatusFilterObjectZodSchema = __makeSchema_EnumContentStatusFilter_schema();


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
  status: SortOrderSchema.optional()
}).strict();
export const ContentCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ContentCountOrderByAggregateInput> = __makeSchema_ContentCountOrderByAggregateInput_schema() as unknown as z.ZodType<Prisma.ContentCountOrderByAggregateInput>;
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
  status: SortOrderSchema.optional()
}).strict();
export const ContentMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ContentMaxOrderByAggregateInput> = __makeSchema_ContentMaxOrderByAggregateInput_schema() as unknown as z.ZodType<Prisma.ContentMaxOrderByAggregateInput>;
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
  status: SortOrderSchema.optional()
}).strict();
export const ContentMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ContentMinOrderByAggregateInput> = __makeSchema_ContentMinOrderByAggregateInput_schema() as unknown as z.ZodType<Prisma.ContentMinOrderByAggregateInput>;
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
export const EnumContentTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumContentTypeWithAggregatesFilter> = __makeSchema_EnumContentTypeWithAggregatesFilter_schema() as unknown as z.ZodType<Prisma.EnumContentTypeWithAggregatesFilter>;
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
export const EnumContentStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumContentStatusWithAggregatesFilter> = __makeSchema_EnumContentStatusWithAggregatesFilter_schema() as unknown as z.ZodType<Prisma.EnumContentStatusWithAggregatesFilter>;
export const EnumContentStatusWithAggregatesFilterObjectZodSchema = __makeSchema_EnumContentStatusWithAggregatesFilter_schema();


// File: EnumAccountTypeFilter.schema.ts
const __makeSchema_EnumAccountTypeFilter_schema = () => z.object({
  equals: AccountTypeSchema.optional(),
  in: AccountTypeSchema.array().optional(),
  notIn: AccountTypeSchema.array().optional(),
  not: z.union([AccountTypeSchema, z.lazy(() => NestedEnumAccountTypeFilterObjectSchema)]).optional()
}).strict();
export const EnumAccountTypeFilterObjectSchema: z.ZodType<Prisma.EnumAccountTypeFilter> = __makeSchema_EnumAccountTypeFilter_schema() as unknown as z.ZodType<Prisma.EnumAccountTypeFilter>;
export const EnumAccountTypeFilterObjectZodSchema = __makeSchema_EnumAccountTypeFilter_schema();


// File: EmployeeScalarRelationFilter.schema.ts
const __makeSchema_EmployeeScalarRelationFilter_schema = () => z.object({
  is: z.lazy(() => EmployeeWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => EmployeeWhereInputObjectSchema).optional()
}).strict();
export const EmployeeScalarRelationFilterObjectSchema: z.ZodType<Prisma.EmployeeScalarRelationFilter> = __makeSchema_EmployeeScalarRelationFilter_schema() as unknown as z.ZodType<Prisma.EmployeeScalarRelationFilter>;
export const EmployeeScalarRelationFilterObjectZodSchema = __makeSchema_EmployeeScalarRelationFilter_schema();


// File: AccountCountOrderByAggregateInput.schema.ts
const __makeSchema_AccountCountOrderByAggregateInput_schema = () => z.object({
  employeeUuid: SortOrderSchema.optional(),
  username: SortOrderSchema.optional(),
  password: SortOrderSchema.optional(),
  type: SortOrderSchema.optional()
}).strict();
export const AccountCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.AccountCountOrderByAggregateInput> = __makeSchema_AccountCountOrderByAggregateInput_schema() as unknown as z.ZodType<Prisma.AccountCountOrderByAggregateInput>;
export const AccountCountOrderByAggregateInputObjectZodSchema = __makeSchema_AccountCountOrderByAggregateInput_schema();


// File: AccountMaxOrderByAggregateInput.schema.ts
const __makeSchema_AccountMaxOrderByAggregateInput_schema = () => z.object({
  employeeUuid: SortOrderSchema.optional(),
  username: SortOrderSchema.optional(),
  password: SortOrderSchema.optional(),
  type: SortOrderSchema.optional()
}).strict();
export const AccountMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.AccountMaxOrderByAggregateInput> = __makeSchema_AccountMaxOrderByAggregateInput_schema() as unknown as z.ZodType<Prisma.AccountMaxOrderByAggregateInput>;
export const AccountMaxOrderByAggregateInputObjectZodSchema = __makeSchema_AccountMaxOrderByAggregateInput_schema();


// File: AccountMinOrderByAggregateInput.schema.ts
const __makeSchema_AccountMinOrderByAggregateInput_schema = () => z.object({
  employeeUuid: SortOrderSchema.optional(),
  username: SortOrderSchema.optional(),
  password: SortOrderSchema.optional(),
  type: SortOrderSchema.optional()
}).strict();
export const AccountMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.AccountMinOrderByAggregateInput> = __makeSchema_AccountMinOrderByAggregateInput_schema() as unknown as z.ZodType<Prisma.AccountMinOrderByAggregateInput>;
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
export const EnumAccountTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumAccountTypeWithAggregatesFilter> = __makeSchema_EnumAccountTypeWithAggregatesFilter_schema() as unknown as z.ZodType<Prisma.EnumAccountTypeWithAggregatesFilter>;
export const EnumAccountTypeWithAggregatesFilterObjectZodSchema = __makeSchema_EnumAccountTypeWithAggregatesFilter_schema();


// File: AccountCreateNestedOneWithoutEmployeeInput.schema.ts
const __makeSchema_AccountCreateNestedOneWithoutEmployeeInput_schema = () => z.object({
  create: z.union([z.lazy(() => AccountCreateWithoutEmployeeInputObjectSchema), z.lazy(() => AccountUncheckedCreateWithoutEmployeeInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AccountCreateOrConnectWithoutEmployeeInputObjectSchema).optional(),
  connect: z.lazy(() => AccountWhereUniqueInputObjectSchema).optional()
}).strict();
export const AccountCreateNestedOneWithoutEmployeeInputObjectSchema: z.ZodType<Prisma.AccountCreateNestedOneWithoutEmployeeInput> = __makeSchema_AccountCreateNestedOneWithoutEmployeeInput_schema() as unknown as z.ZodType<Prisma.AccountCreateNestedOneWithoutEmployeeInput>;
export const AccountCreateNestedOneWithoutEmployeeInputObjectZodSchema = __makeSchema_AccountCreateNestedOneWithoutEmployeeInput_schema();


// File: AccountUncheckedCreateNestedOneWithoutEmployeeInput.schema.ts
const __makeSchema_AccountUncheckedCreateNestedOneWithoutEmployeeInput_schema = () => z.object({
  create: z.union([z.lazy(() => AccountCreateWithoutEmployeeInputObjectSchema), z.lazy(() => AccountUncheckedCreateWithoutEmployeeInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AccountCreateOrConnectWithoutEmployeeInputObjectSchema).optional(),
  connect: z.lazy(() => AccountWhereUniqueInputObjectSchema).optional()
}).strict();
export const AccountUncheckedCreateNestedOneWithoutEmployeeInputObjectSchema: z.ZodType<Prisma.AccountUncheckedCreateNestedOneWithoutEmployeeInput> = __makeSchema_AccountUncheckedCreateNestedOneWithoutEmployeeInput_schema() as unknown as z.ZodType<Prisma.AccountUncheckedCreateNestedOneWithoutEmployeeInput>;
export const AccountUncheckedCreateNestedOneWithoutEmployeeInputObjectZodSchema = __makeSchema_AccountUncheckedCreateNestedOneWithoutEmployeeInput_schema();


// File: StringFieldUpdateOperationsInput.schema.ts
const __makeSchema_StringFieldUpdateOperationsInput_schema = () => z.object({
  set: z.string().optional()
}).strict();
export const StringFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = __makeSchema_StringFieldUpdateOperationsInput_schema() as unknown as z.ZodType<Prisma.StringFieldUpdateOperationsInput>;
export const StringFieldUpdateOperationsInputObjectZodSchema = __makeSchema_StringFieldUpdateOperationsInput_schema();


// File: DateTimeFieldUpdateOperationsInput.schema.ts
const __makeSchema_DateTimeFieldUpdateOperationsInput_schema = () => z.object({
  set: z.coerce.date().optional()
}).strict();
export const DateTimeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = __makeSchema_DateTimeFieldUpdateOperationsInput_schema() as unknown as z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput>;
export const DateTimeFieldUpdateOperationsInputObjectZodSchema = __makeSchema_DateTimeFieldUpdateOperationsInput_schema();


// File: EnumPositionFieldUpdateOperationsInput.schema.ts
const __makeSchema_EnumPositionFieldUpdateOperationsInput_schema = () => z.object({
  set: PositionSchema.optional()
}).strict();
export const EnumPositionFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumPositionFieldUpdateOperationsInput> = __makeSchema_EnumPositionFieldUpdateOperationsInput_schema() as unknown as z.ZodType<Prisma.EnumPositionFieldUpdateOperationsInput>;
export const EnumPositionFieldUpdateOperationsInputObjectZodSchema = __makeSchema_EnumPositionFieldUpdateOperationsInput_schema();


// File: EnumDepartmentFieldUpdateOperationsInput.schema.ts
const __makeSchema_EnumDepartmentFieldUpdateOperationsInput_schema = () => z.object({
  set: DepartmentSchema.optional()
}).strict();
export const EnumDepartmentFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumDepartmentFieldUpdateOperationsInput> = __makeSchema_EnumDepartmentFieldUpdateOperationsInput_schema() as unknown as z.ZodType<Prisma.EnumDepartmentFieldUpdateOperationsInput>;
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
export const AccountUpdateOneWithoutEmployeeNestedInputObjectSchema: z.ZodType<Prisma.AccountUpdateOneWithoutEmployeeNestedInput> = __makeSchema_AccountUpdateOneWithoutEmployeeNestedInput_schema() as unknown as z.ZodType<Prisma.AccountUpdateOneWithoutEmployeeNestedInput>;
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
export const AccountUncheckedUpdateOneWithoutEmployeeNestedInputObjectSchema: z.ZodType<Prisma.AccountUncheckedUpdateOneWithoutEmployeeNestedInput> = __makeSchema_AccountUncheckedUpdateOneWithoutEmployeeNestedInput_schema() as unknown as z.ZodType<Prisma.AccountUncheckedUpdateOneWithoutEmployeeNestedInput>;
export const AccountUncheckedUpdateOneWithoutEmployeeNestedInputObjectZodSchema = __makeSchema_AccountUncheckedUpdateOneWithoutEmployeeNestedInput_schema();


// File: EnumContentTypeFieldUpdateOperationsInput.schema.ts
const __makeSchema_EnumContentTypeFieldUpdateOperationsInput_schema = () => z.object({
  set: ContentTypeSchema.optional()
}).strict();
export const EnumContentTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumContentTypeFieldUpdateOperationsInput> = __makeSchema_EnumContentTypeFieldUpdateOperationsInput_schema() as unknown as z.ZodType<Prisma.EnumContentTypeFieldUpdateOperationsInput>;
export const EnumContentTypeFieldUpdateOperationsInputObjectZodSchema = __makeSchema_EnumContentTypeFieldUpdateOperationsInput_schema();


// File: EnumContentStatusFieldUpdateOperationsInput.schema.ts
const __makeSchema_EnumContentStatusFieldUpdateOperationsInput_schema = () => z.object({
  set: ContentStatusSchema.optional()
}).strict();
export const EnumContentStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumContentStatusFieldUpdateOperationsInput> = __makeSchema_EnumContentStatusFieldUpdateOperationsInput_schema() as unknown as z.ZodType<Prisma.EnumContentStatusFieldUpdateOperationsInput>;
export const EnumContentStatusFieldUpdateOperationsInputObjectZodSchema = __makeSchema_EnumContentStatusFieldUpdateOperationsInput_schema();


// File: EmployeeCreateNestedOneWithoutAccountInput.schema.ts
const __makeSchema_EmployeeCreateNestedOneWithoutAccountInput_schema = () => z.object({
  create: z.union([z.lazy(() => EmployeeCreateWithoutAccountInputObjectSchema), z.lazy(() => EmployeeUncheckedCreateWithoutAccountInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => EmployeeCreateOrConnectWithoutAccountInputObjectSchema).optional(),
  connect: z.lazy(() => EmployeeWhereUniqueInputObjectSchema).optional()
}).strict();
export const EmployeeCreateNestedOneWithoutAccountInputObjectSchema: z.ZodType<Prisma.EmployeeCreateNestedOneWithoutAccountInput> = __makeSchema_EmployeeCreateNestedOneWithoutAccountInput_schema() as unknown as z.ZodType<Prisma.EmployeeCreateNestedOneWithoutAccountInput>;
export const EmployeeCreateNestedOneWithoutAccountInputObjectZodSchema = __makeSchema_EmployeeCreateNestedOneWithoutAccountInput_schema();


// File: EnumAccountTypeFieldUpdateOperationsInput.schema.ts
const __makeSchema_EnumAccountTypeFieldUpdateOperationsInput_schema = () => z.object({
  set: AccountTypeSchema.optional()
}).strict();
export const EnumAccountTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumAccountTypeFieldUpdateOperationsInput> = __makeSchema_EnumAccountTypeFieldUpdateOperationsInput_schema() as unknown as z.ZodType<Prisma.EnumAccountTypeFieldUpdateOperationsInput>;
export const EnumAccountTypeFieldUpdateOperationsInputObjectZodSchema = __makeSchema_EnumAccountTypeFieldUpdateOperationsInput_schema();


// File: EmployeeUpdateOneRequiredWithoutAccountNestedInput.schema.ts
const __makeSchema_EmployeeUpdateOneRequiredWithoutAccountNestedInput_schema = () => z.object({
  create: z.union([z.lazy(() => EmployeeCreateWithoutAccountInputObjectSchema), z.lazy(() => EmployeeUncheckedCreateWithoutAccountInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => EmployeeCreateOrConnectWithoutAccountInputObjectSchema).optional(),
  upsert: z.lazy(() => EmployeeUpsertWithoutAccountInputObjectSchema).optional(),
  connect: z.lazy(() => EmployeeWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => EmployeeUpdateToOneWithWhereWithoutAccountInputObjectSchema), z.lazy(() => EmployeeUpdateWithoutAccountInputObjectSchema), z.lazy(() => EmployeeUncheckedUpdateWithoutAccountInputObjectSchema)]).optional()
}).strict();
export const EmployeeUpdateOneRequiredWithoutAccountNestedInputObjectSchema: z.ZodType<Prisma.EmployeeUpdateOneRequiredWithoutAccountNestedInput> = __makeSchema_EmployeeUpdateOneRequiredWithoutAccountNestedInput_schema() as unknown as z.ZodType<Prisma.EmployeeUpdateOneRequiredWithoutAccountNestedInput>;
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
export const NestedUuidFilterObjectSchema: z.ZodType<Prisma.NestedUuidFilter> = nesteduuidfilterSchema as unknown as z.ZodType<Prisma.NestedUuidFilter>;
export const NestedUuidFilterObjectZodSchema = nesteduuidfilterSchema;


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
export const NestedStringFilterObjectSchema: z.ZodType<Prisma.NestedStringFilter> = nestedstringfilterSchema as unknown as z.ZodType<Prisma.NestedStringFilter>;
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
export const NestedDateTimeFilterObjectSchema: z.ZodType<Prisma.NestedDateTimeFilter> = nesteddatetimefilterSchema as unknown as z.ZodType<Prisma.NestedDateTimeFilter>;
export const NestedDateTimeFilterObjectZodSchema = nesteddatetimefilterSchema;


// File: NestedEnumPositionFilter.schema.ts

const nestedenumpositionfilterSchema = z.object({
  equals: PositionSchema.optional(),
  in: PositionSchema.array().optional(),
  notIn: PositionSchema.array().optional(),
  not: z.union([PositionSchema, z.lazy(() => NestedEnumPositionFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumPositionFilterObjectSchema: z.ZodType<Prisma.NestedEnumPositionFilter> = nestedenumpositionfilterSchema as unknown as z.ZodType<Prisma.NestedEnumPositionFilter>;
export const NestedEnumPositionFilterObjectZodSchema = nestedenumpositionfilterSchema;


// File: NestedEnumDepartmentFilter.schema.ts

const nestedenumdepartmentfilterSchema = z.object({
  equals: DepartmentSchema.optional(),
  in: DepartmentSchema.array().optional(),
  notIn: DepartmentSchema.array().optional(),
  not: z.union([DepartmentSchema, z.lazy(() => NestedEnumDepartmentFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumDepartmentFilterObjectSchema: z.ZodType<Prisma.NestedEnumDepartmentFilter> = nestedenumdepartmentfilterSchema as unknown as z.ZodType<Prisma.NestedEnumDepartmentFilter>;
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
export const NestedUuidWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedUuidWithAggregatesFilter> = nesteduuidwithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedUuidWithAggregatesFilter>;
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
export const NestedIntFilterObjectSchema: z.ZodType<Prisma.NestedIntFilter> = nestedintfilterSchema as unknown as z.ZodType<Prisma.NestedIntFilter>;
export const NestedIntFilterObjectZodSchema = nestedintfilterSchema;


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
export const NestedStringWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = nestedstringwithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedStringWithAggregatesFilter>;
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
export const NestedDateTimeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = nesteddatetimewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter>;
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
export const NestedEnumPositionWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumPositionWithAggregatesFilter> = nestedenumpositionwithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumPositionWithAggregatesFilter>;
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
export const NestedEnumDepartmentWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumDepartmentWithAggregatesFilter> = nestedenumdepartmentwithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumDepartmentWithAggregatesFilter>;
export const NestedEnumDepartmentWithAggregatesFilterObjectZodSchema = nestedenumdepartmentwithaggregatesfilterSchema;


// File: NestedEnumContentTypeFilter.schema.ts

const nestedenumcontenttypefilterSchema = z.object({
  equals: ContentTypeSchema.optional(),
  in: ContentTypeSchema.array().optional(),
  notIn: ContentTypeSchema.array().optional(),
  not: z.union([ContentTypeSchema, z.lazy(() => NestedEnumContentTypeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumContentTypeFilterObjectSchema: z.ZodType<Prisma.NestedEnumContentTypeFilter> = nestedenumcontenttypefilterSchema as unknown as z.ZodType<Prisma.NestedEnumContentTypeFilter>;
export const NestedEnumContentTypeFilterObjectZodSchema = nestedenumcontenttypefilterSchema;


// File: NestedEnumContentStatusFilter.schema.ts

const nestedenumcontentstatusfilterSchema = z.object({
  equals: ContentStatusSchema.optional(),
  in: ContentStatusSchema.array().optional(),
  notIn: ContentStatusSchema.array().optional(),
  not: z.union([ContentStatusSchema, z.lazy(() => NestedEnumContentStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumContentStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumContentStatusFilter> = nestedenumcontentstatusfilterSchema as unknown as z.ZodType<Prisma.NestedEnumContentStatusFilter>;
export const NestedEnumContentStatusFilterObjectZodSchema = nestedenumcontentstatusfilterSchema;


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
export const NestedEnumContentTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumContentTypeWithAggregatesFilter> = nestedenumcontenttypewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumContentTypeWithAggregatesFilter>;
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
export const NestedEnumContentStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumContentStatusWithAggregatesFilter> = nestedenumcontentstatuswithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumContentStatusWithAggregatesFilter>;
export const NestedEnumContentStatusWithAggregatesFilterObjectZodSchema = nestedenumcontentstatuswithaggregatesfilterSchema;


// File: NestedEnumAccountTypeFilter.schema.ts

const nestedenumaccounttypefilterSchema = z.object({
  equals: AccountTypeSchema.optional(),
  in: AccountTypeSchema.array().optional(),
  notIn: AccountTypeSchema.array().optional(),
  not: z.union([AccountTypeSchema, z.lazy(() => NestedEnumAccountTypeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumAccountTypeFilterObjectSchema: z.ZodType<Prisma.NestedEnumAccountTypeFilter> = nestedenumaccounttypefilterSchema as unknown as z.ZodType<Prisma.NestedEnumAccountTypeFilter>;
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
export const NestedEnumAccountTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumAccountTypeWithAggregatesFilter> = nestedenumaccounttypewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumAccountTypeWithAggregatesFilter>;
export const NestedEnumAccountTypeWithAggregatesFilterObjectZodSchema = nestedenumaccounttypewithaggregatesfilterSchema;


// File: AccountCreateWithoutEmployeeInput.schema.ts
const __makeSchema_AccountCreateWithoutEmployeeInput_schema = () => z.object({
  username: z.string(),
  password: z.string(),
  type: AccountTypeSchema
}).strict();
export const AccountCreateWithoutEmployeeInputObjectSchema: z.ZodType<Prisma.AccountCreateWithoutEmployeeInput> = __makeSchema_AccountCreateWithoutEmployeeInput_schema() as unknown as z.ZodType<Prisma.AccountCreateWithoutEmployeeInput>;
export const AccountCreateWithoutEmployeeInputObjectZodSchema = __makeSchema_AccountCreateWithoutEmployeeInput_schema();


// File: AccountUncheckedCreateWithoutEmployeeInput.schema.ts
const __makeSchema_AccountUncheckedCreateWithoutEmployeeInput_schema = () => z.object({
  username: z.string(),
  password: z.string(),
  type: AccountTypeSchema
}).strict();
export const AccountUncheckedCreateWithoutEmployeeInputObjectSchema: z.ZodType<Prisma.AccountUncheckedCreateWithoutEmployeeInput> = __makeSchema_AccountUncheckedCreateWithoutEmployeeInput_schema() as unknown as z.ZodType<Prisma.AccountUncheckedCreateWithoutEmployeeInput>;
export const AccountUncheckedCreateWithoutEmployeeInputObjectZodSchema = __makeSchema_AccountUncheckedCreateWithoutEmployeeInput_schema();


// File: AccountCreateOrConnectWithoutEmployeeInput.schema.ts
const __makeSchema_AccountCreateOrConnectWithoutEmployeeInput_schema = () => z.object({
  where: z.lazy(() => AccountWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AccountCreateWithoutEmployeeInputObjectSchema), z.lazy(() => AccountUncheckedCreateWithoutEmployeeInputObjectSchema)])
}).strict();
export const AccountCreateOrConnectWithoutEmployeeInputObjectSchema: z.ZodType<Prisma.AccountCreateOrConnectWithoutEmployeeInput> = __makeSchema_AccountCreateOrConnectWithoutEmployeeInput_schema() as unknown as z.ZodType<Prisma.AccountCreateOrConnectWithoutEmployeeInput>;
export const AccountCreateOrConnectWithoutEmployeeInputObjectZodSchema = __makeSchema_AccountCreateOrConnectWithoutEmployeeInput_schema();


// File: AccountUpsertWithoutEmployeeInput.schema.ts
const __makeSchema_AccountUpsertWithoutEmployeeInput_schema = () => z.object({
  update: z.union([z.lazy(() => AccountUpdateWithoutEmployeeInputObjectSchema), z.lazy(() => AccountUncheckedUpdateWithoutEmployeeInputObjectSchema)]),
  create: z.union([z.lazy(() => AccountCreateWithoutEmployeeInputObjectSchema), z.lazy(() => AccountUncheckedCreateWithoutEmployeeInputObjectSchema)]),
  where: z.lazy(() => AccountWhereInputObjectSchema).optional()
}).strict();
export const AccountUpsertWithoutEmployeeInputObjectSchema: z.ZodType<Prisma.AccountUpsertWithoutEmployeeInput> = __makeSchema_AccountUpsertWithoutEmployeeInput_schema() as unknown as z.ZodType<Prisma.AccountUpsertWithoutEmployeeInput>;
export const AccountUpsertWithoutEmployeeInputObjectZodSchema = __makeSchema_AccountUpsertWithoutEmployeeInput_schema();


// File: AccountUpdateToOneWithWhereWithoutEmployeeInput.schema.ts
const __makeSchema_AccountUpdateToOneWithWhereWithoutEmployeeInput_schema = () => z.object({
  where: z.lazy(() => AccountWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => AccountUpdateWithoutEmployeeInputObjectSchema), z.lazy(() => AccountUncheckedUpdateWithoutEmployeeInputObjectSchema)])
}).strict();
export const AccountUpdateToOneWithWhereWithoutEmployeeInputObjectSchema: z.ZodType<Prisma.AccountUpdateToOneWithWhereWithoutEmployeeInput> = __makeSchema_AccountUpdateToOneWithWhereWithoutEmployeeInput_schema() as unknown as z.ZodType<Prisma.AccountUpdateToOneWithWhereWithoutEmployeeInput>;
export const AccountUpdateToOneWithWhereWithoutEmployeeInputObjectZodSchema = __makeSchema_AccountUpdateToOneWithWhereWithoutEmployeeInput_schema();


// File: AccountUpdateWithoutEmployeeInput.schema.ts
const __makeSchema_AccountUpdateWithoutEmployeeInput_schema = () => z.object({
  username: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  password: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  type: z.union([AccountTypeSchema, z.lazy(() => EnumAccountTypeFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const AccountUpdateWithoutEmployeeInputObjectSchema: z.ZodType<Prisma.AccountUpdateWithoutEmployeeInput> = __makeSchema_AccountUpdateWithoutEmployeeInput_schema() as unknown as z.ZodType<Prisma.AccountUpdateWithoutEmployeeInput>;
export const AccountUpdateWithoutEmployeeInputObjectZodSchema = __makeSchema_AccountUpdateWithoutEmployeeInput_schema();


// File: AccountUncheckedUpdateWithoutEmployeeInput.schema.ts
const __makeSchema_AccountUncheckedUpdateWithoutEmployeeInput_schema = () => z.object({
  username: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  password: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  type: z.union([AccountTypeSchema, z.lazy(() => EnumAccountTypeFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const AccountUncheckedUpdateWithoutEmployeeInputObjectSchema: z.ZodType<Prisma.AccountUncheckedUpdateWithoutEmployeeInput> = __makeSchema_AccountUncheckedUpdateWithoutEmployeeInput_schema() as unknown as z.ZodType<Prisma.AccountUncheckedUpdateWithoutEmployeeInput>;
export const AccountUncheckedUpdateWithoutEmployeeInputObjectZodSchema = __makeSchema_AccountUncheckedUpdateWithoutEmployeeInput_schema();


// File: EmployeeCreateWithoutAccountInput.schema.ts
const __makeSchema_EmployeeCreateWithoutAccountInput_schema = () => z.object({
  uuid: z.string().optional(),
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
export const EmployeeCreateWithoutAccountInputObjectSchema: z.ZodType<Prisma.EmployeeCreateWithoutAccountInput> = __makeSchema_EmployeeCreateWithoutAccountInput_schema() as unknown as z.ZodType<Prisma.EmployeeCreateWithoutAccountInput>;
export const EmployeeCreateWithoutAccountInputObjectZodSchema = __makeSchema_EmployeeCreateWithoutAccountInput_schema();


// File: EmployeeUncheckedCreateWithoutAccountInput.schema.ts
const __makeSchema_EmployeeUncheckedCreateWithoutAccountInput_schema = () => z.object({
  uuid: z.string().optional(),
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
export const EmployeeUncheckedCreateWithoutAccountInputObjectSchema: z.ZodType<Prisma.EmployeeUncheckedCreateWithoutAccountInput> = __makeSchema_EmployeeUncheckedCreateWithoutAccountInput_schema() as unknown as z.ZodType<Prisma.EmployeeUncheckedCreateWithoutAccountInput>;
export const EmployeeUncheckedCreateWithoutAccountInputObjectZodSchema = __makeSchema_EmployeeUncheckedCreateWithoutAccountInput_schema();


// File: EmployeeCreateOrConnectWithoutAccountInput.schema.ts
const __makeSchema_EmployeeCreateOrConnectWithoutAccountInput_schema = () => z.object({
  where: z.lazy(() => EmployeeWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => EmployeeCreateWithoutAccountInputObjectSchema), z.lazy(() => EmployeeUncheckedCreateWithoutAccountInputObjectSchema)])
}).strict();
export const EmployeeCreateOrConnectWithoutAccountInputObjectSchema: z.ZodType<Prisma.EmployeeCreateOrConnectWithoutAccountInput> = __makeSchema_EmployeeCreateOrConnectWithoutAccountInput_schema() as unknown as z.ZodType<Prisma.EmployeeCreateOrConnectWithoutAccountInput>;
export const EmployeeCreateOrConnectWithoutAccountInputObjectZodSchema = __makeSchema_EmployeeCreateOrConnectWithoutAccountInput_schema();


// File: EmployeeUpsertWithoutAccountInput.schema.ts
const __makeSchema_EmployeeUpsertWithoutAccountInput_schema = () => z.object({
  update: z.union([z.lazy(() => EmployeeUpdateWithoutAccountInputObjectSchema), z.lazy(() => EmployeeUncheckedUpdateWithoutAccountInputObjectSchema)]),
  create: z.union([z.lazy(() => EmployeeCreateWithoutAccountInputObjectSchema), z.lazy(() => EmployeeUncheckedCreateWithoutAccountInputObjectSchema)]),
  where: z.lazy(() => EmployeeWhereInputObjectSchema).optional()
}).strict();
export const EmployeeUpsertWithoutAccountInputObjectSchema: z.ZodType<Prisma.EmployeeUpsertWithoutAccountInput> = __makeSchema_EmployeeUpsertWithoutAccountInput_schema() as unknown as z.ZodType<Prisma.EmployeeUpsertWithoutAccountInput>;
export const EmployeeUpsertWithoutAccountInputObjectZodSchema = __makeSchema_EmployeeUpsertWithoutAccountInput_schema();


// File: EmployeeUpdateToOneWithWhereWithoutAccountInput.schema.ts
const __makeSchema_EmployeeUpdateToOneWithWhereWithoutAccountInput_schema = () => z.object({
  where: z.lazy(() => EmployeeWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => EmployeeUpdateWithoutAccountInputObjectSchema), z.lazy(() => EmployeeUncheckedUpdateWithoutAccountInputObjectSchema)])
}).strict();
export const EmployeeUpdateToOneWithWhereWithoutAccountInputObjectSchema: z.ZodType<Prisma.EmployeeUpdateToOneWithWhereWithoutAccountInput> = __makeSchema_EmployeeUpdateToOneWithWhereWithoutAccountInput_schema() as unknown as z.ZodType<Prisma.EmployeeUpdateToOneWithWhereWithoutAccountInput>;
export const EmployeeUpdateToOneWithWhereWithoutAccountInputObjectZodSchema = __makeSchema_EmployeeUpdateToOneWithWhereWithoutAccountInput_schema();


// File: EmployeeUpdateWithoutAccountInput.schema.ts
const __makeSchema_EmployeeUpdateWithoutAccountInput_schema = () => z.object({
  uuid: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
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
export const EmployeeUpdateWithoutAccountInputObjectSchema: z.ZodType<Prisma.EmployeeUpdateWithoutAccountInput> = __makeSchema_EmployeeUpdateWithoutAccountInput_schema() as unknown as z.ZodType<Prisma.EmployeeUpdateWithoutAccountInput>;
export const EmployeeUpdateWithoutAccountInputObjectZodSchema = __makeSchema_EmployeeUpdateWithoutAccountInput_schema();


// File: EmployeeUncheckedUpdateWithoutAccountInput.schema.ts
const __makeSchema_EmployeeUncheckedUpdateWithoutAccountInput_schema = () => z.object({
  uuid: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
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
export const EmployeeUncheckedUpdateWithoutAccountInputObjectSchema: z.ZodType<Prisma.EmployeeUncheckedUpdateWithoutAccountInput> = __makeSchema_EmployeeUncheckedUpdateWithoutAccountInput_schema() as unknown as z.ZodType<Prisma.EmployeeUncheckedUpdateWithoutAccountInput>;
export const EmployeeUncheckedUpdateWithoutAccountInputObjectZodSchema = __makeSchema_EmployeeUncheckedUpdateWithoutAccountInput_schema();


// File: EmployeeCountAggregateInput.schema.ts
const __makeSchema_EmployeeCountAggregateInput_schema = () => z.object({
  uuid: z.literal(true).optional(),
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
export const EmployeeCountAggregateInputObjectSchema: z.ZodType<Prisma.EmployeeCountAggregateInputType> = __makeSchema_EmployeeCountAggregateInput_schema() as unknown as z.ZodType<Prisma.EmployeeCountAggregateInputType>;
export const EmployeeCountAggregateInputObjectZodSchema = __makeSchema_EmployeeCountAggregateInput_schema();


// File: EmployeeMinAggregateInput.schema.ts
const __makeSchema_EmployeeMinAggregateInput_schema = () => z.object({
  uuid: z.literal(true).optional(),
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
export const EmployeeMinAggregateInputObjectSchema: z.ZodType<Prisma.EmployeeMinAggregateInputType> = __makeSchema_EmployeeMinAggregateInput_schema() as unknown as z.ZodType<Prisma.EmployeeMinAggregateInputType>;
export const EmployeeMinAggregateInputObjectZodSchema = __makeSchema_EmployeeMinAggregateInput_schema();


// File: EmployeeMaxAggregateInput.schema.ts
const __makeSchema_EmployeeMaxAggregateInput_schema = () => z.object({
  uuid: z.literal(true).optional(),
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
export const EmployeeMaxAggregateInputObjectSchema: z.ZodType<Prisma.EmployeeMaxAggregateInputType> = __makeSchema_EmployeeMaxAggregateInput_schema() as unknown as z.ZodType<Prisma.EmployeeMaxAggregateInputType>;
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
  _all: z.literal(true).optional()
}).strict();
export const ContentCountAggregateInputObjectSchema: z.ZodType<Prisma.ContentCountAggregateInputType> = __makeSchema_ContentCountAggregateInput_schema() as unknown as z.ZodType<Prisma.ContentCountAggregateInputType>;
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
  status: z.literal(true).optional()
}).strict();
export const ContentMinAggregateInputObjectSchema: z.ZodType<Prisma.ContentMinAggregateInputType> = __makeSchema_ContentMinAggregateInput_schema() as unknown as z.ZodType<Prisma.ContentMinAggregateInputType>;
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
  status: z.literal(true).optional()
}).strict();
export const ContentMaxAggregateInputObjectSchema: z.ZodType<Prisma.ContentMaxAggregateInputType> = __makeSchema_ContentMaxAggregateInput_schema() as unknown as z.ZodType<Prisma.ContentMaxAggregateInputType>;
export const ContentMaxAggregateInputObjectZodSchema = __makeSchema_ContentMaxAggregateInput_schema();


// File: AccountCountAggregateInput.schema.ts
const __makeSchema_AccountCountAggregateInput_schema = () => z.object({
  employeeUuid: z.literal(true).optional(),
  username: z.literal(true).optional(),
  password: z.literal(true).optional(),
  type: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const AccountCountAggregateInputObjectSchema: z.ZodType<Prisma.AccountCountAggregateInputType> = __makeSchema_AccountCountAggregateInput_schema() as unknown as z.ZodType<Prisma.AccountCountAggregateInputType>;
export const AccountCountAggregateInputObjectZodSchema = __makeSchema_AccountCountAggregateInput_schema();


// File: AccountMinAggregateInput.schema.ts
const __makeSchema_AccountMinAggregateInput_schema = () => z.object({
  employeeUuid: z.literal(true).optional(),
  username: z.literal(true).optional(),
  password: z.literal(true).optional(),
  type: z.literal(true).optional()
}).strict();
export const AccountMinAggregateInputObjectSchema: z.ZodType<Prisma.AccountMinAggregateInputType> = __makeSchema_AccountMinAggregateInput_schema() as unknown as z.ZodType<Prisma.AccountMinAggregateInputType>;
export const AccountMinAggregateInputObjectZodSchema = __makeSchema_AccountMinAggregateInput_schema();


// File: AccountMaxAggregateInput.schema.ts
const __makeSchema_AccountMaxAggregateInput_schema = () => z.object({
  employeeUuid: z.literal(true).optional(),
  username: z.literal(true).optional(),
  password: z.literal(true).optional(),
  type: z.literal(true).optional()
}).strict();
export const AccountMaxAggregateInputObjectSchema: z.ZodType<Prisma.AccountMaxAggregateInputType> = __makeSchema_AccountMaxAggregateInput_schema() as unknown as z.ZodType<Prisma.AccountMaxAggregateInputType>;
export const AccountMaxAggregateInputObjectZodSchema = __makeSchema_AccountMaxAggregateInput_schema();


// File: EmployeeSelect.schema.ts
const __makeSchema_EmployeeSelect_schema = () => z.object({
  uuid: z.boolean().optional(),
  account: z.union([z.boolean(), z.lazy(() => AccountArgsObjectSchema)]).optional(),
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
export const EmployeeSelectObjectSchema: z.ZodType<Prisma.EmployeeSelect> = __makeSchema_EmployeeSelect_schema() as unknown as z.ZodType<Prisma.EmployeeSelect>;
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
  status: z.boolean().optional()
}).strict();
export const ContentSelectObjectSchema: z.ZodType<Prisma.ContentSelect> = __makeSchema_ContentSelect_schema() as unknown as z.ZodType<Prisma.ContentSelect>;
export const ContentSelectObjectZodSchema = __makeSchema_ContentSelect_schema();


// File: AccountSelect.schema.ts
const __makeSchema_AccountSelect_schema = () => z.object({
  employee: z.union([z.boolean(), z.lazy(() => EmployeeArgsObjectSchema)]).optional(),
  employeeUuid: z.boolean().optional(),
  username: z.boolean().optional(),
  password: z.boolean().optional(),
  type: z.boolean().optional()
}).strict();
export const AccountSelectObjectSchema: z.ZodType<Prisma.AccountSelect> = __makeSchema_AccountSelect_schema() as unknown as z.ZodType<Prisma.AccountSelect>;
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
export const EmployeeIncludeObjectSchema: z.ZodType<Prisma.EmployeeInclude> = __makeSchema_EmployeeInclude_schema() as unknown as z.ZodType<Prisma.EmployeeInclude>;
export const EmployeeIncludeObjectZodSchema = __makeSchema_EmployeeInclude_schema();


// File: AccountInclude.schema.ts
const __makeSchema_AccountInclude_schema = () => z.object({
  employee: z.union([z.boolean(), z.lazy(() => EmployeeArgsObjectSchema)]).optional()
}).strict();
export const AccountIncludeObjectSchema: z.ZodType<Prisma.AccountInclude> = __makeSchema_AccountInclude_schema() as unknown as z.ZodType<Prisma.AccountInclude>;
export const AccountIncludeObjectZodSchema = __makeSchema_AccountInclude_schema();


// File: findUniqueEmployee.schema.ts

export const EmployeeFindUniqueSchema: z.ZodType<Prisma.EmployeeFindUniqueArgs> = z.object({ select: EmployeeSelectObjectSchema.optional(), include: EmployeeIncludeObjectSchema.optional(), where: EmployeeWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.EmployeeFindUniqueArgs>;

export const EmployeeFindUniqueZodSchema = z.object({ select: EmployeeSelectObjectSchema.optional(), include: EmployeeIncludeObjectSchema.optional(), where: EmployeeWhereUniqueInputObjectSchema }).strict();

// File: findUniqueOrThrowEmployee.schema.ts

export const EmployeeFindUniqueOrThrowSchema: z.ZodType<Prisma.EmployeeFindUniqueOrThrowArgs> = z.object({ select: EmployeeSelectObjectSchema.optional(), include: EmployeeIncludeObjectSchema.optional(), where: EmployeeWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.EmployeeFindUniqueOrThrowArgs>;

export const EmployeeFindUniqueOrThrowZodSchema = z.object({ select: EmployeeSelectObjectSchema.optional(), include: EmployeeIncludeObjectSchema.optional(), where: EmployeeWhereUniqueInputObjectSchema }).strict();

// File: findFirstEmployee.schema.ts

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const EmployeeFindFirstSelectSchema__findFirstEmployee_schema: z.ZodType<Prisma.EmployeeSelect> = z.object({
    uuid: z.boolean().optional(),
    account: z.boolean().optional(),
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
  }).strict() as unknown as z.ZodType<Prisma.EmployeeSelect>;

export const EmployeeFindFirstSelectZodSchema__findFirstEmployee_schema = z.object({
    uuid: z.boolean().optional(),
    account: z.boolean().optional(),
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

export const EmployeeFindFirstSchema: z.ZodType<Prisma.EmployeeFindFirstArgs> = z.object({ select: EmployeeFindFirstSelectSchema__findFirstEmployee_schema.optional(), include: z.lazy(() => EmployeeIncludeObjectSchema.optional()), orderBy: z.union([EmployeeOrderByWithRelationInputObjectSchema, EmployeeOrderByWithRelationInputObjectSchema.array()]).optional(), where: EmployeeWhereInputObjectSchema.optional(), cursor: EmployeeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([EmployeeScalarFieldEnumSchema, EmployeeScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.EmployeeFindFirstArgs>;

export const EmployeeFindFirstZodSchema = z.object({ select: EmployeeFindFirstSelectSchema__findFirstEmployee_schema.optional(), include: z.lazy(() => EmployeeIncludeObjectSchema.optional()), orderBy: z.union([EmployeeOrderByWithRelationInputObjectSchema, EmployeeOrderByWithRelationInputObjectSchema.array()]).optional(), where: EmployeeWhereInputObjectSchema.optional(), cursor: EmployeeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([EmployeeScalarFieldEnumSchema, EmployeeScalarFieldEnumSchema.array()]).optional() }).strict();

// File: findFirstOrThrowEmployee.schema.ts

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const EmployeeFindFirstOrThrowSelectSchema__findFirstOrThrowEmployee_schema: z.ZodType<Prisma.EmployeeSelect> = z.object({
    uuid: z.boolean().optional(),
    account: z.boolean().optional(),
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
  }).strict() as unknown as z.ZodType<Prisma.EmployeeSelect>;

export const EmployeeFindFirstOrThrowSelectZodSchema__findFirstOrThrowEmployee_schema = z.object({
    uuid: z.boolean().optional(),
    account: z.boolean().optional(),
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

export const EmployeeFindFirstOrThrowSchema: z.ZodType<Prisma.EmployeeFindFirstOrThrowArgs> = z.object({ select: EmployeeFindFirstOrThrowSelectSchema__findFirstOrThrowEmployee_schema.optional(), include: z.lazy(() => EmployeeIncludeObjectSchema.optional()), orderBy: z.union([EmployeeOrderByWithRelationInputObjectSchema, EmployeeOrderByWithRelationInputObjectSchema.array()]).optional(), where: EmployeeWhereInputObjectSchema.optional(), cursor: EmployeeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([EmployeeScalarFieldEnumSchema, EmployeeScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.EmployeeFindFirstOrThrowArgs>;

export const EmployeeFindFirstOrThrowZodSchema = z.object({ select: EmployeeFindFirstOrThrowSelectSchema__findFirstOrThrowEmployee_schema.optional(), include: z.lazy(() => EmployeeIncludeObjectSchema.optional()), orderBy: z.union([EmployeeOrderByWithRelationInputObjectSchema, EmployeeOrderByWithRelationInputObjectSchema.array()]).optional(), where: EmployeeWhereInputObjectSchema.optional(), cursor: EmployeeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([EmployeeScalarFieldEnumSchema, EmployeeScalarFieldEnumSchema.array()]).optional() }).strict();

// File: findManyEmployee.schema.ts

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const EmployeeFindManySelectSchema__findManyEmployee_schema: z.ZodType<Prisma.EmployeeSelect> = z.object({
    uuid: z.boolean().optional(),
    account: z.boolean().optional(),
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
  }).strict() as unknown as z.ZodType<Prisma.EmployeeSelect>;

export const EmployeeFindManySelectZodSchema__findManyEmployee_schema = z.object({
    uuid: z.boolean().optional(),
    account: z.boolean().optional(),
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

export const EmployeeFindManySchema: z.ZodType<Prisma.EmployeeFindManyArgs> = z.object({ select: EmployeeFindManySelectSchema__findManyEmployee_schema.optional(), include: z.lazy(() => EmployeeIncludeObjectSchema.optional()), orderBy: z.union([EmployeeOrderByWithRelationInputObjectSchema, EmployeeOrderByWithRelationInputObjectSchema.array()]).optional(), where: EmployeeWhereInputObjectSchema.optional(), cursor: EmployeeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([EmployeeScalarFieldEnumSchema, EmployeeScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.EmployeeFindManyArgs>;

export const EmployeeFindManyZodSchema = z.object({ select: EmployeeFindManySelectSchema__findManyEmployee_schema.optional(), include: z.lazy(() => EmployeeIncludeObjectSchema.optional()), orderBy: z.union([EmployeeOrderByWithRelationInputObjectSchema, EmployeeOrderByWithRelationInputObjectSchema.array()]).optional(), where: EmployeeWhereInputObjectSchema.optional(), cursor: EmployeeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([EmployeeScalarFieldEnumSchema, EmployeeScalarFieldEnumSchema.array()]).optional() }).strict();

// File: countEmployee.schema.ts

export const EmployeeCountSchema: z.ZodType<Prisma.EmployeeCountArgs> = z.object({ orderBy: z.union([EmployeeOrderByWithRelationInputObjectSchema, EmployeeOrderByWithRelationInputObjectSchema.array()]).optional(), where: EmployeeWhereInputObjectSchema.optional(), cursor: EmployeeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), EmployeeCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.EmployeeCountArgs>;

export const EmployeeCountZodSchema = z.object({ orderBy: z.union([EmployeeOrderByWithRelationInputObjectSchema, EmployeeOrderByWithRelationInputObjectSchema.array()]).optional(), where: EmployeeWhereInputObjectSchema.optional(), cursor: EmployeeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), EmployeeCountAggregateInputObjectSchema ]).optional() }).strict();

// File: createOneEmployee.schema.ts

export const EmployeeCreateOneSchema: z.ZodType<Prisma.EmployeeCreateArgs> = z.object({ select: EmployeeSelectObjectSchema.optional(), include: EmployeeIncludeObjectSchema.optional(), data: z.union([EmployeeCreateInputObjectSchema, EmployeeUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.EmployeeCreateArgs>;

export const EmployeeCreateOneZodSchema = z.object({ select: EmployeeSelectObjectSchema.optional(), include: EmployeeIncludeObjectSchema.optional(), data: z.union([EmployeeCreateInputObjectSchema, EmployeeUncheckedCreateInputObjectSchema]) }).strict();

// File: createManyEmployee.schema.ts

export const EmployeeCreateManySchema: z.ZodType<Prisma.EmployeeCreateManyArgs> = z.object({ data: z.union([ EmployeeCreateManyInputObjectSchema, z.array(EmployeeCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.EmployeeCreateManyArgs>;

export const EmployeeCreateManyZodSchema = z.object({ data: z.union([ EmployeeCreateManyInputObjectSchema, z.array(EmployeeCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();

// File: createManyAndReturnEmployee.schema.ts

export const EmployeeCreateManyAndReturnSchema: z.ZodType<Prisma.EmployeeCreateManyAndReturnArgs> = z.object({ select: EmployeeSelectObjectSchema.optional(), data: z.union([ EmployeeCreateManyInputObjectSchema, z.array(EmployeeCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.EmployeeCreateManyAndReturnArgs>;

export const EmployeeCreateManyAndReturnZodSchema = z.object({ select: EmployeeSelectObjectSchema.optional(), data: z.union([ EmployeeCreateManyInputObjectSchema, z.array(EmployeeCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();

// File: deleteOneEmployee.schema.ts

export const EmployeeDeleteOneSchema: z.ZodType<Prisma.EmployeeDeleteArgs> = z.object({ select: EmployeeSelectObjectSchema.optional(), include: EmployeeIncludeObjectSchema.optional(), where: EmployeeWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.EmployeeDeleteArgs>;

export const EmployeeDeleteOneZodSchema = z.object({ select: EmployeeSelectObjectSchema.optional(), include: EmployeeIncludeObjectSchema.optional(), where: EmployeeWhereUniqueInputObjectSchema }).strict();

// File: deleteManyEmployee.schema.ts

export const EmployeeDeleteManySchema: z.ZodType<Prisma.EmployeeDeleteManyArgs> = z.object({ where: EmployeeWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.EmployeeDeleteManyArgs>;

export const EmployeeDeleteManyZodSchema = z.object({ where: EmployeeWhereInputObjectSchema.optional() }).strict();

// File: updateOneEmployee.schema.ts

export const EmployeeUpdateOneSchema: z.ZodType<Prisma.EmployeeUpdateArgs> = z.object({ select: EmployeeSelectObjectSchema.optional(), include: EmployeeIncludeObjectSchema.optional(), data: z.union([EmployeeUpdateInputObjectSchema, EmployeeUncheckedUpdateInputObjectSchema]), where: EmployeeWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.EmployeeUpdateArgs>;

export const EmployeeUpdateOneZodSchema = z.object({ select: EmployeeSelectObjectSchema.optional(), include: EmployeeIncludeObjectSchema.optional(), data: z.union([EmployeeUpdateInputObjectSchema, EmployeeUncheckedUpdateInputObjectSchema]), where: EmployeeWhereUniqueInputObjectSchema }).strict();

// File: updateManyEmployee.schema.ts

export const EmployeeUpdateManySchema: z.ZodType<Prisma.EmployeeUpdateManyArgs> = z.object({ data: EmployeeUpdateManyMutationInputObjectSchema, where: EmployeeWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.EmployeeUpdateManyArgs>;

export const EmployeeUpdateManyZodSchema = z.object({ data: EmployeeUpdateManyMutationInputObjectSchema, where: EmployeeWhereInputObjectSchema.optional() }).strict();

// File: updateManyAndReturnEmployee.schema.ts

export const EmployeeUpdateManyAndReturnSchema: z.ZodType<Prisma.EmployeeUpdateManyAndReturnArgs> = z.object({ select: EmployeeSelectObjectSchema.optional(), data: EmployeeUpdateManyMutationInputObjectSchema, where: EmployeeWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.EmployeeUpdateManyAndReturnArgs>;

export const EmployeeUpdateManyAndReturnZodSchema = z.object({ select: EmployeeSelectObjectSchema.optional(), data: EmployeeUpdateManyMutationInputObjectSchema, where: EmployeeWhereInputObjectSchema.optional() }).strict();

// File: upsertOneEmployee.schema.ts

export const EmployeeUpsertOneSchema: z.ZodType<Prisma.EmployeeUpsertArgs> = z.object({ select: EmployeeSelectObjectSchema.optional(), include: EmployeeIncludeObjectSchema.optional(), where: EmployeeWhereUniqueInputObjectSchema, create: z.union([ EmployeeCreateInputObjectSchema, EmployeeUncheckedCreateInputObjectSchema ]), update: z.union([ EmployeeUpdateInputObjectSchema, EmployeeUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.EmployeeUpsertArgs>;

export const EmployeeUpsertOneZodSchema = z.object({ select: EmployeeSelectObjectSchema.optional(), include: EmployeeIncludeObjectSchema.optional(), where: EmployeeWhereUniqueInputObjectSchema, create: z.union([ EmployeeCreateInputObjectSchema, EmployeeUncheckedCreateInputObjectSchema ]), update: z.union([ EmployeeUpdateInputObjectSchema, EmployeeUncheckedUpdateInputObjectSchema ]) }).strict();

// File: aggregateEmployee.schema.ts

export const EmployeeAggregateSchema: z.ZodType<Prisma.EmployeeAggregateArgs> = z.object({ orderBy: z.union([EmployeeOrderByWithRelationInputObjectSchema, EmployeeOrderByWithRelationInputObjectSchema.array()]).optional(), where: EmployeeWhereInputObjectSchema.optional(), cursor: EmployeeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), EmployeeCountAggregateInputObjectSchema ]).optional(), _min: EmployeeMinAggregateInputObjectSchema.optional(), _max: EmployeeMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.EmployeeAggregateArgs>;

export const EmployeeAggregateZodSchema = z.object({ orderBy: z.union([EmployeeOrderByWithRelationInputObjectSchema, EmployeeOrderByWithRelationInputObjectSchema.array()]).optional(), where: EmployeeWhereInputObjectSchema.optional(), cursor: EmployeeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), EmployeeCountAggregateInputObjectSchema ]).optional(), _min: EmployeeMinAggregateInputObjectSchema.optional(), _max: EmployeeMaxAggregateInputObjectSchema.optional() }).strict();

// File: groupByEmployee.schema.ts

export const EmployeeGroupBySchema: z.ZodType<Prisma.EmployeeGroupByArgs> = z.object({ where: EmployeeWhereInputObjectSchema.optional(), orderBy: z.union([EmployeeOrderByWithAggregationInputObjectSchema, EmployeeOrderByWithAggregationInputObjectSchema.array()]).optional(), having: EmployeeScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(EmployeeScalarFieldEnumSchema), _count: z.union([ z.literal(true), EmployeeCountAggregateInputObjectSchema ]).optional(), _min: EmployeeMinAggregateInputObjectSchema.optional(), _max: EmployeeMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.EmployeeGroupByArgs>;

export const EmployeeGroupByZodSchema = z.object({ where: EmployeeWhereInputObjectSchema.optional(), orderBy: z.union([EmployeeOrderByWithAggregationInputObjectSchema, EmployeeOrderByWithAggregationInputObjectSchema.array()]).optional(), having: EmployeeScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(EmployeeScalarFieldEnumSchema), _count: z.union([ z.literal(true), EmployeeCountAggregateInputObjectSchema ]).optional(), _min: EmployeeMinAggregateInputObjectSchema.optional(), _max: EmployeeMaxAggregateInputObjectSchema.optional() }).strict();

// File: findUniqueContent.schema.ts

export const ContentFindUniqueSchema: z.ZodType<Prisma.ContentFindUniqueArgs> = z.object({ select: ContentSelectObjectSchema.optional(),  where: ContentWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ContentFindUniqueArgs>;

export const ContentFindUniqueZodSchema = z.object({ select: ContentSelectObjectSchema.optional(),  where: ContentWhereUniqueInputObjectSchema }).strict();

// File: findUniqueOrThrowContent.schema.ts

export const ContentFindUniqueOrThrowSchema: z.ZodType<Prisma.ContentFindUniqueOrThrowArgs> = z.object({ select: ContentSelectObjectSchema.optional(),  where: ContentWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ContentFindUniqueOrThrowArgs>;

export const ContentFindUniqueOrThrowZodSchema = z.object({ select: ContentSelectObjectSchema.optional(),  where: ContentWhereUniqueInputObjectSchema }).strict();

// File: findFirstContent.schema.ts

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const ContentFindFirstSelectSchema__findFirstContent_schema: z.ZodType<Prisma.ContentSelect> = z.object({
    uuid: z.boolean().optional(),
    title: z.boolean().optional(),
    url: z.boolean().optional(),
    content_owner: z.boolean().optional(),
    for_position: z.boolean().optional(),
    last_modified_time: z.boolean().optional(),
    expiration_time: z.boolean().optional(),
    content_type: z.boolean().optional(),
    status: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.ContentSelect>;

export const ContentFindFirstSelectZodSchema__findFirstContent_schema = z.object({
    uuid: z.boolean().optional(),
    title: z.boolean().optional(),
    url: z.boolean().optional(),
    content_owner: z.boolean().optional(),
    for_position: z.boolean().optional(),
    last_modified_time: z.boolean().optional(),
    expiration_time: z.boolean().optional(),
    content_type: z.boolean().optional(),
    status: z.boolean().optional()
  }).strict();

export const ContentFindFirstSchema: z.ZodType<Prisma.ContentFindFirstArgs> = z.object({ select: ContentFindFirstSelectSchema__findFirstContent_schema.optional(),  orderBy: z.union([ContentOrderByWithRelationInputObjectSchema, ContentOrderByWithRelationInputObjectSchema.array()]).optional(), where: ContentWhereInputObjectSchema.optional(), cursor: ContentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ContentScalarFieldEnumSchema, ContentScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.ContentFindFirstArgs>;

export const ContentFindFirstZodSchema = z.object({ select: ContentFindFirstSelectSchema__findFirstContent_schema.optional(),  orderBy: z.union([ContentOrderByWithRelationInputObjectSchema, ContentOrderByWithRelationInputObjectSchema.array()]).optional(), where: ContentWhereInputObjectSchema.optional(), cursor: ContentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ContentScalarFieldEnumSchema, ContentScalarFieldEnumSchema.array()]).optional() }).strict();

// File: findFirstOrThrowContent.schema.ts

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const ContentFindFirstOrThrowSelectSchema__findFirstOrThrowContent_schema: z.ZodType<Prisma.ContentSelect> = z.object({
    uuid: z.boolean().optional(),
    title: z.boolean().optional(),
    url: z.boolean().optional(),
    content_owner: z.boolean().optional(),
    for_position: z.boolean().optional(),
    last_modified_time: z.boolean().optional(),
    expiration_time: z.boolean().optional(),
    content_type: z.boolean().optional(),
    status: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.ContentSelect>;

export const ContentFindFirstOrThrowSelectZodSchema__findFirstOrThrowContent_schema = z.object({
    uuid: z.boolean().optional(),
    title: z.boolean().optional(),
    url: z.boolean().optional(),
    content_owner: z.boolean().optional(),
    for_position: z.boolean().optional(),
    last_modified_time: z.boolean().optional(),
    expiration_time: z.boolean().optional(),
    content_type: z.boolean().optional(),
    status: z.boolean().optional()
  }).strict();

export const ContentFindFirstOrThrowSchema: z.ZodType<Prisma.ContentFindFirstOrThrowArgs> = z.object({ select: ContentFindFirstOrThrowSelectSchema__findFirstOrThrowContent_schema.optional(),  orderBy: z.union([ContentOrderByWithRelationInputObjectSchema, ContentOrderByWithRelationInputObjectSchema.array()]).optional(), where: ContentWhereInputObjectSchema.optional(), cursor: ContentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ContentScalarFieldEnumSchema, ContentScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.ContentFindFirstOrThrowArgs>;

export const ContentFindFirstOrThrowZodSchema = z.object({ select: ContentFindFirstOrThrowSelectSchema__findFirstOrThrowContent_schema.optional(),  orderBy: z.union([ContentOrderByWithRelationInputObjectSchema, ContentOrderByWithRelationInputObjectSchema.array()]).optional(), where: ContentWhereInputObjectSchema.optional(), cursor: ContentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ContentScalarFieldEnumSchema, ContentScalarFieldEnumSchema.array()]).optional() }).strict();

// File: findManyContent.schema.ts

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const ContentFindManySelectSchema__findManyContent_schema: z.ZodType<Prisma.ContentSelect> = z.object({
    uuid: z.boolean().optional(),
    title: z.boolean().optional(),
    url: z.boolean().optional(),
    content_owner: z.boolean().optional(),
    for_position: z.boolean().optional(),
    last_modified_time: z.boolean().optional(),
    expiration_time: z.boolean().optional(),
    content_type: z.boolean().optional(),
    status: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.ContentSelect>;

export const ContentFindManySelectZodSchema__findManyContent_schema = z.object({
    uuid: z.boolean().optional(),
    title: z.boolean().optional(),
    url: z.boolean().optional(),
    content_owner: z.boolean().optional(),
    for_position: z.boolean().optional(),
    last_modified_time: z.boolean().optional(),
    expiration_time: z.boolean().optional(),
    content_type: z.boolean().optional(),
    status: z.boolean().optional()
  }).strict();

export const ContentFindManySchema: z.ZodType<Prisma.ContentFindManyArgs> = z.object({ select: ContentFindManySelectSchema__findManyContent_schema.optional(),  orderBy: z.union([ContentOrderByWithRelationInputObjectSchema, ContentOrderByWithRelationInputObjectSchema.array()]).optional(), where: ContentWhereInputObjectSchema.optional(), cursor: ContentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ContentScalarFieldEnumSchema, ContentScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.ContentFindManyArgs>;

export const ContentFindManyZodSchema = z.object({ select: ContentFindManySelectSchema__findManyContent_schema.optional(),  orderBy: z.union([ContentOrderByWithRelationInputObjectSchema, ContentOrderByWithRelationInputObjectSchema.array()]).optional(), where: ContentWhereInputObjectSchema.optional(), cursor: ContentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ContentScalarFieldEnumSchema, ContentScalarFieldEnumSchema.array()]).optional() }).strict();

// File: countContent.schema.ts

export const ContentCountSchema: z.ZodType<Prisma.ContentCountArgs> = z.object({ orderBy: z.union([ContentOrderByWithRelationInputObjectSchema, ContentOrderByWithRelationInputObjectSchema.array()]).optional(), where: ContentWhereInputObjectSchema.optional(), cursor: ContentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ContentCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.ContentCountArgs>;

export const ContentCountZodSchema = z.object({ orderBy: z.union([ContentOrderByWithRelationInputObjectSchema, ContentOrderByWithRelationInputObjectSchema.array()]).optional(), where: ContentWhereInputObjectSchema.optional(), cursor: ContentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ContentCountAggregateInputObjectSchema ]).optional() }).strict();

// File: createOneContent.schema.ts

export const ContentCreateOneSchema: z.ZodType<Prisma.ContentCreateArgs> = z.object({ select: ContentSelectObjectSchema.optional(),  data: z.union([ContentCreateInputObjectSchema, ContentUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.ContentCreateArgs>;

export const ContentCreateOneZodSchema = z.object({ select: ContentSelectObjectSchema.optional(),  data: z.union([ContentCreateInputObjectSchema, ContentUncheckedCreateInputObjectSchema]) }).strict();

// File: createManyContent.schema.ts

export const ContentCreateManySchema: z.ZodType<Prisma.ContentCreateManyArgs> = z.object({ data: z.union([ ContentCreateManyInputObjectSchema, z.array(ContentCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ContentCreateManyArgs>;

export const ContentCreateManyZodSchema = z.object({ data: z.union([ ContentCreateManyInputObjectSchema, z.array(ContentCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();

// File: createManyAndReturnContent.schema.ts

export const ContentCreateManyAndReturnSchema: z.ZodType<Prisma.ContentCreateManyAndReturnArgs> = z.object({ select: ContentSelectObjectSchema.optional(), data: z.union([ ContentCreateManyInputObjectSchema, z.array(ContentCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ContentCreateManyAndReturnArgs>;

export const ContentCreateManyAndReturnZodSchema = z.object({ select: ContentSelectObjectSchema.optional(), data: z.union([ ContentCreateManyInputObjectSchema, z.array(ContentCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();

// File: deleteOneContent.schema.ts

export const ContentDeleteOneSchema: z.ZodType<Prisma.ContentDeleteArgs> = z.object({ select: ContentSelectObjectSchema.optional(),  where: ContentWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ContentDeleteArgs>;

export const ContentDeleteOneZodSchema = z.object({ select: ContentSelectObjectSchema.optional(),  where: ContentWhereUniqueInputObjectSchema }).strict();

// File: deleteManyContent.schema.ts

export const ContentDeleteManySchema: z.ZodType<Prisma.ContentDeleteManyArgs> = z.object({ where: ContentWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ContentDeleteManyArgs>;

export const ContentDeleteManyZodSchema = z.object({ where: ContentWhereInputObjectSchema.optional() }).strict();

// File: updateOneContent.schema.ts

export const ContentUpdateOneSchema: z.ZodType<Prisma.ContentUpdateArgs> = z.object({ select: ContentSelectObjectSchema.optional(),  data: z.union([ContentUpdateInputObjectSchema, ContentUncheckedUpdateInputObjectSchema]), where: ContentWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ContentUpdateArgs>;

export const ContentUpdateOneZodSchema = z.object({ select: ContentSelectObjectSchema.optional(),  data: z.union([ContentUpdateInputObjectSchema, ContentUncheckedUpdateInputObjectSchema]), where: ContentWhereUniqueInputObjectSchema }).strict();

// File: updateManyContent.schema.ts

export const ContentUpdateManySchema: z.ZodType<Prisma.ContentUpdateManyArgs> = z.object({ data: ContentUpdateManyMutationInputObjectSchema, where: ContentWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ContentUpdateManyArgs>;

export const ContentUpdateManyZodSchema = z.object({ data: ContentUpdateManyMutationInputObjectSchema, where: ContentWhereInputObjectSchema.optional() }).strict();

// File: updateManyAndReturnContent.schema.ts

export const ContentUpdateManyAndReturnSchema: z.ZodType<Prisma.ContentUpdateManyAndReturnArgs> = z.object({ select: ContentSelectObjectSchema.optional(), data: ContentUpdateManyMutationInputObjectSchema, where: ContentWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ContentUpdateManyAndReturnArgs>;

export const ContentUpdateManyAndReturnZodSchema = z.object({ select: ContentSelectObjectSchema.optional(), data: ContentUpdateManyMutationInputObjectSchema, where: ContentWhereInputObjectSchema.optional() }).strict();

// File: upsertOneContent.schema.ts

export const ContentUpsertOneSchema: z.ZodType<Prisma.ContentUpsertArgs> = z.object({ select: ContentSelectObjectSchema.optional(),  where: ContentWhereUniqueInputObjectSchema, create: z.union([ ContentCreateInputObjectSchema, ContentUncheckedCreateInputObjectSchema ]), update: z.union([ ContentUpdateInputObjectSchema, ContentUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.ContentUpsertArgs>;

export const ContentUpsertOneZodSchema = z.object({ select: ContentSelectObjectSchema.optional(),  where: ContentWhereUniqueInputObjectSchema, create: z.union([ ContentCreateInputObjectSchema, ContentUncheckedCreateInputObjectSchema ]), update: z.union([ ContentUpdateInputObjectSchema, ContentUncheckedUpdateInputObjectSchema ]) }).strict();

// File: aggregateContent.schema.ts

export const ContentAggregateSchema: z.ZodType<Prisma.ContentAggregateArgs> = z.object({ orderBy: z.union([ContentOrderByWithRelationInputObjectSchema, ContentOrderByWithRelationInputObjectSchema.array()]).optional(), where: ContentWhereInputObjectSchema.optional(), cursor: ContentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), ContentCountAggregateInputObjectSchema ]).optional(), _min: ContentMinAggregateInputObjectSchema.optional(), _max: ContentMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ContentAggregateArgs>;

export const ContentAggregateZodSchema = z.object({ orderBy: z.union([ContentOrderByWithRelationInputObjectSchema, ContentOrderByWithRelationInputObjectSchema.array()]).optional(), where: ContentWhereInputObjectSchema.optional(), cursor: ContentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), ContentCountAggregateInputObjectSchema ]).optional(), _min: ContentMinAggregateInputObjectSchema.optional(), _max: ContentMaxAggregateInputObjectSchema.optional() }).strict();

// File: groupByContent.schema.ts

export const ContentGroupBySchema: z.ZodType<Prisma.ContentGroupByArgs> = z.object({ where: ContentWhereInputObjectSchema.optional(), orderBy: z.union([ContentOrderByWithAggregationInputObjectSchema, ContentOrderByWithAggregationInputObjectSchema.array()]).optional(), having: ContentScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(ContentScalarFieldEnumSchema), _count: z.union([ z.literal(true), ContentCountAggregateInputObjectSchema ]).optional(), _min: ContentMinAggregateInputObjectSchema.optional(), _max: ContentMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ContentGroupByArgs>;

export const ContentGroupByZodSchema = z.object({ where: ContentWhereInputObjectSchema.optional(), orderBy: z.union([ContentOrderByWithAggregationInputObjectSchema, ContentOrderByWithAggregationInputObjectSchema.array()]).optional(), having: ContentScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(ContentScalarFieldEnumSchema), _count: z.union([ z.literal(true), ContentCountAggregateInputObjectSchema ]).optional(), _min: ContentMinAggregateInputObjectSchema.optional(), _max: ContentMaxAggregateInputObjectSchema.optional() }).strict();

// File: findUniqueAccount.schema.ts

export const AccountFindUniqueSchema: z.ZodType<Prisma.AccountFindUniqueArgs> = z.object({ select: AccountSelectObjectSchema.optional(), include: AccountIncludeObjectSchema.optional(), where: AccountWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.AccountFindUniqueArgs>;

export const AccountFindUniqueZodSchema = z.object({ select: AccountSelectObjectSchema.optional(), include: AccountIncludeObjectSchema.optional(), where: AccountWhereUniqueInputObjectSchema }).strict();

// File: findUniqueOrThrowAccount.schema.ts

export const AccountFindUniqueOrThrowSchema: z.ZodType<Prisma.AccountFindUniqueOrThrowArgs> = z.object({ select: AccountSelectObjectSchema.optional(), include: AccountIncludeObjectSchema.optional(), where: AccountWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.AccountFindUniqueOrThrowArgs>;

export const AccountFindUniqueOrThrowZodSchema = z.object({ select: AccountSelectObjectSchema.optional(), include: AccountIncludeObjectSchema.optional(), where: AccountWhereUniqueInputObjectSchema }).strict();

// File: findFirstAccount.schema.ts

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const AccountFindFirstSelectSchema__findFirstAccount_schema: z.ZodType<Prisma.AccountSelect> = z.object({
    employee: z.boolean().optional(),
    employeeUuid: z.boolean().optional(),
    username: z.boolean().optional(),
    password: z.boolean().optional(),
    type: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.AccountSelect>;

export const AccountFindFirstSelectZodSchema__findFirstAccount_schema = z.object({
    employee: z.boolean().optional(),
    employeeUuid: z.boolean().optional(),
    username: z.boolean().optional(),
    password: z.boolean().optional(),
    type: z.boolean().optional()
  }).strict();

export const AccountFindFirstSchema: z.ZodType<Prisma.AccountFindFirstArgs> = z.object({ select: AccountFindFirstSelectSchema__findFirstAccount_schema.optional(), include: z.lazy(() => AccountIncludeObjectSchema.optional()), orderBy: z.union([AccountOrderByWithRelationInputObjectSchema, AccountOrderByWithRelationInputObjectSchema.array()]).optional(), where: AccountWhereInputObjectSchema.optional(), cursor: AccountWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AccountScalarFieldEnumSchema, AccountScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.AccountFindFirstArgs>;

export const AccountFindFirstZodSchema = z.object({ select: AccountFindFirstSelectSchema__findFirstAccount_schema.optional(), include: z.lazy(() => AccountIncludeObjectSchema.optional()), orderBy: z.union([AccountOrderByWithRelationInputObjectSchema, AccountOrderByWithRelationInputObjectSchema.array()]).optional(), where: AccountWhereInputObjectSchema.optional(), cursor: AccountWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AccountScalarFieldEnumSchema, AccountScalarFieldEnumSchema.array()]).optional() }).strict();

// File: findFirstOrThrowAccount.schema.ts

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const AccountFindFirstOrThrowSelectSchema__findFirstOrThrowAccount_schema: z.ZodType<Prisma.AccountSelect> = z.object({
    employee: z.boolean().optional(),
    employeeUuid: z.boolean().optional(),
    username: z.boolean().optional(),
    password: z.boolean().optional(),
    type: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.AccountSelect>;

export const AccountFindFirstOrThrowSelectZodSchema__findFirstOrThrowAccount_schema = z.object({
    employee: z.boolean().optional(),
    employeeUuid: z.boolean().optional(),
    username: z.boolean().optional(),
    password: z.boolean().optional(),
    type: z.boolean().optional()
  }).strict();

export const AccountFindFirstOrThrowSchema: z.ZodType<Prisma.AccountFindFirstOrThrowArgs> = z.object({ select: AccountFindFirstOrThrowSelectSchema__findFirstOrThrowAccount_schema.optional(), include: z.lazy(() => AccountIncludeObjectSchema.optional()), orderBy: z.union([AccountOrderByWithRelationInputObjectSchema, AccountOrderByWithRelationInputObjectSchema.array()]).optional(), where: AccountWhereInputObjectSchema.optional(), cursor: AccountWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AccountScalarFieldEnumSchema, AccountScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.AccountFindFirstOrThrowArgs>;

export const AccountFindFirstOrThrowZodSchema = z.object({ select: AccountFindFirstOrThrowSelectSchema__findFirstOrThrowAccount_schema.optional(), include: z.lazy(() => AccountIncludeObjectSchema.optional()), orderBy: z.union([AccountOrderByWithRelationInputObjectSchema, AccountOrderByWithRelationInputObjectSchema.array()]).optional(), where: AccountWhereInputObjectSchema.optional(), cursor: AccountWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AccountScalarFieldEnumSchema, AccountScalarFieldEnumSchema.array()]).optional() }).strict();

// File: findManyAccount.schema.ts

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const AccountFindManySelectSchema__findManyAccount_schema: z.ZodType<Prisma.AccountSelect> = z.object({
    employee: z.boolean().optional(),
    employeeUuid: z.boolean().optional(),
    username: z.boolean().optional(),
    password: z.boolean().optional(),
    type: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.AccountSelect>;

export const AccountFindManySelectZodSchema__findManyAccount_schema = z.object({
    employee: z.boolean().optional(),
    employeeUuid: z.boolean().optional(),
    username: z.boolean().optional(),
    password: z.boolean().optional(),
    type: z.boolean().optional()
  }).strict();

export const AccountFindManySchema: z.ZodType<Prisma.AccountFindManyArgs> = z.object({ select: AccountFindManySelectSchema__findManyAccount_schema.optional(), include: z.lazy(() => AccountIncludeObjectSchema.optional()), orderBy: z.union([AccountOrderByWithRelationInputObjectSchema, AccountOrderByWithRelationInputObjectSchema.array()]).optional(), where: AccountWhereInputObjectSchema.optional(), cursor: AccountWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AccountScalarFieldEnumSchema, AccountScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.AccountFindManyArgs>;

export const AccountFindManyZodSchema = z.object({ select: AccountFindManySelectSchema__findManyAccount_schema.optional(), include: z.lazy(() => AccountIncludeObjectSchema.optional()), orderBy: z.union([AccountOrderByWithRelationInputObjectSchema, AccountOrderByWithRelationInputObjectSchema.array()]).optional(), where: AccountWhereInputObjectSchema.optional(), cursor: AccountWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AccountScalarFieldEnumSchema, AccountScalarFieldEnumSchema.array()]).optional() }).strict();

// File: countAccount.schema.ts

export const AccountCountSchema: z.ZodType<Prisma.AccountCountArgs> = z.object({ orderBy: z.union([AccountOrderByWithRelationInputObjectSchema, AccountOrderByWithRelationInputObjectSchema.array()]).optional(), where: AccountWhereInputObjectSchema.optional(), cursor: AccountWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), AccountCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.AccountCountArgs>;

export const AccountCountZodSchema = z.object({ orderBy: z.union([AccountOrderByWithRelationInputObjectSchema, AccountOrderByWithRelationInputObjectSchema.array()]).optional(), where: AccountWhereInputObjectSchema.optional(), cursor: AccountWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), AccountCountAggregateInputObjectSchema ]).optional() }).strict();

// File: createOneAccount.schema.ts

export const AccountCreateOneSchema: z.ZodType<Prisma.AccountCreateArgs> = z.object({ select: AccountSelectObjectSchema.optional(), include: AccountIncludeObjectSchema.optional(), data: z.union([AccountCreateInputObjectSchema, AccountUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.AccountCreateArgs>;

export const AccountCreateOneZodSchema = z.object({ select: AccountSelectObjectSchema.optional(), include: AccountIncludeObjectSchema.optional(), data: z.union([AccountCreateInputObjectSchema, AccountUncheckedCreateInputObjectSchema]) }).strict();

// File: createManyAccount.schema.ts

export const AccountCreateManySchema: z.ZodType<Prisma.AccountCreateManyArgs> = z.object({ data: z.union([ AccountCreateManyInputObjectSchema, z.array(AccountCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.AccountCreateManyArgs>;

export const AccountCreateManyZodSchema = z.object({ data: z.union([ AccountCreateManyInputObjectSchema, z.array(AccountCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();

// File: createManyAndReturnAccount.schema.ts

export const AccountCreateManyAndReturnSchema: z.ZodType<Prisma.AccountCreateManyAndReturnArgs> = z.object({ select: AccountSelectObjectSchema.optional(), data: z.union([ AccountCreateManyInputObjectSchema, z.array(AccountCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.AccountCreateManyAndReturnArgs>;

export const AccountCreateManyAndReturnZodSchema = z.object({ select: AccountSelectObjectSchema.optional(), data: z.union([ AccountCreateManyInputObjectSchema, z.array(AccountCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();

// File: deleteOneAccount.schema.ts

export const AccountDeleteOneSchema: z.ZodType<Prisma.AccountDeleteArgs> = z.object({ select: AccountSelectObjectSchema.optional(), include: AccountIncludeObjectSchema.optional(), where: AccountWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.AccountDeleteArgs>;

export const AccountDeleteOneZodSchema = z.object({ select: AccountSelectObjectSchema.optional(), include: AccountIncludeObjectSchema.optional(), where: AccountWhereUniqueInputObjectSchema }).strict();

// File: deleteManyAccount.schema.ts

export const AccountDeleteManySchema: z.ZodType<Prisma.AccountDeleteManyArgs> = z.object({ where: AccountWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.AccountDeleteManyArgs>;

export const AccountDeleteManyZodSchema = z.object({ where: AccountWhereInputObjectSchema.optional() }).strict();

// File: updateOneAccount.schema.ts

export const AccountUpdateOneSchema: z.ZodType<Prisma.AccountUpdateArgs> = z.object({ select: AccountSelectObjectSchema.optional(), include: AccountIncludeObjectSchema.optional(), data: z.union([AccountUpdateInputObjectSchema, AccountUncheckedUpdateInputObjectSchema]), where: AccountWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.AccountUpdateArgs>;

export const AccountUpdateOneZodSchema = z.object({ select: AccountSelectObjectSchema.optional(), include: AccountIncludeObjectSchema.optional(), data: z.union([AccountUpdateInputObjectSchema, AccountUncheckedUpdateInputObjectSchema]), where: AccountWhereUniqueInputObjectSchema }).strict();

// File: updateManyAccount.schema.ts

export const AccountUpdateManySchema: z.ZodType<Prisma.AccountUpdateManyArgs> = z.object({ data: AccountUpdateManyMutationInputObjectSchema, where: AccountWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.AccountUpdateManyArgs>;

export const AccountUpdateManyZodSchema = z.object({ data: AccountUpdateManyMutationInputObjectSchema, where: AccountWhereInputObjectSchema.optional() }).strict();

// File: updateManyAndReturnAccount.schema.ts

export const AccountUpdateManyAndReturnSchema: z.ZodType<Prisma.AccountUpdateManyAndReturnArgs> = z.object({ select: AccountSelectObjectSchema.optional(), data: AccountUpdateManyMutationInputObjectSchema, where: AccountWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.AccountUpdateManyAndReturnArgs>;

export const AccountUpdateManyAndReturnZodSchema = z.object({ select: AccountSelectObjectSchema.optional(), data: AccountUpdateManyMutationInputObjectSchema, where: AccountWhereInputObjectSchema.optional() }).strict();

// File: upsertOneAccount.schema.ts

export const AccountUpsertOneSchema: z.ZodType<Prisma.AccountUpsertArgs> = z.object({ select: AccountSelectObjectSchema.optional(), include: AccountIncludeObjectSchema.optional(), where: AccountWhereUniqueInputObjectSchema, create: z.union([ AccountCreateInputObjectSchema, AccountUncheckedCreateInputObjectSchema ]), update: z.union([ AccountUpdateInputObjectSchema, AccountUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.AccountUpsertArgs>;

export const AccountUpsertOneZodSchema = z.object({ select: AccountSelectObjectSchema.optional(), include: AccountIncludeObjectSchema.optional(), where: AccountWhereUniqueInputObjectSchema, create: z.union([ AccountCreateInputObjectSchema, AccountUncheckedCreateInputObjectSchema ]), update: z.union([ AccountUpdateInputObjectSchema, AccountUncheckedUpdateInputObjectSchema ]) }).strict();

// File: aggregateAccount.schema.ts

export const AccountAggregateSchema: z.ZodType<Prisma.AccountAggregateArgs> = z.object({ orderBy: z.union([AccountOrderByWithRelationInputObjectSchema, AccountOrderByWithRelationInputObjectSchema.array()]).optional(), where: AccountWhereInputObjectSchema.optional(), cursor: AccountWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), AccountCountAggregateInputObjectSchema ]).optional(), _min: AccountMinAggregateInputObjectSchema.optional(), _max: AccountMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.AccountAggregateArgs>;

export const AccountAggregateZodSchema = z.object({ orderBy: z.union([AccountOrderByWithRelationInputObjectSchema, AccountOrderByWithRelationInputObjectSchema.array()]).optional(), where: AccountWhereInputObjectSchema.optional(), cursor: AccountWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), AccountCountAggregateInputObjectSchema ]).optional(), _min: AccountMinAggregateInputObjectSchema.optional(), _max: AccountMaxAggregateInputObjectSchema.optional() }).strict();

// File: groupByAccount.schema.ts

export const AccountGroupBySchema: z.ZodType<Prisma.AccountGroupByArgs> = z.object({ where: AccountWhereInputObjectSchema.optional(), orderBy: z.union([AccountOrderByWithAggregationInputObjectSchema, AccountOrderByWithAggregationInputObjectSchema.array()]).optional(), having: AccountScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(AccountScalarFieldEnumSchema), _count: z.union([ z.literal(true), AccountCountAggregateInputObjectSchema ]).optional(), _min: AccountMinAggregateInputObjectSchema.optional(), _max: AccountMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.AccountGroupByArgs>;

export const AccountGroupByZodSchema = z.object({ where: AccountWhereInputObjectSchema.optional(), orderBy: z.union([AccountOrderByWithAggregationInputObjectSchema, AccountOrderByWithAggregationInputObjectSchema.array()]).optional(), having: AccountScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(AccountScalarFieldEnumSchema), _count: z.union([ z.literal(true), AccountCountAggregateInputObjectSchema ]).optional(), _min: AccountMinAggregateInputObjectSchema.optional(), _max: AccountMaxAggregateInputObjectSchema.optional() }).strict();

// File: EmployeeFindUniqueResult.schema.ts
export const EmployeeFindUniqueResultSchema = z.nullable(z.object({
  uuid: z.string(),
  account: z.unknown().optional(),
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
export const EmployeeAggregateResultSchema = z.object({  _count: z.object({
    uuid: z.number(),
    account: z.number(),
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
    first_name: z.string().nullable(),
    last_name: z.string().nullable(),
    date_of_birth: z.date().nullable(),
    start_date: z.date().nullable(),
    supervisor: z.string().nullable(),
    phone_number: z.string().nullable(),
    personal_email: z.string().nullable(),
    corporate_email: z.string().nullable()
  }).nullable().optional()});

// File: EmployeeGroupByResult.schema.ts
export const EmployeeGroupByResultSchema = z.array(z.object({
  uuid: z.string(),
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
  status: z.unknown()
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
  status: z.unknown()
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
  status: z.unknown()
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
  status: z.unknown()
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
  status: z.unknown()
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
  status: z.unknown()
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
  status: z.unknown()
}));

// File: ContentDeleteManyResult.schema.ts
export const ContentDeleteManyResultSchema = z.object({
  count: z.number()
});

// File: ContentAggregateResult.schema.ts
export const ContentAggregateResultSchema = z.object({  _count: z.object({
    uuid: z.number(),
    title: z.number(),
    url: z.number(),
    content_owner: z.number(),
    for_position: z.number(),
    last_modified_time: z.number(),
    expiration_time: z.number(),
    content_type: z.number(),
    status: z.number()
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
  }).nullable().optional()});

// File: ContentGroupByResult.schema.ts
export const ContentGroupByResultSchema = z.array(z.object({
  uuid: z.string(),
  title: z.string(),
  url: z.string(),
  content_owner: z.string(),
  last_modified_time: z.date(),
  expiration_time: z.date(),
  _count: z.object({
    uuid: z.number(),
    title: z.number(),
    url: z.number(),
    content_owner: z.number(),
    for_position: z.number(),
    last_modified_time: z.number(),
    expiration_time: z.number(),
    content_type: z.number(),
    status: z.number()
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
export const AccountAggregateResultSchema = z.object({  _count: z.object({
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
  }).nullable().optional()});

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

