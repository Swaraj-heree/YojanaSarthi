import { ReactNode, useMemo } from "react";
import { Link, useLocation } from "wouter";
import {
  Compass,
  CheckCircle2,
  Bookmark,
  UserCircle,
  Hexagon,
  Sparkles,
  AlertCircle,
  TrendingUp,
  Star,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/context/app-context";
import { useSchemes } from "@/hooks/use-schemes";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { href: "/", label: "Discover", icon: Compass },
  {
    href: "/eligible",
    label: "Eligible",
    icon: CheckCircle2,
    badge: "matchedSchemes",
  },
  { href: "/saved", label: "Saved", icon: Bookmark, badge: "savedSchemes" },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { matchedSchemes, savedSchemes, userProfile } = useAppContext();
  const { data: schemes } = useSchemes();

  const getBadgeCount = (type?: string) => {
    if (type === "matchedSchemes") return matchedSchemes?.length || 0;
    if (type === "savedSchemes") return savedSchemes?.length || 0;
    return 0;
  };

  const aiStats = useMemo(() => {
    if (!userProfile || !schemes) return null;

    const isProfileComplete =
      userProfile.age &&
      userProfile.income !== undefined &&
      userProfile.category &&
      userProfile.occupation;

    if (!isProfileComplete) return { complete: false };

    // Use the same matching logic as the storage/details page
    const calculateEligibility = (s: any, profile: any) => {
      const errors: string[] = [];
      if (s.minAge !== undefined && profile.age < s.minAge) errors.push("age");
      if (s.maxAge !== undefined && profile.age > s.maxAge) errors.push("age");
      if (s.maxIncome !== undefined && profile.income > s.maxIncome)
        errors.push("income");
      if (
        s.requiredCategory &&
        !s.requiredCategory
          .split("/")
          .some(
            (cat: string) =>
              profile.category.includes(cat.trim()) || cat.trim() === "All",
          )
      ) {
        if (s.requiredCategory !== "All") errors.push("category");
      }
      if (
        s.requiredOccupation &&
        s.requiredOccupation !== "Any" &&
        profile.occupation !== s.requiredOccupation
      )
        errors.push("occupation");

      if (errors.length > 0) return { eligible: false, score: 0 };

      let score = 60;
      if (s.maxIncome !== undefined && profile.income < s.maxIncome * 0.7)
        score += 20;
      if (s.requiredOccupation === profile.occupation) score += 10;
      if (s.requiredCategory && profile.category.includes(s.requiredCategory))
        score += 10;
      return { eligible: true, score: Math.min(score, 100) };
    };

    const analyzed = schemes.map((s) => calculateEligibility(s, userProfile));
    const eligibleCount = analyzed.filter((a) => a.eligible).length;
    const highlyRecommended = analyzed.filter(
      (a) => a.eligible && a.score >= 80,
    ).length;

    return {
      complete: true,
      total: schemes.length,
      eligible: eligibleCount,
      recommended: highlyRecommended,
    };
  }, [userProfile, schemes]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col sm:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden sm:flex flex-col w-64 lg:w-72 fixed h-screen bg-white border-r border-slate-200 z-40 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-8 flex items-center gap-3 border-b border-slate-100">
          <img
            src="/Logo.png"
            alt="YojanaSarthi"
            className="h-12 w-auto object-contain"
          />
          <div>
            <h1 className="font-display font-bold text-2xl leading-none tracking-tight text-slate-900">
              YojanaSarthi
            </h1>
            <p className="text-[11px] text-indigo-600 font-bold tracking-wider uppercase mt-1">
              GovTech Platform
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="px-4 py-8 space-y-2">
            {navItems.map((item) => {
              const isActive = location === item.href;
              const badgeCount = getBadgeCount(item.badge);

              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center justify-between px-4 py-4 rounded-2xl transition-all duration-300 cursor-pointer group relative overflow-hidden",
                      isActive
                        ? "bg-indigo-50 text-indigo-700 font-bold shadow-sm border border-indigo-100/50"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-semibold border border-transparent",
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-indigo-600 rounded-r-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                    <div className="flex items-center gap-3">
                      <item.icon
                        className={cn(
                          "w-5 h-5 transition-all duration-300",
                          isActive
                            ? "scale-110 text-indigo-600"
                            : "group-hover:scale-110 group-hover:text-indigo-500",
                        )}
                      />
                      <span className="relative z-10">{item.label}</span>
                    </div>

                    {badgeCount > 0 && (
                      <span
                        className={cn(
                          "text-xs px-2.5 py-1 rounded-full font-bold transition-colors relative z-10",
                          isActive
                            ? "bg-indigo-200 text-indigo-800"
                            : "bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-700",
                        )}
                      >
                        {badgeCount}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto px-6 pb-8 space-y-6">
            <div className="pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  AI Eligibility Engine
                </h3>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                {!aiStats ? (
                  <div className="flex items-start gap-3 text-slate-500">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p className="text-xs leading-relaxed font-medium">
                      Loading matching engine...
                    </p>
                  </div>
                ) : !aiStats.complete ? (
                  <div className="flex items-start gap-3 text-amber-600">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p className="text-xs leading-relaxed font-bold">
                      ⚠ Profile Incomplete
                      <span className="block mt-1 font-medium text-slate-500">
                        Complete your profile to activate intelligent matching.
                      </span>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      Profile Verified
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium flex items-center gap-1.5">
                          <TrendingUp className="w-3 h-3" /> Schemes Analyzed
                        </span>
                        <span className="font-bold text-slate-900">
                          {aiStats.total}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />{" "}
                          Eligible Schemes
                        </span>
                        <span className="font-bold text-emerald-600">
                          {aiStats.eligible}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium flex items-center gap-1.5">
                          <Star className="w-3 h-3 text-indigo-500 fill-indigo-500" />{" "}
                          Highly Recommended
                        </span>
                        <span className="font-bold text-indigo-600">
                          {aiStats.recommended}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed text-center font-medium italic">
              “Bridging citizens to the right government benefits through
              intelligent eligibility matching.”
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 sm:ml-64 lg:ml-72 pb-24 sm:pb-0 relative">
        <div className="max-w-7xl mx-auto p-4 sm:p-8 lg:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-slate-200 z-50 pb-safe shadow-[0_-20px_40px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around p-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const badgeCount = getBadgeCount(item.badge);

            return (
              <Link key={item.href} href={item.href}>
                <div className="flex flex-col items-center justify-center p-2 min-w-[72px] cursor-pointer relative group">
                  {isActive && (
                    <motion.div
                      layoutId="mobile-nav-active"
                      className="absolute inset-0 bg-indigo-50 rounded-2xl -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                    />
                  )}
                  <div className="relative">
                    <item.icon
                      className={cn(
                        "w-6 h-6 mb-1 transition-all duration-300",
                        isActive
                          ? "text-indigo-600 scale-110 drop-shadow-sm"
                          : "text-slate-400 group-hover:text-slate-600",
                      )}
                    />
                    {badgeCount > 0 && (
                      <span className="absolute -top-1.5 -right-2.5 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white shadow-sm">
                        {badgeCount > 9 ? "9+" : badgeCount}
                      </span>
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-bold transition-colors duration-300",
                      isActive ? "text-indigo-700" : "text-slate-500",
                    )}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
