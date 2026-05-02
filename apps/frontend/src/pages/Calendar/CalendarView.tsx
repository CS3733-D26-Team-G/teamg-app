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
import { useAuth } from "../../auth/AuthContext";
import { type ContentRow } from "../../types/content";
import type { EventInput } from "@fullcalendar/core";
import {
  Box,
  Card,
  Dialog,
  IconButton,
  Stack,
  styled,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getExpirationStatus } from "../../features/notifications/components/Notifications.ts";
import HelpPopup from "../../components/HelpPopup.tsx";
import NotificationsBell from "../../features/notifications/components/NotificationBell.tsx";
import { useProfile } from "../../profile/ProfileContext.tsx";
import { loadContentList } from "../../lib/api-loaders";
import { useTheme } from "@mui/material/styles";
import { API_ENDPOINTS } from "../../config";
import DocPreviewer from "../../features/content/components/DocPreviewer.tsx";
import VersionHistoryPanel from "../../features/content/components/VersionHistoryPanel.tsx";

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
      return "#06d606";
  }
}

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  flexDirection: "column",
  alignItems: "stretch",
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  minHeight: 128,
}));

export default function CalendarPage() {
  const { session } = useAuth();
  const { profile } = useProfile();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const calendarRef = useRef<FullCalendar>(null);
  const [rows, setRows] = useState<ContentRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [previewDoc, setPreviewDoc] = useState<{
    uri: string;
    fileName: string;
    uuid: string;
    row: ContentRow;
  } | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      setRows(await loadContentList());
    } catch (err) {
      console.error("Failed to fetch content:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchContent();
  }, [fetchContent]);

  const currentUserName = useMemo(() => {
    if (!profile?.firstName || !profile?.lastName) return null;
    return `${profile.firstName} ${profile.lastName}`;
  }, [profile?.firstName, profile?.lastName]);

  const events = useMemo<EventInput[]>(() => {
    if (!session || !currentUserName) return [];

    return rows.reduce((acc: EventInput[], row) => {
      if (!row || !row.expirationTime) return acc;

      const isOwner =
        row.contentOwner?.toLowerCase() === currentUserName.toLowerCase();
      const isCheckedOutByMe =
        row.editLock?.lockedByEmp?.uuid === session.employeeUuid;

      if (isOwner || isCheckedOutByMe) {
        const originalExpDate = new Date(row.expirationTime);
        if (isNaN(originalExpDate.getTime())) return acc;

        let startTime = new Date(originalExpDate);
        const endTime = new Date(originalExpDate);

        if (endTime.getHours() === 0 && endTime.getMinutes() === 0) {
          endTime.setMilliseconds(-1);
          startTime = new Date(endTime);
          startTime.setMinutes(endTime.getMinutes() - 60);
        } else {
          startTime.setMinutes(originalExpDate.getMinutes() - 60);
        }

        const timeString = originalExpDate.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

        acc.push({
          id: `${isOwner ? "owner" : "checkout"}-${row.uuid}`,
          title: ` ${isOwner ? "✏️" : "👁️"}  ${row.title}`,
          start: startTime,
          end: endTime,
          allDay: false,
          color: getEventColor(row.expirationTime.toString()),
          borderColor: "#000000",
          extendedProps: { row },
        });
      }
      return acc;
    }, []);
  }, [rows, session, currentUserName]);

  return (
    <Box sx={{ width: "100%" }}>
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
          backgroundColor: "background.paper",
          minWidth: 0,
          width: "calc(100vw - 240px)",
          overflowX: "auto",
          minHeight: "calc(100vh - 128px)",
          border: "none",
          boxShadow: "none",
        }}
      >
        {loading ?
          <Typography>Loading calendar…</Typography>
        : <>
            {isDarkMode && (
              <style>{`
                .fc .fc-col-header-cell {
                  background-color: #161B27 !important;
                }
                .fc .fc-col-header-cell-cushion {
                  color: #9BA3B8 !important;
                  text-decoration: none !important;
                }
                .fc-theme-standard td,
                .fc-theme-standard th,
                .fc-theme-standard .fc-scrollgrid,
                .fc .fc-scrollgrid-liquid {
                  border-color: rgba(255,255,255,0.08) !important;
                }
                .fc .fc-scrollgrid-section > * {
                  border-color: rgba(255,255,255,0.08) !important;
                }
                .fc table {
                  border-color: rgba(255,255,255,0.08) !important;
                }
                .fc .fc-timegrid-col.fc-day-today {
                  background-color: rgba(77,159,255,0.08) !important;
                }
                .fc .fc-timegrid-axis {
                  background-color: #161B27 !important;
                  border-color: rgba(255,255,255,0.08) !important;
                }
                .fc .fc-timegrid-axis-cushion {
                  color: #9BA3B8 !important;
                }
                .fc-theme-standard .fc-scrollgrid-section-sticky > * {
                  background-color: #161B27 !important;
                  border-color: rgba(255,255,255,0.08) !important;
                }
                .fc .fc-timegrid-slot {
                  border-color: rgba(255,255,255,0.08) !important;
                }
                .fc .fc-daygrid-day,
                .fc .fc-timegrid-col {
                  background-color: transparent !important;
                }
              `}</style>
            )}

            <style>{`
              .fc,
              .fc-toolbar-title,
              .fc-col-header-cell,
              .fc-daygrid-day-number,
              .fc-event,
              .fc-button {
                font-family: 'Rubik', sans-serif !important;
              }

              .fc-event {
                cursor: pointer !important;
              }

              
              .fc .fc-daygrid-day.fc-day-today,
              .fc .fc-timegrid-col.fc-day-today,
              .fc .fc-timegrid-col-frame.fc-day-today {
                background-color: rgba(6, 43, 112, 0.29) !important;
              }

              .fc .fc-day-today .fc-daygrid-day-number,
              .fc .fc-day-today .fc-col-header-cell-cushion {
                color: #0c204b !important;
                font-weight: 700;
              }
              .fc .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
                color: #0c204b !important;
                font-weight: 700;
              }

                .fc .fc-col-header-cell {
                  background-color: #102347 !important;
                }

                 .fc .fc-col-header-cell-cushion {
                  color: #d6e4ff !important;
                  text-decoration: none !important;
                  font-weight: 600 !important;
                }


              .fc-daygrid-event-dot {
                display: none !important;
              }
              .fc-daygrid-dot-event {
                background-color: var(--fc-event-bg-color) !important;
                border: 1px solid #000000 !important;
                border-radius: 4px !important;
                padding: 1px 4px !important;
              }
              .fc-daygrid-dot-event .fc-event-title {
                font-weight: 500 !important;
                color: black !important;
              }
              .fc-daygrid-dot-event .fc-event-time {
                color: rgba(255,255,255,0.85) !important;
              }

              .fc-daygrid-block-event,
              .fc-timegrid-event {
                border: 1px solid #000000 !important;
                border-radius: 4px !important;
              }

              
              .fc-event .fc-event-title,
              .fc-event .fc-event-time {
                color: white !important;
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
                weekToday: {
                  text: "Week",
                  click: () => {
                    const calendarApi = calendarRef.current?.getApi();
                    if (calendarApi) {
                      calendarApi.today();
                      calendarApi.changeView("timeGridWeek");
                    }
                  },
                },
                Month: {
                  text: "Month",
                  click: () => {
                    const calendarApi = calendarRef.current?.getApi();
                    if (calendarApi) {
                      calendarApi.today();
                      calendarApi.changeView("dayGridMonth");
                    }
                  },
                },
              }}
              headerToolbar={{
                left: "prev,next",
                center: "title",
                right: "Month,weekToday,dayToday",
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
                const row = info.event.extendedProps.row as ContentRow;
                setPreviewDoc({
                  uri: API_ENDPOINTS.CONTENT.FILE(row.uuid),
                  fileName: row.title,
                  uuid: row.uuid,
                  row,
                });
              }}
            />
          </>
        }
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography
            variant="body2"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <span>✏️</span> Content I Made
          </Typography>
          <Typography
            variant="body2"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <span>👁️</span> Content I Checked Out
          </Typography>
        </Box>
      </Card>

      <Dialog
        open={previewDoc !== null}
        onClose={() => setPreviewDoc(null)}
        maxWidth="xl"
        fullWidth
      >
        <Box sx={{ height: "85vh", display: "flex", flexDirection: "column" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 1, gap: 1, flexShrink: 0 }}
          >
            <Typography
              variant="subtitle2"
              sx={{ pl: 1, color: "text.secondary" }}
              noWrap
            >
              {previewDoc?.fileName ?? "Preview"}
            </Typography>
            <Tooltip title="Close">
              <IconButton
                onClick={() => setPreviewDoc(null)}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Stack>

          <Box sx={{ flex: 1, minHeight: 0, display: "flex" }}>
            {previewDoc && (
              <DocPreviewer
                key={previewDoc.uuid}
                uri={previewDoc.uri}
                fileName={previewDoc.fileName}
              />
            )}
            {previewDoc && rows.find((r) => r.uuid === previewDoc.uuid) && (
              <VersionHistoryPanel
                contentUuid={previewDoc.uuid}
                contentRow={rows.find((r) => r.uuid === previewDoc.uuid)!}
              />
            )}
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}
