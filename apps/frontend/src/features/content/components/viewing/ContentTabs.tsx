/**
 * ContentTabs.tsx
 *
 * A custom hook that manages tab/accordion view state for the Content Manager.
 * Handles three special tabs (Favorites, Recently Viewed, Checked Out) as well
 * as position-based tabs derived from filtered content rows.
 *
 * - View mode (tabs vs accordion) is persisted to localStorage per employee.
 * - The active tab defaults to the user's position, falling back to "favorites".
 * - Recently viewed entries are re-read from localStorage whenever the content
 *   list updates or the active tab changes, keeping the list fresh without
 *   requiring a manual tab click.
 */

import { useMemo, useState, useEffect } from "react";
import type { ContentRow } from "../../../../types/content.ts";
import type { Position } from "@repo/db";
import { getRecentlyViewed, clearRecentlyViewed } from "./RecentlyViewed.tsx";
import {
  SPECIAL_TABS,
  type TabKey,
  type SpecialTab,
} from "./ContentTabsConfig.ts";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContentTabsOptions {
  /** The full filtered content row list, after search/filter has been applied. */
  filteredRows: ContentRow[];
  /** UUID of the currently authenticated employee; undefined while session loads. */
  employeeUuid: string | undefined;
  /** The employee's assigned position, used to set the initial active tab. */
  userPosition: Position | null;
  /** When true, the Checked Out tab shows all locked content, not just the user's. */
  isSystemAdmin: boolean;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function ContentTabs({
  filteredRows,
  employeeUuid,
  userPosition,
  isSystemAdmin,
}: ContentTabsOptions) {
  // ─── State ─────────────────────────────────────────────────────────────────

  // null until employeeUuid resolves, preventing a flash of the wrong mode
  const [viewMode, setViewMode] = useState<"tabs" | "accordion" | null>(null);

  // defaults to the user's position tab, or "favorites" if no position is set
  const [activeTab, setActiveTab] = useState<TabKey>(
    () => userPosition ?? "favorites",
  );

  // recently viewed entries read from localStorage; refreshed automatically
  const [recentEntries, setRecentEntries] = useState(() =>
    employeeUuid ? getRecentlyViewed(employeeUuid) : [],
  );

  // ─── Effects ───────────────────────────────────────────────────────────────

  // read the persisted view mode once employeeUuid is available
  useEffect(() => {
    if (!employeeUuid) return;
    const saved = localStorage.getItem(`contentMgmt_viewMode_${employeeUuid}`);
    setViewMode(saved === "accordion" ? "accordion" : "tabs");
  }, [employeeUuid]);

  // persist view mode changes; guarded so null is never written
  useEffect(() => {
    if (!employeeUuid || !viewMode) return;
    localStorage.setItem(`contentMgmt_viewMode_${employeeUuid}`, viewMode);
  }, [viewMode, employeeUuid]);

  // load entries as soon as we know who the user is
  useEffect(() => {
    if (employeeUuid) {
      setRecentEntries(getRecentlyViewed(employeeUuid));
    }
  }, [employeeUuid]);

  // keep entries fresh when the tab is switched to
  useEffect(() => {
    if (employeeUuid && activeTab === "recent") {
      setRecentEntries(getRecentlyViewed(employeeUuid));
    }
  }, [activeTab, employeeUuid]);

  // ─── Derived values ────────────────────────────────────────────────────────

  const specialTabRows = useMemo<Record<SpecialTab, ContentRow[]>>(
    () => ({
      // rows the employee has marked as a favorite
      "favorites": filteredRows.filter((r: ContentRow) => r.is_favorite),

      // up to 25 recently viewed rows, sorted most-recent first
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

      // admins see all locked rows; regular users only see their own
      "checked-out": filteredRows.filter((r: ContentRow) =>
        isSystemAdmin ?
          r.isLocked
        : r.isLocked && r.editLock?.lockedByEmp?.uuid === employeeUuid,
      ),
    }),
    [filteredRows, employeeUuid, recentEntries, isSystemAdmin],
  );

  /** Returns true if the given tab key refers to one of the three special tabs. */
  const isSpecialTab = (key: TabKey): key is SpecialTab =>
    SPECIAL_TABS.some((t) => t.key === key);

  // rows shown in the currently active tab
  const activeRows =
    isSpecialTab(activeTab) ?
      specialTabRows[activeTab]
    : filteredRows.filter((r: ContentRow) => r.forPosition === activeTab);

  // ─── Return ────────────────────────────────────────────────────────────────

  return {
    viewMode,
    setViewMode,
    activeTab,
    setActiveTab,
    specialTabRows,
    activeRows,
    isSpecialTab,
    refreshRecentEntries: () => {
      if (employeeUuid) setRecentEntries(getRecentlyViewed(employeeUuid));
    },
    clearRecentEntries: () => {
      if (employeeUuid) {
        clearRecentlyViewed(employeeUuid);
        setRecentEntries([]);
      }
    },
  };
}
