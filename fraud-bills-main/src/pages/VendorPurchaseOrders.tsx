import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart, Clock, CheckCircle, RefreshCw,
  Eye, Send, TrendingUp, Hourglass, DollarSign,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config";

const BASE_URL = API_BASE_URL;

// ─── Types ────────────────────────────────────────────────────────────────────
interface POItem {
  item: string;
  quantity: number;
  specification?: string;
  category?: string;
  purpose?: string;
  description?: string;
  unit_price?: number;
  total_price?: number;
}

interface PurchaseOrder {
  po_id: string;
  status: "created" | "accepted" | "completed" | "rejected";
  created_at: string;
  accepted_at: string | null;
  completed_at: string | null;
  total_po_amount: number;
  items: POItem[];
}

interface DashboardPipeline {
  pending_vendor_response: number;
  pending_finance_review: number;
  pipeline_amount: number;
}

// ─── Status config ────────────────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; className: string }> = {
  created:   { label: "New Order",  className: "bg-warning/10 text-warning border-warning/20" },
  accepted:  { label: "Quote Sent", className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  completed: { label: "Completed",  className: "bg-success/10 text-success border-success/20" },
  rejected:  { label: "Rejected",   className: "bg-destructive/10 text-destructive border-destructive/20" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getVendorId(): string {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return "";
    const parsed = JSON.parse(raw);
    return parsed?.user_id ?? "";
  } catch { return ""; }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(n);
}

// ─── View Items Modal ─────────────────────────────────────────────────────────
function ViewItemsModal({
  order, open, onClose,
}: { order: PurchaseOrder | null; open: boolean; onClose: () => void }) {
  if (!order) return null;
  const hasPrice = order.items.some((i) => i.unit_price !== undefined);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-sm font-mono">{order.po_id}</DialogTitle>
        </DialogHeader>
        <div className="mt-2 border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b text-muted-foreground">
                <th className="text-left py-2 px-3 font-medium">Item</th>
                <th className="text-left py-2 px-3 font-medium">Details</th>
                <th className="text-center py-2 px-2 font-medium">Qty</th>
                {hasPrice && <th className="text-right py-2 px-3 font-medium">Unit Price</th>}
                {hasPrice && <th className="text-right py-2 px-3 font-medium">Total</th>}
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-2 px-3 font-medium">{item.item}</td>
                  <td className="py-2 px-3 text-muted-foreground text-xs">
                    {item.specification ?? item.description ?? "—"}
                    {item.category && (
                      <span className="ml-1 text-muted-foreground/60">· {item.category}</span>
                    )}
                  </td>
                  <td className="py-2 px-2 text-center">{item.quantity}</td>
                  {hasPrice && (
                    <td className="py-2 px-3 text-right">
                      {item.unit_price !== undefined ? formatCurrency(item.unit_price) : "—"}
                    </td>
                  )}
                  {hasPrice && (
                    <td className="py-2 px-3 text-right font-medium">
                      {item.total_price !== undefined ? formatCurrency(item.total_price) : "—"}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            {hasPrice && order.total_po_amount > 0 && (
              <tfoot>
                <tr className="bg-muted/30 border-t">
                  <td colSpan={hasPrice ? 4 : 3} className="py-2 px-3 text-right font-semibold text-sm">
                    Grand Total
                  </td>
                  <td className="py-2 px-3 text-right font-bold">
                    {formatCurrency(order.total_po_amount)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Submit Quote Modal ───────────────────────────────────────────────────────
function SubmitQuoteModal({
  order, open, onClose, onSuccess,
}: {
  order: PurchaseOrder | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (order) {
      const init: Record<string, string> = {};
      order.items.forEach((item) => { init[item.item] = ""; });
      setPrices(init);
    }
  }, [order]);

  if (!order) return null;

  const grandTotal = order.items.reduce((sum, item) => {
    const p = parseFloat(prices[item.item] || "0");
    return sum + (isNaN(p) ? 0 : p * item.quantity);
  }, 0);

  const allFilled = order.items.every((item) => {
    const v = prices[item.item];
    return v && !isNaN(parseFloat(v)) && parseFloat(v) > 0;
  });

  async function handleSubmit() {
    if (!order) return;
    setSubmitting(true);
    try {
      const vendorId = getVendorId();
      const payload = {
        po_id: order.po_id,
        vendor_id: vendorId,
        items: order.items.map((item) => ({
          item: item.item,
          unit_price: parseFloat(prices[item.item]),
        })),
      };

      const res = await fetch(`${BASE_URL}/accept-po-by-vendor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed");
      const data = await res.json();

      toast({
        title: "Quote Submitted Successfully!",
        description: `Grand total: ${formatCurrency(data.grand_total ?? grandTotal)}`,
      });
      onClose();
      onSuccess();
    } catch {
      toast({
        title: "Error",
        description: "Failed to submit quote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Submit Quote</DialogTitle>
          <p className="text-xs text-muted-foreground font-mono">{order.po_id}</p>
        </DialogHeader>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b text-muted-foreground">
                <th className="text-left py-2 px-3 font-medium">Item</th>
                <th className="text-center py-2 px-2 font-medium">Qty</th>
                <th className="text-right py-2 px-3 font-medium">Unit Price (₹)</th>
                <th className="text-right py-2 px-3 font-medium">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => {
                const price = parseFloat(prices[item.item] || "0");
                const subtotal = isNaN(price) ? 0 : price * item.quantity;
                return (
                  <tr key={item.item} className="border-b last:border-0">
                    <td className="py-2 px-3 font-medium">
                      {item.item}
                      {item.specification && (
                        <p className="text-xs text-muted-foreground font-normal">{item.specification}</p>
                      )}
                    </td>
                    <td className="py-2 px-2 text-center">{item.quantity}</td>
                    <td className="py-2 px-3">
                      <Input
                        type="number"
                        min={0}
                        placeholder="0"
                        className="h-7 text-right text-xs w-28 ml-auto"
                        value={prices[item.item] ?? ""}
                        onChange={(e) =>
                          setPrices((p) => ({ ...p, [item.item]: e.target.value }))
                        }
                      />
                    </td>
                    <td className="py-2 px-3 text-right text-muted-foreground text-xs">
                      {subtotal > 0 ? formatCurrency(subtotal) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-muted/30 border-t">
                <td colSpan={3} className="py-2 px-3 text-right font-semibold text-sm">
                  Grand Total
                </td>
                <td className="py-2 px-3 text-right font-bold text-sm">
                  {grandTotal > 0 ? formatCurrency(grandTotal) : "—"}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!allFilled || submitting}>
            <Send className="h-3.5 w-3.5 mr-1.5" />
            {submitting ? "Submitting..." : "Submit Quote"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function VendorPurchaseOrders() {
  const { toast } = useToast();
  const [orders,     setOrders]     = useState<PurchaseOrder[]>([]);
  const [pipeline,   setPipeline]   = useState<DashboardPipeline | null>(null);
  const [loading,    setLoading]    = useState(true);

  const [viewOrder,  setViewOrder]  = useState<PurchaseOrder | null>(null);
  const [viewOpen,   setViewOpen]   = useState(false);
  const [quoteOrder, setQuoteOrder] = useState<PurchaseOrder | null>(null);
  const [quoteOpen,  setQuoteOpen]  = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const vendorId = getVendorId();
      const res  = await fetch(`${BASE_URL}/list-po-for-vendor/${vendorId}`);
      const data = await res.json();
      setOrders(data.purchase_orders ?? []);
    } catch {
      toast({ title: "Error", description: "Failed to load orders.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchDashboard = useCallback(async () => {
    try {
      const res  = await fetch(`${BASE_URL}/dashboard-po`);
      const data = await res.json();
      setPipeline(data.pipeline ?? null);
    } catch {
      // non-critical, silently ignore
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchDashboard();
  }, [fetchOrders, fetchDashboard]);

  function refresh() {
    fetchOrders();
    fetchDashboard();
  }

  // ── KPI data ───────────────────────────────────────────────────────────────
  const orderKpis = [
    { label: "Total Orders", value: orders.length,                                         icon: ShoppingCart, color: "text-primary"  },
    { label: "New Orders",   value: orders.filter((o) => o.status === "created").length,   icon: Clock,        color: "text-warning"  },
    { label: "Quote Sent",   value: orders.filter((o) => o.status === "accepted").length,  icon: Send,         color: "text-blue-500" },
    { label: "Completed",    value: orders.filter((o) => o.status === "completed").length, icon: CheckCircle,  color: "text-success"  },
  ];

  const pipelineKpis = [
  { label: "Pending Vendor Response", value: pipeline?.pending_vendor_response ?? "—", icon: Hourglass,  color: "text-orange-500"  },
  { label: "Pending Finance Review",  value: pipeline?.pending_finance_review  ?? "—", icon: TrendingUp, color: "text-purple-500"  },
  { label: "Pipeline Amount",         value: pipeline ? formatCurrency(pipeline.pipeline_amount) : "—", icon: DollarSign, color: "text-emerald-500" },
];

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quotation Requests</h1>
          <p className="text-muted-foreground text-sm">
            Orders placed by the finance team — review items and submit your quote.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={refresh}>
          <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh
        </Button>
      </div>

      

      {/* Pipeline KPIs */}
      {(
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {pipelineKpis.map((k, i) => (
              <motion.div
                key={k.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
              >
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg bg-secondary flex items-center justify-center ${k.color}`}>
                      <k.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{k.value}</p>
                      <p className="text-xs text-muted-foreground">{k.label}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Table */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex items-center justify-center py-10 gap-2 text-muted-foreground text-sm">
              <RefreshCw className="h-4 w-4 animate-spin" /> Loading orders...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-2 font-medium">PO ID</th>
                    <th className="text-left py-2 font-medium">Date</th>
                    <th className="text-left py-2 font-medium">Status</th>
                    <th className="text-left py-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.po_id} className="border-b hover:bg-muted/50">

                      {/* PO ID — full */}
                      <td className="py-3 font-mono text-xs font-medium">{order.po_id}</td>

                      {/* Date */}
                      <td className="py-3 text-muted-foreground text-xs whitespace-nowrap">
                        {formatDate(order.created_at)}
                      </td>

                      {/* Status */}
                      <td className="py-3">
                        <Badge
                          variant="outline"
                          className={statusConfig[order.status]?.className}
                        >
                          {statusConfig[order.status]?.label ?? order.status}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="py-3">
                        <div className="flex items-center gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-7 px-2"
                            onClick={() => { setViewOrder(order); setViewOpen(true); }}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" /> View Items
                          </Button>

                          {order.status === "created" && (
                            <Button
                              size="sm"
                              className="text-xs h-7 px-2"
                              onClick={() => { setQuoteOrder(order); setQuoteOpen(true); }}
                            >
                              <Send className="h-3.5 w-3.5 mr-1" /> Submit Quote
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-10 text-center text-muted-foreground text-sm">
                        No orders assigned to you yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Items Modal */}
      <ViewItemsModal
        order={viewOrder}
        open={viewOpen}
        onClose={() => { setViewOpen(false); setViewOrder(null); }}
      />

      {/* Submit Quote Modal */}
      <SubmitQuoteModal
        order={quoteOrder}
        open={quoteOpen}
        onClose={() => { setQuoteOpen(false); setQuoteOrder(null); }}
        onSuccess={refresh}
      />
    </div>
  );
}