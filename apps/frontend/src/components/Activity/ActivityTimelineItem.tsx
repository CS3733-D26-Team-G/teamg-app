import {
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
  TimelineDot,
} from "@mui/lab";
import { Avatar, Box, Typography, Link, Chip } from "@mui/material";
import { type ActivityItem } from "./activityData";
import EditIcon from "@mui/icons-material/Edit";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

function getActionConfig(action: string): {
  label: string;
  dotColor: "primary" | "success" | "warning" | "error" | "grey";
  chipColor: "primary" | "success" | "warning" | "error" | "default";
  icon: React.ReactNode;
} {
  const normalized = action?.toLowerCase().replace(/\s+/g, "_").trim() ?? "";
  const map: Record<
    string,
    {
      label: string;
      dotColor: "primary" | "success" | "warning" | "error" | "grey";
      chipColor: "primary" | "success" | "warning" | "error" | "default";
      icon: React.ReactNode;
    }
  > = {
    edit_content: {
      label: "Edited",
      dotColor: "primary",
      chipColor: "primary",
      icon: <EditIcon sx={{ fontSize: 16 }} />,
    },
    check_out_content: {
      label: "Checked Out",
      dotColor: "primary",
      chipColor: "primary",
      icon: <LockIcon sx={{ fontSize: 16 }} />,
    },
    check_in_content: {
      label: "Checked In",
      dotColor: "success",
      chipColor: "success",
      icon: <LockOpenIcon sx={{ fontSize: 16 }} />,
    },
    create_content: {
      label: "Created",
      dotColor: "success",
      chipColor: "success",
      icon: <AddIcon sx={{ fontSize: 16 }} />,
    },
    delete_content: {
      label: "Deleted",
      dotColor: "error",
      chipColor: "error",
      icon: <DeleteIcon sx={{ fontSize: 16 }} />,
    },
    log_in: {
      label: "Logged In",
      dotColor: "grey",
      chipColor: "default",
      icon: <PersonIcon sx={{ fontSize: 16 }} />,
    },
    log_out: {
      label: "Logged Out",
      dotColor: "grey",
      chipColor: "default",
      icon: <PersonIcon sx={{ fontSize: 16 }} />,
    },
    create_claim: {
      label: "Created Claim",
      dotColor: "success",
      chipColor: "success",
      icon: <AddIcon sx={{ fontSize: 16 }} />,
    },
    edit_claim: {
      label: "Edited Claim",
      dotColor: "primary",
      chipColor: "primary",
      icon: <EditIcon sx={{ fontSize: 16 }} />,
    },
    delete_claim: {
      label: "Deleted Claim",
      dotColor: "error",
      chipColor: "error",
      icon: <DeleteIcon sx={{ fontSize: 16 }} />,
    },
    create_employee: {
      label: "Created Employee",
      dotColor: "success",
      chipColor: "success",
      icon: <AddIcon sx={{ fontSize: 16 }} />,
    },
    edit_employee: {
      label: "Edited Employee",
      dotColor: "primary",
      chipColor: "primary",
      icon: <EditIcon sx={{ fontSize: 16 }} />,
    },
    delete_employee: {
      label: "Deleted Employee",
      dotColor: "error",
      chipColor: "error",
      icon: <DeleteIcon sx={{ fontSize: 16 }} />,
    },
    ownership_change: {
      label: "Ownership Changed",
      dotColor: "warning",
      chipColor: "warning",
      icon: <EditIcon sx={{ fontSize: 16 }} />,
    },
  };
  return (
    map[normalized] ?? {
      label: action,
      dotColor: "grey",
      chipColor: "default",
      icon: <PersonIcon sx={{ fontSize: 16 }} />,
    }
  );
}

function isCheckoutAction(action: string): boolean {
  const normalized = action?.toLowerCase().replace(/\s+/g, "_").trim() ?? "";
  return normalized === "check_out_content";
}

interface ActivityTimelineItemProps extends ActivityItem {
  onPreview?: (resourceUuid: string, resourceName: string) => void;
}

export default function ActivityTimelineItem({
  time,
  user,
  action,
  resourceName,
  resourceUuid,
  avatarUrl,
  onPreview,
}: ActivityTimelineItemProps) {
  const { label, dotColor, chipColor, icon } = getActionConfig(action);
  const isCheckout = isCheckoutAction(action);
  const canPreview = isCheckout && !!resourceUuid && !!resourceName;

  return (
    <TimelineItem>
      <TimelineOppositeContent
        sx={{ flex: "none", width: 70, m: "auto 0", pr: 2 }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
        >
          {time}
        </Typography>
      </TimelineOppositeContent>

      <TimelineSeparator>
        <TimelineConnector />
        <TimelineDot
          color={dotColor}
          sx={{ p: 0.5 }}
        >
          {icon}
        </TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>

      <TimelineContent sx={{ py: "10px", px: 2 }}>
        <Box
          sx={{
            border: "0.5px solid",
            borderColor: "divider",
            borderRadius: 2,
            px: 2,
            py: 1.25,
            backgroundColor: "background.paper",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Avatar
            src={avatarUrl}
            sx={{ width: 32, height: 32, fontSize: "0.7rem", fontWeight: 600 }}
          >
            {user
              .split(" ")
              .map((n) => n.charAt(0))
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              noWrap
            >
              <strong>{user}</strong> <strong>{label.toLowerCase()}</strong>{" "}
              {resourceName &&
                (canPreview ?
                  <Link
                    component="span"
                    underline="hover"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreview?.(resourceUuid!, resourceName);
                    }}
                    sx={{
                      fontWeight: 600,
                      color: "primary.main",
                      cursor: "pointer",
                    }}
                  >
                    {resourceName}
                  </Link>
                : <strong>{resourceName}</strong>)}
            </Typography>
          </Box>

          <Chip
            label={label}
            color={chipColor}
            size="small"
            icon={icon as React.ReactElement}
            sx={{ flexShrink: 0, fontWeight: 500 }}
          />
        </Box>
      </TimelineContent>
    </TimelineItem>
  );
}
