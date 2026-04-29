import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { API_ENDPOINTS } from "../config";
import { useAuth } from "../auth/AuthContext";
import { ContentRowsSchema, type ContentRow } from "../types/content";
import type { EventInput } from "@fullcalendar/core";
import { Box, Typography } from "@mui/material";
import { getExpirationStatus } from "./Notifications/Notifications.ts";

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
      const parsed = ContentRowsSchema.safeParse(data);
      if (parsed.success) setRows(parsed.data);
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
    if (!session || !currentUserName) return [];

    return rows.reduce((acc: EventInput[], row) => {
      const isOwner =
        row.content_owner?.toLowerCase() === currentUserName.toLowerCase();
      const isCheckedOutByMe =
        row.editLock?.lockedByEmp?.uuid === session.employeeUuid;

      if (isOwner || isCheckedOutByMe) {
        const originalExpDate = new Date(row.expiration_time);
        if (isNaN(originalExpDate.getTime())) return acc;

        let startTime = new Date(originalExpDate);
        const endTime = new Date(originalExpDate);

        // Logic to prevent "Midnight Spill":
        // If it's exactly midnight (00:00:00), it technically belongs to the next day.
        // We pull it back to 11:55 PM - 11:59 PM of the previous day.
        if (endTime.getHours() === 0 && endTime.getMinutes() === 0) {
          endTime.setMilliseconds(-1); // Go to 23:59:59.999 of prev day
          startTime = new Date(endTime);
          startTime.setMinutes(endTime.getMinutes() - 5);
        } else {
          // Otherwise, just make it a 5-minute block ending at the due time
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

  return (
    <Box sx={{ backgroundColor: "background.default", width: "100%" }}>
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #1A1E4B 0%, #395176 60%, #4a7aab 100%)",
          px: 3,
          pt: 4,
          pb: 2,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            color: "white",
            fontWeight: "bold",
            fontFamily: "'Rubik', sans-serif",
          }}
        >
          Calendar
        </Typography>
      </Box>

      <Box sx={{ p: 3, backgroundColor: "#ffffff" }}>
        {loading ?
          <Typography>Loading calendar…</Typography>
        : <>
            <style>{`
              @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap');
              .fc { font-family: 'Rubik', sans-serif !important; }
              .fc-dayGridMonth-button, .fc-timeGridWeek-button, .fc-dayToday-button { text-transform: capitalize !important; }
              
              .fc-event { 
                border-radius: 4px !important; 
                padding: 1px 4px !important; 
                cursor: pointer;
                border: 1px solid rgba(0,0,0,0.1) !important;
              }
              
              /* In Day View, ensure the event doesn't look like a tiny sliver */
              .fc-timegrid-event {
                min-height: 30px !important;
              }
            `}</style>

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
              displayEventTime={true}
              eventTimeFormat={{
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }}
              height="auto"
              // Ensure that even in Day View, 5 min blocks are visible
              componentCheck={true}
              eventClick={(info) => {
                const row = info.event.extendedProps.row;
                alert(
                  `${row.title}\nExpires: ${new Date(row.expiration_time).toLocaleString()}`,
                );
              }}
            />
          </>
        }
      </Box>
    </Box>
  );
}
