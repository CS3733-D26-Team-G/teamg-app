import { type ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

//dnd kit stuff
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
  | "file-types"
  | "popular-content-search"
  | "employee-edits-by-day";
export default function EditableDashboardCard({
  id,
  children,
  className = "",
}: {
  id: dashboardCardID;
  children: ReactNode;
  className?: string;
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
        transform: CSS.Transform.toString(transform),
        transition,
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
