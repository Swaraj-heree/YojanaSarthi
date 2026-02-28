import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userProfileSchema, type UserProfile } from "@shared/schema";
import { AppLayout } from "@/components/layout/app-layout";
import { useAppContext } from "@/context/app-context";
import { useMatchSchemes } from "@/hooks/use-schemes";
import { UserCircle, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { clsx } from "clsx";

const OCCUPATIONS = [
  "Student", "Farmer", "Entrepreneur", "Unemployed", "Employed", "Retired"
];

const CATEGORIES = [
  "General", "OBC", "SC", "ST", "Minority", "Women", "Differently Abled"
];

const STATES = [
  "Maharashtra", "Delhi", "Karnataka", "Gujarat", "Tamil Nadu", "Uttar Pradesh"
];

export default function Profile() {
  const { userProfile } = useAppContext();
  const matchMutation = useMatchSchemes();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserProfile>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: userProfile || {
      state: "Maharashtra",
      income: 0,
    },
  });

  const onSubmit = (data: UserProfile) => {
    matchMutation.mutate(data);
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <UserCircle className="w-8 h-8" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-slate-900">
              Eligibility Profile
            </h1>
            <p className="text-slate-500">
              Update your details to find the best matching schemes.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Sparkles className="w-48 h-48" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 block">Full Name</label>
                <input
                  {...register("name")}
                  className={clsx(
                    "w-full px-4 py-3 rounded-xl bg-slate-50 border outline-none transition-all",
                    errors.name ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100" : "border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-white"
                  )}
                  placeholder="e.g. Rahul Sharma"
                />
                {errors.name && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.name.message}</p>}
              </div>

              {/* Age Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 block">Age</label>
                <input
                  type="number"
                  {...register("age")}
                  className={clsx(
                    "w-full px-4 py-3 rounded-xl bg-slate-50 border outline-none transition-all",
                    errors.age ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100" : "border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-white"
                  )}
                  placeholder="e.g. 24"
                />
                {errors.age && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.age.message}</p>}
              </div>

              {/* Occupation Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 block">Occupation</label>
                <select
                  {...register("occupation")}
                  className={clsx(
                    "w-full px-4 py-3 rounded-xl bg-slate-50 border outline-none transition-all appearance-none",
                    errors.occupation ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100" : "border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-white"
                  )}
                >
                  <option value="">Select occupation...</option>
                  {OCCUPATIONS.map(occ => <option key={occ} value={occ}>{occ}</option>)}
                </select>
                {errors.occupation && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.occupation.message}</p>}
              </div>

              {/* Annual Income Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 block">Annual Income (₹)</label>
                <input
                  type="number"
                  {...register("income")}
                  className={clsx(
                    "w-full px-4 py-3 rounded-xl bg-slate-50 border outline-none transition-all",
                    errors.income ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100" : "border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-white"
                  )}
                  placeholder="e.g. 250000"
                />
                {errors.income && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.income.message}</p>}
              </div>

              {/* Category Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 block">Category</label>
                <select
                  {...register("category")}
                  className={clsx(
                    "w-full px-4 py-3 rounded-xl bg-slate-50 border outline-none transition-all appearance-none",
                    errors.category ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100" : "border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-white"
                  )}
                >
                  <option value="">Select category...</option>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                {errors.category && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.category.message}</p>}
              </div>

              {/* State Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 block">State</label>
                <select
                  {...register("state")}
                  className={clsx(
                    "w-full px-4 py-3 rounded-xl bg-slate-50 border outline-none transition-all appearance-none",
                    errors.state ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100" : "border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-white"
                  )}
                >
                  {STATES.map(state => <option key={state} value={state}>{state}</option>)}
                </select>
                {errors.state && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.state.message}</p>}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 mt-8">
              <button
                type="submit"
                disabled={matchMutation.isPending || isSubmitting}
                className="w-full sm:w-auto sm:px-12 py-4 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {matchMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Finding Matches...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Check My Eligibility
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
