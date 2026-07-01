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
import { hapticImpactLight, hapticSuccess, hapticError } from "@/lib/haptics";

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
import { API_BASE_URL as CONFIG_API_BASE_URL } from "@/config";

const API_BASE_URL = CONFIG_API_BASE_URL;

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
    hapticImpactLight();
    await fetchNotifications();
    await markAllAsRead();
    navigate("/notifications");
  };

  const handleAutoApprovalToggle = async (enabled: boolean) => {
    hapticImpactLight();
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

          <div className="flex items-center">
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
        </div>
      </div>
    </header>
  );
}
