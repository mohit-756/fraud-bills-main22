import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockBills } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

export default function AnalyticsPage() {
  const monthlyData = [
    { month: "Jan", bills: 12, fraud: 2, amount: 145000 },
    { month: "Feb", bills: 18, fraud: 3, amount: 230000 },
    { month: "Mar", bills: mockBills.length, fraud: mockBills.filter((b) => b.fraudScore === "high").length, amount: mockBills.reduce((s, b) => s + b.amount, 0) },
  ];

  const vendorData = [
    { name: "Acme Corp", count: 2 },
    { name: "TechParts", count: 1 },
    { name: "CleanCo", count: 1 },
    { name: "DataFlow", count: 1 },
    { name: "LogiTrans", count: 1 },
    { name: "QuickFix", count: 1 },
    { name: "GreenLeaf", count: 1 },
  ];

  const riskPie = [
    { name: "Low", value: mockBills.filter((b) => b.fraudScore === "low").length, color: "hsl(160, 60%, 40%)" },
    { name: "Medium", value: mockBills.filter((b) => b.fraudScore === "medium").length, color: "hsl(38, 92%, 50%)" },
    { name: "High", value: mockBills.filter((b) => b.fraudScore === "high").length, color: "hsl(0, 72%, 51%)" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground text-sm">Insights and trends across bill submissions</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm font-semibold">Monthly Bill Volume</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="bills" fill="hsl(220, 70%, 15%)" radius={[4, 4, 0, 0]} name="Total Bills" />
                <Bar dataKey="fraud" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} name="Fraud Flagged" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm font-semibold">Monthly Spend Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${v / 1000}K`} />
                <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
                <Line type="monotone" dataKey="amount" stroke="hsl(160, 60%, 40%)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm font-semibold">Risk Distribution</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={riskPie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {riskPie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 ml-4">
              {riskPie.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-muted-foreground">{d.name}: {d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm font-semibold">Bills by Vendor</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={vendorData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(220, 70%, 30%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
