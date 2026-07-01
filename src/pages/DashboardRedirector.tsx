// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "@/contexts/AuthContext";
// import SalesDashboard from "@/pages/SalesDashboard";
// import FinanceDashboard from "@/pages/FinanceDashboard";
// import VendorDashboard from "@/pages/VendorDashboard";

// export default function DashboardRedirector() {
//   const { user } = useAuth();
//   if (!user) return <Navigate to="/login" replace />;
//   if (user.role === "sales") return <SalesDashboard />;
//   if (user.role === "finance") return <FinanceDashboard />;
//   return <VendorDashboard />;
// }




import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SalesDashboard from "@/pages/SalesDashboard";
import FinanceDashboard from "@/pages/FinanceDashboard";
import VendorDashboard from "@/pages/VendorDashboard";

export default function DashboardRedirector() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "sales") return <SalesDashboard />;
  if (user.role === "finance") return <FinanceDashboard />;
  if (user.role === "vendor") return <VendorDashboard />;

  return <Navigate to="/login" replace />;
}