// import React, { useState, useMemo } from "react";
// import { motion } from "framer-motion";
// import { FileText, Shield, Clock, CheckCircle, AlertTriangle, TrendingUp, CalendarIcon, X } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { mockBills } from "@/data/mockData";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
// import { format, parseISO, isAfter, isBefore, isSameDay } from "date-fns";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { cn } from "@/lib/utils";

// const fraudConfig = {
//   low: { label: "Low Risk", className: "bg-success/10 text-success border-success/20" },
//   medium: { label: "Medium Risk", className: "bg-warning/10 text-warning border-warning/20 fraud-glow-medium" },
//   high: { label: "High Risk", className: "bg-destructive/10 text-destructive border-destructive/20 fraud-glow-high" },
// };

// const statusConfig = {
//   pending: { label: "Pending", className: "bg-warning/10 text-warning border-warning/20" },
//   approved: { label: "Approved", className: "bg-success/10 text-success border-success/20" },
//   rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
// };

// export default function FinanceDashboard() {
//   const [fromDate, setFromDate] = useState<Date | undefined>();
//   const [toDate, setToDate] = useState<Date | undefined>();
//   const [roleFilter, setRoleFilter] = useState<string>("all");

//   const filteredBills = useMemo(() => {
//     let bills = [...mockBills];
//     if (roleFilter !== "all") {
//       bills = bills.filter((b) => b.role === roleFilter);
//     }
//     if (fromDate || toDate) {
//       bills = bills.filter((b) => {
//         const d = parseISO(b.date);
//         if (fromDate && toDate) {
//           return (isAfter(d, fromDate) || isSameDay(d, fromDate)) && (isBefore(d, toDate) || isSameDay(d, toDate));
//         }
//         if (fromDate) return isAfter(d, fromDate) || isSameDay(d, fromDate);
//         if (toDate) return isBefore(d, toDate) || isSameDay(d, toDate);
//         return true;
//       });
//     }
//     return bills.sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
//   }, [fromDate, toDate, roleFilter]);

//   const clearFilters = () => { setFromDate(undefined); setToDate(undefined); };

//   const totalBills = filteredBills.length;
//   const fraudDetected = filteredBills.filter((b) => b.fraudScore === "high").length;
//   const pending = filteredBills.filter((b) => b.status === "pending").length;
//   const approved = filteredBills.filter((b) => b.status === "approved").length;
//   const totalAmount = filteredBills.reduce((s, b) => s + b.amount, 0);

//   const stats = [
//     { label: "Total Bills", value: totalBills, icon: FileText, color: "text-primary" },
//     { label: "Fraud Flagged", value: fraudDetected, icon: Shield, color: "text-destructive" },
//     { label: "Pending Review", value: pending, icon: Clock, color: "text-warning" },
//     { label: "Total Value", value: `₹${(totalAmount / 1000).toFixed(0)}K`, icon: TrendingUp, color: "text-success" },
//   ];

//   const pieData = [
//     { name: "Approved", value: approved, color: "hsl(160, 60%, 40%)" },
//     { name: "Pending", value: pending, color: "hsl(38, 92%, 50%)" },
//     { name: "Rejected", value: filteredBills.filter((b) => b.status === "rejected").length, color: "hsl(0, 72%, 51%)" },
//   ];

//   const vendorMap: Record<string, number> = {};
//   filteredBills.forEach((b) => { vendorMap[b.vendor] = (vendorMap[b.vendor] || 0) + b.amount; });
//   const barData = Object.entries(vendorMap).map(([name, amount]) => ({ name, amount }));

//   return (
//     <div className="space-y-6 animate-fade-in">
//       <div className="flex items-center justify-between flex-wrap gap-4">
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight">Finance Dashboard</h1>
//           <p className="text-muted-foreground text-sm">Monitor bills, detect fraud, and manage approvals</p>
//         </div>
//         <div className="flex items-center gap-2 flex-wrap">
//           <Select value={roleFilter} onValueChange={setRoleFilter}>
//             <SelectTrigger className="w-[130px] h-9 text-xs">
//               <SelectValue placeholder="All" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Bills</SelectItem>
//               <SelectItem value="sales">Sales</SelectItem>
//               <SelectItem value="vendor">Vendor</SelectItem>
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
//               <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus className={cn("p-3 pointer-events-auto")} />
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
//               <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus className={cn("p-3 pointer-events-auto")} />
//             </PopoverContent>
//           </Popover>
//           {(fromDate || toDate) && (
//             <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs gap-1">
//               <X className="h-3.5 w-3.5" /> Clear
//             </Button>
//           )}
//         </div>
//       </div>

//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         {stats.map((s, i) => (
//           <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
//             <Card>
//               <CardContent className="p-4 flex items-center gap-3">
//                 <div className={`h-10 w-10 rounded-lg bg-secondary flex items-center justify-center ${s.color}`}>
//                   <s.icon className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold">{s.value}</p>
//                   <p className="text-xs text-muted-foreground">{s.label}</p>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </div>

//       <div className="grid lg:grid-cols-2 gap-4">
//         <Card>
//           <CardHeader><CardTitle className="text-sm font-semibold">Bills by {roleFilter === "all" ? "Vendor/Sales" : roleFilter === "sales" ? "Sales" : "Vendor"}</CardTitle></CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={220}>
//               <BarChart data={barData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
//                 <XAxis dataKey="name" tick={{ fontSize: 11 }} />
//                 <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v / 1000}K`} />
//                 <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
//                 <Bar dataKey="amount" fill="hsl(220, 70%, 15%)" radius={[4, 4, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader><CardTitle className="text-sm font-semibold">Status Breakdown</CardTitle></CardHeader>
//           <CardContent className="flex items-center justify-center">
//             <ResponsiveContainer width="100%" height={220}>
//               <PieChart>
//                 <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
//                   {pieData.map((entry, i) => (
//                     <Cell key={i} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//             <div className="space-y-2 ml-4">
//               {pieData.map((d) => (
//                 <div key={d.name} className="flex items-center gap-2 text-sm">
//                   <div className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
//                   <span className="text-muted-foreground">{d.name}: {d.value}</span>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between">
//           <CardTitle className="text-sm font-semibold">
//             {roleFilter === "all" ? "All Bills" : roleFilter === "sales" ? "Sales Bills" : "Vendor Bills"} — Overview
//           </CardTitle>
//           <div className="flex items-center gap-1.5">
//             <AlertTriangle className="h-4 w-4 text-destructive" />
//             <span className="text-xs font-medium text-destructive">{fraudDetected} flagged</span>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b text-muted-foreground">
//                   <th className="text-left py-2 font-medium">Tracking ID</th>
//                   <th className="text-left py-2 font-medium">Type</th>
//                   <th className="text-left py-2 font-medium">{roleFilter === "sales" ? "Sales" : roleFilter === "vendor" ? "Vendor" : "Submitter"}</th>
//                   <th className="text-left py-2 font-medium">Uploaded By</th>
//                    <th className="text-right py-2 pr-6 font-medium">Amount</th>
//                    <th className="text-left py-2 pl-6 font-medium">Date</th>
//                    <th className="text-left py-2 font-medium">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredBills.map((bill) => (
//                   <tr key={bill.id} className={`border-b last:border-0 hover:bg-muted/50 ${bill.fraudScore === "high" ? "bg-destructive/[0.03]" : ""}`}>
//                     <td className="py-3 font-medium">{bill.billNumber}</td>
//                     <td className="py-3">
//                       <Badge variant="outline" className="capitalize">{bill.role}</Badge>
//                     </td>
//                     <td className="py-3">{bill.vendor}</td>
//                     <td className="py-3 text-muted-foreground">{bill.uploadedBy}</td>
//                      <td className="py-3 text-right pr-6 font-mono">₹{bill.amount.toLocaleString()}</td>
//                      <td className="py-3 pl-6 text-muted-foreground">{format(parseISO(bill.date), "dd MMM yyyy")}</td>
//                      <td className="py-3">
//                        <Badge variant="outline" className={statusConfig[bill.status].className}>
//                          {statusConfig[bill.status].label}
//                        </Badge>
//                      </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }




import React, { useState, useMemo, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FileText, Shield, Clock, CheckCircle, AlertTriangle, TrendingUp, CalendarIcon, X, Loader2, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockBills } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { format, parseISO, isAfter, isBefore, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const BASE_URL = "https://d2ontk4ewdype3.cloudfront.net";

const statusConfig = {
  pending: { label: "Pending", className: "bg-warning/10 text-warning border-warning/20" },
  approved: { label: "Approved", className: "bg-success/10 text-success border-success/20" },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

interface DashboardData {
  user_id: string;
  usertype: string;
  filter_applied: string;
  date_range: { start_date: string; end_date: string };
  total_bills: number;
  pending: number;
  approved: number;
  rejected: number;
  monthly_claims: Record<string, number>;
  monthly_amounts: Record<string, number>;
  fraud_flagged: number;
  total_value: number;
  bills_by_title: Record<string, number>;
  status_breakdown: { approved: number; pending: number; rejected: number };
}

export default function FinanceDashboard() {
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ── kept exactly as original for the "All Bills — Overview" table ──
  const filteredBills = useMemo(() => {
    let bills = [...mockBills];
    if (roleFilter !== "all") {
      bills = bills.filter((b) => b.role === roleFilter);
    }
    if (fromDate || toDate) {
      bills = bills.filter((b) => {
        const d = parseISO(b.date);
        if (fromDate && toDate) {
          return (isAfter(d, fromDate) || isSameDay(d, fromDate)) && (isBefore(d, toDate) || isSameDay(d, toDate));
        }
        if (fromDate) return isAfter(d, fromDate) || isSameDay(d, fromDate);
        if (toDate) return isBefore(d, toDate) || isSameDay(d, toDate);
        return true;
      });
    }
    return bills.sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
  }, [fromDate, toDate, roleFilter]);

  const clearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
  };

  // ── API fetch ──
  const fetchDashboard = useCallback(async () => {
    // user is stored as JSON string under the key "user"
    let userId: string | null = null;
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const parsed = JSON.parse(raw);
        userId = parsed?.user_id ?? null;
      }
    } catch {
      userId = null;
    }

    if (!userId) {
      setError("User ID not found. Please log in again.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ user_id: userId, filter_by: roleFilter });
      if (fromDate) params.append("start_date", format(fromDate, "yyyy-MM-dd"));
      if (toDate) params.append("end_date", format(toDate, "yyyy-MM-dd"));

      const url = `${BASE_URL}/get-dashboard?${params.toString()}`;

      const res = await fetch(url, { headers: { accept: "application/json" } });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data: DashboardData = await res.json();
      setDashboardData(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  }, [roleFilter, fromDate, toDate]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // ── Derived values from API (fall back to 0 while loading) ──
  const totalBills = dashboardData?.total_bills ?? 0;
  const fraudDetected = dashboardData?.fraud_flagged ?? 0;
  const pending = dashboardData?.pending ?? 0;
  const approved = dashboardData?.approved ?? 0;
  const rejected = dashboardData?.rejected ?? 0;
  const totalValue = dashboardData?.total_value ?? 0;

  const stats = [
    { label: "Total Bills", value: loading ? "—" : totalBills, icon: FileText, color: "text-primary" },
    { label: "Fraud Flagged", value: loading ? "—" : fraudDetected, icon: Shield, color: "text-destructive" },
    { label: "Pending Review", value: loading ? "—" : pending, icon: Clock, color: "text-warning" },
    {
      label: "Total Value",
      value: loading ? "—" : `₹${(totalValue / 1000).toFixed(0)}K`,
      icon: TrendingUp,
      color: "text-success",
    },
  ];

  // ── Bar chart: bills_by_title from API ──
  const barData = useMemo(() => {
    if (!dashboardData?.bills_by_title) return [];
    return Object.entries(dashboardData.bills_by_title).map(([name, amount]) => ({ name, amount }));
  }, [dashboardData]);


  // ── Add these below existing barData useMemo ──
  const monthlyClaimsData = useMemo(() => {
    if (!dashboardData?.monthly_claims) return [];
    return Object.entries(dashboardData.monthly_claims).map(([month, count]) => ({
      month,
      count,
    }));
  }, [dashboardData]);

  const monthlyAmountData = useMemo(() => {
    if (!dashboardData?.monthly_amounts) return [];
    return Object.entries(dashboardData.monthly_amounts).map(([month, amount]) => ({
      month,
      amount,
    }));
  }, [dashboardData]);

  // ── Pie chart from API status_breakdown ──
  const pieData = [
    { name: "Approved", value: approved, color: "hsl(160, 60%, 40%)" },
    { name: "Pending", value: pending, color: "hsl(38, 92%, 50%)" },
    { name: "Rejected", value: rejected, color: "hsl(0, 72%, 51%)" },
  ];

  // ── Bar chart label based on filter ──
  const barChartTitle =
    roleFilter === "all"
      ? "Bills by Vendor/Sales"
      : roleFilter === "sales"
        ? "Bills by Sales"
        : "Bills by Vendor";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header + Filters ── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Finance Dashboard</h1>
            <p className="text-muted-foreground text-sm">Monitor bills, detect fraud, and manage approvals</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[130px] h-9 text-xs">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bills</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="vendor">Vendor</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn("text-xs gap-1.5", !fromDate && "text-muted-foreground")}
              >
                <CalendarIcon className="h-3.5 w-3.5" />
                {fromDate ? format(fromDate, "dd MMM yyyy") : "Start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={fromDate}
                onSelect={setFromDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>

          <span className="text-xs text-muted-foreground">to</span>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn("text-xs gap-1.5", !toDate && "text-muted-foreground")}
              >
                <CalendarIcon className="h-3.5 w-3.5" />
                {toDate ? format(toDate, "dd MMM yyyy") : "End date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={toDate}
                onSelect={setToDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>

          {(fromDate || toDate) && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs gap-1">
              <X className="h-3.5 w-3.5" /> Clear
            </Button>
          )}
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
          <Button variant="ghost" size="sm" className="ml-auto text-xs" onClick={fetchDashboard}>
            Retry
          </Button>
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg bg-secondary flex items-center justify-center ${s.color}`}>
                  {loading ? <Loader2 className="h-5 w-5 animate-spin opacity-50" /> : <s.icon className="h-5 w-5" />}
                </div>
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ── Charts ── */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">{barChartTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading…
              </div>
            ) : barData.length === 0 ? (
              <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
                No data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v / 1000}K`} />
                  <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
                  <Bar dataKey="amount" fill="hsl(220, 70%, 15%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {loading ? (
              <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading…
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 ml-4">
                  {pieData.map((d) => (
                    <div key={d.name} className="flex items-center gap-2 text-sm">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-muted-foreground">
                        {d.name}: {d.value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* ── Monthly Charts ── */}
        {/* <div className="grid grid-cols-2 gap-2"> */}

        {/* Total Claims per Month */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Total Claims per Month</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading…
              </div>
            ) : monthlyClaimsData.length === 0 ? (
              <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
                No data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyClaimsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(220, 70%, 15%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Total Claim Amount per Month */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Total Claim Amount per Month</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading…
              </div>
            ) : monthlyAmountData.length === 0 ? (
              <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
                No data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyAmountData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `₹${v / 1000}K`}
                  />
                  <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
                  <Bar dataKey="amount" fill="hsl(220, 70%, 15%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* </div> */}
      </div>

    </div>
  );
}