// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { FileText, Clock, CheckCircle, XCircle, Upload, Eye } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { mockBills } from "@/data/mockData";
// import { useAuth } from "@/contexts/AuthContext";
// import { useNavigate } from "react-router-dom";
// import DocumentViewModal from "@/components/DocumentViewModal";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
// import { format } from "date-fns";

// const statusConfig = {
//   pending: { label: "Pending", className: "bg-warning/10 text-warning border-warning/20" },
//   approved: { label: "Approved", className: "bg-success/10 text-success border-success/20" },
//   rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
// };

// function getMonthlyData(bills: typeof mockBills) {
//   const map: Record<string, { month: string; count: number; amount: number }> = {};
//   bills.forEach((b) => {
//     const m = b.date.slice(0, 7);
//     if (!map[m]) map[m] = { month: m, count: 0, amount: 0 };
//     map[m].count += 1;
//     map[m].amount += b.amount;
//   });
//   return Object.values(map).sort((a, b) => a.month.localeCompare(b.month)).map(d => ({
//     ...d,
//     month: format(new Date(d.month + "-01"), "MMM yyyy"),
//   }));
// }

// export default function VendorDashboard() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [viewBillId, setViewBillId] = useState<string | null>(null);
//   const viewBill = mockBills.find((b) => b.id === viewBillId);
//   const myBills = mockBills.filter((b) => b.role === "vendor");
//   const pending = myBills.filter((b) => b.status === "pending").length;
//   const approved = myBills.filter((b) => b.status === "approved").length;
//   const rejected = myBills.filter((b) => b.status === "rejected").length;
//   const monthlyData = getMonthlyData(myBills);

//   const stats = [
//     { label: "Submitted", value: myBills.length, icon: FileText, color: "text-primary" },
//     { label: "Pending", value: pending, icon: Clock, color: "text-warning" },
//     { label: "Approved", value: approved, icon: CheckCircle, color: "text-success" },
//     { label: "Rejected", value: rejected, icon: XCircle, color: "text-destructive" },
//   ];

//   return (
//     <div className="space-y-6 animate-fade-in">
//       <div>
//         <h1 className="text-2xl font-bold tracking-tight">Vendor Portal</h1>
//         <p className="text-muted-foreground text-sm">Track your bill submissions and approvals</p>
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

//       <Card className="cursor-pointer hover:border-primary/30 transition-colors" onClick={() => navigate("/upload")}>
//         <CardContent className="p-6 flex items-center gap-4">
//           <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
//             <Upload className="h-6 w-6 text-primary" />
//           </div>
//           <div>
//             <p className="font-semibold">Upload New Bill</p>
//             <p className="text-sm text-muted-foreground">Submit a new bill for approval</p>
//           </div>
//         </CardContent>
//       </Card>

//       <div className="grid lg:grid-cols-2 gap-4">
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-sm font-semibold">Settlements Per Month</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={250}>
//               <BarChart data={monthlyData}>
//                 <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
//                 <XAxis dataKey="month" className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
//                 <YAxis allowDecimals={false} className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
//                 <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
//                 <Bar dataKey="count" name="Settlements" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-sm font-semibold">Settlement Amount Per Month (₹)</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={250}>
//               <BarChart data={monthlyData}>
//                 <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
//                 <XAxis dataKey="month" className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
//                 <YAxis className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
//                 <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']} />
//                 <Bar dataKey="amount" name="Amount" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>

//       <DocumentViewModal bill={viewBill} open={!!viewBillId} onClose={() => setViewBillId(null)} />
//     </div>
//   );
// }



import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Upload,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import DocumentViewModal from "@/components/DocumentViewModal";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

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
}

interface MonthlyChartItem {
  month: string;
  count: number;
  amount: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStoredUser(): { user_id: string; usertype: string } | null {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.user_id && parsed?.usertype ? parsed : null;
  } catch {
    return null;
  }
}

function buildChartData(
  monthly_claims: Record<string, number>,
  monthly_amounts: Record<string, number>
): MonthlyChartItem[] {
  const months = Array.from(
    new Set([...Object.keys(monthly_claims), ...Object.keys(monthly_amounts)])
  ).sort((a, b) => {
    const parse = (m: string) => new Date(m.replace(" ", " 1 "));
    return parse(a).getTime() - parse(b).getTime();
  });

  return months.map((m) => ({
    month: m,
    count: monthly_claims[m] ?? 0,
    amount: monthly_amounts[m] ?? 0,
  }));
}

// ─── Status badge config ──────────────────────────────────────────────────────

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  approved: {
    label: "Approved",
    className: "bg-success/10 text-success border-success/20",
  },
  rejected: {
    label: "Rejected",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
} as const;

// ─── Main Component ───────────────────────────────────────────────────────────

export default function VendorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewBillId, setViewBillId] = useState<string | null>(null);

  // ── Fetch dashboard data ───────────────────────────────────────────────────
  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    const storedUser = getStoredUser();

    if (!storedUser) {
      setError("User session not found. Please log in again.");
      setLoading(false);
      return;
    }

    if (storedUser.usertype !== "vendor") {
      setError("Access denied. This dashboard is for vendor users only.");
      setLoading(false);
      return;
    }

    try {
      const params = new URLSearchParams({ user_id: storedUser.user_id });
      const response = await fetch(
        `https://d2ontk4ewdype3.cloudfront.net/get-dashboard?${params.toString()}`,
        {
          method: "GET",
          headers: { accept: "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`
        );
      }

      const data: DashboardData = await response.json();
      setDashboardData(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch dashboard data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // ── Derived data ───────────────────────────────────────────────────────────
  const chartData = dashboardData
    ? buildChartData(dashboardData.monthly_claims, dashboardData.monthly_amounts)
    : [];

  const stats = dashboardData
    ? [
        {
          label: "Submitted",
          value: dashboardData.total_bills,
          icon: FileText,
          color: "text-primary",
        },
        {
          label: "Pending",
          value: dashboardData.pending,
          icon: Clock,
          color: "text-warning",
        },
        {
          label: "Approved",
          value: dashboardData.approved,
          icon: CheckCircle,
          color: "text-success",
        },
        {
          label: "Rejected",
          value: dashboardData.rejected,
          icon: XCircle,
          color: "text-destructive",
        },
      ]
    : [];

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <p className="text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchDashboard}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────────
  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-muted-foreground">No data available.</p>
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vendor Portal</h1>
          <p className="text-muted-foreground text-sm">
            Track your bill submissions and approvals
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchDashboard}
          className="text-xs"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Refresh
        </Button>
      </div>

      {/* Stat cards */}
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
                <div
                  className={`h-10 w-10 rounded-lg bg-secondary flex items-center justify-center ${s.color}`}
                >
                  <s.icon className="h-5 w-5" />
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

      {/* Upload CTA */}
      <Card
        className="cursor-pointer hover:border-primary/30 transition-colors"
        onClick={() => navigate("/upload")}
      >
        <CardContent className="p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold">Upload New Bill</p>
            <p className="text-sm text-muted-foreground">
              Submit a new bill for approval
            </p>
          </div>
        </CardContent>
      </Card>


      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Claims count */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Total Claims Per Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
                No claims data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    className="text-xs fill-muted-foreground"
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12 }}
                    className="text-xs fill-muted-foreground"
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--card))",
                    }}
                    formatter={(value: number) => [value, "Claims"]}
                  />
                  <Bar
                    dataKey="count"
                    name="Claims"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Claims amount */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Total Claim Amount Per Month (₹)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
                No amount data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    className="text-xs fill-muted-foreground"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    className="text-xs fill-muted-foreground"
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--card))",
                    }}
                    formatter={(value: number) => [
                      `₹${value.toLocaleString("en-IN")}`,
                      "Amount",
                    ]}
                  />
                  <Bar
                    dataKey="amount"
                    name="Amount"
                    fill="hsl(var(--success))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Document view modal */}
      <DocumentViewModal
        bill={undefined}
        open={!!viewBillId}
        onClose={() => setViewBillId(null)}
      />
    </div>
  );
}