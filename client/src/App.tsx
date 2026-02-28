import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/app-context";
import NotFound from "@/pages/not-found";

import Discover from "@/pages/discover";
import Eligible from "@/pages/eligible";
import Saved from "@/pages/saved";
import Profile from "@/pages/profile";
import SchemeDetails from "@/pages/scheme-details";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Discover} />
      <Route path="/eligible" component={Eligible} />
      <Route path="/saved" component={Saved} />
      <Route path="/profile" component={Profile} />
      <Route path="/scheme/:id" component={SchemeDetails} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <Toaster />
          <Router />
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
