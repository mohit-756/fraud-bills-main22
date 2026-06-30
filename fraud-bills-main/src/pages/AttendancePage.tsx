// import React, { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Calendar } from "@/components/ui/calendar";
// import { CalendarDays, CheckCircle } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { useAttendance } from "@/contexts/AttendanceContext";
// import { format } from "date-fns";

// const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// const statusStyle = {
//   "on-duty": "bg-success/10 text-success",
//   "leave": "bg-destructive/10 text-destructive",
//   "half-day": "bg-warning/10 text-warning",
// };

// export default function AttendancePage() {
//   const { toast } = useToast();
//   const { records, markAttendance, getStatus } = useAttendance();
//   const [selectedDate, setSelectedDate] = useState<Date>(new Date());

//   const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
//   const currentStatus = getStatus(selectedDateStr);

//   const handleMark = (status: "on-duty" | "leave" | "half-day") => {
//     markAttendance(selectedDateStr, status);
//     const label = status === "on-duty" ? "On Duty" : status === "leave" ? "Leave" : "Half Day";
//     toast({ title: "Attendance marked", description: `Marked as ${label} for ${selectedDateStr}` });
//   };

//   // Color-code calendar days based on status
//   const onDutyDates = records.filter(r => r.status === "on-duty").map(r => new Date(r.date + "T00:00:00"));
//   const leaveDates = records.filter(r => r.status === "leave").map(r => new Date(r.date + "T00:00:00"));
//   const halfDayDates = records.filter(r => r.status === "half-day").map(r => new Date(r.date + "T00:00:00"));

//   return (
//     <div className="space-y-6 animate-fade-in">
//       <div className="flex items-center gap-3">
//         <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
//           <CalendarDays className="h-5 w-5 text-success" />
//         </div>
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
//           <p className="text-muted-foreground text-sm">Mark and track your daily attendance</p>
//         </div>
//       </div>

//       <div className="grid lg:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader><CardTitle className="text-sm font-semibold">Select Date</CardTitle></CardHeader>
//           <CardContent className="flex justify-center">
//             <Calendar
//               mode="single"
//               selected={selectedDate}
//               onSelect={(date) => date && setSelectedDate(date)}
//               className="pointer-events-auto"
//               modifiers={{
//                 onDuty: onDutyDates,
//                 leave: leaveDates,
//                 halfDay: halfDayDates,
//               }}
//               modifiersStyles={{
//                 onDuty: { backgroundColor: "hsl(var(--success) / 0.2)", color: "hsl(var(--success))", borderRadius: "6px" },
//                 leave: { backgroundColor: "hsl(var(--destructive) / 0.2)", color: "hsl(var(--destructive))", borderRadius: "6px" },
//                 halfDay: { backgroundColor: "hsl(var(--warning) / 0.2)", color: "hsl(var(--warning))", borderRadius: "6px" },
//               }}
//               disabled={(date) => date > new Date()}
//             />
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="text-sm font-semibold">
//               Mark Attendance — {format(selectedDate, "MMM dd, yyyy")}
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {currentStatus && (
//               <div className="flex items-center gap-2 text-success">
//                 <CheckCircle className="h-5 w-5" />
//                 <span className="font-medium">
//                   Currently: {currentStatus === "on-duty" ? "On Duty" : currentStatus === "leave" ? "Leave" : "Half Day"}
//                 </span>
//               </div>
//             )}
//             <div className="flex gap-3">
//               <Button onClick={() => handleMark("on-duty")} className="bg-success hover:bg-success/90 text-success-foreground">On Duty</Button>
//               <Button variant="outline" onClick={() => handleMark("half-day")}>Half Day</Button>
//               <Button variant="destructive" onClick={() => handleMark("leave")}>Leave</Button>
//             </div>
//             <div className="flex gap-4 text-xs text-muted-foreground pt-2">
//               <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-success/20" /> On Duty</span>
//               <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-warning/20" /> Half Day</span>
//               <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-destructive/20" /> Leave</span>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <Card>
//         <CardHeader><CardTitle className="text-sm font-semibold">Attendance History</CardTitle></CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b text-muted-foreground">
//                   <th className="text-left py-2 font-medium">Date</th>
//                   <th className="text-left py-2 font-medium">Day</th>
//                   <th className="text-left py-2 font-medium">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {[...records].reverse().map((a) => {
//                   const d = new Date(a.date + "T00:00:00");
//                   return (
//                     <tr key={a.date} className="border-b last:border-0">
//                       <td className="py-2.5">{a.date}</td>
//                       <td className="py-2.5 text-muted-foreground">{dayNames[d.getDay()]}</td>
//                       <td className="py-2.5">
//                         <Badge variant="outline" className={statusStyle[a.status]}>
//                           {a.status === "on-duty" ? "On Duty" : a.status === "leave" ? "Leave" : "Half Day"}
//                         </Badge>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }



 
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
 
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
 
const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
 
export default function AttendancePage() {
  const [records, setRecords] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
 
  const BASE_URL = "https://d2ontk4ewdype3.cloudfront.net";
 
  // ✅ GET USER ID FROM LOCAL STORAGE
  const getUserId = () => {
    const userData = localStorage.getItem("user");
    if (!userData) return null;
    return JSON.parse(userData).user_id;
  };
 
  // =========================
  // 🔥 FETCH ATTENDANCE API
  // =========================
  const fetchAttendance = async () => {
    try {
      const user_id = getUserId();
      const month = currentMonth.getMonth() + 1; // JS month starts from 0
      const year = currentMonth.getFullYear();
 
      const res = await fetch(
        `${BASE_URL}/get-attendance?user_id=${user_id}&month=${month}&year=${year}`
      );
 
      const data = await res.json();
      console.log("Attendance Data:", data);
 
      // setRecords(data); // adjust if response has wrapper like data.records
      setRecords(data.attendance);
    } catch (err) {
      console.error("Attendance API Error:", err);
    }
  };
 
  // 🔁 CALL API ON MONTH CHANGE
  useEffect(() => {
    fetchAttendance();
  }, [currentMonth]);
 
  // =========================
  // STATUS
  // =========================
  const getStatusForDate = (date: Date) => {
    const formatted = format(date, "yyyy-MM-dd");
    const record = records.find((r) => r.date === formatted);
 
    if (!record) return "R";
    // if (record.status === "on-duty") return "P";
    // if (record.status === "leave") return "A";
    // if (record.status === "half-day") return "H";
    if (record.status === "present") return "P";
if (record.status === "absent") return "A";
 
    return "R";
  };
 
  // =========================
  // COLOR
  // =========================
  const getColor = (status: string) => {
    switch (status) {
      case "P": return "bg-green-100";
      case "A": return "bg-orange-200";
      case "H": return "bg-blue-100";
      default: return "bg-gray-100";
    }
  };
 
  // =========================
  // CALENDAR
  // =========================
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
 
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
 
    const days: (Date | null)[] = [];
 
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
 
    return days;
  };
 
  const days = generateCalendarDays();
 
  // =========================
  // MONTH / YEAR CHANGE
  // =========================
  const handleMonthChange = (monthIndex: number) => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), monthIndex, 1)
    );
  };
 
  const handleYearChange = (year: number) => {
    setCurrentMonth(
      new Date(year, currentMonth.getMonth(), 1)
    );
  };
 
  return (
    <div className="space-y-4">
 
      {/* HEADER */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
 
        <div className="flex gap-2 items-center">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setCurrentMonth(
                new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
              )
            }
          >
            Prev
          </Button>
 
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setCurrentMonth(
                new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
              )
            }
          >
            Next
          </Button>
        </div>
 
        {/* FILTERS */}
        <div className="flex gap-2">
          <select
            value={currentMonth.getMonth()}
            onChange={(e) => handleMonthChange(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            {months.map((m, i) => (
              <option key={i} value={i}>{m}</option>
            ))}
          </select>
 
          <select
            value={currentMonth.getFullYear()}
            onChange={(e) => handleYearChange(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            {Array.from({ length: 10 }).map((_, i) => {
              const year = 2020 + i;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
        </div>
 
        <h2 className="text-sm font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
      </div>
 
      {/* CALENDAR */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm">Attendance Calendar</CardTitle>
        </CardHeader>
 
        <CardContent>
          <div className="grid grid-cols-7 text-center text-sm font-semibold mb-1">
            {dayNames.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>
 
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              if (!date) return <div key={index} className="h-16" />;
 
              const status = getStatusForDate(date);
 
              return (
                <div
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  className={`h-16 p-1 border rounded cursor-pointer flex flex-col justify-between ${getColor(status)} ${
                    format(date, "yyyy-MM-dd") ===
                    format(selectedDate, "yyyy-MM-dd")
                      ? "border-blue-500 border-2"
                      : ""
                  }`}
                >
                  <span className="text-xs font-medium">
                    {date.getDate()}
                  </span>
 
                  <div className="text-center text-sm font-bold">
                    {status}
                  </div>
 
                  <span className="text-[10px] text-gray-500 text-center">
                    GEN2
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
 
      {/* SELECTED DATE */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm">
            {format(selectedDate, "MMM dd, yyyy")}
          </CardTitle>
        </CardHeader>
 
        <CardContent>
          <div className="text-sm">
            Status:{" "}
            <span className="font-semibold">
              {getStatusForDate(selectedDate)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
 