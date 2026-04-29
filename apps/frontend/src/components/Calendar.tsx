import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { API_ENDPOINTS } from "../config";
import { useAuth } from "../auth/AuthContext";
import { ContentRowsSchema, type ContentRow } from "../types/content";
import type { EventInput } from "@fullcalendar/core";
import { Box, Card, styled, Toolbar, Typography } from "@mui/material";

const CREATED_COLOR = "#4f46e5";
const CHECKED_OUT_COLOR = "#d97706";
import { getExpirationStatus } from "./Notifications/Notifications.ts";
import HelpPopup from "./HelpPopup.tsx";
import NotificationsBell from "./Notifications/NotificationBell.tsx";
import SearchBar from "../pages/DashboardComponents/SearchBar.tsx";

function getExpiresInSeconds(expirationTime: string | null): number {
  if (!expirationTime) return -1;

  return Math.floor((new Date(expirationTime).getTime() - Date.now()) / 1000);
}

export function getEventColor(expirationTime: string | null): string {
  if (!expirationTime) return "#11d42b";
  const expiresInSeconds = Math.floor(
    (new Date(expirationTime).getTime() - Date.now()) / 1000,
  );
  const status = getExpirationStatus(expiresInSeconds);
  switch (status) {
    case "critical":
      return "#dc2626";
    case "warning":
      return "#f59e0b";
    case "info":
      return "#2563eb";
    case "expired":
      return "#6b7280";
    default:
      return "#4f46e5";
  }
}

export default function CalendarPage() {
  const { session } = useAuth();
  const calendarRef = useRef<FullCalendar>(null);
  const [rows, setRows] = useState<ContentRow[]>([]);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!session?.employeeUuid) return;
    try {
      const res = await fetch(API_ENDPOINTS.PROFILE.ROOT, {
        credentials: "include",
      });
      if (!res.ok) return;
      const data = await res.json();
      setCurrentUserName(`${data.first_name} ${data.last_name}`);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  }, [session?.employeeUuid]);

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch(API_ENDPOINTS.CONTENT.ROOT, {
        credentials: "include",
      });
      const data = await res.json();

      console.log("Calendar Raw Data:", data);

      // We wrap this because if the schema file has a 'path' import,
      // calling safeParse will throw a hard error.
      try {
        const parsed = ContentRowsSchema.safeParse(data);
        if (parsed.success) {
          setRows(parsed.data);
          return; // Exit early if successful
        } else {
          console.error("Zod Validation Failed:", parsed.error.format());
        }
      } catch (parseError) {
        console.error(
          "The Schema file itself crashed (Module 'path' error):",
          parseError,
        );
      }

      // FALLBACK: If parsing fails or crashes, but we have an array,
      // show the data anyway so the UI doesn't break.
      if (Array.isArray(data)) {
        console.warn("Using raw data fallback for calendar items.");
        setRows(data as ContentRow[]);
      }
    } catch (err) {
      console.error("Failed to fetch content:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProfile();
    void fetchContent();
  }, [fetchProfile, fetchContent]);

  const events = useMemo<EventInput[]>(() => {
    // If currentUserName is missing, events won't show.
    // Check if the profile API changed its response fields.
    if (!session || !currentUserName) {
      console.warn("Calendar hidden: Missing session or username", {
        session,
        currentUserName,
      });
      return [];
    }

    return rows.reduce((acc: EventInput[], row) => {
      // Ensure row and expiration_time exist
      if (!row || !row.expiration_time) return acc;

      const isOwner =
        row.content_owner?.toLowerCase() === currentUserName.toLowerCase();
      const isCheckedOutByMe =
        row.editLock?.lockedByEmp?.uuid === session.employeeUuid;

      if (isOwner || isCheckedOutByMe) {
        const originalExpDate = new Date(row.expiration_time);
        if (isNaN(originalExpDate.getTime())) return acc;

        // Logic to prevent "Midnight Spill" in Day View
        let startTime = new Date(originalExpDate);
        const endTime = new Date(originalExpDate);

        if (endTime.getHours() === 0 && endTime.getMinutes() === 0) {
          endTime.setMilliseconds(-1);
          startTime = new Date(endTime);
          startTime.setMinutes(endTime.getMinutes() - 5);
        } else {
          startTime.setMinutes(originalExpDate.getMinutes() - 5);
        }

        const timeString = originalExpDate.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

        acc.push({
          id: `${isOwner ? "owner" : "checkout"}-${row.uuid}`,
          title: `${isOwner ? "📄" : "👁️"} ${row.title} (${timeString})`,
          start: startTime,
          end: endTime,
          allDay: false,
          color: getEventColor(row.expiration_time.toString()),
          extendedProps: { row },
        });
      }
      return acc;
    }, []);
  }, [rows, session, currentUserName]);

  const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    flexDirection: "column",
    alignItems: "stretch",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    minHeight: 128,
  }));

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <StyledToolbar
        sx={{
          background:
            "linear-gradient(90deg, #1A1E4B 0%, #395176 60%, #4a7aab 100%)",
          overflow: "hidden",
        }}
      >
        <div className="flex justify-between items-center px-8 py-6">
          <Typography
            variant="h2"
            sx={{ fontWeight: "bold", color: "white" }}
          >
            Calendar
          </Typography>
          {[...Array(3)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: "absolute",
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.12)",
                width: 120 + i * 80,
                height: 120 + i * 80,
                top: -40 - i * 30,
                right: -40 - i * 30,
              }}
            />
          ))}
          <div className="flex items-center gap-2">
            <HelpPopup
              description={"See upcoming expiring content"}
              infoOrHelp={true}
            />
            <NotificationsBell />
          </div>
        </div>
      </StyledToolbar>

      <Card
        sx={{
          p: 3,
          backgroundColor: "#ffffff",
          minWidth: 0,
          width: "165vh",
          overflowX: "auto",
        }}
      >
        {loading ?
          <Typography>Loading calendar…</Typography>
        : <>
            {/*<style>{`*/}
            {/*  .fc-event {*/}
            {/*    border: 1px solid #000 !important;*/}
            {/*    box-sizing: border-box;*/}
            {/*    border-radius: 6px;*/}
            {/*  }*/}

            {/*  .fc {*/}
            {/*    max-width: 100%;*/}
            {/*  }*/}

            {/*  .fc-toolbar-title {*/}
            {/*    color: #111827 !important;*/}
            {/*  }*/}

            {/*  .fc-view-harness {*/}
            {/*    min-width: 0 !important;*/}
            {/*  }*/}

            {/*  .fc-scrollgrid {*/}
            {/*    width: 100% !important;*/}
            {/*  }*/}
            {/*`}</style>*/}
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              customButtons={{
                dayToday: {
                  text: "Day",
                  click: () => {
                    const calendarApi = calendarRef.current?.getApi();
                    if (calendarApi) {
                      calendarApi.today();
                      calendarApi.changeView("timeGridDay");
                    }
                  },
                },
              }}
              headerToolbar={{
                left: "prev,next",
                center: "title",
                right: "dayGridMonth,timeGridWeek,dayToday",
              }}
              events={events}
              forceEventDuration={true}
              displayEventTime={true}
              eventTimeFormat={{
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }}
              height="auto"
              eventClick={(info) => {
                const row = info.event.extendedProps.row;
                alert(
                  `${row.title}\nExpires: ${new Date(row.expiration_time).toLocaleString()}`,
                );
              }}
            />
          </>
        }
      </Card>
    </Box>
  );
}
