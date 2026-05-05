import type { Position } from "@repo/db";

import type { ContentRow } from "./content";

import type { EmployeeRecord } from "./employee";

export type ActivityCategory = "all" | "content" | "verbose" | "auth" | "claim";

export interface ActivityEmployee {
  uuid: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
}

export interface ActivityRow {
  uuid: string;
  action: string;
  resource?: string | null;
  resourceUuid?: string | null;
  resourceName?: string | null;
  employeeUuid?: string | null;
  timestamp: string;
  employee?: ActivityEmployee | null;
}

//Type for "Employee Activity" dashboard cart
export type ActivitySummary = {
  edited: number;
  checkedOut: number;
  deleted: number;
};

export interface EditHitsRow {
  date: string;
  UNDERWRITER?: number;
  BUSINESS_ANALYST?: number;
  ACTUARIAL_ANALYST?: number;
  EXL_OPERATIONS?: number;
  BUSINESS_OP_RATING?: number;
  ADMIN?: number;
}

export type PositionCounts = Record<Position, number>;

export interface FileTypeCount {
  type: string;
  count: number;
}

export interface DashboardBootstrapData {
  activityAll: ActivityRow[];
  activityContent: ActivityRow[];
  activityVerbose: ActivityRow[];
  activityClaim: ActivityRow[];
  contentCounts: PositionCounts;
  fileTypeCounts: FileTypeCount[];
  employeeCounts: PositionCounts;
  contentList: ContentRow[];
  activitySummary: ActivitySummary;
  employees: EmployeeRecord[];
  editHitsByRole: EditHitsRow[];
}
