'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Check if the current path is the active route
  const isActiveRoute = (path: string) => {
    return pathname === path;
  };
  
  useEffect(() => {
    // Check for dark mode preference in localStorage or system preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true' || 
      (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setDarkMode(isDarkMode);
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    }
  };
  
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">Voster</span>
            </Link>
            
            {/* Desktop menu */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href="/dashboard"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-16 ${
                  isActiveRoute('/dashboard') 
                    ? 'border-primary-500 text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/upload"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-16 ${
                  isActiveRoute('/upload') 
                    ? 'border-primary-500 text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
                }`}
              >
                Upload Video
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
            >
              {darkMode ? (
                <SunIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <MoonIcon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
            
            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden ml-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/dashboard"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActiveRoute('/dashboard')
                  ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/upload"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActiveRoute('/upload')
                  ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
            >
              Upload Video
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
} 