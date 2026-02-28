import clsx from "clsx";
import { useRoute } from "wouter";
import { useSchemes } from "@/hooks/use-schemes";
import { AppLayout } from "@/components/layout/app-layout";
import { useAppContext } from "@/context/app-context";
import {
  Building,
  IndianRupee,
  Briefcase,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ExternalLink,
  FileText,
  ShieldCheck,
  AlertCircle,
  ArrowRightLeft,
} from "lucide-react";
import { Link } from "wouter";
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SchemeDetails() {
  const [, params] = useRoute("/scheme/:id");
  const { data: schemes, isLoading } = useSchemes();
  const { userProfile } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const scheme = useMemo(() => {
    return schemes?.find((s) => s.id === params?.id);
  }, [schemes, params?.id]);

  const calculateEligibility = (s: any, profile: any) => {
    if (!s || !profile) return null;
    const errors: string[] = [];
    if (s.minAge !== undefined && profile.age < s.minAge)
      errors.push(`Age below ${s.minAge}`);
    if (s.maxAge !== undefined && profile.age > s.maxAge)
      errors.push(`Age above ${s.maxAge}`);
    if (s.maxIncome !== undefined && profile.income > s.maxIncome)
      errors.push(`Income above ₹${s.maxIncome.toLocaleString()}`);
    if (
      s.requiredCategory &&
      !s.requiredCategory
        .split("/")
        .some(
          (cat: string) =>
            profile.category.includes(cat.trim()) || cat.trim() === "All",
        )
    ) {
      if (s.requiredCategory !== "All") errors.push(`Category mismatch`);
    }
    if (
      s.requiredOccupation &&
      s.requiredOccupation !== "Any" &&
      profile.occupation !== s.requiredOccupation
    )
      errors.push(`Occupation mismatch`);

    if (errors.length > 0)
      return { eligible: false, reason: errors[0], score: 0 };

    let score = 60;
    if (s.maxIncome !== undefined && profile.income < s.maxIncome * 0.7)
      score += 20;
    if (s.requiredOccupation === profile.occupation) score += 10;
    if (s.requiredCategory && profile.category.includes(s.requiredCategory))
      score += 10;
    return {
      eligible: true,
      score: Math.min(score, 100),
      badge: score >= 80 ? "Highly Recommended" : "Eligible",
    };
  };

  const eligibility = useMemo(
    () => calculateEligibility(scheme, userProfile),
    [scheme, userProfile],
  );

  const similarSchemes = useMemo(() => {
    if (!scheme || !schemes) return [];
    return schemes
      .filter((s) => s.id !== scheme.id && s.category === scheme.category)
      .slice(0, 2)
      .map((s) => ({
        ...s,
        eligibility: calculateEligibility(s, userProfile),
      }));
  }, [scheme, schemes, userProfile]);

  if (isLoading)
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          Loading...
        </div>
      </AppLayout>
    );
  if (!scheme)
    return (
      <AppLayout>
        <div>Scheme not found</div>
      </AppLayout>
    );

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        <div className="flex items-center justify-between">
          <Link href="/">
            <button className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium">
              <ArrowLeft className="w-4 h-4" />
              Back to Explore
            </button>
          </Link>

          {similarSchemes.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setShowCompareModal(true)}
              className="gap-2 rounded-xl"
            >
              <ArrowRightLeft className="w-4 h-4" />
              Compare Similar
            </Button>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 sm:p-10 border-b border-slate-100 bg-slate-50/50">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge variant="outline" className="bg-white gap-1.5 py-1.5 px-3">
                <Building className="w-3.5 h-3.5" />
                {scheme.state}
              </Badge>
              <Badge variant="secondary" className="gap-1.5 py-1.5 px-3">
                <Briefcase className="w-3.5 h-3.5" />
                {scheme.occupation}
              </Badge>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              {scheme.name}
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed">
              {scheme.description}
            </p>
          </div>

          <div className="p-8 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-10">
              <section>
                <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-4">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Key Benefits
                </h2>
                <ul className="grid grid-cols-1 gap-3">
                  {scheme.benefits?.map((benefit, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700"
                    >
                      <div className="w-6 h-6 rounded-full bg-white flex-shrink-0 flex items-center justify-center text-xs font-bold text-primary shadow-sm border border-slate-100">
                        {i + 1}
                      </div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-4">
                  <FileText className="w-5 h-5 text-primary" />
                  Required Documents
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {scheme.documents?.map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 text-slate-600 text-sm"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary/20" />
                      {doc}
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  Official Portal
                </h2>
                <a
                  href={scheme.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
                >
                  Visit official website
                  <ExternalLink className="w-4 h-4" />
                </a>
              </section>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900">Eligibility Status</h3>
                {!userProfile ? (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-amber-800 text-sm space-y-3">
                    <p className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      Complete your profile to check eligibility and match
                      score.
                    </p>
                    <Link href="/profile">
                      <Button
                        variant="outline"
                        className="w-full bg-white border-amber-200 text-amber-700 hover:bg-amber-100"
                      >
                        Complete Profile
                      </Button>
                    </Link>
                  </div>
                ) : eligibility?.eligible ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-5 h-5" />
                        Eligible
                      </span>
                      <Badge className="bg-emerald-500 hover:bg-emerald-500">
                        {eligibility.badge}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-500">Match Score</span>
                        <span className="text-slate-900">
                          {eligibility.score}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${eligibility.score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-100 space-y-2">
                    <span className="text-red-600 font-bold flex items-center gap-1.5">
                      <XCircle className="w-5 h-5" />
                      Not Eligible
                    </span>
                    <p className="text-sm text-red-700 leading-tight">
                      Reason: {eligibility?.reason}
                    </p>
                  </div>
                )}

                <Button
                  onClick={() => setShowModal(true)}
                  className="w-full py-6 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20"
                >
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {eligibility?.eligible ? "Application Initiated" : "Ineligible"}
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-lg">
              {eligibility?.eligible
                ? "You meet the core requirements for this scheme."
                : "You do not meet the mandatory criteria for this scheme."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {eligibility?.eligible ? (
              <>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                  <span className="font-bold text-emerald-700">
                    Match Score
                  </span>
                  <span className="text-2xl font-black text-emerald-700">
                    {eligibility.score}%
                  </span>
                </div>
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900">Next Steps:</h4>
                  <ul className="space-y-2">
                    {scheme.documents?.map((doc, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-slate-600"
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="p-6 rounded-2xl bg-red-50 border border-red-100 space-y-3">
                <div className="flex items-center gap-2 text-red-700 font-bold">
                  <XCircle className="w-5 h-5" />
                  Reason for ineligibility:
                </div>
                <p className="text-red-700">{eligibility?.reason}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            {eligibility?.eligible ? (
              <Button
                onClick={() => window.open(scheme.officialUrl, "_blank")}
                className="w-full py-6 bg-slate-900 hover:bg-slate-800 rounded-2xl gap-2 font-bold"
              >
                Go to Official Portal
                <ExternalLink className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={() => setShowModal(false)}
                variant="outline"
                className="w-full py-6 rounded-2xl font-bold"
              >
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCompareModal} onOpenChange={setShowCompareModal}>
        <DialogContent className="max-w-3xl rounded-3xl overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Compare Schemes
            </DialogTitle>
            <DialogDescription>
              Comparing {scheme.name} with similar opportunities in{" "}
              {scheme.category}.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Feature</TableHead>
                  <TableHead className="font-bold text-slate-900 bg-slate-50/50">
                    {scheme.name}
                  </TableHead>
                  {similarSchemes.map((s) => (
                    <TableHead key={s.id} className="font-bold text-slate-900">
                      {s.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Income Limit</TableCell>
                  <TableCell className="bg-slate-50/50">
                    ₹{scheme.maxIncome?.toLocaleString() || "Any"}
                  </TableCell>
                  {similarSchemes.map((s) => (
                    <TableCell key={s.id}>
                      ₹{s.maxIncome?.toLocaleString() || "Any"}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Age Range</TableCell>
                  <TableCell className="bg-slate-50/50">
                    {scheme.minAge}-{scheme.maxAge}
                  </TableCell>
                  {similarSchemes.map((s) => (
                    <TableCell key={s.id}>
                      {s.minAge}-{s.maxAge}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Category</TableCell>
                  <TableCell className="bg-slate-50/50">
                    {scheme.requiredCategory || "All"}
                  </TableCell>
                  {similarSchemes.map((s) => (
                    <TableCell key={s.id}>
                      {s.requiredCategory || "All"}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Eligibility Match
                  </TableCell>
                  <TableCell className="bg-slate-50/50 font-bold text-emerald-600">
                    {eligibility?.eligible
                      ? `${eligibility.score}%`
                      : "Not Eligible"}
                  </TableCell>
                  {similarSchemes.map((s) => (
                    <TableCell
                      key={s.id}
                      className={clsx(
                        "font-bold",
                        s.eligibility?.eligible
                          ? "text-emerald-600"
                          : "text-red-500",
                      )}
                    >
                      {s.eligibility?.eligible
                        ? `${s.eligibility.score}%`
                        : "Not Eligible"}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setShowCompareModal(false)}
              className="rounded-xl px-8"
            >
              Close Comparison
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
