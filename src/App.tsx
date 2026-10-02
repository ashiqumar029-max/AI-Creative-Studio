import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CheckoutModal } from './components/CheckoutModal';
import { NewProjectModal } from './components/NewProjectModal';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { DashboardLayout } from './components/DashboardLayout';
import { AdminLayout } from './components/AdminLayout';
import { PageLoadingFallback } from './components/PageLoadingFallback';

// Public Pages (Direct load for optimal SEO & immediate landing paint)
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { PricingPage } from './pages/PricingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';

// Public Shared Showcase Route (Lazy Loaded)
const PublicSharedProjectPage = lazy(() =>
  import('./pages/PublicSharedProjectPage').then((m) => ({ default: m.PublicSharedProjectPage }))
);

// Code Splitting: Lazy-Loaded Dashboard Modules (Reduces initial bundle by ~70%)
const DashboardOverviewPage = lazy(() =>
  import('./pages/dashboard/DashboardOverviewPage').then((m) => ({ default: m.DashboardOverviewPage }))
);
const ProjectsPage = lazy(() =>
  import('./pages/dashboard/ProjectsPage').then((m) => ({ default: m.ProjectsPage }))
);
const ToolsHubPage = lazy(() =>
  import('./pages/dashboard/ToolsHubPage').then((m) => ({ default: m.ToolsHubPage }))
);
const HistoryPage = lazy(() =>
  import('./pages/dashboard/HistoryPage').then((m) => ({ default: m.HistoryPage }))
);
const ProfilePage = lazy(() =>
  import('./pages/dashboard/ProfilePage').then((m) => ({ default: m.ProfilePage }))
);
const SettingsPage = lazy(() =>
  import('./pages/dashboard/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);

// Code Splitting: Lazy-Loaded Admin Portal Modules
const AdminOverviewPage = lazy(() =>
  import('./pages/admin/AdminOverviewPage').then((m) => ({ default: m.AdminOverviewPage }))
);
const AdminUsersPage = lazy(() =>
  import('./pages/admin/AdminUsersPage').then((m) => ({ default: m.AdminUsersPage }))
);
const AdminProjectsPage = lazy(() =>
  import('./pages/admin/AdminProjectsPage').then((m) => ({ default: m.AdminProjectsPage }))
);
const AdminOrdersPage = lazy(() =>
  import('./pages/admin/AdminOrdersPage').then((m) => ({ default: m.AdminOrdersPage }))
);
const AdminPortfolioPage = lazy(() =>
  import('./pages/admin/AdminPortfolioPage').then((m) => ({ default: m.AdminPortfolioPage }))
);
const AdminSettingsPage = lazy(() =>
  import('./pages/admin/AdminSettingsPage').then((m) => ({ default: m.AdminSettingsPage }))
);

// Public layout wrapper with Navbar & Footer
const PublicLayout: React.FC<{
  onOpenCheckout: () => void;
  onOpenNewProject: () => void;
}> = ({ onOpenCheckout, onOpenNewProject }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#090A0F] text-slate-100 selection:bg-purple-500/30 selection:text-purple-200">
      <Navbar onOpenCheckout={onOpenCheckout} onOpenNewProject={onOpenNewProject} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);

  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes with standard Navbar & Footer */}
            <Route
              element={
                <PublicLayout
                  onOpenCheckout={() => setIsCheckoutOpen(true)}
                  onOpenNewProject={() => setIsNewProjectOpen(true)}
                />
              }
            >
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>

            {/* Standalone Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Public Shared Project Route */}
            <Route
              path="/share/:projectId"
              element={
                <Suspense fallback={<PageLoadingFallback label="Loading Shared Workspace..." />}>
                  <PublicSharedProjectPage />
                </Suspense>
              }
            />

            {/* User Protected Dashboard Routes (Code-Split with Suspense) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={
                  <Suspense fallback={<PageLoadingFallback label="Loading Dashboard Overview..." />}>
                    <DashboardOverviewPage />
                  </Suspense>
                }
              />
              <Route
                path="projects"
                element={
                  <Suspense fallback={<PageLoadingFallback label="Loading Project Vault..." />}>
                    <ProjectsPage />
                  </Suspense>
                }
              />
              <Route
                path="tools"
                element={
                  <Suspense fallback={<PageLoadingFallback label="Loading Generative AI Suite..." />}>
                    <ToolsHubPage />
                  </Suspense>
                }
              />
              <Route
                path="history"
                element={
                  <Suspense fallback={<PageLoadingFallback label="Loading Generation Archive..." />}>
                    <HistoryPage />
                  </Suspense>
                }
              />
              <Route
                path="profile"
                element={
                  <Suspense fallback={<PageLoadingFallback label="Loading User Profile..." />}>
                    <ProfilePage />
                  </Suspense>
                }
              />
              <Route
                path="settings"
                element={
                  <Suspense fallback={<PageLoadingFallback label="Loading Account Settings..." />}>
                    <SettingsPage />
                  </Suspense>
                }
              />
            </Route>

            {/* Admin Protected Routes (Code-Split with Suspense) */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route
                index
                element={
                  <Suspense fallback={<PageLoadingFallback label="Loading Admin Console..." />}>
                    <AdminOverviewPage />
                  </Suspense>
                }
              />
              <Route
                path="users"
                element={
                  <Suspense fallback={<PageLoadingFallback label="Loading User Directory..." />}>
                    <AdminUsersPage />
                  </Suspense>
                }
              />
              <Route
                path="projects"
                element={
                  <Suspense fallback={<PageLoadingFallback label="Loading Global Workspaces..." />}>
                    <AdminProjectsPage />
                  </Suspense>
                }
              />
              <Route
                path="orders"
                element={
                  <Suspense fallback={<PageLoadingFallback label="Loading Financial Transactions..." />}>
                    <AdminOrdersPage />
                  </Suspense>
                }
              />
              <Route
                path="portfolio"
                element={
                  <Suspense fallback={<PageLoadingFallback label="Loading Portfolio Showcase CMS..." />}>
                    <AdminPortfolioPage />
                  </Suspense>
                }
              />
              <Route
                path="settings"
                element={
                  <Suspense fallback={<PageLoadingFallback label="Loading Platform Config..." />}>
                    <AdminSettingsPage />
                  </Suspense>
                }
              />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Global Modals for public pages */}
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
          />
          <NewProjectModal
            isOpen={isNewProjectOpen}
            onClose={() => setIsNewProjectOpen(false)}
          />
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}
