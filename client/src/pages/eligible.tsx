import { AppLayout } from "@/components/layout/app-layout";
import { SchemeCard } from "@/components/scheme-card";
import { useAppContext } from "@/context/app-context";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Eligible() {
  const { matchedSchemes, userProfile } = useAppContext();

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 text-sm font-medium mb-2">
                <CheckCircle2 className="w-4 h-4" />
                Personalized Results
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold">
                {userProfile ? `Hello ${userProfile.name.split(' ')[0]},` : 'Your Matches'}
              </h1>
              <p className="text-emerald-50 max-w-xl text-lg">
                {matchedSchemes.length > 0 
                  ? `Based on your profile, we found ${matchedSchemes.length} schemes you are eligible for today.`
                  : "Complete your profile to see exactly which schemes and grants you qualify for."}
              </p>
            </div>

            {!userProfile && (
              <Link href="/profile">
                <button className="bg-white text-emerald-700 hover:bg-emerald-50 px-6 py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2 whitespace-nowrap">
                  Complete Profile <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            )}
          </div>
        </div>

        {matchedSchemes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
              <CheckCircle2 className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Matches Yet</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              Fill out your complete profile including occupation, income, and category to unlock personalized scheme recommendations.
            </p>
            <Link href="/profile">
              <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5 inline-flex items-center gap-2">
                Update Profile
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {matchedSchemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} isEligibleView={true} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
