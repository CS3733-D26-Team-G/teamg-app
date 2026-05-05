import { useState } from "react";
import DashboardRecentActivity from "../../features/dashboard/components/DashboardRecentActivity.tsx";
import {
  DashboardLayout,
  type DashboardRow,
  type dashboardCardID,
} from "../../features/dashboard/components/EditableDashboard.tsx";
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
import PopularContent from "../../features/dashboard/components/PopularContent";
import RecentlyViewed from "../../features/dashboard/components/RecentlyViewed";
import { useProfile } from "../../profile/ProfileContext.tsx";
import { getPositionLabel } from "../../utils/positionDisplay";
import { useDashboardBootstrap } from "../../features/dashboard/useDashboardBootstrap.ts";

// ── Layout Types ──────────────────────────────────────────────────────────────

type FlexSize = "full" | "large" | "medium" | "small";

interface CardDef {
  id: dashboardCardID;
  size: FlexSize;
  adminOnly: boolean;
  label: string;
  description: string;
  node: React.ReactNode;
}

// ── Default Row Layout ────────────────────────────────────────────────────────

const DEFAULT_ROWS: DashboardRow[] = [
  {
    id: "row-top",
    label: "Overview",
    visible: true,
    cardIds: ["employee-demographics", "recent-activity"],
  },
  {
    id: "row-role-counts",
    label: "Content by Role",
    visible: true,
    cardIds: [
      "role-ba",
      "role-uw",
      "role-actuarial",
      "role-exl",
      "role-bus-ops",
    ],
  },
  {
    id: "row-activity",
    label: "Activity & Content",
    visible: true,
    cardIds: ["employee-activity", "popular-content-search", "recently-viewed"],
  },
  {
    id: "row-charts",
    label: "Charts",
    visible: true,
    cardIds: ["file-types", "employee-edits-by-day"],
  },
];

// ── Styled Components ─────────────────────────────────────────────────────────

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  flexDirection: "column",
  alignItems: "stretch",
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  minHeight: 80,
}));

// ── Skeleton ──────────────────────────────────────────────────────────────────

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

// ── Widget Selector ───────────────────────────────────────────────────────────

function WidgetSelector({
  cards,
  isAdmin,
  rows,
  onToggleCard,
  onReset,
}: {
  cards: CardDef[];
  isAdmin: boolean;
  rows: DashboardRow[];
  onToggleCard: (id: dashboardCardID) => void;
  onReset: () => void;
}) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const visibleCardIds = new Set(
    rows.flatMap((r) => (r.visible ? r.cardIds : [])),
  );
  // Only show cards the current user has permission to access
  const available = cards.filter((c) => isAdmin || !c.adminOnly);
  const hiddenCount = available.filter((c) => !visibleCardIds.has(c.id)).length;

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
              Toggle visibility · drag rows to reorder
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
                    checked={visibleCardIds.has(card.id)}
                    onChange={() => onToggleCard(card.id)}
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
            Use "Edit Layout" to reorder rows and cards
          </Typography>
        </Box>
      </Popover>
    </>
  );
}

// ── Dashboard Component ───────────────────────────────────────────────────────

export default function Dashboard() {
  const [rows, setRows] = useState<DashboardRow[]>(DEFAULT_ROWS);

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
    title: React.ReactNode;
    helpDesc?: string;
    children: React.ReactNode;
  }) => (
    <Card
      sx={{
        ...cardSx,
        "height": "100%",
        "overflowY": "auto",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        "msOverflowStyle": "none",
        "scrollbarWidth": "none",
      }}
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
      <CardContent
        sx={{ "p": 2, "&:last-child": { pb: 2 }, "overflowY": "auto" }}
      >
        {children}
      </CardContent>
    </Card>
  );

  // ── Card Definitions ──────────────────────────────────────────────────────
  //
  // "row-charts" uses a custom stacked layout (see renderCard below).
  // "row-activity" uses a custom 2/3 + stacked-1/3 layout (see renderCard below).
  // All other rows use the default flex: 1 side-by-side layout.

  const allCardDefs: CardDef[] = [
    {
      id: "employee-demographics",
      size: "medium",
      adminOnly: true,
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
    ...roleConfig.map(
      ({ id, label, key }): CardDef => ({
        id,
        size: "small",
        adminOnly: true,
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
      }),
    ),
    {
      id: "employee-activity",
      size: "large",
      adminOnly: false,
      label: isAdmin ? "Employee Activity" : "My Content Changes",
      description: "Edits, checkouts & deletes by employee",
      node: (
        <Card
          sx={{ ...cardSx, height: "100%" }}
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
      label: "Popular Content",
      description:
        "Your most frequently used content and popular content for your role",
      node: (
        <CardShell title="Popular Content">
          <PopularContent position={session?.position} />
        </CardShell>
      ),
    },
    {
      id: "recently-viewed",
      size: "medium",
      adminOnly: false,
      label: "Recently Viewed",
      description: "Your recently viewed content",
      node: (
        <CardShell title="Recently Viewed">
          <RecentlyViewed />
        </CardShell>
      ),
    },
    {
      id: "file-types",
      size: "full",
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
          title={
            isAdmin ?
              "Employee Edits By Day"
            : `${getPositionLabel(session!.position)} Edits By Day`
          }
          helpDesc="Fluctuation in content edits by role over time."
        >
          <HitsLineChart />
        </CardShell>
      ),
    },
  ];

  const cardById = new Map(allCardDefs.map((c) => [c.id, c]));

  // ── Helpers ────────────────────────────────────────────────────────────────

  const handleReset = () => setRows(DEFAULT_ROWS);

  const handleToggleCard = (id: dashboardCardID) => {
    const inARow = rows.some((r) => r.cardIds.includes(id));
    if (inARow) {
      setRows((prev) =>
        prev.map((row) => ({
          ...row,
          cardIds: row.cardIds.filter((cid) => cid !== id),
        })),
      );
    } else {
      setRows((prev) => {
        const targetIdx = Math.max(
          prev.findIndex((r) => r.visible),
          0,
        );
        return prev.map((row, i) =>
          i === targetIdx ? { ...row, cardIds: [...row.cardIds, id] } : row,
        );
      });
    }
  };

  // ── renderCard ─────────────────────────────────────────────────────────────
  //
  // Special rows get custom wrapper layouts injected here so the DashboardLayout
  // still manages DnD for those cards while we control their visual arrangement.
  //
  // row-charts    → stacked vertically, each card full width
  // row-activity  → employee-activity at 2/3, popular + recently stacked at 1/3

  function renderCard(id: dashboardCardID): React.ReactNode {
    const def = cardById.get(id);
    if (!def) return null;
    if (def.adminOnly && !isAdmin) return null;

    // ── Charts row: stack vertically, full width ──────────────────────────
    // The card's node is already full width by default; we just ensure the
    // EditableDashboardCard wrapper doesn't force flex: 1 side-by-side.
    // We handle this by overriding the row container in renderCard via a
    // special sentinel that DashboardLayout detects — but since DashboardLayout
    // uses flex row by default, the cleanest solution is to put both chart
    // cards inside ONE wrapper and return it from a single logical card.
    //
    // Instead, we use CSS: when both charts land in row-charts, we render
    // each as width:100% block. We signal this through the cardSx on their
    // EditableDashboardCard via the style prop passed by DashboardLayout.
    // DashboardLayout passes no style — the card's flex:1 in the row container
    // does the work. To make them stack we override the row's flexDirection
    // to "column" for row-charts in Dashboard.tsx by wrapping in renderRowContent.
    //
    // The cleanest approach without changing DashboardLayout's contract:
    // return a "column stack controller" wrapper. See renderRowContent below.

    return def.node;
  }

  // ── renderRowContent ───────────────────────────────────────────────────────
  // Called by DashboardLayout via the renderCard prop for each card.
  // For rows that need a custom internal layout we return null from renderCard
  // for the individual cards and instead render the whole row via a custom
  // render prop. But that would require changing DashboardLayout's API.
  //
  // Better: we keep the existing API and instead post-process the row container
  // by overriding flexDirection through a custom renderCard that injects a
  // "stack" wrapper around each card when it belongs to a stacking row.
  //
  // Implementation:
  // - Charts row: each card gets flex: "0 0 100%" so they stack vertically
  //   inside the row's flex container (which we make flex-wrap + flex-direction row).
  //   Since EditableDashboardCard has flex:1 this won't work without changing the
  //   container. Instead we use a simpler approach: move both chart cards into
  //   a SINGLE logical wrapper and return that from one renderCard call, making
  //   the other card ID return null so DashboardLayout skips the slot.
  //
  // That's the cleanest solution. We designate "file-types" as the "anchor" card
  // for row-charts and "employee-activity" as the anchor for row-activity.
  // The anchor renders the full custom layout; the other card IDs in those rows
  // return null so DashboardLayout allocates exactly one flex slot.

  function renderCardWithLayout(id: dashboardCardID): React.ReactNode {
    const def = cardById.get(id);
    if (!def) return null;
    if (def.adminOnly && !isAdmin) return null;

    // ── Charts row: "file-types" renders both charts stacked ──────────────
    if (id === "file-types") {
      const editsInRow = rows.some(
        (r) =>
          r.id === "row-charts" && r.cardIds.includes("employee-edits-by-day"),
      );
      // If both charts are in row-charts, stack them
      const editsCardDef = cardById.get("employee-edits-by-day");
      if (editsInRow && editsCardDef && (!editsCardDef.adminOnly || isAdmin)) {
        return (
          <Stack
            spacing={2}
            sx={{ width: "100%" }}
          >
            <CardShell title="File Types">
              <TypeBarChart data={fileTypeCounts} />
            </CardShell>
            <CardShell
              title={
                isAdmin ?
                  "Employee Edits By Day"
                : `${getPositionLabel(session!.position)} Edits By Day`
              }
              helpDesc="Fluctuation in content edits by role over time."
            >
              <HitsLineChart />
            </CardShell>
          </Stack>
        );
      }
      // Fallback if edits is not in this row — render just file types normally
      return def.node;
    }

    // "employee-edits-by-day" is consumed by the file-types anchor above when
    // both are in row-charts — return null so no blank slot appears
    if (id === "employee-edits-by-day") {
      const fileTypesIsAnchor = rows.some(
        (r) =>
          r.id === "row-charts" &&
          r.cardIds.includes("file-types") &&
          r.cardIds.includes("employee-edits-by-day"),
      );
      if (fileTypesIsAnchor) return null;
      return def.node;
    }

    // ── Activity row: "employee-activity" renders 2/3 + stacked 1/3 ───────
    if (id === "employee-activity") {
      const activityRow = rows.find((r) => r.id === "row-activity");
      const popularInRow =
        activityRow?.cardIds.includes("popular-content-search") ?? false;
      const recentInRow =
        activityRow?.cardIds.includes("recently-viewed") ?? false;

      const popularAllowed =
        !cardById.get("popular-content-search")?.adminOnly || isAdmin;
      const recentAllowed =
        !cardById.get("recently-viewed")?.adminOnly || isAdmin;

      const hasStackedCards =
        (popularInRow && popularAllowed) || (recentInRow && recentAllowed);

      if (hasStackedCards) {
        return (
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "stretch",
              width: "100%",
            }}
          >
            {/* Employee activity — 2/3 width */}
            <Box sx={{ flex: "0 0 calc(66.666% - 8px)" }}>
              <Card
                sx={{ ...cardSx, height: "100%" }}
                elevation={0}
              >
                <Divider />
                <CardContent sx={{ "p": 2, "&:last-child": { pb: 2 } }}>
                  <AdminCards />
                </CardContent>
              </Card>
            </Box>

            {/* Popular + Recently stacked — 1/3 width */}
            <Box
              sx={{
                flex: "0 0 calc(33.333% - 8px)",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {popularInRow && popularAllowed && (
                <Box sx={{ flex: 1, maxHeight: "50%", overflowY: "auto" }}>
                  <CardShell title="Popular Content">
                    <PopularContent position={session?.position} />
                  </CardShell>
                </Box>
              )}
              {recentInRow && recentAllowed && (
                <Box sx={{ flex: 1, maxHeight: "50%", overflow: "hidden" }}>
                  <CardShell title="Recently Viewed">
                    <RecentlyViewed />
                  </CardShell>
                </Box>
              )}
            </Box>
          </Box>
        );
      }

      // Fallback: no stacked cards, render normally
      return def.node;
    }

    // "popular-content-search" and "recently-viewed" are consumed by the
    // employee-activity anchor when all three are in row-activity
    if (id === "popular-content-search" || id === "recently-viewed") {
      const activityRow = rows.find((r) => r.id === "row-activity");
      const activityIsAnchor =
        activityRow?.cardIds.includes("employee-activity") ?? false;
      const activityAllowed =
        !cardById.get("employee-activity")?.adminOnly || isAdmin;

      if (activityIsAnchor && activityAllowed) return null;
      return def.node;
    }

    return def.node;
  }

  const allCardIds = rows.flatMap((r) => r.cardIds);
  const hasVisibleCards = allCardIds.some((id) => {
    const def = cardById.get(id);
    return def && (!def.adminOnly || isAdmin);
  });

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
              rows={rows}
              onToggleCard={handleToggleCard}
              onReset={handleReset}
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
          "scrollbarWidth": "none",
          "&::-webkit-scrollbar": { display: "none" },
          "-ms-overflow-style": "none",
        }}
      >
        <CardContent
          sx={{
            p: 3,
            minHeight: "90vh",
            backgroundColor: "background.default",
          }}
        >
          {hasVisibleCards ?
            <DashboardLayout
              rows={rows}
              onRowsChange={setRows}
              renderCard={renderCardWithLayout}
            />
          : <Box
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
                onClick={handleReset}
                sx={{ mt: 1, borderRadius: "8px", textTransform: "none" }}
              >
                Restore defaults
              </Button>
            </Box>
          }
        </CardContent>
      </Card>
    </Box>
  );
}
