import { useState } from "react";
import DashboardRecentActivity from "../../features/dashboard/components/DashboardRecentActivity.tsx";
import EditableDashboardCard, {
  type dashboardCardID,
} from "../../features/dashboard/components/EditableDashboard.tsx";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensors,
  useSensor,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import PieChart from "../../features/dashboard/components/PieChart.tsx";
import TypeBarChart from "../../features/dashboard/components/BarChart.tsx";
import NotificationBell from "../../features/notifications/components/NotificationBell.tsx";
import {
  Box,
  styled,
  Toolbar,
  Typography,
  Skeleton,
  Stack,
  Divider,
  Popover,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Chip,
  Tooltip,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import { useAuth } from "../../auth/AuthContext.tsx";
import HelpPopup from "../../components/HelpPopup";
import HitsLineChart from "../../features/dashboard/components/HitsLineChart.tsx";
import AdminCards from "../../features/dashboard/components/AdminCards.tsx";
import { useProfile } from "../../profile/ProfileContext.tsx";
import { useDashboardBootstrap } from "../../features/dashboard/useDashboardBootstrap.ts";

// ── Layout Types & Constants ──────────────────────────────────────────────────

type FlexSize = "full" | "large" | "medium" | "small";

const FLEX: Record<FlexSize, string> = {
  full: "1 1 100%",
  large: "1 1 58%",
  medium: "1 1 36%",
  small: "1 1 0",
};

const MIN_W: Record<FlexSize, number> = {
  full: 0,
  large: 360,
  medium: 260,
  small: 110,
};

interface CardDef {
  id: dashboardCardID;
  size: FlexSize;
  adminOnly: boolean;
  label: string;
  description: string;
  node: React.ReactNode;
}

interface RenderedRow {
  cards: CardDef[];
  alignItems: "stretch" | "flex-start";
  useStack: boolean;
}

const DEFAULT_ORDER: dashboardCardID[] = [
  "employee-demographics",
  "recent-activity",
  "role-ba",
  "role-uw",
  "role-actuarial",
  "role-exl",
  "role-bus-ops",
  "employee-activity",
  "popular-content-search",
  "file-types",
  "employee-edits-by-day",
];

// ── Styled Components ────────────────────────────────────────────────────────

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  flexDirection: "column",
  alignItems: "stretch",
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  minHeight: 80,
}));

// ── Sub-Components ──────────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <Box sx={{ width: "100%" }}>
      <StyledToolbar
        sx={{
          background: "transparent",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 4,
            py: 2,
          }}
        >
          <Skeleton
            variant="text"
            width={280}
            height={44}
            sx={{ bgcolor: "rgba(255,255,255,0.15)" }}
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <Skeleton
              variant="circular"
              width={36}
              height={36}
              sx={{ bgcolor: "rgba(255,255,255,0.15)" }}
            />
            <Skeleton
              variant="rounded"
              width={140}
              height={36}
              sx={{ bgcolor: "rgba(255,255,255,0.15)", borderRadius: "8px" }}
            />
          </Box>
        </Box>
      </StyledToolbar>
      <Card sx={{ borderRadius: 2 }}>
        <CardContent
          sx={{
            p: 3,
            minHeight: "90vh",
            backgroundColor: "background.default",
          }}
        >
          <Stack spacing={2}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Skeleton
                variant="rounded"
                sx={{ flex: "1 1 36%", height: 260, borderRadius: "10px" }}
              />
              <Skeleton
                variant="rounded"
                sx={{ flex: "1 1 58%", height: 260, borderRadius: "10px" }}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              {[...Array(5)].map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rounded"
                  sx={{ flex: 1, height: 90, borderRadius: "10px" }}
                />
              ))}
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Skeleton
                variant="rounded"
                sx={{ flex: "1 1 58%", height: 300, borderRadius: "10px" }}
              />
              <Skeleton
                variant="rounded"
                sx={{ flex: "1 1 36%", height: 300, borderRadius: "10px" }}
              />
            </Box>
            <Skeleton
              variant="rounded"
              sx={{ width: "100%", height: 300, borderRadius: "10px" }}
            />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

function WidgetSelector({
  cards,
  isAdmin,
  hiddenWidgets,
  onToggle,
  onReset,
}: {
  cards: CardDef[];
  isAdmin: boolean;
  hiddenWidgets: dashboardCardID[];
  onToggle: (id: dashboardCardID) => void;
  onReset: () => void;
}) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const available = cards.filter((c) => isAdmin || !c.adminOnly);
  const hiddenCount = hiddenWidgets.filter((id) =>
    available.some((c) => c.id === id),
  ).length;

  return (
    <>
      <Tooltip title="Customise widgets">
        <Button
          onClick={(e) => setAnchor(e.currentTarget)}
          variant="contained"
          startIcon={<DashboardCustomizeIcon fontSize="small" />}
          size="small"
          sx={{
            "backgroundColor": "rgba(255,255,255,0.15)",
            "backdropFilter": "blur(8px)",
            "border": "1px solid rgba(255,255,255,0.25)",
            "color": "white",
            "fontWeight": 600,
            "textTransform": "none",
            "borderRadius": "8px",
            "px": 1.5,
            "fontSize": "0.82rem",
            "whiteSpace": "nowrap",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.25)" },
          }}
        >
          Widgets
          {hiddenCount > 0 && (
            <Chip
              label={`${hiddenCount} hidden`}
              size="small"
              sx={{
                "ml": 1,
                "height": 16,
                "fontSize": "0.6rem",
                "fontWeight": 700,
                "backgroundColor": "rgba(255,255,255,0.25)",
                "color": "white",
                "& .MuiChip-label": { px: 0.6 },
              }}
            />
          )}
        </Button>
      </Tooltip>

      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              mt: 0.5,
              borderRadius: "12px",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              minWidth: 280,
              overflow: "hidden",
            },
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
            background: "linear-gradient(135deg,#1A1E4B,#395176)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              sx={{ color: "white", fontWeight: 700, fontSize: "0.9rem" }}
            >
              Dashboard Widgets
            </Typography>
            <Typography
              sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.7rem" }}
            >
              Toggle visibility · drag to reorder
            </Typography>
          </Box>
          <Button
            size="small"
            onClick={onReset}
            sx={{
              "color": "rgba(255,255,255,0.7)",
              "textTransform": "none",
              "fontSize": "0.72rem",
              "fontWeight": 600,
              "px": 1.25,
              "py": 0.4,
              "borderRadius": "7px",
              "border": "1px solid rgba(255,255,255,0.2)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
                color: "white",
              },
            }}
          >
            Reset
          </Button>
        </Box>
        <Box sx={{ px: 1.25, py: 1, maxHeight: 400, overflowY: "auto" }}>
          <FormGroup>
            {available.map((card) => (
              <FormControlLabel
                key={card.id}
                control={
                  <Checkbox
                    checked={!hiddenWidgets.includes(card.id)}
                    onChange={() => onToggle(card.id)}
                    size="small"
                    sx={{
                      "color": "text.disabled",
                      "&.Mui-checked": { color: "primary.main" },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "0.82rem",
                        fontWeight: 500,
                        lineHeight: 1.3,
                      }}
                    >
                      {card.label}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.68rem",
                        color: "text.secondary",
                        lineHeight: 1.3,
                      }}
                    >
                      {card.description}
                    </Typography>
                  </Box>
                }
                sx={{
                  "mx": 0,
                  "px": 0.75,
                  "py": 0.6,
                  "borderRadius": "7px",
                  "alignItems": "flex-start",
                  "& .MuiCheckbox-root": { pt: 0.2 },
                  "&:hover": { backgroundColor: "action.hover" },
                }}
              />
            ))}
          </FormGroup>
        </Box>
        <Box
          sx={{
            px: 2,
            py: 1,
            borderTop: "1px solid",
            borderColor: "divider",
            backgroundColor: "action.hover",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.67rem",
              color: "text.disabled",
              textAlign: "center",
            }}
          >
            Drag any card to reorder within its row
          </Typography>
        </Box>
      </Popover>
    </>
  );
}

// ── Dashboard Component ───────────────────────────────────────────────────────

export default function Dashboard() {
  const [cardOrder, setCardOrder] = useState<dashboardCardID[]>(DEFAULT_ORDER);
  const [hiddenWidgets, setHiddenWidgets] = useState<dashboardCardID[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setCardOrder((prev) => {
      const oldIdx = prev.indexOf(active.id as dashboardCardID);
      const newIdx = prev.indexOf(over.id as dashboardCardID);
      if (oldIdx === -1 || newIdx === -1) return prev;
      return arrayMove(prev, oldIdx, newIdx);
    });
  };

  const toggleWidget = (id: dashboardCardID) =>
    setHiddenWidgets((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id],
    );

  const resetWidgets = () => {
    setHiddenWidgets([]);
    setCardOrder(DEFAULT_ORDER);
  };

  const { session } = useAuth();
  const { data, loading, error } = useDashboardBootstrap();
  const { profile } = useProfile();
  const isAdmin = session?.position === "ADMIN";

  if (loading && !data) return <DashboardSkeleton />;
  if (error && !data)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h6"
            color="error"
            sx={{ mb: 1 }}
          >
            Failed to load dashboard
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {error}
          </Typography>
        </Box>
      </Box>
    );

  const rawLogs = data?.activityAll ?? [];
  const analytics = (data?.contentCounts ?? {}) as Record<string, number>;
  const empCounts = (data?.employeeCounts ?? {}) as Record<string, number>;
  const fileTypeCounts = data?.fileTypeCounts ?? [];

  const employeePieData = [
    {
      id: 0,
      value: empCounts.BUSINESS_ANALYST ?? 0,
      label: "Business Analyst",
      color: "#bea5aa",
    },
    {
      id: 1,
      value: empCounts.BUSINESS_OP_RATING ?? 0,
      label: "Business Ops Rating",
      color: "#509edd",
    },
    {
      id: 2,
      value: empCounts.UNDERWRITER ?? 0,
      label: "Underwriter",
      color: "#395176",
    },
    {
      id: 3,
      value: empCounts.ACTUARIAL_ANALYST ?? 0,
      label: "Actuarial Analyst",
      color: "#ba667b",
    },
    { id: 4, value: empCounts.ADMIN ?? 0, label: "Admin", color: "#74414e" },
    {
      id: 5,
      value: empCounts.EXL_OPERATIONS ?? 0,
      label: "EXL Operations",
      color: "#721b31",
    },
  ];

  const helpText: Record<string, string> = {
    ADMIN:
      "Full organisational overview: employee demographics, recent activity, content counts by role.",
    UNDERWRITER: "Track activity and access your content from the dashboard.",
    BUSINESS_ANALYST: "Track your content and platform activity.",
    ACTUARIAL_ANALYST: "Monitor content counts and recent platform activity.",
    EXL_OPERATIONS: "Monitor content and activity.",
    BUSINESS_OP_RATING: "View your content and platform activity.",
  };

  const roleConfig = [
    {
      id: "role-ba" as dashboardCardID,
      label: "Business Analyst",
      key: "BUSINESS_ANALYST",
    },
    {
      id: "role-uw" as dashboardCardID,
      label: "Underwriter",
      key: "UNDERWRITER",
    },
    {
      id: "role-actuarial" as dashboardCardID,
      label: "Actuarial Analyst",
      key: "ACTUARIAL_ANALYST",
    },
    {
      id: "role-exl" as dashboardCardID,
      label: "EXL Operations",
      key: "EXL_OPERATIONS",
    },
    {
      id: "role-bus-ops" as dashboardCardID,
      label: "Business Ops",
      key: "BUSINESS_OP_RATING",
    },
  ];

  const cardSx = {
    borderRadius: "10px",
    border: "1px solid",
    borderColor: "divider",
  };

  const CardShell = ({
    title,
    helpDesc,
    children,
  }: {
    title: string;
    helpDesc?: string;
    children: React.ReactNode;
  }) => (
    <Card
      sx={cardSx}
      elevation={0}
    >
      <Box
        sx={{
          px: 2,
          py: 1.25,
          display: "flex",
          alignItems: "center",
          gap: 0.5,
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: "0.9rem" }}>
          {title}
        </Typography>
        {helpDesc && (
          <HelpPopup
            description={helpDesc}
            infoOrHelp={false}
          />
        )}
      </Box>
      <Divider />
      <CardContent sx={{ "p": 2, "&:last-child": { pb: 2 } }}>
        {children}
      </CardContent>
    </Card>
  );

  const allCardDefs: CardDef[] = [
    {
      id: "employee-demographics",
      size: "medium",
      adminOnly: false,
      label: "Employee Demographics",
      description: "Pie chart of staff by role",
      node: (
        <Card
          sx={{ ...cardSx, height: "100%" }}
          elevation={0}
        >
          <Box
            sx={{
              px: 2,
              py: 1.25,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: "1.3rem", py: 0.75 }}>
              Employee Demographics
            </Typography>
            <HelpPopup
              description="Breakdown of employees by role. Hover a slice for exact numbers."
              infoOrHelp={false}
            />
          </Box>
          <Divider />
          <CardContent sx={{ "p": 2, "&:last-child": { pb: 2 } }}>
            <PieChart data={employeePieData} />
          </CardContent>
        </Card>
      ),
    },
    {
      id: "recent-activity",
      size: "large",
      adminOnly: false,
      label: "Recent Activity",
      description: "Live feed of the last 4 actions",
      node: (
        <Box sx={{ height: "100%" }}>
          <DashboardRecentActivity rawLogs={rawLogs} />
        </Box>
      ),
    },
    ...roleConfig.map(({ id, label, key }) => ({
      id,
      size: "small" as FlexSize,
      adminOnly: false,
      label: `${label} Count`,
      description: `Content count for ${label}s`,
      node: (
        <Card
          sx={cardSx}
          elevation={0}
        >
          <CardContent sx={{ "p": 2, "&:last-child": { pb: 2 } }}>
            <Typography
              sx={{
                fontSize: "0.72rem",
                color: "text.secondary",
                fontWeight: 500,
                mb: 0.25,
              }}
            >
              {label}
            </Typography>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "1.7rem",
                lineHeight: 1.1,
                mt: 1,
              }}
            >
              {analytics[key] ?? 0}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.68rem",
                color: "primary.main",
                fontWeight: 600,
                mt: 0.5,
              }}
            >
              Total Items
              <HelpPopup
                description={`Total content accessible by ${label}s`}
                infoOrHelp={false}
              />
            </Typography>
          </CardContent>
        </Card>
      ),
    })),
    {
      id: "employee-activity",
      size: "large",
      adminOnly: true,
      label: "Employee Activity",
      description: "Edits, checkouts & deletes by employee",
      node: (
        <Card
          sx={cardSx}
          elevation={0}
        >
          <Divider />
          <CardContent sx={{ "p": 2, "&:last-child": { pb: 2 } }}>
            <AdminCards />
          </CardContent>
        </Card>
      ),
    },
    {
      id: "popular-content-search",
      size: "medium",
      adminOnly: false,
      label: "Popular Searches",
      description: "Most searched keywords (coming soon)",
      node: (
        <CardShell title="Popular Content Search">
          <Typography sx={{ fontSize: "0.82rem", color: "text.secondary" }}>
            No popular search data available yet.
          </Typography>
        </CardShell>
      ),
    },
    {
      id: "file-types",
      size: "medium",
      adminOnly: false,
      label: "File Types",
      description: "Bar chart of file type distribution",
      node: (
        <CardShell title="File Types">
          <TypeBarChart data={fileTypeCounts} />
        </CardShell>
      ),
    },
    {
      id: "employee-edits-by-day",
      size: "full",
      adminOnly: false,
      label: "Edits by Day",
      description: "Line chart of content edits over time by role",
      node: (
        <CardShell
          title="Employee Edits By Day"
          helpDesc="Fluctuation in content edits by role over time."
        >
          <HitsLineChart />
        </CardShell>
      ),
    },
  ];

  // ── Logic to Build Dynamic Rows ─────────────────────────────────────────────

  const visibleIds = new Set(
    allCardDefs
      .filter((c) => !hiddenWidgets.includes(c.id) && (isAdmin || !c.adminOnly))
      .map((c) => c.id),
  );

  const cardById = new Map(allCardDefs.map((c) => [c.id, c]));

  const orderedVisible = cardOrder
    .filter((id) => visibleIds.has(id))
    .map((id) => cardById.get(id)!)
    .filter(Boolean);

  const rows: RenderedRow[] = [];

  if (orderedVisible.length > 0) {
    // Row 0: First 2 items (Stretch)
    const row0Items = orderedVisible.slice(0, 2);
    rows.push({ cards: row0Items, alignItems: "stretch", useStack: false });

    // Row 1: Next 5 items (Role counts)
    const row1Items = orderedVisible.slice(2, 7);
    if (row1Items.length > 0) {
      rows.push({
        cards: row1Items,
        alignItems: "flex-start",
        useStack: false,
      });
    }

    // Row 2: Next 3 items (Stackable row)
    const row2Items = orderedVisible.slice(7, 10);
    if (row2Items.length > 0) {
      rows.push({ cards: row2Items, alignItems: "flex-start", useStack: true });
    }

    // Row 3: Remaining items
    const row3Items = orderedVisible.slice(10);
    if (row3Items.length > 0) {
      rows.push({
        cards: row3Items,
        alignItems: "flex-start",
        useStack: false,
      });
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <Box
      className="parent"
      sx={{ width: "100%", background: "transparent" }}
    >
      <StyledToolbar
        sx={{
          background: "transparent",
          overflow: "hidden",
          position: "relative",
          py: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: 80,
            my: 1,
            borderRadius: 4,
            backgroundColor: "rgba(255, 255, 255, 0.12)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            borderBottom: "2px solid rgba(255, 255, 255, 0.4)",
            px: 3,
            zIndex: 1,
          }}
        >
          <Typography
            variant="h2"
            sx={{ fontWeight: 700, color: "white", fontSize: "2.2rem" }}
          >
            Welcome Back, {profile?.firstName}!
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <HelpPopup
              description={
                helpText[session?.position ?? ""] ?? "Dashboard overview."
              }
              infoOrHelp={true}
            />
            <NotificationBell />
            <WidgetSelector
              cards={allCardDefs}
              isAdmin={isAdmin}
              hiddenWidgets={hiddenWidgets}
              onToggle={toggleWidget}
              onReset={resetWidgets}
            />
          </Box>
        </Box>
        {[...Array(3)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.08)",
              width: 100 + i * 70,
              height: 100 + i * 70,
              top: -30 - i * 25,
              right: -30 - i * 25,
            }}
          />
        ))}
      </StyledToolbar>

      <Card
        sx={{
          "borderRadius": 2,
          "mx": "32px",
          "height": "calc(100vh - 150px)",
          "overflowY": "auto",
          "scrollbarWidth": "none", // Hides scrollbar for Firefox
          "&::-webkit-scrollbar": {
            display: "none", // Hides scrollbar for Chrome, Safari, and Edge
          },
          "-ms-overflow-style": "none", // Hides scrollbar for IE/Edge
        }}
      >
        <CardContent
          sx={{
            p: 3,
            minHeight: "90vh",
            backgroundColor: "background.default",
          }}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={orderedVisible.map((c) => c.id)}
              strategy={rectSortingStrategy}
            >
              <Stack spacing={2}>
                {rows.map((row, rowIdx) => {
                  if (row.useStack) {
                    const actCard = row.cards.find(
                      (c) => c.id === "employee-activity",
                    );
                    const stackCards = row.cards.filter(
                      (c) => c.id !== "employee-activity",
                    );
                    if (!actCard && !stackCards.length) return null;

                    return (
                      <Box
                        key={rowIdx}
                        sx={{ display: "flex", gap: 2, alignItems: "stretch" }}
                      >
                        {actCard && (
                          <EditableDashboardCard
                            id={actCard.id}
                            style={{
                              flex: FLEX[actCard.size],
                              minWidth: MIN_W[actCard.size],
                              boxSizing: "border-box",
                            }}
                          >
                            {actCard.node}
                          </EditableDashboardCard>
                        )}
                        {stackCards.length > 0 && (
                          <Box
                            sx={{
                              flex: FLEX["medium"],
                              minWidth: MIN_W["medium"],
                              display: "flex",
                              flexDirection: "column",
                              gap: 2,
                            }}
                          >
                            {stackCards.map((card) => (
                              <EditableDashboardCard
                                key={card.id}
                                id={card.id}
                                style={{ boxSizing: "border-box" }}
                              >
                                {card.node}
                              </EditableDashboardCard>
                            ))}
                          </Box>
                        )}
                      </Box>
                    );
                  }

                  const resolvedCards = row.cards.map((card) => {
                    if (rowIdx === 0 && row.cards.length === 1) {
                      return { ...card, size: "full" as FlexSize };
                    }
                    return card;
                  });

                  return (
                    <Box
                      key={rowIdx}
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: row.alignItems,
                        width: "100%",
                      }}
                    >
                      {resolvedCards.map((card) => (
                        <EditableDashboardCard
                          key={card.id}
                          id={card.id}
                          style={{
                            flex: FLEX[card.size],
                            minWidth: MIN_W[card.size],
                            boxSizing: "border-box",
                          }}
                        >
                          {card.node}
                        </EditableDashboardCard>
                      ))}
                    </Box>
                  );
                })}
              </Stack>
            </SortableContext>
          </DndContext>

          {orderedVisible.length === 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 360,
                color: "text.secondary",
                gap: 2,
              }}
            >
              <DashboardCustomizeIcon sx={{ fontSize: 48, opacity: 0.18 }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: 600 }}
              >
                All widgets are hidden
              </Typography>
              <Typography variant="body2">
                Click <strong>Widgets</strong> in the header to restore them.
              </Typography>
              <Button
                variant="outlined"
                onClick={resetWidgets}
                sx={{ mt: 1, borderRadius: "8px", textTransform: "none" }}
              >
                Restore defaults
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
