import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { useState } from "react";
import { API_ENDPOINTS } from "../config";
import { useAuth } from "../auth/AuthContext";
import { ContentRowsSchema, type ContentRow } from "../types/content"; // will all be used when linking a calendar to a profile... I think...

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: "1", title: "Team Meeting", start: "2026-04-28T10:00:00" },
  ]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const title = prompt("Enter event title:");
    if (title) {
      setEvents((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
        },
      ]);
    }
    selectInfo.view.calendar.unselect();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (confirm(`Delete "${clickInfo.event.title}"?`)) {
      setEvents((prev) => prev.filter((e) => e.id !== clickInfo.event.id));
    }
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      }}
      selectable={true}
      editable={true}
      events={events}
      select={handleDateSelect}
      eventClick={handleEventClick}
    />
  );
}
