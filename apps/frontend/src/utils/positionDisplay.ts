import type { ChipProps } from "@mui/material";
import type { Position } from "@repo/db";

const POSITION_LABEL_OVERRIDES: Partial<Record<Position, string>> = {
  EXL_OPERATIONS: "EXL Operations",
};

const POSITION_COLOR_OVERRIDES: Partial<Record<Position, ChipProps["color"]>> =
  {
    ADMIN: "error",
    UNDERWRITER: "info",
    BUSINESS_ANALYST: "success",
  };

function toTitleCase(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function humanizeEnumValue(value: string): string {
  return value
    .split("_")
    .map((word) => (word === "EXL" ? word : toTitleCase(word)))
    .join(" ");
}

export function getPositionLabel(position: Position): string {
  return POSITION_LABEL_OVERRIDES[position] ?? humanizeEnumValue(position);
}

export function getPositionChipColor(position: Position): ChipProps["color"] {
  return POSITION_COLOR_OVERRIDES[position] ?? "default";
}
