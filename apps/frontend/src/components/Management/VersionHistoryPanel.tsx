import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Tooltip,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import ScheduleIcon from "@mui/icons-material/Schedule";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { API_BASE_URL } from "../../config";
import type { ContentRow } from "../../types/content";

interface HistoryActivity {
  uuid: string;
  timestamp: string;
  action: string;
  details?: string | null;
  employee: {
    uuid: string;
    first_name: string;
    last_name: string;
  } | null;
}

interface ParsedDetails {
  type?: string;
  new_expiration?: string;
}

interface VersionHistoryPanelProps {
  contentUuid: string;
  contentRow: ContentRow;
}

function parseDetails(raw?: string | null): ParsedDetails | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ParsedDetails;
  } catch {
    return null;
  }
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function employeeName(
  emp: HistoryActivity["employee"],
  fallback = "System",
): string {
  if (!emp) return fallback;
  return `${emp.first_name} ${emp.last_name}`.trim() || fallback;
}

type EventKind =
  | "created"
  | "file_update"
  | "expiration_only"
  | "file_and_expiration"
  | "metadata_update"
  | "checkout"
  | "checkin";

interface EventConfig {
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

function getEventConfig(
  action: string,
  details: ParsedDetails | null,
  isDark: boolean,
): EventConfig {
  if (action === "CREATE_CONTENT") {
    return {
      label: "Document created",
      icon: <AddCircleOutlineIcon sx={{ fontSize: 15 }} />,
      color: isDark ? "#4ade80" : "#15803d",
      bgColor: isDark ? "rgba(74,222,128,0.12)" : "rgba(21,128,61,0.08)",
    };
  }
  if (action === "CHECK_OUT_CONTENT") {
    return {
      label: "Checked out for editing",
      icon: <LockOutlinedIcon sx={{ fontSize: 15 }} />,
      color: isDark ? "#fb923c" : "#c2410c",
      bgColor: isDark ? "rgba(251,146,60,0.12)" : "rgba(194,65,12,0.08)",
    };
  }
  if (action === "CHECK_IN_CONTENT") {
    return {
      label: "Checked in",
      icon: <LockOpenOutlinedIcon sx={{ fontSize: 15 }} />,
      color: isDark ? "#94a3b8" : "#64748b",
      bgColor: isDark ? "rgba(148,163,184,0.1)" : "rgba(100,116,139,0.07)",
    };
  }

  // EDIT_CONTENT — branch on details.type
  const kind: EventKind = (details?.type as EventKind) ?? "metadata_update";
  switch (kind) {
    case "file_update":
      return {
        label: "File replaced",
        icon: <EditOutlinedIcon sx={{ fontSize: 15 }} />,
        color: isDark ? "#60a5fa" : "#1d4ed8",
        bgColor: isDark ? "rgba(96,165,250,0.12)" : "rgba(29,78,216,0.07)",
      };
    case "expiration_only":
      return {
        label: "Expiration date updated",
        icon: <EventAvailableIcon sx={{ fontSize: 15 }} />,
        color: isDark ? "#f472b6" : "#9d174d",
        bgColor: isDark ? "rgba(244,114,182,0.12)" : "rgba(157,23,77,0.07)",
      };
    case "file_and_expiration":
      return {
        label: "File & expiration updated",
        icon: <EditOutlinedIcon sx={{ fontSize: 15 }} />,
        color: isDark ? "#60a5fa" : "#1d4ed8",
        bgColor: isDark ? "rgba(96,165,250,0.12)" : "rgba(29,78,216,0.07)",
      };
    default:
      return {
        label: "Document modified",
        icon: <EditOutlinedIcon sx={{ fontSize: 15 }} />,
        color: isDark ? "#60a5fa" : "#1d4ed8",
        bgColor: isDark ? "rgba(96,165,250,0.12)" : "rgba(29,78,216,0.07)",
      };
  }
}

function TimelineEvent({
  activity,
  isLast,
  isDark,
}: {
  activity: HistoryActivity;
  isLast: boolean;
  isDark: boolean;
}) {
  const details = parseDetails(activity.details);
  const cfg = getEventConfig(activity.action, details, isDark);
  const by = employeeName(activity.employee);

  return (
    <Box sx={{ display: "flex", gap: 1.5, position: "relative" }}>
      {/* Connector line */}
      {!isLast && (
        <Box
          sx={{
            position: "absolute",
            left: 14,
            top: 28,
            bottom: -8,
            width: "1px",
            backgroundColor:
              isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
          }}
        />
      )}

      {/* Icon bubble */}
      <Box
        sx={{
          flexShrink: 0,
          width: 28,
          height: 28,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: cfg.bgColor,
          border: `1.5px solid ${cfg.color}`,
          color: cfg.color,
          mt: 0.25,
          zIndex: 1,
        }}
      >
        {cfg.icon}
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, pb: isLast ? 0 : 2 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            fontSize: "0.78rem",
            color: "text.primary",
            lineHeight: 1.3,
          }}
        >
          {cfg.label}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontSize: "0.7rem",
            display: "block",
            mt: 0.25,
          }}
        >
          {by}
        </Typography>

        {/* Expiration detail badge */}
        {details?.new_expiration && (
          <Chip
            label={`Expires ${formatDate(details.new_expiration)}`}
            size="small"
            icon={<ScheduleIcon sx={{ fontSize: "11px !important" }} />}
            sx={{
              "mt": 0.5,
              "height": 18,
              "fontSize": "0.65rem",
              "backgroundColor": cfg.bgColor,
              "color": cfg.color,
              "border": `1px solid ${cfg.color}`,
              "& .MuiChip-label": { px: 0.75 },
            }}
          />
        )}

        <Tooltip
          title={formatDateTime(activity.timestamp)}
          placement="right"
        >
          <Typography
            variant="caption"
            sx={{
              color: "text.disabled",
              fontSize: "0.65rem",
              display: "block",
              mt: 0.3,
              cursor: "default",
            }}
          >
            {formatDate(activity.timestamp)}
          </Typography>
        </Tooltip>
      </Box>
    </Box>
  );
}

function ExpirationStatus({
  expirationTime,
  isDark,
}: {
  expirationTime: Date | string | null | undefined;
  isDark: boolean;
}) {
  if (!expirationTime) return null;

  const expDate = new Date(expirationTime);
  const now = new Date();
  const isExpired = expDate < now;
  const daysUntil = Math.ceil(
    (expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  const soonThreshold = 14;
  const isSoon = !isExpired && daysUntil <= soonThreshold;

  const color =
    isExpired ?
      isDark ? "#f87171"
      : "#dc2626"
    : isSoon ?
      isDark ? "#fbbf24"
      : "#d97706"
    : isDark ? "#4ade80"
    : "#16a34a";

  const bgColor =
    isExpired ?
      isDark ? "rgba(248,113,113,0.1)"
      : "rgba(220,38,38,0.07)"
    : isSoon ?
      isDark ? "rgba(251,191,36,0.1)"
      : "rgba(217,119,6,0.07)"
    : isDark ? "rgba(74,222,128,0.1)"
    : "rgba(22,163,74,0.07)";

  const label =
    isExpired ? `Expired ${formatDate(expDate.toISOString())}`
    : isSoon ? `Expires in ${daysUntil} day${daysUntil === 1 ? "" : "s"}`
    : `Expires ${formatDate(expDate.toISOString())}`;

  return (
    <Box
      sx={{
        mt: 1.5,
        p: 1.25,
        borderRadius: 1.5,
        backgroundColor: bgColor,
        border: `1px solid ${color}`,
        display: "flex",
        alignItems: "center",
        gap: 0.75,
      }}
    >
      {isExpired || isSoon ?
        <WarningAmberIcon sx={{ fontSize: 14, color, flexShrink: 0 }} />
      : <EventAvailableIcon sx={{ fontSize: 14, color, flexShrink: 0 }} />}
      <Typography sx={{ fontSize: "0.7rem", color, fontWeight: 500 }}>
        {label}
      </Typography>
    </Box>
  );
}

export default function VersionHistoryPanel({
  contentUuid,
  contentRow,
}: VersionHistoryPanelProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [activities, setActivities] = useState<HistoryActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!contentUuid) return;
    setLoading(true);
    setError(false);

    fetch(`${API_BASE_URL}/content/history/${contentUuid}`, {
      credentials: "include",
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<HistoryActivity[]>;
      })
      .then((data) => {
        setActivities(data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [contentUuid]);

  const borderColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

  return (
    <Box
      sx={{
        width: 220,
        flexShrink: 0,
        borderLeft: `1px solid ${borderColor}`,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor:
          isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1.25,
          borderBottom: `1px solid ${borderColor}`,
          flexShrink: 0,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            fontSize: "0.65rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "text.secondary",
          }}
        >
          Version History
        </Typography>
      </Box>

      {/* Scrollable body */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 1.5, pt: 1.5, pb: 2 }}>
        {/* Expiration status */}
        <ExpirationStatus
          expirationTime={contentRow.expiration_time}
          isDark={isDark}
        />

        <Box sx={{ mt: 2 }}>
          {loading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                pt: 3,
              }}
            >
              <CircularProgress size={20} />
            </Box>
          )}

          {!loading && error && (
            <Typography
              variant="caption"
              sx={{ color: "error.main", fontSize: "0.7rem" }}
            >
              Could not load history.
            </Typography>
          )}

          {!loading && !error && activities.length === 0 && (
            <Typography
              variant="caption"
              sx={{ color: "text.disabled", fontSize: "0.7rem" }}
            >
              No history recorded yet.
            </Typography>
          )}

          {!loading &&
            !error &&
            activities.map((activity, i) => (
              <TimelineEvent
                key={activity.uuid}
                activity={activity}
                isLast={i === activities.length - 1}
                isDark={isDark}
              />
            ))}
        </Box>
      </Box>
    </Box>
  );
}
