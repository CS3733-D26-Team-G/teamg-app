import * as $Enums from "./enums.ts";
import type * as Prisma from "./internal/prismaNamespace.ts";
export type UuidFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedUuidFilter<$PrismaModel> | string;
};
export type StringFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringFilter<$PrismaModel> | string;
};
export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string;
};
export type EnumPositionFilter<$PrismaModel = never> = {
    equals?: $Enums.Position | Prisma.EnumPositionFieldRefInput<$PrismaModel>;
    in?: $Enums.Position[] | Prisma.ListEnumPositionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Position[] | Prisma.ListEnumPositionFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPositionFilter<$PrismaModel> | $Enums.Position;
};
export type EnumDepartmentFilter<$PrismaModel = never> = {
    equals?: $Enums.Department | Prisma.EnumDepartmentFieldRefInput<$PrismaModel>;
    in?: $Enums.Department[] | Prisma.ListEnumDepartmentFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Department[] | Prisma.ListEnumDepartmentFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumDepartmentFilter<$PrismaModel> | $Enums.Department;
};
export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedUuidWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeFilter<$PrismaModel>;
};
export type EnumPositionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Position | Prisma.EnumPositionFieldRefInput<$PrismaModel>;
    in?: $Enums.Position[] | Prisma.ListEnumPositionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Position[] | Prisma.ListEnumPositionFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPositionWithAggregatesFilter<$PrismaModel> | $Enums.Position;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPositionFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPositionFilter<$PrismaModel>;
};
export type EnumDepartmentWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Department | Prisma.EnumDepartmentFieldRefInput<$PrismaModel>;
    in?: $Enums.Department[] | Prisma.ListEnumDepartmentFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Department[] | Prisma.ListEnumDepartmentFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumDepartmentWithAggregatesFilter<$PrismaModel> | $Enums.Department;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumDepartmentFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumDepartmentFilter<$PrismaModel>;
};
export type EnumContentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ContentType | Prisma.EnumContentTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.ContentType[] | Prisma.ListEnumContentTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ContentType[] | Prisma.ListEnumContentTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumContentTypeFilter<$PrismaModel> | $Enums.ContentType;
};
export type EnumContentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ContentStatus | Prisma.EnumContentStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ContentStatus[] | Prisma.ListEnumContentStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ContentStatus[] | Prisma.ListEnumContentStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumContentStatusFilter<$PrismaModel> | $Enums.ContentStatus;
};
export type EnumContentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ContentType | Prisma.EnumContentTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.ContentType[] | Prisma.ListEnumContentTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ContentType[] | Prisma.ListEnumContentTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumContentTypeWithAggregatesFilter<$PrismaModel> | $Enums.ContentType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumContentTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumContentTypeFilter<$PrismaModel>;
};
export type EnumContentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ContentStatus | Prisma.EnumContentStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ContentStatus[] | Prisma.ListEnumContentStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ContentStatus[] | Prisma.ListEnumContentStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumContentStatusWithAggregatesFilter<$PrismaModel> | $Enums.ContentStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumContentStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumContentStatusFilter<$PrismaModel>;
};
export type EnumAccountTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountType | Prisma.EnumAccountTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.AccountType[] | Prisma.ListEnumAccountTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AccountType[] | Prisma.ListEnumAccountTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAccountTypeFilter<$PrismaModel> | $Enums.AccountType;
};
export type EnumAccountTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountType | Prisma.EnumAccountTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.AccountType[] | Prisma.ListEnumAccountTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AccountType[] | Prisma.ListEnumAccountTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAccountTypeWithAggregatesFilter<$PrismaModel> | $Enums.AccountType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumAccountTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumAccountTypeFilter<$PrismaModel>;
};
export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedUuidFilter<$PrismaModel> | string;
};
export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringFilter<$PrismaModel> | string;
};
export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string;
};
export type NestedEnumPositionFilter<$PrismaModel = never> = {
    equals?: $Enums.Position | Prisma.EnumPositionFieldRefInput<$PrismaModel>;
    in?: $Enums.Position[] | Prisma.ListEnumPositionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Position[] | Prisma.ListEnumPositionFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPositionFilter<$PrismaModel> | $Enums.Position;
};
export type NestedEnumDepartmentFilter<$PrismaModel = never> = {
    equals?: $Enums.Department | Prisma.EnumDepartmentFieldRefInput<$PrismaModel>;
    in?: $Enums.Department[] | Prisma.ListEnumDepartmentFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Department[] | Prisma.ListEnumDepartmentFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumDepartmentFilter<$PrismaModel> | $Enums.Department;
};
export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedUuidWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntFilter<$PrismaModel> | number;
};
export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeFilter<$PrismaModel>;
};
export type NestedEnumPositionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Position | Prisma.EnumPositionFieldRefInput<$PrismaModel>;
    in?: $Enums.Position[] | Prisma.ListEnumPositionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Position[] | Prisma.ListEnumPositionFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPositionWithAggregatesFilter<$PrismaModel> | $Enums.Position;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPositionFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPositionFilter<$PrismaModel>;
};
export type NestedEnumDepartmentWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Department | Prisma.EnumDepartmentFieldRefInput<$PrismaModel>;
    in?: $Enums.Department[] | Prisma.ListEnumDepartmentFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Department[] | Prisma.ListEnumDepartmentFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumDepartmentWithAggregatesFilter<$PrismaModel> | $Enums.Department;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumDepartmentFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumDepartmentFilter<$PrismaModel>;
};
export type NestedEnumContentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ContentType | Prisma.EnumContentTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.ContentType[] | Prisma.ListEnumContentTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ContentType[] | Prisma.ListEnumContentTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumContentTypeFilter<$PrismaModel> | $Enums.ContentType;
};
export type NestedEnumContentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ContentStatus | Prisma.EnumContentStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ContentStatus[] | Prisma.ListEnumContentStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ContentStatus[] | Prisma.ListEnumContentStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumContentStatusFilter<$PrismaModel> | $Enums.ContentStatus;
};
export type NestedEnumContentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ContentType | Prisma.EnumContentTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.ContentType[] | Prisma.ListEnumContentTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ContentType[] | Prisma.ListEnumContentTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumContentTypeWithAggregatesFilter<$PrismaModel> | $Enums.ContentType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumContentTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumContentTypeFilter<$PrismaModel>;
};
export type NestedEnumContentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ContentStatus | Prisma.EnumContentStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ContentStatus[] | Prisma.ListEnumContentStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ContentStatus[] | Prisma.ListEnumContentStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumContentStatusWithAggregatesFilter<$PrismaModel> | $Enums.ContentStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumContentStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumContentStatusFilter<$PrismaModel>;
};
export type NestedEnumAccountTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountType | Prisma.EnumAccountTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.AccountType[] | Prisma.ListEnumAccountTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AccountType[] | Prisma.ListEnumAccountTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAccountTypeFilter<$PrismaModel> | $Enums.AccountType;
};
export type NestedEnumAccountTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountType | Prisma.EnumAccountTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.AccountType[] | Prisma.ListEnumAccountTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AccountType[] | Prisma.ListEnumAccountTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAccountTypeWithAggregatesFilter<$PrismaModel> | $Enums.AccountType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumAccountTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumAccountTypeFilter<$PrismaModel>;
};
//# sourceMappingURL=commonInputTypes.d.ts.map