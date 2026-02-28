import { Bookmark, Sparkles, Building, Briefcase, IndianRupee, ArrowRight, CheckCircle2 } from "lucide-react";
import { Scheme } from "@shared/schema";
import { useAppContext } from "@/context/app-context";
import { useLocation } from "wouter";
import { clsx } from "clsx";

interface SchemeCardProps {
  scheme: Scheme;
  isEligibleView?: boolean;
  featured?: boolean;
}

export function SchemeCard({ scheme, isEligibleView = false, featured = false }: SchemeCardProps) {
  const { toggleSaveScheme, isSchemeSaved } = useAppContext();
  const [, setLocation] = useLocation();
  const saved = isSchemeSaved(scheme.id);

  return (
    <div className={clsx(
      "bg-white rounded-3xl p-6 border relative overflow-hidden group flex flex-col h-full transition-all duration-300",
      featured ? "border-indigo-100 shadow-lg shadow-indigo-100/50 hover:shadow-xl hover:shadow-indigo-200/50" : "border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1"
    )}>
      {/* Decorative gradient blob */}
      <div className={clsx(
        "absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700",
        featured ? "bg-gradient-to-br from-indigo-500/10 to-purple-500/10" : "bg-gradient-to-br from-primary/5 to-blue-400/5"
      )} />

      {/* Header */}
      <div className="flex justify-between items-start gap-4 mb-5 relative z-10">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200">
              <Building className="w-3.5 h-3.5" />
              {scheme.state}
            </span>
            {isEligibleView && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Eligible Match
              </span>
            )}
            {featured && !isEligibleView && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/50">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Recommended
              </span>
            )}
          </div>
          <h3 className={clsx(
            "font-display font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors",
            featured ? "text-2xl" : "text-xl"
          )}>
            {scheme.name}
          </h3>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSaveScheme(scheme);
          }}
          className={clsx(
            "p-2.5 rounded-2xl transition-all duration-200 flex-shrink-0 border shadow-sm",
            saved 
              ? "bg-amber-50 text-amber-500 border-amber-200 hover:bg-amber-100" 
              : "bg-white text-slate-400 border-slate-200 hover:bg-slate-50 hover:text-slate-600 hover:border-slate-300"
          )}
          aria-label={saved ? "Remove from saved" : "Save scheme"}
        >
          <Bookmark className={clsx("w-5 h-5", saved && "fill-current text-amber-500")} />
        </button>
      </div>

      {/* Description */}
      <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-2 flex-1 relative z-10">
        {scheme.description}
      </p>

      {/* Metadata Tags */}
      <div className="flex flex-wrap gap-2 mb-8 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-700">
          <Briefcase className="w-4 h-4 text-slate-400" />
          {scheme.occupation}
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs font-medium text-emerald-700">
          <IndianRupee className="w-4 h-4 text-emerald-500" />
          <span className="font-bold">{scheme.incomeRange}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 relative z-10 mt-auto">
        <button 
          onClick={() => setLocation(`/scheme/${scheme.id}`)}
          className={clsx(
            "flex-1 py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2",
            isEligibleView
              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30"
              : "bg-slate-900 hover:bg-primary text-white shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-primary/25"
          )}
        >
          {isEligibleView ? "Apply Now" : "View Details"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}