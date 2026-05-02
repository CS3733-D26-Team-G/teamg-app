import { useMemo, useState } from "react";
import type { ContentRow } from "../../../types/content";
import type { Position } from "@repo/db";

type SpecialTab = "favorites" | "recent" | "checked-out";
export type TabKey = string | SpecialTab;

export const SPECIAL_TABS: { key: SpecialTab; label: string }[] = [
  { key: "favorites", label: "Favorites" },
  { key: "recent", label: "Recently Viewed" },
  { key: "checked-out", label: "Checked Out" },
];

interface ContentTabsOptions {
  filteredRows: ContentRow[];
  employeeUuid: string | undefined;
  userPosition: Position | null;
  isSystemAdmin: boolean;
}

export function ContentTabs({
  filteredRows,
  employeeUuid,
  userPosition,
  isSystemAdmin,
}: ContentTabsOptions) {
  const [viewMode, setViewMode] = useState<"accordion" | "tabs">(
    () =>
      (localStorage.getItem("contentMgmt_viewMode") as "accordion" | "tabs") ??
      "accordion",
  );

  const [activeTab, setActiveTab] = useState<TabKey>(
    () => userPosition ?? "favorites",
  );

  const specialTabRows = useMemo<Record<SpecialTab, ContentRow[]>>(
    () => ({
      "favorites": filteredRows.filter((r: ContentRow) => r.is_favorite),
      "recent": filteredRows
        .filter((r: ContentRow) => r.lastModifiedTime)
        .sort(
          (a: ContentRow, b: ContentRow) =>
            new Date(b.lastModifiedTime!).getTime() -
            new Date(a.lastModifiedTime!).getTime(),
        )
        .slice(0, 25),
      "checked-out": filteredRows.filter((r: ContentRow) =>
        isSystemAdmin ?
          r.isLocked // admins see all locked files
        : r.isLocked && r.editLock?.lockedByEmp?.uuid === employeeUuid,
      ),
    }),
    [filteredRows, employeeUuid],
  );

  const isSpecialTab = (key: TabKey): key is SpecialTab =>
    SPECIAL_TABS.some((t) => t.key === key);

  const activeRows =
    isSpecialTab(activeTab) ?
      specialTabRows[activeTab]
    : filteredRows.filter((r: ContentRow) => r.forPosition === activeTab);

  return {
    viewMode,
    setViewMode,
    activeTab,
    setActiveTab,
    specialTabRows,
    activeRows,
    isSpecialTab,
  };
}
