// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { Shield, Users, Wallet, Building2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { useAuth, UserRole } from "@/contexts/AuthContext";
// import { useNavigate, Link } from "react-router-dom";

// const roles: { value: UserRole; label: string; icon: React.ElementType }[] = [
//   { value: "sales", label: "Sales", icon: Users },
//   { value: "finance", label: "Finance", icon: Wallet },
//   { value: "vendor", label: "Vendor", icon: Building2 },
// ];

// export default function LoginPage() {
//   const [selectedRole, setSelectedRole] = useState<UserRole>("sales");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const { login, isAuthenticated } = useAuth();
//   const navigate = useNavigate();

//   if (isAuthenticated) {
//     navigate("/dashboard", { replace: true });
//     return null;
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     login(email || "demo@company.com", password, selectedRole);
//     navigate("/dashboard");
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background p-4">
//       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
//         <div className="text-center mb-8">
//           <Link to="/" className="inline-flex items-center gap-2 mb-4">
//             <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
//               <Shield className="h-5 w-5 text-primary-foreground" />
//             </div>
//             <h1 className="text-2xl font-bold tracking-tight text-foreground">BillGuard</h1>
//           </Link>
//           <p className="text-muted-foreground text-sm">Fraud Detection & Bill Management</p>
//         </div>

//         <Card className="border shadow-lg">
//           <CardHeader className="pb-4">
//             <CardTitle className="text-lg">Sign in to your account</CardTitle>
//             <CardDescription>Select your role and enter credentials</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-3 gap-2 mb-6">
//               {roles.map((r) => (
//                 <button
//                   key={r.value}
//                   type="button"
//                   onClick={() => setSelectedRole(r.value)}
//                   className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border text-xs font-medium transition-all ${
//                     selectedRole === r.value
//                       ? "border-primary bg-primary/5 text-primary"
//                       : "border-border text-muted-foreground hover:border-primary/30"
//                   }`}
//                 >
//                   <r.icon className="h-5 w-5" />
//                   {r.label}
//                 </button>
//               ))}
//             </div>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
//               </div>
//               <Button type="submit" className="w-full">
//                 Sign In as {roles.find((r) => r.value === selectedRole)?.label}
//               </Button>
//             </form>
//             <p className="text-sm text-center mt-4 text-muted-foreground">
//               Don't have an account?{" "}
//               <Link to="/signup" className="text-primary font-medium hover:underline">
//                 Create one
//               </Link>
//             </p>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   );
// }



// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { Shield, Users, Wallet, Building2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { useAuth, UserRole } from "@/contexts/AuthContext";
// import { useNavigate, Link } from "react-router-dom";
 
// const API_BASE_URL = "https://d2ontk4ewdype3.cloudfront.net";
 
// const roles: { value: UserRole; label: string; icon: React.ElementType }[] = [
//   { value: "sales", label: "Sales", icon: Users },
//   { value: "finance", label: "Finance", icon: Wallet },
//   { value: "vendor", label: "Vendor", icon: Building2 },
// ];
 
// // RBAC: map each usertype to its dashboard route
// const ROLE_DASHBOARD: Record<string, string> = {
//   sales: "/dashboard/sales",
//   finance: "/dashboard/finance",
//   vendor: "/dashboard/vendor",
// };
 
// export default function LoginPage() {
//   const [selectedRole, setSelectedRole] = useState<UserRole>("sales");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
 
//   const { login, isAuthenticated } = useAuth();
//   const navigate = useNavigate();
 
//   if (isAuthenticated) {
//     // If already logged in, redirect based on stored role
//     const storedUser = localStorage.getItem("user");
//     const usertype = storedUser ? JSON.parse(storedUser).usertype : "sales";
//     navigate(ROLE_DASHBOARD[usertype] || "/dashboard", { replace: true });
//     return null;
//   }
 
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
 
//     if (!email.trim() || !password.trim()) {
//       setError("Email and password are required.");
//       return;
//     }
 
//     setLoading(true);
//     try {
//       // Backend expects email & password as query params
//       const url = `${API_BASE_URL}/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
 
//       const response = await fetch(url, {
//         method: "POST",
//         headers: { accept: "application/json" },
//       });
 
//       if (!response.ok) {
//         const errData = await response.json();
//         const message = Array.isArray(errData.detail)
//           ? errData.detail.map((d: any) => d.msg).join(", ")
//           : errData.detail || "Invalid email or password.";
//         setError(message);
//         return;
//       }
 
//       const data = await response.json();
//       // data = { access_token, token_type, user: { user_id, name, email, usertype } }
 
//       // ✅ Store everything in localStorage for future API calls
//       localStorage.setItem("access_token", data.access_token);
//       localStorage.setItem("token_type", data.token_type);
//       localStorage.setItem("user", JSON.stringify(data.user));
 
//       // ✅ Sync with AuthContext (uses usertype from backend, not selected role)
//       login(data.user.email, password, data.user.usertype as UserRole);
 
//       // ✅ RBAC: navigate based on usertype returned from backend
//       const destination = ROLE_DASHBOARD[data.user.usertype] || "/dashboard";
//       navigate("/dashboard", { replace: true });
 
//     } catch (err) {
//       setError("Network error. Please check your connection and try again.");
//     } finally {
//       setLoading(false);
//     }
//   };
 
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background p-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="w-full max-w-md"
//       >
//         <div className="text-center mb-8">
//           <Link to="/" className="inline-flex items-center gap-2 mb-4">
//             <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
//               <Shield className="h-5 w-5 text-primary-foreground" />
//             </div>
//             <h1 className="text-2xl font-bold tracking-tight text-foreground">BillGuard</h1>
//           </Link>
//           <p className="text-muted-foreground text-sm">Fraud Detection & Bill Management</p>
//         </div>
 
//         <Card className="border shadow-lg">
//           <CardHeader className="pb-4">
//             <CardTitle className="text-lg">Sign in to your account</CardTitle>
//             <CardDescription>Select your role and enter credentials</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-3 gap-2 mb-6">
//               {roles.map((r) => (
//                 <button
//                   key={r.value}
//                   type="button"
//                   onClick={() => setSelectedRole(r.value)}
//                   className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border text-xs font-medium transition-all ${
//                     selectedRole === r.value
//                       ? "border-primary bg-primary/5 text-primary"
//                       : "border-border text-muted-foreground hover:border-primary/30"
//                   }`}
//                 >
//                   <r.icon className="h-5 w-5" />
//                   {r.label}
//                 </button>
//               ))}
//             </div>
 
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="you@company.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <Input
//                   id="password"
//                   type="password"
//                   placeholder="••••••••"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//               </div>
 
//               {/* Error Message */}
//               {error && (
//                 <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
//                   {error}
//                 </p>
//               )}
 
//               <Button type="submit" className="w-full" disabled={loading}>
//                 {loading
//                   ? "Signing in..."
//                   : `Sign In as ${roles.find((r) => r.value === selectedRole)?.label}`}
//               </Button>
//             </form>
 
//             <p className="text-sm text-center mt-4 text-muted-foreground">
//               Don't have an account?{" "}
//               <Link to="/signup" className="text-primary font-medium hover:underline">
//                 Create one
//               </Link>
//             </p>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   );
// }



import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Users, Wallet, Building2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "@/config";
import { hapticImpactLight, hapticSuccess, hapticError } from "@/lib/haptics";

const roles: { value: UserRole; label: string; icon: React.ElementType }[] = [
  { value: "sales", label: "Sales", icon: Users },
  { value: "finance", label: "Finance", icon: Wallet },
  { value: "vendor", label: "Vendor", icon: Building2 },
];

const ROLE_DASHBOARD: Record<string, string> = {
  sales: "/dashboard",
  finance: "/dashboard",
  vendor: "/dashboard",
};

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("sales");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // ✅ Move redirect logic to useEffect to avoid render-phase navigation
  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const url = `${API_BASE_URL}/login?email=${encodeURIComponent(email.trim())}&password=${encodeURIComponent(password)}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { accept: "application/json" },
      });

      if (!response.ok) {
        const errData = await response.json();
        const message = Array.isArray(errData.detail)
          ? errData.detail.map((d: any) => d.msg).join(", ")
          : errData.detail || "Invalid email or password.";
        setError(message);
        return;
      }

      const data = await response.json();

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("token_type", data.token_type);
      localStorage.setItem("user", JSON.stringify(data.user));

      login(data.user.email, password, data.user.usertype as UserRole);
      hapticSuccess();
      navigate("/dashboard", { replace: true });
    } catch (err) {
      hapticError();
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Safe area top spacer */}
      <div className="h-[env(safe-area-inset-top,0px)] w-full" />

      <div className="flex-1 flex items-center justify-center p-4">
        {/* subtle dot grid */}
        <div
          className="pointer-events-none fixed inset-0 z-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* soft violet wash */}
        <div className="pointer-events-none fixed top-[-100px] left-[-100px] w-[500px] h-[400px] rounded-full opacity-20 blur-[120px] bg-violet-300 z-0" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2.5 mb-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-md shadow-violet-200">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">BillGuard</h1>
            </div>
            <p className="text-slate-500 text-sm">Fraud Detection & Bill Management</p>
          </div>

          <Card className="border border-slate-200 shadow-xl shadow-slate-200/60 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-slate-900">Sign in to your account</CardTitle>
              <CardDescription className="text-slate-500">Select your role and enter credentials</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Role selector */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => {
                      hapticImpactLight();
                      setSelectedRole(r.value);
                    }}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border text-xs font-medium transition-all ${
                      selectedRole === r.value
                        ? "border-violet-500 bg-violet-50 text-violet-600"
                        : "border-slate-200 text-slate-500 hover:border-violet-300 hover:text-slate-700"
                    }`}
                  >
                    <r.icon className="h-5 w-5" />
                    {r.label}
                  </button>
                ))}
              </div>

              <form onSubmit={(e) => { hapticImpactLight(); handleSubmit(e); }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-slate-200 focus:border-violet-400 focus:ring-violet-400/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10 border-slate-200 focus:border-violet-400 focus:ring-violet-400/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-200"
                  disabled={loading}
                >
                  {loading
                    ? "Signing in..."
                    : `Sign In as ${roles.find((r) => r.value === selectedRole)?.label}`}
                </Button>
              </form>

              <p className="text-sm text-center mt-4 text-slate-500">
                Don't have an account?{" "}
                <Link to="/signup" className="text-violet-600 font-medium hover:underline">
                  Create one
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Safe area bottom spacer */}
      <div className="h-[env(safe-area-inset-bottom,0px)] w-full" />
    </div>
  );
}
