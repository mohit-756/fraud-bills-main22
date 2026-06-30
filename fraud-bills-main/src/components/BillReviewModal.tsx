
// import React, { useState, useEffect, useRef } from "react";
// import {
//   Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   AlertTriangle, Pencil, RotateCcw, Download, CheckCircle, XCircle,
//   Shield, ChevronRight, ChevronLeft, Eye, FileText, ShieldCheck, Loader2, AlertCircle, Sparkles,
// } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// // ─── Types ────────────────────────────────────────────────────────────────────

// export interface ClaimForReview {
//   upload_id: string;
//   user_id: string;
//   submitter_name: string;
//   title: string;
//   amount: string;
//   date: string;
//   status: "pending" | "approved" | "rejected" | "escalated";
// }

// interface OcrData {
//   full_text: string;
//   key_value_pairs: Record<string, string>;
//   raw_text: string[];
// }

// interface ForensicsData {
//   report: { mantranet_score: number; fraud_score: number; status: string };
//   forensic_findings: string[];
//   technical_details: Record<string, any>;
// }

// interface SourceCheck { status: "PASS" | "FAIL" | "UNKNOWN"; reason: string }

// interface SourceVerification {
//   analysis: {
//     document_type: string;
//     context: string;
//     checks: Record<string, SourceCheck>;
//     risk_score: string;
//     risk_reason: string;
//     summary: string;
//   };
// }

// interface PolicyResult {
//   policy_id: string; title: string; status: "PASS" | "FAIL" | "UNKNOWN"; reason: string;
// }

// interface PolicyData {
//   result: {
//     policy_results: PolicyResult[];
//     summary: { total: number; passed: number; failed: number };
//   };
// }

// // ─── Constants ────────────────────────────────────────────────────────────────

// const BASE_URL = "https://d2ontk4ewdype3.cloudfront.net";

// const riskConfig: Record<string, { label: string; className: string }> = {
//   "High Risk":   { label: "High Risk",   className: "bg-destructive/10 text-destructive border-destructive/20" },
//   "Medium Risk": { label: "Medium Risk", className: "bg-warning/10 text-warning border-warning/20" },
//   "Low Risk":    { label: "Low Risk",    className: "bg-success/10 text-success border-success/20" },
// };

// function getStoredFinanceUserId(): string {
//   try {
//     const raw = localStorage.getItem("user");
//     return raw ? JSON.parse(raw)?.user_id ?? "" : "";
//   } catch { return ""; }
// }

// // ─── API fetchers ─────────────────────────────────────────────────────────────

// async function fetchImage(userId: string, uploadId: string): Promise<string> {
//   const res = await fetch(`${BASE_URL}/view-original-claim-image?user_id=${userId}&upload_id=${uploadId}`, { headers: { accept: "image/*" } });
//   if (!res.ok) throw new Error(`Image fetch failed: ${res.status}`);
//   return URL.createObjectURL(await res.blob());
// }

// async function fetchOcr(userId: string, uploadId: string): Promise<OcrData> {
//   const res = await fetch(`${BASE_URL}/get-ocr-data?user_id=${userId}&upload_id=${uploadId}`, { headers: { accept: "application/json" } });
//   if (!res.ok) throw new Error(`OCR fetch failed: ${res.status}`);
//   return res.json();
// }

// async function fetchForensics(userId: string, uploadId: string): Promise<ForensicsData> {
//   const res = await fetch(`${BASE_URL}/get-forensics-report?user_id=${userId}&upload_id=${uploadId}`, { headers: { accept: "application/json" } });
//   if (!res.ok) throw new Error(`Forensics fetch failed: ${res.status}`);
//   return res.json();
// }

// async function fetchSourceVerification(userId: string, uploadId: string): Promise<SourceVerification> {
//   const res = await fetch(`${BASE_URL}/get-source-verification-rules`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json", accept: "application/json" },
//     body: JSON.stringify({ user_id: userId, upload_id: uploadId }),
//   });
//   if (!res.ok) throw new Error(`Source verification failed: ${res.status}`);
//   return res.json();
// }

// async function fetchPolicies(userId: string, uploadId: string): Promise<PolicyData> {
//   const res = await fetch(`${BASE_URL}/check-policies?user_id=${userId}&upload_id=${uploadId}`, { headers: { accept: "application/json" } });
//   if (!res.ok) throw new Error(`Policy check failed: ${res.status}`);
//   return res.json();
// }

// async function updateStatus(financeUserId: string, userId: string, uploadId: string, status: "approved" | "rejected"): Promise<void> {
//   const res = await fetch(`${BASE_URL}/update-status?finance_user_id=${financeUserId}&user_id=${userId}&upload_id=${uploadId}&status=${status}`, {
//     method: "POST", headers: { accept: "application/json" },
//   });
//   if (!res.ok) throw new Error(`Status update failed: ${res.status}`);
// }

// // ─── Shared UI helpers ────────────────────────────────────────────────────────

// function StepLoader({ message }: { message: string }) {
//   return (
//     <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
//       <Loader2 className="h-8 w-8 animate-spin" />
//       <span className="text-sm">{message}</span>
//     </div>
//   );
// }

// function StepError({ message, onRetry }: { message: string; onRetry: () => void }) {
//   return (
//     <div className="flex flex-col items-center justify-center py-16 gap-3 text-destructive">
//       <AlertCircle className="h-8 w-8" />
//       <span className="text-sm">{message}</span>
//       <Button variant="outline" size="sm" onClick={onRetry} className="text-xs gap-1">
//         <RotateCcw className="h-3.5 w-3.5" /> Retry
//       </Button>
//     </div>
//   );
// }

// function statusIcon(status: string) {
//   if (status === "PASS") return <CheckCircle className="h-4 w-4 text-success shrink-0" />;
//   if (status === "FAIL") return <XCircle className="h-4 w-4 text-destructive shrink-0" />;
//   return <AlertTriangle className="h-4 w-4 text-warning shrink-0" />;
// }

// function statusRowClass(status: string) {
//   if (status === "PASS") return "bg-success/5 border-success/20";
//   if (status === "FAIL") return "bg-destructive/5 border-destructive/20";
//   return "bg-warning/5 border-warning/20";
// }

// function StatusBadge({ status }: { status: string }) {
//   return (
//     <Badge variant="outline" className={`text-[10px] shrink-0 ${
//       status === "PASS" ? "text-success border-success/30" :
//       status === "FAIL" ? "text-destructive border-destructive/30" :
//       "text-warning border-warning/30"
//     }`}>{status}</Badge>
//   );
// }

// // ─── Modal ────────────────────────────────────────────────────────────────────

// interface BillReviewModalProps {
//   claim: ClaimForReview | undefined;
//   open: boolean;
//   onClose: () => void;
//   onStatusUpdated?: () => void;
// }

// export default function BillReviewModal({ claim, open, onClose, onStatusUpdated }: BillReviewModalProps) {
//   const { toast } = useToast();
//   const [step, setStep] = useState(0);
//   const [comment, setComment] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   // Step 0: image + OCR
//   const [imgUrl, setImgUrl]               = useState<string | null>(null);
//   const [imgLoading, setImgLoading]       = useState(false);
//   const [imgError, setImgError]           = useState<string | null>(null);

//   const [ocr, setOcr]                     = useState<OcrData | null>(null);
//   const [ocrLoading, setOcrLoading]       = useState(false);
//   const [ocrError, setOcrError]           = useState<string | null>(null);
//   const [editedText, setEditedText]       = useState("");
//   const [isEditing, setIsEditing]         = useState(false);

//   // Background APIs (start after step 0 resolves)
//   const [forensics, setForensics]         = useState<ForensicsData | null>(null);
//   const [forensicsLoading, setForensicsLoading] = useState(false);
//   const [forensicsError, setForensicsError]     = useState<string | null>(null);

//   const [sourceData, setSourceData]       = useState<SourceVerification | null>(null);
//   const [sourceLoading, setSourceLoading] = useState(false);
//   const [sourceError, setSourceError]     = useState<string | null>(null);

//   const [policyData, setPolicyData]       = useState<PolicyData | null>(null);
//   const [policyLoading, setPolicyLoading] = useState(false);
//   const [policyError, setPolicyError]     = useState<string | null>(null);


// const [isDuplicate, setIsDuplicate] = useState<{ status: string; reason?: string; confidence?: number } | null>(null);
// const [duplicateLoading, setDuplicateLoading] = useState(false);

//   // Track if background APIs have been triggered
//   const backgroundFiredRef = useRef(false);

//   // Helper: fire background APIs (forensics + source + policy) all in parallel
//   const fireBackgroundApis = (userId: string, uploadId: string) => {
//     if (backgroundFiredRef.current) return;
//     backgroundFiredRef.current = true;

//     // Forensics
//     setForensicsLoading(true);
//     fetchForensics(userId, uploadId)
//       .then((d) => { setForensics(d); setForensicsError(null); })
//       .catch((e) => setForensicsError(e.message))
//       .finally(() => setForensicsLoading(false));

//     // Source verification
//     setSourceLoading(true);
//     fetchSourceVerification(userId, uploadId)
//       .then((d) => { setSourceData(d); setSourceError(null); })
//       .catch((e) => setSourceError(e.message))
//       .finally(() => setSourceLoading(false));

//     // Policies
//     setPolicyLoading(true);
//     fetchPolicies(userId, uploadId)
//       .then((d) => { setPolicyData(d); setPolicyError(null); })
//       .catch((e) => setPolicyError(e.message))
//       .finally(() => setPolicyLoading(false));
//   };

//   // Reset everything when modal opens with a new claim, then kick off Step 0 APIs
//   useEffect(() => {
//     if (!open || !claim) return;

//     // Full reset
//     setStep(0); setComment("");
//     setImgUrl(null); setImgError(null); setImgLoading(false);
//     setOcr(null); setOcrError(null); setOcrLoading(false); setEditedText(""); setIsEditing(false);
//     setForensics(null); setForensicsError(null); setForensicsLoading(false);
//     setSourceData(null); setSourceError(null); setSourceLoading(false);
//     setPolicyData(null); setPolicyError(null); setPolicyLoading(false);
//     setIsDuplicate(null); setDuplicateLoading(false);
//     backgroundFiredRef.current = false;

//     // Fire image + OCR simultaneously
//     setImgLoading(true);
//     setOcrLoading(true);

//     const imgPromise = fetchImage(claim.user_id, claim.upload_id)
//       .then((url) => { setImgUrl(url); setImgError(null); })
//       .catch((e) => setImgError(e.message))
//       .finally(() => setImgLoading(false));

//     const ocrPromise = fetchOcr(claim.user_id, claim.upload_id)
//       .then((data) => { setOcr(data); setEditedText(data.full_text); setOcrError(null); })
//       .catch((e) => setOcrError(e.message))
//       .finally(() => setOcrLoading(false));

//     // Once BOTH image & OCR are done (success or fail), fire background APIs
// Promise.allSettled([imgPromise, ocrPromise]).then(() => {
//   fireBackgroundApis(claim.user_id, claim.upload_id);

//   // ✅ Check duplicate FIRST, then upsert
//   setDuplicateLoading(true);
//  fetch(`${BASE_URL}/check-duplicate-bill?user_id=${claim.user_id}&upload_id=${claim.upload_id}`, {
//     method: "POST", headers: { accept: "application/json" },
//   })
//     .then((res) => res.json())
//     .then((data) => {
//       setIsDuplicate({
//         status: data.status,
//         reason: data.llm?.reason,
//         confidence: data.llm?.confidence,
//       });
//     })
//     .catch(() => {})
//     .finally(() => {
//       setDuplicateLoading(false);
//       fetch(`${BASE_URL}/upsert-bill?user_id=${claim.user_id}&upload_id=${claim.upload_id}`, {
//         method: "POST", headers: { accept: "application/json" },
//       }).catch(() => {});
//     });
// });

//   }, [open, claim?.upload_id]);

//   // Cleanup blob URL on close
//   useEffect(() => {
//     if (!open && imgUrl) { URL.revokeObjectURL(imgUrl); setImgUrl(null); }
//   }, [open]);

//   // ── Retry handlers ────────────────────────────────────────────────────────

//   const retryImg = () => {
//     if (!claim) return;
//     setImgUrl(null); setImgError(null); setImgLoading(true);
//     fetchImage(claim.user_id, claim.upload_id)
//       .then((url) => { setImgUrl(url); setImgError(null); })
//       .catch((e) => setImgError(e.message))
//       .finally(() => setImgLoading(false));
//   };

//   const retryOcr = () => {
//     if (!claim) return;
//     setOcr(null); setOcrError(null); setOcrLoading(true);
//     fetchOcr(claim.user_id, claim.upload_id)
//       .then((d) => { setOcr(d); setEditedText(d.full_text); setOcrError(null); })
//       .catch((e) => setOcrError(e.message))
//       .finally(() => setOcrLoading(false));
//   };

//   const retryForensics = () => {
//     if (!claim) return;
//     setForensics(null); setForensicsError(null); setForensicsLoading(true);
//     fetchForensics(claim.user_id, claim.upload_id)
//       .then((d) => { setForensics(d); setForensicsError(null); })
//       .catch((e) => setForensicsError(e.message))
//       .finally(() => setForensicsLoading(false));
//   };

//   const retrySource = () => {
//     if (!claim) return;
//     setSourceData(null); setSourceError(null); setSourceLoading(true);
//     fetchSourceVerification(claim.user_id, claim.upload_id)
//       .then((d) => { setSourceData(d); setSourceError(null); })
//       .catch((e) => setSourceError(e.message))
//       .finally(() => setSourceLoading(false));
//   };

//   const retryPolicy = () => {
//     if (!claim) return;
//     setPolicyData(null); setPolicyError(null); setPolicyLoading(true);
//     fetchPolicies(claim.user_id, claim.upload_id)
//       .then((d) => { setPolicyData(d); setPolicyError(null); })
//       .catch((e) => setPolicyError(e.message))
//       .finally(() => setPolicyLoading(false));
//   };

//   // ── Actions ───────────────────────────────────────────────────────────────

//   const handleAction = async (action: "approved" | "rejected") => {
//     if (!claim) return;
//     const financeUserId = getStoredFinanceUserId();
//     if (!financeUserId) {
//       toast({ title: "Error", description: "Finance user not found in session.", variant: "destructive" });
//       return;
//     }
//     setSubmitting(true);
//     try {
//       await updateStatus(financeUserId, claim.user_id, claim.upload_id, action);
//       toast({ title: `Bill ${action}`, description: `${claim.title} has been ${action} successfully.${comment ? ` Comment: "${comment}"` : ""}` });
//       onStatusUpdated?.();
//       onClose();
//     } catch (e: any) {
//       toast({ title: "Failed", description: e.message, variant: "destructive" });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDownloadReport = () => {
//     if (!claim) return;
//     const lines = [
//       `Policy Compliance Report`, `========================`,
//       `Bill: ${claim.title}`, `Submitted By: ${claim.submitter_name}`,
//       `Amount: ₹${Number(claim.amount).toLocaleString("en-IN")}`, `Date: ${claim.date}`, ``,
//       `Forensic Report:`,
//       forensics ? `  MantraNet: ${forensics.report.mantranet_score} | Fraud Score: ${forensics.report.fraud_score} | Status: ${forensics.report.status}` : "  Not loaded",
//       ``, `Forensic Findings:`,
//       ...(forensics?.forensic_findings.map((f) => `  • ${f}`) ?? ["  Not loaded"]),
//       ``, `Source Verification:`,
//       sourceData ? Object.entries(sourceData.analysis.checks).map(([k, v]) => `  [${v.status}] ${k}: ${v.reason}`).join("\n") : "  Not loaded",
//       ``, `Policy Checks:`,
//       policyData ? policyData.result.policy_results.map((p) => `  [${p.status}] ${p.title}: ${p.reason}`).join("\n") : "  Not loaded",
//       ``, `Comments: ${comment || "None"}`,
//     ];
//     const blob = new Blob([lines.join("\n")], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a"); a.href = url; a.download = `report-${claim.upload_id}.txt`; a.click();
//     URL.revokeObjectURL(url);
//     toast({ title: "Report downloaded" });
//   };

//   if (!claim) return null;

//   const riskStatus = forensics?.report.status ?? "";
//   const riskStyle = riskConfig[riskStatus] ?? { label: riskStatus, className: "bg-muted text-muted-foreground" };
//   const stepLabels = ["Document Review", "Forensic Report", "Source Verification", "Policy Compliance", "Summary & Action"];

//   // Background loading indicator — show a subtle pill when background APIs are still running
//   const backgroundStillLoading = forensicsLoading || sourceLoading || policyLoading;

//   return (
//     <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
//       <DialogContent className="sm:max-w-5xl max-h-[95vh] overflow-hidden flex flex-col p-4 sm:p-5 gap-3">
//         <DialogHeader className="shrink-0 pb-0">
//           <div className="flex items-center justify-between">
//             <div className="flex-1 min-w-0">
//               <DialogTitle className="text-base">Review — {claim.upload_id}</DialogTitle>
//               <DialogDescription className="text-xs">
//                 {claim.submitter_name} · ₹{Number(claim.amount).toLocaleString("en-IN")} · {claim.date}
//               </DialogDescription>
//             </div>
//             <div className="flex items-center gap-2">
//               {/* Background loading pill — visible on steps 0-3 while background APIs run */}
//               {backgroundStillLoading && step < 4 && (
//                 <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/60 rounded-full px-2 py-0.5 border">
//                   <Loader2 className="h-2.5 w-2.5 animate-spin" /> Analysing in background…
//                 </span>
//               )}
//               {riskStatus && (
//                 <Badge variant="outline" className={`text-xs ${riskStyle.className}`}>
//                   {riskStatus === "High Risk" && <AlertTriangle className="h-3 w-3 mr-1" />}
//                   {riskStyle.label}
//                 </Badge>
//               )}
//             </div>
//           </div>
//         </DialogHeader>

//         {/* Step indicator */}
//         <div className="shrink-0 flex items-center gap-1 justify-center">
//           {stepLabels.map((label, i) => (
//             <React.Fragment key={i}>
//               <div className="flex items-center gap-1">
//                 <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-colors ${
//                   i === step ? "bg-primary text-primary-foreground border-primary"
//                   : i < step ? "bg-primary/20 text-primary border-primary/40"
//                   : "bg-muted text-muted-foreground border-border"
//                 }`}>{i < step ? "✓" : i + 1}</div>
//                 <span className={`text-[10px] hidden sm:inline ${i === step ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{label}</span>
//               </div>
//               {i < stepLabels.length - 1 && <div className={`w-6 h-0.5 ${i < step ? "bg-primary/40" : "bg-border"}`} />}
//             </React.Fragment>
//           ))}
//         </div>

//         {/* Step content */}
//         <div className="flex-1 min-h-0 overflow-y-auto">
//           {step === 0 && (
//             <StepDocumentReview
//   imgUrl={imgUrl} imgLoading={imgLoading} imgError={imgError} onRetryImg={retryImg}
//   ocrLoading={ocrLoading} ocrError={ocrError} editedText={editedText}
//   setEditedText={setEditedText} isEditing={isEditing} setIsEditing={setIsEditing} onRetryOcr={retryOcr}
//   isDuplicate={isDuplicate} duplicateLoading={duplicateLoading}
// />
//           )}
//           {step === 1 && <StepForensicReport loading={forensicsLoading} error={forensicsError} data={forensics} onRetry={retryForensics} />}
//           {step === 2 && <StepSourceVerification loading={sourceLoading} error={sourceError} data={sourceData} onRetry={retrySource} />}
//           {step === 3 && <StepPolicyCompliance loading={policyLoading} error={policyError} data={policyData} onRetry={retryPolicy} />}
//           {step === 4 && <StepSummary claim={claim} forensics={forensics} sourceData={sourceData} policyData={policyData} comment={comment} setComment={setComment} />}
//         </div>

//         {/* Navigation */}
//         <div className="shrink-0 flex justify-between items-center pt-1 border-t">
//           <div>
//             {step > 0 && (
//               <Button variant="outline" size="sm" className="h-7 gap-1 px-3 text-xs" onClick={() => setStep(step - 1)}>
//                 <ChevronLeft className="h-3.5 w-3.5" /> Back
//               </Button>
//             )}
//           </div>
//           <div className="flex gap-2">
//             {step === 0 && (
//               // AI Summarize — jumps straight to Summary & Action (step 4)
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="h-7 gap-1.5 px-3 text-xs border-primary/40 text-primary hover:bg-primary/5"
//                 onClick={() => setStep(4)}
//               >
//                 <Sparkles className="h-3.5 w-3.5" />
//                 AI Summarize
//                 {backgroundStillLoading && <Loader2 className="h-2.5 w-2.5 animate-spin ml-0.5" />}
//               </Button>
//             )}
//             {step < 4 ? (
//               <Button size="sm" className="h-7 gap-1 px-4 text-xs" onClick={() => setStep(step + 1)}>
//                 Next Step <ChevronRight className="h-3.5 w-3.5" />
//               </Button>
//             ) : (
//               <>
//                 <Button size="sm" className="h-7 gap-1.5 px-3 text-xs bg-success hover:bg-success/90 text-success-foreground" onClick={() => handleAction("approved")} disabled={submitting}>
//                   {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />} Approve
//                 </Button>
//                 <Button size="sm" variant="destructive" className="h-7 gap-1.5 px-3 text-xs" onClick={() => handleAction("rejected")} disabled={submitting}>
//                   {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />} Reject
//                 </Button>
//                 <Button variant="outline" size="sm" className="h-7 gap-1.5 px-3 text-xs" onClick={handleDownloadReport}>
//                   <Download className="h-3.5 w-3.5" /> Download Report
//                 </Button>
//               </>
//             )}
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }


// function OcrStructuredView({ text }: { text: string }) {
//   const lines = text.split(/\n|\. /).map(l => l.trim()).filter(Boolean);

//   const fields: { label: string; value: string }[] = [];
//   const items: { name: string; qty: string; rate: string; amount: string }[] = [];
//   const others: string[] = [];

//   const fieldPatterns: [RegExp, string][] = [
//     [/invoice no[:\s]+([^\s]+)/i, "Invoice No"],
//     [/date[^:]*of supply[:\s]+([^\s]+)/i, "Date of Supply"],
//     [/gstin[:\s]+([^\s]+)/i, "GSTIN"],
//     [/contact[:\s]+([0-9]+)/i, "Contact"],
//     [/e[\s-]?mail[:\s]+([^\s]+)/i, "Email"],
//     [/buyer order no[.:\s]+([^\s]+)/i, "Buyer Order No"],
//     [/total[^₹]*₹?\s*([\d,.]+)/i, "Total Amount"],
//     [/net amount[^:]*[:\s]+([\d,.]+)/i, "Net Amount"],
//     [/cgst[^%]*%\s*([\d,.]+)/i, "CGST"],
//     [/sgst[^%]*%\s*([\d,.]+)/i, "SGST/UTGST"],
//     [/taxable value[:\s]+([\d,.]+)/i, "Taxable Value"],
//   ];

//   const fullText = lines.join(" ");
//   const matched = new Set<string>();

//   fieldPatterns.forEach(([regex, label]) => {
//     const m = fullText.match(regex);
//     if (m) { fields.push({ label, value: m[1] }); matched.add(label); }
//   });

//   // detect item lines: "Something 1 Nos. 1645.00 1645.00"
//   const itemRegex = /(.+?)\s+(\d+)\s*nos\.?\s+([\d.]+)\s+([\d.]+)/gi;
//   let m;
//   while ((m = itemRegex.exec(fullText)) !== null) {
//     items.push({ name: m[1].trim(), qty: m[2], rate: m[3], amount: m[4] });
//   }

//   return (
//     <div className="space-y-3">
//       {/* Key Fields */}
//      {fields.length > 0 && (
//   <div className="rounded-lg border bg-muted/10 divide-y">
//     {fields.map(f => (
//       <div key={f.label} className="flex items-center justify-between px-3 py-1.5 gap-4">
//         <span className="text-[10px] text-muted-foreground shrink-0">{f.label}</span>
//         <span className="text-xs font-medium text-right break-all">{f.value}</span>
//       </div>
//     ))}
//   </div>
// )}

//       {/* Line Items */}
//       {items.length > 0 && (
//         <div>
//           <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Line Items</p>
//           <div className="rounded border overflow-hidden">
//             <table className="w-full text-[11px]">
//               <thead className="bg-muted/40">
//                 <tr>
//                   <th className="text-left px-2 py-1.5 font-medium">Item</th>
//                   <th className="text-center px-2 py-1.5 font-medium">Qty</th>
//                   <th className="text-right px-2 py-1.5 font-medium">Rate</th>
//                   <th className="text-right px-2 py-1.5 font-medium">Amount</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {items.map((item, i) => (
//                   <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/10"}>
//                     <td className="px-2 py-1.5">{item.name}</td>
//                     <td className="px-2 py-1.5 text-center">{item.qty}</td>
//                     <td className="px-2 py-1.5 text-right">₹{item.rate}</td>
//                     <td className="px-2 py-1.5 text-right font-medium">₹{item.amount}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── Step 1: Document Review ──────────────────────────────────────────────────

// function StepDocumentReview({ imgUrl, imgLoading, imgError, onRetryImg, ocrLoading, ocrError, editedText, setEditedText, isEditing, setIsEditing, onRetryOcr, isDuplicate, duplicateLoading }: {
//   imgUrl: string | null; imgLoading: boolean; imgError: string | null; onRetryImg: () => void;
//   ocrLoading: boolean; ocrError: string | null; editedText: string;
//   setEditedText: (v: string) => void; isEditing: boolean; setIsEditing: (v: boolean) => void; onRetryOcr: () => void;
//   isDuplicate: { status: string; reason?: string; confidence?: number } | null;
//   duplicateLoading: boolean;
// }) {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full">
//       <div className="flex flex-col gap-2">
//         <p className="text-xs font-medium flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> Bill Document</p>
//         <div className="flex-1 min-h-[200px] rounded-lg border overflow-hidden bg-muted/20 flex items-center justify-center">
//           {imgLoading && <StepLoader message="Loading document image…" />}
//           {imgError && !imgLoading && <StepError message={imgError} onRetry={onRetryImg} />}
//           {imgUrl && !imgLoading && <img src={imgUrl} alt="Bill document" className="w-full h-full object-contain" />}
//         </div>
//       </div>
//       <div className="flex flex-col gap-2">
//         <div className="flex items-center justify-between mb-0.5">
//           <p className="text-xs font-medium flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> Extracted Document Text</p>
//           {!ocrLoading && !ocrError && editedText && (
//             <Button variant={isEditing ? "default" : "outline"} size="sm" className="text-[10px] gap-1 h-6 px-2" onClick={() => setIsEditing(!isEditing)}>
//               <Pencil className="h-2.5 w-2.5" /> {isEditing ? "Done" : "Edit"}
//             </Button>
//           )}
//         </div>
//         <div className="flex-1 min-h-[250px] overflow-hidden">
//           {ocrLoading && <StepLoader message="Extracting document text…" />}
//           {ocrError && !ocrLoading && <StepError message={ocrError} onRetry={onRetryOcr} />}
//           {!ocrLoading && !ocrError && (
//             isEditing
//               ? <Textarea value={editedText} onChange={(e) => setEditedText(e.target.value)} className="text-xs font-mono h-full min-h-[250px] resize-none" />
//               : <pre className="text-xs font-mono bg-muted/30 rounded-lg p-3 whitespace-pre-wrap overflow-visible border min-h-[250px]  leading-relaxed">
//     {editedText
//       .replace(/([.:])\s+(?=[A-Z])/g, "$1\n")
//       .replace(/(\d{2}\.\d{2}\.\d{4})/g, "$1\n")
//       .replace(/(Invoice No[^:]*:|GSTIN:|Contact\s*-|E Mail\s*:|Total\s*₹|Net Amount|CGST|SGST)/gi, "\n$1")
//       .replace(/\n{3,}/g, "\n\n")
//       .trim()
//     }
//   </pre>
//           )}
// </div>

//         {/* Duplicate check banner */}
//         {duplicateLoading && (
//           <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg p-2.5 border mt-2">
//             <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" /> Checking for duplicate bills…
//           </div>
//         )}
//         {!duplicateLoading && isDuplicate && (
//           isDuplicate.status === "duplicate" ? (
//             <div className="flex items-start gap-2 text-xs bg-destructive/10 border border-destructive/30 rounded-lg p-2.5 mt-2">
//               <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
//               <div>
//                 <p className="font-semibold text-destructive">Duplicate Bill Detected</p>
//                 {isDuplicate.reason && <p className="text-muted-foreground mt-0.5">{isDuplicate.reason}</p>}
//                 {isDuplicate.confidence !== undefined && (
//                   <p className="text-muted-foreground">Confidence: {(isDuplicate.confidence * 100).toFixed(0)}%</p>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <div className="flex items-center gap-2 text-xs bg-success/10 border border-success/30 rounded-lg p-2.5 mt-2">
//               <CheckCircle className="h-3.5 w-3.5 text-success shrink-0" />
//               <p className="font-medium text-success">No duplicate found — bill appears unique</p>
//             </div>
//           )
//         )}
//       </div>
//     </div>
//   );
// }

// // ─── Step 2: Forensic Report ──────────────────────────────────────────────────

// function StepForensicReport({ loading, error, data, onRetry }: { loading: boolean; error: string | null; data: ForensicsData | null; onRetry: () => void }) {
//   if (loading) return <StepLoader message="Running forensic analysis…" />;
//   if (error) return <StepError message={error} onRetry={onRetry} />;
//   if (!data) return null;

//   const { mantranet_score, fraud_score, status } = data.report;
//   const scoreColor = (s: number) => s >= 70 ? "text-destructive" : s >= 40 ? "text-warning" : "text-success";

//   return (
//     <div className="space-y-4 max-w-2xl mx-auto">
//       <div className="text-center mb-2">
//         <Shield className="h-8 w-8 mx-auto text-primary mb-1" />
//         <h3 className="text-sm font-semibold">Forensic Analysis Report</h3>
//         <p className="text-[11px] text-muted-foreground">Automated document forensic analysis</p>
//       </div>
//       <div className="grid grid-cols-3 gap-3">
//         <div className="rounded-xl border p-4 text-center bg-muted/20">
//           <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">MantraNet Score</p>
//           <p className={`text-3xl font-bold ${scoreColor(mantranet_score)}`}>{mantranet_score.toFixed(1)}<span className="text-sm text-muted-foreground">/100</span></p>
//           <p className="text-[10px] text-muted-foreground mt-1">Image manipulation</p>
//         </div>
//         <div className="rounded-xl border p-4 text-center bg-muted/20">
//           <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Fraud Score</p>
//           <p className={`text-3xl font-bold ${scoreColor(fraud_score)}`}>{fraud_score}<span className="text-sm text-muted-foreground">/100</span></p>
//           <p className="text-[10px] text-muted-foreground mt-1">Overall risk</p>
//         </div>
//         <div className="rounded-xl border p-4 text-center bg-muted/20">
//           <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Risk Status</p>
//           <p className={`text-sm font-bold mt-2 ${status === "High Risk" ? "text-destructive" : status === "Medium Risk" ? "text-warning" : "text-success"}`}>{status}</p>
//         </div>
//       </div>
//       <div>
//         <p className="text-xs font-semibold mb-2">Forensic Findings</p>
//         <div className="space-y-1.5">
//           {data.forensic_findings.map((f, i) => (
//             <div key={i} className="flex items-start gap-2 rounded-lg border p-2.5 bg-muted/10">
//               <AlertTriangle className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${status === "Low Risk" ? "text-success" : status === "Medium Risk" ? "text-warning" : "text-destructive"}`} />
//               <p className="text-[11px] text-muted-foreground">{f}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div>
//         <p className="text-xs font-semibold mb-2">Technical Details</p>
//         <div className="grid grid-cols-2 gap-1.5">
//           {Object.entries(data.technical_details).filter(([, v]) => typeof v === "number").map(([key, val]) => (
//             <div key={key} className="flex justify-between rounded border p-2 bg-muted/10 text-[11px]">
//               <span className="text-muted-foreground capitalize">{key.replace(/_/g, " ")}</span>
//               <span className="font-mono font-medium">{(val as number).toFixed(2)}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Step 3: Source Verification ─────────────────────────────────────────────

// function StepSourceVerification({ loading, error, data, onRetry }: { loading: boolean; error: string | null; data: SourceVerification | null; onRetry: () => void }) {
//   if (loading) return <StepLoader message="Running source verification…" />;
//   if (error) return <StepError message={error} onRetry={onRetry} />;
//   if (!data) return null;

//   const { checks, risk_score, summary } = data.analysis;
//   const entries = Object.entries(checks)
//   .filter(([, v]) => v.status !== "UNKNOWN")
//   .sort((a, b) => (a[1].status === "PASS" ? -1 : 1));
//   const passed = entries.filter(([, v]) => v.status === "PASS").length;
//   const failed = entries.filter(([, v]) => v.status === "FAIL").length;
//   // const unknown = entries.filter(([, v]) => v.status === "UNKNOWN").length;
//   const formatKey = (k: string) => k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

//   return (
//     <div className="space-y-4 max-w-2xl mx-auto">
//       <div className="text-center mb-2">
//         <ShieldCheck className="h-8 w-8 mx-auto text-primary mb-1" />
//         <h3 className="text-sm font-semibold">Source Verification</h3>
//         <p className="text-[11px] text-muted-foreground">AI-powered receipt and claim analysis</p>
//       </div>
//       <div className="flex items-center justify-center gap-6 text-xs">
//         <span className="flex items-center gap-1 text-success"><CheckCircle className="h-3.5 w-3.5" /> {passed} Passed</span>
//         <span className="flex items-center gap-1 text-destructive"><XCircle className="h-3.5 w-3.5" /> {failed} Failed</span>
//       </div>
//       <div className="space-y-2">
//         {entries.map(([key, val]) => (
//           <div key={key} className={`flex items-start gap-3 rounded-lg border p-3 ${statusRowClass(val.status)}`}>
//             {statusIcon(val.status)}
//             <div className="flex-1 min-w-0">
//               <p className="text-xs font-medium">{formatKey(key)}</p>
//               <p className="text-[11px] text-muted-foreground mt-0.5">{val.reason}</p>
//             </div>
//             <StatusBadge status={val.status} />
//           </div>
//         ))}
//       </div>
//       <div className="rounded-lg border p-3 bg-muted/10">
//         <p className="text-xs font-semibold mb-1 flex items-center gap-1">
//           <Shield className="h-3.5 w-3.5 text-primary" /> Risk Score:
//           <span className={`ml-1 ${risk_score === "HIGH" ? "text-destructive" : risk_score === "MEDIUM" ? "text-warning" : "text-success"}`}>{risk_score}</span>
//         </p>
//         <p className="text-[11px] text-muted-foreground">{summary}</p>
//       </div>
//     </div>
//   );
// }

// // ─── Step 4: Policy Compliance ────────────────────────────────────────────────

// function StepPolicyCompliance({ loading, error, data, onRetry }: { loading: boolean; error: string | null; data: PolicyData | null; onRetry: () => void }) {
//   if (loading) return <StepLoader message="Checking policy compliance…" />;
//   if (error) return <StepError message={error} onRetry={onRetry} />;
//   if (!data) return null;

//   const { policy_results, summary } = data.result;
// const filtered = policy_results
//   .filter(p => p.status !== "UNKNOWN")
//   .sort((a, b) => (a.status === "PASS" ? -1 : 1));

//   return (
//     <div className="space-y-3 max-w-3xl mx-auto">
//       <div className="text-center mb-2">
//         <Shield className="h-8 w-8 mx-auto text-primary mb-1" />
//         <h3 className="text-sm font-semibold">Policy Compliance Check</h3>
//         <p className="text-[11px] text-muted-foreground">Review all applicable policies against this bill</p>
//       </div>
//       <div className="flex items-center justify-center gap-6 text-xs">
//         <span className="flex items-center gap-1 text-success"><CheckCircle className="h-3.5 w-3.5" /> {summary.passed} Passed</span>
//         <span className="flex items-center gap-1 text-destructive"><XCircle className="h-3.5 w-3.5" /> {summary.failed} Failed</span>
//         <span className="flex items-center gap-1 text-muted-foreground">Total: {summary.total}</span>
//       </div>
//       <div className="space-y-1.5">
//         {filtered.length === 0
//   ? <p className="text-center text-xs text-muted-foreground py-6">No policies found for this bill.</p>
//   : filtered.map((p) => (
//             <div key={p.policy_id} className={`flex items-start gap-2 rounded-lg border p-3 ${statusRowClass(p.status)}`}>
//               {statusIcon(p.status)}
//               <div className="flex-1 min-w-0">
//                 <p className="text-xs font-medium capitalize">{p.title}</p>
//                 <p className="text-[11px] text-muted-foreground mt-0.5">{p.reason}</p>
//               </div>
//               <StatusBadge status={p.status} />
//             </div>
//           ))
//         }
//       </div>
//     </div>
//   );
// }

// // ─── Step 5: Summary & Action ─────────────────────────────────────────────────

// function StepSummary({ claim, forensics, sourceData, policyData, comment, setComment }: {
//   claim: ClaimForReview; forensics: ForensicsData | null; sourceData: SourceVerification | null;
//   policyData: PolicyData | null; comment: string; setComment: (v: string) => void;
// }) {
//   const anyLoading = !forensics || !sourceData || !policyData;

//   return (
//     <div className="space-y-3 max-w-3xl mx-auto">
//       <h3 className="text-sm font-semibold text-center">Review Summary</h3>

//       {anyLoading && (
//         <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg p-2.5 border">
//           <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
//           Analysis still in progress — some sections below may be incomplete. You can still approve or reject.
//         </div>
//       )}

//       {/* Claim info */}
//       <div className="grid grid-cols-2 gap-2 text-[11px]">
//         {[
//           { label: "Bill Title", value: claim.title },
//           { label: "Submitted By", value: claim.submitter_name },
//           { label: "Amount", value: `₹${Number(claim.amount).toLocaleString("en-IN")}` },
//           { label: "Date", value: claim.date },
//         ].map((item) => (
//           <div key={item.label} className="rounded-lg border p-2.5 bg-muted/20">
//             <p className="text-muted-foreground">{item.label}</p>
//             <p className="font-medium mt-0.5">{item.value}</p>
//           </div>
//         ))}
//       </div>

//       {/* Forensic scores */}
//       {forensics ? (
//         <div className="grid grid-cols-3 gap-2">
//           {[
//             { label: "MantraNet", value: `${forensics.report.mantranet_score.toFixed(1)}/100` },
//             { label: "Fraud Score", value: `${forensics.report.fraud_score}/100` },
//             { label: "Risk Status", value: forensics.report.status },
//           ].map((item) => (
//             <div key={item.label} className="rounded-lg border p-2.5 text-center bg-muted/20">
//               <p className="text-[10px] text-muted-foreground">{item.label}</p>
//               <p className="text-sm font-bold mt-1">{item.value}</p>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="rounded-lg border p-2.5 bg-muted/10 flex items-center gap-2 text-xs text-muted-foreground">
//           <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading forensic scores…
//         </div>
//       )}

//       {/* Source verification */}
//       {sourceData ? (
//         <div>
//           <p className="text-xs font-semibold mb-1.5 flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> Source Verification</p>
//           <div className="space-y-1">
//   {Object.entries(sourceData.analysis.checks)
//   .filter(([, val]) => val.status !== "UNKNOWN")
//   .sort((a, b) => (a[1].status === "PASS" ? -1 : 1))
//   .map(([key, val]) => (
//               <div key={key} className={`flex items-center gap-2 rounded border p-1.5 text-[11px] ${statusRowClass(val.status)}`}>
//                 {statusIcon(val.status)}
//                 <span className="font-medium capitalize flex-1">{key.replace(/_/g, " ")}</span>
//                 <StatusBadge status={val.status} />
//               </div>
//             ))}
//           </div>
//         </div>
//       ) : (
//         <div className="rounded-lg border p-2.5 bg-muted/10 flex items-center gap-2 text-xs text-muted-foreground">
//           <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading source verification…
//         </div>
//       )}

//       {/* Policy checks */}
//       {policyData ? (
//         <div>
//           <p className="text-xs font-semibold mb-1.5 flex items-center gap-1">
//             <Shield className="h-3.5 w-3.5 text-primary" /> Policy Compliance
//             <span className="ml-auto text-[10px] font-normal text-muted-foreground">
//               {policyData.result.summary.passed} passed · {policyData.result.summary.failed} failed · {policyData.result.summary.total} total
//             </span>
//           </p>
//           <div className="space-y-1">
//             {policyData.result.policy_results
//   .filter(p => p.status !== "UNKNOWN")
//   .sort((a, b) => (a.status === "PASS" ? -1 : 1))
//   .map((p) => (
//               <div key={p.policy_id} className={`flex items-center gap-1.5 rounded border p-1.5 text-[11px] ${statusRowClass(p.status)}`}>
//                 {statusIcon(p.status)}
//                 <span className="font-medium capitalize flex-1">{p.title}</span>
//                 <StatusBadge status={p.status} />
//               </div>
//             ))}
//           </div>
//         </div>
//       ) : (
//         <div className="rounded-lg border p-2.5 bg-muted/10 flex items-center gap-2 text-xs text-muted-foreground">
//           <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading policy checks…
//         </div>
//       )}

//       {/* AI summary */}
//       {sourceData?.analysis.summary && (
//         <div>
//           <p className="text-xs font-medium mb-1">AI Summary</p>
//           <p className="text-[11px] text-muted-foreground bg-muted/30 rounded-lg p-2.5 border">{sourceData.analysis.summary}</p>
//         </div>
//       )}

//       {/* Comments */}
//       <div>
//         <p className="text-xs font-medium mb-1">Comments</p>
//         <Textarea placeholder="Add details or comments before approving / rejecting…" value={comment} onChange={(e) => setComment(e.target.value)} className="text-xs" rows={2} />
//       </div>
//     </div>
//   );
// }




import React, { useState, useEffect, useRef } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle, Pencil, RotateCcw, Download, CheckCircle, XCircle,
  Shield, ChevronRight, ChevronLeft, Eye, FileText, ShieldCheck, Loader2, AlertCircle, Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ClaimForReview {
  upload_id: string;
  user_id: string;
  submitter_name: string;
  title: string;
  amount: string;
  date: string;
  status: "pending" | "approved" | "rejected" | "escalated";
}

interface OcrData {
  full_text: string;
  key_value_pairs: Record<string, string>;
  raw_text: string[];
}

interface ForensicsData {
  report: { mantranet_score: number; fraud_score: number; status: string };
  forensic_findings: string[];
  technical_details: Record<string, any>;
}

interface SourceCheck { status: "PASS" | "FAIL" | "UNKNOWN"; reason: string }

interface SourceVerification {
  analysis: {
    document_type: string;
    context: string;
    checks: Record<string, SourceCheck>;
    risk_score: string;
    risk_reason: string;
    summary: string;
  };
}

interface PolicyResult {
  policy_id: string; title: string; status: "PASS" | "FAIL" | "UNKNOWN"; reason: string;
}

interface PolicyData {
  result: {
    policy_results: PolicyResult[];
    summary: { total: number; passed: number; failed: number };
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_URL = "https://d2ontk4ewdype3.cloudfront.net";

const riskConfig: Record<string, { label: string; className: string }> = {
  "High Risk":   { label: "High Risk",   className: "bg-destructive/10 text-destructive border-destructive/20" },
  "Medium Risk": { label: "Medium Risk", className: "bg-warning/10 text-warning border-warning/20" },
  "Low Risk":    { label: "Low Risk",    className: "bg-success/10 text-success border-success/20" },
};

function getStoredFinanceUserId(): string {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw)?.user_id ?? "" : "";
  } catch { return ""; }
}

// ─── API fetchers ─────────────────────────────────────────────────────────────

async function fetchUploadedFiles(userId: string, uploadId: string): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/list-upload-files?user_id=${userId}&upload_id=${uploadId}`, {
    headers: { accept: "application/json" },
  });
  if (!res.ok) throw new Error(`File list fetch failed: ${res.status}`);
  const data = await res.json();
  return data.files ?? [];
}

async function fetchImage(userId: string, uploadId: string, imageName: string): Promise<string> {
  const res = await fetch(
    `${BASE_URL}/view-original-claim-image?user_id=${userId}&upload_id=${uploadId}&image_name=${encodeURIComponent(imageName)}`,
    { headers: { accept: "image/*" } }
  );
  if (!res.ok) throw new Error(`Image fetch failed: ${res.status}`);
  return URL.createObjectURL(await res.blob());
}

async function fetchOcr(userId: string, uploadId: string, fileName: string): Promise<OcrData> {
  const res = await fetch(
    `${BASE_URL}/get-ocr-data?user_id=${userId}&upload_id=${uploadId}&file_name=${encodeURIComponent(fileName)}`,
    { headers: { accept: "application/json" } }
  );
  if (!res.ok) throw new Error(`OCR fetch failed: ${res.status}`);
  const data = await res.json();
  return data.data ?? data;
}

async function fetchForensics(userId: string, uploadId: string): Promise<ForensicsData> {
  const res = await fetch(`${BASE_URL}/get-forensics-report?user_id=${userId}&upload_id=${uploadId}`, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`Forensics fetch failed: ${res.status}`);
  return res.json();
}

async function fetchSourceVerification(userId: string, uploadId: string): Promise<SourceVerification> {
  const res = await fetch(`${BASE_URL}/get-source-verification-rules`, {
    method: "POST",
    headers: { "Content-Type": "application/json", accept: "application/json" },
    body: JSON.stringify({ user_id: userId, upload_id: uploadId }),
  });
  if (!res.ok) throw new Error(`Source verification failed: ${res.status}`);
  return res.json();
}

async function fetchPolicies(userId: string, uploadId: string): Promise<PolicyData> {
  const res = await fetch(`${BASE_URL}/check-policies?user_id=${userId}&upload_id=${uploadId}`, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`Policy check failed: ${res.status}`);
  return res.json();
}

async function updateStatus(financeUserId: string, userId: string, uploadId: string, status: "approved" | "rejected"): Promise<void> {
  const res = await fetch(`${BASE_URL}/update-status?finance_user_id=${financeUserId}&user_id=${userId}&upload_id=${uploadId}&status=${status}`, {
    method: "POST", headers: { accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Status update failed: ${res.status}`);
}

// ─── Shared UI helpers ────────────────────────────────────────────────────────

function StepLoader({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
      <Loader2 className="h-8 w-8 animate-spin" />
      <span className="text-sm">{message}</span>
    </div>
  );
}

function StepError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-destructive">
      <AlertCircle className="h-8 w-8" />
      <span className="text-sm">{message}</span>
      <Button variant="outline" size="sm" onClick={onRetry} className="text-xs gap-1">
        <RotateCcw className="h-3.5 w-3.5" /> Retry
      </Button>
    </div>
  );
}

function statusIcon(status: string) {
  if (status === "PASS") return <CheckCircle className="h-4 w-4 text-success shrink-0" />;
  if (status === "FAIL") return <XCircle className="h-4 w-4 text-destructive shrink-0" />;
  return <AlertTriangle className="h-4 w-4 text-warning shrink-0" />;
}

function statusRowClass(status: string) {
  if (status === "PASS") return "bg-success/5 border-success/20";
  if (status === "FAIL") return "bg-destructive/5 border-destructive/20";
  return "bg-warning/5 border-warning/20";
}

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={`text-[10px] shrink-0 ${
      status === "PASS" ? "text-success border-success/30" :
      status === "FAIL" ? "text-destructive border-destructive/30" :
      "text-warning border-warning/30"
    }`}>{status}</Badge>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface BillReviewModalProps {
  claim: ClaimForReview | undefined;
  open: boolean;
  onClose: () => void;
  onStatusUpdated?: () => void;
}

export default function BillReviewModal({ claim, open, onClose, onStatusUpdated }: BillReviewModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Multi-file support
  const [fileList, setFileList]               = useState<string[]>([]);
  const [fileListLoading, setFileListLoading] = useState(false);
  const [fileListError, setFileListError]     = useState<string | null>(null);
  const [activeFileIndex, setActiveFileIndex] = useState(0);

  // Step 0: image + OCR
  const [imgUrl, setImgUrl]               = useState<string | null>(null);
  const [imgLoading, setImgLoading]       = useState(false);
  const [imgError, setImgError]           = useState<string | null>(null);

  const [ocr, setOcr]                     = useState<OcrData | null>(null);
  const [ocrLoading, setOcrLoading]       = useState(false);
  const [ocrError, setOcrError]           = useState<string | null>(null);
  const [editedText, setEditedText]       = useState("");
  const [isEditing, setIsEditing]         = useState(false);

  // Background APIs (start after step 0 resolves)
  const [forensics, setForensics]         = useState<ForensicsData | null>(null);
  const [forensicsLoading, setForensicsLoading] = useState(false);
  const [forensicsError, setForensicsError]     = useState<string | null>(null);

  const [sourceData, setSourceData]       = useState<SourceVerification | null>(null);
  const [sourceLoading, setSourceLoading] = useState(false);
  const [sourceError, setSourceError]     = useState<string | null>(null);

  const [policyData, setPolicyData]       = useState<PolicyData | null>(null);
  const [policyLoading, setPolicyLoading] = useState(false);
  const [policyError, setPolicyError]     = useState<string | null>(null);

  const [isDuplicate, setIsDuplicate] = useState<{ status: string; reason?: string; confidence?: number } | null>(null);
  const [duplicateLoading, setDuplicateLoading] = useState(false);

  // Track if background APIs have been triggered
  const backgroundFiredRef = useRef(false);

  // Helper: fire background APIs (forensics + source + policy) all in parallel
  const fireBackgroundApis = (userId: string, uploadId: string) => {
    if (backgroundFiredRef.current) return;
    backgroundFiredRef.current = true;

    setForensicsLoading(true);
    fetchForensics(userId, uploadId)
      .then((d) => { setForensics(d); setForensicsError(null); })
      .catch((e) => setForensicsError(e.message))
      .finally(() => setForensicsLoading(false));

    setSourceLoading(true);
    fetchSourceVerification(userId, uploadId)
      .then((d) => { setSourceData(d); setSourceError(null); })
      .catch((e) => setSourceError(e.message))
      .finally(() => setSourceLoading(false));

    setPolicyLoading(true);
    fetchPolicies(userId, uploadId)
      .then((d) => { setPolicyData(d); setPolicyError(null); })
      .catch((e) => setPolicyError(e.message))
      .finally(() => setPolicyLoading(false));
  };

  // Helper: load image + OCR for a given file name
  const loadFileByName = (userId: string, uploadId: string, fileName: string) => {
    setImgUrl(null); setImgError(null); setImgLoading(true);
    setOcr(null); setOcrError(null); setOcrLoading(true); setEditedText(""); setIsEditing(false);

    const imgPromise = fetchImage(userId, uploadId, fileName)
      .then((url) => { setImgUrl(url); setImgError(null); })
      .catch((e) => setImgError(e.message))
      .finally(() => setImgLoading(false));

    const ocrPromise = fetchOcr(userId, uploadId, fileName)
      .then((data) => { setOcr(data); setEditedText(data.full_text); setOcrError(null); })
      .catch((e) => setOcrError(e.message))
      .finally(() => setOcrLoading(false));

    return Promise.allSettled([imgPromise, ocrPromise]);
  };

  // Reset everything when modal opens with a new claim
  useEffect(() => {
    if (!open || !claim) return;

    // Full reset
    setStep(0); setComment("");
    setFileList([]); setFileListError(null); setFileListLoading(false); setActiveFileIndex(0);
    setImgUrl(null); setImgError(null); setImgLoading(false);
    setOcr(null); setOcrError(null); setOcrLoading(false); setEditedText(""); setIsEditing(false);
    setForensics(null); setForensicsError(null); setForensicsLoading(false);
    setSourceData(null); setSourceError(null); setSourceLoading(false);
    setPolicyData(null); setPolicyError(null); setPolicyLoading(false);
    setIsDuplicate(null); setDuplicateLoading(false);
    backgroundFiredRef.current = false;

    // Step 1: fetch the list of uploaded files
    setFileListLoading(true);
    fetchUploadedFiles(claim.user_id, claim.upload_id)
      .then((files) => {
        setFileList(files);
        setFileListError(null);
        setActiveFileIndex(0);

        if (files.length === 0) return Promise.allSettled([]);

        // Step 2: load first file's image + OCR
        return loadFileByName(claim.user_id, claim.upload_id, files[0]);
      })
      .then(() => {
        // Step 3: fire background APIs once initial file is loaded
        fireBackgroundApis(claim.user_id, claim.upload_id);

        // Step 4: duplicate check then upsert
        setDuplicateLoading(true);
        fetch(`${BASE_URL}/check-duplicate-bill?user_id=${claim.user_id}&upload_id=${claim.upload_id}`, {
          method: "POST", headers: { accept: "application/json" },
        })
          .then((res) => res.json())
          .then((data) => {
            setIsDuplicate({
              status: data.status,
              reason: data.llm?.reason,
              confidence: data.llm?.confidence,
            });
          })
          .catch(() => {})
          .finally(() => {
            setDuplicateLoading(false);
            fetch(`${BASE_URL}/upsert-bill?user_id=${claim.user_id}&upload_id=${claim.upload_id}`, {
              method: "POST", headers: { accept: "application/json" },
            }).catch(() => {});
          });
      })
      .catch((e) => setFileListError(e.message))
      .finally(() => setFileListLoading(false));

  }, [open, claim?.upload_id]);

  // Cleanup blob URL on close
  useEffect(() => {
    if (!open && imgUrl) { URL.revokeObjectURL(imgUrl); setImgUrl(null); }
  }, [open]);

  // ── File pagination handler ───────────────────────────────────────────────

  const handleFileSelect = (index: number) => {
    if (!claim || index === activeFileIndex || fileList.length === 0) return;
    const fileName = fileList[index];
    setActiveFileIndex(index);

    // Revoke previous blob URL
    if (imgUrl) { URL.revokeObjectURL(imgUrl); setImgUrl(null); }

    loadFileByName(claim.user_id, claim.upload_id, fileName);
  };

  // ── Retry handlers ────────────────────────────────────────────────────────

  const retryImg = () => {
    if (!claim || fileList.length === 0) return;
    const fileName = fileList[activeFileIndex];
    setImgUrl(null); setImgError(null); setImgLoading(true);
    fetchImage(claim.user_id, claim.upload_id, fileName)
      .then((url) => { setImgUrl(url); setImgError(null); })
      .catch((e) => setImgError(e.message))
      .finally(() => setImgLoading(false));
  };

  const retryOcr = () => {
    if (!claim || fileList.length === 0) return;
    const fileName = fileList[activeFileIndex];
    setOcr(null); setOcrError(null); setOcrLoading(true);
    fetchOcr(claim.user_id, claim.upload_id, fileName)
      .then((d) => { setOcr(d); setEditedText(d.full_text); setOcrError(null); })
      .catch((e) => setOcrError(e.message))
      .finally(() => setOcrLoading(false));
  };

  const retryForensics = () => {
    if (!claim) return;
    setForensics(null); setForensicsError(null); setForensicsLoading(true);
    fetchForensics(claim.user_id, claim.upload_id)
      .then((d) => { setForensics(d); setForensicsError(null); })
      .catch((e) => setForensicsError(e.message))
      .finally(() => setForensicsLoading(false));
  };

  const retrySource = () => {
    if (!claim) return;
    setSourceData(null); setSourceError(null); setSourceLoading(true);
    fetchSourceVerification(claim.user_id, claim.upload_id)
      .then((d) => { setSourceData(d); setSourceError(null); })
      .catch((e) => setSourceError(e.message))
      .finally(() => setSourceLoading(false));
  };

  const retryPolicy = () => {
    if (!claim) return;
    setPolicyData(null); setPolicyError(null); setPolicyLoading(true);
    fetchPolicies(claim.user_id, claim.upload_id)
      .then((d) => { setPolicyData(d); setPolicyError(null); })
      .catch((e) => setPolicyError(e.message))
      .finally(() => setPolicyLoading(false));
  };

  // ── Actions ───────────────────────────────────────────────────────────────

  const handleAction = async (action: "approved" | "rejected") => {
    if (!claim) return;
    const financeUserId = getStoredFinanceUserId();
    if (!financeUserId) {
      toast({ title: "Error", description: "Finance user not found in session.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      await updateStatus(financeUserId, claim.user_id, claim.upload_id, action);
      toast({ title: `Bill ${action}`, description: `${claim.title} has been ${action} successfully.${comment ? ` Comment: "${comment}"` : ""}` });
      onStatusUpdated?.();
      onClose();
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadReport = () => {
    if (!claim) return;
    const lines = [
      `Policy Compliance Report`, `========================`,
      `Bill: ${claim.title}`, `Submitted By: ${claim.submitter_name}`,
      `Amount: ₹${Number(claim.amount).toLocaleString("en-IN")}`, `Date: ${claim.date}`, ``,
      `Forensic Report:`,
      forensics ? `  MantraNet: ${forensics.report.mantranet_score} | Fraud Score: ${forensics.report.fraud_score} | Status: ${forensics.report.status}` : "  Not loaded",
      ``, `Forensic Findings:`,
      ...(forensics?.forensic_findings.map((f) => `  • ${f}`) ?? ["  Not loaded"]),
      ``, `Source Verification:`,
      sourceData ? Object.entries(sourceData.analysis.checks).map(([k, v]) => `  [${v.status}] ${k}: ${v.reason}`).join("\n") : "  Not loaded",
      ``, `Policy Checks:`,
      policyData ? policyData.result.policy_results.map((p) => `  [${p.status}] ${p.title}: ${p.reason}`).join("\n") : "  Not loaded",
      ``, `Comments: ${comment || "None"}`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `report-${claim.upload_id}.txt`; a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Report downloaded" });
  };

  if (!claim) return null;

  const riskStatus = forensics?.report.status ?? "";
  const riskStyle = riskConfig[riskStatus] ?? { label: riskStatus, className: "bg-muted text-muted-foreground" };
  const stepLabels = ["Document Review", "Forensic Report", "Source Verification", "Policy Compliance", "Summary & Action"];

  const backgroundStillLoading = forensicsLoading || sourceLoading || policyLoading;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-5xl max-h-[95vh] overflow-hidden flex flex-col p-4 sm:p-5 gap-3">
        <DialogHeader className="shrink-0 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-base">Review — {claim.upload_id}</DialogTitle>
              <DialogDescription className="text-xs">
                {claim.submitter_name} · ₹{Number(claim.amount).toLocaleString("en-IN")} · {claim.date}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {backgroundStillLoading && step < 4 && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/60 rounded-full px-2 py-0.5 border">
                  <Loader2 className="h-2.5 w-2.5 animate-spin" /> Analysing in background…
                </span>
              )}
              {riskStatus && (
                <Badge variant="outline" className={`text-xs ${riskStyle.className}`}>
                  {riskStatus === "High Risk" && <AlertTriangle className="h-3 w-3 mr-1" />}
                  {riskStyle.label}
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Step indicator */}
        <div className="shrink-0 flex items-center gap-1 justify-center">
          {stepLabels.map((label, i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-colors ${
                  i === step ? "bg-primary text-primary-foreground border-primary"
                  : i < step ? "bg-primary/20 text-primary border-primary/40"
                  : "bg-muted text-muted-foreground border-border"
                }`}>{i < step ? "✓" : i + 1}</div>
                <span className={`text-[10px] hidden sm:inline ${i === step ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{label}</span>
              </div>
              {i < stepLabels.length - 1 && <div className={`w-6 h-0.5 ${i < step ? "bg-primary/40" : "bg-border"}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Step content */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {/* File list loading / error shown only on step 0 */}
          {step === 0 && fileListLoading && (
            <StepLoader message="Fetching uploaded files…" />
          )}
          {step === 0 && fileListError && !fileListLoading && (
            <StepError message={fileListError} onRetry={() => {
              if (!claim) return;
              setFileListError(null); setFileListLoading(true);
              fetchUploadedFiles(claim.user_id, claim.upload_id)
                .then((files) => { setFileList(files); setFileListError(null); if (files.length > 0) loadFileByName(claim.user_id, claim.upload_id, files[0]); })
                .catch((e) => setFileListError(e.message))
                .finally(() => setFileListLoading(false));
            }} />
          )}
          {step === 0 && !fileListLoading && !fileListError && (
            <StepDocumentReview
              imgUrl={imgUrl} imgLoading={imgLoading} imgError={imgError} onRetryImg={retryImg}
              ocrLoading={ocrLoading} ocrError={ocrError} editedText={editedText}
              setEditedText={setEditedText} isEditing={isEditing} setIsEditing={setIsEditing} onRetryOcr={retryOcr}
              isDuplicate={isDuplicate} duplicateLoading={duplicateLoading}
              fileList={fileList} activeFileIndex={activeFileIndex} onFileSelect={handleFileSelect}
            />
          )}
          {step === 1 && <StepForensicReport loading={forensicsLoading} error={forensicsError} data={forensics} onRetry={retryForensics} />}
          {step === 2 && <StepSourceVerification loading={sourceLoading} error={sourceError} data={sourceData} onRetry={retrySource} />}
          {step === 3 && <StepPolicyCompliance loading={policyLoading} error={policyError} data={policyData} onRetry={retryPolicy} />}
          {step === 4 && <StepSummary claim={claim} forensics={forensics} sourceData={sourceData} policyData={policyData} comment={comment} setComment={setComment} />}
        </div>

        {/* Navigation */}
        <div className="shrink-0 flex justify-between items-center pt-1 border-t">
          <div>
            {step > 0 && (
              <Button variant="outline" size="sm" className="h-7 gap-1 px-3 text-xs" onClick={() => setStep(step - 1)}>
                <ChevronLeft className="h-3.5 w-3.5" /> Back
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {step === 0 && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1.5 px-3 text-xs border-primary/40 text-primary hover:bg-primary/5"
                onClick={() => setStep(4)}
              >
                <Sparkles className="h-3.5 w-3.5" />
                AI Summarize
                {backgroundStillLoading && <Loader2 className="h-2.5 w-2.5 animate-spin ml-0.5" />}
              </Button>
            )}
            {step < 4 ? (
              <Button size="sm" className="h-7 gap-1 px-4 text-xs" onClick={() => setStep(step + 1)}>
                Next Step <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <>
                <Button size="sm" className="h-7 gap-1.5 px-3 text-xs bg-success hover:bg-success/90 text-success-foreground" onClick={() => handleAction("approved")} disabled={submitting}>
                  {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />} Approve
                </Button>
                <Button size="sm" variant="destructive" className="h-7 gap-1.5 px-3 text-xs" onClick={() => handleAction("rejected")} disabled={submitting}>
                  {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />} Reject
                </Button>
                <Button variant="outline" size="sm" className="h-7 gap-1.5 px-3 text-xs" onClick={handleDownloadReport}>
                  <Download className="h-3.5 w-3.5" /> Download Report
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


function OcrStructuredView({ text }: { text: string }) {
  const lines = text.split(/\n|\. /).map(l => l.trim()).filter(Boolean);

  const fields: { label: string; value: string }[] = [];
  const items: { name: string; qty: string; rate: string; amount: string }[] = [];

  const fieldPatterns: [RegExp, string][] = [
    [/invoice no[:\s]+([^\s]+)/i, "Invoice No"],
    [/date[^:]*of supply[:\s]+([^\s]+)/i, "Date of Supply"],
    [/gstin[:\s]+([^\s]+)/i, "GSTIN"],
    [/contact[:\s]+([0-9]+)/i, "Contact"],
    [/e[\s-]?mail[:\s]+([^\s]+)/i, "Email"],
    [/buyer order no[.:\s]+([^\s]+)/i, "Buyer Order No"],
    [/total[^₹]*₹?\s*([\d,.]+)/i, "Total Amount"],
    [/net amount[^:]*[:\s]+([\d,.]+)/i, "Net Amount"],
    [/cgst[^%]*%\s*([\d,.]+)/i, "CGST"],
    [/sgst[^%]*%\s*([\d,.]+)/i, "SGST/UTGST"],
    [/taxable value[:\s]+([\d,.]+)/i, "Taxable Value"],
  ];

  const fullText = lines.join(" ");

  fieldPatterns.forEach(([regex, label]) => {
    const m = fullText.match(regex);
    if (m) fields.push({ label, value: m[1] });
  });

  const itemRegex = /(.+?)\s+(\d+)\s*nos\.?\s+([\d.]+)\s+([\d.]+)/gi;
  let m;
  while ((m = itemRegex.exec(fullText)) !== null) {
    items.push({ name: m[1].trim(), qty: m[2], rate: m[3], amount: m[4] });
  }

  return (
    <div className="space-y-3">
      {fields.length > 0 && (
        <div className="rounded-lg border bg-muted/10 divide-y">
          {fields.map(f => (
            <div key={f.label} className="flex items-center justify-between px-3 py-1.5 gap-4">
              <span className="text-[10px] text-muted-foreground shrink-0">{f.label}</span>
              <span className="text-xs font-medium text-right break-all">{f.value}</span>
            </div>
          ))}
        </div>
      )}
      {items.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Line Items</p>
          <div className="rounded border overflow-hidden">
            <table className="w-full text-[11px]">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left px-2 py-1.5 font-medium">Item</th>
                  <th className="text-center px-2 py-1.5 font-medium">Qty</th>
                  <th className="text-right px-2 py-1.5 font-medium">Rate</th>
                  <th className="text-right px-2 py-1.5 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/10"}>
                    <td className="px-2 py-1.5">{item.name}</td>
                    <td className="px-2 py-1.5 text-center">{item.qty}</td>
                    <td className="px-2 py-1.5 text-right">₹{item.rate}</td>
                    <td className="px-2 py-1.5 text-right font-medium">₹{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step 1: Document Review ──────────────────────────────────────────────────

function StepDocumentReview({
  imgUrl, imgLoading, imgError, onRetryImg,
  ocrLoading, ocrError, editedText, setEditedText, isEditing, setIsEditing, onRetryOcr,
  isDuplicate, duplicateLoading,
  fileList, activeFileIndex, onFileSelect,
}: {
  imgUrl: string | null; imgLoading: boolean; imgError: string | null; onRetryImg: () => void;
  ocrLoading: boolean; ocrError: string | null; editedText: string;
  setEditedText: (v: string) => void; isEditing: boolean; setIsEditing: (v: boolean) => void; onRetryOcr: () => void;
  isDuplicate: { status: string; reason?: string; confidence?: number } | null;
  duplicateLoading: boolean;
  fileList: string[];
  activeFileIndex: number;
  onFileSelect: (index: number) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full">
      <div className="flex flex-col gap-2">
        {/* File pagination — shown only when there are multiple files */}
        {fileList.length > 1 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-muted-foreground mr-0.5">Page:</span>
            {fileList.map((name, i) => (
              <button
                key={i}
                onClick={() => onFileSelect(i)}
                title={name}
                className={`h-6 min-w-[24px] px-1.5 rounded text-[10px] font-medium border transition-colors ${
                  i === activeFileIndex
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <span className="text-[10px] text-muted-foreground ml-1 truncate max-w-[160px]" title={fileList[activeFileIndex]}>
              {fileList[activeFileIndex]}
            </span>
          </div>
        )}

        <p className="text-xs font-medium flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> Bill Document</p>
        <div className="flex-1 min-h-[200px] rounded-lg border overflow-hidden bg-muted/20 flex items-center justify-center">
          {imgLoading && <StepLoader message="Loading document image…" />}
          {imgError && !imgLoading && <StepError message={imgError} onRetry={onRetryImg} />}
          {imgUrl && !imgLoading && <img src={imgUrl} alt="Bill document" className="w-full h-full object-contain" />}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between mb-0.5">
          <p className="text-xs font-medium flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> Extracted Document Text</p>
          {!ocrLoading && !ocrError && editedText && (
            <Button variant={isEditing ? "default" : "outline"} size="sm" className="text-[10px] gap-1 h-6 px-2" onClick={() => setIsEditing(!isEditing)}>
              <Pencil className="h-2.5 w-2.5" /> {isEditing ? "Done" : "Edit"}
            </Button>
          )}
        </div>
        <div className="flex-1 min-h-[250px] overflow-hidden">
          {ocrLoading && <StepLoader message="Extracting document text…" />}
          {ocrError && !ocrLoading && <StepError message={ocrError} onRetry={onRetryOcr} />}
          {!ocrLoading && !ocrError && (
            isEditing
              ? <Textarea value={editedText} onChange={(e) => setEditedText(e.target.value)} className="text-xs font-mono h-full min-h-[250px] resize-none" />
              : <pre className="text-xs font-mono bg-muted/30 rounded-lg p-3 whitespace-pre-wrap overflow-visible border min-h-[250px] leading-relaxed">
                  {editedText
                    .replace(/([.:])\s+(?=[A-Z])/g, "$1\n")
                    .replace(/(\d{2}\.\d{2}\.\d{4})/g, "$1\n")
                    .replace(/(Invoice No[^:]*:|GSTIN:|Contact\s*-|E Mail\s*:|Total\s*₹|Net Amount|CGST|SGST)/gi, "\n$1")
                    .replace(/\n{3,}/g, "\n\n")
                    .trim()
                  }
                </pre>
          )}
        </div>

        {/* Duplicate check banner */}
        {duplicateLoading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg p-2.5 border mt-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" /> Checking for duplicate bills…
          </div>
        )}
        {!duplicateLoading && isDuplicate && (
          isDuplicate.status === "duplicate" ? (
            <div className="flex items-start gap-2 text-xs bg-destructive/10 border border-destructive/30 rounded-lg p-2.5 mt-2">
              <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-destructive">Duplicate Bill Detected</p>
                {isDuplicate.reason && <p className="text-muted-foreground mt-0.5">{isDuplicate.reason}</p>}
                {isDuplicate.confidence !== undefined && (
                  <p className="text-muted-foreground">Confidence: {(isDuplicate.confidence * 100).toFixed(0)}%</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs bg-success/10 border border-success/30 rounded-lg p-2.5 mt-2">
              <CheckCircle className="h-3.5 w-3.5 text-success shrink-0" />
              <p className="font-medium text-success">No duplicate found — bill appears unique</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

// ─── Step 2: Forensic Report ──────────────────────────────────────────────────

function StepForensicReport({ loading, error, data, onRetry }: { loading: boolean; error: string | null; data: ForensicsData | null; onRetry: () => void }) {
  if (loading) return <StepLoader message="Running forensic analysis…" />;
  if (error) return <StepError message={error} onRetry={onRetry} />;
  if (!data) return null;

  const { mantranet_score, fraud_score, status } = data.report;
  const scoreColor = (s: number) => s >= 70 ? "text-destructive" : s >= 40 ? "text-warning" : "text-success";

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="text-center mb-2">
        <Shield className="h-8 w-8 mx-auto text-primary mb-1" />
        <h3 className="text-sm font-semibold">Forensic Analysis Report</h3>
        <p className="text-[11px] text-muted-foreground">Automated document forensic analysis</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border p-4 text-center bg-muted/20">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">MantraNet Score</p>
          <p className={`text-3xl font-bold ${scoreColor(mantranet_score)}`}>{mantranet_score.toFixed(1)}<span className="text-sm text-muted-foreground">/100</span></p>
          <p className="text-[10px] text-muted-foreground mt-1">Image manipulation</p>
        </div>
        <div className="rounded-xl border p-4 text-center bg-muted/20">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Fraud Score</p>
          <p className={`text-3xl font-bold ${scoreColor(fraud_score)}`}>{fraud_score}<span className="text-sm text-muted-foreground">/100</span></p>
          <p className="text-[10px] text-muted-foreground mt-1">Overall risk</p>
        </div>
        <div className="rounded-xl border p-4 text-center bg-muted/20">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Risk Status</p>
          <p className={`text-sm font-bold mt-2 ${status === "High Risk" ? "text-destructive" : status === "Medium Risk" ? "text-warning" : "text-success"}`}>{status}</p>
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold mb-2">Forensic Findings</p>
        <div className="space-y-1.5">
          {data.forensic_findings.map((f, i) => (
            <div key={i} className="flex items-start gap-2 rounded-lg border p-2.5 bg-muted/10">
              <AlertTriangle className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${status === "Low Risk" ? "text-success" : status === "Medium Risk" ? "text-warning" : "text-destructive"}`} />
              <p className="text-[11px] text-muted-foreground">{f}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold mb-2">Technical Details</p>
        <div className="grid grid-cols-2 gap-1.5">
          {Object.entries(data.technical_details).filter(([, v]) => typeof v === "number").map(([key, val]) => (
            <div key={key} className="flex justify-between rounded border p-2 bg-muted/10 text-[11px]">
              <span className="text-muted-foreground capitalize">{key.replace(/_/g, " ")}</span>
              <span className="font-mono font-medium">{(val as number).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: Source Verification ─────────────────────────────────────────────

function StepSourceVerification({ loading, error, data, onRetry }: { loading: boolean; error: string | null; data: SourceVerification | null; onRetry: () => void }) {
  if (loading) return <StepLoader message="Running source verification…" />;
  if (error) return <StepError message={error} onRetry={onRetry} />;
  if (!data) return null;

  const { checks, risk_score, summary } = data.analysis;
  const entries = Object.entries(checks)
    .filter(([, v]) => v.status !== "UNKNOWN")
    .sort((a, b) => (a[1].status === "PASS" ? -1 : 1));
  const passed = entries.filter(([, v]) => v.status === "PASS").length;
  const failed = entries.filter(([, v]) => v.status === "FAIL").length;
  const formatKey = (k: string) => k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="text-center mb-2">
        <ShieldCheck className="h-8 w-8 mx-auto text-primary mb-1" />
        <h3 className="text-sm font-semibold">Source Verification</h3>
        <p className="text-[11px] text-muted-foreground">AI-powered receipt and claim analysis</p>
      </div>
      <div className="flex items-center justify-center gap-6 text-xs">
        <span className="flex items-center gap-1 text-success"><CheckCircle className="h-3.5 w-3.5" /> {passed} Passed</span>
        <span className="flex items-center gap-1 text-destructive"><XCircle className="h-3.5 w-3.5" /> {failed} Failed</span>
      </div>
      <div className="space-y-2">
        {entries.map(([key, val]) => (
          <div key={key} className={`flex items-start gap-3 rounded-lg border p-3 ${statusRowClass(val.status)}`}>
            {statusIcon(val.status)}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium">{formatKey(key)}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{val.reason}</p>
            </div>
            <StatusBadge status={val.status} />
          </div>
        ))}
      </div>
      <div className="rounded-lg border p-3 bg-muted/10">
        <p className="text-xs font-semibold mb-1 flex items-center gap-1">
          <Shield className="h-3.5 w-3.5 text-primary" /> Risk Score:
          <span className={`ml-1 ${risk_score === "HIGH" ? "text-destructive" : risk_score === "MEDIUM" ? "text-warning" : "text-success"}`}>{risk_score}</span>
        </p>
        <p className="text-[11px] text-muted-foreground">{summary}</p>
      </div>
    </div>
  );
}

// ─── Step 4: Policy Compliance ────────────────────────────────────────────────

function StepPolicyCompliance({ loading, error, data, onRetry }: { loading: boolean; error: string | null; data: PolicyData | null; onRetry: () => void }) {
  if (loading) return <StepLoader message="Checking policy compliance…" />;
  if (error) return <StepError message={error} onRetry={onRetry} />;
  if (!data) return null;

  const { policy_results, summary } = data.result;
  const filtered = policy_results
    .filter(p => p.status !== "UNKNOWN")
    .sort((a, b) => (a.status === "PASS" ? -1 : 1));

  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      <div className="text-center mb-2">
        <Shield className="h-8 w-8 mx-auto text-primary mb-1" />
        <h3 className="text-sm font-semibold">Policy Compliance Check</h3>
        <p className="text-[11px] text-muted-foreground">Review all applicable policies against this bill</p>
      </div>
      <div className="flex items-center justify-center gap-6 text-xs">
        <span className="flex items-center gap-1 text-success"><CheckCircle className="h-3.5 w-3.5" /> {summary.passed} Passed</span>
        <span className="flex items-center gap-1 text-destructive"><XCircle className="h-3.5 w-3.5" /> {summary.failed} Failed</span>
        <span className="flex items-center gap-1 text-muted-foreground">Total: {summary.total}</span>
      </div>
      <div className="space-y-1.5">
        {filtered.length === 0
          ? <p className="text-center text-xs text-muted-foreground py-6">No policies found for this bill.</p>
          : filtered.map((p) => (
            <div key={p.policy_id} className={`flex items-start gap-2 rounded-lg border p-3 ${statusRowClass(p.status)}`}>
              {statusIcon(p.status)}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium capitalize">{p.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{p.reason}</p>
              </div>
              <StatusBadge status={p.status} />
            </div>
          ))
        }
      </div>
    </div>
  );
}

// ─── Step 5: Summary & Action ─────────────────────────────────────────────────

function StepSummary({ claim, forensics, sourceData, policyData, comment, setComment }: {
  claim: ClaimForReview; forensics: ForensicsData | null; sourceData: SourceVerification | null;
  policyData: PolicyData | null; comment: string; setComment: (v: string) => void;
}) {
  const anyLoading = !forensics || !sourceData || !policyData;

  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      <h3 className="text-sm font-semibold text-center">Review Summary</h3>

      {anyLoading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg p-2.5 border">
          <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
          Analysis still in progress — some sections below may be incomplete. You can still approve or reject.
        </div>
      )}

      {/* Claim info */}
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        {[
          { label: "Bill Title", value: claim.title },
          { label: "Submitted By", value: claim.submitter_name },
          { label: "Amount", value: `₹${Number(claim.amount).toLocaleString("en-IN")}` },
          { label: "Date", value: claim.date },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border p-2.5 bg-muted/20">
            <p className="text-muted-foreground">{item.label}</p>
            <p className="font-medium mt-0.5">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Forensic scores */}
      {forensics ? (
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "MantraNet", value: `${forensics.report.mantranet_score.toFixed(1)}/100` },
            { label: "Fraud Score", value: `${forensics.report.fraud_score}/100` },
            { label: "Risk Status", value: forensics.report.status },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border p-2.5 text-center bg-muted/20">
              <p className="text-[10px] text-muted-foreground">{item.label}</p>
              <p className="text-sm font-bold mt-1">{item.value}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border p-2.5 bg-muted/10 flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading forensic scores…
        </div>
      )}

      {/* Source verification */}
      {sourceData ? (
        <div>
          <p className="text-xs font-semibold mb-1.5 flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> Source Verification</p>
          <div className="space-y-1">
            {Object.entries(sourceData.analysis.checks)
              .filter(([, val]) => val.status !== "UNKNOWN")
              .sort((a, b) => (a[1].status === "PASS" ? -1 : 1))
              .map(([key, val]) => (
                <div key={key} className={`flex items-center gap-2 rounded border p-1.5 text-[11px] ${statusRowClass(val.status)}`}>
                  {statusIcon(val.status)}
                  <span className="font-medium capitalize flex-1">{key.replace(/_/g, " ")}</span>
                  <StatusBadge status={val.status} />
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border p-2.5 bg-muted/10 flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading source verification…
        </div>
      )}

      {/* Policy checks */}
      {policyData ? (
        <div>
          <p className="text-xs font-semibold mb-1.5 flex items-center gap-1">
            <Shield className="h-3.5 w-3.5 text-primary" /> Policy Compliance
            <span className="ml-auto text-[10px] font-normal text-muted-foreground">
              {policyData.result.summary.passed} passed · {policyData.result.summary.failed} failed · {policyData.result.summary.total} total
            </span>
          </p>
          <div className="space-y-1">
            {policyData.result.policy_results
              .filter(p => p.status !== "UNKNOWN")
              .sort((a, b) => (a.status === "PASS" ? -1 : 1))
              .map((p) => (
                <div key={p.policy_id} className={`flex items-center gap-1.5 rounded border p-1.5 text-[11px] ${statusRowClass(p.status)}`}>
                  {statusIcon(p.status)}
                  <span className="font-medium capitalize flex-1">{p.title}</span>
                  <StatusBadge status={p.status} />
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border p-2.5 bg-muted/10 flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading policy checks…
        </div>
      )}

      {/* AI summary */}
      {sourceData?.analysis.summary && (
        <div>
          <p className="text-xs font-medium mb-1">AI Summary</p>
          <p className="text-[11px] text-muted-foreground bg-muted/30 rounded-lg p-2.5 border">{sourceData.analysis.summary}</p>
        </div>
      )}

      {/* Comments */}
      <div>
        <p className="text-xs font-medium mb-1">Comments</p>
        <Textarea placeholder="Add details or comments before approving / rejecting…" value={comment} onChange={(e) => setComment(e.target.value)} className="text-xs" rows={2} />
      </div>
    </div>
  );
}