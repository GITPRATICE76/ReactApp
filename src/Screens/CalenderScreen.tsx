import { useEffect, useState} from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import axiosInstance from "../Routes/axiosInstance";
import { HOLIDAY_URL } from "../services/userapi.service";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { enUS } from "date-fns/locale/en-US";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function LeaveCalendar() {
  const [events, setEvents] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchCalendar(currentDate);
  }, [currentDate]);

  const fetchCalendar = async (date: Date) => {
    try {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

     const res = await axiosInstance.get(HOLIDAY_URL, {
  params: {
    year: year,
    month: month,
  },
});


      const holidays = res.data.holidays || [];
      const leaves = res.data.leaves || [];

      const holidayEvents = holidays.map((h: any) => ({
        title: `Holiday: ${h.name}`,
        start: new Date(h.date),
        end: new Date(h.date),
        allDay: true,
        type: "HOLIDAY",
      }));

      const leaveEvents = leaves.map((l: any) => ({
        title: `${l.name} - ${l.leave_type}`,
        start: new Date(l.from_date),
        end: new Date(l.to_date),
        allDay: true,
        type: l.leave_type,
      }));

      setEvents([...holidayEvents, ...leaveEvents]);
    } catch (err) {
      console.error("Calendar load failed");
    }
  };

  const eventStyleGetter = (event: any) => {
    let backgroundColor = "#3b82f6";

    if (event.type === "SICK") {
      backgroundColor = "#ef4444";
    }

    if (event.type === "HOLIDAY") {
      backgroundColor = "#7c3aed";
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "6px",
        color: "white",
        border: "none",
      },
    };
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Team Leave Calendar</h2>

      {/* <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        eventPropGetter={eventStyleGetter}
        date={currentDate}
        onNavigate={(date: SetStateAction<Date>) => setCurrentDate(date)}
      /> */}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        eventPropGetter={eventStyleGetter}
        date={currentDate}
        onNavigate={(date: Date) => setCurrentDate(date)}
        defaultView="month"
        views={{ month: true }}
        popup
      />

      {/* Legend */}
      <div className="flex gap-6 mt-4 text-sm">
        <Legend color="#3b82f6" label="Casual Leave" />
        <Legend color="#ef4444" label="Sick Leave" />
        <Legend color="#7c3aed" label="Holiday" />
      </div>
    </div>
  );
}

function Legend({ color, label }: any) {
  return (
    <div className="flex items-center gap-2">
      <div style={{ backgroundColor: color }} className="w-4 h-4 rounded"></div>
      <span>{label}</span>
    </div>
  );
}
