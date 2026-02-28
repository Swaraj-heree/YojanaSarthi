import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Scheme, UserProfile } from "@shared/schema";

interface AppContextType {
  userProfile: UserProfile | null;
  matchedSchemes: Scheme[];
  savedSchemes: Scheme[];
  setUserProfile: (profile: UserProfile | null) => void;
  setMatchedSchemes: (schemes: Scheme[]) => void;
  toggleSaveScheme: (scheme: Scheme) => void;
  isSchemeSaved: (schemeId: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to load state from localStorage so it persists across refreshes in phase 1
const loadState = <T,>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(() => 
    loadState("userProfile", null)
  );
  const [matchedSchemes, setMatchedSchemesState] = useState<Scheme[]>(() => 
    loadState("matchedSchemes", [])
  );
  const [savedSchemes, setSavedSchemesState] = useState<Scheme[]>(() => 
    loadState("savedSchemes", [])
  );

  // Persist state changes
  useEffect(() => {
    localStorage.setItem("userProfile", JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem("matchedSchemes", JSON.stringify(matchedSchemes));
  }, [matchedSchemes]);

  useEffect(() => {
    localStorage.setItem("savedSchemes", JSON.stringify(savedSchemes));
  }, [savedSchemes]);

  const toggleSaveScheme = (scheme: Scheme) => {
    setSavedSchemesState(prev => {
      const exists = prev.find(s => s.id === scheme.id);
      if (exists) {
        return prev.filter(s => s.id !== scheme.id);
      }
      return [...prev, scheme];
    });
  };

  const isSchemeSaved = (schemeId: string) => {
    return savedSchemes.some(s => s.id === schemeId);
  };

  return (
    <AppContext.Provider
      value={{
        userProfile,
        matchedSchemes,
        savedSchemes,
        setUserProfile: setUserProfileState,
        setMatchedSchemes: setMatchedSchemesState,
        toggleSaveScheme,
        isSchemeSaved,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
