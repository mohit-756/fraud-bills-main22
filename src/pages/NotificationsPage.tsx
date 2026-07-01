// import React, { useState, useMemo } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { mockNotifications } from "@/data/mockData";
// import { Bell, CheckCircle, AlertTriangle, Info, CalendarIcon, X } from "lucide-react";
// import { format, isAfter, isBefore, parseISO, isSameDay, startOfDay, startOfMonth, startOfYear, endOfDay, endOfMonth, endOfYear } from "date-fns";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { cn } from "@/lib/utils";

// const iconMap = {
//   success: CheckCircle,
//   warning: AlertTriangle,
//   info: Info,
// };

// const styleMap = {
//   success: "text-success",
//   warning: "text-warning",
//   info: "text-primary",
// };

// type QuickFilter = "day" | "monthly" | "yearly" | "";

// export default function NotificationsPage() {
//   const [fromDate, setFromDate] = useState<Date | undefined>();
//   const [toDate, setToDate] = useState<Date | undefined>();
//   const [quickFilter, setQuickFilter] = useState<QuickFilter>("");

//   const filtered = useMemo(() => {
//     const now = new Date();
//     let effectiveFrom = fromDate;
//     let effectiveTo = toDate;

//     if (quickFilter === "day") {
//       effectiveFrom = startOfDay(now);
//       effectiveTo = endOfDay(now);
//     } else if (quickFilter === "monthly") {
//       effectiveFrom = startOfMonth(now);
//       effectiveTo = endOfMonth(now);
//     } else if (quickFilter === "yearly") {
//       effectiveFrom = startOfYear(now);
//       effectiveTo = endOfYear(now);
//     }

//     if (!effectiveFrom && !effectiveTo) return mockNotifications;
//     return mockNotifications.filter((n) => {
//       const d = parseISO(n.date);
//       if (effectiveFrom && effectiveTo) {
//         return (isAfter(d, effectiveFrom) || isSameDay(d, effectiveFrom)) && (isBefore(d, effectiveTo) || isSameDay(d, effectiveTo));
//       }
//       if (effectiveFrom) return isAfter(d, effectiveFrom) || isSameDay(d, effectiveFrom);
//       if (effectiveTo) return isBefore(d, effectiveTo) || isSameDay(d, effectiveTo);
//       return true;
//     });
//   }, [fromDate, toDate, quickFilter]);

//   const clearFilters = () => { setFromDate(undefined); setToDate(undefined); setQuickFilter(""); };

//   const handleQuickFilter = (value: string) => {
//     const val = value as QuickFilter;
//     setQuickFilter(val);
//     if (val) {
//       setFromDate(undefined);
//       setToDate(undefined);
//     }
//   };

//   const handleFromDate = (d: Date | undefined) => {
//     setFromDate(d);
//     setQuickFilter("");
//   };

//   const handleToDate = (d: Date | undefined) => {
//     setToDate(d);
//     setQuickFilter("");
//   };

//   return (
//     <div className="space-y-6 animate-fade-in">
//       <div className="flex items-center justify-between flex-wrap gap-4">
//         <div className="flex items-center gap-3">
//           <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
//             <Bell className="h-5 w-5 text-primary" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
//             <p className="text-muted-foreground text-sm">Stay updated on bill approvals and activity</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-2 flex-wrap">
//           <Select value={quickFilter} onValueChange={handleQuickFilter}>
//             <SelectTrigger className="h-8 w-[120px] text-xs">
//               <SelectValue placeholder="Filter by" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="day">Day</SelectItem>
//               <SelectItem value="monthly">Monthly</SelectItem>
//               <SelectItem value="yearly">Yearly</SelectItem>
//             </SelectContent>
//           </Select>
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button variant="outline" size="sm" className={cn("text-xs gap-1.5", !fromDate && "text-muted-foreground")}>
//                 <CalendarIcon className="h-3.5 w-3.5" />
//                 {fromDate ? format(fromDate, "dd MMM yyyy") : "Start date"}
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-auto p-0" align="start">
//               <Calendar mode="single" selected={fromDate} onSelect={handleFromDate} initialFocus className={cn("p-3 pointer-events-auto")} />
//             </PopoverContent>
//           </Popover>
//           <span className="text-xs text-muted-foreground">to</span>
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button variant="outline" size="sm" className={cn("text-xs gap-1.5", !toDate && "text-muted-foreground")}>
//                 <CalendarIcon className="h-3.5 w-3.5" />
//                 {toDate ? format(toDate, "dd MMM yyyy") : "End date"}
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-auto p-0" align="start">
//               <Calendar mode="single" selected={toDate} onSelect={handleToDate} initialFocus className={cn("p-3 pointer-events-auto")} />
//             </PopoverContent>
//           </Popover>
//           {(fromDate || toDate || quickFilter) && (
//             <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs gap-1">
//               <X className="h-3.5 w-3.5" /> Clear
//             </Button>
//           )}
//         </div>
//       </div>

//       <Card>
//         <CardContent className="pt-6 space-y-3">
//           {filtered.length === 0 ? (
//             <p className="text-sm text-muted-foreground text-center py-6">No notifications for this period</p>
//           ) : (
//             filtered.map((n) => {
//               const Icon = iconMap[n.type];
//               return (
//                 <div key={n.id} className={`flex items-start gap-3 p-3 rounded-lg ${n.read ? "" : "bg-muted/50"}`}>
//                   <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${styleMap[n.type]}`} />
//                   <div className="flex-1">
//                     <p className="text-sm">{n.message}</p>
//                     <p className="text-xs text-muted-foreground mt-0.5">{n.date} · {n.time}</p>
//                   </div>
//                   {!n.read && <Badge className="bg-primary/10 text-primary text-[10px]">New</Badge>}
//                 </div>
//               );
//             })
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }



import React, { useState, useMemo, useEffect } from "react";
import { API_BASE_URL } from "@/config";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  CalendarIcon,
  X,
} from "lucide-react";

import {
  format,
  isAfter,
  isBefore,
  isSameDay,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";

type QuickFilter = "day" | "monthly" | "yearly" | "";

// ✅ Icon map
const iconMap: any = {
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
};

// ✅ Style map
const styleMap: any = {
  success: "text-green-500",
  warning: "text-yellow-500",
  info: "text-blue-500",
};

export default function NotificationsPage() {
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("");

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Get user_id
  const getUserId = () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;
    const user = JSON.parse(storedUser);
    return user.user_id;
  };

  // 🚀 API CALL
  const fetchNotifications = async () => {
    try {
      const userId = getUserId();
      if (!userId) return;

      const res = await fetch(
        `${API_BASE_URL}/get-notifications?user_id=${userId}`
      );

      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // 🔥 FILTER LOGIC (NEW + FIXED)
  const filtered = useMemo(() => {
    const now = new Date();

    let effectiveFrom = fromDate;
    let effectiveTo = toDate;

    // ✅ QUICK FILTERS
    if (quickFilter === "day") {
      effectiveFrom = startOfDay(now);
      effectiveTo = endOfDay(now);
    } else if (quickFilter === "monthly") {
      effectiveFrom = startOfMonth(now);
      effectiveTo = endOfMonth(now);
    } else if (quickFilter === "yearly") {
      effectiveFrom = startOfYear(now);
      effectiveTo = endOfYear(now);
    }

    if (!effectiveFrom && !effectiveTo) return notifications;

    return notifications.filter((n) => {
      if (!n.created_at) return true;

      const d = new Date(n.created_at);

      if (effectiveFrom && effectiveTo) {
        return (
          (isAfter(d, effectiveFrom) || isSameDay(d, effectiveFrom)) &&
          (isBefore(d, effectiveTo) || isSameDay(d, effectiveTo))
        );
      }

      if (effectiveFrom)
        return isAfter(d, effectiveFrom) || isSameDay(d, effectiveFrom);

      if (effectiveTo)
        return isBefore(d, effectiveTo) || isSameDay(d, effectiveTo);

      return true;
    });
  }, [notifications, fromDate, toDate, quickFilter]);

  const clearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setQuickFilter("");
  };

  const handleQuickFilter = (value: string) => {
    const val = value as QuickFilter;
    setQuickFilter(val);
    if (val) {
      setFromDate(undefined);
      setToDate(undefined);
    }
  };

  const handleFromDate = (d: Date | undefined) => {
    setFromDate(d);
    setQuickFilter("");
  };

  const handleToDate = (d: Date | undefined) => {
    setToDate(d);
    setQuickFilter("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Notifications
            </h1>
            <p className="text-muted-foreground text-sm">
              Stay updated on bill approvals and activity
            </p>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Quick Filter */}
          <Select value={quickFilter} onValueChange={handleQuickFilter}>
            <SelectTrigger className="h-11 md:h-8 w-[120px] text-xs shrink-0 rounded-xl md:rounded-lg">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>

          {/* From Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "text-xs gap-1.5 h-11 md:h-8 shrink-0 rounded-xl md:rounded-lg px-4",
                  !fromDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="h-3.5 w-3.5" />
                {fromDate
                  ? format(fromDate, "dd MMM")
                  : "Start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={fromDate}
                onSelect={handleFromDate}
              />
            </PopoverContent>
          </Popover>

          <span className="text-xs text-muted-foreground shrink-0">to</span>

          {/* To Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "text-xs gap-1.5 h-11 md:h-8 shrink-0 rounded-xl md:rounded-lg px-4",
                  !toDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="h-3.5 w-3.5" />
                {toDate
                  ? format(toDate, "dd MMM")
                  : "End date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={toDate}
                onSelect={handleToDate}
              />
            </PopoverContent>
          </Popover>

          {(fromDate || toDate || quickFilter) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs gap-1 h-11 md:h-8 shrink-0 rounded-xl"
            >
              <X className="h-3.5 w-3.5" /> Clear
            </Button>
          )}
        </div>
      </div>

      {/* LIST */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          {loading ? (
            <p className="text-center text-sm">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No notifications for this period
            </p>
          ) : (
            filtered.map((n) => {
              const type = (n.type || "info").toLowerCase();
              const Icon = iconMap[type] || Info;
              const style = styleMap[type] || "text-blue-500";

              return (
                <div
                  key={n.notification_id}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    n.is_read ? "" : "bg-muted/50"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 mt-0.5 shrink-0 ${style}`}
                  />

                  <div className="flex-1">
                    <p className="text-sm">{n.message}</p>

                    <p className="text-xs text-muted-foreground mt-0.5">
                      {n.created_at
                        ? format(
                            new Date(n.created_at),
                            "dd MMM yyyy · hh:mm a"
                          )
                        : "No date"}
                    </p>
                  </div>

                  {!n.is_read && (
                    <Badge className="bg-primary/10 text-primary text-[10px]">
                      New
                    </Badge>
                  )}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}