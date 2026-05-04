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
import { motion } from "framer-motion";
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
import NotificationBarComponent from "../../features/notifications/components/NotificationBar.tsx";

const CREATED_COLOR = "#4f46e5";
const CHECKED_OUT_COLOR = "#d97706";

function getExpiresInSeconds(expirationTime: string | null): number {
  if (!expirationTime) return -1;
  return Math.floor((new Date(expirationTime).getTime() - Date.now()) / 1000);
}
import { API_ENDPOINTS } from "../../config";
import DocPreviewer from "../../features/content/components/viewing/DocPreviewer.tsx";
import VersionHistoryPanel from "../../features/content/components/viewing/VersionHistoryPanel.tsx";
import { useSidebar } from "../../components/SidebarContext.tsx";
import { Icon } from "lucide-react";
import { NotificationFilterProvider } from "../../features/notifications/components/NotificationsSettingsToggle.tsx";

export function getEventColor(expirationTime: string | null): string {
  if (!expirationTime) return "#06d606";
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

function formatShortTime(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
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
  const { isOpen } = useSidebar();
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

  const currentPosition = useMemo(() => {
    if (!profile?.position) return null;
    return `${profile.position}`;
  }, [profile?.position]);

  const events = useMemo<EventInput[]>(() => {
    if (!session || !currentUserName) return [];

    return rows.reduce((acc: EventInput[], row) => {
      if (!row || !row.expirationTime) return acc;

      const isOwner =
        row.contentOwner?.toLowerCase() === currentUserName.toLowerCase();
      const isCheckedOutByMe =
        row.editLock?.lockedByEmp?.uuid === session.employeeUuid;
      const isAdmin = profile?.position === "ADMIN";

      if (isOwner || isCheckedOutByMe || isAdmin) {
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

        const eventColor = getEventColor(row.expirationTime.toString());

        acc.push({
          id: `${isOwner ? "owner" : "checkout"}-${row.uuid}`,
          title: `${isOwner ? "✏️" : "👁️"} ${formatShortTime(originalExpDate)} ${row.title}`,
          start: startTime,
          end: endTime,
          allDay: false,
          color: eventColor,
          backgroundColor: eventColor,
          borderColor: "#000000",
          textColor: "#ffffff",
          extendedProps: { row },
        });
      }
      return acc;
    }, []);
  }, [rows, session, currentUserName]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{ width: "100%" }}
    >
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #1A1E4B 0%, #395176 60%, #4a7aab 100%)",
          px: 4,
          pt: 5,
          pb: 3,
          position: "relative",
          overflow: "hidden",
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
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
              pointerEvents: "none",
              overflow: "hidden",
            }}
          />
        ))}
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ mb: 0.5 }}
            >
              <Typography
                variant="h2"
                sx={{ color: "white", fontWeight: 700, overflow: "hidden" }}
              >
                Calendar
              </Typography>
            </Stack>
            <Typography
              sx={{ color: "rgba(255,255,255,0.65)", fontSize: "0.95rem" }}
            >
              See when content you created (✏️) or checked out (👁️) will expire
            </Typography>
          </Box>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2, mb: 3 }}
          >
            <HelpPopup
              description="This queue shows all PENDING claims. Expand each card to read the details, write your risk notes, then clear or flag."
              infoOrHelp={true}
            />
          </Box>
        </Stack>

        <Card
          className="calendar-grid"
          sx={{
            p: 3,
            backgroundColor: "background.paper",
            minWidth: 0,
            width: isOpen ? "calc(100vw - 280px)" : "calc(100vw - 64px)",
            overflowX: "auto",
            minHeight: "calc(100vh - 130px)",
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

                .fc .fc-col-header-cell.fc-day-today .fc-col-header-cell-cushion {
                  color: #ffffff !important;
                  font-weight: 700 !important;
                }

                .fc .fc-daygrid-day.fc-day-today {
                  background-color: rgba(59, 130, 246, 0.12) !important;
                }
                .fc .fc-timegrid-col.fc-day-today {
                  background-color: rgba(59, 130, 246, 0.08) !important;
                }

                .fc .fc-col-header-cell {
                  background-color: #102347 !important;
                }
                .fc .fc-col-header-cell-cushion {
                  color: #ffffff !important;
                  text-decoration: none !important;
                  font-weight: 600 !important;
                }

                .fc-event-time {
                  display: none !important;
                }

                
                  
              `}</style>

              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  height: "calc(100vh - 180px)",
                }}
              >
                <div style={{ width: "300px", flexShrink: 0 }}>
                  <Card sx={{ height: "100%", overflow: "auto" }}>
                    <NotificationBarComponent showFilters={true} />
                  </Card>
                </div>
                <div style={{ flex: 1, minWidth: 0, overflow: "auto" }}>
                  <Card sx={{ height: "100%" }}>
                    <FullCalendar
                      ref={calendarRef}
                      plugins={[
                        dayGridPlugin,
                        timeGridPlugin,
                        interactionPlugin,
                      ]}
                      initialView="dayGridMonth"
                      eventDisplay="block"
                      height="100%"
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
                      displayEventTime={false}
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
                  </Card>
                </div>
              </div>
            </>
          }
        </Card>
        <Dialog
          open={previewDoc !== null}
          onClose={() => setPreviewDoc(null)}
          maxWidth="xl"
          fullWidth
        >
          <Box
            sx={{ height: "85vh", display: "flex", flexDirection: "column" }}
          >
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
    </motion.div>
  );
}
