export type SpecialTab = "favorites" | "recent" | "checked-out";
export type TabKey = string | SpecialTab;

export const SPECIAL_TABS: { key: SpecialTab; label: string }[] = [
  { key: "favorites", label: "Favorites" },
  { key: "recent", label: "Recently Viewed" },
  { key: "checked-out", label: "Checked Out" },
];
