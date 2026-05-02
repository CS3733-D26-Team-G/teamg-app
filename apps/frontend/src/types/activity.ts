import type { Position } from "@repo/db";

import type { ContentRow } from "./content";

export type ActivityCategory = "all" | "content" | "verbose" | "auth";

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

export type PositionCounts = Record<Position, number>;

export interface FileTypeCount {
  type: string;
  count: number;
}

export interface DashboardBootstrapData {
  activityAll: ActivityRow[];
  activityContent: ActivityRow[];
  activityVerbose: ActivityRow[];
  contentCounts: PositionCounts;
  fileTypeCounts: FileTypeCount[];
  employeeCounts: PositionCounts;
  contentList: ContentRow[];
}
