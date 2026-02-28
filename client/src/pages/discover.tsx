import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Loader2, CheckCircle2, Bookmark, LayoutGrid, FileText, Sparkles, ArrowRight } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { SchemeCard } from "@/components/scheme-card";
import { useSchemes } from "@/hooks/use-schemes";
import { useAppContext } from "@/context/app-context";
import { Link } from "wouter";

export default function Discover() {
  const { data: schemes, isLoading, error } = useSchemes();
  const { savedSchemes, matchedSchemes } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Extract unique categories for filter chips
  const categories = useMemo(() => {
    if (!schemes) return [];
    return Array.from(new Set(schemes.map(s => s.category)));
  }, [schemes]);

  // Filter logic
  const filteredSchemes = useMemo(() => {
    if (!schemes) return [];
    return schemes.filter(scheme => {
      const matchesSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            scheme.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory ? scheme.category === activeCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [schemes, searchQuery, activeCategory]);

  const recommendedSchemes = schemes ? schemes.slice(0, 3) : [];

  return (
    <AppLayout>
      <div className="space-y-10">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-900 to-primary rounded-3xl p-8 sm:p-12 text-white shadow-xl shadow-primary/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-6 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-blue-300" />
              <span>YojanaSarthi AI-Powered Matching</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Find the Right Government Benefits in Minutes
            </h1>
            <p className="text-blue-100 text-lg sm:text-xl max-w-2xl mb-8 leading-relaxed">
              YojanaSarthi provides intelligent matching for students, farmers & entrepreneurs in Maharashtra. Let us do the hard work.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/profile">
                <button className="px-8 py-4 rounded-xl bg-white text-indigo-900 font-bold hover:bg-blue-50 hover:scale-105 transition-all duration-200 shadow-lg shadow-black/10 flex items-center gap-2">
                  Complete Your Profile
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <button 
                onClick={() => document.getElementById('explore-schemes')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 rounded-xl bg-white/10 text-white font-semibold border border-white/20 hover:bg-white/20 transition-all duration-200 backdrop-blur-md"
              >
                Explore Schemes
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Stats Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Eligible Schemes", value: matchedSchemes?.length || 0, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
            { label: "Saved Schemes", value: savedSchemes?.length || 0, icon: Bookmark, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
            { label: "Total Schemes", value: schemes?.length || 0, icon: LayoutGrid, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
            { label: "State Active", value: "MH", icon: FileText, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.border} border`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recommended For You */}
        {!isLoading && recommendedSchemes.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-slate-900">Recommended For You</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedSchemes.map((scheme) => (
                <div key={scheme.id} className="transform hover:-translate-y-1 transition-all duration-300 h-full">
                  <SchemeCard scheme={scheme} featured />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Explore Schemes Section */}
        <div id="explore-schemes" className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">All Schemes</h2>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 sticky top-4 z-30">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Search by name, keyword or state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-900 placeholder:text-slate-400"
              />
            </div>
            <button className="hidden sm:flex items-center gap-2 px-6 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-medium transition-colors">
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
              <button
                onClick={() => setActiveCategory(null)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-xl font-medium text-sm transition-all border ${
                  activeCategory === null 
                    ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                All Categories
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-xl font-medium text-sm transition-all border ${
                    activeCategory === cat 
                      ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Content Grid */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="font-medium">Loading opportunities...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center">
              <p className="font-semibold">Failed to load schemes.</p>
              <p className="text-sm opacity-80 mt-1">Please try refreshing the page.</p>
            </div>
          ) : filteredSchemes.length === 0 ? (
            <div className="text-center py-20 px-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No schemes found</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                We couldn't find any schemes matching your search criteria. Try adjusting your filters or search terms.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredSchemes.map((scheme) => (
                <SchemeCard key={scheme.id} scheme={scheme} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}