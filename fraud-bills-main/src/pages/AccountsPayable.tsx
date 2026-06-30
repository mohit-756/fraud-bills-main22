// import React, { useState, useMemo } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Search, Wallet, AlertCircle, CheckCircle2, Clock } from "lucide-react";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { mockAPEntries, type APEntry } from "@/data/mockData";
// import { differenceInCalendarDays, parseISO, format } from "date-fns";
// import { useToast } from "@/hooks/use-toast";

// const statusConfig: Record<APEntry["status"], { label: string; className: string }> = {
//   scheduled: { label: "Scheduled", className: "bg-warning/10 text-warning border-warning/20" },
//   paid: { label: "Paid", className: "bg-success/10 text-success border-success/20" },
//   overdue: { label: "Overdue", className: "bg-destructive/10 text-destructive border-destructive/20" },
// };

// export default function AccountsPayablePage() {
//   const { toast } = useToast();
//   const [entries, setEntries] = useState<APEntry[]>(mockAPEntries);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");

//   const today = new Date();

//   const filtered = useMemo(() => {
//     return entries.filter((e) => {
//       const matchesSearch =
//         e.vendor.toLowerCase().includes(search.toLowerCase()) ||
//         e.invoiceNumber.toLowerCase().includes(search.toLowerCase());
//       const matchesStatus = statusFilter === "all" || e.status === statusFilter;
//       return matchesSearch && matchesStatus;
//     });
//   }, [entries, search, statusFilter]);

//   const totals = useMemo(() => {
//     const outstanding = entries.filter((e) => e.status !== "paid").reduce((s, e) => s + e.amount, 0);
//     const overdue = entries.filter((e) => e.status === "overdue").reduce((s, e) => s + e.amount, 0);
//     const paid = entries.filter((e) => e.status === "paid").reduce((s, e) => s + e.amount, 0);
//     return { outstanding, overdue, paid, count: entries.length };
//   }, [entries]);

//   const markPaid = (id: string) => {
//     setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status: "paid" } : e)));
//     toast({ title: "Payment recorded", description: "Vendor invoice marked as paid." });
//   };

//   return (
//     <div className="space-y-6 animate-fade-in">
//       <div>
//         <h1 className="text-2xl font-bold tracking-tight">Accounts Payable</h1>
//         <p className="text-muted-foreground text-sm">Vendor invoices auto-created from approved bills — track due dates and process payments.</p>
//       </div>

//       {/* Summary cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
//         <Card><CardContent className="pt-5 pb-4">
//           <div className="flex items-center gap-2 text-xs text-muted-foreground"><Wallet className="h-3.5 w-3.5" /> Total Entries</div>
//           <p className="text-2xl font-bold mt-1">{totals.count}</p>
//         </CardContent></Card>
//         <Card><CardContent className="pt-5 pb-4">
//           <div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" /> Pending Amount</div>
//           <p className="text-2xl font-bold mt-1">₹{totals.outstanding.toLocaleString()}</p>
//         </CardContent></Card>
//         <Card><CardContent className="pt-5 pb-4">
//           <div className="flex items-center gap-2 text-xs text-destructive"><AlertCircle className="h-3.5 w-3.5" /> Overdue</div>
//           <p className="text-2xl font-bold mt-1 text-destructive">₹{totals.overdue.toLocaleString()}</p>
//         </CardContent></Card>
//         <Card><CardContent className="pt-5 pb-4">
//           <div className="flex items-center gap-2 text-xs text-success"><CheckCircle2 className="h-3.5 w-3.5" /> Paid</div>
//           <p className="text-2xl font-bold mt-1 text-success">₹{totals.paid.toLocaleString()}</p>
//         </CardContent></Card>
//       </div>

//       <div className="flex flex-wrap gap-3 items-center">
//         <div className="relative flex-1 min-w-[200px] max-w-sm">
//           <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
//           <Input placeholder="Search by vendor or invoice..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
//         </div>
//         <Select value={statusFilter} onValueChange={setStatusFilter}>
//           <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Status</SelectItem>
//             <SelectItem value="scheduled">Scheduled</SelectItem>
//             <SelectItem value="overdue">Overdue</SelectItem>
//             <SelectItem value="paid">Paid</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <Card>
//         <CardContent className="pt-6">
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b text-muted-foreground">
//                   <th className="text-left py-2 font-medium">Invoice #</th>
//                   <th className="text-left py-2 font-medium">Vendor</th>
//                   <th className="text-right py-2 pr-6 font-medium">Amount</th>
//                   <th className="text-left py-2 pl-6 font-medium">Due Date</th>
//                   <th className="text-left py-2 font-medium">Days Remaining</th>
//                   <th className="text-left py-2 font-medium">Method</th>
//                   <th className="text-left py-2 font-medium">Status</th>
//                   <th className="text-left py-2 font-medium">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((e) => {
//                   const due = parseISO(e.dueDate);
//                   const days = differenceInCalendarDays(due, today);
//                   const daysLabel = e.status === "paid" ? "—" : days < 0 ? `${Math.abs(days)} days overdue` : days === 0 ? "Due today" : `${days} days`;
//                   const daysClass = e.status === "paid" ? "text-muted-foreground" : days < 0 ? "text-destructive font-medium" : days <= 7 ? "text-warning font-medium" : "text-muted-foreground";
//                   return (
//                     <tr key={e.id} className="border-b hover:bg-muted/50">
//                       <td className="py-3 font-medium">{e.invoiceNumber}</td>
//                       <td className="py-3">{e.vendor}</td>
//                       <td className="py-3 text-right pr-6 font-mono">₹{e.amount.toLocaleString()}</td>
//                       <td className="py-3 pl-6 text-muted-foreground">{format(due, "dd MMM yyyy")}</td>
//                       <td className={`py-3 ${daysClass}`}>{daysLabel}</td>
//                       <td className="py-3 text-muted-foreground">{e.paymentMethod}</td>
//                       <td className="py-3"><Badge variant="outline" className={statusConfig[e.status].className}>{statusConfig[e.status].label}</Badge></td>
//                       <td className="py-3">
//                         {e.status !== "paid" ? (
//                           <Button size="sm" className="text-xs bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => markPaid(e.id)}>Mark Paid</Button>
//                         ) : <span className="text-xs text-muted-foreground">—</span>}
//                       </td>
//                     </tr>
//                   );
//                 })}
//                 {filtered.length === 0 && (
//                   <tr><td colSpan={8} className="py-8 text-center text-muted-foreground text-sm">No AP entries match your filters.</td></tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }




import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Wallet, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const BASE_URL = "https://d2ontk4ewdype3.cloudfront.net";

interface APEntry {
  ap_id:           string;
  upload_id:       string;
  finance_user_id: string;
  invoice_amount:  number;
  description:     string;
  due_date:        string;
  days_remaining:  number | "-";
  overdue:         boolean | "-";
  status:          "pending" | "paid";
  approved_at:     string;
  created_at:      string;
}

interface Dashboard {
  total_entries:  number;
  total_amount:   number;
  pending_count:  number;
  pending_amount: number;
  paid_count:     number;
  paid_amount:    number;
  overdue_count:  number;
  overdue_amount: number;
}

export default function AccountsPayable() {
  const { toast } = useToast();

  const [entries,       setEntries]       = useState<APEntry[]>([]);
  const [dashboard,     setDashboard]     = useState<Dashboard | null>(null);
  const [search,        setSearch]        = useState("");
  const [statusFilter,  setStatusFilter]  = useState("all");
  const [loading,       setLoading]       = useState(true);
  const [markingPaid,   setMarkingPaid]   = useState<string | null>(null);

  // ── Fetch entries ──────────────────────────────────────────────────────────
  const fetchEntries = useCallback(async () => {
    try {
      const url = statusFilter === "all"
        ? `${BASE_URL}/ap-entries`
        : `${BASE_URL}/ap-entries?status=${statusFilter}`;
      const res  = await fetch(url);
      const data = await res.json();
      setEntries(data.entries || []);
    } catch {
      toast({ title: "Error", description: "Failed to load AP entries.", variant: "destructive" });
    }
  }, [statusFilter, toast]);

  // ── Fetch dashboard ────────────────────────────────────────────────────────
  const fetchDashboard = useCallback(async () => {
    try {
      const res  = await fetch(`${BASE_URL}/ap-entries/dashboard`);
      const data = await res.json();
      setDashboard(data);
    } catch {
      toast({ title: "Error", description: "Failed to load dashboard.", variant: "destructive" });
    }
  }, [toast]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchEntries(), fetchDashboard()]);
      setLoading(false);
    };
    load();
  }, [fetchEntries, fetchDashboard]);

  // ── Mark as paid ───────────────────────────────────────────────────────────
  const markPaid = async (ap_id: string) => {
    setMarkingPaid(ap_id);
    try {
      const res = await fetch(`${BASE_URL}/ap-entries/${ap_id}/mark-paid`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error();
      toast({ title: "Payment recorded", description: "Invoice marked as paid." });
      await Promise.all([fetchEntries(), fetchDashboard()]);
    } catch {
      toast({ title: "Error", description: "Failed to mark as paid.", variant: "destructive" });
    } finally {
      setMarkingPaid(null);
    }
  };

  // ── Client-side search filter ──────────────────────────────────────────────
  const filtered = entries.filter((e) =>
    e.ap_id.toLowerCase().includes(search.toLowerCase())
  );

  // ── Days remaining label & color ───────────────────────────────────────────
  const daysLabel = (e: APEntry) => {
    if (e.status === "paid")          return "—";
    if (e.due_date === "Not set")     return "No due date";
    if (e.days_remaining === "-")     return "No due date";
    if (e.days_remaining < 0)        return `${Math.abs(e.days_remaining as number)} days overdue`;
    if (e.days_remaining === 0)      return "Due today";
    return `${e.days_remaining} days`;
  };

  const daysClass = (e: APEntry) => {
    if (e.status === "paid")                              return "text-muted-foreground";
    if (e.days_remaining === "-")                        return "text-muted-foreground";
    if ((e.days_remaining as number) < 0)               return "text-destructive font-medium";
    if ((e.days_remaining as number) <= 7)              return "text-warning font-medium";
    return "text-muted-foreground";
  };

  // ── Status badge ───────────────────────────────────────────────────────────
  const statusBadge = (e: APEntry) => {
    if (e.status === "paid")
      return <Badge variant="outline" className="bg-success/10 text-success border-success/20">Paid</Badge>;
    if (e.overdue === true)
      return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Overdue</Badge>;
    return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Accounts Payable</h1>
        <p className="text-muted-foreground text-sm">
          Vendor invoices auto-created from approved bills — track due dates and process payments.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <Card><CardContent className="pt-5 pb-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Wallet className="h-3.5 w-3.5" /> Total Entries
          </div>
           <p className="text-2xl font-bold mt-1">
            ₹{dashboard?.total_amount?.toLocaleString() ?? "—"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{dashboard?.total_entries ?? "—"}</p>
        </CardContent></Card>

        <Card><CardContent className="pt-5 pb-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" /> Pending
          </div>
           <p className="text-2xl font-bold mt-1">
            ₹{dashboard?.pending_amount?.toLocaleString() ?? "—"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{dashboard?.pending_count ?? "—"}</p>
         
        </CardContent></Card>

        <Card><CardContent className="pt-5 pb-4">
          <div className="flex items-center gap-2 text-xs text-destructive">
            <AlertCircle className="h-3.5 w-3.5" /> Overdue
          </div>
          <p className="text-2xl font-bold mt-1 text-destructive">
            ₹{dashboard?.overdue_amount?.toLocaleString() ?? "—"}
          </p>
          <p className="text-xs text-destructive/70 mt-0.5">{dashboard?.overdue_count ?? "—"}</p>
          
        </CardContent></Card>

        <Card><CardContent className="pt-5 pb-4">
          <div className="flex items-center gap-2 text-xs text-success">
            <CheckCircle2 className="h-3.5 w-3.5" /> Paid
          </div>
          <p  className="text-2xl font-bold mt-1 text-success">
            ₹{dashboard?.paid_amount?.toLocaleString() ?? "—"}
          </p>
          <p className="text-xs text-success/70 mt-0.5">{dashboard?.paid_count ?? "—"}</p>
          
        </CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by vendor or AP ID..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <p className="text-center text-sm text-muted-foreground py-10">Loading entries...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-2 font-medium">AP ID</th>
                    <th className="text-left py-2 font-medium">Reason</th>
                    <th className="text-right py-2 pr-6 font-medium">Amount</th>
                    <th className="text-left py-2 pl-6 font-medium">Due Date</th>
                    <th className="text-left py-2 font-medium">Days Remaining</th>
                    <th className="text-left py-2 font-medium">Status</th>
                    <th className="text-left py-2 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((e) => (
                    <tr key={e.ap_id} className="border-b hover:bg-muted/50">
                      <td className="py-3 font-mono text-xs text-muted-foreground">
                        {e.ap_id.slice(0, 8)}...
                      </td>
                      <td className="py-3 font-medium">{e.description}</td>
                      <td className="py-3 text-right pr-6 font-mono">
                        ₹{e.invoice_amount.toLocaleString()}
                      </td>
                      <td className="py-3 pl-6 text-muted-foreground">
                        {e.due_date && e.due_date !== "Not set"
                          ? format(parseISO(e.due_date), "dd MMM yyyy")
                          : "Not set"}
                      </td>
                      <td className={`py-3 ${daysClass(e)}`}>{daysLabel(e)}</td>
                      <td className="py-3">{statusBadge(e)}</td>
                      <td className="py-3">
                        {e.status !== "paid" ? (
                          <Button
                            size="sm"
                            className="text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                            disabled={markingPaid === e.ap_id}
                            onClick={() => markPaid(e.ap_id)}
                          >
                            {markingPaid === e.ap_id ? "Saving..." : "Mark Paid"}
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground text-sm">
                        No AP entries match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}