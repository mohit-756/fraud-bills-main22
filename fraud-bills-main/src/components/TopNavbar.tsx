import React, { useEffect, useState } from "react";
import { 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  Clock as ClockIcon,
  ChevronDown,
  Menu
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";

import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const API_BASE_URL = "https://d2ontk4ewdype3.cloudfront.net";

type NotificationItem = {
  is_read?: boolean;
  notification_id: string;
};

function parseAutoApprovalStatus(payload: unknown) {
  if (typeof payload === "boolean") return payload;
  if (typeof payload === "string") {
    const normalized = payload.trim().toLowerCase();
    return normalized === "true" || normalized === "enabled" || normalized === "1";
  }
  if (payload && typeof payload === "object" && "enabled" in payload) {
    return Boolean((payload as { enabled?: unknown }).enabled);
  }
  return true;
}

export default function TopNavbar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [autoApprovalEnabled, setAutoApprovalEnabled] = useState(true);
  const [isAutoApprovalLoading, setIsAutoApprovalLoading] = useState(true);
  const [isAutoApprovalSaving, setIsAutoApprovalSaving] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const isFinanceUser = user?.role === "finance";

  // Real-time clock effect
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const roleLabel = user
    ? {
        sales: "Sales Executive",
        finance: "Finance Controller",
        vendor: "Vendor Partner",
      }[user.role]
    : "";

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE_URL}/get-notifications?user_id=${user.id}`);
      const data = await res.json();
      const allNotifications = Array.isArray(data.notifications) ? data.notifications : [];
      setNotifications(allNotifications);
      setUnreadCount(allNotifications.filter((n) => !n.is_read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchAutoApprovalStatus = async () => {
    try {
      setIsAutoApprovalLoading(true);
      const response = await fetch(`${API_BASE_URL}/config/auto-approval`);
      if (!response.ok) throw new Error("Status fetch failed");
      const data = await response.json();
      setAutoApprovalEnabled(parseAutoApprovalStatus(data));
    } catch (error) {
      console.error("Error fetching auto-approval status:", error);
    } finally {
      setIsAutoApprovalLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    if (isFinanceUser) fetchAutoApprovalStatus();
  }, [isFinanceUser, user]);

  const markAllAsRead = async () => {
    if (!user) return;
    try {
      const unread = notifications.filter((n) => !n.is_read);
      await Promise.all(
        unread.map((n) =>
          fetch(`${API_BASE_URL}/mark-notification-read?user_id=${user.id}&notification_id=${n.notification_id}`, {
            method: "POST",
          })
        )
      );
      setUnreadCount(0);
      setNotifications((curr) => curr.map((n) => ({ ...n, is_read: true })));
    } catch (error) {
      console.error("Error marking notifications:", error);
    }
  };

  const handleBellClick = async () => {
    await fetchNotifications();
    await markAllAsRead();
    navigate("/notifications");
  };

  const handleAutoApprovalToggle = async (enabled: boolean) => {
    if (!user || isAutoApprovalSaving) return;
    const prev = autoApprovalEnabled;
    setAutoApprovalEnabled(enabled);
    setIsAutoApprovalSaving(true);

    try {
      const response = await fetch(`${API_BASE_URL}/config/auto-approval`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ enabled: String(enabled), updated_by: user.id }).toString(),
      });
      if (!response.ok) throw new Error("Update failed");
      toast.success(`Auto Approval ${enabled ? "enabled" : "disabled"}`);
    } catch (error) {
      setAutoApprovalEnabled(prev);
      toast.error("Status update failed");
    } finally {
      setIsAutoApprovalSaving(false);
    }
  };

  if (!user) return null;

  return (
    <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur-md shadow-sm">
      {/* Safe area top spacer for mobile */}
      <div className="h-[env(safe-area-inset-top,0px)] w-full bg-transparent" />

      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left Section: Greeting & Time */}
        <div className="flex items-center gap-3 md:gap-6">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="p-2 -ml-1 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 md:hidden transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">
                Welcome back, {user.name.split(" ")[0]}
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 mt-0.5">
              <ClockIcon className="h-3 w-3 text-indigo-500" />
              {format(currentTime, "EEEE, dd MMMM • HH:mm:ss")}
            </div>
          </div>
        </div>

        {/* Right Section: Controls & Profile */}
        <div className="flex items-center gap-4">
          {isFinanceUser && (
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/50 px-3 py-1.5 transition-all hidden sm:flex">
              <span className="text-xs font-semibold text-slate-600">Auto Approval</span>
              <Switch
                checked={autoApprovalEnabled}
                onCheckedChange={handleAutoApprovalToggle}
                disabled={isAutoApprovalLoading || isAutoApprovalSaving}
                aria-label="Toggle auto approval"
                className="data-[state=checked]:bg-indigo-600"
              />
            </div>
          )}

          <div className="flex items-center border-l border-slate-100 ml-1 pl-4">
            <button
              className="relative p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
              onClick={handleBellClick}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* User Account Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 p-1 pl-3 rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all outline-none group">
                <div className="flex flex-col items-end hidden md:flex">
                  <p className="text-xs font-bold text-slate-900 leading-none">{user.name}</p>
                  <span className="text-[10px] font-medium text-slate-400 mt-1">{roleLabel}</span>
                </div>
                <div className="relative">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-black text-white shadow-lg shadow-indigo-100 transition-transform group-active:scale-95">
                    {user.name.charAt(0)}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                </div>
                <ChevronDown className="h-4 w-4 text-slate-300 mr-1 hidden md:block group-hover:text-indigo-500 transition-colors" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 p-2 rounded-2xl shadow-2xl border-slate-100 mt-2">
              <DropdownMenuLabel className="px-2 py-2 mb-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Account ID</p>
                <p className="text-xs font-mono font-medium text-slate-600">ID: {user.id}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-50" />
              <DropdownMenuItem
                className="rounded-lg cursor-pointer gap-3 text-rose-600 focus:bg-rose-50 focus:text-rose-600 py-2.5 font-bold"
                onClick={() => logout?.()}
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
