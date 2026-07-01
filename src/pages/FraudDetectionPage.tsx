// import React, { useState, useMemo } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { mockBills } from "@/data/mockData";
// import { Search, CalendarIcon, X, Eye } from "lucide-react";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { cn } from "@/lib/utils";
// import { format, parseISO, isAfter, isBefore, isSameDay } from "date-fns";
// import BillReviewModal from "@/components/BillReviewModal";
// import DocumentViewModal from "@/components/DocumentViewModal";

// const statusConfig = {
//   pending: { label: "Pending", className: "bg-warning/10 text-warning border-warning/20" },
//   approved: { label: "Approved", className: "bg-success/10 text-success border-success/20" },
//   rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
// };

// export default function FraudDetectionPage() {
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState<string>("all");
//   const [fromDate, setFromDate] = useState<Date | undefined>();
//   const [toDate, setToDate] = useState<Date | undefined>();
//   const [reviewBillId, setReviewBillId] = useState<string | null>(null);
//   const [viewBillId, setViewBillId] = useState<string | null>(null);

//   const filtered = useMemo(() => {
//     return mockBills
//       .filter((b) => b.role === "sales")
//       .filter((b) => {
//         const matchesSearch = b.billNumber.toLowerCase().includes(search.toLowerCase()) ||
//           b.vendor.toLowerCase().includes(search.toLowerCase());
//         const matchesStatus = statusFilter === "all" || b.status === statusFilter;
//         let matchesDate = true;
//         if (fromDate || toDate) {
//           const d = parseISO(b.date);
//           if (fromDate && toDate) {
//             matchesDate = (isAfter(d, fromDate) || isSameDay(d, fromDate)) && (isBefore(d, toDate) || isSameDay(d, toDate));
//           } else if (fromDate) {
//             matchesDate = isAfter(d, fromDate) || isSameDay(d, fromDate);
//           } else if (toDate) {
//             matchesDate = isBefore(d, toDate) || isSameDay(d, toDate);
//           }
//         }
//         return matchesSearch && matchesStatus && matchesDate;
//       });
//   }, [search, statusFilter, fromDate, toDate]);

//   const reviewBill = filtered.find((b) => b.id === reviewBillId);
//   const viewBill = filtered.find((b) => b.id === viewBillId);

//   const clearDateFilters = () => { setFromDate(undefined); setToDate(undefined); };

//   return (
//     <div className="space-y-6 animate-fade-in">
//       <div>
//         <h1 className="text-2xl font-bold tracking-tight">Sales Bills</h1>
//         <p className="text-muted-foreground text-sm">Review, approve, or reject sales submitted bills</p>
//       </div>

//       <div className="flex flex-wrap gap-3 items-center">
//         <div className="relative flex-1 min-w-[200px] max-w-sm">
//           <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
//           <Input placeholder="Search by tracking ID, vendor..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
//         </div>
//         <Select value={statusFilter} onValueChange={setStatusFilter}>
//           <SelectTrigger className="w-[140px]">
//             <SelectValue placeholder="Status" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Status</SelectItem>
//             <SelectItem value="pending">Pending</SelectItem>
//             <SelectItem value="approved">Approved</SelectItem>
//             <SelectItem value="rejected">Rejected</SelectItem>
//           </SelectContent>
//         </Select>
//         <Popover>
//           <PopoverTrigger asChild>
//             <Button variant="outline" size="sm" className={cn("text-xs gap-1.5", !fromDate && "text-muted-foreground")}>
//               <CalendarIcon className="h-3.5 w-3.5" />
//               {fromDate ? format(fromDate, "dd MMM yyyy") : "Start date"}
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-auto p-0" align="start">
//             <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus className={cn("p-3 pointer-events-auto")} />
//           </PopoverContent>
//         </Popover>
//         <span className="text-xs text-muted-foreground">to</span>
//         <Popover>
//           <PopoverTrigger asChild>
//             <Button variant="outline" size="sm" className={cn("text-xs gap-1.5", !toDate && "text-muted-foreground")}>
//               <CalendarIcon className="h-3.5 w-3.5" />
//               {toDate ? format(toDate, "dd MMM yyyy") : "End date"}
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-auto p-0" align="start">
//             <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus className={cn("p-3 pointer-events-auto")} />
//           </PopoverContent>
//         </Popover>
//         {(fromDate || toDate) && (
//           <Button variant="ghost" size="sm" onClick={clearDateFilters} className="text-xs gap-1">
//             <X className="h-3.5 w-3.5" /> Clear
//           </Button>
//         )}
//       </div>

//       <Card>
//         <CardContent className="pt-6">
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b text-muted-foreground">
//                   <th className="text-left py-2 font-medium">Tracking ID</th>
//                   <th className="text-left py-2 font-medium">Sales</th>
//                   <th className="text-right py-2 pr-6 font-medium">Amount</th>
//                   <th className="text-left py-2 pl-6 font-medium">Date</th>
//                   <th className="text-left py-2 font-medium">Status</th>
//                   <th className="text-left py-2 font-medium">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((bill) => (
//                   <tr key={bill.id} className="border-b hover:bg-muted/50">
//                     <td className="py-3 font-medium">{bill.billNumber}</td>
//                     <td className="py-3">{bill.vendor}</td>
//                     <td className="py-3 text-right pr-6 font-mono">₹{bill.amount.toLocaleString()}</td>
//                     <td className="py-3 pl-6 text-muted-foreground">{bill.date}</td>
//                     <td className="py-3">
//                       <Badge variant="outline" className={statusConfig[bill.status].className}>
//                         {statusConfig[bill.status].label}
//                       </Badge>
//                     </td>
//                     <td className="py-3">
//                       <div className="flex items-center gap-1.5">
//                         <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => {
//                           if (bill.documentType === "pdf" && bill.documentUrl) {
//                             window.open(bill.documentUrl, "_blank");
//                           } else {
//                             setViewBillId(bill.id);
//                           }
//                         }}>
//                           <Eye className="h-4 w-4 text-muted-foreground" />
//                         </Button>
//                         {bill.status === "pending" ? (
//                           <Button variant="outline" size="sm" className="text-xs" onClick={() => setReviewBillId(bill.id)}>
//                             Review
//                           </Button>
//                         ) : (
//                           <span className="text-xs text-muted-foreground">—</span>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>

//       <BillReviewModal bill={reviewBill} open={!!reviewBillId} onClose={() => setReviewBillId(null)} />
//       <DocumentViewModal bill={viewBill} open={!!viewBillId} onClose={() => setViewBillId(null)} />
//     </div>
//   );
// }




// import React, { useState, useMemo, useEffect, useCallback } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Search, CalendarIcon, X, Eye, Loader2, AlertCircle, RefreshCw } from "lucide-react";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { cn } from "@/lib/utils";
// import { format, parseISO, isAfter, isBefore, isSameDay } from "date-fns";

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface Claim {
//   upload_id: string;
//   submitter_name: string;
//   user_id: string;
//   usertype: string;
//   amount: string;
//   date: string;
//   status: "pending" | "approved" | "rejected";
//   title: string;
// }

// interface StoredUser {
//   user_id: string;
//   name: string;
//   email: string;
//   usertype: string;
// }

// // ─── Constants ────────────────────────────────────────────────────────────────

// const BASE_URL = "https://d2ontk4ewdype3.cloudfront.net";

// const statusConfig: Record<string, { label: string; className: string }> = {
//   pending:  { label: "Pending",  className: "bg-warning/10 text-warning border-warning/20" },
//   approved: { label: "Approved", className: "bg-success/10 text-success border-success/20" },
//   rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
// };

// // ─── Helpers ─────────────────────────────────────────────────────────────────

// function getStoredUser(): StoredUser | null {
//   try {
//     const raw = localStorage.getItem("user");
//     return raw ? JSON.parse(raw) : null;
//   } catch {
//     return null;
//   }
// }

// // ─── Image Modal ──────────────────────────────────────────────────────────────

// interface ImageModalProps {
//   open: boolean;
//   onClose: () => void;
//   claim: Claim | null;
//   currentUserId: string;
// }

// function ClaimImageModal({ open, onClose, claim, currentUserId }: ImageModalProps) {
//   const [imgUrl, setImgUrl] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!open || !claim) return;

//     let objectUrl: string | null = null;

//     const fetchImage = async () => {
//       setLoading(true);
//       setError(null);
//       setImgUrl(null);

//       try {
//         const res = await fetch(
//           `${BASE_URL}/view-original-claim-image?user_id=${claim.user_id}&upload_id=${claim.upload_id}`,
//           { headers: { accept: "image/*" } }
//         );

//         if (!res.ok) throw new Error(`Server returned ${res.status}`);

//         const blob = await res.blob();
//         objectUrl = URL.createObjectURL(blob);
//         setImgUrl(objectUrl);
//       } catch (err: any) {
//         setError(err.message ?? "Failed to load image");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchImage();

//     return () => {
//       if (objectUrl) URL.revokeObjectURL(objectUrl);
//     };
//   }, [open, claim]);

//   // Clean up when modal closes
//   useEffect(() => {
//     if (!open) {
//       setImgUrl(null);
//       setError(null);
//     }
//   }, [open]);

//   return (
//     <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>
//             {claim ? `${claim.title} — ${claim.submitter_name}` : "Claim Document"}
//           </DialogTitle>
//         </DialogHeader>

//         <div className="min-h-[300px] flex items-center justify-center">
//           {loading && (
//             <div className="flex flex-col items-center gap-2 text-muted-foreground">
//               <Loader2 className="h-8 w-8 animate-spin" />
//               <span className="text-sm">Loading document…</span>
//             </div>
//           )}

//           {error && !loading && (
//             <div className="flex flex-col items-center gap-2 text-destructive">
//               <AlertCircle className="h-8 w-8" />
//               <span className="text-sm">{error}</span>
//             </div>
//           )}

//           {imgUrl && !loading && (
//             <img
//               src={imgUrl}
//               alt="Claim document"
//               className="max-w-full max-h-[70vh] object-contain rounded-md border"
//             />
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// // ─── Main Page ────────────────────────────────────────────────────────────────

// export default function FraudDetectionPage() {
//   const [claims, setClaims] = useState<Claim[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [fetchError, setFetchError] = useState<string | null>(null);

//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState<string>("all");
//   const [fromDate, setFromDate] = useState<Date | undefined>();
//   const [toDate, setToDate] = useState<Date | undefined>();

//   const [viewClaim, setViewClaim] = useState<Claim | null>(null);

//   const storedUser = getStoredUser();
//   const currentUserId = storedUser?.user_id ?? "";

//   // ── Fetch all sales claims ──────────────────────────────────────────────────
//   const fetchClaims = useCallback(async () => {
//     if (!currentUserId) {
//       setFetchError("User not found in local storage. Please log in again.");
//       return;
//     }

//     setLoading(true);
//     setFetchError(null);

//     try {
//       const res = await fetch(
//         `${BASE_URL}/get-all-claims?user_id=${currentUserId}&usertype=sales`,
//         { headers: { accept: "application/json" } }
//       );

//       if (!res.ok) throw new Error(`Server error: ${res.status}`);

//       const data = await res.json();
//       setClaims(data.claims ?? []);
//     } catch (err: any) {
//       setFetchError(err.message ?? "Failed to fetch claims");
//     } finally {
//       setLoading(false);
//     }
//   }, [currentUserId]);

//   useEffect(() => {
//     fetchClaims();
//   }, [fetchClaims]);

//   // ── Filter logic ────────────────────────────────────────────────────────────
//   const filtered = useMemo(() => {
//     return claims.filter((c) => {
//       const matchesSearch =
//         c.title.toLowerCase().includes(search.toLowerCase()) ||
//         c.submitter_name.toLowerCase().includes(search.toLowerCase()) ||
//         c.upload_id.toLowerCase().includes(search.toLowerCase());

//       const matchesStatus = statusFilter === "all" || c.status === statusFilter;

//       let matchesDate = true;
//       if (fromDate || toDate) {
//         const d = parseISO(c.date);
//         if (fromDate && toDate) {
//           matchesDate =
//             (isAfter(d, fromDate) || isSameDay(d, fromDate)) &&
//             (isBefore(d, toDate) || isSameDay(d, toDate));
//         } else if (fromDate) {
//           matchesDate = isAfter(d, fromDate) || isSameDay(d, fromDate);
//         } else if (toDate) {
//           matchesDate = isBefore(d, toDate) || isSameDay(d, toDate);
//         }
//       }

//       return matchesSearch && matchesStatus && matchesDate;
//     });
//   }, [claims, search, statusFilter, fromDate, toDate]);

//   const clearDateFilters = () => {
//     setFromDate(undefined);
//     setToDate(undefined);
//   };

//   // ── Render ──────────────────────────────────────────────────────────────────
//   return (
//     <div className="space-y-6 animate-fade-in">
//       <div>
//         <h1 className="text-2xl font-bold tracking-tight">Sales Bills</h1>
//         <p className="text-muted-foreground text-sm">Review, approve, or reject sales submitted bills</p>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-3 items-center">
//         <div className="relative flex-1 min-w-[200px] max-w-sm">
//           <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             placeholder="Search by bill name, submitted by..."
//             className="pl-9"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         <Select value={statusFilter} onValueChange={setStatusFilter}>
//           <SelectTrigger className="w-[140px]">
//             <SelectValue placeholder="Status" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Status</SelectItem>
//             <SelectItem value="pending">Pending</SelectItem>
//             <SelectItem value="approved">Approved</SelectItem>
//             <SelectItem value="rejected">Rejected</SelectItem>
//           </SelectContent>
//         </Select>

//         <Popover>
//           <PopoverTrigger asChild>
//             <Button
//               variant="outline"
//               size="sm"
//               className={cn("text-xs gap-1.5", !fromDate && "text-muted-foreground")}
//             >
//               <CalendarIcon className="h-3.5 w-3.5" />
//               {fromDate ? format(fromDate, "dd MMM yyyy") : "Start date"}
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-auto p-0" align="start">
//             <Calendar
//               mode="single"
//               selected={fromDate}
//               onSelect={setFromDate}
//               initialFocus
//               className="p-3 pointer-events-auto"
//             />
//           </PopoverContent>
//         </Popover>

//         <span className="text-xs text-muted-foreground">to</span>

//         <Popover>
//           <PopoverTrigger asChild>
//             <Button
//               variant="outline"
//               size="sm"
//               className={cn("text-xs gap-1.5", !toDate && "text-muted-foreground")}
//             >
//               <CalendarIcon className="h-3.5 w-3.5" />
//               {toDate ? format(toDate, "dd MMM yyyy") : "End date"}
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-auto p-0" align="start">
//             <Calendar
//               mode="single"
//               selected={toDate}
//               onSelect={setToDate}
//               initialFocus
//               className="p-3 pointer-events-auto"
//             />
//           </PopoverContent>
//         </Popover>

//         {(fromDate || toDate) && (
//           <Button variant="ghost" size="sm" onClick={clearDateFilters} className="text-xs gap-1">
//             <X className="h-3.5 w-3.5" /> Clear
//           </Button>
//         )}

//         {/* Refresh button */}
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={fetchClaims}
//           disabled={loading}
//           className="text-xs gap-1 ml-auto"
//         >
//           <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
//           Refresh
//         </Button>
//       </div>

//       {/* Table */}
//       <Card>
//         <CardContent className="pt-6">
//           {/* Error state */}
//           {fetchError && (
//             <div className="flex items-center gap-2 text-destructive text-sm mb-4 p-3 bg-destructive/10 rounded-md">
//               <AlertCircle className="h-4 w-4 shrink-0" />
//               {fetchError}
//             </div>
//           )}

//           {/* Loading skeleton */}
//           {loading && (
//             <div className="space-y-3 py-4">
//               {[...Array(5)].map((_, i) => (
//                 <div key={i} className="h-10 bg-muted animate-pulse rounded-md" />
//               ))}
//             </div>
//           )}

//           {/* Table */}
//           {!loading && !fetchError && (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="border-b text-muted-foreground">
//                     <th className="text-left py-2 font-medium">Bill Name</th>
//                     <th className="text-left py-2 font-medium">Submitted By</th>
//                     <th className="text-right py-2 pr-6 font-medium">Amount</th>
//                     <th className="text-left py-2 pl-6 font-medium">Date</th>
//                     <th className="text-left py-2 font-medium">Status</th>
//                     <th className="text-left py-2 font-medium">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filtered.length === 0 ? (
//                     <tr>
//                       <td colSpan={6} className="py-12 text-center text-muted-foreground text-sm">
//                         No claims found matching your filters.
//                       </td>
//                     </tr>
//                   ) : (
//                     filtered.map((claim) => (
//                       <tr key={claim.upload_id} className="border-b hover:bg-muted/50">
//                         {/* Bill Name (title) */}
//                         <td className="py-3 font-medium">{claim.title}</td>

//                         {/* Submitted By (submitter_name) */}
//                         <td className="py-3">{claim.submitter_name}</td>

//                         {/* Amount */}
//                         <td className="py-3 text-right pr-6 font-mono">
//                           ₹{Number(claim.amount).toLocaleString("en-IN")}
//                         </td>

//                         {/* Date */}
//                         <td className="py-3 pl-6 text-muted-foreground">
//                           {format(parseISO(claim.date), "dd MMM yyyy")}
//                         </td>

//                         {/* Status */}
//                         <td className="py-3">
//                           <Badge
//                             variant="outline"
//                             className={statusConfig[claim.status]?.className}
//                           >
//                             {statusConfig[claim.status]?.label ?? claim.status}
//                           </Badge>
//                         </td>

//                         {/* Actions */}
//                         <td className="py-3">
//                           <div className="flex items-center gap-1.5">
//                             {/* Eye icon — fetches image using claim.user_id + upload_id */}
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               className="h-8 w-8 p-0"
//                               aria-label="View claim document"
//                               onClick={() => setViewClaim(claim)}
//                             >
//                               <Eye className="h-4 w-4 text-muted-foreground" />
//                             </Button>

//                             {/* Review button — untouched as requested */}
//                             {claim.status === "pending" ? (
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 className="text-xs"
//                                 onClick={() => {
//                                   // TODO: wire up review modal later
//                                 }}
//                               >
//                                 Review
//                               </Button>
//                             ) : (
//                               <span className="text-xs text-muted-foreground">—</span>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Image viewer modal */}
//       <ClaimImageModal
//         open={!!viewClaim}
//         onClose={() => setViewClaim(null)}
//         claim={viewClaim}
//         currentUserId={currentUserId}
//       />
//     </div>
//   );
// }


// import React, { useState, useMemo, useEffect, useCallback } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Search, CalendarIcon, X, Eye, Loader2, AlertCircle, RefreshCw } from "lucide-react";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { cn } from "@/lib/utils";
// import { format, parseISO, isAfter, isBefore, isSameDay } from "date-fns";
// import BillReviewModal from "@/components/BillReviewModal";
// import type { Bill } from "@/data/mockData";

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface Claim {
//   upload_id: string;
//   submitter_name: string;
//   user_id: string;
//   usertype: string;
//   amount: string;
//   date: string;
//   status: "pending" | "approved" | "rejected";
//   title: string;
// }

// interface StoredUser {
//   user_id: string;
//   name: string;
//   email: string;
//   usertype: string;
// }

// // ─── Constants ────────────────────────────────────────────────────────────────

// const BASE_URL = "https://d2ontk4ewdype3.cloudfront.net";

// const statusConfig: Record<string, { label: string; className: string }> = {
//   pending:  { label: "Pending",  className: "bg-warning/10 text-warning border-warning/20" },
//   approved: { label: "Approved", className: "bg-success/10 text-success border-success/20" },
//   rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
// };

// // ─── Helpers ─────────────────────────────────────────────────────────────────

// function getStoredUser(): StoredUser | null {
//   try {
//     const raw = localStorage.getItem("user");
//     return raw ? JSON.parse(raw) : null;
//   } catch {
//     return null;
//   }
// }

// /**
//  * Maps a backend Claim → Bill shape that BillReviewModal expects.
//  * fraudScore is derived from amount as a dummy heuristic since the
//  * backend doesn't return it yet.
//  */
// function claimToBill(claim: Claim): Bill {
//   const amt = Number(claim.amount);
//   const fraudScore: "low" | "medium" | "high" =
//     amt > 500000 ? "high" : amt > 100000 ? "medium" : "low";

//   return {
//     id: claim.upload_id,
//     billNumber: claim.upload_id,
//     vendor: claim.submitter_name,
//     amount: amt,
//     date: claim.date,
//     status: claim.status,
//     fraudScore,
//     role: "sales",
//     documentUrl: undefined,
//     extractedText: `Bill Title: ${claim.title}\nSubmitted By: ${claim.submitter_name}\nAmount: ₹${amt.toLocaleString("en-IN")}\nDate: ${claim.date}\nUpload ID: ${claim.upload_id}`,
//   } as unknown as Bill;
// }

// // ─── Image Modal ──────────────────────────────────────────────────────────────

// interface ImageModalProps {
//   open: boolean;
//   onClose: () => void;
//   claim: Claim | null;
// }

// function ClaimImageModal({ open, onClose, claim }: ImageModalProps) {
//   const [imgUrl, setImgUrl] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!open || !claim) return;
//     let objectUrl: string | null = null;

//     const fetchImage = async () => {
//       setLoading(true);
//       setError(null);
//       setImgUrl(null);
//       try {
//         const res = await fetch(
//           `${BASE_URL}/view-original-claim-image?user_id=${claim.user_id}&upload_id=${claim.upload_id}`,
//           { headers: { accept: "image/*" } }
//         );
//         if (!res.ok) throw new Error(`Server returned ${res.status}`);
//         const blob = await res.blob();
//         objectUrl = URL.createObjectURL(blob);
//         setImgUrl(objectUrl);
//       } catch (err: any) {
//         setError(err.message ?? "Failed to load image");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchImage();
//     return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
//   }, [open, claim]);

//   useEffect(() => {
//     if (!open) { setImgUrl(null); setError(null); }
//   }, [open]);

//   return (
//     <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>
//             {claim ? `${claim.title} — ${claim.submitter_name}` : "Claim Document"}
//           </DialogTitle>
//         </DialogHeader>
//         <div className="min-h-[300px] flex items-center justify-center">
//           {loading && (
//             <div className="flex flex-col items-center gap-2 text-muted-foreground">
//               <Loader2 className="h-8 w-8 animate-spin" />
//               <span className="text-sm">Loading document…</span>
//             </div>
//           )}
//           {error && !loading && (
//             <div className="flex flex-col items-center gap-2 text-destructive">
//               <AlertCircle className="h-8 w-8" />
//               <span className="text-sm">{error}</span>
//             </div>
//           )}
//           {imgUrl && !loading && (
//             <img
//               src={imgUrl}
//               alt="Claim document"
//               className="max-w-full max-h-[70vh] object-contain rounded-md border"
//             />
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// // ─── Main Page ────────────────────────────────────────────────────────────────

// export default function FraudDetectionPage() {
//   const [claims, setClaims] = useState<Claim[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [fetchError, setFetchError] = useState<string | null>(null);

//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState<string>("all");
//   const [fromDate, setFromDate] = useState<Date | undefined>();
//   const [toDate, setToDate] = useState<Date | undefined>();

//   // Image viewer state
//   const [viewClaim, setViewClaim] = useState<Claim | null>(null);

//   // Review modal state
//   const [reviewBill, setReviewBill] = useState<Bill | undefined>(undefined);
//   const [reviewOpen, setReviewOpen] = useState(false);

//   const storedUser = getStoredUser();
//   const currentUserId = storedUser?.user_id ?? "";

//   // ── Fetch claims ────────────────────────────────────────────────────────────
//   const fetchClaims = useCallback(async () => {
//     if (!currentUserId) {
//       setFetchError("User not found in local storage. Please log in again.");
//       return;
//     }
//     setLoading(true);
//     setFetchError(null);
//     try {
//       const res = await fetch(
//         `${BASE_URL}/get-all-claims?user_id=${currentUserId}&usertype=sales`,
//         { headers: { accept: "application/json" } }
//       );
//       if (!res.ok) throw new Error(`Server error: ${res.status}`);
//       const data = await res.json();
//       setClaims(data.claims ?? []);
//     } catch (err: any) {
//       setFetchError(err.message ?? "Failed to fetch claims");
//     } finally {
//       setLoading(false);
//     }
//   }, [currentUserId]);

//   useEffect(() => { fetchClaims(); }, [fetchClaims]);

//   // ── Filters ─────────────────────────────────────────────────────────────────
//   const filtered = useMemo(() => {
//     return claims.filter((c) => {
//       const matchesSearch =
//         c.title.toLowerCase().includes(search.toLowerCase()) ||
//         c.submitter_name.toLowerCase().includes(search.toLowerCase()) ||
//         c.upload_id.toLowerCase().includes(search.toLowerCase());
//       const matchesStatus = statusFilter === "all" || c.status === statusFilter;
//       let matchesDate = true;
//       if (fromDate || toDate) {
//         const d = parseISO(c.date);
//         if (fromDate && toDate) {
//           matchesDate =
//             (isAfter(d, fromDate) || isSameDay(d, fromDate)) &&
//             (isBefore(d, toDate) || isSameDay(d, toDate));
//         } else if (fromDate) {
//           matchesDate = isAfter(d, fromDate) || isSameDay(d, fromDate);
//         } else if (toDate) {
//           matchesDate = isBefore(d, toDate) || isSameDay(d, toDate);
//         }
//       }
//       return matchesSearch && matchesStatus && matchesDate;
//     });
//   }, [claims, search, statusFilter, fromDate, toDate]);

//   const clearDateFilters = () => { setFromDate(undefined); setToDate(undefined); };

//   const handleReviewClick = (claim: Claim) => {
//     setReviewBill(claimToBill(claim));
//     setReviewOpen(true);
//   };

//   // ── Render ───────────────────────────────────────────────────────────────────
//   return (
//     <div className="space-y-6 animate-fade-in">
//       <div>
//         <h1 className="text-2xl font-bold tracking-tight">Sales Bills</h1>
//         <p className="text-muted-foreground text-sm">Review, approve, or reject sales submitted bills</p>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-3 items-center">
//         <div className="relative flex-1 min-w-[200px] max-w-sm">
//           <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             placeholder="Search by bill name, submitted by..."
//             className="pl-9"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         <Select value={statusFilter} onValueChange={setStatusFilter}>
//           <SelectTrigger className="w-[140px]">
//             <SelectValue placeholder="Status" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Status</SelectItem>
//             <SelectItem value="pending">Pending</SelectItem>
//             <SelectItem value="approved">Approved</SelectItem>
//             <SelectItem value="rejected">Rejected</SelectItem>
//           </SelectContent>
//         </Select>

//         <Popover>
//           <PopoverTrigger asChild>
//             <Button variant="outline" size="sm" className={cn("text-xs gap-1.5", !fromDate && "text-muted-foreground")}>
//               <CalendarIcon className="h-3.5 w-3.5" />
//               {fromDate ? format(fromDate, "dd MMM yyyy") : "Start date"}
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-auto p-0" align="start">
//             <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus className="p-3 pointer-events-auto" />
//           </PopoverContent>
//         </Popover>

//         <span className="text-xs text-muted-foreground">to</span>

//         <Popover>
//           <PopoverTrigger asChild>
//             <Button variant="outline" size="sm" className={cn("text-xs gap-1.5", !toDate && "text-muted-foreground")}>
//               <CalendarIcon className="h-3.5 w-3.5" />
//               {toDate ? format(toDate, "dd MMM yyyy") : "End date"}
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-auto p-0" align="start">
//             <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus className="p-3 pointer-events-auto" />
//           </PopoverContent>
//         </Popover>

//         {(fromDate || toDate) && (
//           <Button variant="ghost" size="sm" onClick={clearDateFilters} className="text-xs gap-1">
//             <X className="h-3.5 w-3.5" /> Clear
//           </Button>
//         )}

//         <Button variant="ghost" size="sm" onClick={fetchClaims} disabled={loading} className="text-xs gap-1 ml-auto">
//           <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
//           Refresh
//         </Button>
//       </div>

//       {/* Table */}
//       <Card>
//         <CardContent className="pt-6">
//           {fetchError && (
//             <div className="flex items-center gap-2 text-destructive text-sm mb-4 p-3 bg-destructive/10 rounded-md">
//               <AlertCircle className="h-4 w-4 shrink-0" />
//               {fetchError}
//             </div>
//           )}

//           {loading && (
//             <div className="space-y-3 py-4">
//               {[...Array(5)].map((_, i) => (
//                 <div key={i} className="h-10 bg-muted animate-pulse rounded-md" />
//               ))}
//             </div>
//           )}

//           {!loading && !fetchError && (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="border-b text-muted-foreground">
//                     <th className="text-left py-2 font-medium">Bill Name</th>
//                     <th className="text-left py-2 font-medium">Submitted By</th>
//                     <th className="text-right py-2 pr-6 font-medium">Amount</th>
//                     <th className="text-left py-2 pl-6 font-medium">Date</th>
//                     <th className="text-left py-2 font-medium">Status</th>
//                     <th className="text-left py-2 font-medium">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filtered.length === 0 ? (
//                     <tr>
//                       <td colSpan={6} className="py-12 text-center text-muted-foreground text-sm">
//                         No claims found matching your filters.
//                       </td>
//                     </tr>
//                   ) : (
//                     filtered.map((claim) => (
//                       <tr key={claim.upload_id} className="border-b hover:bg-muted/50">
//                         <td className="py-3 font-medium">{claim.title}</td>
//                         <td className="py-3">{claim.submitter_name}</td>
//                         <td className="py-3 text-right pr-6 font-mono">
//                           ₹{Number(claim.amount).toLocaleString("en-IN")}
//                         </td>
//                         <td className="py-3 pl-6 text-muted-foreground">
//                           {format(parseISO(claim.date), "dd MMM yyyy")}
//                         </td>
//                         <td className="py-3">
//                           <Badge variant="outline" className={statusConfig[claim.status]?.className}>
//                             {statusConfig[claim.status]?.label ?? claim.status}
//                           </Badge>
//                         </td>
//                         <td className="py-3">
//                           <div className="flex items-center gap-1.5">
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               className="h-8 w-8 p-0"
//                               aria-label="View claim document"
//                               onClick={() => setViewClaim(claim)}
//                             >
//                               <Eye className="h-4 w-4 text-muted-foreground" />
//                             </Button>

//                             {claim.status === "pending" ? (
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 className="text-xs"
//                                 onClick={() => handleReviewClick(claim)}
//                               >
//                                 Review
//                               </Button>
//                             ) : (
//                               <span className="text-xs text-muted-foreground">—</span>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Image viewer modal */}
//       <ClaimImageModal
//         open={!!viewClaim}
//         onClose={() => setViewClaim(null)}
//         claim={viewClaim}
//       />

//       {/* Bill review modal — exactly as before */}
//       <BillReviewModal
//         bill={reviewBill}
//         open={reviewOpen}
//         onClose={() => { setReviewOpen(false); setReviewBill(undefined); }}
//       />
//     </div>
//   );
// }



// import React, { useState, useMemo, useEffect, useCallback } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Search, CalendarIcon, X, Eye, Loader2, AlertCircle, RefreshCw } from "lucide-react";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { cn } from "@/lib/utils";
// import { format, parseISO, isAfter, isBefore, isSameDay } from "date-fns";
// import BillReviewModal, { type ClaimForReview } from "@/components/BillReviewModal";

// interface Claim {
//   upload_id: string; submitter_name: string; user_id: string; usertype: string;
//   amount: string; date: string; status: "pending" | "approved" | "rejected"; title: string;
// }

// interface StoredUser { user_id: string; name: string; email: string; usertype: string; }

// const BASE_URL = "https://d2ontk4ewdype3.cloudfront.net";

// const statusConfig: Record<string, { label: string; className: string }> = {
//   pending:  { label: "Pending",  className: "bg-warning/10 text-warning border-warning/20" },
//   approved: { label: "Approved", className: "bg-success/10 text-success border-success/20" },
//   rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
// };

// function getStoredUser(): StoredUser | null {
//   try { const raw = localStorage.getItem("user"); return raw ? JSON.parse(raw) : null; } catch { return null; }
// }

// function ClaimImageModal({ open, onClose, claim }: { open: boolean; onClose: () => void; claim: Claim | null }) {
//   const [imgUrl, setImgUrl] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!open || !claim) return;
//     let objectUrl: string | null = null;
//     setLoading(true); setError(null); setImgUrl(null);
//     fetch(`${BASE_URL}/view-original-claim-image?user_id=${claim.user_id}&upload_id=${claim.upload_id}`, { headers: { accept: "image/*" } })
//       .then(async (res) => { if (!res.ok) throw new Error(`Server returned ${res.status}`); const blob = await res.blob(); objectUrl = URL.createObjectURL(blob); setImgUrl(objectUrl); })
//       .catch((e) => setError(e.message))
//       .finally(() => setLoading(false));
//     return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
//   }, [open, claim]);

//   useEffect(() => { if (!open) { setImgUrl(null); setError(null); } }, [open]);

//   return (
//     <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>{claim ? `${claim.title} — ${claim.submitter_name}` : "Claim Document"}</DialogTitle>
//         </DialogHeader>
//         <div className="min-h-[300px] flex items-center justify-center">
//           {loading && <div className="flex flex-col items-center gap-2 text-muted-foreground"><Loader2 className="h-8 w-8 animate-spin" /><span className="text-sm">Loading document…</span></div>}
//           {error && !loading && <div className="flex flex-col items-center gap-2 text-destructive"><AlertCircle className="h-8 w-8" /><span className="text-sm">{error}</span></div>}
//           {imgUrl && !loading && <img src={imgUrl} alt="Claim document" className="max-w-full max-h-[70vh] object-contain rounded-md border" />}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// export default function FraudDetectionPage() {
//   const [claims, setClaims]           = useState<Claim[]>([]);
//   const [loading, setLoading]         = useState(false);
//   const [fetchError, setFetchError]   = useState<string | null>(null);
//   const [search, setSearch]           = useState("");
//   const [statusFilter, setStatusFilter] = useState<string>("all");
//   const [fromDate, setFromDate]       = useState<Date | undefined>();
//   const [toDate, setToDate]           = useState<Date | undefined>();
//   const [viewClaim, setViewClaim]     = useState<Claim | null>(null);
//   const [reviewClaim, setReviewClaim] = useState<ClaimForReview | undefined>(undefined);
//   const [reviewOpen, setReviewOpen]   = useState(false);

//   const storedUser    = getStoredUser();
//   const currentUserId = storedUser?.user_id ?? "";

//   const fetchClaims = useCallback(async () => {
//     if (!currentUserId) { setFetchError("User not found in local storage. Please log in again."); return; }
//     setLoading(true); setFetchError(null);
//     try {
//       const res = await fetch(`${BASE_URL}/get-all-claims?user_id=${currentUserId}&usertype=sales`, { headers: { accept: "application/json" } });
//       if (!res.ok) throw new Error(`Server error: ${res.status}`);
//       const data = await res.json();
//       setClaims(data.claims ?? []);
//     } catch (err: any) {
//       setFetchError(err.message ?? "Failed to fetch claims");
//     } finally { setLoading(false); }
//   }, [currentUserId]);

//   useEffect(() => { fetchClaims(); }, [fetchClaims]);

//   const filtered = useMemo(() => {
//     return claims.filter((c) => {
//       const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.submitter_name.toLowerCase().includes(search.toLowerCase()) || c.upload_id.toLowerCase().includes(search.toLowerCase());
//       const matchesStatus = statusFilter === "all" || c.status === statusFilter;
//       let matchesDate = true;
//       if (fromDate || toDate) {
//         const d = parseISO(c.date);
//         if (fromDate && toDate) matchesDate = (isAfter(d, fromDate) || isSameDay(d, fromDate)) && (isBefore(d, toDate) || isSameDay(d, toDate));
//         else if (fromDate) matchesDate = isAfter(d, fromDate) || isSameDay(d, fromDate);
//         else if (toDate) matchesDate = isBefore(d, toDate) || isSameDay(d, toDate);
//       }
//       return matchesSearch && matchesStatus && matchesDate;
//     });
//   }, [claims, search, statusFilter, fromDate, toDate]);

//   const clearDateFilters = () => { setFromDate(undefined); setToDate(undefined); };

//   const handleReviewClick = (claim: Claim) => {
//     setReviewClaim({ upload_id: claim.upload_id, user_id: claim.user_id, submitter_name: claim.submitter_name, title: claim.title, amount: claim.amount, date: claim.date, status: claim.status });
//     setReviewOpen(true);
//   };

//   return (
//     <div className="space-y-6 animate-fade-in">
//       <div>
//         <h1 className="text-2xl font-bold tracking-tight">Sales Bills</h1>
//         <p className="text-muted-foreground text-sm">Review, approve, or reject sales submitted bills</p>
//       </div>

//       <div className="flex flex-wrap gap-3 items-center">
//         <div className="relative flex-1 min-w-[200px] max-w-sm">
//           <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
//           <Input placeholder="Search by bill name, submitted by..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
//         </div>
//         <Select value={statusFilter} onValueChange={setStatusFilter}>
//           <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Status</SelectItem>
//             <SelectItem value="pending">Pending</SelectItem>
//             <SelectItem value="approved">Approved</SelectItem>
//             <SelectItem value="rejected">Rejected</SelectItem>
//           </SelectContent>
//         </Select>
//         <Popover>
//           <PopoverTrigger asChild>
//             <Button variant="outline" size="sm" className={cn("text-xs gap-1.5", !fromDate && "text-muted-foreground")}>
//               <CalendarIcon className="h-3.5 w-3.5" /> {fromDate ? format(fromDate, "dd MMM yyyy") : "Start date"}
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-auto p-0" align="start">
//             <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus className="p-3 pointer-events-auto" />
//           </PopoverContent>
//         </Popover>
//         <span className="text-xs text-muted-foreground">to</span>
//         <Popover>
//           <PopoverTrigger asChild>
//             <Button variant="outline" size="sm" className={cn("text-xs gap-1.5", !toDate && "text-muted-foreground")}>
//               <CalendarIcon className="h-3.5 w-3.5" /> {toDate ? format(toDate, "dd MMM yyyy") : "End date"}
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-auto p-0" align="start">
//             <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus className="p-3 pointer-events-auto" />
//           </PopoverContent>
//         </Popover>
//         {(fromDate || toDate) && (
//           <Button variant="ghost" size="sm" onClick={clearDateFilters} className="text-xs gap-1"><X className="h-3.5 w-3.5" /> Clear</Button>
//         )}
//         <Button variant="ghost" size="sm" onClick={fetchClaims} disabled={loading} className="text-xs gap-1 ml-auto">
//           <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} /> Refresh
//         </Button>
//       </div>

//       <Card>
//         <CardContent className="pt-6">
//           {fetchError && (
//             <div className="flex items-center gap-2 text-destructive text-sm mb-4 p-3 bg-destructive/10 rounded-md">
//               <AlertCircle className="h-4 w-4 shrink-0" /> {fetchError}
//             </div>
//           )}
//           {loading && (
//             <div className="space-y-3 py-4">{[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-muted animate-pulse rounded-md" />)}</div>
//           )}
//           {!loading && !fetchError && (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="border-b text-muted-foreground">
//                     <th className="text-left py-2 font-medium">Bill Name</th>
//                     <th className="text-left py-2 font-medium">Submitted By</th>
//                     <th className="text-right py-2 pr-6 font-medium">Amount</th>
//                     <th className="text-left py-2 pl-6 font-medium">Date</th>
//                     <th className="text-left py-2 font-medium">Status</th>
//                     <th className="text-left py-2 font-medium">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filtered.length === 0
//                     ? <tr><td colSpan={6} className="py-12 text-center text-muted-foreground text-sm">No claims found matching your filters.</td></tr>
//                     : filtered.map((claim) => (
//                       <tr key={claim.upload_id} className="border-b hover:bg-muted/50">
//                         <td className="py-3 font-medium">{claim.title}</td>
//                         <td className="py-3">{claim.submitter_name}</td>
//                         <td className="py-3 text-right pr-6 font-mono">₹{Number(claim.amount).toLocaleString("en-IN")}</td>
//                         <td className="py-3 pl-6 text-muted-foreground">{format(parseISO(claim.date), "dd MMM yyyy")}</td>
//                         <td className="py-3">
//                           <Badge variant="outline" className={statusConfig[claim.status]?.className}>
//                             {statusConfig[claim.status]?.label ?? claim.status}
//                           </Badge>
//                         </td>
//                         <td className="py-3">
//                           <div className="flex items-center gap-1.5">
//                             <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="View claim document" onClick={() => setViewClaim(claim)}>
//                               <Eye className="h-4 w-4 text-muted-foreground" />
//                             </Button>
//                             {claim.status === "pending"
//                               ? <Button variant="outline" size="sm" className="text-xs" onClick={() => handleReviewClick(claim)}>Review</Button>
//                               : <span className="text-xs text-muted-foreground">—</span>
//                             }
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   }
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       <ClaimImageModal open={!!viewClaim} onClose={() => setViewClaim(null)} claim={viewClaim} />
//       <BillReviewModal claim={reviewClaim} open={reviewOpen} onClose={() => { setReviewOpen(false); setReviewClaim(undefined); }} onStatusUpdated={fetchClaims} />
//     </div>
//   );
// }

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, CalendarIcon, X, Eye, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { format, parseISO, isAfter, isBefore, isSameDay } from "date-fns";
// import BillReviewModal, { type ClaimForReview } from "@/pages/ClaimReviewPage";
import { useNavigate } from "react-router-dom";

interface Claim {
  upload_id: string; submitter_name: string; user_id: string; usertype: string;
  amount: string; date: string; status: "pending" | "approved" | "rejected"; title: string;
}

import { API_BASE_URL } from "@/config";

interface StoredUser { user_id: string; name: string; email: string; usertype: string; }

const BASE_URL = API_BASE_URL;

const statusConfig: Record<string, { label: string; className: string }> = {
  pending:  { label: "Pending",  className: "bg-warning/10 text-warning border-warning/20" },
  approved: { label: "Approved", className: "bg-success/10 text-success border-success/20" },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

function getStoredUser(): StoredUser | null {
  try { const raw = localStorage.getItem("user"); return raw ? JSON.parse(raw) : null; } catch { return null; }
}

function ClaimImageModal({ open, onClose, claim }: { open: boolean; onClose: () => void; claim: Claim | null }) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    if (!open || !claim) return;
    let objectUrl: string | null = null;
    setLoading(true); setError(null); setImgUrl(null);
    fetch(`${BASE_URL}/view-original-claim-image?user_id=${claim.user_id}&upload_id=${claim.upload_id}`, { headers: { accept: "image/*" } })
      .then(async (res) => { if (!res.ok) throw new Error(`Server returned ${res.status}`); const blob = await res.blob(); objectUrl = URL.createObjectURL(blob); setImgUrl(objectUrl); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [open, claim]);

  useEffect(() => { if (!open) { setImgUrl(null); setError(null); } }, [open]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{claim ? `${claim.title} — ${claim.submitter_name}` : "Claim Document"}</DialogTitle>
        </DialogHeader>
        <div className="min-h-[300px] flex items-center justify-center">
          {loading && <div className="flex flex-col items-center gap-2 text-muted-foreground"><Loader2 className="h-8 w-8 animate-spin" /><span className="text-sm">Loading document…</span></div>}
          {error && !loading && <div className="flex flex-col items-center gap-2 text-destructive"><AlertCircle className="h-8 w-8" /><span className="text-sm">{error}</span></div>}
          {imgUrl && !loading && <img src={imgUrl} alt="Claim document" className="max-w-full max-h-[70vh] object-contain rounded-md border" />}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function FraudDetectionPage() {
  const [claims, setClaims]           = useState<Claim[]>([]);
  const [loading, setLoading]         = useState(false);
  const [fetchError, setFetchError]   = useState<string | null>(null);
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [fromDate, setFromDate]       = useState<Date | undefined>();
  const [toDate, setToDate]           = useState<Date | undefined>();
  const [viewClaim, setViewClaim]     = useState<Claim | null>(null);
  const navigate = useNavigate();
  // const [reviewClaim, setReviewClaim] = useState<ClaimForReview | undefined>(undefined);
  // const [reviewOpen, setReviewOpen]   = useState(false);

  const storedUser    = getStoredUser();
  const currentUserId = storedUser?.user_id ?? "";

  const fetchClaims = useCallback(async () => {
    if (!currentUserId) { setFetchError("User not found in local storage. Please log in again."); return; }
    setLoading(true); setFetchError(null);
    try {
      const res = await fetch(`${BASE_URL}/get-all-claims?user_id=${currentUserId}&usertype=sales`, { headers: { accept: "application/json" } });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setClaims(data.claims ?? []);
    } catch (err: any) {
      setFetchError(err.message ?? "Failed to fetch claims");
    } finally { setLoading(false); }
  }, [currentUserId]);

  useEffect(() => { fetchClaims(); }, [fetchClaims]);

  const filtered = useMemo(() => {
    return claims.filter((c) => {
      const matchesSearch = 
        (c.title || "").toLowerCase().includes(search.toLowerCase()) || 
        (c.submitter_name || "").toLowerCase().includes(search.toLowerCase()) || 
        (c.upload_id || "").toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      let matchesDate = true;
      if (fromDate || toDate) {
        const d = parseISO(c.date);
        if (fromDate && toDate) matchesDate = (isAfter(d, fromDate) || isSameDay(d, fromDate)) && (isBefore(d, toDate) || isSameDay(d, toDate));
        else if (fromDate) matchesDate = isAfter(d, fromDate) || isSameDay(d, fromDate);
        else if (toDate) matchesDate = isBefore(d, toDate) || isSameDay(d, toDate);
      }
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [claims, search, statusFilter, fromDate, toDate]);

  const clearDateFilters = () => { setFromDate(undefined); setToDate(undefined); };

  const handleReviewClick = (claim: Claim) => {
  navigate(`/fraud/${claim.upload_id}/review`, { state: { claim } });
};

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sales Bills</h1>
        <p className="text-muted-foreground text-sm">Review, approve, or reject sales submitted bills</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-9 h-11 md:h-9 rounded-xl md:rounded-lg" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="flex-1 md:w-[140px] h-11 md:h-9 rounded-xl md:rounded-lg"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn("text-xs gap-1.5 h-11 md:h-9 rounded-xl md:rounded-lg whitespace-nowrap px-4", !fromDate && "text-muted-foreground")}>
                <CalendarIcon className="h-3.5 w-3.5" /> {fromDate ? format(fromDate, "dd MMM") : "Start"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
          <span className="text-xs text-muted-foreground">to</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn("text-xs gap-1.5 h-11 sm:h-9 rounded-xl sm:rounded-lg whitespace-nowrap px-4", !toDate && "text-muted-foreground")}>
                <CalendarIcon className="h-3.5 w-3.5" /> {toDate ? format(toDate, "dd MMM") : "End"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
          {(fromDate || toDate) && (
            <Button variant="ghost" size="sm" onClick={clearDateFilters} className="text-xs gap-1 h-11 sm:h-9"><X className="h-3.5 w-3.5" /> Clear</Button>
          )}
        </div>

        <Button variant="ghost" size="sm" onClick={() => { hapticImpactLight(); fetchClaims(); }} disabled={loading} className="text-xs gap-1 h-11 sm:h-9 sm:ml-auto">
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} /> Refresh
        </Button>
      </div>

      <div>
        {fetchError && (
          <div className="flex items-center gap-2 text-destructive text-sm mb-4 p-4 bg-destructive/5 rounded-2xl border border-destructive/10">
            <AlertCircle className="h-4 w-4 shrink-0" /> {fetchError}
          </div>
        )}

        {loading ? (
          <div className="space-y-3 py-4">{[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-muted animate-pulse rounded-2xl" />)}</div>
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
                          <th className="text-left py-2 font-medium">Bill Name</th>
                          <th className="text-left py-2 font-medium">Submitted By</th>
                          <th className="text-right py-2 pr-6 font-medium">Amount</th>
                          <th className="text-left py-2 pl-6 font-medium">Date</th>
                          <th className="text-left py-2 font-medium">Status</th>
                          <th className="text-left py-2 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.length === 0
                          ? <tr><td colSpan={6} className="py-12 text-center text-muted-foreground text-sm">No claims found matching your filters.</td></tr>
                          : filtered.map((claim) => (
                            <tr key={claim.upload_id} className="border-b hover:bg-muted/50 transition-colors">
                              <td className="py-3 font-medium">{claim.title}</td>
                              <td className="py-3">{claim.submitter_name}</td>
                              <td className="py-3 text-right pr-6 font-mono">₹{Number(claim.amount).toLocaleString("en-IN")}</td>
                              <td className="py-3 pl-6 text-muted-foreground">{format(parseISO(claim.date), "dd MMM yyyy")}</td>
                              <td className="py-3">
                                <Badge variant="outline" className={statusConfig[claim.status]?.className}>
                                  {statusConfig[claim.status]?.label ?? claim.status}
                                </Badge>
                              </td>
                              <td className="py-3">
                                <div className="flex items-center gap-1.5">
                                  {claim.status === "pending"
                                    ? <Button variant="outline" size="sm" className="text-xs h-7 px-3" onClick={() => handleReviewClick(claim)}>Review</Button>
                                    : <span className="text-xs text-muted-foreground">—</span>
                                  }
                                </div>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {filtered.map((claim) => (
                <Card key={claim.upload_id} className="overflow-hidden border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-mono text-muted-foreground mb-0.5">
                          #{claim.upload_id.slice(-8).toUpperCase()}
                        </p>
                        <h3 className="font-bold text-slate-900 truncate">{claim.title}</h3>
                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tight mt-0.5">
                          By {claim.submitter_name}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn("text-[10px] font-bold uppercase tracking-tight shrink-0", statusConfig[claim.status]?.className)}
                      >
                        {statusConfig[claim.status]?.label ?? claim.status}
                      </Badge>
                    </div>

                    <div className="flex items-end justify-between pt-3 border-t border-slate-50">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-0.5">
                          {format(parseISO(claim.date), "dd MMM yyyy")}
                        </p>
                        <p className="text-lg font-black text-slate-900">
                          ₹{Number(claim.amount).toLocaleString("en-IN")}
                        </p>
                      </div>

                      {claim.status === "pending" ? (
                        <Button
                          size="sm"
                          className="h-10 px-6 rounded-xl font-bold shadow-md shadow-primary/10"
                          onClick={() => handleReviewClick(claim)}
                        >
                          Review
                        </Button>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center">
                          <CheckCircle2 className={cn("h-5 w-5", claim.status === 'approved' ? "text-success" : "text-destructive")} />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filtered.length === 0 && !loading && (
                <div className="py-20 text-center bg-white border rounded-2xl">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                    No claims found
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <ClaimImageModal open={!!viewClaim} onClose={() => setViewClaim(null)} claim={viewClaim} />
      {/* <BillReviewModal claim={reviewClaim} open={reviewOpen} onClose={() => { setReviewOpen(false); setReviewClaim(undefined); }} onStatusUpdated={fetchClaims} /> */}
    </div>
  );
}