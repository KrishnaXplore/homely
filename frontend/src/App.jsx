// ============================================
// HOMELY - Main Application Component
// ============================================
// Root component that sets up routing and layout
// ============================================

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

// Context Providers
import { AuthProvider, useAuth, LanguageProvider } from './context';

// Layouts
import { Layout, AuthLayout } from './components/layout';

// Pages
import { 
    HomePage, 
    DashboardPage, 
    LoginPage, 
    SignupPage,
    VerifyOTPPage,
    ForgotPasswordPage,
    ResetPasswordPage,
    RemedyDetailPage,
    AIAssistantPage,
    ProfilePage,
    CreateRemedyPage,
    SettingsPage,
    AdminPanel,
    NotFoundPage,
    AboutPage,
    ContactPage,
    FAQPage,
    PrivacyPage,
    TermsPage,
    CookiesPage,
    CategoriesPage,
    CategoryPage,
    PopularPage,
    LatestPage
} from './pages';

// Common Components
import { LoadingSpinner } from './components/common';

// AI Components
import { FloatingChatWidget } from './components/ai';

// --------------------------------------------
// APP CONTENT - Uses Auth Context
// --------------------------------------------

/**
 * AppContent - Main app content that uses auth context
 * Separated to allow useAuth hook usage
 */
function AppContent() {
    const { user, logout, isLoading } = useAuth();
    
    // Show loading spinner during initial auth check
    if (isLoading) {
        return <LoadingSpinner fullScreen text="Loading..." />;
    }
    
    return (
        <>
            {/* Toast Notifications */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: 'var(--color-bg-card)',
                        color: 'var(--color-text-primary)',
                        border: '1px solid var(--color-border-primary)',
                        borderRadius: '12px',
                        padding: '12px 16px',
                    },
                    success: {
                        iconTheme: {
                            primary: 'var(--color-success)',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: 'var(--color-error)',
                            secondary: '#fff',
                        },
                    },
                }}
            />
            
            {/* Routes with Page Transitions */}
            <AnimatePresence mode="wait">
                <Routes>
                    {/* ===== Auth Routes (Minimal Layout) ===== */}
                    <Route element={<AuthLayout />}>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/verify-otp" element={<VerifyOTPPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                    </Route>
                    
                    {/* ===== Main Routes (Full Layout with Navbar/Footer) ===== */}
                    <Route element={<Layout user={user} onLogout={logout} />}>
                        {/* Public Routes */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/remedy/:id" element={<RemedyDetailPage />} />
                        <Route path="/remedy/:id/edit" element={<CreateRemedyPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/create" element={<CreateRemedyPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/admin" element={<AdminPanel />} />
                        
                        {/* Footer Pages */}
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/faq" element={<FAQPage />} />
                        <Route path="/privacy" element={<PrivacyPage />} />
                        <Route path="/terms" element={<TermsPage />} />
                        <Route path="/cookies" element={<CookiesPage />} />
                        <Route path="/categories" element={<CategoriesPage />} />
                        <Route path="/category/:slug" element={<CategoryPage />} />
                        <Route path="/popular" element={<PopularPage />} />
                        <Route path="/latest" element={<LatestPage />} />
                        
                        {/* 404 Catch-all */}
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>

                    {/* ===== Full-Screen Routes (No Layout) ===== */}
                    <Route path="/ai-assistant" element={<AIAssistantPage />} />
                </Routes>
            </AnimatePresence>

            {/* Floating AI Chat Widget - Available on all pages */}
            <FloatingChatWidget />
        </>
    );
}

// --------------------------------------------
// APP COMPONENT - Root with Providers
// --------------------------------------------

/**
 * App - Root application component
 * Wraps everything with BrowserRouter and AuthProvider
 */
function App() {
    return (
        <BrowserRouter>
            <LanguageProvider>
                <AuthProvider>
                    <AppContent />
                </AuthProvider>
            </LanguageProvider>
        </BrowserRouter>
    );
}

export default App;

