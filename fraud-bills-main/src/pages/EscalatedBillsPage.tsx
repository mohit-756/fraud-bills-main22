// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { format, isAfter, isBefore, isSameDay, parseISO } from "date-fns";
// import { AlertCircle, CalendarIcon, Eye, Loader2, RefreshCw, Search, X } from "lucide-react";
// import BillReviewModal, { type ClaimForReview } from "@/components/BillReviewModal";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { Card, CardContent } from "@/components/ui/card";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { cn } from "@/lib/utils";

// interface Claim {
//   upload_id: string;
//   submitter_name: string;
//   user_id: string;
//   usertype: "sales" | "vendor";
//   amount: string;
//   date: string;
//   status: "pending" | "approved" | "rejected" | "escalated";
//   title: string;
// }

// interface StoredUser {
//   user_id: string;
// }

// const BASE_URL = "https://d2ontk4ewdype3.cloudfront.net";

// const billTypeConfig: Record<Claim["usertype"], { label: string; className: string }> = {
//   sales: { label: "Sales", className: "bg-primary/10 text-primary border-primary/20" },
//   vendor: { label: "Vendor", className: "bg-warning/10 text-warning border-warning/20" },
// };

// const statusConfig: Record<Claim["status"], { label: string; className: string }> = {
//   pending: { label: "Pending", className: "bg-warning/10 text-warning border-warning/20" },
//   approved: { label: "Approved", className: "bg-success/10 text-success border-success/20" },
//   rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
//   escalated: { label: "Escalated", className: "bg-destructive/10 text-destructive border-destructive/20" },
// };

// function getStoredUser(): StoredUser | null {
//   try {
//     const raw = localStorage.getItem("user");
//     return raw ? JSON.parse(raw) : null;
//   } catch {
//     return null;
//   }
// }

// function ClaimImageModal({
//   open,
//   onClose,
//   claim,
// }: {
//   open: boolean;
//   onClose: () => void;
//   claim: Claim | null;
// }) {
//   const [imgUrl, setImgUrl] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!open || !claim) return;

//     let objectUrl: string | null = null;

//     setLoading(true);
//     setError(null);
//     setImgUrl(null);

//     fetch(`${BASE_URL}/view-original-claim-image?user_id=${claim.user_id}&upload_id=${claim.upload_id}`, {
//       headers: { accept: "image/*" },
//     })
//       .then(async (res) => {
//         if (!res.ok) throw new Error(`Server returned ${res.status}`);
//         const blob = await res.blob();
//         objectUrl = URL.createObjectURL(blob);
//         setImgUrl(objectUrl);
//       })
//       .catch((e: Error) => setError(e.message))
//       .finally(() => setLoading(false));

//     return () => {
//       if (objectUrl) URL.revokeObjectURL(objectUrl);
//     };
//   }, [open, claim]);

//   useEffect(() => {
//     if (!open) {
//       setImgUrl(null);
//       setError(null);
//     }
//   }, [open]);

//   return (
//     <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>{claim ? `${claim.title} - ${claim.submitter_name}` : "Claim Document"}</DialogTitle>
//         </DialogHeader>
//         <div className="flex min-h-[300px] items-center justify-center">
//           {loading && (
//             <div className="flex flex-col items-center gap-2 text-muted-foreground">
//               <Loader2 className="h-8 w-8 animate-spin" />
//               <span className="text-sm">Loading document...</span>
//             </div>
//           )}
//           {error && !loading && (
//             <div className="flex flex-col items-center gap-2 text-destructive">
//               <AlertCircle className="h-8 w-8" />
//               <span className="text-sm">{error}</span>
//             </div>
//           )}
//           {imgUrl && !loading && (
//             <img src={imgUrl} alt="Claim document" className="max-h-[70vh] max-w-full rounded-md border object-contain" />
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// export default function EscalatedBillsPage() {
//   const [claims, setClaims] = useState<Claim[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [fetchError, setFetchError] = useState<string | null>(null);
//   const [search, setSearch] = useState("");
//   const [billTypeFilter, setBillTypeFilter] = useState<string>("all");
//   const [fromDate, setFromDate] = useState<Date | undefined>();
//   const [toDate, setToDate] = useState<Date | undefined>();
//   const [viewClaim, setViewClaim] = useState<Claim | null>(null);
//   const [reviewClaim, setReviewClaim] = useState<ClaimForReview | undefined>(undefined);
//   const [reviewOpen, setReviewOpen] = useState(false);

//   const storedUser = getStoredUser();
//   const currentUserId = storedUser?.user_id ?? "";

//   const fetchClaims = useCallback(async () => {
//     if (!currentUserId) {
//       setFetchError("User not found in local storage. Please log in again.");
//       return;
//     }

//     setLoading(true);
//     setFetchError(null);

//     try {
//       const response = await fetch(`${BASE_URL}/get-all-claims?user_id=${currentUserId}`, {
//         headers: { accept: "application/json" },
//       });

//       if (!response.ok) throw new Error(`Claims request failed: ${response.status}`);

//       const data = await response.json();
//       const mergedClaims = (data.claims ?? []) as Claim[];

//       setClaims(
//         mergedClaims.sort((a, b) => {
//           const aTime = parseISO(a.date).getTime();
//           const bTime = parseISO(b.date).getTime();
//           return Number.isNaN(bTime - aTime) ? 0 : bTime - aTime;
//         })
//       );
//     } catch (err) {
//       const message = err instanceof Error ? err.message : "Failed to fetch claims";
//       setFetchError(message);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentUserId]);

//   useEffect(() => {
//     fetchClaims();
//   }, [fetchClaims]);

//   const escalatedClaims = useMemo(() => claims.filter((claim) => claim.status === "escalated"), [claims]);

//   const filtered = useMemo(() => {
//     return escalatedClaims.filter((claim) => {
//       const matchesSearch =
//         claim.title.toLowerCase().includes(search.toLowerCase()) ||
//         claim.submitter_name.toLowerCase().includes(search.toLowerCase()) ||
//         claim.upload_id.toLowerCase().includes(search.toLowerCase());
//       const matchesType = billTypeFilter === "all" || claim.usertype === billTypeFilter;

//       let matchesDate = true;
//       if (fromDate || toDate) {
//         const date = parseISO(claim.date);
//         if (fromDate && toDate) {
//           matchesDate =
//             (isAfter(date, fromDate) || isSameDay(date, fromDate)) &&
//             (isBefore(date, toDate) || isSameDay(date, toDate));
//         } else if (fromDate) {
//           matchesDate = isAfter(date, fromDate) || isSameDay(date, fromDate);
//         } else if (toDate) {
//           matchesDate = isBefore(date, toDate) || isSameDay(date, toDate);
//         }
//       }

//       return matchesSearch && matchesType && matchesDate;
//     });
//   }, [billTypeFilter, escalatedClaims, fromDate, search, toDate]);

//   const clearDateFilters = () => {
//     setFromDate(undefined);
//     setToDate(undefined);
//   };

//   const handleReviewClick = (claim: Claim) => {
//     setReviewClaim({
//       upload_id: claim.upload_id,
//       user_id: claim.user_id,
//       submitter_name: claim.submitter_name,
//       title: claim.title,
//       amount: claim.amount,
//       date: claim.date,
//       status: claim.status,
//     });
//     setReviewOpen(true);
//   };

//   const salesCount = filtered.filter((claim) => claim.usertype === "sales").length;
//   const vendorCount = filtered.filter((claim) => claim.usertype === "vendor").length;

//   return (
//     <div className="space-y-6 animate-fade-in">
//       <div>
//         <h1 className="text-2xl font-bold tracking-tight">Escalated Bills</h1>
//         <p className="text-muted-foreground text-sm">
//           Consolidated sales and vendor bills that need finance review.
//         </p>
//       </div>

//       <div className="grid gap-3 sm:grid-cols-3">
//         <Card>
//           <CardContent className="pt-6">
//             <p className="text-xs text-muted-foreground">All Escalated</p>
//             <p className="mt-2 text-2xl font-semibold">{filtered.length}</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="pt-6">
//             <p className="text-xs text-muted-foreground">Sales</p>
//             <p className="mt-2 text-2xl font-semibold">{salesCount}</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="pt-6">
//             <p className="text-xs text-muted-foreground">Vendors</p>
//             <p className="mt-2 text-2xl font-semibold">{vendorCount}</p>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="flex flex-wrap items-center gap-3">
//         <div className="relative max-w-sm min-w-[200px] flex-1">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             placeholder="Search by bill name, uploader, upload ID..."
//             className="pl-9"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         <Select value={billTypeFilter} onValueChange={setBillTypeFilter}>
//           <SelectTrigger className="w-[140px]">
//             <SelectValue placeholder="Bill type" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All</SelectItem>
//             <SelectItem value="sales">Sales</SelectItem>
//             <SelectItem value="vendor">Vendors</SelectItem>
//           </SelectContent>
//         </Select>

//         <Popover>
//           <PopoverTrigger asChild>
//             <Button variant="outline" size="sm" className={cn("gap-1.5 text-xs", !fromDate && "text-muted-foreground")}>
//               <CalendarIcon className="h-3.5 w-3.5" />
//               {fromDate ? format(fromDate, "dd MMM yyyy") : "Start date"}
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-auto p-0" align="start">
//             <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus className="pointer-events-auto p-3" />
//           </PopoverContent>
//         </Popover>

//         <span className="text-xs text-muted-foreground">to</span>

//         <Popover>
//           <PopoverTrigger asChild>
//             <Button variant="outline" size="sm" className={cn("gap-1.5 text-xs", !toDate && "text-muted-foreground")}>
//               <CalendarIcon className="h-3.5 w-3.5" />
//               {toDate ? format(toDate, "dd MMM yyyy") : "End date"}
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-auto p-0" align="start">
//             <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus className="pointer-events-auto p-3" />
//           </PopoverContent>
//         </Popover>

//         {(fromDate || toDate) && (
//           <Button variant="ghost" size="sm" onClick={clearDateFilters} className="gap-1 text-xs">
//             <X className="h-3.5 w-3.5" /> Clear
//           </Button>
//         )}

//         <Button variant="ghost" size="sm" onClick={fetchClaims} disabled={loading} className="ml-auto gap-1 text-xs">
//           <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} /> Refresh
//         </Button>
//       </div>

//       <Card>
//         <CardContent className="pt-6">
//           {fetchError && (
//             <div className="mb-4 flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
//               <AlertCircle className="h-4 w-4 shrink-0" />
//               {fetchError}
//             </div>
//           )}

//           {loading && (
//             <div className="space-y-3 py-4">
//               {[...Array(5)].map((_, index) => (
//                 <div key={index} className="h-10 animate-pulse rounded-md bg-muted" />
//               ))}
//             </div>
//           )}

//           {!loading && !fetchError && (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="border-b text-muted-foreground">
//                     <th className="py-2 text-left font-medium">Bill Name</th>
//                     <th className="py-2 text-left font-medium">Type</th>
//                     <th className="py-2 text-left font-medium">Submitted By</th>
//                     <th className="py-2 pr-6 text-right font-medium">Amount</th>
//                     <th className="py-2 pl-6 text-left font-medium">Date</th>
//                     <th className="py-2 text-left font-medium">Status</th>
//                     <th className="py-2 text-left font-medium">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filtered.length === 0 ? (
//                     <tr>
//                       <td colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
//                         No escalated bills found for the selected filters.
//                       </td>
//                     </tr>
//                   ) : (
//                     filtered.map((claim) => (
//                       <tr key={`${claim.usertype}-${claim.upload_id}`} className="border-b hover:bg-muted/50">
//                         <td className="py-3 font-medium">{claim.title}</td>
//                         <td className="py-3">
//                           <Badge variant="outline" className={billTypeConfig[claim.usertype].className}>
//                             {billTypeConfig[claim.usertype].label}
//                           </Badge>
//                         </td>
//                         <td className="py-3">{claim.submitter_name}</td>
//                         <td className="py-3 pr-6 text-right font-mono">
//                           Rs {Number(claim.amount).toLocaleString("en-IN")}
//                         </td>
//                         <td className="py-3 pl-6 text-muted-foreground">
//                           {format(parseISO(claim.date), "dd MMM yyyy")}
//                         </td>
//                         <td className="py-3">
//                           <Badge variant="outline" className={statusConfig[claim.status].className}>
//                             {statusConfig[claim.status].label}
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
//                             <Button variant="outline" size="sm" className="text-xs" onClick={() => handleReviewClick(claim)}>
//                               Review
//                             </Button>
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

//       <ClaimImageModal open={!!viewClaim} onClose={() => setViewClaim(null)} claim={viewClaim} />
//       <BillReviewModal
//         claim={reviewClaim}
//         open={reviewOpen}
//         onClose={() => {
//           setReviewOpen(false);
//           setReviewClaim(undefined);
//         }}
//         onStatusUpdated={fetchClaims}
//       />
//     </div>
//   );
// }


// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { format, isAfter, isBefore, isSameDay, parseISO } from "date-fns";
// import { 
//   AlertCircle, 
//   CalendarIcon, 
//   Eye, 
//   Loader2, 
//   RefreshCw, 
//   Search, 
//   X, 
//   AlertTriangle,
//   ArrowUpDown,
//   ArrowUp,
//   ArrowDown
// } from "lucide-react";
// import BillReviewModal, { type ClaimForReview } from "@/components/BillReviewModal";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { Card, CardContent } from "@/components/ui/card";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { cn } from "@/lib/utils";

// interface Claim {
//   upload_id: string;
//   submitter_name: string;
//   user_id: string;
//   usertype: "sales" | "vendor";
//   amount: string;
//   date: string;
//   status: "pending" | "approved" | "rejected" | "escalated";
//   title: string;
// }

// interface StoredUser {
//   user_id: string;
// }

// type SortConfig = {
//   key: keyof Claim | "";
//   direction: "asc" | "desc";
// };

// const BASE_URL = "https://d2ontk4ewdype3.cloudfront.net";

// const billTypeConfig: Record<Claim["usertype"], { label: string; className: string }> = {
//   sales: { label: "Sales", className: "bg-primary/10 text-primary border-primary/20" },
//   vendor: { label: "Vendor", className: "bg-warning/10 text-warning border-warning/20" },
// };

// const statusConfig: Record<Claim["status"], { label: string; className: string }> = {
//   pending: { label: "Pending", className: "bg-warning/10 text-warning border-warning/20" },
//   approved: { label: "Approved", className: "bg-success/10 text-success border-success/20" },
//   rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
//   escalated: { label: "Escalated", className: "bg-destructive/10 text-destructive border-destructive/20" },
// };

// function getStoredUser(): StoredUser | null {
//   try {
//     const raw = localStorage.getItem("user");
//     return raw ? JSON.parse(raw) : null;
//   } catch {
//     return null;
//   }
// }

// function ClaimImageModal({
//   open,
//   onClose,
//   claim,
// }: {
//   open: boolean;
//   onClose: () => void;
//   claim: Claim | null;
// }) {
//   const [imgUrl, setImgUrl] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!open || !claim) return;
//     let objectUrl: string | null = null;
//     setLoading(true); setError(null); setImgUrl(null);
//     fetch(`${BASE_URL}/view-original-claim-image?user_id=${claim.user_id}&upload_id=${claim.upload_id}`, {
//       headers: { accept: "image/*" },
//     })
//       .then(async (res) => {
//         if (!res.ok) throw new Error(`Server returned ${res.status}`);
//         const blob = await res.blob();
//         objectUrl = URL.createObjectURL(blob);
//         setImgUrl(objectUrl);
//       })
//       .catch((e: Error) => setError(e.message))
//       .finally(() => setLoading(false));

//     return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
//   }, [open, claim]);

//   useEffect(() => { if (!open) { setImgUrl(null); setError(null); } }, [open]);

//   return (
//     <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>{claim ? `${claim.title} - ${claim.submitter_name}` : "Claim Document"}</DialogTitle>
//         </DialogHeader>
//         <div className="flex min-h-[300px] items-center justify-center">
//           {loading && <div className="flex flex-col items-center gap-2 text-muted-foreground"><Loader2 className="h-8 w-8 animate-spin" /><span className="text-sm">Loading document...</span></div>}
//           {error && !loading && <div className="flex flex-col items-center gap-2 text-destructive"><AlertCircle className="h-8 w-8" /><span className="text-sm">{error}</span></div>}
//           {imgUrl && !loading && <img src={imgUrl} alt="Claim document" className="max-h-[70vh] max-w-full rounded-md border object-contain" />}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// export default function EscalatedBillsPage() {
//   const [claims, setClaims] = useState<Claim[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [fetchError, setFetchError] = useState<string | null>(null);
//   const [search, setSearch] = useState("");
//   const [billTypeFilter, setBillTypeFilter] = useState<string>("all");
//   const [fromDate, setFromDate] = useState<Date | undefined>();
//   const [toDate, setToDate] = useState<Date | undefined>();
//   const [viewClaim, setViewClaim] = useState<Claim | null>(null);
//   const [reviewClaim, setReviewClaim] = useState<ClaimForReview | undefined>(undefined);
//   const [reviewOpen, setReviewOpen]   = useState(false);

//   // Sorting state
//   const [sortConfig, setSortConfig] = useState<SortConfig>({ 
//     key: "date", 
//     direction: "desc" 
//   });

//   const storedUser = getStoredUser();
//   const currentUserId = storedUser?.user_id ?? "";

//   const fetchClaims = useCallback(async () => {
//     if (!currentUserId) { setFetchError("User not found in local storage. Please log in again."); return; }
//     setLoading(true); setFetchError(null);
//     try {
//       const response = await fetch(`${BASE_URL}/get-all-claims?user_id=${currentUserId}`, {
//         headers: { accept: "application/json" },
//       });
//       if (!response.ok) throw new Error(`Claims request failed: ${response.status}`);
//       const data = await response.json();
//       setClaims((data.claims ?? []) as Claim[]);
//     } catch (err) {
//       const message = err instanceof Error ? err.message : "Failed to fetch claims";
//       setFetchError(message);
//     } finally { setLoading(false); }
//   }, [currentUserId]);

//   useEffect(() => { fetchClaims(); }, [fetchClaims]);

//   const requestSort = (key: keyof Claim) => {
//     let direction: "asc" | "desc" = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });
//   };

//   const getSortIcon = (key: keyof Claim) => {
//     if (sortConfig.key !== key) return <ArrowUpDown className="ml-1 h-3 w-3 text-muted-foreground" />;
//     return sortConfig.direction === "asc" ? 
//       <ArrowUp className="ml-1 h-3 w-3" /> : 
//       <ArrowDown className="ml-1 h-3 w-3" />;
//   };

//   const escalatedClaims = useMemo(() => claims.filter((claim) => claim.status === "escalated"), [claims]);

//   const filtered = useMemo(() => {
//     let result = escalatedClaims.filter((claim) => {
//       const matchesSearch =
//         claim.title.toLowerCase().includes(search.toLowerCase()) ||
//         claim.submitter_name.toLowerCase().includes(search.toLowerCase()) ||
//         claim.upload_id.toLowerCase().includes(search.toLowerCase());
//       const matchesType = billTypeFilter === "all" || claim.usertype === billTypeFilter;

//       let matchesDate = true;
//       if (fromDate || toDate) {
//         const date = parseISO(claim.date);
//         if (fromDate && toDate) {
//           matchesDate =
//             (isAfter(date, fromDate) || isSameDay(date, fromDate)) &&
//             (isBefore(date, toDate) || isSameDay(date, toDate));
//         } else if (fromDate) {
//           matchesDate = isAfter(date, fromDate) || isSameDay(date, fromDate);
//         } else if (toDate) {
//           matchesDate = isBefore(date, toDate) || isSameDay(date, toDate);
//         }
//       }
//       return matchesSearch && matchesType && matchesDate;
//     });

//     if (sortConfig.key) {
//       result.sort((a, b) => {
//         let valA: any = a[sortConfig.key as keyof Claim];
//         let valB: any = b[sortConfig.key as keyof Claim];
        
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
//   }, [billTypeFilter, escalatedClaims, fromDate, search, toDate, sortConfig]);

//   const clearDateFilters = () => { setFromDate(undefined); setToDate(undefined); };

//   const handleReviewClick = (claim: Claim) => {
//     setReviewClaim({
//       upload_id: claim.upload_id,
//       user_id: claim.user_id,
//       submitter_name: claim.submitter_name,
//       title: claim.title,
//       amount: claim.amount,
//       date: claim.date,
//       status: claim.status,
//     });
//     setReviewOpen(true);
//   };

//   const salesCount = filtered.filter((claim) => claim.usertype === "sales").length;
//   const vendorCount = filtered.filter((claim) => claim.usertype === "vendor").length;

//   return (
//     <div className="space-y-6 animate-fade-in">
//       <div className="flex items-center gap-3">
//         <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
//           <AlertTriangle className="h-5 w-5 text-destructive" />
//         </div>
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight">Escalated Bills</h1>
//           <p className="text-muted-foreground text-sm">
//             Consolidated sales and vendor bills that need finance review.
//           </p>
//         </div>
//       </div>

//       <div className="grid gap-3 sm:grid-cols-3">
//         <Card>
//           <CardContent className="pt-6">
//             <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">All Escalated</p>
//             <p className="mt-2 text-2xl font-semibold">{filtered.length}</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="pt-6">
//             <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Sales</p>
//             <p className="mt-2 text-2xl font-semibold">{salesCount}</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="pt-6">
//             <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Vendors</p>
//             <p className="mt-2 text-2xl font-semibold">{vendorCount}</p>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="flex flex-wrap items-center gap-3">
//         <div className="relative max-w-sm min-w-[200px] flex-1">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             placeholder="Search by bill name, uploader, upload ID..."
//             className="pl-9"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         <Select value={billTypeFilter} onValueChange={setBillTypeFilter}>
//           <SelectTrigger className="w-[140px]"><SelectValue placeholder="Bill type" /></SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All</SelectItem>
//             <SelectItem value="sales">Sales</SelectItem>
//             <SelectItem value="vendor">Vendors</SelectItem>
//           </SelectContent>
//         </Select>

//         <Popover>
//           <PopoverTrigger asChild>
//             <Button variant="outline" size="sm" className={cn("gap-1.5 text-xs", !fromDate && "text-muted-foreground")}>
//               <CalendarIcon className="h-3.5 w-3.5" />
//               {fromDate ? format(fromDate, "dd MMM yyyy") : "Start date"}
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-auto p-0" align="start">
//             <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus className="pointer-events-auto p-3" />
//           </PopoverContent>
//         </Popover>

//         <span className="text-xs text-muted-foreground">to</span>

//         <Popover>
//           <PopoverTrigger asChild>
//             <Button variant="outline" size="sm" className={cn("gap-1.5 text-xs", !toDate && "text-muted-foreground")}>
//               <CalendarIcon className="h-3.5 w-3.5" />
//               {toDate ? format(toDate, "dd MMM yyyy") : "End date"}
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-auto p-0" align="start">
//             <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus className="pointer-events-auto p-3" />
//           </PopoverContent>
//         </Popover>

//         {(fromDate || toDate) && (
//           <Button variant="ghost" size="sm" onClick={clearDateFilters} className="gap-1 text-xs">
//             <X className="h-3.5 w-3.5" /> Clear
//           </Button>
//         )}

//         <Button variant="ghost" size="sm" onClick={fetchClaims} disabled={loading} className="ml-auto gap-1 text-xs">
//           <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} /> Refresh
//         </Button>
//       </div>

//       <Card>
//         <CardContent className="pt-6">
//           {fetchError && (
//             <div className="mb-4 flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
//               <AlertCircle className="h-4 w-4 shrink-0" />
//               {fetchError}
//             </div>
//           )}

//           {loading && (
//             <div className="space-y-3 py-4">
//               {[...Array(5)].map((_, index) => <div key={index} className="h-10 animate-pulse rounded-md bg-muted" />)}
//             </div>
//           )}

//           {!loading && !fetchError && (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="border-b text-muted-foreground">
//                     <th className="py-2 text-left font-medium cursor-pointer" onClick={() => requestSort("title")}>
//                       <div className="flex items-center">Bill Name {getSortIcon("title")}</div>
//                     </th>
//                     <th className="py-2 text-left font-medium cursor-pointer" onClick={() => requestSort("usertype")}>
//                       <div className="flex items-center">Type {getSortIcon("usertype")}</div>
//                     </th>
//                     <th className="py-2 text-left font-medium cursor-pointer" onClick={() => requestSort("submitter_name")}>
//                       <div className="flex items-center">Submitted By {getSortIcon("submitter_name")}</div>
//                     </th>
//                     <th className="py-2 pr-6 text-right font-medium cursor-pointer" onClick={() => requestSort("amount")}>
//                       <div className="flex items-center justify-end">Amount {getSortIcon("amount")}</div>
//                     </th>
//                     <th className="py-2 pl-6 text-left font-medium cursor-pointer" onClick={() => requestSort("date")}>
//                       <div className="flex items-center">Date {getSortIcon("date")}</div>
//                     </th>
//                     <th className="py-2 text-left font-medium cursor-pointer" onClick={() => requestSort("status")}>
//                       <div className="flex items-center">Status {getSortIcon("status")}</div>
//                     </th>
//                     <th className="py-2 text-left font-medium">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filtered.length === 0 ? (
//                     <tr><td colSpan={7} className="py-10 text-center text-sm text-muted-foreground">No escalated bills found for the selected filters.</td></tr>
//                   ) : (
//                     filtered.map((claim) => (
//                       <tr key={`${claim.usertype}-${claim.upload_id}`} className="border-b hover:bg-muted/50">
//                         <td className="py-3 font-medium">{claim.title}</td>
//                         <td className="py-3">
//                           <Badge variant="outline" className={billTypeConfig[claim.usertype].className}>{billTypeConfig[claim.usertype].label}</Badge>
//                         </td>
//                         <td className="py-3">{claim.submitter_name}</td>
//                         <td className="py-3 pr-6 text-right font-mono">Rs {Number(claim.amount).toLocaleString("en-IN")}</td>
//                         <td className="py-3 pl-6 text-muted-foreground">{format(parseISO(claim.date), "dd MMM yyyy")}</td>
//                         <td className="py-3">
//                           <Badge variant="outline" className={statusConfig[claim.status].className}>{statusConfig[claim.status].label}</Badge>
//                         </td>
//                         <td className="py-3">
//                           <div className="flex items-center gap-1.5">
//                             <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="View claim document" onClick={() => setViewClaim(claim)}>
//                               <Eye className="h-4 w-4 text-muted-foreground" />
//                             </Button>
//                             <Button variant="outline" size="sm" className="text-xs" onClick={() => handleReviewClick(claim)}>Review</Button>
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

//       <ClaimImageModal open={!!viewClaim} onClose={() => setViewClaim(null)} claim={viewClaim} />
//       <BillReviewModal
//         claim={reviewClaim}
//         open={reviewOpen}
//         onClose={() => { setReviewOpen(false); setReviewClaim(undefined); }}
//         onStatusUpdated={fetchClaims}
//       />
//     </div>
//   );
// }



import React, { useCallback, useEffect, useMemo, useState } from "react";
import { format, isAfter, isBefore, isSameDay, parseISO } from "date-fns";
import { AlertCircle, CalendarIcon, Eye, Loader2, RefreshCw, Search, X } from "lucide-react";
// import BillReviewModal, { type ClaimForReview } from "@/components/BillReviewModal";
import { type ClaimForReview } from "@/pages/ClaimReviewPage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface Claim {
  upload_id: string;
  submitter_name: string;
  user_id: string;
  usertype: "sales" | "vendor";
  amount: string;
  date: string;
  status: "pending" | "approved" | "rejected" | "escalated";
  title: string;
}

interface StoredUser {
  user_id: string;
}

const BASE_URL = "https://d2ontk4ewdype3.cloudfront.net";

const billTypeConfig: Record<Claim["usertype"], { label: string; className: string }> = {
  sales: { label: "Sales", className: "bg-primary/10 text-primary border-primary/20" },
  vendor: { label: "Vendor", className: "bg-warning/10 text-warning border-warning/20" },
};

const statusConfig: Record<Claim["status"], { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-warning/10 text-warning border-warning/20" },
  approved: { label: "Approved", className: "bg-success/10 text-success border-success/20" },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
  escalated: { label: "Escalated", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

function getStoredUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function ClaimImageModal({
  open,
  onClose,
  claim,
}: {
  open: boolean;
  onClose: () => void;
  claim: Claim | null;
}) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !claim) return;

    let objectUrl: string | null = null;

    setLoading(true);
    setError(null);
    setImgUrl(null);

    fetch(`${BASE_URL}/view-original-claim-image?user_id=${claim.user_id}&upload_id=${claim.upload_id}`, {
      headers: { accept: "image/*" },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);
        setImgUrl(objectUrl);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [open, claim]);

  useEffect(() => {
    if (!open) {
      setImgUrl(null);
      setError(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{claim ? `${claim.title} - ${claim.submitter_name}` : "Claim Document"}</DialogTitle>
        </DialogHeader>
        <div className="flex min-h-[300px] items-center justify-center">
          {loading && (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="text-sm">Loading document...</span>
            </div>
          )}
          {error && !loading && (
            <div className="flex flex-col items-center gap-2 text-destructive">
              <AlertCircle className="h-8 w-8" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          {imgUrl && !loading && (
            <img src={imgUrl} alt="Claim document" className="max-h-[70vh] max-w-full rounded-md border object-contain" />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function EscalatedBillsPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [billTypeFilter, setBillTypeFilter] = useState<string>("all");
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [viewClaim, setViewClaim] = useState<Claim | null>(null);
  const navigate = useNavigate();

  const storedUser = getStoredUser();
  const currentUserId = storedUser?.user_id ?? "";

  const fetchClaims = useCallback(async () => {
    if (!currentUserId) {
      setFetchError("User not found in local storage. Please log in again.");
      return;
    }

    setLoading(true);
    setFetchError(null);

    try {
      const response = await fetch(`${BASE_URL}/get-all-claims?user_id=${currentUserId}`, {
        headers: { accept: "application/json" },
      });

      if (!response.ok) throw new Error(`Claims request failed: ${response.status}`);

      const data = await response.json();
      const mergedClaims = (data.claims ?? []) as Claim[];

      setClaims(
        mergedClaims.sort((a, b) => {
          const aTime = parseISO(a.date).getTime();
          const bTime = parseISO(b.date).getTime();
          return Number.isNaN(bTime - aTime) ? 0 : bTime - aTime;
        })
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch claims";
      setFetchError(message);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  const escalatedClaims = useMemo(() => claims.filter((claim) => claim.status === "escalated"), [claims]);

  const filtered = useMemo(() => {
    return escalatedClaims.filter((claim) => {
      const matchesSearch =
        claim.title.toLowerCase().includes(search.toLowerCase()) ||
        claim.submitter_name.toLowerCase().includes(search.toLowerCase()) ||
        claim.upload_id.toLowerCase().includes(search.toLowerCase());
      const matchesType = billTypeFilter === "all" || claim.usertype === billTypeFilter;

      let matchesDate = true;
      if (fromDate || toDate) {
        const date = parseISO(claim.date);
        if (fromDate && toDate) {
          matchesDate =
            (isAfter(date, fromDate) || isSameDay(date, fromDate)) &&
            (isBefore(date, toDate) || isSameDay(date, toDate));
        } else if (fromDate) {
          matchesDate = isAfter(date, fromDate) || isSameDay(date, fromDate);
        } else if (toDate) {
          matchesDate = isBefore(date, toDate) || isSameDay(date, toDate);
        }
      }

      return matchesSearch && matchesType && matchesDate;
    });
  }, [billTypeFilter, escalatedClaims, fromDate, search, toDate]);

  const clearDateFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
  };

 const handleReviewClick = (claim: Claim) => {
  navigate(`/fraud/${claim.upload_id}/review`, {
    state: {
      claim: {
        upload_id: claim.upload_id,
        user_id: claim.user_id,
        submitter_name: claim.submitter_name,
        title: claim.title,
        amount: claim.amount,
        date: claim.date,
        status: claim.status,
      },
    },
  });
};

  const salesCount = filtered.filter((claim) => claim.usertype === "sales").length;
  const vendorCount = filtered.filter((claim) => claim.usertype === "vendor").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Escalated Bills</h1>
        <p className="text-muted-foreground text-sm">
          Consolidated sales and vendor bills that need finance review.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">All Escalated</p>
            <p className="mt-2 text-2xl font-semibold">{filtered.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Sales</p>
            <p className="mt-2 text-2xl font-semibold">{salesCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Vendors</p>
            <p className="mt-2 text-2xl font-semibold">{vendorCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by bill name, uploader, upload ID..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={billTypeFilter} onValueChange={setBillTypeFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Bill type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="vendor">Vendors</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className={cn("gap-1.5 text-xs", !fromDate && "text-muted-foreground")}>
              <CalendarIcon className="h-3.5 w-3.5" />
              {fromDate ? format(fromDate, "dd MMM yyyy") : "Start date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus className="pointer-events-auto p-3" />
          </PopoverContent>
        </Popover>

        <span className="text-xs text-muted-foreground">to</span>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className={cn("gap-1.5 text-xs", !toDate && "text-muted-foreground")}>
              <CalendarIcon className="h-3.5 w-3.5" />
              {toDate ? format(toDate, "dd MMM yyyy") : "End date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus className="pointer-events-auto p-3" />
          </PopoverContent>
        </Popover>

        {(fromDate || toDate) && (
          <Button variant="ghost" size="sm" onClick={clearDateFilters} className="gap-1 text-xs">
            <X className="h-3.5 w-3.5" /> Clear
          </Button>
        )}

        <Button variant="ghost" size="sm" onClick={fetchClaims} disabled={loading} className="ml-auto gap-1 text-xs">
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} /> Refresh
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {fetchError && (
            <div className="mb-4 flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {fetchError}
            </div>
          )}

          {loading && (
            <div className="space-y-3 py-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-10 animate-pulse rounded-md bg-muted" />
              ))}
            </div>
          )}

          {!loading && !fetchError && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="py-2 text-left font-medium">Bill Name</th>
                    <th className="py-2 text-left font-medium">Type</th>
                    <th className="py-2 text-left font-medium">Submitted By</th>
                    <th className="py-2 pr-6 text-right font-medium">Amount</th>
                    <th className="py-2 pl-6 text-left font-medium">Date</th>
                    <th className="py-2 text-left font-medium">Status</th>
                    <th className="py-2 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                        No escalated bills found for the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((claim) => (
                      <tr key={`${claim.usertype}-${claim.upload_id}`} className="border-b hover:bg-muted/50">
                        <td className="py-3 font-medium">{claim.title}</td>
                        <td className="py-3">
                          <Badge variant="outline" className={billTypeConfig[claim.usertype].className}>
                            {billTypeConfig[claim.usertype].label}
                          </Badge>
                        </td>
                        <td className="py-3">{claim.submitter_name}</td>
                        <td className="py-3 pr-6 text-right font-mono">
                          Rs {Number(claim.amount).toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 pl-6 text-muted-foreground">
                          {format(parseISO(claim.date), "dd MMM yyyy")}
                        </td>
                        <td className="py-3">
                          <Badge variant="outline" className={statusConfig[claim.status].className}>
                            {statusConfig[claim.status].label}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1.5">
                            {/* <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              aria-label="View claim document"
                              onClick={() => setViewClaim(claim)}
                            >
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            </Button> */}
                            <Button variant="outline" size="sm" className="text-xs" onClick={() => handleReviewClick(claim)}>
                              Review
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <ClaimImageModal open={!!viewClaim} onClose={() => setViewClaim(null)} claim={viewClaim} />
    </div>
  );
}
