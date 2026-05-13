// ============================================
// HOMELY - Theme Context
// ============================================
// Manages dark/light theme across the application
// Persists preference to localStorage
// Respects system preference as default
// ============================================

import { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS, THEME_OPTIONS } from '../utils/constants';

// --------------------------------------------
// CREATE CONTEXT
// --------------------------------------------

/**
 * ThemeContext - Holds theme state and toggle function
 * undefined default to catch usage outside provider
 */
const ThemeContext = createContext(undefined);

// --------------------------------------------
// THEME PROVIDER COMPONENT
// --------------------------------------------

/**
 * ThemeProvider - Wraps app to provide theme functionality
 * 
 * Features:
 * - Persists theme choice to localStorage
 * - Respects system preference on first visit
 * - Applies 'dark' class to document for Tailwind
 * - Smooth transition between themes
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const ThemeProvider = ({ children }) => {
    // --------------------------------------------
    // STATE INITIALIZATION
    // --------------------------------------------
    
    /**
     * Initialize theme from:
     * 1. localStorage (if user has previously set preference)
     * 2. System preference (if no localStorage value)
     * 3. 'system' as fallback
     */
    const [theme, setTheme] = useState(() => {
        // Check localStorage first
        const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
        
        if (savedTheme && Object.values(THEME_OPTIONS).includes(savedTheme)) {
            return savedTheme;
        }
        
        // Default to system preference
        return THEME_OPTIONS.SYSTEM;
    });
    
    /**
     * resolvedTheme - The actual theme being applied
     * 'system' resolves to either 'light' or 'dark'
     */
    const [resolvedTheme, setResolvedTheme] = useState(THEME_OPTIONS.LIGHT);
    
    // --------------------------------------------
    // EFFECTS
    // --------------------------------------------
    
    /**
     * Effect: Resolve system preference and apply theme
     * 
     * This effect:
     * 1. Determines the actual theme (resolves 'system')
     * 2. Applies/removes 'dark' class on document
     * 3. Saves preference to localStorage
     * 4. Sets up listener for system preference changes
     */
    useEffect(() => {
        // Function to get the resolved theme
        const getResolvedTheme = () => {
            if (theme === THEME_OPTIONS.SYSTEM) {
                // Check system preference using media query
                return window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? THEME_OPTIONS.DARK
                    : THEME_OPTIONS.LIGHT;
            }
            return theme;
        };
        
        // Get and set resolved theme
        const resolved = getResolvedTheme();
        setResolvedTheme(resolved);
        
        // Apply theme to document
        const root = document.documentElement;
        
        if (resolved === THEME_OPTIONS.DARK) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        
        // Save to localStorage
        localStorage.setItem(STORAGE_KEYS.THEME, theme);
        
        // Listen for system preference changes (only matters if theme is 'system')
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleSystemThemeChange = (e) => {
            if (theme === THEME_OPTIONS.SYSTEM) {
                const newResolved = e.matches ? THEME_OPTIONS.DARK : THEME_OPTIONS.LIGHT;
                setResolvedTheme(newResolved);
                
                if (newResolved === THEME_OPTIONS.DARK) {
                    root.classList.add('dark');
                } else {
                    root.classList.remove('dark');
                }
            }
        };
        
        // Add listener for system preference changes
        mediaQuery.addEventListener('change', handleSystemThemeChange);
        
        // Cleanup listener on unmount or theme change
        return () => {
            mediaQuery.removeEventListener('change', handleSystemThemeChange);
        };
    }, [theme]);
    
    // --------------------------------------------
    // THEME FUNCTIONS
    // --------------------------------------------
    
    /**
     * toggleTheme - Cycles through themes: light -> dark -> system -> light
     */
    const toggleTheme = () => {
        setTheme((prevTheme) => {
            switch (prevTheme) {
                case THEME_OPTIONS.LIGHT:
                    return THEME_OPTIONS.DARK;
                case THEME_OPTIONS.DARK:
                    return THEME_OPTIONS.SYSTEM;
                case THEME_OPTIONS.SYSTEM:
                default:
                    return THEME_OPTIONS.LIGHT;
            }
        });
    };
    
    /**
     * setThemeMode - Directly set a specific theme
     * @param {string} newTheme - 'light', 'dark', or 'system'
     */
    const setThemeMode = (newTheme) => {
        if (Object.values(THEME_OPTIONS).includes(newTheme)) {
            setTheme(newTheme);
        }
    };
    
    /**
     * isDark - Convenience boolean for checking if dark mode is active
     */
    const isDark = resolvedTheme === THEME_OPTIONS.DARK;
    
    // --------------------------------------------
    // CONTEXT VALUE
    // --------------------------------------------
    
    /**
     * Context value object
     * Contains all theme-related state and functions
     */
    const value = {
        theme,              // Current theme setting ('light', 'dark', 'system')
        resolvedTheme,      // Actual applied theme ('light' or 'dark')
        isDark,             // Boolean: is dark mode active?
        toggleTheme,        // Function: cycle through themes
        setTheme: setThemeMode,  // Function: set specific theme
    };
    
    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

// --------------------------------------------
// CUSTOM HOOK
// --------------------------------------------

/**
 * useTheme - Custom hook to access theme context
 * 
 * Usage:
 * const { theme, isDark, toggleTheme } = useTheme();
 * 
 * @returns {Object} Theme context value
 * @throws {Error} If used outside ThemeProvider
 */
export const useTheme = () => {
    const context = useContext(ThemeContext);
    
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    
    return context;
};

// Default export for convenience
export default ThemeContext;
