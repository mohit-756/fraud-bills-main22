import React, { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppSidebar from "@/components/AppSidebar";
import TopNavbar from "@/components/TopNavbar";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export default function DashboardLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // ✅ Prevent redirect loops while loading auth state
  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-60 border-r-0 bg-transparent">
          <div className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
            <SheetDescription>Access dashboard pages and settings</SheetDescription>
          </div>
          <AppSidebar collapsed={false} onToggle={() => setMobileOpen(false)} isMobile />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar onMenuToggle={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 md:p-6 overflow-auto safe-pb">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
