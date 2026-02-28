import { useQuery, useMutation } from "@tanstack/react-query";
import { api, Scheme, UserProfile } from "@shared/routes";
import { useAppContext } from "@/context/app-context";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export function useSchemes() {
  return useQuery({
    queryKey: [api.schemes.list.path],
    queryFn: async () => {
      const res = await fetch(api.schemes.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch schemes");
      return api.schemes.list.responses[200].parse(await res.json());
    },
  });
}

export function useMatchSchemes() {
  const { setUserProfile, setMatchedSchemes } = useAppContext();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      const validated = api.match.create.input.parse(profile);
      const res = await fetch(api.match.create.path, {
        method: api.match.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.match.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to match schemes");
      }

      const matched = api.match.create.responses[200].parse(await res.json());
      return { profile, matched };
    },
    onSuccess: (data) => {
      // Update global context with new profile and matched results
      setUserProfile(data.profile);
      setMatchedSchemes(data.matched);
      
      toast({
        title: "Profile Updated",
        description: `We found ${data.matched.length} schemes you are eligible for!`,
      });
      
      // Redirect to eligible page to see results
      setLocation("/eligible");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}
