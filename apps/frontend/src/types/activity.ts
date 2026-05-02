import type { Position } from "@repo/db";

import type { ContentRow } from "./content";

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
}
