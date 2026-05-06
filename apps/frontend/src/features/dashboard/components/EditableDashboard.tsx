import {
  type CSSProperties,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Box,
  Chip,
  IconButton,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useTranslation } from "react-i18next";

// ─── Types ────────────────────────────────────────────────────────────────────

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

export interface DashboardRow {
  id: string;
  label: string;
  cardIds: dashboardCardID[];
  visible: boolean;
}

// ─── Edit Mode Context ────────────────────────────────────────────────────────

const EditModeContext = createContext<{ isEditing: boolean }>({
  isEditing: false,
});

function useEditMode() {
  return useContext(EditModeContext);
}

// ─── Sortable Card Wrapper ────────────────────────────────────────────────────

export function EditableDashboardCard({
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
  const { isEditing } = useEditMode();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !isEditing });

  return (
    <Box
      ref={setNodeRef}
      className={className}
      sx={{
        ...style,
        transform: CSS.Transform.toString(transform),
        transition,
        position: "relative",
        opacity: isDragging ? 0 : 1,
        flex: 1,
        minWidth: 0,
      }}
    >
      {isEditing && (
        <Box
          {...attributes}
          {...listeners}
          sx={{
            "position": "absolute",
            "top": 8,
            "right": 8,
            "zIndex": 10,
            "cursor": "grab",
            "display": "flex",
            "alignItems": "center",
            "backgroundColor": "background.paper",
            "border": "1px solid",
            "borderColor": "divider",
            "borderRadius": 1,
            "px": 0.5,
            "py": 0.25,
            "color": "text.disabled",
            "boxShadow": 1,
            "&:active": { cursor: "grabbing" },
          }}
        >
          <DragIndicatorIcon sx={{ fontSize: 16 }} />
        </Box>
      )}
      {children}
    </Box>
  );
}

export default EditableDashboardCard;

// ─── Sortable Row ─────────────────────────────────────────────────────────────

function SortableRow({
  row,
  children,
  onToggle,
  permittedCardIds,
}: {
  row: DashboardRow;
  children: ReactNode;
  onToggle: (id: string) => void;
  permittedCardIds: Set<dashboardCardID>;
}) {
  const { isEditing } = useEditMode();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.id, disabled: !isEditing });
  const { t } = useTranslation();

  // Only permitted cards participate in DnD — no blank ghost slots
  const draggableIds = row.cardIds.filter((id) => permittedCardIds.has(id));

  return (
    <Box
      ref={setNodeRef}
      sx={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
        mb: 2,
      }}
    >
      {isEditing && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 0.75,
            px: 0.5,
          }}
        >
          <Box
            {...attributes}
            {...listeners}
            sx={{
              "cursor": "grab",
              "display": "flex",
              "alignItems": "center",
              "color": "text.disabled",
              "&:active": { cursor: "grabbing" },
            }}
          >
            <DragIndicatorIcon
              sx={{ fontSize: 18, transform: "rotate(90deg)" }}
            />
          </Box>

          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: "text.secondary",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              fontSize: "0.68rem",
              userSelect: "none",
            }}
          >
            {row.label}
          </Typography>

          <Box
            sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <Typography
              variant="caption"
              color="text.disabled"
            >
              {row.visible ?
                t("editableDashboard.visible")
              : t("editableDashboard.hidden")}
            </Typography>
            <Tooltip
              title={
                row.visible ?
                  t("editableDashboard.hideRow")
                : t("editableDashboard.showRow")
              }
            >
              <Switch
                size="small"
                checked={row.visible}
                onChange={() => onToggle(row.id)}
              />
            </Tooltip>
          </Box>
        </Box>
      )}

      {row.visible && (
        <SortableContext
          items={draggableIds}
          strategy={horizontalListSortingStrategy}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "stretch",
              borderRadius: 2,
              outline: isEditing ? "2px dashed" : "none",
              outlineColor: "divider",
              outlineOffset: 4,
              p: isEditing ? 1 : 0,
              transition: "padding 0.2s ease, outline 0.2s ease",
            }}
          >
            {children}
          </Box>
        </SortableContext>
      )}

      {!row.visible && isEditing && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 60,
            gap: 1,
            border: "2px dashed",
            borderColor: "divider",
            borderRadius: 2,
            color: "text.disabled",
          }}
        >
          <VisibilityOffIcon sx={{ fontSize: 16 }} />
          <Typography variant="caption">
            {t("editableDashboard.rowHidden")}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

// ─── Edit Toggle ──────────────────────────────────────────────────────────────

function EditToggle({
  isEditing,
  onToggle,
  hiddenCount,
}: {
  isEditing: boolean;
  onToggle: () => void;
  hiddenCount: number;
}) {
  const { t } = useTranslation();
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
      <IconButton
        onClick={onToggle}
        disableRipple
        size="small"
        sx={{
          "border": "1px solid",
          "borderColor": isEditing ? "primary.main" : "divider",
          "backgroundColor": isEditing ? "primary.main" : "transparent",
          "color": isEditing ? "primary.contrastText" : "text.secondary",
          "borderRadius": 1.5,
          "px": 1.5,
          "py": 0.5,
          "gap": 0.75,
          "&:hover": {
            backgroundColor: isEditing ? "primary.dark" : "action.hover",
          },
          "transition": "all 0.15s ease",
        }}
      >
        {isEditing ?
          <CheckIcon sx={{ fontSize: 15 }} />
        : <EditIcon sx={{ fontSize: 15 }} />}
        <Typography
          variant="caption"
          sx={{ fontWeight: 600, lineHeight: 1 }}
        >
          {isEditing ?
            t("editableDashboard.done")
          : t("editableDashboard.editLayout")}
        </Typography>
      </IconButton>

      {!isEditing && hiddenCount > 0 && (
        <Chip
          label={t("editableDashboard.rowsHidden", { count: hiddenCount })}
          size="small"
          variant="outlined"
          icon={<VisibilityOffIcon sx={{ fontSize: "14px !important" }} />}
          sx={{
            fontSize: "0.72rem",
            color: "text.disabled",
            borderColor: "divider",
          }}
        />
      )}
    </Box>
  );
}

// ─── Dashboard Layout ─────────────────────────────────────────────────────────

interface DashboardLayoutProps {
  rows: DashboardRow[];
  onRowsChange: (rows: DashboardRow[]) => void;
  /**
   * Return null for cards the user doesn't have permission to see.
   * Those slots are skipped entirely — no blank space left behind.
   */
  renderCard: (id: dashboardCardID) => ReactNode;
}

export function DashboardLayout({
  rows,
  onRowsChange,
  renderCard,
}: DashboardLayoutProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Cards whose renderCard() returns non-null — only these participate in DnD
  const permittedCardIds = new Set<dashboardCardID>(
    rows
      .flatMap((r) => r.cardIds)
      .filter((id) => renderCard(id) !== null) as dashboardCardID[],
  );

  const isRowId = useCallback(
    (id: string) => rows.some((r) => r.id === id),
    [rows],
  );

  const findRowOfCard = useCallback(
    (cardId: string) =>
      rows.find((r) => r.cardIds.includes(cardId as dashboardCardID)),
    [rows],
  );

  const handleDragStart = ({ active }: DragStartEvent) =>
    setActiveId(String(active.id));

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over || active.id === over.id) return;
    if (isRowId(String(active.id)) || isRowId(String(over.id))) return;
    const fromRow = findRowOfCard(String(active.id));
    const toRow = findRowOfCard(String(over.id));
    if (!fromRow || !toRow || fromRow.id === toRow.id) return;
    onRowsChange(
      rows.map((row) => {
        if (row.id === fromRow.id)
          return {
            ...row,
            cardIds: row.cardIds.filter((id) => id !== active.id),
          };
        if (row.id === toRow.id) {
          const overIdx = row.cardIds.indexOf(over.id as dashboardCardID);
          const next = [...row.cardIds];
          next.splice(overIdx, 0, active.id as dashboardCardID);
          return { ...row, cardIds: next };
        }
        return row;
      }),
    );
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    if (!over || active.id === over.id) return;
    const activeIsRow = isRowId(String(active.id));
    const overIsRow = isRowId(String(over.id));
    if (activeIsRow && overIsRow) {
      const oldIdx = rows.findIndex((r) => r.id === active.id);
      const newIdx = rows.findIndex((r) => r.id === over.id);
      onRowsChange(arrayMove(rows, oldIdx, newIdx));
      return;
    }
    if (!activeIsRow && !overIsRow) {
      const fromRow = findRowOfCard(String(active.id));
      const toRow = findRowOfCard(String(over.id));
      if (!fromRow || !toRow || fromRow.id !== toRow.id) return;
      const oldIdx = fromRow.cardIds.indexOf(active.id as dashboardCardID);
      const newIdx = fromRow.cardIds.indexOf(over.id as dashboardCardID);
      onRowsChange(
        rows.map((row) =>
          row.id === fromRow.id ?
            { ...row, cardIds: arrayMove(row.cardIds, oldIdx, newIdx) }
          : row,
        ),
      );
    }
  };

  const handleToggleRow = (rowId: string) =>
    onRowsChange(
      rows.map((row) =>
        row.id === rowId ? { ...row, visible: !row.visible } : row,
      ),
    );

  const hiddenCount = rows.filter((r) => !r.visible).length;
  const activeCardId =
    activeId && !isRowId(activeId) ? (activeId as dashboardCardID) : null;

  return (
    <EditModeContext.Provider value={{ isEditing }}>
      <EditToggle
        isEditing={isEditing}
        onToggle={() => setIsEditing((v) => !v)}
        hiddenCount={hiddenCount}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={rows.map((r) => r.id)}
          strategy={verticalListSortingStrategy}
        >
          {rows.map((row) => {
            // Only render cards the user has permission to see
            const permittedInRow = row.cardIds.filter((id) =>
              permittedCardIds.has(id),
            );
            // Skip the entire row if no permitted cards — no blank rows in edit mode
            if (permittedInRow.length === 0) return null;

            return (
              <SortableRow
                key={row.id}
                row={row}
                onToggle={handleToggleRow}
                permittedCardIds={permittedCardIds}
              >
                {permittedInRow.map((cardId) => (
                  <EditableDashboardCard
                    key={cardId}
                    id={cardId}
                  >
                    {renderCard(cardId)}
                  </EditableDashboardCard>
                ))}
              </SortableRow>
            );
          })}
        </SortableContext>

        <DragOverlay dropAnimation={null}>
          {activeCardId && (
            <Box sx={{ opacity: 0.8, pointerEvents: "none", width: "100%" }}>
              {renderCard(activeCardId)}
            </Box>
          )}
        </DragOverlay>
      </DndContext>
    </EditModeContext.Provider>
  );
}
