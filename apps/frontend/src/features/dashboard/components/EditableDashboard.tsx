import { type CSSProperties, type ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export type dashboardCardID =
  | "employee-demographics"
  | "recent-activity"
  | "role-ba"
  | "role-uw"
  | "role-actuarial"
  | "role-exl"
  | "role-bus-ops"
  | "role-counts"
  | "employee-activity"
  | "recently-viewed"
  | "file-types"
  | "popular-content-search"
  | "employee-edits-by-day";

export default function EditableDashboardCard({
  id,
  children,
  className = "",
  style,
}: {
  id: dashboardCardID;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`${className} cursor-grab active:cursor-grabbing`}
      style={{
        ...style,
        transform: CSS.Transform.toString(transform),
        transition,
        position: "relative",
        opacity: isDragging ? 0.65 : 1,
        zIndex: isDragging ? 20 : "auto",
      }}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}
