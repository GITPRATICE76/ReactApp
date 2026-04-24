import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import axiosInstance from "../Routes/axiosInstance";
import { HOLIDAY_URL } from "../services/userapi.service";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { enUS } from "date-fns/locale/en-US";
import { FiChevronLeft, FiChevronRight, FiCalendar } from "react-icons/fi";

const locales = { "en-US": enUS };
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
        params: { year, month },
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
  status: l.status, // Add this line
}));

      setEvents([...holidayEvents, ...leaveEvents]);
    } catch (err) {
      console.error("Calendar load failed");
    }
  };

  

const eventStyleGetter = (event: any) => {
  let color = "#3b82f6"; // Default Blue (Casual Approved)
  
  // 1. Check Status First
  if (event.status === "PENDING") {
    color = "#f59e0b"; // Amber for Pending
  } else {
    // 2. Otherwise color by Type
    if (event.type === "SICK") color = "#ef4444"; // Red
    if (event.type === "HOLIDAY") color = "#8b5cf6"; // Purple
  }

  return {
    className: "hover:brightness-90 transition-all",
    style: {
      backgroundColor: `${color}15`, // Slightly more transparent (15%) for a cleaner look
      color: color,
      borderRadius: "6px",
      borderLeft: `4px solid ${color}`,
      fontSize: "10px",
      fontWeight: "900", // Extra bold for MNC standard
      padding: "2px 6px",
      borderTop: "none",
      borderRight: "none",
      borderBottom: "none",
    },
  };
};

  function CustomToolbar(props: any) {
    const { label, onNavigate } = props;
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
          <button
            onClick={() => onNavigate("PREV")}
            className="p-2 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors"
          >
            <FiChevronLeft />
          </button>
          <button
            onClick={() => onNavigate("TODAY")}
            className="px-4 py-1.5 text-xs font-black uppercase tracking-wider text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Current Month
          </button>
          <button
            onClick={() => onNavigate("NEXT")}
            className="p-2 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors"
          >
            <FiChevronRight />
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <FiCalendar className="text-blue-600 text-xl" />
          <span className="text-xl font-black text-slate-800 tracking-tight">
            {label}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen p-4 lg:p-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Team Leave <span className="text-blue-600">Calendar</span>
          </h1>
          <p className="text-slate-400 text-xs font-medium">Coordinate availability and public holidays.</p>
        </div>
        

        <div className="rounded-2xl overflow-hidden border border-slate-100">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 650 }}
            eventPropGetter={eventStyleGetter}
            date={currentDate}
            onNavigate={(date: Date) => setCurrentDate(date)}
            defaultView="month"
            views={{ month: true }}
            popup
            components={{
              toolbar: CustomToolbar,
            }}
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
  <Legend color="#3b82f6" label="Approved" />
  <Legend color="#f59e0b" label="Pending" /> {/* Added Pending */}
  <Legend color="#ef4444" label="Sick Leave" />
  <Legend color="#8b5cf6" label="Public Holiday" />
  <div className="ml-auto text-[10px] font-black text-slate-400 uppercase tracking-widest">
    {events.length} Events this month
  </div>
</div>
      </div>
    </div>
  );
}

function Legend({ color, label }: any) {
  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-sm">
      <div style={{ backgroundColor: color }} className="w-2.5 h-2.5 rounded-full shadow-sm"></div>
      <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">{label}</span>
    </div>
  );
}