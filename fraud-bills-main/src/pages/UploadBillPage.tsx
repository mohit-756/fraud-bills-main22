// import React, { useState, useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Upload,
//   FileText,
//   CheckCircle,
//   Database,
//   Cloud,
//   Layers,
//   ChevronRight,
//   X,
//   ShieldCheck,
//   FileIcon,
//   Plus,
//   Loader2,
//   ArrowLeft,
//   HardDrive,
//   Folder,
//   Search
// } from "lucide-react";
 
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox"; // Corrected resolution path
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { cn } from "@/lib/utils";
// import { toast } from "sonner";
 
// // ─── Types & Configuration ──────────────────────────────────────────────────
 
// type SourceType = "local" | "s3" | "blob" | "onelake";
 
// interface CloudFile {
//   id: string;
//   name: string;
//   size: string;
//   fullPath: string;
//   sourceType: SourceType;
//   credentials: any;
// }
 
// interface BatchFile {
//   id: string;
//   name: string;
//   size: string;
//   type: 'local' | 'cloud';
//   file?: File;
//   cloudData?: CloudFile;
// }
 
// const SOURCE_TABS: { id: SourceType; label: string; icon: React.ElementType; description: string }[] = [
//   { id: "local", label: "Local Files", icon: Upload, description: "Upload from your computer" },
//   { id: "s3", label: "Amazon S3", icon: Database, description: "Connect to AWS Bucket" },
//   { id: "blob", label: "Azure Blob", icon: Cloud, description: "Azure Storage Account" },
//   { id: "onelake", label: "OneLake", icon: Layers, description: "MS Fabric OneLake" },
// ];
 
// const BASE_URL = "https://d2ontk4ewdype3.cloudfront.net";
 
// // ─── Component ───────────────────────────────────────────────────────────────
 
// export default function UploadBillPage() {
//   const navigate = useNavigate();
 
//   // Form Basic Info
//   const [billName, setBillName] = useState("");
//   const [amount, setAmount] = useState("");
//   const [description, setDescription] = useState("");
//   const [source, setSource] = useState<SourceType>("local");
 
//   // File Queue (Local + Cloud)
//   const [batchFiles, setBatchFiles] = useState<BatchFile[]>([]);
 
//   // UI State
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [dragActive, setDragActive] = useState(false);
 
//   // Cloud Modal States
//   const [isPickerModalOpen, setIsPickerModalOpen] = useState(false);
//   const [isValidating, setIsValidating] = useState(false);
//   const [isLoadingPicker, setIsLoadingPicker] = useState(false);
 
//   // Cloud Credentials State
//   const [s3Creds, setS3Creds] = useState({ aws_access_key_id: "", aws_secret_access_key: "", region: "us-east-1" });
//   const [blobCreds, setBlobCreds] = useState({ connection_string: "" });
//   const [oneLakeCreds, setOneLakeCreds] = useState({ tenant_id: "", client_id: "", client_secret: "" });
 
//   // Cloud Browser State
//   const [containers, setContainers] = useState<string[]>([]);
//   const [currentContainer, setCurrentContainer] = useState<string | null>(null);
//   const [remoteFiles, setRemoteFiles] = useState<any[]>([]);
//   const [selectedRemoteIds, setSelectedRemoteIds] = useState<string[]>([]);
 
//   // ─── Handlers ─────────────────────────────────────────────────────────────
 
//   const handleLocalFiles = (newFiles: FileList | null) => {
//     if (!newFiles) return;
//     const items = Array.from(newFiles)
//       .filter(f => f.type.match(/image\/*/) || f.type === "application/pdf")
//       .map(f => ({
//         id: `local-${Date.now()}-${Math.random()}`,
//         name: f.name,
//         size: `${(f.size / 1024).toFixed(0)} KB`,
//         type: 'local' as const,
//         file: f
//       }));
//     setBatchFiles(prev => [...prev, ...items]);
//     if (billName === "" && items.length > 0) {
//         setBillName(items[0].name.split('.')[0]);
//     }
//   };
 
//   const removeFile = (id: string) => {
//     setBatchFiles(prev => prev.filter(f => f.id !== id));
//   };
 
//   // ─── Actual API Connections ───────────────────────────────────────────────
 
//   const connectToCloud = async () => {
//     setIsValidating(true);
//     try {
//       let endpoint = "";
//       let payload = {};
 
//       if (source === 's3') {
//         endpoint = "/get-s3-buckets";
//         payload = s3Creds;
//       } else if (source === 'blob') {
//         endpoint = "/get-azure-containers";
//         payload = blobCreds;
//       } else if (source === 'onelake') {
//         endpoint = "/get-onelake-workspaces";
//         payload = oneLakeCreds;
//       }
 
//       const res = await fetch(`${BASE_URL}${endpoint}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       });
 
//       if (!res.ok) throw new Error("Authentication failed with provided credentials");
 
//       const data = await res.json();
//       setContainers(Array.isArray(data) ? data : data.buckets || data.containers || data.workspaces || []);
     
//       setIsPickerModalOpen(true);
//       toast.success("Connected", { description: `Accessed your ${source.toUpperCase()} environment.` });
//     } catch (e: any) {
//       toast.error("Connection Failed", { description: e.message });
//     } finally {
//       setIsValidating(false);
//     }
//   };
 
//   const loadRemoteFiles = async (containerName: string) => {
//     setIsLoadingPicker(true);
//     setCurrentContainer(containerName);
//     try {
//       let endpoint = "";
//       let payload: any = {};
 
//       if (source === 's3') {
//         endpoint = "/get-s3-objects";
//         payload = { ...s3Creds, bucket_name: containerName };
//       } else if (source === 'blob') {
//         endpoint = "/get-azure-blobs";
//         payload = { ...blobCreds, container_name: containerName };
//       } else if (source === 'onelake') {
//         endpoint = "/get-onelake-lakehouses";
//         payload = { ...oneLakeCreds, workspace_name: containerName };
//       }
 
//       const res = await fetch(`${BASE_URL}${endpoint}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       });
 
//       if (!res.ok) throw new Error("Failed to fetch remote items");
 
//       const data = await res.json();
//       const items = data.files || data.blobs || data.lakehouses || [];
     
//       setRemoteFiles(items.map((item: any) => ({
//         id: typeof item === 'string' ? item : item.name || item.key,
//         name: typeof item === 'string' ? item : item.name || item.key,
//         size: item.size ? `${(item.size / 1024).toFixed(0)} KB` : "N/A"
//       })));
//     } catch (e: any) {
//       toast.error("Browse Error", { description: e.message });
//       setCurrentContainer(null);
//     } finally {
//       setIsLoadingPicker(false);
//     }
//   };
 
//   const addSelectedRemoteToBatch = () => {
//     const selected = remoteFiles
//       .filter(rf => selectedRemoteIds.includes(rf.id))
//       .map(rf => ({
//         id: `cloud-${rf.id}-${Date.now()}`,
//         name: rf.name,
//         size: rf.size,
//         type: 'cloud' as const,
//         cloudData: {
//           id: rf.id,
//           name: rf.name,
//           size: rf.size,
//           fullPath: `${currentContainer}/${rf.name}`,
//           sourceType: source,
//           credentials: source === 's3' ? s3Creds : source === 'blob' ? blobCreds : oneLakeCreds
//         }
//       }));
   
//     setBatchFiles(prev => [...prev, ...selected]);
//     if (billName === "" && selected.length > 0) {
//         setBillName(selected[0].name.split('.')[0]);
//     }
//     setIsPickerModalOpen(false);
//     setSelectedRemoteIds([]);
//     setCurrentContainer(null);
//   };
 
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (batchFiles.length === 0) return;
 
//     setIsSubmitting(true);
//     try {
//       const storedUser = localStorage.getItem("user");
//       if (!storedUser) throw new Error("User session not found");
//       const user = JSON.parse(storedUser);
 
//       const formData = new FormData();
//       formData.append("upload_id", crypto.randomUUID());
//       formData.append("user_id", user.user_id);
//       formData.append("title", billName);
//       formData.append("amount", amount);
//       formData.append("description", description);
 
//       batchFiles.forEach((item) => {
//         if (item.type === 'local' && item.file) {
//           formData.append("files", item.file);
//         } else if (item.type === 'cloud' && item.cloudData) {
//           formData.append(`cloud_files`, JSON.stringify(item.cloudData));
//         }
//       });
 
//       const response = await fetch(`${BASE_URL}/upload`, {
//         method: "POST",
//         body: formData,
//       });
 
//       if (!response.ok) throw new Error("Upload failed");
 
//       setShowSuccess(true);
//       setBatchFiles([]);
//       setBillName("");
//       setAmount("");
//       setDescription("");
//     } catch (error: any) {
//       toast.error("Submission Error", { description: error.message });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
 
//   return (
//     <div className="space-y-6 animate-fade-in pb-20">
//       {/* Header */}
//       <div className="flex items-center gap-3">
//         <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shadow-sm text-primary">
//           <Upload size={24} />
//         </div>
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight">Upload Bill </h1>
//           <p className="text-muted-foreground text-sm mt-1">Submit a new bill for review and approval.</p>
//         </div>
//       </div>
 
//       <form onSubmit={handleSubmit} className="space-y-6">
       
//         {/* Step 1: Select Source */}
//         <div className="space-y-4">
//           <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">1. Choose Storage Source</h3>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {SOURCE_TABS.map((tab) => (
//               <button
//                 key={tab.id}
//                 type="button"
//                 onClick={() => setSource(tab.id)}
//                 className={cn(
//                   "flex flex-col items-center text-center p-4 rounded-xl border-2 transition-all group relative",
//                   source === tab.id
//                     ? "border-primary bg-primary/5 text-primary shadow-sm"
//                     : "border-slate-100 bg-card hover:border-slate-200 text-slate-500"
//                 )}
//               >
//                 <div className={cn(
//                   "p-2.5 rounded-lg mb-2.5 transition-colors",
//                   source === tab.id ? "bg-primary text-primary-foreground" : "bg-muted text-slate-400 group-hover:bg-accent"
//                 )}>
//                   <tab.icon size={20} />
//                 </div>
//                 <span className="text-[10px] font-bold uppercase tracking-tight">{tab.label}</span>
//                 {source === tab.id && <CheckCircle size={14} className="absolute top-2 right-2 text-primary" />}
//               </button>
//             ))}
//           </div>
//         </div>
 
//         {/* Step 2: Immediate Input / Upload Area */}
//         <div className="space-y-4">
//           <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">2. Select Bill Document(s)</h3>
//           <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
//             <CardContent className="p-6">
//               {source === "local" ? (
//                 <div
//                   onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
//                   onDragLeave={() => setDragActive(false)}
//                   onDrop={(e) => { e.preventDefault(); setDragActive(false); handleLocalFiles(e.dataTransfer.files); }}
//                   className={cn(
//                     "border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3",
//                     dragActive ? "border-primary bg-primary/5 scale-[0.99]" : "border-slate-200 hover:border-primary/50 hover:bg-muted/30"
//                   )}
//                   onClick={() => document.getElementById("file-input")?.click()}
//                 >
//                   <input id="file-input" type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => handleLocalFiles(e.target.files)} />
//                   <div className="w-14 h-14 rounded-full bg-muted text-slate-400 flex items-center justify-center mb-1 transition-colors">
//                     <Plus size={32} />
//                   </div>
//                   <p className="text-sm font-bold text-slate-700">Click or drag local invoices</p>
//                   <p className="text-xs text-slate-400 font-medium">Supports PDF, JPG, and PNG images</p>
//                 </div>
//               ) : (
//                 <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
//                     <div className="flex items-center gap-3 mb-6">
//                         <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
//                             <ShieldCheck size={20} />
//                         </div>
//                         <div>
//                             <p className="text-sm font-bold uppercase tracking-tight">{source.toUpperCase()} Connection Details</p>
//                             <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Enter credentials to browse remote files</p>
//                         </div>
//                     </div>
                   
//                     <div className="grid sm:grid-cols-2 gap-4 mb-6">
//                         {source === "s3" && (
//                             <>
//                                 <div className="space-y-2">
//                                     <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">AWS Access Key ID</Label>
//                                     <Input value={s3Creds.aws_access_key_id} onChange={e => setS3Creds({...s3Creds, aws_access_key_id: e.target.value})} placeholder="AKIA..." className="rounded-xl" />
//                                 </div>
//                                 <div className="space-y-2">
//                                     <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">AWS Secret Key</Label>
//                                     <Input type="password" value={s3Creds.aws_secret_access_key} onChange={e => setS3Creds({...s3Creds, aws_secret_access_key: e.target.value})} placeholder="••••" className="rounded-xl" />
//                                 </div>
//                                 <div className="space-y-2 sm:col-span-2">
//                                     <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Bucket Region</Label>
//                                     <Input value={s3Creds.region} onChange={e => setS3Creds({...s3Creds, region: e.target.value})} placeholder="us-east-1" className="rounded-xl" />
//                                 </div>
//                             </>
//                         )}
//                         {source === "blob" && (
//                             <div className="space-y-2 sm:col-span-2">
//                                 <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Azure Connection String</Label>
//                                 <Input value={blobCreds.connection_string} onChange={e => setBlobCreds({connection_string: e.target.value})} placeholder="DefaultEndpointsProtocol=..." className="rounded-xl" />
//                             </div>
//                         )}
//                         {source === "onelake" && (
//                             <>
//                                 <div className="space-y-2">
//                                     <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tenant ID</Label>
//                                     <Input value={oneLakeCreds.tenant_id} onChange={e => setOneLakeCreds({...oneLakeCreds, tenant_id: e.target.value})} className="rounded-xl" />
//                                 </div>
//                                 <div className="space-y-2">
//                                     <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Client ID</Label>
//                                     <Input value={oneLakeCreds.client_id} onChange={e => setOneLakeCreds({...oneLakeCreds, client_id: e.target.value})} className="rounded-xl" />
//                                 </div>
//                                 <div className="space-y-2 sm:col-span-2">
//                                     <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Client Secret</Label>
//                                     <Input type="password" value={oneLakeCreds.client_secret} onChange={e => setOneLakeCreds({...oneLakeCreds, client_secret: e.target.value})} className="rounded-xl" />
//                                 </div>
//                             </>
//                         )}
//                     </div>
                   
//                     <Button
//                         type="button"
//                         onClick={connectToCloud}
//                         disabled={isValidating}
//                         className="w-full rounded-xl shadow-lg font-bold h-11"
//                     >
//                         {isValidating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
//                         Browse remote files from {source.toUpperCase()}
//                     </Button>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>
 
//         {/* Step 3: Information Box */}
//         <div className="space-y-4">
//           <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">3. Enter Bill Information</h3>
//           <Card className="border-slate-200 shadow-sm overflow-hidden rounded-2xl">
//             <CardHeader className="bg-muted/50 border-b py-4 px-6">
//               <CardTitle className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-500">
//                 Identify Document Data
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="p-6 space-y-6">
//               <div className="grid sm:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <Label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Bill Reference Name</Label>
//                   <Input
//                     value={billName}
//                     onChange={(e) => setBillName(e.target.value)}
//                     placeholder="e.g. AWS_Monthly_March"
//                     className="rounded-xl focus:ring-primary h-11 bg-muted/20"
//                     required
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Statement Amount (₹)</Label>
//                   <Input
//                     type="number"
//                     value={amount}
//                     onChange={(e) => setAmount(e.target.value)}
//                     placeholder="0.00"
//                     className="rounded-xl focus:ring-primary h-11 font-mono bg-muted/20 text-lg font-bold"
//                     required
//                   />
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <Label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Disbursement Notes</Label>
//                 <Textarea
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   placeholder="Provide context for finance audit..."
//                   rows={2}
//                   className="rounded-xl focus:ring-primary resize-none bg-muted/20"
//                 />
//               </div>
//             </CardContent>
//           </Card>
//         </div>
 
//         {/* Batch Queue Summary */}
//         {batchFiles.length > 0 && (
//           <div className="space-y-3 animate-in fade-in slide-in-from-top-2 border-t border-slate-100 pt-8">
//             <div className="flex items-center justify-between px-1">
//               <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Selected Batch ({batchFiles.length})</p>
//               <button type="button" onClick={() => setBatchFiles([])} className="text-[10px] font-bold text-destructive hover:underline transition-colors">Clear Entire Batch</button>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//               {batchFiles.map((f) => (
//                 <div key={f.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-card group shadow-sm hover:border-primary transition-all">
//                   <div className="flex items-center gap-3 min-w-0">
//                     <div className={cn(
//                       "h-9 w-9 rounded-lg flex items-center justify-center shrink-0 shadow-inner transition-colors",
//                       f.type === 'local' ? "bg-primary/10 text-primary" : "bg-success/10 text-success"
//                     )}>
//                       {f.type === 'local' ? <FileIcon size={18} /> : <Cloud size={18} />}
//                     </div>
//                     <div className="min-w-0">
//                       <p className="text-xs font-bold text-slate-800 truncate">{f.name}</p>
//                       <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">{f.size} • {f.type}</p>
//                     </div>
//                   </div>
//                   <button type="button" onClick={() => removeFile(f.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-slate-300 hover:text-destructive transition-all opacity-0 group-hover:opacity-100">
//                     <X size={14} strokeWidth={3} />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
 
//         <Button
//           type="submit"
//           disabled={isSubmitting || batchFiles.length === 0}
//           className="w-full h-14 rounded-2xl font-bold text-base transition-all shadow-xl disabled:shadow-none"
//         >
//           {isSubmitting ? (
//             <div className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Transmitting Data...</div>
//           ) : (
//             <div className="flex items-center gap-2">Upload Bill {batchFiles.length > 0 && `(${batchFiles.length})`} <ChevronRight size={20} /></div>
//           )}
//         </Button>
//       </form>
 
//       {/* ─── FILE PICKER MODAL ─── */}
 
//       <Dialog open={isPickerModalOpen} onOpenChange={setIsPickerModalOpen}>
//         <DialogContent className="max-w-2xl h-[85vh] flex flex-col rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
//           <div className="p-6 bg-muted/30 border-b">
//             <DialogHeader>
//                 <DialogTitle className="flex items-center gap-3 text-lg">
//                 {currentContainer && (
//                     <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10 text-primary" onClick={() => setCurrentContainer(null)}>
//                     <ArrowLeft size={18} />
//                     </Button>
//                 )}
//                 {currentContainer ? (
//                     <span className="font-mono text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/20">{currentContainer}</span>
//                 ) : (
//                     <span className="font-black uppercase tracking-tight">Browse {source.toUpperCase()} Repository</span>
//                 )}
//                 </DialogTitle>
//                 <DialogDescription className="text-xs font-medium text-muted-foreground">Pick documents to include in this audit batch.</DialogDescription>
//             </DialogHeader>
//           </div>
 
//           {isLoadingPicker ? (
//             <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-muted/10">
//               <div className="h-14 w-14 rounded-3xl bg-card shadow-xl flex items-center justify-center">
//                 <Loader2 className="h-7 w-7 animate-spin text-primary" />
//               </div>
//               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] animate-pulse">Syncing remote objects</p>
//             </div>
//           ) : (
//             <ScrollArea className="flex-1 p-6">
//               <div className="space-y-2">
//                 {!currentContainer ? (
//                   containers.map(c => (
//                     <div key={c} onClick={() => loadRemoteFiles(c)} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all group bg-card shadow-sm">
//                       <Folder className="h-6 w-6 text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform" />
//                       <p className="font-bold text-sm text-slate-700">{c}</p>
//                     </div>
//                   ))
//                 ) : (
//                   remoteFiles.length > 0 ? remoteFiles.map(f => (
//                     <div
//                       key={f.id}
//                       onClick={() => {
//                         setSelectedRemoteIds(prev => prev.includes(f.id) ? prev.filter(id => id !== f.id) : [...prev, f.id])
//                       }}
//                       className={cn(
//                         "flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all group shadow-sm bg-card",
//                         selectedRemoteIds.includes(f.id) ? "border-primary bg-primary/5" : "border-slate-100 hover:border-primary/30"
//                       )}
//                     >
//                       <Checkbox checked={selectedRemoteIds.includes(f.id)} className="h-5 w-5 rounded-lg" />
//                       <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
//                         <FileIcon size={20} />
//                       </div>
//                       <div className="flex-1">
//                         <p className="text-sm font-bold text-slate-800">{f.name}</p>
//                         <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tight">{f.size} • {f.name.split('.').pop()}</p>
//                       </div>
//                     </div>
//                   )) : (
//                     <div className="py-20 text-center flex flex-col items-center gap-3 opacity-50">
//                         <HardDrive size={48} className="text-slate-300" />
//                         <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No documents found in this path</p>
//                     </div>
//                   )
//                 )}
//               </div>
//             </ScrollArea>
//           )}
 
//           <div className="p-6 bg-muted/30 border-t flex justify-end gap-3">
//             <Button variant="ghost" onClick={() => setIsPickerModalOpen(false)} className="rounded-xl font-bold">Discard</Button>
//             <Button onClick={addSelectedRemoteToBatch} disabled={selectedRemoteIds.length === 0} className="rounded-xl px-8 font-bold shadow-lg transition-all h-11">
//               Select {selectedRemoteIds.length} Items
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
 
//       {/* Success Dialog */}
//       <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
//         <DialogContent className="sm:max-w-md text-center p-12 rounded-[3rem] overflow-hidden border-none shadow-2xl">
//           <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
//           <div className="flex flex-col items-center">
//             <div className="h-24 w-24 rounded-[2rem] bg-success/10 flex items-center justify-center mb-8 shadow-sm border border-success/20">
//               <CheckCircle className="h-12 w-12 text-success" />
//             </div>
//             <DialogTitle className="text-3xl font-black text-slate-900 leading-tight">Submission Completed</DialogTitle>
//             <DialogDescription className="text-muted-foreground font-medium mt-3 max-w-[280px] text-base">Your documents are now safely queued for the smart review audit engine.</DialogDescription>
//           </div>
//           <div className="flex flex-col gap-3 mt-10">
//             <Button onClick={() => setShowSuccess(false)} className="h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-base shadow-xl">
//               Return to Workspace
//             </Button>
//             <Button variant="ghost" onClick={() => { setShowSuccess(false); navigate("/bills"); }} className="h-12 rounded-2xl font-black text-primary tracking-tight">
//               Review Disbursement Status
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
 

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  FileText,
  CheckCircle,
  Database,
  Cloud,
  Layers,
  ChevronRight,
  X,
  ShieldCheck,
  FileIcon,
  Plus,
  Loader2,
  ArrowLeft,
  HardDrive,
  Folder,
  Search,
  AlertTriangle,
  BadgeCheck
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ─── Types & Configuration ──────────────────────────────────────────────────

type SourceType = "local" | "s3" | "blob" | "onelake";

interface CloudFile {
  id: string;
  name: string;
  size: string;
  fullPath: string;
  sourceType: SourceType;
  credentials: any;
}

interface BatchFile {
  id: string;
  name: string;
  size: string;
  type: 'local' | 'cloud';
  file?: File;
  cloudData?: CloudFile;
}

interface ValidationResult {
  amount_match: boolean;
  amount_verdict_message: string;
  amount_verdict: string;
  file_name: string;      // ← add
  upload_id: string;      // ← add

}

const SOURCE_TABS: { id: SourceType; label: string; icon: React.ElementType; description: string }[] = [
  { id: "local", label: "Local Files", icon: Upload, description: "Upload from your computer" },
  { id: "s3", label: "Amazon S3", icon: Database, description: "Connect to AWS Bucket" },
  { id: "blob", label: "Azure Blob", icon: Cloud, description: "Azure Storage Account" },
  { id: "onelake", label: "OneLake", icon: Layers, description: "MS Fabric OneLake" },
];

const BASE_URL = "https://d2ontk4ewdype3.cloudfront.net";
const VALIDATE_URL = "https://d2ontk4ewdype3.cloudfront.net";

// ─── Component ───────────────────────────────────────────────────────────────

export default function UploadBillPage() {
  const navigate = useNavigate();

  // Form Basic Info
  const [billName, setBillName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState<SourceType>("local");

  // File Queue (Local + Cloud)
  const [batchFiles, setBatchFiles] = useState<BatchFile[]>([]);

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Validation State
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidated, setIsValidated] = useState(false);

  // Cloud Modal States
  const [isPickerModalOpen, setIsPickerModalOpen] = useState(false);
  const [isCloudValidating, setIsCloudValidating] = useState(false);
  const [isLoadingPicker, setIsLoadingPicker] = useState(false);

  // Cloud Credentials State
  const [s3Creds, setS3Creds] = useState({ aws_access_key_id: "", aws_secret_access_key: "", region: "us-east-1" });
  const [blobCreds, setBlobCreds] = useState({ connection_string: "" });
  const [oneLakeCreds, setOneLakeCreds] = useState({ tenant_id: "", client_id: "", client_secret: "" });

  // Cloud Browser State
  const [containers, setContainers] = useState<string[]>([]);
  const [currentContainer, setCurrentContainer] = useState<string | null>(null);
  const [remoteFiles, setRemoteFiles] = useState<any[]>([]);
  const [selectedRemoteIds, setSelectedRemoteIds] = useState<string[]>([]);

  // Reset validation whenever amount or files change
  useEffect(() => {
    setIsValidated(false);
    setValidationResult(null);
  }, [amount, batchFiles]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleLocalFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const items = Array.from(newFiles)
      .filter(f => f.type.match(/image\/*/) || f.type === "application/pdf")
      .map(f => ({
        id: `local-${Date.now()}-${Math.random()}`,
        name: f.name,
        size: `${(f.size / 1024).toFixed(0)} KB`,
        type: 'local' as const,
        file: f
      }));
    setBatchFiles(prev => [...prev, ...items]);
    if (billName === "" && items.length > 0) {
      setBillName(items[0].name.split('.')[0]);
    }
  };

  const removeFile = (id: string) => {
    setBatchFiles(prev => prev.filter(f => f.id !== id));
  };

  // ─── Validation Handler ───────────────────────────────────────────────────

  const handleValidate = async () => {
    if (batchFiles.length === 0 || !amount) return;

    // Only validate local files (need actual File object for multipart)
    const localFile = batchFiles.find(f => f.type === 'local' && f.file);
    if (!localFile || !localFile.file) {
      toast.warning("Validation requires a local file", {
        description: "Please upload at least one local image or PDF to validate."
      });
      return;
    }

    setIsValidating(true);
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) throw new Error("User session not found. Please log in again.");
      const user = JSON.parse(storedUser);

      const uploadId = crypto.randomUUID();
      const formData = new FormData();
      formData.append("user_id", user.user_id);
      formData.append("upload_id", uploadId);
      formData.append("submitted_amount", amount);
      formData.append("image", localFile.file);

      const res = await fetch(`${VALIDATE_URL}/validate-bill`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Validation request failed. Please try again.");

      const data = await res.json();
      const validation = data?.bill_validation;

      if (!validation) throw new Error("Invalid response from validation service.");

      const result: ValidationResult = {
        amount_match: validation.amount_match,
        amount_verdict_message: validation.amount_verdict_message,
        amount_verdict: validation.amount_verdict,
        file_name: data.file_name,        // ← add (top-level field from response)
        upload_id: data.upload_id,         // ← add (top-level field from response)
      };

      setValidationResult(result);
      setIsValidated(true);

      if (result.amount_match) {
        toast.success("Amount Verified", {
          description: result.amount_verdict_message,
          duration: 5000,
          icon: <BadgeCheck className="text-green-500" size={18} />,
        });
      } else {
        toast.warning("Amount Mismatch Detected", {
          description: result.amount_verdict_message,
          duration: 7000,
          icon: <AlertTriangle className="text-amber-500" size={18} />,
        });
      }
    } catch (e: any) {
      toast.error("Validation Failed", { description: e.message });
    } finally {
      setIsValidating(false);
    }
  };

  // ─── Actual API Connections ───────────────────────────────────────────────

  const connectToCloud = async () => {
    setIsCloudValidating(true);
    try {
      let endpoint = "";
      let payload = {};

      if (source === 's3') {
        endpoint = "/get-s3-buckets";
        payload = s3Creds;
      } else if (source === 'blob') {
        endpoint = "/get-azure-containers";
        payload = blobCreds;
      } else if (source === 'onelake') {
        endpoint = "/get-onelake-workspaces";
        payload = oneLakeCreds;
      }

      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Authentication failed with provided credentials");

      const data = await res.json();
      setContainers(Array.isArray(data) ? data : data.buckets || data.containers || data.workspaces || []);

      setIsPickerModalOpen(true);
      toast.success("Connected", { description: `Accessed your ${source.toUpperCase()} environment.` });
    } catch (e: any) {
      toast.error("Connection Failed", { description: e.message });
    } finally {
      setIsCloudValidating(false);
    }
  };

  const loadRemoteFiles = async (containerName: string) => {
    setIsLoadingPicker(true);
    setCurrentContainer(containerName);
    try {
      let endpoint = "";
      let payload: any = {};

      if (source === 's3') {
        endpoint = "/get-s3-objects";
        payload = { ...s3Creds, bucket_name: containerName };
      } else if (source === 'blob') {
        endpoint = "/get-azure-blobs";
        payload = { ...blobCreds, container_name: containerName };
      } else if (source === 'onelake') {
        endpoint = "/get-onelake-lakehouses";
        payload = { ...oneLakeCreds, workspace_name: containerName };
      }

      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to fetch remote items");

      const data = await res.json();
      const items = data.files || data.blobs || data.lakehouses || [];

      setRemoteFiles(items.map((item: any) => ({
        id: typeof item === 'string' ? item : item.name || item.key,
        name: typeof item === 'string' ? item : item.name || item.key,
        size: item.size ? `${(item.size / 1024).toFixed(0)} KB` : "N/A"
      })));
    } catch (e: any) {
      toast.error("Browse Error", { description: e.message });
      setCurrentContainer(null);
    } finally {
      setIsLoadingPicker(false);
    }
  };

  const addSelectedRemoteToBatch = () => {
    const selected = remoteFiles
      .filter(rf => selectedRemoteIds.includes(rf.id))
      .map(rf => ({
        id: `cloud-${rf.id}-${Date.now()}`,
        name: rf.name,
        size: rf.size,
        type: 'cloud' as const,
        cloudData: {
          id: rf.id,
          name: rf.name,
          size: rf.size,
          fullPath: `${currentContainer}/${rf.name}`,
          sourceType: source,
          credentials: source === 's3' ? s3Creds : source === 'blob' ? blobCreds : oneLakeCreds
        }
      }));

    setBatchFiles(prev => [...prev, ...selected]);
    if (billName === "" && selected.length > 0) {
      setBillName(selected[0].name.split('.')[0]);
    }
    setIsPickerModalOpen(false);
    setSelectedRemoteIds([]);
    setCurrentContainer(null);
  };

  // ─── Submit Handler ───────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (batchFiles.length === 0) return;

    // If not yet validated, trigger validation first
    if (!isValidated) {
      await handleValidate();
      return;
    }

    // If validated but amount mismatch, require explicit re-confirm (already shown warning toast)
    setIsSubmitting(true);
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) throw new Error("User session not found");
      const user = JSON.parse(storedUser);

      const params = new URLSearchParams();
      params.append("user_id", user.user_id);
      params.append("upload_id", validationResult!.upload_id);
      params.append("title", billName);
      params.append("amount", amount);
      params.append("description", description);
      params.append("file_name", validationResult!.file_name);

      const response = await fetch(`${VALIDATE_URL}/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      });

      if (!response.ok) throw new Error("Upload failed");

      setShowSuccess(true);
      setBatchFiles([]);
      setBillName("");
      setAmount("");
      setDescription("");
      setIsValidated(false);
      setValidationResult(null);
    } catch (error: any) {
      toast.error("Submission Error", { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Derived button state ─────────────────────────────────────────────────

  const canValidate = batchFiles.length > 0 && !!amount && !!billName;

  const getButtonState = () => {
    if (isValidating) return { label: "Validating Amount...", icon: <Loader2 className="h-5 w-5 animate-spin" />, variant: "default" as const };
    if (isSubmitting) return { label: "Transmitting Data...", icon: <Loader2 className="h-5 w-5 animate-spin" />, variant: "default" as const };

    if (!isValidated) {
      return {
        label: `Validate Amount${batchFiles.length > 0 ? ` (${batchFiles.length})` : ""}`,
        icon: <ShieldCheck size={20} />,
        variant: "default" as const
      };
    }

    if (validationResult && !validationResult.amount_match) {
      return {
        label: "Submit Anyway",
        icon: <AlertTriangle size={20} />,
        variant: "destructive" as const
      };
    }

    return {
      label: `Confirm & Submit (${batchFiles.length})`,
      icon: <ChevronRight size={20} />,
      variant: "default" as const
    };
  };

  const btnState = getButtonState();

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shadow-sm text-primary">
          <Upload size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Upload Bill</h1>
          <p className="text-muted-foreground text-sm mt-1">Submit a new bill for review and approval.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Step 1: Select Source */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">1. Choose Storage Source</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SOURCE_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSource(tab.id)}
                className={cn(
                  "flex flex-col items-center text-center p-4 rounded-xl border-2 transition-all group relative",
                  source === tab.id
                    ? "border-primary bg-primary/5 text-primary shadow-sm"
                    : "border-slate-100 bg-card hover:border-slate-200 text-slate-500"
                )}
              >
                <div className={cn(
                  "p-2.5 rounded-lg mb-2.5 transition-colors",
                  source === tab.id ? "bg-primary text-primary-foreground" : "bg-muted text-slate-400 group-hover:bg-accent"
                )}>
                  <tab.icon size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tight">{tab.label}</span>
                {source === tab.id && <CheckCircle size={14} className="absolute top-2 right-2 text-primary" />}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: File Selection */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">2. Select Bill Document(s)</h3>
          <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              {source === "local" ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => { e.preventDefault(); setDragActive(false); handleLocalFiles(e.dataTransfer.files); }}
                  className={cn(
                    "border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3",
                    dragActive ? "border-primary bg-primary/5 scale-[0.99]" : "border-slate-200 hover:border-primary/50 hover:bg-muted/30"
                  )}
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  <input id="file-input" type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => handleLocalFiles(e.target.files)} />
                  <div className="w-14 h-14 rounded-full bg-muted text-slate-400 flex items-center justify-center mb-1 transition-colors">
                    <Plus size={32} />
                  </div>
                  <p className="text-sm font-bold text-slate-700">Click or drag local invoices</p>
                  <p className="text-xs text-slate-400 font-medium">Supports PDF, JPG, and PNG images</p>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-tight">{source.toUpperCase()} Connection Details</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Enter credentials to browse remote files</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    {source === "s3" && (
                      <>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">AWS Access Key ID</Label>
                          <Input value={s3Creds.aws_access_key_id} onChange={e => setS3Creds({ ...s3Creds, aws_access_key_id: e.target.value })} placeholder="AKIA..." className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">AWS Secret Key</Label>
                          <Input type="password" value={s3Creds.aws_secret_access_key} onChange={e => setS3Creds({ ...s3Creds, aws_secret_access_key: e.target.value })} placeholder="••••" className="rounded-xl" />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Bucket Region</Label>
                          <Input value={s3Creds.region} onChange={e => setS3Creds({ ...s3Creds, region: e.target.value })} placeholder="us-east-1" className="rounded-xl" />
                        </div>
                      </>
                    )}
                    {source === "blob" && (
                      <div className="space-y-2 sm:col-span-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Azure Connection String</Label>
                        <Input value={blobCreds.connection_string} onChange={e => setBlobCreds({ connection_string: e.target.value })} placeholder="DefaultEndpointsProtocol=..." className="rounded-xl" />
                      </div>
                    )}
                    {source === "onelake" && (
                      <>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tenant ID</Label>
                          <Input value={oneLakeCreds.tenant_id} onChange={e => setOneLakeCreds({ ...oneLakeCreds, tenant_id: e.target.value })} className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Client ID</Label>
                          <Input value={oneLakeCreds.client_id} onChange={e => setOneLakeCreds({ ...oneLakeCreds, client_id: e.target.value })} className="rounded-xl" />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Client Secret</Label>
                          <Input type="password" value={oneLakeCreds.client_secret} onChange={e => setOneLakeCreds({ ...oneLakeCreds, client_secret: e.target.value })} className="rounded-xl" />
                        </div>
                      </>
                    )}
                  </div>

                  <Button
                    type="button"
                    onClick={connectToCloud}
                    disabled={isCloudValidating}
                    className="w-full rounded-xl shadow-lg font-bold h-11"
                  >
                    {isCloudValidating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                    Browse remote files from {source.toUpperCase()}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Step 3: Bill Information */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">3. Enter Bill Information</h3>
          <Card className="border-slate-200 shadow-sm overflow-hidden rounded-2xl">
            <CardHeader className="bg-muted/50 border-b py-4 px-6">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-500">
                Identify Document Data
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Bill Reference Name</Label>
                  <Input
                    value={billName}
                    onChange={(e) => setBillName(e.target.value)}
                    placeholder="e.g. AWS_Monthly_March"
                    className="rounded-xl focus:ring-primary h-11 bg-muted/20"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Statement Amount (₹)</Label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="rounded-xl focus:ring-primary h-11 font-mono bg-muted/20 text-lg font-bold"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Disbursement Notes</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide context for finance audit..."
                  rows={2}
                  className="rounded-xl focus:ring-primary resize-none bg-muted/20"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Batch Queue Summary */}
        {batchFiles.length > 0 && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 border-t border-slate-100 pt-8">
            <div className="flex items-center justify-between px-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Selected Bills ({batchFiles.length})</p>
              <button type="button" onClick={() => setBatchFiles([])} className="text-[10px] font-bold text-destructive hover:underline transition-colors">Clear Images</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {batchFiles.map((f) => (
                <div key={f.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-card group shadow-sm hover:border-primary transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                      "h-9 w-9 rounded-lg flex items-center justify-center shrink-0 shadow-inner transition-colors",
                      f.type === 'local' ? "bg-primary/10 text-primary" : "bg-success/10 text-success"
                    )}>
                      {f.type === 'local' ? <FileIcon size={18} /> : <Cloud size={18} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{f.name}</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">{f.size} • {f.type}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => removeFile(f.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-slate-300 hover:text-destructive transition-all opacity-0 group-hover:opacity-100">
                    <X size={14} strokeWidth={3} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Validation Result Banner */}
        {isValidated && validationResult && (
          <div className={cn(
            "animate-in fade-in slide-in-from-bottom-2 duration-300 rounded-2xl p-4 flex items-start gap-3 border",
            validationResult.amount_match
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-amber-50 border-amber-200 text-amber-800"
          )}>
            <div className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
              validationResult.amount_match ? "bg-green-100" : "bg-amber-100"
            )}>
              {validationResult.amount_match
                ? <BadgeCheck size={18} className="text-green-600" />
                : <AlertTriangle size={18} className="text-amber-600" />
              }
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider mb-0.5">
                {validationResult.amount_match ? "Amount Verified" : "Amount Mismatch"}
              </p>
              <p className="text-xs font-medium leading-relaxed">
                {validationResult.amount_verdict_message}
              </p>
              {!validationResult.amount_match && (
                <p className="text-[10px] font-bold mt-1 opacity-70">You can still submit — the discrepancy will be flagged for review.</p>
              )}
            </div>
          </div>
        )}

        {/* CTA Button */}
        <Button
          type="submit"
          disabled={isSubmitting || isValidating || !canValidate}
          variant={btnState.variant}
          className={cn(
            "w-full h-14 rounded-2xl font-bold text-base transition-all shadow-xl disabled:shadow-none",
            isValidated && validationResult && !validationResult.amount_match && "bg-amber-500 hover:bg-amber-600 text-white border-amber-500"
          )}
        >
          <div className="flex items-center gap-2">
            {btnState.icon}
            {btnState.label}
          </div>
        </Button>

        {/* Helper hint below button */}
        {!isValidated && canValidate && (
          <p className="text-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest -mt-3">
            Bill amount will be verified via OCR before submitting
          </p>
        )}
      </form>

      {/* ─── FILE PICKER MODAL ─── */}
      <Dialog open={isPickerModalOpen} onOpenChange={setIsPickerModalOpen}>
        <DialogContent className="max-w-2xl h-[85vh] flex flex-col rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="p-6 bg-muted/30 border-b">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-lg">
                {currentContainer && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10 text-primary" onClick={() => setCurrentContainer(null)}>
                    <ArrowLeft size={18} />
                  </Button>
                )}
                {currentContainer ? (
                  <span className="font-mono text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/20">{currentContainer}</span>
                ) : (
                  <span className="font-black uppercase tracking-tight">Browse {source.toUpperCase()} Repository</span>
                )}
              </DialogTitle>
              <DialogDescription className="text-xs font-medium text-muted-foreground">Pick documents to include in this audit batch.</DialogDescription>
            </DialogHeader>
          </div>

          {isLoadingPicker ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-muted/10">
              <div className="h-14 w-14 rounded-3xl bg-card shadow-xl flex items-center justify-center">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
              </div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] animate-pulse">Syncing remote objects</p>
            </div>
          ) : (
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-2">
                {!currentContainer ? (
                  containers.map(c => (
                    <div key={c} onClick={() => loadRemoteFiles(c)} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all group bg-card shadow-sm">
                      <Folder className="h-6 w-6 text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform" />
                      <p className="font-bold text-sm text-slate-700">{c}</p>
                    </div>
                  ))
                ) : (
                  remoteFiles.length > 0 ? remoteFiles.map(f => (
                    <div
                      key={f.id}
                      onClick={() => {
                        setSelectedRemoteIds(prev => prev.includes(f.id) ? prev.filter(id => id !== f.id) : [...prev, f.id])
                      }}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all group shadow-sm bg-card",
                        selectedRemoteIds.includes(f.id) ? "border-primary bg-primary/5" : "border-slate-100 hover:border-primary/30"
                      )}
                    >
                      <Checkbox checked={selectedRemoteIds.includes(f.id)} className="h-5 w-5 rounded-lg" />
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <FileIcon size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-800">{f.name}</p>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tight">{f.size} • {f.name.split('.').pop()}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="py-20 text-center flex flex-col items-center gap-3 opacity-50">
                      <HardDrive size={48} className="text-slate-300" />
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No documents found in this path</p>
                    </div>
                  )
                )}
              </div>
            </ScrollArea>
          )}

          <div className="p-6 bg-muted/30 border-t flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsPickerModalOpen(false)} className="rounded-xl font-bold">Discard</Button>
            <Button onClick={addSelectedRemoteToBatch} disabled={selectedRemoteIds.length === 0} className="rounded-xl px-8 font-bold shadow-lg transition-all h-11">
              Select {selectedRemoteIds.length} Items
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── SUCCESS DIALOG ─── */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-sm text-center p-8 rounded-[3rem] overflow-hidden border-none shadow-2xl">
          <div className="scale-[0.95] origin-top">
            <div className="flex flex-col items-center">
              <div className="h-20 w-20 rounded-[2rem] bg-success/10 flex items-center justify-center mb-6 shadow-sm border border-success/20">
                <CheckCircle className="h-10 w-10 text-success" />
              </div>
              <DialogTitle className="text-2xl font-black text-slate-900 leading-tight">
                Bills Submitted
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium mt-2 max-w-[260px] text-sm">
                Your documents are now safely queued for the smart review audit engine.
              </DialogDescription>
            </div>
            <div className="flex flex-col items-center gap-3 mt-8">
              <Button
                onClick={() => setShowSuccess(false)}
                className="h-12 w-full max-w-[240px] rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-xl"
              >
                Upload New Bill
              </Button>
              <Button
                variant="ghost"
                onClick={() => { setShowSuccess(false); navigate("/bills"); }}
                className="h-10 w-full max-w-[200px] rounded-2xl font-black text-primary tracking-tight text-sm"
              >
                Track Your Bills
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}