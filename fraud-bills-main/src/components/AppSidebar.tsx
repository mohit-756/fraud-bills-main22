// import React from "react";
// import { NavLink as RouterNavLink, useLocation, useNavigate } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Upload,
//   FileText,
//   CalendarDays,
//   Bell,
//   Shield,
//   BarChart3,
//   LogOut,
//   ChevronLeft,
//   ChevronRight,
//   BookOpen,
// } from "lucide-react";
// import { useAuth, UserRole } from "@/contexts/AuthContext";
// import { cn } from "@/lib/utils";

// interface NavItem {
//   label: string;
//   to: string;
//   icon: React.ElementType;
//   roles: UserRole[];
// }

// const navItems: NavItem[] = [
//   { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard, roles: ["sales", "finance", "vendor"] },
//   { label: "Upload Bill", to: "/upload", icon: Upload, roles: ["sales", "vendor"] },
//   { label: "My Bills", to: "/bills", icon: FileText, roles: ["sales", "vendor"] },
//   { label: "Vendor", to: "/all-bills", icon: FileText, roles: ["finance"] },
//   { label: "Sales", to: "/fraud", icon: Shield, roles: ["finance"] },
//   { label: "Analytics", to: "/analytics", icon: BarChart3, roles: ["finance"] },
//   { label: "Attendance", to: "/attendance", icon: CalendarDays, roles: ["sales"] },
//   { label: "Notifications", to: "/notifications", icon: Bell, roles: ["sales", "finance", "vendor"] },
//   { label: "Policies", to: "/policies", icon: BookOpen, roles: ["finance"] },
// ];

// interface AppSidebarProps {
//   collapsed: boolean;
//   onToggle: () => void;
// }

// export default function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
//   const { user, logout } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();

//   if (!user) return null;

//   const filteredItems = navItems.filter((item) => item.roles.includes(user.role));

//   return (
//     <aside
//       className={cn(
//         "sidebar-gradient flex flex-col h-screen sticky top-0 transition-all duration-300 z-30",
//         collapsed ? "w-16" : "w-60"
//       )}
//     >
//       {/* Logo */}
//       <div className="flex items-center gap-2 px-4 h-14 border-b border-sidebar-border">
//         <div className="h-8 w-8 rounded-md bg-sidebar-accent flex items-center justify-center shrink-0">
//           <Shield className="h-4 w-4 text-sidebar-accent-foreground" />
//         </div>
//         {!collapsed && <span className="font-bold text-sidebar-primary text-sm tracking-tight">BillGuard</span>}
//       </div>

//       {/* Nav */}
//       <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
//         {filteredItems.map((item) => {
//           const isActive = location.pathname === item.to;
//           return (
//             <RouterNavLink
//               key={item.to}
//               to={item.to}
//               className={cn(
//                 "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
//                 isActive
//                   ? "bg-sidebar-accent text-sidebar-accent-foreground"
//                   : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
//               )}
//             >
//               <item.icon className="h-4 w-4 shrink-0" />
//               {!collapsed && <span>{item.label}</span>}
//             </RouterNavLink>
//           );
//         })}
//       </nav>

//       {/* User + Logout */}
//       <div className="border-t border-sidebar-border p-3">
//         {!collapsed && (
//           <div className="mb-2 px-1">
//             <p className="text-xs font-medium text-sidebar-primary truncate">{user.name}</p>
//             <p className="text-xs text-sidebar-muted capitalize">{user.role}</p>
//           </div>
//         )}
//         <button
//           onClick={() => { logout(); navigate("/"); }}
//           className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground w-full transition-colors"
//         >
//           <LogOut className="h-4 w-4 shrink-0" />
//           {!collapsed && <span>Sign Out</span>}
//         </button>
//       </div>

//       {/* Collapse Toggle */}
//       <button
//         onClick={onToggle}
//         className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-card border border-border shadow flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
//       >
//         {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
//       </button>
//     </aside>
//   );
// }


import React from "react";
import { NavLink as RouterNavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  FileText,
  CalendarDays,
  Bell,
  Shield,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  MessageSquare,
  Receipt,
  Wallet,
  Users,
  ShoppingCart
} from "lucide-react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";


interface NavItem {
  label: string;
  to: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard, roles: ["sales", "finance", "vendor"] },
  { label: "Upload Bill", to: "/upload", icon: Upload, roles: ["sales", "vendor"] },
  { label: "My Bills", to: "/bills", icon: FileText, roles: ["sales", "vendor"] },
  { label: "Vendor", to: "/all-bills", icon: FileText, roles: ["finance"] },
  { label: "Sales", to: "/fraud", icon: Shield, roles: ["finance"] },
  { label: "Escalated Bills", to: "/escalated-bills", icon: Shield, roles: ["finance"] },
  { label: "Attendance", to: "/attendance", icon: CalendarDays, roles: ["sales"] },
  { label: "Order Requests", to: "/purchase-orders-for-vendor", icon: Receipt, roles: ["vendor"] },
  { label: "Notifications", to: "/notifications", icon: Bell, roles: ["sales", "finance", "vendor"] },
  { label: "Policies", to: "/policies", icon: BookOpen, roles: ["finance"] },
  { label: "AI Chatbot", to: "/chatbot", icon: MessageSquare, roles: ["finance"] },
  { label: "Purchase Orders", to: "/purchase-orders-for-finance", icon: ShoppingCart, roles: ["finance"] },
  { label: "Accounts Payable", to: "/accounts-payable", icon: Wallet, roles: ["finance"] },
  { label: "Accounts Receivable", to: "/accounts-receivable", icon: Receipt, roles: ["finance"] },
  { label: "Payroll Reimbursement", to: "/payroll-reimbursement", icon: Users, roles: ["finance"] },
];


interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
}

export default function AppSidebar({ collapsed, onToggle, isMobile }: AppSidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;


  const filteredItems = navItems.filter((item) => item.roles.includes((user.role || (user as any).usertype) as UserRole));

  return (
    <aside
      className={cn(
        "sidebar-gradient flex flex-col h-screen sticky top-0 transition-all duration-300 z-30",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-14 border-b border-sidebar-border">
        <div className="h-8 w-8 rounded-md bg-sidebar-accent flex items-center justify-center shrink-0">
          <Shield className="h-4 w-4 text-sidebar-accent-foreground" />
        </div>
        {!collapsed && <span className="font-bold text-sidebar-primary text-sm tracking-tight">BillGuard</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <RouterNavLink
              key={item.to}
              to={item.to}
              onClick={() => {
                if (isMobile && onToggle) {
                  onToggle();
                }
              }}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </RouterNavLink>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-sidebar-border p-3">
        {!collapsed && (
          <div className="mb-2 px-1">
            <p className="text-xs font-medium text-sidebar-primary truncate">{user.name}</p>
            <p className="text-xs text-sidebar-muted capitalize">{user.role || (user as any).usertype}</p>
          </div>
        )}
        <button
          onClick={() => {
            logout();
            navigate("/");
            if (isMobile && onToggle) {
              onToggle();
            }
          }}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground w-full transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      {!isMobile && (
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-card border border-border shadow flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      )}
    </aside>
  );
}
