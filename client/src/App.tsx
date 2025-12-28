import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import AuthPage from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import CreateDonation from "@/pages/create-donation";
import MyDonations from "@/pages/my-donations";
import AvailableDonations from "@/pages/available-donations";
import NgoClaimedDonations from "@/pages/ngo-claimed";
import MyAssignments from "@/pages/assignments";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        {/* Public Routes */}
        <Route path="/login" component={AuthPage} />
        
        {/* Root redirect */}
        <Route path="/">
          <Redirect to="/dashboard" />
        </Route>

        {/* Protected Routes */}
        <Route path="/dashboard">
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </Route>

        {/* DONOR Routes */}
        <Route path="/donations/new">
          <ProtectedRoute allowedRoles={['DONOR']}>
            <CreateDonation />
          </ProtectedRoute>
        </Route>
        <Route path="/donations/my">
          <ProtectedRoute allowedRoles={['DONOR']}>
            <MyDonations />
          </ProtectedRoute>
        </Route>

        {/* NGO Routes */}
        <Route path="/donations/available">
          <ProtectedRoute allowedRoles={['NGO']}>
            <AvailableDonations />
          </ProtectedRoute>
        </Route>
        <Route path="/donations/claimed">
          <ProtectedRoute allowedRoles={['NGO']}>
            <NgoClaimedDonations />
          </ProtectedRoute>
        </Route>

        {/* VOLUNTEER Routes */}
        <Route path="/assignments">
          <ProtectedRoute allowedRoles={['VOLUNTEER']}>
            <MyAssignments />
          </ProtectedRoute>
        </Route>

        {/* Fallback */}
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
