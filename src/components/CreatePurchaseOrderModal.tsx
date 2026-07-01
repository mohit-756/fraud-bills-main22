import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, X, Search, Plus, Trash2, Pencil, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config";

const BASE_URL = API_BASE_URL;

function getFinanceUserId(): string {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return "";
    const parsed = JSON.parse(raw);
    return parsed?.user_id ?? "";
  } catch {
    return "";
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface POItem {
  item: string;
  description: string;
  quantity: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  vendors?: { vendor_id: string; vendor_name: string; email: string }[];
}

type Step = "upload" | "preview";

const blankItem = (): POItem => ({ item: "", description: "", quantity: 1 });

// ─── Component ────────────────────────────────────────────────────────────────
export default function CreatePurchaseOrderModal({ open, onClose, vendors = [] }: Props) {
  const { toast } = useToast();

  // Step 1 state
  const [vendorId, setVendorId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [vendorSearch, setVendorSearch] = useState("");
  const [previewing, setPreviewing] = useState(false);

  // Step 2 state
  const [step, setStep] = useState<Step>("upload");
  const [poId, setPoId] = useState<string>("");
  const [items, setItems] = useState<POItem[]>([]);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<POItem>(blankItem());
  const [saving, setSaving] = useState(false);
  const [poCreated, setPoCreated] = useState(false);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalVendorId, setOriginalVendorId] = useState("");
  const [originalItems, setOriginalItems] = useState<POItem[]>([]);

  // ── Vendor helpers ────────────────────────────────────────────────────────
  const filteredVendors = vendors.filter(
    (v) =>
      (v.vendor_name || "").toLowerCase().includes(vendorSearch.toLowerCase()) ||
      (v.email || "").toLowerCase().includes(vendorSearch.toLowerCase())
  );
  const selectedVendor = vendors.find((v) => v.vendor_id === vendorId);

  // ── File validation ───────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(selected.type)) {
      toast({
        title: "Invalid file",
        description: "Only PDF, JPG, or PNG allowed.",
        variant: "destructive",
      });
      return;
    }
    setFile(selected);
  };

  // ── Step 1 → Step 2: call POST /create-po, get po_id + parsed items ───────
  const handlePreview = async () => {
    if (!vendorId) {
      toast({ title: "Missing vendor", description: "Please select a vendor.", variant: "destructive" });
      return;
    }
    if (!file) {
      toast({ title: "Missing file", description: "Please upload a PDF or image.", variant: "destructive" });
      return;
    }

    // If PO already created and nothing changed, just go to preview
    if (poCreated && file === originalFile && vendorId === originalVendorId) {
      setStep("preview");
      return;
    }

    setPreviewing(true);
    try {
      const formData = new FormData();
      formData.append("finance_user_id", getFinanceUserId());
      formData.append("user_id", vendorId);
      formData.append("file", file);

      const res = await fetch(`${BASE_URL}/create-po`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to create PO");

      const data = await res.json();

      // Store the po_id and the parsed items from backend
      setPoId(data.po_id);
      const parsedItems = (data.items ?? []).map((i: POItem) => ({
        item: i.item ?? "",
        description: i.description ?? "",
        quantity: i.quantity ?? 1,
      }));
      setItems(parsedItems);
      setOriginalItems(parsedItems); // ← save original
      setPoCreated(true);           // ← add this
      setOriginalFile(file);        // ← add this
      setOriginalVendorId(vendorId);
      setStep("preview");
    } catch {
      toast({
        title: "Error",
        description: "Failed to process the document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPreviewing(false);
    }
  };

  // ── Inline edit helpers ───────────────────────────────────────────────────
  const startEdit = (idx: number) => {
    setEditingIdx(idx);
    setEditDraft({ ...items[idx] });
  };

  const commitEdit = () => {
    if (editingIdx === null) return;
    const updated = [...items];
    updated[editingIdx] = { ...editDraft };
    setItems(updated);
    setEditingIdx(null);
  };

  const cancelEdit = () => setEditingIdx(null);

  const deleteItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
    if (editingIdx === idx) setEditingIdx(null);
  };

  const addItem = () => {
    const newIdx = items.length;
    setItems((prev) => [...prev, blankItem()]);
    setEditingIdx(newIdx);
    setEditDraft(blankItem());
  };

  const updateDraft = (field: keyof POItem, value: string | number) => {
    setEditDraft((prev) => ({ ...prev, [field]: value }));
  };

  // ── Step 2: Save & Close → PUT /update-po-items ───────────────────────────
  const handleSaveAndClose = async () => {

    const finalItems = editingIdx !== null
      ? items.map((item, i) => i === editingIdx ? { ...editDraft } : item)
      : items;

    const validItems = finalItems.filter((i) => i.item.trim() !== "");

    // Check empty first
    if (validItems.length === 0) {
      toast({
        title: "No items",
        description: "Add at least one item before saving.",
        variant: "destructive",
      });
      return;
    }

    // Then check if anything changed
    const hasChanged = JSON.stringify(validItems) !== JSON.stringify(originalItems);
    if (!hasChanged) {
      handleClose();
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${BASE_URL}/update-po-items`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          po_id: poId,
          finance_user_id: getFinanceUserId(),
          items: validItems,
        }),
      });

      if (!res.ok) throw new Error("Failed to update items");

      toast({
        title: "Purchase Order Saved",
        description: `PO saved with ${validItems.length} item${validItems.length !== 1 ? "s" : ""}.`,
      });
      handleClose();
    } catch {
      toast({
        title: "Error",
        description: "Failed to save items. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // ── Reset & close ─────────────────────────────────────────────────────────
  const handleClose = () => {
    setVendorId("");
    setFile(null);
    setVendorSearch("");
    setStep("upload");
    setPoId("");
    setItems([]);
    setEditingIdx(null);
    setEditDraft(blankItem());
    setPoCreated(false);
    setOriginalFile(null);
    setOriginalVendorId("");
    setOriginalItems([]);
    onClose();
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={step === "preview" ? "max-w-3xl w-full" : "max-w-lg w-full"}>

        {/* ── STEP 1: Select Vendor + Upload ──────────────────────────────── */}
        {step === "upload" && (
          <>
            <DialogHeader>
              <DialogTitle>Create Purchase Order</DialogTitle>
            </DialogHeader>

            <div className="space-y-5 mt-2">
              {/* Vendor Select with Search */}
              <div className="space-y-1.5">
                <Label>Vendor Name</Label>
                <Select
                  value={vendorId}
                  onValueChange={(val) => {
                    setVendorId(val);
                    setVendorSearch("");
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a vendor...">
                      {selectedVendor
                        ? `${selectedVendor.vendor_name} (${selectedVendor.email})`
                        : "Select a vendor..."}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <div className="flex items-center gap-2 px-2 py-1.5 border-b">
                      <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <input
                        className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                        placeholder="Search vendor..."
                        value={vendorSearch}
                        onChange={(e) => setVendorSearch(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                    </div>
                    {filteredVendors.length === 0 ? (
                      <div className="py-4 text-center text-xs text-muted-foreground">
                        No vendors found
                      </div>
                    ) : (
                      filteredVendors.map((v) => (
                        <SelectItem key={v.vendor_id} value={v.vendor_id}>
                          <span className="font-medium">{v.vendor_name}</span>
                          <span className="text-muted-foreground ml-1.5 text-xs">
                            ({v.email})
                          </span>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* File Upload */}
              <div className="space-y-1.5">
                <Label>Upload Document</Label>
                {!file ? (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload PDF or Image
                    </span>
                    <span className="text-xs text-muted-foreground mt-0.5">
                      PDF, JPG, PNG supported
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </label>
                ) : (
                  <div className="flex items-center justify-between border rounded-lg px-4 py-3 bg-muted/30">
                    <span className="text-sm font-medium truncate max-w-[280px]">
                      {file.name}
                    </span>
                    <button
                      onClick={() => setFile(null)}
                      className="text-muted-foreground hover:text-destructive ml-2"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-1">
                <Button variant="outline" onClick={handleClose} disabled={previewing}>
                  Cancel
                </Button>
                <Button
                  onClick={handlePreview}
                  disabled={previewing || !vendorId || !file}
                >
                  {previewing ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Preview"
                  )}
                </Button>
              </div>
            </div>
          </>
        )}

        {/* ── STEP 2: Preview & Edit Items ────────────────────────────────── */}
        {step === "preview" && (
          <>
            <DialogHeader>
              <div className="flex items-start justify-between pr-6">
                <div>
                  <DialogTitle>Preview & Edit Items</DialogTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    PO created — review the extracted items below and make any changes.
                  </p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    {selectedVendor?.vendor_name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {file?.name}
                  </p>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              {/* Items Table */}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b text-muted-foreground">
                      <th className="text-left py-2.5 px-3 font-medium">#</th>
                      <th className="text-left py-2.5 px-3 font-medium">Item</th>
                      <th className="text-left py-2.5 px-3 font-medium">Description</th>
                      <th className="text-center py-2.5 px-3 font-medium w-20">Qty</th>
                      <th className="py-2.5 px-3 w-20 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr
                        key={idx}
                        className={`border-b last:border-0 align-middle transition-colors ${editingIdx === idx ? "bg-muted/30" : "hover:bg-muted/20"
                          }`}
                      >
                        {editingIdx === idx ? (
                          // ── Inline edit row ────────────────────────────
                          <>
                            <td className="py-2 px-3 text-muted-foreground text-xs">{idx + 1}</td>
                            <td className="py-2 px-2">
                              <Input
                                className="h-8 text-sm"
                                value={editDraft.item}
                                placeholder="Item name"
                                onChange={(e) => updateDraft("item", e.target.value)}
                                autoFocus
                              />
                            </td>
                            <td className="py-2 px-2">
                              <Input
                                className="h-8 text-sm"
                                value={editDraft.description}
                                placeholder="Description"
                                onChange={(e) => updateDraft("description", e.target.value)}
                              />
                            </td>
                            <td className="py-2 px-2">
                              <Input
                                className="h-8 text-sm text-center"
                                type="number"
                                min={1}
                                value={editDraft.quantity}
                                onChange={(e) =>
                                  updateDraft("quantity", Math.max(1, Number(e.target.value)))
                                }
                              />
                            </td>
                            <td className="py-2 px-3">
                              <div className="flex gap-1.5 justify-end">
                                <button
                                  onClick={commitEdit}
                                  className="h-7 w-7 flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:opacity-90"
                                  title="Save"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="h-7 w-7 flex items-center justify-center rounded-md border hover:bg-muted text-muted-foreground"
                                  title="Cancel"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          // ── Read-only row ──────────────────────────────
                          <>
                            <td className="py-2.5 px-3 text-muted-foreground text-xs">
                              {idx + 1}
                            </td>
                            <td className="py-2.5 px-3 font-medium">
                              {item.item || (
                                <span className="text-muted-foreground italic text-xs">—</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-muted-foreground text-xs">
                              {item.description || "—"}
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono text-sm">
                              {item.quantity}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex gap-1.5 justify-end">
                                <button
                                  onClick={() => startEdit(idx)}
                                  className="h-7 w-7 flex items-center justify-center rounded-md border hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                                  title="Edit"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => deleteItem(idx)}
                                  className="h-7 w-7 flex items-center justify-center rounded-md border hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}

                    {items.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-8 text-center text-sm text-muted-foreground"
                        >
                          No items extracted. Click "+ Add Item" to add manually.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Add Item */}
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1.5"
                onClick={addItem}
                disabled={saving}
              >
                <Plus className="h-3.5 w-3.5" /> Add Item
              </Button>

              {/* Footer actions */}
              <div className="flex items-center justify-between pt-1 border-t">
                <p className="text-xs text-muted-foreground">
                  {items.length} item{items.length !== 1 ? "s" : ""}
                  {poId && (
                    <span className="ml-2 font-mono opacity-60">· {poId.slice(0, 24)}...</span>
                  )}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStep("upload")}
                    disabled={saving}
                  >
                    ← Back
                  </Button>
                  <Button onClick={handleSaveAndClose} disabled={saving}>
                    {saving ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      "Save & Close"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}