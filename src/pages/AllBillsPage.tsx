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

// export default function AllBillsPage() {
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState<string>("all");
//   const [fromDate, setFromDate] = useState<Date | undefined>();
//   const [toDate, setToDate] = useState<Date | undefined>();
//   const [reviewBillId, setReviewBillId] = useState<string | null>(null);
//   const [viewBillId, setViewBillId] = useState<string | null>(null);

//   const filtered = useMemo(() => {
//     return mockBills
//       .filter((b) => b.role === "vendor")
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
//         <h1 className="text-2xl font-bold tracking-tight">Vendor Bills</h1>
//         <p className="text-muted-foreground text-sm">Review, approve, or reject vendor submitted bills</p>
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
//                   <th className="text-left py-2 font-medium">Vendor</th>
//                   <th className="text-left py-2 font-medium">Uploaded By</th>
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
//                     <td className="py-3 text-muted-foreground">{bill.uploadedBy}</td>
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



// import React, { useState, useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Search, CalendarIcon, X, Eye, Loader2 } from "lucide-react";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { cn } from "@/lib/utils";
// import { format, parseISO, isAfter, isBefore, isSameDay } from "date-fns";
// import BillReviewModal, { ClaimForReview } from "@/components/BillReviewModal";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// const BASE_URL = "https://d2ontk4ewdype3.cloudfront.net";

// const statusConfig = {
//   pending:  { label: "Pending",  className: "bg-warning/10 text-warning border-warning/20" },
//   approved: { label: "Approved", className: "bg-success/10 text-success border-success/20" },
//   rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
// };

// function getStoredUser(): { user_id: string; usertype: string } | null {
//   try {
//     const raw = localStorage.getItem("user");
//     return raw ? JSON.parse(raw) : null;
//   } catch {
//     return null;
//   }
// }

// // ─── Image Preview Modal ──────────────────────────────────────────────────────

// function ImagePreviewModal({
//   open,
//   onClose,
//   userId,
//   uploadId,
// }: {
//   open: boolean;
//   onClose: () => void;
//   userId: string;
//   uploadId: string;
// }) {
//   const [imgUrl, setImgUrl] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!open || !userId || !uploadId) return;
//     setImgUrl(null);
//     setError(null);
//     setLoading(true);
//     fetch(
//       `${BASE_URL}/view-original-claim-image?user_id=${userId}&upload_id=${uploadId}`,
//       { headers: { accept: "image/*" } }
//     )
//       .then(async (res) => {
//         if (!res.ok) throw new Error(`Failed to load image: ${res.status}`);
//         const blob = await res.blob();
//         setImgUrl(URL.createObjectURL(blob));
//       })
//       .catch((e) => setError(e.message))
//       .finally(() => setLoading(false));

//     return () => {
//       if (imgUrl) URL.revokeObjectURL(imgUrl);
//     };
//   }, [open, userId, uploadId]);

//   return (
//     <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
//       <DialogContent className="sm:max-w-2xl">
//         <DialogHeader>
//           <DialogTitle className="text-sm">Document Preview</DialogTitle>
//         </DialogHeader>
//         <div className="min-h-[300px] flex items-center justify-center rounded-lg border bg-muted/20 overflow-hidden">
//           {loading && (
//             <div className="flex flex-col items-center gap-2 text-muted-foreground">
//               <Loader2 className="h-6 w-6 animate-spin" />
//               <span className="text-xs">Loading image…</span>
//             </div>
//           )}
//           {error && !loading && (
//             <p className="text-xs text-destructive">{error}</p>
//           )}
//           {imgUrl && !loading && (
//             <img
//               src={imgUrl}
//               alt="Claim document"
//               className="w-full h-full object-contain max-h-[60vh]"
//             />
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// // ─── Main Page ────────────────────────────────────────────────────────────────

// export default function AllBillsPage() {
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState<string>("all");
//   const [fromDate, setFromDate] = useState<Date | undefined>();
//   const [toDate, setToDate] = useState<Date | undefined>();

//   // API state
//   const [claims, setClaims] = useState<ClaimForReview[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Modal state
//   const [reviewClaim, setReviewClaim] = useState<ClaimForReview | undefined>();
//   const [previewClaim, setPreviewClaim] = useState<ClaimForReview | undefined>();

//   // Fetch claims on mount
//   useEffect(() => {
//     const user = getStoredUser();
//     if (!user) return;

//     setLoading(true);
//     setError(null);

//     fetch(
//       `${BASE_URL}/get-all-claims?user_id=${user.user_id}&usertype=vendor`,
//       { headers: { accept: "application/json" } }
//     )
//       .then(async (res) => {
//         if (!res.ok) throw new Error(`Failed to fetch claims: ${res.status}`);
//         const data = await res.json();
//         setClaims(data.claims ?? []);
//       })
//       .catch((e) => setError(e.message))
//       .finally(() => setLoading(false));
//   }, []);

//   // Refresh after status update
//   const handleStatusUpdated = () => {
//     const user = getStoredUser();
//     if (!user) return;
//     fetch(
//       `${BASE_URL}/get-all-claims?user_id=${user.user_id}&usertype=vendor`,
//       { headers: { accept: "application/json" } }
//     )
//       .then((res) => res.json())
//       .then((data) => setClaims(data.claims ?? []))
//       .catch(() => {});
//   };

//   // Filter
//   const filtered = claims.filter((c) => {
//     const matchesSearch =
//       c.title.toLowerCase().includes(search.toLowerCase()) ||
//       c.submitter_name.toLowerCase().includes(search.toLowerCase()) ||
//       c.upload_id.toLowerCase().includes(search.toLowerCase());
//     const matchesStatus = statusFilter === "all" || c.status === statusFilter;
//     let matchesDate = true;
//     if (fromDate || toDate) {
//       const d = parseISO(c.date);
//       if (fromDate && toDate) {
//         matchesDate =
//           (isAfter(d, fromDate) || isSameDay(d, fromDate)) &&
//           (isBefore(d, toDate) || isSameDay(d, toDate));
//       } else if (fromDate) {
//         matchesDate = isAfter(d, fromDate) || isSameDay(d, fromDate);
//       } else if (toDate) {
//         matchesDate = isBefore(d, toDate) || isSameDay(d, toDate);
//       }
//     }
//     return matchesSearch && matchesStatus && matchesDate;
//   });

//   const clearDateFilters = () => {
//     setFromDate(undefined);
//     setToDate(undefined);
//   };

//   return (
//     <div className="space-y-6 animate-fade-in">
//       <div>
//         <h1 className="text-2xl font-bold tracking-tight">Vendor Bills</h1>
//         <p className="text-muted-foreground text-sm">
//           Review, approve, or reject vendor submitted bills
//         </p>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-3 items-center">
//         <div className="relative flex-1 min-w-[200px] max-w-sm">
//           <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             placeholder="Search by title, submitter, upload ID..."
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
//               className={cn("p-3 pointer-events-auto")}
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
//               className={cn("p-3 pointer-events-auto")}
//             />
//           </PopoverContent>
//         </Popover>
//         {(fromDate || toDate) && (
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={clearDateFilters}
//             className="text-xs gap-1"
//           >
//             <X className="h-3.5 w-3.5" /> Clear
//           </Button>
//         )}
//       </div>

//       {/* Table */}
//       <Card>
//         <CardContent className="pt-6">
//           {loading ? (
//             <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground">
//               <Loader2 className="h-5 w-5 animate-spin" />
//               <span className="text-sm">Loading claims…</span>
//             </div>
//           ) : error ? (
//             <div className="text-center py-16 text-destructive text-sm">{error}</div>
//           ) : (
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
//                       <td colSpan={6} className="text-center py-10 text-muted-foreground text-xs">
//                         No bills found.
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
//                         <td className="py-3 pl-6 text-muted-foreground">{claim.date}</td>
//                         <td className="py-3">
//                           <Badge
//                             variant="outline"
//                             className={statusConfig[claim.status]?.className}
//                           >
//                             {statusConfig[claim.status]?.label ?? claim.status}
//                           </Badge>
//                         </td>
//                         <td className="py-3">
//                           <div className="flex items-center gap-1.5">
//                             {/* Eye — preview document image */}
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               className="h-8 w-8 p-0"
//                               onClick={() => setPreviewClaim(claim)}
//                             >
//                               <Eye className="h-4 w-4 text-muted-foreground" />
//                             </Button>
//                             {/* Review — only for pending */}
//                             {claim.status === "pending" ? (
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 className="text-xs"
//                                 onClick={() => setReviewClaim(claim)}
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

//       {/* Review Modal */}
//       <BillReviewModal
//         claim={reviewClaim}
//         open={!!reviewClaim}
//         onClose={() => setReviewClaim(undefined)}
//         onStatusUpdated={handleStatusUpdated}
//       />

//       {/* Image Preview Modal */}
//       {previewClaim && (
//         <ImagePreviewModal
//           open={!!previewClaim}
//           onClose={() => setPreviewClaim(undefined)}
//           userId={previewClaim.user_id}
//           uploadId={previewClaim.upload_id}
//         />
//       )}
//     </div>
//   );
// }

// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { 
//   Search, 
//   CalendarIcon, 
//   X, 
//   Eye, 
//   Loader2, 
//   ReceiptText, 
//   ArrowUpDown, 
//   ArrowUp, 
//   ArrowDown, 
//   RefreshCw,
//   CheckCircle2,
//   XCircle
// } from "lucide-react";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { cn } from "@/lib/utils";
// import { format, parseISO, isAfter, isBefore, isSameDay } from "date-fns";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogDescription
// } from "@/components/ui/dialog";

// const BASE_URL = "https://d2ontk4ewdype3.cloudfront.net";

// const statusConfig: Record<string, { label: string; className: string }> = {
//   pending:  { label: "Pending",  className: "bg-warning/10 text-warning border-warning/20" },
//   approved: { label: "Approved", className: "bg-success/10 text-success border-success/20" },
//   rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
// };

// // ─── Types ────────────────────────────────────────────────────────────────────

// export interface ClaimForReview {
//   upload_id: string;
//   user_id: string;
//   submitter_name: string;
//   title: string;
//   amount: string;
//   date: string;
//   status: "pending" | "approved" | "rejected";
// }

// type SortConfig = {
//   key: keyof ClaimForReview | "";
//   direction: "asc" | "desc";
// };

// // ─── Helpers ─────────────────────────────────────────────────────────────────

// function getStoredUser(): { user_id: string; usertype: string } | null {
//   try {
//     const raw = localStorage.getItem("user");
//     return raw ? JSON.parse(raw) : null;
//   } catch {
//     return null;
//   }
// }

// // ─── Bill Review Modal ────────────────────────────────────────────────────────

// function BillReviewModal({
//   claim,
//   open,
//   onClose,
//   onStatusUpdated,
// }: {
//   claim?: ClaimForReview;
//   open: boolean;
//   onClose: () => void;
//   onStatusUpdated: () => void;
// }) {
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleUpdateStatus = async (newStatus: "approved" | "rejected") => {
//     if (!claim) return;
//     setSubmitting(true);
//     setError(null);

//     try {
//       const user = getStoredUser();
//       if (!user) throw new Error("User session not found");

//       const response = await fetch(`${BASE_URL}/update-claim-status`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           user_id: claim.user_id,
//           upload_id: claim.upload_id,
//           status: newStatus,
//           reviewer_id: user.user_id,
//         }),
//       });

//       if (!response.ok) throw new Error("Failed to update status");

//       onStatusUpdated();
//       onClose();
//     } catch (err: any) {
//       setError(err.message || "An error occurred");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (!claim) return null;

//   return (
//     <Dialog open={open} onOpenChange={(v) => !v && !submitting && onClose()}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Review Bill</DialogTitle>
//           <DialogDescription>
//             Verify the details below before approving or rejecting this vendor bill.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-4 py-4">
//           <div className="grid grid-cols-2 gap-4 text-sm">
//             <div>
//               <p className="text-muted-foreground">Vendor/Submitter</p>
//               <p className="font-medium">{claim.submitter_name}</p>
//             </div>
//             <div>
//               <p className="text-muted-foreground">Amount</p>
//               <p className="font-medium">₹{Number(claim.amount).toLocaleString("en-IN")}</p>
//             </div>
//             <div>
//               <p className="text-muted-foreground">Date</p>
//               <p className="font-medium">{format(parseISO(claim.date), "dd MMM yyyy")}</p>
//             </div>
//             <div>
//               <p className="text-muted-foreground">Upload ID</p>
//               <p className="font-mono text-[10px] break-all">{claim.upload_id}</p>
//             </div>
//           </div>

//           {error && (
//             <div className="p-2 rounded bg-destructive/10 text-destructive text-xs flex items-center gap-2">
//               <XCircle className="h-3.5 w-3.5" />
//               {error}
//             </div>
//           )}
//         </div>

//         <DialogFooter className="flex sm:justify-between gap-2">
//           <Button
//             variant="outline"
//             onClick={onClose}
//             disabled={submitting}
//             className="flex-1 sm:flex-none"
//           >
//             Cancel
//           </Button>
//           <div className="flex gap-2 flex-1 sm:flex-none">
//             <Button
//               variant="destructive"
//               className="flex-1 gap-1.5"
//               onClick={() => handleUpdateStatus("rejected")}
//               disabled={submitting}
//             >
//               {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
//               Reject
//             </Button>
//             <Button
//               variant="default"
//               className="flex-1 bg-success hover:bg-success/90 text-white gap-1.5"
//               onClick={() => handleUpdateStatus("approved")}
//               disabled={submitting}
//             >
//               {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
//               Approve
//             </Button>
//           </div>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

// // ─── Image Preview Modal ──────────────────────────────────────────────────────

// function ImagePreviewModal({
//   open,
//   onClose,
//   userId,
//   uploadId,
// }: {
//   open: boolean;
//   onClose: () => void;
//   userId: string;
//   uploadId: string;
// }) {
//   const [imgUrl, setImgUrl] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!open || !userId || !uploadId) return;
//     setImgUrl(null);
//     setError(null);
//     setLoading(true);
//     fetch(
//       `${BASE_URL}/view-original-claim-image?user_id=${userId}&upload_id=${uploadId}`,
//       { headers: { accept: "image/*" } }
//     )
//       .then(async (res) => {
//         if (!res.ok) throw new Error(`Failed to load image: ${res.status}`);
//         const blob = await res.blob();
//         setImgUrl(URL.createObjectURL(blob));
//       })
//       .catch((e) => setError(e.message))
//       .finally(() => setLoading(false));

//     return () => {
//       if (imgUrl) URL.revokeObjectURL(imgUrl);
//     };
//   }, [open, userId, uploadId]);

//   return (
//     <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
//       <DialogContent className="sm:max-w-2xl">
//         <DialogHeader>
//           <DialogTitle className="text-sm">Document Preview</DialogTitle>
//         </DialogHeader>
//         <div className="min-h-[300px] flex items-center justify-center rounded-lg border bg-muted/20 overflow-hidden">
//           {loading && (
//             <div className="flex flex-col items-center gap-2 text-muted-foreground">
//               <Loader2 className="h-6 w-6 animate-spin" />
//               <span className="text-xs">Loading image…</span>
//             </div>
//           )}
//           {error && !loading && (
//             <p className="text-xs text-destructive">{error}</p>
//           )}
//           {imgUrl && !loading && (
//             <img
//               src={imgUrl}
//               alt="Claim document"
//               className="w-full h-full object-contain max-h-[60vh]"
//             />
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// // ─── Main Page ────────────────────────────────────────────────────────────────

// export default function AllBillsPage() {
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState<string>("all");
//   const [fromDate, setFromDate] = useState<Date | undefined>();
//   const [toDate, setToDate] = useState<Date | undefined>();

//   // API state
//   const [claims, setClaims] = useState<ClaimForReview[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Modal state
//   const [reviewClaim, setReviewClaim] = useState<ClaimForReview | undefined>();
//   const [previewClaim, setPreviewClaim] = useState<ClaimForReview | undefined>();

//   // Sorting state
//   const [sortConfig, setSortConfig] = useState<SortConfig>({ 
//     key: "date", 
//     direction: "desc" 
//   });

//   const fetchClaims = useCallback(() => {
//     const user = getStoredUser();
//     if (!user) return;

//     setLoading(true);
//     setError(null);

//     fetch(
//       `${BASE_URL}/get-all-claims?user_id=${user.user_id}&usertype=vendor`,
//       { headers: { accept: "application/json" } }
//     )
//       .then(async (res) => {
//         if (!res.ok) throw new Error(`Failed to fetch claims: ${res.status}`);
//         const data = await res.json();
//         setClaims(data.claims ?? []);
//       })
//       .catch((e) => setError(e.message))
//       .finally(() => setLoading(false));
//   }, []);

//   // Fetch claims on mount
//   useEffect(() => {
//     fetchClaims();
//   }, [fetchClaims]);

//   // Refresh after status update
//   const handleStatusUpdated = () => {
//     fetchClaims();
//   };

//   const requestSort = (key: keyof ClaimForReview) => {
//     let direction: "asc" | "desc" = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });
//   };

//   const getSortIcon = (key: keyof ClaimForReview) => {
//     if (sortConfig.key !== key) return <ArrowUpDown className="ml-1 h-3 w-3 text-muted-foreground" />;
//     return sortConfig.direction === "asc" ? 
//       <ArrowUp className="ml-1 h-3 w-3 text-primary" /> : 
//       <ArrowDown className="ml-1 h-3 w-3 text-primary" />;
//   };

//   // Filter & Sort
//   const filtered = useMemo(() => {
//     let result = claims.filter((c) => {
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

//     if (sortConfig.key) {
//       result.sort((a, b) => {
//         let valA: any = a[sortConfig.key as keyof ClaimForReview];
//         let valB: any = b[sortConfig.key as keyof ClaimForReview];
        
//         if (sortConfig.key === "amount") {
//           valA = Number(valA);
//           valB = Number(valB);
//         }

//         if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
//         if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
//         return 0;
//       });
//     }

//     return result;
//   }, [claims, search, statusFilter, fromDate, toDate, sortConfig]);

//   const clearDateFilters = () => {
//     setFromDate(undefined);
//     setToDate(undefined);
//   };

//   return (
//     <div className="space-y-6 animate-fade-in">
//       <div className="flex items-center gap-3">
//         <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
//           <ReceiptText className="h-5 w-5 text-primary" />
//         </div>
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight">Vendor Bills</h1>
//           <p className="text-muted-foreground text-sm">
//             Review, approve, or reject vendor submitted bills
//           </p>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-3 items-center">
//         <div className="relative flex-1 min-w-[200px] max-w-sm">
//           <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             placeholder="Search by title, submitter, upload ID..."
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
//               className={cn("p-3 pointer-events-auto")}
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
//               className={cn("p-3 pointer-events-auto")}
//             />
//           </PopoverContent>
//         </Popover>
//         {(fromDate || toDate) && (
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={clearDateFilters}
//             className="text-xs gap-1"
//           >
//             <X className="h-3.5 w-3.5" /> Clear
//           </Button>
//         )}
//         <Button 
//           variant="ghost" 
//           size="sm" 
//           onClick={fetchClaims} 
//           disabled={loading} 
//           className="text-xs gap-1 ml-auto"
//         >
//           <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} /> Refresh
//         </Button>
//       </div>

//       {/* Table */}
//       <Card>
//         <CardContent className="pt-6">
//           {loading ? (
//             <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground">
//               <Loader2 className="h-5 w-5 animate-spin" />
//               <span className="text-sm">Loading claims…</span>
//             </div>
//           ) : error ? (
//             <div className="text-center py-16 text-destructive text-sm">{error}</div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="border-b text-muted-foreground">
//                     <th className="text-left py-2 font-medium cursor-pointer" onClick={() => requestSort("title")}>
//                       <div className="flex items-center">Bill Name {getSortIcon("title")}</div>
//                     </th>
//                     <th className="text-left py-2 font-medium cursor-pointer" onClick={() => requestSort("submitter_name")}>
//                       <div className="flex items-center">Submitted By {getSortIcon("submitter_name")}</div>
//                     </th>
//                     <th className="text-right py-2 pr-6 font-medium cursor-pointer" onClick={() => requestSort("amount")}>
//                       <div className="flex items-center justify-end">Amount {getSortIcon("amount")}</div>
//                     </th>
//                     <th className="text-left py-2 pl-6 font-medium cursor-pointer" onClick={() => requestSort("date")}>
//                       <div className="flex items-center">Date {getSortIcon("date")}</div>
//                     </th>
//                     <th className="text-left py-2 font-medium cursor-pointer" onClick={() => requestSort("status")}>
//                       <div className="flex items-center">Status {getSortIcon("status")}</div>
//                     </th>
//                     <th className="text-left py-2 font-medium">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filtered.length === 0 ? (
//                     <tr>
//                       <td colSpan={6} className="text-center py-10 text-muted-foreground text-xs">
//                         No bills found.
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
//                           <Badge
//                             variant="outline"
//                             className={statusConfig[claim.status]?.className}
//                           >
//                             {statusConfig[claim.status]?.label ?? claim.status}
//                           </Badge>
//                         </td>
//                         <td className="py-3">
//                           <div className="flex items-center gap-1.5">
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               className="h-8 w-8 p-0"
//                               onClick={() => setPreviewClaim(claim)}
//                             >
//                               <Eye className="h-4 w-4 text-muted-foreground" />
//                             </Button>
//                             {claim.status === "pending" ? (
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 className="text-xs"
//                                 onClick={() => setReviewClaim(claim)}
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

//       {/* Review Modal */}
//       <BillReviewModal
//         claim={reviewClaim}
//         open={!!reviewClaim}
//         onClose={() => setReviewClaim(undefined)}
//         onStatusUpdated={handleStatusUpdated}
//       />

//       {/* Image Preview Modal */}
//       {previewClaim && (
//         <ImagePreviewModal
//           open={!!previewClaim}
//           onClose={() => setPreviewClaim(undefined)}
//           userId={previewClaim.user_id}
//           uploadId={previewClaim.upload_id}
//         />
//       )}
//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, CalendarIcon, X, Eye, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, parseISO, isAfter, isBefore, isSameDay } from "date-fns";
// import BillReviewModal, { ClaimForReview } from "@/pages/ClaimReviewPage";
import { type ClaimForReview } from "@/pages/ClaimReviewPage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/config";

const BASE_URL = API_BASE_URL;

const statusConfig = {
  pending:  { label: "Pending",  className: "bg-warning/10 text-warning border-warning/20" },
  approved: { label: "Approved", className: "bg-success/10 text-success border-success/20" },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

function getStoredUser(): { user_id: string; usertype: string } | null {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ─── Image Preview Modal ──────────────────────────────────────────────────────

function ImagePreviewModal({
  open,
  onClose,
  userId,
  uploadId,
}: {
  open: boolean;
  onClose: () => void;
  userId: string;
  uploadId: string;
}) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !userId || !uploadId) return;
    setImgUrl(null);
    setError(null);
    setLoading(true);
    fetch(
      `${BASE_URL}/view-original-claim-image?user_id=${userId}&upload_id=${uploadId}`,
      { headers: { accept: "image/*" } }
    )
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to load image: ${res.status}`);
        const blob = await res.blob();
        setImgUrl(URL.createObjectURL(blob));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));

    return () => {
      if (imgUrl) URL.revokeObjectURL(imgUrl);
    };
  }, [open, userId, uploadId]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-sm">Document Preview</DialogTitle>
        </DialogHeader>
        <div className="min-h-[300px] flex items-center justify-center rounded-lg border bg-muted/20 overflow-hidden">
          {loading && (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-xs">Loading image…</span>
            </div>
          )}
          {error && !loading && (
            <p className="text-xs text-destructive">{error}</p>
          )}
          {imgUrl && !loading && (
            <img
              src={imgUrl}
              alt="Claim document"
              className="w-full h-full object-contain max-h-[60vh]"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AllBillsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();

  // API state
  const [claims, setClaims] = useState<ClaimForReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Modal state
  // const [reviewClaim, setReviewClaim] = useState<ClaimForReview | undefined>();
  const [previewClaim, setPreviewClaim] = useState<ClaimForReview | undefined>();

  // Fetch claims on mount
  useEffect(() => {
    const user = getStoredUser();
    if (!user) return;

    setLoading(true);
    setError(null);

    fetch(
      `${BASE_URL}/get-all-claims?user_id=${user.user_id}&usertype=vendor`,
      { headers: { accept: "application/json" } }
    )
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to fetch claims: ${res.status}`);
        const data = await res.json();
        setClaims(data.claims ?? []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Refresh after status update
  const handleStatusUpdated = () => {
    const user = getStoredUser();
    if (!user) return;
    fetch(
      `${BASE_URL}/get-all-claims?user_id=${user.user_id}&usertype=vendor`,
      { headers: { accept: "application/json" } }
    )
      .then((res) => res.json())
      .then((data) => setClaims(data.claims ?? []))
      .catch(() => {});
  };

  // Filter
  const filtered = claims.filter((c) => {
    const matchesSearch =
      (c.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.submitter_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.upload_id || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    let matchesDate = true;
    if (fromDate || toDate) {
      const d = parseISO(c.date);
      if (fromDate && toDate) {
        matchesDate =
          (isAfter(d, fromDate) || isSameDay(d, fromDate)) &&
          (isBefore(d, toDate) || isSameDay(d, toDate));
      } else if (fromDate) {
        matchesDate = isAfter(d, fromDate) || isSameDay(d, fromDate);
      } else if (toDate) {
        matchesDate = isBefore(d, toDate) || isSameDay(d, toDate);
      }
    }
    return matchesSearch && matchesStatus && matchesDate;
  });

  const clearDateFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Vendor Bills</h1>
        <p className="text-muted-foreground text-sm">
          Review, approve, or reject vendor submitted bills
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9 h-11 md:h-9 rounded-xl md:rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="flex-1 md:w-[140px] h-11 md:h-9 rounded-xl md:rounded-lg">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
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
              <Button
                variant="outline"
                size="sm"
                className={cn("text-xs gap-1.5 h-11 md:h-9 rounded-xl md:rounded-lg whitespace-nowrap px-4", !fromDate && "text-muted-foreground")}
              >
                <CalendarIcon className="h-3.5 w-3.5" />
                {fromDate ? format(fromDate, "dd MMM") : "Start"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={fromDate}
                onSelect={setFromDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          <span className="text-xs text-muted-foreground">to</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn("text-xs gap-1.5 h-11 md:h-9 rounded-xl md:rounded-lg whitespace-nowrap px-4", !toDate && "text-muted-foreground")}
              >
                <CalendarIcon className="h-3.5 w-3.5" />
                {toDate ? format(toDate, "dd MMM") : "End"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={toDate}
                onSelect={setToDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          {(fromDate || toDate) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearDateFilters}
              className="text-xs gap-1 h-11 sm:h-9"
            >
              <X className="h-3.5 w-3.5" /> Clear
            </Button>
          )}
        </div>
      </div>

      {/* List */}
      <div>
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading claims…</span>
          </div>
        ) : error ? (
          <div className="text-center py-16 text-destructive text-sm">{error}</div>
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
                        {filtered.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-10 text-muted-foreground text-xs">
                              No bills found.
                            </td>
                          </tr>
                        ) : (
                          filtered.map((claim) => (
                            <tr key={claim.upload_id} className="border-b hover:bg-muted/50 transition-colors">
                              <td className="py-3 font-medium">{claim.title}</td>
                              <td className="py-3">{claim.submitter_name}</td>
                              <td className="py-3 text-right pr-6 font-mono">
                                ₹{Number(claim.amount).toLocaleString("en-IN")}
                              </td>
                              <td className="py-3 pl-6 text-muted-foreground">{claim.date}</td>
                              <td className="py-3">
                                <Badge
                                  variant="outline"
                                  className={statusConfig[claim.status]?.className}
                                >
                                  {statusConfig[claim.status]?.label ?? claim.status}
                                </Badge>
                              </td>
                              <td className="py-3">
                                <div className="flex items-center gap-1.5">
                                  {claim.status === "pending" ? (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-xs h-7 px-3"
                                      onClick={() => navigate(`/fraud/${claim.upload_id}/review`, { state: { claim } })}
                                    >
                                      Review
                                    </Button>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">—</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
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
                          {claim.date}
                        </p>
                        <p className="text-lg font-black text-slate-900">
                          ₹{Number(claim.amount).toLocaleString("en-IN")}
                        </p>
                      </div>

                      {claim.status === "pending" ? (
                        <Button
                          size="sm"
                          className="h-10 px-6 rounded-xl font-bold shadow-md shadow-primary/10"
                          onClick={() => navigate(`/fraud/${claim.upload_id}/review`, { state: { claim } })}
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

              {filtered.length === 0 && (
                <div className="py-20 text-center bg-white border rounded-2xl">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                    No bills found
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Review Modal */}
      {/* <BillReviewModal
        claim={reviewClaim}
        open={!!reviewClaim}
        onClose={() => setReviewClaim(undefined)}
        onStatusUpdated={handleStatusUpdated}
      /> */}

      {/* Image Preview Modal */}
      {previewClaim && (
        <ImagePreviewModal
          open={!!previewClaim}
          onClose={() => setPreviewClaim(undefined)}
          userId={previewClaim.user_id}
          uploadId={previewClaim.upload_id}
        />
      )}
    </div>
  );
}