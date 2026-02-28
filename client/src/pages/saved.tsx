import { AppLayout } from "@/components/layout/app-layout";
import { SchemeCard } from "@/components/scheme-card";
import { useAppContext } from "@/context/app-context";
import { Bookmark, Compass } from "lucide-react";
import { Link } from "wouter";

export default function Saved() {
  const { savedSchemes } = useAppContext();

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
            <Bookmark className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-slate-900">
              Saved Schemes
            </h1>
            <p className="text-slate-500">
              You have {savedSchemes.length} saved {savedSchemes.length === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>

        {savedSchemes.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
              <Bookmark className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Your saved list is empty</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
              When you find a scheme that interests you, click the bookmark icon to save it here for later reference.
            </p>
            <Link href="/">
              <button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:-translate-y-0.5 inline-flex items-center gap-2">
                <Compass className="w-5 h-5" />
                Explore Schemes
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {savedSchemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
