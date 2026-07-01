import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart, Clock, CheckCircle, XCircle,
  Plus, Eye, Check, X, RefreshCw, TrendingUp,
  Search,
  ChevronDown
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import CreatePurchaseOrderModal from "@/components/CreatePurchaseOrderModal";
import { hapticImpactLight, hapticSuccess, hapticError } from "@/lib/haptics";
import { API_BASE_URL } from "@/config";

const BASE_URL = API_BASE_URL;

// ─── Types ────────────────────────────────────────────────────────────────────
interface POItem {
  description: string;
  item: string;
  quantity: number;
  unit_price?: number;
  total_price?: number;
}

interface PurchaseOrder {
  po_id: string;
  vendor_id: string;
  vendor_name: string;
  status: "created" | "accepted" | "completed" | "rejected";
  created_at: string;
  accepted_at: string | null;
  completed_at: string | null;
  total_po_amount: number;
  items: POItem[];
}

interface StatusBreakdown {
  count: number;
  amount: number;
}

interface Dashboard {
  summary: {
    total_purchase_orders: number;
    total_amount: number;
    average_po_value: number;
    largest_po_value: number;
    smallest_po_value: number;
  };
  status_breakdown: {
    created:   StatusBreakdown;
    accepted:  StatusBreakdown;
    completed: StatusBreakdown;
    rejected:  StatusBreakdown;
  };
  pipeline: {
    pending_vendor_response: number;
    pending_finance_review: number;
    pipeline_amount: number;
  };
  performance: {
    completion_rate: number;
    rejection_rate: number;
    vendor_acceptance_rate: number;
    average_days_to_vendor_accept: number;
    average_days_to_complete: number;
  };
}

interface Vendor {
  vendor_id: string;
  vendor_name: string;
  email: string;
}

// ─── Status config ────────────────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; className: string }> = {
  created:   { label: "Awaiting Vendor",  className: "bg-warning/10 text-warning border-warning/20" },
  accepted:  { label: "Quote Received",   className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  completed: { label: "Completed",        className: "bg-success/10 text-success border-success/20" },
  rejected:  { label: "Rejected",         className: "bg-destructive/10 text-destructive border-destructive/20" },
};

function getFinanceUserId(): string {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return "";
    const parsed = JSON.parse(raw);
    return parsed?.user_id ?? "";
  } catch { return ""; }
}

// ─── KPI Card component ───────────────────────────────────────────────────────
interface KPICardProps {
  label: string;
  count: number | string;
  subText?: string | null;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  delay?: number;
}

function KPICard({ label, count, subText, icon: Icon, iconBg, iconColor, delay = 0 }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.25 }}
    >
      <Card className="hover:shadow-sm transition-shadow">
        <CardContent className="p-4 flex items-start gap-3 h-24">
          <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
            <Icon className={`h-4.5 w-4.5 ${iconColor}`} style={{ height: 18, width: 18 }} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground font-medium leading-none mb-1.5">{label}</p>
            <p className="text-2xl font-bold tracking-tight leading-none">{count}</p>
            {subText && (
              <p className="text-xs text-muted-foreground mt-1 truncate">{subText}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Items Preview Modal ──────────────────────────────────────────────────────
function ItemsModal({
  order, open, onClose,
}: {
  order: PurchaseOrder | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!order) return null;
  const hasPrice = order.items.some((i) => i.unit_price !== undefined);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{order.po_id.slice(0, 24)}... — Line Items</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b text-muted-foreground">
                  <th className="text-left py-2 px-3 font-medium">Item</th>
                  <th className="text-left py-2 px-3 font-medium">Description</th>
                  <th className="text-center py-2 px-2 font-medium">Qty</th>
                  {hasPrice && (
                    <>
                      <th className="text-right py-2 px-3 font-medium">Unit Price</th>
                      <th className="text-right py-2 px-3 font-medium">Total</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2 px-3 font-medium">{item.item}</td>
                    <td className="py-2 px-3 text-muted-foreground text-xs">{item.description}</td>
                    <td className="py-2 px-2 text-center">{item.quantity}</td>
                    {hasPrice && (
                      <>
                        <td className="py-2 px-3 text-right font-mono">
                          {item.unit_price !== undefined
                            ? `₹${item.unit_price.toLocaleString()}`
                            : "—"}
                        </td>
                        <td className="py-2 px-3 text-right font-mono">
                          {item.total_price !== undefined
                            ? `₹${item.total_price.toLocaleString()}`
                            : "—"}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
              {hasPrice && (
                <tfoot>
                  <tr className="bg-muted/30">
                    <td colSpan={4} className="py-2 px-3 text-right font-medium">
                      Grand Total
                    </td>
                    <td className="py-2 px-3 text-right font-bold font-mono">
                      ₹{order.total_po_amount.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
          {!hasPrice && (
            <p className="text-xs text-center text-muted-foreground">
              Vendor hasn't submitted pricing yet.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FinancePurchaseOrders() {
  const { toast } = useToast();

  const [orders,       setOrders]      = useState<PurchaseOrder[]>([]);
  const [dashboard,    setDashboard]   = useState<Dashboard | null>(null);
  const [vendors,      setVendors]     = useState<Vendor[]>([]);
  const [loading,      setLoading]     = useState(true);
  const [createOpen,   setCreateOpen]  = useState(false);
  const [previewOrder, setPreview]     = useState<PurchaseOrder | null>(null);
  const [previewOpen,  setPreviewOpen] = useState(false);
  const [actioning,    setActioning]   = useState<string | null>(null);
  const [search,        setSearch]       = useState("");
  const [statusFilter,  setStatusFilter] = useState("all");
  // ── Fetch helpers ─────────────────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    try {
      const res  = await fetch(`${BASE_URL}/list-po`);
      const data = await res.json();
      const sorted = (data.purchase_orders ?? []).sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
      setOrders(sorted);
      
    } catch {
      toast({ title: "Error", description: "Failed to load purchase orders.", variant: "destructive" });
    }
  }, [toast]);

  const fetchDashboard = useCallback(async () => {
    try {
      const res  = await fetch(`${BASE_URL}/dashboard-po`);
      const data = await res.json();
      setDashboard(data);
    } catch {
      toast({ title: "Error", description: "Failed to load dashboard.", variant: "destructive" });
    }
  }, [toast]);

  const fetchVendors = useCallback(async () => {
    try {
      const res  = await fetch(`${BASE_URL}/list-vendors`);
      const data = await res.json();
      setVendors(data.vendors ?? []);
    } catch {
      toast({ title: "Error", description: "Failed to load vendors.", variant: "destructive" });
    }
  }, [toast]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchOrders(), fetchDashboard(), fetchVendors()]);
      setLoading(false);
    };
    load();
  }, [fetchOrders, fetchDashboard, fetchVendors]);

  // ── KPI cards ─────────────────────────────────────────────────────────────
  const sb = dashboard?.status_breakdown;

  const kpiCards: KPICardProps[] = [
  {
    label:     "Total POs",
    count:     dashboard?.summary?.total_purchase_orders ?? "—",
    subText: dashboard?.summary?.total_amount !== undefined
                  ? `₹${dashboard.summary?.total_amount.toLocaleString()}`: "—",
    icon:      ShoppingCart,
    iconBg:    "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    label:     "Created",
    count:     sb?.created.count ?? "—",
    subText:   null,
    icon:      Clock,
    iconBg:    "bg-warning/10",
    iconColor: "text-warning",
  },
  {
    label:     "Accepted",
    count:     sb?.accepted.amount ?? "—",
    subText:   sb?.accepted.count !== undefined ? `${sb.accepted.count} orders` : null,
    icon:      TrendingUp,
    iconBg:    "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
  {
    label:     "Completed",
    count:     sb?.completed.amount !== undefined ? `₹${sb.completed.amount.toLocaleString()}` : "—",
    subText:   sb?.completed.count !== undefined ? `${sb.completed.count} orders` : null,
    icon:      CheckCircle,
    iconBg:    "bg-success/10",
    iconColor: "text-success",
  },
  {
    label:     "Rejected",
    count:     sb?.rejected.amount !== undefined ? `₹${sb.rejected.amount.toLocaleString()}` : "—",
    subText:   sb?.rejected.count !== undefined ? `${sb.rejected.count} orders` : null,
    icon:      XCircle,
    iconBg:    "bg-destructive/10",
    iconColor: "text-destructive",
  },
];

  // ── Accept / Reject ───────────────────────────────────────────────────────
  const handleAction = async (po_id: string, action: "accept" | "reject") => {
    setActioning(po_id);
    try {
      const res = await fetch(`${BASE_URL}/change-status-by-finance-for-po`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          po_id,
          finance_user_id: getFinanceUserId(),
          action,
        }),
      });
      if (!res.ok) throw new Error();
      toast({
        title: action === "accept" ? "PO Accepted" : "PO Rejected",
        description: `Purchase order has been ${action === "accept" ? "completed" : "rejected"}.`,
        variant: action === "reject" ? "destructive" : "default",
      });
      await Promise.all([fetchOrders(), fetchDashboard()]);
    } catch {
      toast({
        title: "Error",
        description: `Failed to ${action} the PO.`,
        variant: "destructive",
      });
    } finally {
      setActioning(null);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    await Promise.all([fetchOrders(), fetchDashboard(), fetchVendors()]);
    setLoading(false);
  };

  const filteredOrders = orders.filter((order) => {
  const matchesSearch =
    (order.po_id || "").toLowerCase().includes(search.toLowerCase()) ||
    (order.vendor_name || "").toLowerCase().includes(search.toLowerCase());

  const matchesStatus =
    statusFilter === "all" || order.status === statusFilter;

  return matchesSearch && matchesStatus;
});

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-fade-in pb-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Purchase Orders</h1>
          <p className="text-muted-foreground text-sm">
            Manage purchase orders — review vendor quotes and approve.
          </p>
        </div>
        <div className="grid grid-cols-2 md:flex gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm" className="h-11 sm:h-9 rounded-xl sm:rounded-lg" onClick={() => { hapticImpactLight(); handleRefresh(); }} disabled={loading}>
            <RefreshCw className={`h-3.5 w-3.5 mr-1 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={() => { hapticImpactLight(); setCreateOpen(true); }} className="flex items-center gap-2 h-11 sm:h-9 rounded-xl sm:rounded-lg">
            <Plus className="h-4 w-4" /> Create PO
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {kpiCards.map((k, i) => (
          <KPICard key={k.label} {...k} delay={i * 0.06} />
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by PO ID or vendor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-xl px-9 py-2.5 text-sm w-full bg-background focus:outline-none focus:ring-1 focus:ring-ring h-11 sm:h-9 sm:rounded-lg"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring h-11 sm:h-9 sm:rounded-lg w-full appearance-none pr-10"
          >
            <option value="all">All Statuses</option>
            <option value="created">Awaiting Vendor</option>
            <option value="accepted">Quote Received</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Orders - Card based on mobile, table on desktop */}
      <div>
        {loading ? (
          <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground text-sm">
            <RefreshCw className="h-4 w-4 animate-spin" /> Loading orders...
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Card>
                <CardContent className="pt-5">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-muted-foreground">
                          <th className="text-left py-2 font-medium">PO ID</th>
                          <th className="text-left py-2 font-medium">Vendor</th>
                          <th className="text-left py-2 font-medium">Date</th>
                          <th className="text-right py-2 pr-4 font-medium">Quote Total</th>
                          <th className="text-left py-2 font-medium">Status</th>
                          <th className="text-left py-2 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => (
                          <tr key={order.po_id} className="border-b hover:bg-muted/50 transition-colors">
                            <td className="py-3 font-mono text-xs font-medium text-muted-foreground">
                              {order.po_id.slice(0, 20)}...
                            </td>
                            <td className="py-3 font-medium">{order.vendor_name}</td>
                            <td className="py-3 text-muted-foreground text-xs">
                              {new Date(order.created_at).toLocaleDateString("en-IN", {
                                day: "2-digit", month: "short", year: "numeric",
                              })}
                            </td>
                            <td className="py-3 text-right pr-4 font-mono">
                              {order.total_po_amount > 0 ? (
                                `₹${order.total_po_amount.toLocaleString()}`
                              ) : (
                                <span className="text-muted-foreground text-xs">Awaiting</span>
                              )}
                            </td>
                            <td className="py-3">
                              <Badge
                                variant="outline"
                                className={statusConfig[order.status]?.className}
                              >
                                {statusConfig[order.status]?.label ?? order.status}
                              </Badge>
                            </td>
                            <td className="py-3">
                              <div className="flex items-center gap-1.5">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs h-7 px-2"
                                  onClick={() => { hapticImpactLight(); setPreview(order); setPreviewOpen(true); }}
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                                {order.status === "accepted" && (
                                  <>
                                    <Button
                                      size="sm"
                                      className="text-xs h-7 px-2 bg-success hover:bg-success/90 text-white"
                                      disabled={actioning === order.po_id}
                                      onClick={() => handleAction(order.po_id, "accept")}
                                    >
                                      <Check className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      className="text-xs h-7 px-2"
                                      disabled={actioning === order.po_id}
                                      onClick={() => handleAction(order.po_id, "reject")}
                                    >
                                      <X className="h-3.5 w-3.5" />
                                    </Button>
                                  </>
                                )}
                              </div>
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
              {filteredOrders.map((order) => (
                <Card key={order.po_id} className="overflow-hidden border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs font-mono text-muted-foreground mb-1">
                          #{order.po_id.slice(-8).toUpperCase()}
                        </p>
                        <h3 className="font-bold text-slate-900">{order.vendor_name}</h3>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn("text-[10px] font-bold uppercase tracking-tight", statusConfig[order.status]?.className)}
                      >
                        {statusConfig[order.status]?.label ?? order.status}
                      </Badge>
                    </div>

                    <div className="flex items-end justify-between">
                      <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric",
                          })}
                        </p>
                        <p className="text-lg font-black text-slate-900">
                          {order.total_po_amount > 0 ? (
                            `₹${order.total_po_amount.toLocaleString()}`
                          ) : (
                            <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">Awaiting Quote</span>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-10 w-10 p-0 rounded-xl"
                          onClick={() => { hapticImpactLight(); setPreview(order); setPreviewOpen(true); }}
                        >
                          <Eye className="h-5 w-5" />
                        </Button>
                        {order.status === "accepted" && (
                          <div className="flex gap-2">
                             <Button
                              size="sm"
                              className="h-10 w-10 p-0 rounded-xl bg-success hover:bg-success/90 text-white shadow-md shadow-success/10"
                              disabled={actioning === order.po_id}
                              onClick={() => { hapticImpactLight(); handleAction(order.po_id, "accept"); }}
                            >
                              <Check className="h-5 w-5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-10 w-10 p-0 rounded-xl shadow-md shadow-destructive/10"
                              disabled={actioning === order.po_id}
                              onClick={() => { hapticImpactLight(); handleAction(order.po_id, "reject"); }}
                            >
                              <X className="h-5 w-5" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredOrders.length === 0 && (
              <div className="py-20 text-center bg-white border rounded-2xl">
                <ShoppingCart className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                  No purchase orders found
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create PO Modal */}
      <CreatePurchaseOrderModal
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          fetchOrders();
          fetchDashboard();
        }}
        vendors={vendors}
      />

      {/* Items Preview Modal */}
      <ItemsModal
        order={previewOrder}
        open={previewOpen}
        onClose={() => { setPreviewOpen(false); setPreview(null); }}
      />
    </div>
  );
}