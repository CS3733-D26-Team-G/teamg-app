import { useMemo, useState, useEffect } from "react";
import type { ContentRow } from "../../../../types/content.ts";
import type { Position } from "@repo/db";
import { getRecentlyViewed } from "./RecentlyViewed.tsx";

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

  // re-read localStorage whenever the tab becomes active so the list stays fresh
  const [recentEntries, setRecentEntries] = useState(() =>
    employeeUuid ? getRecentlyViewed(employeeUuid) : [],
  );

  useEffect(() => {
    if (activeTab === "recent" && employeeUuid) {
      setRecentEntries(getRecentlyViewed(employeeUuid));
    }
  }, [activeTab, employeeUuid]);

  const specialTabRows = useMemo<Record<SpecialTab, ContentRow[]>>(
    () => ({
      "favorites": filteredRows.filter((r: ContentRow) => r.is_favorite),
      "recent": (() => {
        if (!employeeUuid || recentEntries.length === 0) return [];
        const viewedAtMap = new Map(
          recentEntries.map((e) => [e.uuid, e.viewedAt]),
        );
        return filteredRows
          .filter((r: ContentRow) => viewedAtMap.has(r.uuid))
          .sort(
            (a, b) =>
              (viewedAtMap.get(b.uuid) ?? 0) - (viewedAtMap.get(a.uuid) ?? 0),
          )
          .slice(0, 25);
      })(),
      "checked-out": filteredRows.filter((r: ContentRow) =>
        isSystemAdmin ?
          r.isLocked
        : r.isLocked && r.editLock?.lockedByEmp?.uuid === employeeUuid,
      ),
    }),
    [filteredRows, employeeUuid, recentEntries],
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
