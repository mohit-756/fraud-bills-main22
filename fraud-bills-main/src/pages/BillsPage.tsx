import React, { useEffect, useState, useMemo } from "react";
import { API_BASE_URL } from "@/config";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Receipt 
} from "lucide-react";

const statusConfig: any = {
  pending: { label: "Pending", className: "bg-warning/10 text-warning border-warning/20" },
  approved: { label: "Approved", className: "bg-success/10 text-success border-success/20" },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

interface Claim {
  upload_id: string;
  amount: string;
  created_at: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  submitter_name: string;
  title: string;
  user_id: string;
  usertype: string;
}

type SortConfig = {
  key: keyof Claim | "";
  direction: "asc" | "desc";
};

const API_BASE = API_BASE_URL;

const getApiEndpoint = (usertype: string, userId: string): string => {
  switch (usertype) {
    case "vendor":
      return `${API_BASE}/get-vendor-claims?user_id=${userId}`;
    case "sales":
      return `${API_BASE}/get-sales-claims?user_id=${userId}`;
    default:
      throw new Error(`No bills endpoint for role: ${usertype}`);
  }
};

export default function BillsPage() {
  const [bills, setBills] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({ 
    key: "created_at", 
    direction: "desc" 
  });

  useEffect(() => {
    const fetchBills = async () => {
      try {
        setLoading(true);
        setError(null);
        const storedUser = localStorage.getItem("user");
        if (!storedUser) throw new Error("User not found in localStorage");
        const parsedUser = JSON.parse(storedUser);
        const userId = parsedUser.user_id;
        const usertype = parsedUser.usertype;
        if (!userId || !usertype) throw new Error("User details missing");
        const endpoint = getApiEndpoint(usertype, userId);
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        setBills(data.claims ?? []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch bills");
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, []);

  const processedBills = useMemo(() => {
    let filtered = bills.filter((bill) => {
      const searchStr = searchQuery.toLowerCase();
      return (
        (bill.title || "").toLowerCase().includes(searchStr) ||
        (bill.upload_id || "").toLowerCase().includes(searchStr) ||
        (bill.description || "").toLowerCase().includes(searchStr)
      );
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let valA: any = a[sortConfig.key as keyof Claim];
        let valB: any = b[sortConfig.key as keyof Claim];
        if (sortConfig.key === "amount") {
          valA = Number(valA);
          valB = Number(valB);
        }
        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [bills, searchQuery, sortConfig]);

  const requestSort = (key: keyof Claim) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Claim) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="ml-1 h-3 w-3" />;
    return sortConfig.direction === "asc" ? 
      <ArrowUp className="ml-1 h-3 w-3" /> : 
      <ArrowDown className="ml-1 h-3 w-3" />;
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Receipt className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Bills</h1>
            <p className="text-muted-foreground text-sm">View all your submitted bills</p>
          </div>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-11 md:h-9 text-sm rounded-xl md:rounded-lg"
          />
        </div>
      </div>

      <div>
        {loading ? (
          <p className="text-sm text-muted-foreground py-12 text-center">Loading bills...</p>
        ) : error ? (
          <p className="text-sm text-destructive py-12 text-center">{error}</p>
        ) : processedBills.length === 0 ? (
          <div className="py-20 text-center bg-white border rounded-2xl">
            <Receipt className="h-12 w-12 text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
              No bills found
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Card>
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-muted-foreground">
                          <th className="text-left py-2 font-medium cursor-pointer" onClick={() => requestSort("upload_id")}>
                            <div className="flex items-center">Tracking ID {getSortIcon("upload_id")}</div>
                          </th>
                          <th className="text-left py-2 font-medium cursor-pointer" onClick={() => requestSort("title")}>
                            <div className="flex items-center">Bill Name {getSortIcon("title")}</div>
                          </th>
                          <th className="text-left py-2 font-medium">Description</th>
                          <th className="text-right py-2 pr-6 font-medium cursor-pointer" onClick={() => requestSort("amount")}>
                            <div className="flex items-center justify-end">Amount {getSortIcon("amount")}</div>
                          </th>
                          <th className="text-left py-2 pl-6 font-medium cursor-pointer" onClick={() => requestSort("created_at")}>
                            <div className="flex items-center">Date {getSortIcon("created_at")}</div>
                          </th>
                          <th className="text-left py-2 font-medium cursor-pointer" onClick={() => requestSort("status")}>
                            <div className="flex items-center">Status {getSortIcon("status")}</div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {processedBills.map((bill) => (
                          <tr key={bill.upload_id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                            <td className="py-3 font-medium">{bill.upload_id}</td>
                            <td className="py-3">{bill.title}</td>
                            <td className="py-3 text-muted-foreground">{bill.description}</td>
                            <td className="py-3 text-right pr-6 font-mono">₹{Number(bill.amount).toLocaleString("en-IN")}</td>
                            <td className="py-3 pl-6 text-muted-foreground">{formatDate(bill.created_at)}</td>
                            <td className="py-3">
                              <Badge variant="outline" className={cn(statusConfig[bill.status]?.className)}>
                                {statusConfig[bill.status]?.label ?? bill.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {processedBills.map((bill) => (
                <Card key={bill.upload_id} className="overflow-hidden border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-mono text-muted-foreground mb-0.5 truncate">
                          #{bill.upload_id.slice(-8).toUpperCase()}
                        </p>
                        <h3 className="font-bold text-slate-900 truncate">{bill.title}</h3>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn("text-[10px] font-bold uppercase tracking-tight shrink-0", statusConfig[bill.status]?.className)}
                      >
                        {statusConfig[bill.status]?.label ?? bill.status}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 mb-4 h-8">
                      {bill.description || "No description provided."}
                    </p>

                    <div className="flex items-end justify-between pt-2 border-t border-slate-50">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-0.5">
                          {formatDate(bill.created_at)}
                        </p>
                        <p className="text-lg font-black text-slate-900">
                          ₹{Number(bill.amount).toLocaleString("en-IN")}
                        </p>
                      </div>

                      <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center">
                        <Receipt className="h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
