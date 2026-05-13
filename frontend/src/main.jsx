// ============================================
// HOMELY - Application Entry Point
// ============================================
// Main entry point for the React application
// ============================================

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Import global styles with Tailwind CSS
import './styles/index.css';

// Import the main App component
import App from './App.jsx';

// Import Context Providers
import { ThemeProvider } from './context/ThemeContext.jsx';

// --------------------------------------------
// RENDER APPLICATION
// --------------------------------------------

/**
 * Application renders with:
 * - StrictMode for development warnings
 * - ThemeProvider for dark/light mode (wraps everything)
 * - AuthProvider is inside App.jsx (needs Router context)
 */
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </StrictMode>,
);

