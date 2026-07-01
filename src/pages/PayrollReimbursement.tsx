// import React, { useState, useMemo } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Search, Users, Clock, CheckCircle2, CalendarDays, CalendarIcon } from "lucide-react";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";
// import { cn } from "@/lib/utils";
// import { mockPayrollEntries, type PayrollEntry } from "@/data/mockData";
// import { format, parseISO } from "date-fns";
// import { useToast } from "@/hooks/use-toast";

// const statusConfig: Record<PayrollEntry["status"], { label: string; className: string }> = {
//   scheduled: { label: "Scheduled", className: "bg-warning/10 text-warning border-warning/20" },
//   processed: { label: "Processed", className: "bg-success/10 text-success border-success/20" },
//   "on-hold": { label: "On Hold", className: "bg-destructive/10 text-destructive border-destructive/20" },
// };

// const cycles = ["2026-06-15", "2026-06-30", "2026-07-15"];

// export default function PayrollReimbursementsPage() {
//   const { toast } = useToast();
//   const defaultCycle = parseISO(mockPayrollEntries[0]?.payrollCycle || format(new Date(), "yyyy-MM-dd"));
//   const defaultIso = format(defaultCycle, "yyyy-MM-dd");
//   const [entries, setEntries] = useState<PayrollEntry[]>(() =>
//     mockPayrollEntries.map((e) => ({ ...e, payrollCycle: defaultIso }))
//   );
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [cycleFilter, setCycleFilter] = useState("all");
//   const [globalCycle, setGlobalCycle] = useState<Date | undefined>(defaultCycle);

//   const applyGlobalCycle = (date: Date | undefined) => {
//     if (!date) return;
//     setGlobalCycle(date);
//     const iso = format(date, "yyyy-MM-dd");
//     setEntries((prev) => prev.map((e) => ({ ...e, payrollCycle: iso })));
//     toast({ title: "Global payroll cycle set", description: `All employees assigned to ${format(date, "dd MMM yyyy")}.` });
//   };

//   const filtered = useMemo(() => {
//     return entries.filter((e) => {
//       const matchesSearch =
//         e.employee.toLowerCase().includes(search.toLowerCase()) ||
//         e.category.toLowerCase().includes(search.toLowerCase());
//       const matchesStatus = statusFilter === "all" || e.status === statusFilter;
//       const matchesCycle = cycleFilter === "all" || e.payrollCycle === cycleFilter;
//       return matchesSearch && matchesStatus && matchesCycle;
//     });
//   }, [entries, search, statusFilter, cycleFilter]);

//   const totals = useMemo(() => {
//     const pending = entries.filter((e) => e.status === "scheduled").reduce((s, e) => s + e.amount, 0);
//     const processed = entries.filter((e) => e.status === "processed").reduce((s, e) => s + e.amount, 0);
//     const onHold = entries.filter((e) => e.status === "on-hold").length;
//     return { pending, processed, onHold, count: entries.length };
//   }, [entries]);

//   const processEntry = (id: string) => {
//     setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status: "processed" } : e)));
//     toast({ title: "Reimbursement processed", description: "Employee will receive payment in next payroll run." });
//   };

//   const assignCycle = (id: string, cycle: string) => {
//     setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, payrollCycle: cycle } : e)));
//     toast({ title: "Cycle updated", description: `Reimbursement assigned to ${cycle}.` });
//   };

//   return (
//     <div className="space-y-6 animate-fade-in">
//       <div>
//         <h1 className="text-2xl font-bold tracking-tight">Payroll Reimbursements</h1>
//         <p className="text-muted-foreground text-sm">Employee out-of-pocket expenses auto-routed here on approval — assign payroll cycle and process.</p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
//         <Card><CardContent className="pt-5 pb-4">
//           <div className="flex items-center gap-2 text-xs text-muted-foreground"><Users className="h-3.5 w-3.5" /> Total Requests</div>
//           <p className="text-2xl font-bold mt-1">{totals.count}</p>
//         </CardContent></Card>
//         <Card><CardContent className="pt-5 pb-4">
//           <div className="flex items-center gap-2 text-xs text-warning"><Clock className="h-3.5 w-3.5" /> Pending Payout</div>
//           <p className="text-2xl font-bold mt-1 text-warning">₹{totals.pending.toLocaleString()}</p>
//         </CardContent></Card>
//         <Card><CardContent className="pt-5 pb-4">
//           <div className="flex items-center gap-2 text-xs text-success"><CheckCircle2 className="h-3.5 w-3.5" /> Processed</div>
//           <p className="text-2xl font-bold mt-1 text-success">₹{totals.processed.toLocaleString()}</p>
//         </CardContent></Card>
//         <Card><CardContent className="pt-5 pb-4">
//           <div className="flex items-center gap-2 text-xs text-destructive">On Hold</div>
//           <p className="text-2xl font-bold mt-1 text-destructive">{totals.onHold}</p>
//         </CardContent></Card>
//       </div>

//       <div className="flex flex-wrap gap-3 items-center">
//         <div className="relative flex-1 min-w-[200px] max-w-sm">
//           <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
//           <Input placeholder="Search by employee or category..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
//         </div>
//         <Select value={cycleFilter} onValueChange={setCycleFilter}>
//           <SelectTrigger className="w-[180px]"><CalendarDays className="h-3.5 w-3.5 mr-1" /><SelectValue /></SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Cycles</SelectItem>
//             {cycles.map((c) => <SelectItem key={c} value={c}>{format(parseISO(c), "dd MMM yyyy")}</SelectItem>)}
//           </SelectContent>
//         </Select>
//         <Select value={statusFilter} onValueChange={setStatusFilter}>
//           <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Status</SelectItem>
//             <SelectItem value="scheduled">Scheduled</SelectItem>
//             <SelectItem value="processed">Processed</SelectItem>
//             <SelectItem value="on-hold">On Hold</SelectItem>
//           </SelectContent>
//         </Select>
//         <Popover>
//           <PopoverTrigger asChild>
//             <Button
//               variant="outline"
//               className={cn("justify-start text-left font-normal gap-2", !globalCycle && "text-muted-foreground")}
//             >
//               <CalendarIcon className="h-4 w-4" />
//               {globalCycle ? `Cycle: ${format(globalCycle, "dd MMM yyyy")}` : "Set Global Payroll Date"}
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-auto p-0" align="start">
//             <Calendar
//               mode="single"
//               selected={globalCycle}
//               onSelect={applyGlobalCycle}
//               defaultMonth={globalCycle}
//               captionLayout="dropdown-buttons"
//               fromYear={2020}
//               toYear={2035}
//               initialFocus
//               className={cn("p-3 pointer-events-auto")}
//             />
//           </PopoverContent>
//         </Popover>
//       </div>

//       <Card>
//         <CardContent className="pt-6">
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b text-muted-foreground">
//                   <th className="text-left py-2 font-medium">Employee</th>
//                   <th className="text-left py-2 font-medium">Category</th>
//                   <th className="text-right py-2 pr-6 font-medium">Amount</th>
//                   <th className="text-left py-2 pl-6 font-medium">Submitted</th>
//                   <th className="text-left py-2 font-medium">Payroll Cycle</th>
//                   <th className="text-left py-2 font-medium">Status</th>
//                   <th className="text-left py-2 font-medium">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((e) => (
//                   <tr key={e.id} className="border-b hover:bg-muted/50">
//                     <td className="py-3 font-medium">{e.employee}</td>
//                     <td className="py-3 text-muted-foreground">{e.category}</td>
//                     <td className="py-3 text-right pr-6 font-mono">₹{e.amount.toLocaleString()}</td>
//                     <td className="py-3 pl-6 text-muted-foreground">{format(parseISO(e.submittedDate), "dd MMM yyyy")}</td>
//                     <td className="py-3 text-muted-foreground text-xs">
//                       {format(parseISO(e.payrollCycle), "dd MMM yyyy")}
//                     </td>
//                     <td className="py-3"><Badge variant="outline" className={statusConfig[e.status].className}>{statusConfig[e.status].label}</Badge></td>
//                     <td className="py-3">
//                       {e.status === "scheduled" && (
//                         <Button size="sm" className="text-xs bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => processEntry(e.id)}>Process Payment</Button>
//                       )}
//                       {e.status !== "scheduled" && <span className="text-xs text-muted-foreground">—</span>}
//                     </td>
//                   </tr>
//                 ))}
//                 {filtered.length === 0 && (
//                   <tr><td colSpan={7} className="py-8 text-center text-muted-foreground text-sm">No reimbursements match your filters.</td></tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }




import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users, Clock, CheckCircle2, CalendarIcon, Loader2, Eye } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, parseISO, setDate } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { API_BASE_URL } from "@/config";

const BASE_URL = API_BASE_URL;

const statusConfig = {
  scheduled: { label: "Scheduled", className: "bg-warning/10 text-warning border-warning/20" },
  paid: { label: "Paid", className: "bg-success/10 text-success border-success/20" },
  "on-hold": { label: "On Hold", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export default function PayrollReimbursementsPage() {
  const { toast } = useToast();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Calendar state
  const [globalCycle, setGlobalCycle] = useState(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [settingCycle, setSettingCycle] = useState(false);

  const [activeInfo, setActiveInfo] = useState(null); 

  // On mount: fetch dashboard (which has upcoming_payroll_cycle) + get-payroll-date
  useEffect(() => {
    fetchDashboard();
    fetchPayrollDate();
  }, []);

  const fetchPayrollDate = async () => {
    try {
      const res = await fetch(`${BASE_URL}/get-payroll-date`, {
        headers: { accept: "application/json" },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      // Set calendar to next_payroll_cycle from API
      if (data.next_payroll_cycle) {
        setGlobalCycle(parseISO(data.next_payroll_cycle));
      }
    } catch {
      // fallback: calendar stays undefined, dashboard cycle will be used
    }
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/payroll-dashboard`, {
        headers: { accept: "application/json" },
      });
      if (!res.ok) throw new Error("Failed to fetch dashboard");
      const data = await res.json();
      setDashboardData(data);

      // If calendar not yet set, seed it from dashboard's upcoming_payroll_cycle
      if (data.upcoming_payroll_cycle) {
        setGlobalCycle((prev) => prev ?? parseISO(data.upcoming_payroll_cycle));
      }
    } catch {
      toast({ title: "Error", description: "Could not load payroll data.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const applyGlobalCycle = async (date) => {
    if (!date) return;
    setSettingCycle(true);
    try {
      const payrollDay = date.getDate();
      const res = await fetch(`${BASE_URL}/set-payroll-date`, {
        method: "POST",
        headers: { "Content-Type": "application/json", accept: "application/json" },
        body: JSON.stringify({ payroll_day: payrollDay }),
      });
      if (!res.ok) throw new Error();
      setGlobalCycle(date);
      setCalendarOpen(false);
      toast({
        title: "Payroll cycle updated",
        description: `Payroll date set to day ${payrollDay} — next cycle: ${format(date, "dd MMM yyyy")}.`,
      });
      // Refresh dashboard to reflect new cycle dates
      await fetchDashboard();
    } catch {
      toast({ title: "Error", description: "Could not update payroll date.", variant: "destructive" });
    } finally {
      setSettingCycle(false);
    }
  };

  const processEntry = async (reimbursementId) => {
    setProcessingId(reimbursementId);
    try {
      const res = await fetch(`${BASE_URL}/mark-reimbursement-paid`, {
        method: "POST",
        headers: { "Content-Type": "application/json", accept: "application/json" },
        body: JSON.stringify({ reimbursement_id: reimbursementId }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Reimbursement processed", description: "Employee will receive payment in next payroll run." });
      await fetchDashboard();
    } catch {
      toast({ title: "Error", description: "Could not process reimbursement.", variant: "destructive" });
    } finally {
      setProcessingId(null);
    }
  };

  const allEntries = useMemo(() => dashboardData?.scheduled_reimbursements || [], [dashboardData]);

  const filtered = useMemo(() => {
    return allEntries.filter((e) => {
      const matchesSearch =
        (e.employee_email || "").toLowerCase().includes(search.toLowerCase()) ||
        (e.description || "").toLowerCase().includes(search.toLowerCase()) ||
        (e.employee_name || "").toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || e.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [allEntries, search, statusFilter]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payroll Reimbursements</h1>
        <p className="text-muted-foreground text-sm">
          Employee out-of-pocket expenses auto-routed here on approval — assign payroll cycle and process.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" /> Total Requests
            </div>
            <p className="text-2xl font-bold mt-1">{loading ? "—" : dashboardData?.total_disbursements ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5" /> Paid Count
            </div>
            <p className="text-2xl font-bold mt-1">{loading ? "—" : dashboardData?.paid_count ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 text-xs text-warning">
              <Clock className="h-3.5 w-3.5" /> Pending Payout
            </div>
            <p className="text-2xl font-bold mt-1 text-warning">
              {loading ? "—" : `₹${Number(dashboardData?.scheduled_amount || 0).toLocaleString()}`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 text-xs text-success">
              <CheckCircle2 className="h-3.5 w-3.5" /> Paid Amount
            </div>
            <p className="text-2xl font-bold mt-1 text-success">
              {loading ? "—" : `₹${Number(dashboardData?.paid_amount || 0).toLocaleString()}`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters + Calendar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by employee or reason..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>

        {/* Global Payroll Calendar */}
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal gap-2",
                !globalCycle && "text-muted-foreground"
              )}
              disabled={settingCycle}
            >
              {settingCycle ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CalendarIcon className="h-4 w-4" />
              )}
              {globalCycle
                ? `Payroll Cycle: ${format(globalCycle, "dd MMM yyyy")}`
                : "Set Global Payroll Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="px-3 pt-3 pb-1 text-xs text-muted-foreground border-b">
              Select a date — the day of month becomes the recurring payroll day.
            </div>
            <Calendar
              mode="single"
              selected={globalCycle}
              onSelect={applyGlobalCycle}
              defaultMonth={globalCycle}
              captionLayout="dropdown-buttons"
              fromYear={2024}
              toYear={2027}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading reimbursements...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-2 font-medium">Employee</th>
                    <th className="text-right py-2 pr-6 font-medium">Amount</th>
                    <th className="text-left py-2 pl-6 font-medium">Submitted</th>
                    <th className="text-left py-2 font-medium">Payroll Cycle</th>
                    <th className="text-left py-2 font-medium">Status</th>
                    <th className="text-left py-2 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((e) => (
                    <tr key={e.reimbursement_id} className="border-b hover:bg-muted/50">
                      <td className="py-3 font-medium">
                        {e.employee_name }
                        {e.employee_name && (
                          <div className="text-xs text-muted-foreground font-normal">{e.employee_name}</div>
                        )}
                      </td>
                      <td className="py-3 text-right pr-6 font-mono">₹{Number(e.amount).toLocaleString()}</td>
                      <td className="py-3 pl-6 text-muted-foreground">
                        {format(parseISO(e.created_at), "dd MMM yyyy")}
                      </td>
                      <td className="py-3 text-muted-foreground text-xs">
                        {/* Show updated global cycle if set, else fall back to entry's own cycle */}
                        {globalCycle
                          ? format(globalCycle, "dd MMM yyyy")
                          : format(parseISO(e.payroll_cycle), "dd MMM yyyy")}
                      </td>
                      <td className="py-3">
  <Badge variant="outline" className={statusConfig[e.status]?.className || ""}>
    {statusConfig[e.status]?.label || e.status}
  </Badge>
</td>
<td className="py-3">
  <div className="flex items-center gap-2">
    <button
      className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted"
      onClick={() => setActiveInfo(e)}
    >
      <Eye className="h-4 w-4 text-muted-foreground" />
    </button>
    {e.status === "scheduled" ? (
      <Button
        size="sm"
        className="text-xs bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={processingId === e.reimbursement_id}
        onClick={() => processEntry(e.reimbursement_id)}
      >
        {processingId === e.reimbursement_id ? (
          <><Loader2 className="h-3 w-3 animate-spin mr-1" /> Processing...</>
        ) : (
          "Process Payment"
        )}
      </Button>
    ) : (
      <span className="text-xs text-muted-foreground">—</span>
    )}
  </div>
</td>
                     
                     
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground text-sm">
                        No reimbursements match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
                
              </table>

              
            </div>
          )}
        </CardContent>
      </Card>
                    <Dialog open={!!activeInfo} onOpenChange={() => setActiveInfo(null)}>
  <DialogContent className="max-w-sm">
    <DialogHeader>
      <DialogTitle>Reimbursement Details</DialogTitle>
      <DialogDescription>{activeInfo?.employee_name}</DialogDescription>
    </DialogHeader>
    <div className="space-y-2 text-sm">
      {activeInfo?.description ? (
        <p className="text-muted-foreground">{activeInfo.description}</p>
      ) : activeInfo?.items && activeInfo.items.length > 0 ? (
        <div className="space-y-2">
          {activeInfo.items.map((item, i) => (
            <div key={i} className="flex justify-between border-b pb-1.5">
              <span className="text-muted-foreground capitalize">{item.description}</span>
              <span className="font-medium">₹{Number(item.amount).toLocaleString()}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No details available.</p>
      )}
    </div>
  </DialogContent>
</Dialog>
      
      
    </div>
  );
}