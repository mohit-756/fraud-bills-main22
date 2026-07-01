

// import React, { useState, useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { mockPolicies, Policy } from "@/data/mockData";
// import { BookOpen, Plus, Sparkles, X, Check, Trash2, Users, BarChart3, Store } from "lucide-react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useToast } from "@/hooks/use-toast";
 
// const appliesToConfig = {
//   sales: { label: "Sales", className: "bg-primary/10 text-primary border-primary/20" },
//   vendor: { label: "Vendor", className: "bg-accent text-accent-foreground border-accent" },
//   both: { label: "Both", className: "bg-secondary text-secondary-foreground border-secondary" },
// };
 
// export default function PoliciesPage() {
//   const { toast } = useToast();
//   const [policies, setPolicies] = useState<Policy[]>([]);
//   const [showTypeSelector, setShowTypeSelector] = useState(false);
//   const [filter, setFilter] = useState<"all" | "sales" | "vendor" | "both">("all");
//   const [showAddDialog, setShowAddDialog] = useState(false);
//   const [selectedAppliesTo, setSelectedAppliesTo] = useState<"sales" | "vendor" | "both">("both");
//   const [newTitle, setNewTitle] = useState("");
//   const [newDescription, setNewDescription] = useState("");
//   const [newCategory, setNewCategory] = useState("Fraud Prevention");
 
//   const categories = ["Fraud Prevention", "Approval Workflow", "Vendor Management", "Compliance", "Other"];
 
//   const activePolicies = policies.filter((p) => p.status === "active" && (filter === "all" || p.appliesTo === filter || p.appliesTo === "both"));
//   const pendingPolicies = policies.filter((p) => p.status === "pending" && (filter === "all" || p.appliesTo === filter || p.appliesTo === "both"));
 
//   const salesCount = policies.filter((p) => p.status === "active" && (p.appliesTo === "sales" || p.appliesTo === "both")).length;
//   const vendorCount = policies.filter((p) => p.status === "active" && (p.appliesTo === "vendor" || p.appliesTo === "both")).length;
 
//   const handleSelectType = (type: "sales" | "vendor" | "both") => {
//     setSelectedAppliesTo(type);
//     setShowTypeSelector(false);
//     setShowAddDialog(true);
//   };
 
// const handleAddPolicy = async () => {
//   if (!newTitle.trim() || !newDescription.trim()) {
//     toast({
//       title: "Missing fields",
//       description: "Please fill in both title and description.",
//       variant: "destructive",
//     });
//     return;
//   }
 
//   try {
//     const userData = localStorage.getItem("user");
//     const parsedUser = userData ? JSON.parse(userData) : null;
//     const financeUserId = parsedUser?.user_id;
 
//     if (!financeUserId) {
//       throw new Error("User ID not found in localStorage");
//     }
 
//     const url = `https://d2ontk4ewdype3.cloudfront.net/add-policy?finance_user_id=${financeUserId}&title=${encodeURIComponent(
//       newTitle
//     )}&category=${encodeURIComponent(
//       newCategory
//     )}&description=${encodeURIComponent(
//       newDescription
//     )}&applied_to=${selectedAppliesTo}`; // ✅ FIXED
 
//     const response = await fetch(url, {
//       method: "POST",
//     });
 
//     const data = await response.json();
 
//     if (!response.ok) {
//       throw new Error(JSON.stringify(data));
//     }
 
//     const newPolicy: Policy = {
//       id: `p${Date.now()}`,
//       title: newTitle,
//       description: newDescription,
//       category: newCategory,
//       createdAt: new Date().toISOString().split("T")[0],
//       isAIGenerated: false,
//       appliesTo: selectedAppliesTo,
//       status: "active",
//     };
 
//     // setPolicies([newPolicy, ...policies]);
//     await fetchPolicies();
 
//     setShowAddDialog(false);
//     setNewTitle("");
//     setNewDescription("");
//     setNewCategory("Fraud Prevention");
 
//     toast({
//       title: "Policy added",
//       description: "Your new policy has been added successfully 🚀",
//     });
 
//   } catch (error: any) {
//     console.error(error);
 
//     toast({
//       title: "Error",
//       description: error.message,
//       variant: "destructive",
//     });
//   }
// };
 
 
// const fetchPolicies = async () => {
//   try {
//     const userData = localStorage.getItem("user");
//     const parsedUser = userData ? JSON.parse(userData) : null;
//     const userId = parsedUser?.user_id;
 
//     if (!userId) return;
 
//     const response = await fetch(
//       `https://d2ontk4ewdype3.cloudfront.net/get-policies?user_id=${userId}&applied_to=${selectedAppliesTo}`
//     );
 
//     const data = await response.json();
 
//     if (!response.ok) {
//       throw new Error(JSON.stringify(data));
//     }
 
//     const formatted = data.policies?.map((p: any) => ({
//        id: p.policy_id || p.id,
//       title: p.title,
//       description: p.description,
//       category: p.category,
//       createdAt: p.created_at?.split("T")[0] || "",
//       isAIGenerated: false,
//       appliesTo: p.applied_to,
//       status: "active",
//     }));
 
//     setPolicies(formatted);
 
//   } catch (error) {
//     console.error("Fetch policies error:", error);
//   }
// };
// useEffect(() => {
//   fetchPolicies();
// }, [selectedAppliesTo]);
 
 
 
//   const handleAcceptPolicy = (id: string) => {
//     setPolicies(policies.map((p) => (p.id === id ? { ...p, status: "active" as const } : p)));
//     toast({ title: "Policy accepted", description: "AI-generated policy has been activated." });
//   };
 
//   const handleRejectPolicy = (id: string) => {
//     setPolicies(policies.map((p) => (p.id === id ? { ...p, status: "rejected" as const } : p)));
//     toast({ title: "Policy rejected", description: "AI-generated policy has been rejected." });
//   };
 
// const handleDeletePolicy = async (id: string) => {
//   try {
//     const userData = localStorage.getItem("user");
//     const parsedUser = userData ? JSON.parse(userData) : null;
//     const userId = parsedUser?.user_id;
 
//     if (!userId) {
//       throw new Error("User ID not found");
//     }
 
//     const url = `https://d2ontk4ewdype3.cloudfront.net/delete-policy?user_id=${userId}&policy_id=${id}`;
 
//     const response = await fetch(url, {
//       method: "DELETE",
//     });
 
//     const data = await response.json();
 
//     if (!response.ok) {
//       throw new Error(JSON.stringify(data));
//     }
 
//     // ✅ Refresh from backend
//     await fetchPolicies();
 
//     toast({
//       title: "Policy deleted",
//       description: "Policy has been removed successfully 🗑️",
//     });
 
//   } catch (error: any) {
//     console.error(error);
 
//     toast({
//       title: "Error",
//       description: error.message,
//       variant: "destructive",
//     });
//   }
// };
//   const renderPolicyCard = (policy: Policy) => (
//     <Card key={policy.id}>
//       <CardContent className="p-5">
//         <div className="flex items-start justify-between gap-4">
//           <div className="flex-1 space-y-2">
//             <div className="flex items-center justify-between gap-2">
//               <div className="flex items-center gap-2 flex-wrap">
//                 <h3 className="text-sm font-semibold">{policy.title}</h3>
//                 {policy.isAIGenerated && (
//                   <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] gap-1">
//                     <Sparkles className="h-3 w-3" />
//                     AI Generated
//                   </Badge>
//                 )}
//                 <Badge variant="outline" className="text-[10px]">{policy.category}</Badge>
//                 <Badge variant="outline" className={`text-[10px] ${appliesToConfig[policy.appliesTo].className}`}>
//                   {appliesToConfig[policy.appliesTo].label}
//                 </Badge>
//               </div>
//               <div className="flex items-center gap-2 shrink-0">
//                 <p className="text-xs text-muted-foreground whitespace-nowrap">{policy.createdAt}</p>
//                 {policy.status === "pending" && policy.isAIGenerated && (
//                   <>
//                     <Button size="sm" variant="outline" className="h-7 w-7 p-0 text-success hover:text-success hover:bg-success/10" onClick={() => handleAcceptPolicy(policy.id)}>
//                       <Check className="h-3.5 w-3.5" />
//                     </Button>
//                     <Button size="sm" variant="outline" className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleRejectPolicy(policy.id)}>
//                       <X className="h-3.5 w-3.5" />
//                     </Button>
//                   </>
//                 )}
//                 {policy.status === "active" && !policy.isAIGenerated && (
//                   <Button size="sm" variant="outline" className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeletePolicy(policy.id)}>
//                     <Trash2 className="h-3.5 w-3.5" />
//                   </Button>
//                 )}
//                 {policy.status === "active" && policy.isAIGenerated && (
//                   <Button size="sm" variant="outline" className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeletePolicy(policy.id)}>
//                     <Trash2 className="h-3.5 w-3.5" />
//                   </Button>
//                 )}
//               </div>
//             </div>
//             <p className="text-sm text-muted-foreground leading-relaxed">{policy.description}</p>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
 
//   return (
//     <div className="space-y-6 animate-fade-in">
//       <div className="flex items-center justify-between flex-wrap gap-4">
//         <div className="flex items-center gap-3">
//           <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
//             <BookOpen className="h-5 w-5 text-primary" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold tracking-tight">Policies</h1>
//             <p className="text-muted-foreground text-sm">View AI-generated policies and add custom ones</p>
//           </div>
//         </div>
//         <Button size="sm" className="gap-1.5" onClick={() => setShowTypeSelector(true)}>
//           <Plus className="h-4 w-4" />
//           Add Policy
//         </Button>
//       </div>
 
//       {/* Filter Tabs */}
//       <div className="flex items-center gap-2 flex-wrap">
//         {([
//           { value: "all" as const, label: "All" },
//           { value: "sales" as const, label: `Sales (${salesCount})` },
//           { value: "vendor" as const, label: `Vendor (${vendorCount})` },
//         ]).map((tab) => (
//           <Button
//             key={tab.value}
//             size="sm"
//             variant={filter === tab.value ? "default" : "outline"}
//             className="h-8 text-xs"
//             onClick={() => setFilter(tab.value)}
//           >
//             {tab.label}
//           </Button>
//         ))}
//       </div>
 
//       {/* Pending AI Policies */}
//       {pendingPolicies.length > 0 && (
//         <div className="space-y-3">
//           <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
//             <Sparkles className="h-4 w-4 text-primary" />
//             AI Suggested — Pending Review ({pendingPolicies.length})
//           </h2>
//           <div className="grid gap-3">
//             {pendingPolicies.map(renderPolicyCard)}
//           </div>
//         </div>
//       )}
 
//       {/* Active Policies */}
//       <div className="space-y-3">
//         <h2 className="text-sm font-semibold text-muted-foreground">
//           Active Policies ({activePolicies.length})
//         </h2>
//         <div className="grid gap-3">
//           {activePolicies.length > 0 ? activePolicies.map(renderPolicyCard) : (
//             <p className="text-sm text-muted-foreground py-4 text-center">No policies found for this filter.</p>
//           )}
//         </div>
//       </div>
 
//       {/* Type Selector Dialog */}
//       <Dialog open={showTypeSelector} onOpenChange={setShowTypeSelector}>
//         <DialogContent className="sm:max-w-sm">
//           <DialogHeader>
//             <DialogTitle>Who does this policy apply to?</DialogTitle>
//           </DialogHeader>
//           <div className="grid gap-3 pt-2">
//             {([
//               { value: "sales" as const, label: "For Sales", desc: "Applies to sales team bills only", icon: BarChart3 },
//               { value: "vendor" as const, label: "For Vendor", desc: "Applies to vendor submissions only", icon: Store },
//               { value: "both" as const, label: "For Both", desc: "Applies to all bill types", icon: Users },
//             ]).map((option) => (
//               <Card
//                 key={option.value}
//                 className="cursor-pointer hover:border-primary/40 transition-colors"
//                 onClick={() => handleSelectType(option.value)}
//               >
//                 <CardContent className="p-4 flex items-center gap-3">
//                   <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
//                     <option.icon className="h-5 w-5 text-primary" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-semibold">{option.label}</p>
//                     <p className="text-xs text-muted-foreground">{option.desc}</p>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </DialogContent>
//       </Dialog>
 
//       {/* Add Policy Form Dialog */}
//       <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
//         <DialogContent className="sm:max-w-lg">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               Add New Policy
//               <Badge variant="outline" className={`text-[10px] ${appliesToConfig[selectedAppliesTo].className}`}>
//                 {appliesToConfig[selectedAppliesTo].label}
//               </Badge>
//             </DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4 pt-2">
//             <div>
//               <p className="text-sm font-medium mb-1.5">Title</p>
//               <Input placeholder="Policy title..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
//             </div>
//             <div>
//               <p className="text-sm font-medium mb-1.5">Category</p>
//               <Select value={newCategory} onValueChange={setNewCategory}>
//                 <SelectTrigger><SelectValue /></SelectTrigger>
//                 <SelectContent>
//                   {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <p className="text-sm font-medium mb-1.5">Description</p>
//               <Textarea placeholder="Describe the policy..." value={newDescription} onChange={(e) => setNewDescription(e.target.value)} rows={5} />
//             </div>
//             <div className="flex justify-end gap-2">
//               <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
//               <Button onClick={handleAddPolicy}>Add Policy</Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
 
 



import React, { useState, useEffect } from 'react'
import { API_BASE_URL } from '@/config'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { mockPolicies, Policy } from '@/data/mockData'
import {
  BookOpen,
  Plus,
  Sparkles,
  X,
  Check,
  Trash2,
  Users,
  BarChart3,
  Store,
  Upload,
  Download
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

const appliesToConfig = {
  sales: {
    label: 'Sales',
    className: 'bg-primary/10 text-primary border-primary/20'
  },
  vendor: {
    label: 'Vendor',
    className: 'bg-accent text-accent-foreground border-accent'
  },
  both: {
    label: 'Both',
    className: 'bg-secondary text-secondary-foreground border-secondary'
  }
}

export default function PoliciesPage () {
  const { toast } = useToast()
  const [policies, setPolicies] = useState<Policy[]>([])
  const [showTypeSelector, setShowTypeSelector] = useState(false)
  const [filter, setFilter] = useState<'all' | 'sales' | 'vendor' | 'both'>(
    'all'
  )
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedAppliesTo, setSelectedAppliesTo] = useState<
    'sales' | 'vendor' | 'both'
  >('both')
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newCategory, setNewCategory] = useState('Fraud Prevention')

  const categories = [
    'Fraud Prevention',
    'Approval Workflow',
    'Vendor Management',
    'Compliance',
    'Other'
  ]

  const activePolicies = policies.filter(
    p =>
      p.status === 'active' &&
      (filter === 'all' || p.appliesTo === filter || p.appliesTo === 'both')
  )
  const pendingPolicies = policies.filter(
    p =>
      p.status === 'pending' &&
      (filter === 'all' || p.appliesTo === filter || p.appliesTo === 'both')
  )

  const salesCount = policies.filter(
    p =>
      p.status === 'active' &&
      (p.appliesTo === 'sales' || p.appliesTo === 'both')
  ).length
  const vendorCount = policies.filter(
    p =>
      p.status === 'active' &&
      (p.appliesTo === 'vendor' || p.appliesTo === 'both')
  ).length

  const handleUploadPolicies = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const userData = localStorage.getItem('user')
      const parsedUser = userData ? JSON.parse(userData) : null
      const userId = parsedUser?.user_id
      if (!userId) throw new Error('User ID not found')

      const formData = new FormData()
      formData.append('finance_user_id', userId)
      formData.append('file', file)

      const response = await fetch(
        `${API_BASE_URL}/import-policies`,
        {
          method: 'POST',
          body: formData
        }
      )

      const data = await response.json()
      if (!response.ok) throw new Error(JSON.stringify(data))

      await fetchPolicies()
      toast({
        title: 'Policies imported',
        description: `${data.inserted_count} policies imported successfully 🎉`
      })
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive'
      })
    }

    // reset input so same file can be re-uploaded
    e.target.value = ''
  }

  const handleDownloadSample = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/download-sample`,
        {
          headers: { accept: 'application/json' }
        }
      )
      if (!response.ok) throw new Error(`Server returned ${response.status}`)

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'policy_sample.csv'
      a.click()
      URL.revokeObjectURL(url)
    } catch (error: any) {
      toast({
        title: 'Download failed',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  const handleSelectType = (type: 'sales' | 'vendor' | 'both') => {
    setSelectedAppliesTo(type)
    setShowTypeSelector(false)
    setShowAddDialog(true)
  }

  const handleAddPolicy = async () => {
    if (!newTitle.trim() || !newDescription.trim()) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in both title and description.',
        variant: 'destructive'
      })
      return
    }

    try {
      const userData = localStorage.getItem('user')
      const parsedUser = userData ? JSON.parse(userData) : null
      const financeUserId = parsedUser?.user_id

      if (!financeUserId) {
        throw new Error('User ID not found in localStorage')
      }

      const url = `${API_BASE_URL}/add-policy?finance_user_id=${financeUserId}&title=${encodeURIComponent(
        newTitle
      )}&category=${encodeURIComponent(
        newCategory
      )}&description=${encodeURIComponent(
        newDescription
      )}&applied_to=${selectedAppliesTo}` // ✅ FIXED

      const response = await fetch(url, {
        method: 'POST'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(JSON.stringify(data))
      }

      const newPolicy: Policy = {
        id: `p${Date.now()}`,
        title: newTitle,
        description: newDescription,
        category: newCategory,
        createdAt: new Date().toISOString().split('T')[0],
        isAIGenerated: false,
        appliesTo: selectedAppliesTo,
        status: 'active'
      }

      // setPolicies([newPolicy, ...policies]);
      await fetchPolicies()

      setShowAddDialog(false)
      setNewTitle('')
      setNewDescription('')
      setNewCategory('Fraud Prevention')

      toast({
        title: 'Policy added',
        description: 'Your new policy has been added successfully 🚀'
      })
    } catch (error: any) {
      console.error(error)

      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  const fetchPolicies = async () => {
    try {
      const userData = localStorage.getItem('user')
      const parsedUser = userData ? JSON.parse(userData) : null
      const userId = parsedUser?.user_id

      if (!userId) return

      const response = await fetch(
        `${API_BASE_URL}/get-policies?user_id=${userId}&applied_to=${selectedAppliesTo}`
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(JSON.stringify(data))
      }

      const formatted = data.policies?.map((p: any) => ({
        id: p.policy_id || p.id,
        title: p.title,
        description: p.description,
        category: p.category,
        createdAt: p.created_at?.split('T')[0] || '',
        isAIGenerated: false,
        appliesTo: p.applied_to,
        status: 'active'
      }))

      setPolicies(formatted)
    } catch (error) {
      console.error('Fetch policies error:', error)
    }
  }
  useEffect(() => {
    fetchPolicies()
  }, [selectedAppliesTo])

  const handleAcceptPolicy = (id: string) => {
    setPolicies(
      policies.map(p => (p.id === id ? { ...p, status: 'active' as const } : p))
    )
    toast({
      title: 'Policy accepted',
      description: 'AI-generated policy has been activated.'
    })
  }

  const handleRejectPolicy = (id: string) => {
    setPolicies(
      policies.map(p =>
        p.id === id ? { ...p, status: 'rejected' as const } : p
      )
    )
    toast({
      title: 'Policy rejected',
      description: 'AI-generated policy has been rejected.'
    })
  }

  const handleDeletePolicy = async (id: string) => {
    try {
      const userData = localStorage.getItem('user')
      const parsedUser = userData ? JSON.parse(userData) : null
      const userId = parsedUser?.user_id

      if (!userId) {
        throw new Error('User ID not found')
      }

      const url = `${API_BASE_URL}/delete-policy?user_id=${userId}&policy_id=${id}`

      const response = await fetch(url, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(JSON.stringify(data))
      }

      // ✅ Refresh from backend
      await fetchPolicies()

      toast({
        title: 'Policy deleted',
        description: 'Policy has been removed successfully 🗑️'
      })
    } catch (error: any) {
      console.error(error)

      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    }
  }
  const renderPolicyCard = (policy: Policy) => (
    <Card key={policy.id}>
      <CardContent className='p-5'>
        <div className='flex items-start justify-between gap-4'>
          <div className='flex-1 space-y-2'>
            <div className='flex items-center justify-between gap-2'>
              <div className='flex items-center gap-2 flex-wrap'>
                <h3 className='text-sm font-semibold'>{policy.title}</h3>
                {policy.isAIGenerated && (
                  <Badge
                    variant='outline'
                    className='bg-primary/10 text-primary border-primary/20 text-[10px] gap-1'
                  >
                    <Sparkles className='h-3 w-3' />
                    AI Generated
                  </Badge>
                )}
                <Badge variant='outline' className='text-[10px]'>
                  {policy.category}
                </Badge>
                <Badge
                  variant='outline'
                  className={`text-[10px] ${
                    appliesToConfig[policy.appliesTo].className
                  }`}
                >
                  {appliesToConfig[policy.appliesTo].label}
                </Badge>
              </div>
              <div className='flex items-center gap-2 shrink-0'>
                <p className='text-xs text-muted-foreground whitespace-nowrap'>
                  {policy.createdAt}
                </p>
                {policy.status === 'pending' && policy.isAIGenerated && (
                  <>
                    <Button
                      size='sm'
                      variant='outline'
                      className='h-7 w-7 p-0 text-success hover:text-success hover:bg-success/10'
                      onClick={() => handleAcceptPolicy(policy.id)}
                    >
                      <Check className='h-3.5 w-3.5' />
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      className='h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10'
                      onClick={() => handleRejectPolicy(policy.id)}
                    >
                      <X className='h-3.5 w-3.5' />
                    </Button>
                  </>
                )}
                {policy.status === 'active' && !policy.isAIGenerated && (
                  <Button
                    size='sm'
                    variant='outline'
                    className='h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10'
                    onClick={() => handleDeletePolicy(policy.id)}
                  >
                    <Trash2 className='h-3.5 w-3.5' />
                  </Button>
                )}
                {policy.status === 'active' && policy.isAIGenerated && (
                  <Button
                    size='sm'
                    variant='outline'
                    className='h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10'
                    onClick={() => handleDeletePolicy(policy.id)}
                  >
                    <Trash2 className='h-3.5 w-3.5' />
                  </Button>
                )}
              </div>
            </div>
            <p className='text-sm text-muted-foreground leading-relaxed'>
              {policy.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className='space-y-6 animate-fade-in'>
      <div className='flex flex-col gap-4'>
        <div className='flex items-center gap-3'>
          <div className='h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center'>
            <BookOpen className='h-5 w-5 text-primary' />
          </div>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Policies</h1>
            <p className='text-muted-foreground text-sm'>
              View AI-generated policies and add custom ones
            </p>
          </div>
        </div>
        <div className='flex flex-col md:flex-row items-stretch md:items-center gap-2'>
          <Button
            size='sm'
            className='gap-1.5 h-11 md:h-9 rounded-xl md:rounded-lg'
            onClick={() => setShowTypeSelector(true)}
          >
            <Plus className='h-4 w-4' />
            Add Policy
          </Button>

          <div className="grid grid-cols-2 gap-2 w-full md:w-auto">
            {/* Upload Policies */}
            <label className="flex-1">
              <input
                type='file'
                accept='.csv'
                className='hidden'
                onChange={handleUploadPolicies}
              />
             <Button size="sm" className="gap-1.5 cursor-pointer w-full h-11 md:h-9 rounded-xl md:rounded-lg" variant="outline" asChild>
                <span>
                  <Upload className='h-3.5 w-3.5' />
                  Import
                </span>
              </Button>
            </label>

            {/* Download Sample */}
            <Button size="sm" variant="outline" className="gap-1.5 w-full h-11 md:h-9 rounded-xl md:rounded-lg" onClick={handleDownloadSample}>
              <Download className='h-3.5 w-3.5' />
              Sample
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className='flex items-center gap-2 flex-wrap'>
        {[
          { value: 'all' as const, label: 'All' },
          { value: 'sales' as const, label: `Sales (${salesCount})` },
          { value: 'vendor' as const, label: `Vendor (${vendorCount})` }
        ].map(tab => (
          <Button
            key={tab.value}
            size='sm'
            variant={filter === tab.value ? 'default' : 'outline'}
            className='h-8 text-xs'
            onClick={() => setFilter(tab.value)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Pending AI Policies */}
      {pendingPolicies.length > 0 && (
        <div className='space-y-3'>
          <h2 className='text-sm font-semibold text-muted-foreground flex items-center gap-2'>
            <Sparkles className='h-4 w-4 text-primary' />
            AI Suggested — Pending Review ({pendingPolicies.length})
          </h2>
          <div className='grid gap-3'>
            {pendingPolicies.map(renderPolicyCard)}
          </div>
        </div>
      )}

      {/* Active Policies */}
      <div className='space-y-3'>
        <h2 className='text-sm font-semibold text-muted-foreground'>
          Active Policies ({activePolicies.length})
        </h2>
        <div className='grid gap-3'>
          {activePolicies.length > 0 ? (
            activePolicies.map(renderPolicyCard)
          ) : (
            <p className='text-sm text-muted-foreground py-4 text-center'>
              No policies found for this filter.
            </p>
          )}
        </div>
      </div>

      {/* Type Selector Dialog */}
      <Dialog open={showTypeSelector} onOpenChange={setShowTypeSelector}>
        <DialogContent className='sm:max-w-sm'>
          <DialogHeader>
            <DialogTitle>Who does this policy apply to?</DialogTitle>
          </DialogHeader>
          <div className='grid gap-3 pt-2'>
            {[
              {
                value: 'sales' as const,
                label: 'For Sales',
                desc: 'Applies to sales team bills only',
                icon: BarChart3
              },
              {
                value: 'vendor' as const,
                label: 'For Vendor',
                desc: 'Applies to vendor submissions only',
                icon: Store
              },
              {
                value: 'both' as const,
                label: 'For Both',
                desc: 'Applies to all bill types',
                icon: Users
              }
            ].map(option => (
              <Card
                key={option.value}
                className='cursor-pointer hover:border-primary/40 transition-colors'
                onClick={() => handleSelectType(option.value)}
              >
                <CardContent className='p-4 flex items-center gap-3'>
                  <div className='h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0'>
                    <option.icon className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <p className='text-sm font-semibold'>{option.label}</p>
                    <p className='text-xs text-muted-foreground'>
                      {option.desc}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Policy Form Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              Add New Policy
              <Badge
                variant='outline'
                className={`text-[10px] ${appliesToConfig[selectedAppliesTo].className}`}
              >
                {appliesToConfig[selectedAppliesTo].label}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          <div className='space-y-4 pt-2'>
            <div>
              <p className='text-sm font-medium mb-1.5'>Title</p>
              <Input
                placeholder='Policy title...'
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
              />
            </div>
            <div>
              <p className='text-sm font-medium mb-1.5'>Category</p>
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className='text-sm font-medium mb-1.5'>Description</p>
              <Textarea
                placeholder='Describe the policy...'
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                rows={5}
              />
            </div>
            <div className='flex justify-end gap-2'>
              <Button variant='outline' onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPolicy}>Add Policy</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
