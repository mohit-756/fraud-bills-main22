import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Shield,
  Users,
  Wallet,
  Building2,
  ArrowRight,
  CheckCircle,
  Zap,
  BarChart3,
  Lock,
  ChevronRight,
  Sparkles,
  TrendingDown,
  FileSearch,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/* ─── Data ─────────────────────────────────────────────────────── */

const roles = [
  {
    value: "sales",
    label: "Sales",
    icon: Users,
    gradientBg: "from-violet-50 to-white",
    border: "border-violet-200 hover:border-violet-400",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    btnClass: "bg-violet-600 hover:bg-violet-700 text-white",
    checkColor: "text-violet-500",
    desc: "Upload bills, track submissions, manage attendance and stay notified on approvals.",
    features: [
      "Upload bills (PDF / Image)",
      "Track bill history",
      "Calendar attendance",
      "Real-time notifications",
    ],
  },
  {
    value: "finance",
    label: "Finance",
    icon: Wallet,
    gradientBg: "from-emerald-50 to-white",
    border: "border-emerald-200 hover:border-emerald-400",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    btnClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
    checkColor: "text-emerald-500",
    featured: true,
    desc: "Review all bills with AI-powered fraud detection. Approve, reject and export analytics.",
    features: [
      "AI fraud detection",
      "Approve / Reject bills",
      "Analytics dashboard",
      "Filter & search",
    ],
  },
  {
    value: "vendor",
    label: "Vendor",
    icon: Building2,
    gradientBg: "from-amber-50 to-white",
    border: "border-amber-200 hover:border-amber-400",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    btnClass: "bg-amber-500 hover:bg-amber-600 text-white",
    checkColor: "text-amber-500",
    desc: "Submit bills, view live approval status, read reviewer comments, and access full history.",
    features: [
      "Upload bills",
      "Track bill status",
      "View comments",
      "Submission history",
    ],
  },
];

const stats = [
  { value: "98%", label: "Fraud Detection Rate", icon: Shield, color: "text-violet-600", bg: "bg-violet-50" },
  { value: "4×", label: "Faster Approvals", icon: Zap, color: "text-emerald-600", bg: "bg-emerald-50" },
  { value: "60%", label: "Cost Reduction", icon: TrendingDown, color: "text-amber-600", bg: "bg-amber-50" },
];

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Detection",
    desc: "Flags anomalies, duplicate bills, and forged documents instantly with intelligent analysis.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
  {
    icon: BarChart3,
    title: "Live Analytics",
    desc: "Finance teams get a real-time view of spend trends, approval throughput, and flagged activity.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    icon: Lock,
    title: "Role-Based Access",
    desc: "Granular permissions ensure every user sees exactly what they need — nothing more.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    desc: "Instant alerts on status changes, fraud flags, and pending approvals — on any device.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
];

/* ─── Animation variants ────────────────────────────────────────── */

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

/* ─── Page ──────────────────────────────────────────────────────── */

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { scrollY } = useScroll();
  const headerShadow = useTransform(
    scrollY,
    [0, 60],
    ["0 0 0 0 rgba(0,0,0,0)", "0 1px 24px 0 rgba(0,0,0,0.07)"]
  );

  if (isAuthenticated) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden selection:bg-violet-200">

      {/* ── Dot grid background ── */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── Soft color washes ── */}
      <div className="pointer-events-none fixed top-[-100px] left-[-100px] w-[700px] h-[500px] rounded-full opacity-20 blur-[120px] bg-violet-300 z-0" />
      <div className="pointer-events-none fixed top-[500px] right-[-150px] w-[400px] h-[400px] rounded-full opacity-15 blur-[100px] bg-emerald-200 z-0" />

      {/* ── Header ── */}
      <motion.header
        style={{ boxShadow: headerShadow }}
        className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100"
      >
        <div className="container mx-auto flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-md shadow-violet-200">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900">BillGuard</span>
          </div>
          <nav className="hidden md:flex items-center gap-7 text-sm text-slate-500">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#roles" className="hover:text-slate-900 transition-colors">Roles</a>
            <a href="#stats" className="hover:text-slate-900 transition-colors">Why Us</a>
          </nav>
          <div className="flex items-center gap-2.5">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-600 hover:text-slate-900"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
            <Button
              size="sm"
              className="bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-200"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </motion.header>

      {/* ── Hero ── */}
      <section className="relative container mx-auto px-6 pt-40 pb-24 text-center">
        <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-4xl mx-auto">

          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-violet-200 bg-violet-50 text-violet-700 mb-6">
              <Sparkles className="h-3 w-3" />
              AI-Powered Bill Fraud Detection
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-slate-900"
          >
            Stop Fraudulent Bills
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
              Before They Strike
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            BillGuard is an intelligent bill management system that detects fraud with AI, streamlines
            approvals, and gives every stakeholder — from sales reps to vendors — a clear view of their submissions.
          </motion.p>

          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 flex-wrap">
            <Button
              size="lg"
              className="bg-violet-600 hover:bg-violet-700 text-white shadow-xl shadow-violet-200 px-8 hover:scale-[1.02] transition-all"
              onClick={() => navigate("/signup")}
            >
              Start for free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          </motion.div>
        </motion.div>

        {/* ── Hero preview card ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-20 relative mx-auto max-w-3xl"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-200 via-fuchsia-100 to-pink-200 rounded-3xl blur opacity-70" />
          <div className="relative rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200 overflow-hidden">
            {/* browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
              <div className="flex-1 mx-4 h-6 rounded-md bg-white border border-slate-200 flex items-center px-3">
                <span className="text-xs text-slate-400">app.billguard.io/dashboard</span>
              </div>
            </div>
            {/* stat row */}
            <div className="p-6 grid grid-cols-3 gap-4">
              {[
                { label: "Bills Today", value: "24", color: "text-violet-600", bg: "bg-violet-50 border-violet-100" },
                { label: "Flagged", value: "3", color: "text-red-600", bg: "bg-red-50 border-red-100" },
                { label: "Approved", value: "18", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
              ].map((s) => (
                <div key={s.label} className={`rounded-xl ${s.bg} p-4 border`}>
                  <p className="text-xs text-slate-500 mb-1">{s.label}</p>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
            {/* bill rows */}
            <div className="px-6 pb-6 space-y-2">
              {[
                { name: "INV-2024-0092", vendor: "Acme Corp", status: "Flagged", pill: "text-red-600 bg-red-50 border-red-200" },
                { name: "INV-2024-0091", vendor: "BuildIt Ltd", status: "Approved", pill: "text-emerald-600 bg-emerald-50 border-emerald-200" },
                { name: "INV-2024-0090", vendor: "FastFreight", status: "Pending", pill: "text-amber-600 bg-amber-50 border-amber-200" },
              ].map((row) => (
                <div key={row.name} className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{row.name}</p>
                    <p className="text-xs text-slate-400">{row.vendor}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${row.pill}`}>
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section id="stats" className="relative py-16 border-y border-slate-100 bg-slate-50/80">
        <div className="container mx-auto px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-2 md:grid-cols-3 gap-8"
          >
            {stats.map((s) => (
              <motion.div key={s.label} variants={fadeUp} className="text-center">
                <div className={`h-10 w-10 rounded-xl ${s.bg} flex items-center justify-center mx-auto mb-3 shadow-sm`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <p className={`text-4xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-sm text-slate-500 mt-1">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-3">Core Capabilities</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Everything your finance team needs</h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className={`group rounded-2xl border ${f.border} ${f.bg} hover:shadow-md p-6 transition-all duration-300 cursor-default`}
              >
                <div className={`h-10 w-10 rounded-xl bg-white border ${f.border} shadow-sm flex items-center justify-center mb-5`}>
                  <f.icon className={`h-5 w-5 ${f.color}`} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Role Cards ── */}
      <section id="roles" className="relative py-24 bg-slate-50/60">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-3">Pick Your Role</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Built for every stakeholder</h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
              Whether you're submitting a bill or approving one, BillGuard has a tailored experience for you.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {roles.map((role) => (
              <motion.div
                key={role.value}
                variants={fadeUp}
                className={`relative group rounded-2xl border-2 ${role.border} bg-gradient-to-br ${role.gradientBg} p-6 transition-all duration-300 flex flex-col shadow-sm hover:shadow-lg`}
              >
                {role.featured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-200">
                      Most Used
                    </span>
                  </div>
                )}

                <div className={`h-12 w-12 rounded-xl ${role.iconBg} flex items-center justify-center mb-5 shadow-sm`}>
                  <role.icon className={`h-6 w-6 ${role.iconColor}`} />
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">{role.label}</h3>
                <p className="text-sm text-slate-500 mb-5 leading-relaxed">{role.desc}</p>

                <ul className="space-y-2.5 mb-7 flex-1">
                  {role.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-slate-700">
                      <CheckCircle className={`h-4 w-4 shrink-0 ${role.checkColor}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full justify-between ${role.btnClass} shadow-sm`}
                  onClick={() => navigate(`/signup?role=${role.value}`)}
                >
                  Sign up as {role.label}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative max-w-3xl mx-auto rounded-3xl border-2 border-violet-100 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-12 text-center overflow-hidden shadow-xl shadow-violet-100"
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-violet-100 blur-3xl opacity-60 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-fuchsia-100 blur-3xl opacity-50 pointer-events-none" />
            <div className="relative">
              <div className="h-14 w-14 rounded-2xl bg-violet-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-violet-200">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Ready to eliminate bill fraud?
              </h2>
              <p className="text-slate-500 mb-8 max-w-xl mx-auto">
                Join companies already using BillGuard to protect their finances. Free to get started, no credit card required.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Button
                  size="lg"
                  className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200 px-8"
                  onClick={() => navigate("/signup")}
                >
                  Create free account <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-200 text-slate-700 hover:bg-slate-50"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-100 py-8 bg-slate-50">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-violet-600 flex items-center justify-center">
              <Shield className="h-3 w-3 text-white" />
            </div>
            <span className="font-bold text-slate-600">BillGuard</span>
          </div>
          <p>© 2026 BillGuard — AI-Powered Bill Fraud Detection System</p>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}