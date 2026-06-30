// import React, { useState, useMemo, useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Search, FileText, AlertCircle, CheckCircle2, Plus, Users, Trash2 } from "lucide-react";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { mockAREntries, type AREntry } from "@/data/mockData";
// import { format, parseISO } from "date-fns";
// import { useToast } from "@/hooks/use-toast";
 
// const API_BASE = "https://d2ontk4ewdype3.cloudfront.net";
 
// const statusConfig: Record<AREntry["status"], { label: string; className: string }> = {
//   invoiced: { label: "Invoiced", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
//   approved: { label: "Client Approved", className: "bg-warning/10 text-warning border-warning/20" },
//   received: { label: "Received", className: "bg-success/10 text-success border-success/20" },
//   overdue: { label: "Overdue", className: "bg-destructive/10 text-destructive border-destructive/20" },
// };
 
// interface Client {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   address: string;
// }
 
// const employeeList = [
//   "Ravi Kumar",
//   "Priya Sharma",
//   "Anil Mehta",
//   "Sneha Iyer",
//   "Vikram Singh",
//   "Pooja Reddy",
// ];
 
// export default function AccountsReceivablePage() {
//   const { toast } = useToast();
//   const [entries, setEntries] = useState<AREntry[]>(mockAREntries);
//   const [clients, setClients] = useState<Client[]>([]);
//   const [clientsLoading, setClientsLoading] = useState(false);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [typeFilter, setTypeFilter] = useState("all");
//   const [createOpen, setCreateOpen] = useState(false);
//   const [manageOpen, setManageOpen] = useState(false);
//   const [addClientOpen, setAddClientOpen] = useState(false);
//   const [newClient, setNewClient] = useState({ name: "", email: "", phone: "", address: "" });
 
//   const [form, setForm] = useState({
//     partyType: "client" as "client" | "vendor",
//     clientName: "",
//     clientId: "",
//     employees: [] as string[],
//     vendorName: "",
//     reason: "",
//     amount: "",
//     dueDate: "",
//   });
 
//   // Fetch clients from backend
//   const fetchClients = async () => {
//     setClientsLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/list-clients`);
//       const data = await res.json();
//       const mapped: Client[] = data.map((c: any) => ({
//         id: c.client_id ?? c.id ?? c.client_name,
//         name: c.client_name,
//         email: c.email ?? "",
//         phone: c.phone ?? "",
//         address: c.address ?? "",
//       }));
//       setClients(mapped);
//     } catch {
//       toast({ title: "Error", description: "Failed to load clients.", variant: "destructive" });
//     } finally {
//       setClientsLoading(false);
//     }
//   };
 
//   // Fetch clients on mount so Create AR Entry dropdown is always populated
//   useEffect(() => {
//     fetchClients();
//   }, []);
 
//   const resetForm = () =>
//     setForm({ partyType: "client", clientName: "", clientId: "", employees: [], vendorName: "", reason: "", amount: "", dueDate: "" });
 
//   const filtered = useMemo(() => {
//     return entries.filter((e) => {
//       const matchesSearch =
//         e.party.toLowerCase().includes(search.toLowerCase()) ||
//         e.invoiceNumber.toLowerCase().includes(search.toLowerCase());
//       const matchesStatus = statusFilter === "all" || e.status === statusFilter;
//       const matchesType = typeFilter === "all" || e.partyType === typeFilter;
//       return matchesSearch && matchesStatus && matchesType;
//     });
//   }, [entries, search, statusFilter, typeFilter]);
 
//   const totals = useMemo(() => {
//     const outstanding = entries.filter((e) => e.status !== "received").reduce((s, e) => s + e.amount, 0);
//     const overdue = entries.filter((e) => e.status === "overdue").reduce((s, e) => s + e.amount, 0);
//     const collected = entries.filter((e) => e.status === "received").reduce((s, e) => s + e.amount, 0);
//     return { outstanding, overdue, collected, count: entries.length };
//   }, [entries]);
 
//   const updateStatus = (id: string, status: AREntry["status"]) => {
//     setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
//     if (status === "approved") {
//       toast({ title: "Client approved", description: "Reimbursement request pushed to Payroll flow." });
//     } else if (status === "received") {
//       toast({ title: "Payment received", description: "AR entry marked as settled." });
//     }
//   };
 
//   const toggleEmployee = (name: string) => {
//     setForm((f) =>
//       f.employees.includes(name)
//         ? { ...f, employees: f.employees.filter((e) => e !== name) }
//         : { ...f, employees: [...f.employees, name] }
//     );
//   };
 
//   const createEntry = async () => {
//     if (form.partyType === "client") {
//       if (!form.clientName || form.employees.length === 0 || !form.reason || !form.amount || !form.dueDate) {
//         toast({ title: "Missing fields", description: "Client, employee, reason, amount and due date are required.", variant: "destructive" });
//         return;
//       }
//     } else {
//       if (!form.vendorName || !form.reason || !form.amount || !form.dueDate) {
//         toast({ title: "Missing fields", description: "Vendor, reason, amount and due date are required.", variant: "destructive" });
//         return;
//       }
//     }
 
//     const isClient = form.partyType === "client";
//     const today = new Date().toISOString().slice(0, 10);
 
//     const payload = {
//       party: isClient ? form.clientName : form.vendorName,
//       party_type: form.partyType,
//       reason: isClient
//         ? `${form.reason} — ${form.employees.join(", ")}`
//         : form.reason,
//       amount: Number(form.amount),
//       issued_date: today,
//       due_date: form.dueDate,
//       ...(isClient && { client_id: form.clientId, employees: form.employees }),
//     };
 
//     try {
//       const res = await fetch(`${API_BASE}/create-ar-entry`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
 
//       if (!res.ok) throw new Error();
//       const created = await res.json();
 
//       // Also update local state so table reflects immediately
//       const newEntry: AREntry = {
//         id: created.id ?? created.ar_id ?? `ar${Date.now()}`,
//         invoiceNumber: created.invoice_number ?? `AR-2026-${String(entries.length + 1).padStart(3, "0")}`,
//         party: payload.party,
//         partyType: form.partyType,
//         reason: payload.reason,
//         amount: Number(form.amount),
//         issuedDate: today,
//         dueDate: form.dueDate,
//         status: "invoiced",
//       };
//       setEntries((prev) => [newEntry, ...prev]);
//       resetForm();
//       setCreateOpen(false);
//       toast({ title: "AR entry created", description: `Invoice ${newEntry.invoiceNumber} generated.` });
//     } catch {
//       // Fallback: still create locally if API fails
//       const newEntry: AREntry = {
//         id: `ar${Date.now()}`,
//         invoiceNumber: `AR-2026-${String(entries.length + 1).padStart(3, "0")}`,
//         party: isClient ? form.clientName : form.vendorName,
//         partyType: form.partyType,
//         reason: isClient ? `${form.reason} — ${form.employees.join(", ")}` : form.reason,
//         amount: Number(form.amount),
//         issuedDate: today,
//         dueDate: form.dueDate,
//         status: "invoiced",
//       };
//       setEntries((prev) => [newEntry, ...prev]);
//       resetForm();
//       setCreateOpen(false);
//       toast({ title: "AR entry created (offline)", description: `Invoice ${newEntry.invoiceNumber} generated.` });
//     }
//   };
 
//   const addClient = async () => {
//     const name = newClient.name.trim();
//     if (!name) {
//       toast({ title: "Missing fields", description: "Client name is required.", variant: "destructive" });
//       return;
//     }
//     try {
//       const res = await fetch(`${API_BASE}/add-client`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           client_name: name,
//           email: newClient.email,
//           phone: newClient.phone,
//           address: newClient.address,
//         }),
//       });
//       if (!res.ok) throw new Error();
//       toast({ title: "Client added", description: `${name} added successfully.` });
//       setNewClient({ name: "", email: "", phone: "", address: "" });
//       setAddClientOpen(false);
//       fetchClients();
//     } catch {
//       toast({ title: "Error", description: "Failed to add client.", variant: "destructive" });
//     }
//   };
 
//   const deleteClient = async (id: string) => {
//     const removed = clients.find((c) => c.id === id);
//     try {
//       const res = await fetch(`${API_BASE}/delete-client/${id}`, { method: "DELETE" });
//       if (!res.ok) throw new Error();
//       setClients((c) => c.filter((x) => x.id !== id));
//       if (removed) toast({ title: "Client removed", description: `${removed.name} deleted.` });
//     } catch {
//       toast({ title: "Error", description: "Failed to delete client.", variant: "destructive" });
//     }
//   };
 
//   return (
//     <div className="space-y-6 animate-fade-in">
//       <div className="flex items-start justify-between gap-3 flex-wrap">
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight">Accounts Receivable</h1>
//           <p className="text-muted-foreground text-sm">Invoices billed to clients (employee travel) or vendors (refunds for damaged goods).</p>
//         </div>
//         <div className="flex gap-2">
//           <Button variant="outline" onClick={() => { setManageOpen(true); fetchClients(); }} className="gap-1.5">
//             <Users className="h-4 w-4" /> Manage Clients
//           </Button>
//           <Button onClick={() => setCreateOpen(true)} className="gap-1.5">
//             <Plus className="h-4 w-4" /> Create AR Entry
//           </Button>
//         </div>
//       </div>
 
//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
//         <Card><CardContent className="pt-5 pb-4">
//           <div className="flex items-center gap-2 text-xs text-muted-foreground"><FileText className="h-3.5 w-3.5" /> Total Invoices</div>
//           <p className="text-2xl font-bold mt-1">{totals.count}</p>
//         </CardContent></Card>
//         <Card><CardContent className="pt-5 pb-4">
//           <div className="text-xs text-muted-foreground">Pending Amount</div>
//           <p className="text-2xl font-bold mt-1">₹{totals.outstanding.toLocaleString()}</p>
//         </CardContent></Card>
//         <Card><CardContent className="pt-5 pb-4">
//           <div className="flex items-center gap-2 text-xs text-destructive"><AlertCircle className="h-3.5 w-3.5" /> Overdue</div>
//           <p className="text-2xl font-bold mt-1 text-destructive">₹{totals.overdue.toLocaleString()}</p>
//         </CardContent></Card>
//         <Card><CardContent className="pt-5 pb-4">
//           <div className="flex items-center gap-2 text-xs text-success"><CheckCircle2 className="h-3.5 w-3.5" /> Received Amount</div>
//           <p className="text-2xl font-bold mt-1 text-success">₹{totals.collected.toLocaleString()}</p>
//         </CardContent></Card>
//       </div>
 
//       {/* Filters */}
//       <div className="flex flex-wrap gap-3 items-center">
//         <div className="relative flex-1 min-w-[200px] max-w-sm">
//           <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
//           <Input placeholder="Search by party or invoice..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
//         </div>
//         <Select value={typeFilter} onValueChange={setTypeFilter}>
//           <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Types</SelectItem>
//             <SelectItem value="client">Client</SelectItem>
//             <SelectItem value="vendor">Vendor Refund</SelectItem>
//           </SelectContent>
//         </Select>
//         <Select value={statusFilter} onValueChange={setStatusFilter}>
//           <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Status</SelectItem>
//             <SelectItem value="invoiced">Invoiced</SelectItem>
//             <SelectItem value="approved">Client Approved</SelectItem>
//             <SelectItem value="received">Received</SelectItem>
//             <SelectItem value="overdue">Overdue</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
 
//       {/* Table */}
//       <Card>
//         <CardContent className="pt-6">
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b text-muted-foreground">
//                   <th className="text-left py-2 font-medium">Invoice #</th>
//                   <th className="text-left py-2 font-medium">Party</th>
//                   <th className="text-left py-2 font-medium">Type</th>
//                   <th className="text-left py-2 font-medium">Reason</th>
//                   <th className="text-right py-2 pr-6 font-medium">Amount</th>
//                   <th className="text-left py-2 pl-6 font-medium">Due Date</th>
//                   <th className="text-left py-2 font-medium">Status</th>
//                   <th className="text-left py-2 font-medium">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((e) => (
//                   <tr key={e.id} className="border-b hover:bg-muted/50">
//                     <td className="py-3 font-medium">{e.invoiceNumber}</td>
//                     <td className="py-3">{e.party}</td>
//                     <td className="py-3 text-muted-foreground capitalize">{e.partyType}</td>
//                     <td className="py-3 text-muted-foreground max-w-[220px] truncate" title={e.reason}>{e.reason}</td>
//                     <td className="py-3 text-right pr-6 font-mono">₹{e.amount.toLocaleString()}</td>
//                     <td className="py-3 pl-6 text-muted-foreground">{format(parseISO(e.dueDate), "dd MMM yyyy")}</td>
//                     <td className="py-3"><Badge variant="outline" className={statusConfig[e.status].className}>{statusConfig[e.status].label}</Badge></td>
//                     <td className="py-3">
//                       {e.status === "invoiced" && e.partyType === "client" && (
//                         <Button size="sm" variant="outline" className="text-xs" onClick={() => updateStatus(e.id, "approved")}>Mark Approved</Button>
//                       )}
//                       {e.status === "approved" && (
//                         <Button size="sm" className="text-xs bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => updateStatus(e.id, "received")}>Mark Received</Button>
//                       )}
//                       {e.status === "invoiced" && e.partyType === "vendor" && (
//                         <Button size="sm" className="text-xs bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => updateStatus(e.id, "received")}>Mark Received</Button>
//                       )}
//                       {(e.status === "received" || e.status === "overdue") && <span className="text-xs text-muted-foreground">—</span>}
//                     </td>
//                   </tr>
//                 ))}
//                 {filtered.length === 0 && (
//                   <tr><td colSpan={8} className="py-8 text-center text-muted-foreground text-sm">No AR entries match your filters.</td></tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>
 
//       {/* Create AR Entry Dialog */}
//   <Dialog open={createOpen} onOpenChange={(o) => { setCreateOpen(o); if (!o) resetForm(); }}>
//   <DialogContent className="max-w-lg">
//     <DialogHeader><DialogTitle>Create AR Entry</DialogTitle></DialogHeader>
//     <div className="space-y-4 py-1">
 
//       {/* Type + Client/Vendor Name side by side */}
//       <div className="grid grid-cols-2 gap-3">
//         <div className="space-y-1.5">
//           <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Type</Label>
//           <Select
//             value={form.partyType}
//             onValueChange={(v: "client" | "vendor") =>
//               setForm({ ...form, partyType: v, clientName: "", clientId: "", employees: [], vendorName: "", reason: "" })
//             }
//           >
//             <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
//             <SelectContent>
//               <SelectItem value="client">Client </SelectItem>
//               <SelectItem value="vendor">Vendor (refund / damaged goods)</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
 
//         {form.partyType === "client" ? (
//           <div className="space-y-1.5">
//             <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Client Name</Label>
//             <Select
//               value={form.clientName}
//               onValueChange={(v) => {
//                 const selected = clients.find((c) => c.name === v);
//                 setForm({ ...form, clientName: v, clientId: selected?.id ?? "" });
//               }}
//             >
//               <SelectTrigger className="h-10"><SelectValue placeholder="Select a client" /></SelectTrigger>
//               <SelectContent>
//                 {clientsLoading && <div className="px-3 py-2 text-xs text-muted-foreground">Loading...</div>}
//                 {!clientsLoading && clients.length === 0 && (
//                   <div className="px-3 py-2 text-xs text-muted-foreground">No clients — add via Manage Clients</div>
//                 )}
//                 {clients.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
//               </SelectContent>
//             </Select>
//           </div>
//         ) : (
//           <div className="space-y-1.5">
//             <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Vendor Name</Label>
//             <Input className="h-10" value={form.vendorName} onChange={(e) => setForm({ ...form, vendorName: e.target.value })} placeholder="e.g. Acme Supplies" />
//           </div>
//         )}
//       </div>
 
//       {/* Employees — only for client, with scrollbar */}
//       {form.partyType === "client" && (
//         <div className="space-y-1.5">
//           <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
//             Employee Name(s)
//             {form.employees.length > 0 && (
//               <span className="text-primary ml-1.5 normal-case font-normal">({form.employees.length} selected)</span>
//             )}
//           </Label>
//           <div className="border rounded-lg bg-muted/20 max-h-[160px] overflow-y-auto divide-y">
//             {employeeList.map((emp) => (
//               <label key={emp} className="flex items-center gap-2.5 px-3 py-2.5 text-sm cursor-pointer hover:bg-muted/60 transition-colors">
//                 <Checkbox checked={form.employees.includes(emp)} onCheckedChange={() => toggleEmployee(emp)} />
//                 <span>{emp}</span>
//               </label>
//             ))}
//           </div>
//         </div>
//       )}
 
//       {/* Reason */}
//       <div className="space-y-1.5">
//         <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Reason</Label>
//         <Input
//           className="h-10"
//           value={form.partyType === "client" ? form.reason : form.reason}
//           onChange={(e) => setForm({ ...form, reason: e.target.value })}
//           placeholder={form.partyType === "client" ? "e.g. Onsite travel reimbursement" : "e.g. Refund for damaged goods"}
//         />
//       </div>
 
//       {/* Amount + Due Date side by side */}
//       <div className="grid grid-cols-2 gap-3">
//         <div className="space-y-1.5">
//           <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Amount (₹)</Label>
//           <Input className="h-10" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0" />
//         </div>
//         <div className="space-y-1.5">
//           <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Due Date</Label>
//           <Input
//             className="h-10 cursor-pointer"
//             type="date"
//             value={form.dueDate}
//             min={new Date().toISOString().slice(0, 10)}
//             onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
//           />
//         </div>
//       </div>
 
//     </div>
//     <DialogFooter className="pt-2">
//       <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
//       <Button onClick={createEntry}>Generate Invoice</Button>
//     </DialogFooter>
//   </DialogContent>
// </Dialog>
 
//       {/* Manage Clients Dialog */}
//       <Dialog open={manageOpen} onOpenChange={setManageOpen}>
//         <DialogContent className="max-w-xl">
//           <DialogHeader><DialogTitle>Manage Clients</DialogTitle></DialogHeader>
//           <div className="space-y-3">
//             <div className="flex justify-end">
//               <Button onClick={() => setAddClientOpen(true)} className="gap-1.5"><Plus className="h-4 w-4" /> Add Client</Button>
//             </div>
//             <div className="border rounded-md divide-y max-h-80 overflow-y-auto">
//               {clientsLoading && (
//                 <div className="p-4 text-center text-sm text-muted-foreground">Loading clients...</div>
//               )}
//               {!clientsLoading && clients.length === 0 && (
//                 <div className="p-4 text-center text-sm text-muted-foreground">No clients yet.</div>
//               )}
//               {!clientsLoading && clients.map((c) => (
//                 <div key={c.id} className="flex items-center justify-between px-3 py-2.5 text-sm gap-3">
//                   <div className="min-w-0 flex-1">
//                     <p className="font-medium truncate">{c.name}</p>
//                     <p className="text-xs text-muted-foreground truncate">
//                       {[c.email, c.phone].filter(Boolean).join(" • ") || "—"}
//                     </p>
//                   </div>
//                   <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => deleteClient(c.id)}>
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </div>
//               ))}
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setManageOpen(false)}>Close</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
 
//       {/* Add Client Dialog */}
//       <Dialog open={addClientOpen} onOpenChange={(o) => { setAddClientOpen(o); if (!o) setNewClient({ name: "", email: "", phone: "", address: "" }); }}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>Add Client</DialogTitle></DialogHeader>
//           <div className="space-y-3">
//             <div>
//               <Label className="text-xs">Client Name *</Label>
//               <Input value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} placeholder="e.g. Tata Consultancy Services" />
//             </div>
//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <Label className="text-xs">Email</Label>
//                 <Input type="email" value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} placeholder="contact@client.com" />
//               </div>
//               <div>
//                 <Label className="text-xs">Phone</Label>
//                 <Input value={newClient.phone} onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })} placeholder="+91 98xxx xxxxx" />
//               </div>
//             </div>
//             <div>
//               <Label className="text-xs">Address</Label>
//               <Input value={newClient.address} onChange={(e) => setNewClient({ ...newClient, address: e.target.value })} placeholder="City, State" />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setAddClientOpen(false)}>Cancel</Button>
//             <Button onClick={addClient}>Save Client</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }




import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText, AlertCircle, CheckCircle2, Plus, Users, Trash2, XCircle, Eye } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const API_BASE = "https://d2ontk4ewdype3.cloudfront.net";

interface ARItem {
  description: string;
  amount: number;
}

interface ARRecord {
  ar_id: string;
  source_type: "client" | "vendor";
  status: string;
  amount: number;
  items: ARItem[];
  client_name?: string | null;
  vendor_name?: string | null;
  employee_name?: string | null;
  employee_email?: string | null;
  created_at?: string;
  approved_at?: string | null;
  invoice_generated?: boolean;
  client_id?: string;
  employee_id?: string;
  vendor_id?: string;
  reimbursement_id?: string | null;
  invoice_id?: string | null;
}

interface ARListResponse {
  count: number;
  total_sum: number;
  client_receivables: { count: number; amount: number };
  vendor_receivables: { count: number; amount: number };
  records: ARRecord[];
}

interface ARDashboardResponse {
  client_receivables: {
    pending_count: number;
    approved_count: number;
    rejected_count: number;
    pending_amount: number;
    approved_amount: number;
    rejected_amount: number;
  };
  vendor_receivables: {
    pending_count: number;
    approved_count: number;
    rejected_count: number;
    pending_amount: number;
    approved_amount: number;
    rejected_amount: number;
  };
  total_receivable: number;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending_client_approval: { label: "Pending Client Approval", className: "bg-warning/10 text-warning border-warning/20" },
  pending_vendor_approval: { label: "Pending Vendor Approval", className: "bg-warning/10 text-warning border-warning/20" },
  approved: { label: "Approved", className: "bg-success/10 text-success border-success/20" },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
  invoiced: { label: "Invoiced", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  received: { label: "Received", className: "bg-success/10 text-success border-success/20" },
  overdue: { label: "Overdue", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const getStatusConfig = (status: string) =>
  statusConfig[status] ?? { label: status, className: "bg-muted text-muted-foreground border-border" };

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
}

interface Vendor {
  id: string;
  name: string;
  email: string;
}

interface LineItem {
  description: string;
  amount: string;
}

export default function AccountsReceivablePage() {
  const { toast } = useToast();

  // AR list + dashboard
  const [records, setRecords] = useState<ARRecord[]>([]);
  const [arSummary, setArSummary] = useState<{
    count: number;
    total_sum: number;
    client_receivables: { count: number; amount: number };
    vendor_receivables: { count: number; amount: number };
  } | null>(null);
  const [dashboard, setDashboard] = useState<ARDashboardResponse | null>(null);
  const [recordsLoading, setRecordsLoading] = useState(false);

  const [clients, setClients] = useState<Client[]>([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", email: "", phone: "", address: "" });

  // Reasons dialog
  const [reasonsOpen, setReasonsOpen] = useState(false);
  const [reasonsRecord, setReasonsRecord] = useState<ARRecord | null>(null);

  // Approval in-flight tracking
  const [approvingId, setApprovingId] = useState<string | null>(null);

  // Employees
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState("");

  // Vendors
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [vendorsLoading, setVendorsLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    partyType: "client" as "client" | "vendor",
    clientName: "",
    clientId: "",
    employeeId: "",
    employeeName: "",
    vendorId: "",
    vendorName: "",
    items: [{ description: "", amount: "" }] as LineItem[],
  });

  // Fetch AR list
  const fetchARList = async () => {
    setRecordsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/list-ar`);
      const data: ARListResponse = await res.json();
      setRecords(data.records ?? []);
      setArSummary({
        count: data.count,
        total_sum: data.total_sum,
        client_receivables: data.client_receivables,
        vendor_receivables: data.vendor_receivables,
      });
    } catch {
      toast({ title: "Error", description: "Failed to load AR entries.", variant: "destructive" });
    } finally {
      setRecordsLoading(false);
    }
  };

  // Fetch AR dashboard KPIs
  const fetchARDashboard = async () => {
    try {
      const res = await fetch(`${API_BASE}/ar-dashboard`);
      const data: ARDashboardResponse = await res.json();
      setDashboard(data);
    } catch {
      toast({ title: "Error", description: "Failed to load AR dashboard.", variant: "destructive" });
    }
  };

  // Fetch clients from backend
  const fetchClients = async () => {
    setClientsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/list-clients`);
      const data = await res.json();
      const mapped: Client[] = data.map((c: any) => ({
        id: c.client_id ?? c.id ?? c.client_name,
        name: c.client_name,
        email: c.email ?? "",
        phone: c.phone ?? "",
        address: c.address ?? "",
      }));
      setClients(mapped);
    } catch {
      toast({ title: "Error", description: "Failed to load clients.", variant: "destructive" });
    } finally {
      setClientsLoading(false);
    }
  };

  // Fetch employees from backend
  const fetchEmployees = async () => {
    setEmployeesLoading(true);
    try {
      const res = await fetch(`${API_BASE}/list-employee-names`);
      const data = await res.json();
      const mapped: Employee[] = (data.employees ?? []).map((e: any) => ({
        id: e.user_id,
        name: e.name,
        email: e.email,
      }));
      setEmployees(mapped);
    } catch {
      toast({ title: "Error", description: "Failed to load employees.", variant: "destructive" });
    } finally {
      setEmployeesLoading(false);
    }
  };

  // Fetch vendors from backend
  const fetchVendors = async () => {
    setVendorsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/list-vendors`);
      const data = await res.json();
      const mapped: Vendor[] = (data.vendors ?? []).map((v: any) => ({
        id: v.vendor_id,
        name: v.vendor_name,
        email: v.email,
      }));
      setVendors(mapped);
    } catch {
      toast({ title: "Error", description: "Failed to load vendors.", variant: "destructive" });
    } finally {
      setVendorsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchARList();
    fetchARDashboard();
    fetchClients();
    fetchEmployees();
  }, []);

  const resetForm = () =>
    setForm({
      partyType: "client",
      clientName: "",
      clientId: "",
      employeeId: "",
      employeeName: "",
      vendorId: "",
      vendorName: "",
      items: [{ description: "", amount: "" }],
    });

  // Derive a display name + reason summary for each record
  const partyNameOf = (r: ARRecord) => (r.source_type === "vendor" ? r.vendor_name ?? "—" : r.client_name ?? "—");
  const reasonSummaryOf = (r: ARRecord) => (r.items ?? []).map((it) => it.description).join(", ");

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const party = partyNameOf(r).toLowerCase();
      const matchesSearch =
        party.includes(search.toLowerCase()) || r.ar_id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      const matchesType = typeFilter === "all" || r.source_type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [records, search, statusFilter, typeFilter]);

  // Mark approved via /ar-approval
  const approveEntry = async (arId: string) => {
    setApprovingId(arId);
    try {
      const res = await fetch(`${API_BASE}/ar-approval`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ar_id: arId, approved: "yes" }),
      });
      if (!res.ok) throw new Error();
      const result = await res.json();
      toast({
        title: "Approved",
        description: result.payroll_cycle
          ? `Marked approved. Payroll cycle: ${result.payroll_cycle}`
          : "AR entry marked as approved.",
      });
      fetchARList();
      fetchARDashboard();
    } catch {
      toast({ title: "Error", description: "Failed to approve AR entry.", variant: "destructive" });
    } finally {
      setApprovingId(null);
    }
  };

  const openReasons = (record: ARRecord) => {
    setReasonsRecord(record);
    setReasonsOpen(true);
  };

  // Line item helpers
  const addItem = () => {
    setForm((f) => ({ ...f, items: [...f.items, { description: "", amount: "" }] }));
  };

  const removeItem = (index: number) => {
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== index) }));
  };

  const updateItem = (index: number, key: keyof LineItem, value: string) => {
    setForm((f) => ({
      ...f,
      items: f.items.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    }));
  };

  const filteredEmployees = useMemo(() => {
    if (!employeeSearch.trim()) return employees;
    return employees.filter((e) => e.name.toLowerCase().includes(employeeSearch.toLowerCase()));
  }, [employees, employeeSearch]);

  const validItems = () =>
    form.items.filter((it) => it.description.trim() !== "" && it.amount !== "" && Number(it.amount) > 0);

  const itemsTotal = (items: LineItem[]) =>
    items.reduce((s, it) => s + (Number(it.amount) || 0), 0);

  const createEntry = async () => {
    const items = validItems();

    if (items.length === 0) {
      toast({ title: "Missing items", description: "Add at least one item with description and amount.", variant: "destructive" });
      return;
    }

    if (form.partyType === "client") {
      if (!form.clientName || !form.employeeId) {
        toast({ title: "Missing fields", description: "Client and employee are required.", variant: "destructive" });
        return;
      }

      setSubmitting(true);
      try {
        const res = await fetch(`${API_BASE}/reimburse-employee-through-ar`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client_id: form.clientId,
            employee_id: form.employeeId,
            items: items.map((it) => ({ description: it.description, amount: Number(it.amount) })),
          }),
        });

        if (!res.ok) throw new Error();
        const created = await res.json();

        resetForm();
        setCreateOpen(false);
        toast({ title: "AR entry created", description: `Invoice ${created.ar_id ?? ""} generated.` });
        fetchARList();
        fetchARDashboard();
      } catch {
        toast({ title: "Error", description: "Failed to create AR entry. Please try again.", variant: "destructive" });
      } finally {
        setSubmitting(false);
      }
    } else {
      if (!form.vendorId) {
        toast({ title: "Missing fields", description: "Vendor is required.", variant: "destructive" });
        return;
      }

      setSubmitting(true);
      try {
        const res = await fetch(`${API_BASE}/create-ar-from-vendor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vendor_id: form.vendorId,
            items: items.map((it) => ({ description: it.description, amount: Number(it.amount) })),
          }),
        });

        if (!res.ok) throw new Error();
        const created = await res.json();

        resetForm();
        setCreateOpen(false);
        toast({ title: "AR entry created", description: `Invoice ${created.ar_id ?? ""} generated.` });
        fetchARList();
        fetchARDashboard();
      } catch {
        toast({ title: "Error", description: "Failed to create AR entry. Please try again.", variant: "destructive" });
      } finally {
        setSubmitting(false);
      }
    }
  };

  const addClient = async () => {
    const name = newClient.name.trim();
    if (!name) {
      toast({ title: "Missing fields", description: "Client name is required.", variant: "destructive" });
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/add-client`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: name,
          email: newClient.email,
          phone: newClient.phone,
          address: newClient.address,
        }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Client added", description: `${name} added successfully.` });
      setNewClient({ name: "", email: "", phone: "", address: "" });
      setAddClientOpen(false);
      fetchClients();
    } catch {
      toast({ title: "Error", description: "Failed to add client.", variant: "destructive" });
    }
  };

  const deleteClient = async (id: string) => {
    const removed = clients.find((c) => c.id === id);
    try {
      const res = await fetch(`${API_BASE}/delete-client/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setClients((c) => c.filter((x) => x.id !== id));
      if (removed) toast({ title: "Client removed", description: `${removed.name} deleted.` });
    } catch {
      toast({ title: "Error", description: "Failed to delete client.", variant: "destructive" });
    }
  };

  // KPI helpers from dashboard
  const totalReceivable = dashboard?.total_receivable ?? 0;
  const approvedAmount = (dashboard?.client_receivables.approved_amount ?? 0) + (dashboard?.vendor_receivables.approved_amount ?? 0);
  const approvedCount = (dashboard?.client_receivables.approved_count ?? 0) + (dashboard?.vendor_receivables.approved_count ?? 0);
  const pendingAmount = (dashboard?.client_receivables.pending_amount ?? 0) + (dashboard?.vendor_receivables.pending_amount ?? 0);
  const pendingCount = (dashboard?.client_receivables.pending_count ?? 0) + (dashboard?.vendor_receivables.pending_count ?? 0);
  const rejectedAmount = (dashboard?.client_receivables.rejected_amount ?? 0) + (dashboard?.vendor_receivables.rejected_amount ?? 0);
  const rejectedCount = (dashboard?.client_receivables.rejected_count ?? 0) + (dashboard?.vendor_receivables.rejected_count ?? 0);
  const totalCount = (dashboard?.client_receivables ? (dashboard.client_receivables.pending_count + dashboard.client_receivables.approved_count + dashboard.client_receivables.rejected_count) : 0)
    + (dashboard?.vendor_receivables ? (dashboard.vendor_receivables.pending_count + dashboard.vendor_receivables.approved_count + dashboard.vendor_receivables.rejected_count) : 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Accounts Receivable</h1>
          <p className="text-muted-foreground text-sm">Invoices billed to clients (employee travel) or vendors (refunds for damaged goods).</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setManageOpen(true); fetchClients(); }} className="gap-1.5">
            <Users className="h-4 w-4" /> Manage Clients
          </Button>
          <Button onClick={() => { setCreateOpen(true); fetchClients(); fetchEmployees(); }} className="gap-1.5">
            <Plus className="h-4 w-4" /> Create AR Entry
          </Button>
        </div>
      </div>

      {/* Summary Cards (from /ar-dashboard) */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <Card><CardContent className="pt-5 pb-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><FileText className="h-3.5 w-3.5" /> Total Receivable</div>
          <p className="text-2xl font-bold mt-1">₹{totalReceivable.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">{totalCount} entries</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <div className="flex items-center gap-2 text-xs text-success"><CheckCircle2 className="h-3.5 w-3.5" /> Approved Amount</div>
          <p className="text-2xl font-bold mt-1 text-success">₹{approvedAmount.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">{approvedCount} entries</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <div className="flex items-center gap-2 text-xs text-warning"><AlertCircle className="h-3.5 w-3.5" /> Pending Amount</div>
          <p className="text-2xl font-bold mt-1 text-warning">₹{pendingAmount.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">{pendingCount} entries</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <div className="flex items-center gap-2 text-xs text-destructive"><XCircle className="h-3.5 w-3.5" /> Rejected Amount</div>
          <p className="text-2xl font-bold mt-1 text-destructive">₹{rejectedAmount.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">{rejectedCount} entries</p>
        </CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by party or invoice..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="client">Client</SelectItem>
            <SelectItem value="vendor">Vendor Refund</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending_client_approval">Pending Client Approval</SelectItem>
            <SelectItem value="pending_vendor_approval">Pending Vendor Approval</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left py-2 font-medium">Name</th>
                  <th className="text-left py-2 font-medium">Type</th>
                  <th className="text-right py-2 pr-6 font-medium">Amount</th>
                  <th className="text-left py-2 pl-6 font-medium">Status</th>
                  <th className="text-left py-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {recordsLoading && (
                  <tr><td colSpan={5} className="py-8 text-center text-muted-foreground text-sm">Loading AR entries...</td></tr>
                )}
                {!recordsLoading && filtered.map((r) => {
                  const cfg = getStatusConfig(r.status);
                  const isPending = r.status === "pending_client_approval" || r.status === "pending_vendor_approval";
                  return (
                    <tr key={r.ar_id} className="border-b hover:bg-muted/50">
                      <td className="py-3 font-medium">{partyNameOf(r)}</td>
                      <td className="py-3 text-muted-foreground capitalize">{r.source_type}</td>
                      <td className="py-3 text-right pr-6 font-mono">₹{r.amount.toLocaleString()}</td>
                      <td className="py-3 pl-6"><Badge variant="outline" className={cfg.className}>{cfg.label}</Badge></td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <button
  className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted"
  onClick={() => openReasons(r)}
>
  <Eye className="h-4 w-4 text-muted-foreground" />
</button>
                          {isPending ? (
                            <Button
                              size="sm"
                              className="text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                              disabled={approvingId === r.ar_id}
                              onClick={() => approveEntry(r.ar_id)}
                            >
                              {approvingId === r.ar_id ? "Approving..." : "Mark Approved"}
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground self-center">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!recordsLoading && filtered.length === 0 && (
                  <tr><td colSpan={5} className="py-8 text-center text-muted-foreground text-sm">No AR entries match your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Reasons Dialog */}
      <Dialog open={reasonsOpen} onOpenChange={(o) => { setReasonsOpen(o); if (!o) setReasonsRecord(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Reasons — {reasonsRecord ? partyNameOf(reasonsRecord) : ""}</DialogTitle></DialogHeader>
          <div className="space-y-2">
            {reasonsRecord?.items?.length ? (
              <div className="border rounded-md divide-y">
                {reasonsRecord.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between px-3 py-2.5 text-sm">
                    <span className="text-muted-foreground">{it.description}</span>
                    <span className="font-mono font-medium">₹{it.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between px-3 py-2.5 text-sm font-semibold bg-muted/30">
                  <span>Total</span>
                  <span className="font-mono">₹{reasonsRecord.amount.toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No reasons available.</p>
            )}
            {reasonsRecord?.employee_name && (
              <p className="text-xs text-muted-foreground pt-1">Employee: {reasonsRecord.employee_name}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReasonsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create AR Entry Dialog */}
      <Dialog open={createOpen} onOpenChange={(o) => { setCreateOpen(o); if (!o) { resetForm(); setEmployeeSearch(""); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Create AR Entry</DialogTitle></DialogHeader>
          <div className="space-y-4 py-1 max-h-[70vh] overflow-y-auto pr-1">

            {/* Type + Client/Vendor Name side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Type</Label>
                <Select
                  value={form.partyType}
                  onValueChange={(v: "client" | "vendor") => {
                    setForm({
                      ...form,
                      partyType: v,
                      clientName: "",
                      clientId: "",
                      employeeId: "",
                      employeeName: "",
                      vendorId: "",
                      vendorName: "",
                      items: [{ description: "", amount: "" }],
                    });
                    setEmployeeSearch("");
                    if (v === "vendor") fetchVendors();
                  }}
                >
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client </SelectItem>
                    <SelectItem value="vendor">Vendor (refund / damaged goods)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {form.partyType === "client" ? (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Client Name</Label>
                  <Select
                    value={form.clientName}
                    onValueChange={(v) => {
                      const selected = clients.find((c) => c.name === v);
                      setForm({ ...form, clientName: v, clientId: selected?.id ?? "" });
                    }}
                  >
                    <SelectTrigger className="h-10"><SelectValue placeholder="Select a client" /></SelectTrigger>
                    <SelectContent>
                      {clientsLoading && <div className="px-3 py-2 text-xs text-muted-foreground">Loading...</div>}
                      {!clientsLoading && clients.length === 0 && (
                        <div className="px-3 py-2 text-xs text-muted-foreground">No clients — add via Manage Clients</div>
                      )}
                      {clients.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Vendor Name</Label>
                  <Select
                    value={form.vendorName}
                    onValueChange={(v) => {
                      const selected = vendors.find((vd) => vd.name === v);
                      setForm({ ...form, vendorName: v, vendorId: selected?.id ?? "" });
                    }}
                  >
                    <SelectTrigger className="h-10"><SelectValue placeholder="Select a vendor" /></SelectTrigger>
                    <SelectContent>
                      {vendorsLoading && <div className="px-3 py-2 text-xs text-muted-foreground">Loading...</div>}
                      {!vendorsLoading && vendors.length === 0 && (
                        <div className="px-3 py-2 text-xs text-muted-foreground">No vendors found</div>
                      )}
                      {vendors.map((v) => <SelectItem key={v.id} value={v.name}>{v.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Employee — only for client, with search bar */}
            {form.partyType === "client" && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Employee</Label>
                <div className="relative">
                  <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="h-9 pl-8"
                    placeholder="Search employee by name..."
                    value={employeeSearch}
                    onChange={(e) => setEmployeeSearch(e.target.value)}
                  />
                </div>
                <div className="border rounded-lg bg-muted/20 max-h-[160px] overflow-y-auto divide-y">
                  {employeesLoading && (
                    <div className="px-3 py-2.5 text-xs text-muted-foreground">Loading employees...</div>
                  )}
                  {!employeesLoading && filteredEmployees.length === 0 && (
                    <div className="px-3 py-2.5 text-xs text-muted-foreground">No employees found.</div>
                  )}
                  {!employeesLoading && filteredEmployees.map((emp) => (
                    <label key={emp.id} className="flex items-center gap-2.5 px-3 py-2.5 text-sm cursor-pointer hover:bg-muted/60 transition-colors">
                      <input
                        type="radio"
                        name="employee"
                        checked={form.employeeId === emp.id}
                        onChange={() => setForm({ ...form, employeeId: emp.id, employeeName: emp.name })}
                        className="h-4 w-4"
                      />
                      <div className="min-w-0">
                        <p className="truncate">{emp.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{emp.email}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Line items: description + amount, add multiple */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Items</Label>
              <div className="space-y-2">
                {form.items.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <Input
                      className="h-10 flex-1"
                      placeholder="Description (e.g. travel charges)"
                      value={item.description}
                      onChange={(e) => updateItem(idx, "description", e.target.value)}
                    />
                    <Input
                      className="h-10 w-32"
                      type="number"
                      placeholder="Amount"
                      value={item.amount}
                      onChange={(e) => updateItem(idx, "amount", e.target.value)}
                    />
                    {form.items.length > 1 && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-10 w-10 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                        onClick={() => removeItem(idx)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="gap-1.5 mt-1" onClick={addItem}>
                <Plus className="h-3.5 w-3.5" /> Add Item
              </Button>
              {validItems().length > 0 && (
                <p className="text-xs text-muted-foreground pt-1">
                  Total: ₹{itemsTotal(validItems()).toLocaleString()}
                </p>
              )}
            </div>

          </div>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setCreateOpen(false)} disabled={submitting}>Cancel</Button>
            <Button onClick={createEntry} disabled={submitting}>
              {submitting ? "Generating..." : "Generate Invoice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Clients Dialog */}
      <Dialog open={manageOpen} onOpenChange={setManageOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>Manage Clients</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="flex justify-end">
              <Button onClick={() => setAddClientOpen(true)} className="gap-1.5"><Plus className="h-4 w-4" /> Add Client</Button>
            </div>
            <div className="border rounded-md divide-y max-h-80 overflow-y-auto">
              {clientsLoading && (
                <div className="p-4 text-center text-sm text-muted-foreground">Loading clients...</div>
              )}
              {!clientsLoading && clients.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">No clients yet.</div>
              )}
              {!clientsLoading && clients.map((c) => (
                <div key={c.id} className="flex items-center justify-between px-3 py-2.5 text-sm gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{c.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {[c.email, c.phone].filter(Boolean).join(" • ") || "—"}
                    </p>
                  </div>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => deleteClient(c.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setManageOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Client Dialog */}
      <Dialog open={addClientOpen} onOpenChange={(o) => { setAddClientOpen(o); if (!o) setNewClient({ name: "", email: "", phone: "", address: "" }); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Client</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Client Name *</Label>
              <Input value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} placeholder="e.g. Tata Consultancy Services" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Email</Label>
                <Input type="email" value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} placeholder="contact@client.com" />
              </div>
              <div>
                <Label className="text-xs">Phone</Label>
                <Input value={newClient.phone} onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })} placeholder="+91 98xxx xxxxx" />
              </div>
            </div>
            <div>
              <Label className="text-xs">Address</Label>
              <Input value={newClient.address} onChange={(e) => setNewClient({ ...newClient, address: e.target.value })} placeholder="City, State" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddClientOpen(false)}>Cancel</Button>
            <Button onClick={addClient}>Save Client</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
 