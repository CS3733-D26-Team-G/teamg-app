import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState, useCallback, useMemo } from "react";
import { API_ENDPOINTS } from "../config";
import { useAuth } from "../auth/AuthContext";
import { ContentRowsSchema, type ContentRow } from "../types/content";
import type { EventInput } from "@fullcalendar/core";

const CREATED_COLOR = "#4f46e5";
const CHECKED_OUT_COLOR = "#d97706";

export default function CalendarPage() {
  const { session } = useAuth();
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
      const data = (await res.json()) as {
        first_name: string;
        last_name: string;
      };
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
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: unknown = await res.json();
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

    const result: EventInput[] = [];

    for (const row of rows) {
      const isOwner =
        row.content_owner?.toLowerCase() === currentUserName.toLowerCase();

      const isCheckedOutByMe =
        row.editLock?.lockedByEmp?.uuid === session.employeeUuid;

      if (isOwner) {
        result.push({
          id: `created-${row.uuid}`,
          title: `📄 ${row.title}`,
          start: row.last_modified_time,
          end: row.expiration_time,
          color: CREATED_COLOR,
          extendedProps: { type: "created", row },
        });
      }

      if (isCheckedOutByMe) {
        result.push({
          id: `checkout-${row.uuid}`,
          title: `✏️ ${row.title} (checked out)`,
          start: row.last_modified_time,
          color: CHECKED_OUT_COLOR,
          extendedProps: { type: "checkout", row },
        });
      }
    }

    return result;
  }, [rows, session, currentUserName]);

  if (loading) return <p style={{ padding: 24 }}>Loading calendar…</p>;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", gap: 20, marginBottom: 16, fontSize: 13 }}>
        <span>
          <span
            style={{
              display: "inline-block",
              width: 12,
              height: 12,
              borderRadius: 3,
              background: CREATED_COLOR,
              marginRight: 6,
            }}
          />
          Content I created
        </span>
        <span>
          <span
            style={{
              display: "inline-block",
              width: 12,
              height: 12,
              borderRadius: 3,
              background: CHECKED_OUT_COLOR,
              marginRight: 6,
            }}
          />
          Checked out by me
        </span>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        eventClick={(info) => {
          const row = info.event.extendedProps.row as ContentRow;
          alert(
            `${row.title}\nStatus: ${row.status}\nExpires: ${new Date(row.expiration_time).toLocaleDateString()}`,
          );
        }}
        height="auto"
      />
    </div>
  );
}
