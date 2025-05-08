/**
 * Sidebar.tsx - Navigation Sidebar Component
 * 
 * This component displays the main navigation sidebar with links to different sections
 * of the Bluesky application. It also contains user authentication controls and 
 * the compose post button.
 * 
 * For Rust Backend Integration:
 * - Handles user authentication with the Bluesky API
 * - Provides login/logout functionality
 * - Shows user profile information when logged in
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  MagnifyingGlassIcon, 
  BellIcon, 
  EnvelopeIcon, 
  UserIcon, 
  Cog6ToothIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';
import { invoke } from '../utils/tauri-api';

// Interface for Sidebar props
interface SidebarProps {
  session: string | null;
  setSession: React.Dispatch<React.SetStateAction<string | null>>;
}

// Navigation item interface
interface NavItem {
  name: string;
  icon: React.ReactNode;
  path: string;
}

const Sidebar: React.FC<SidebarProps> = ({ session, setSession }) => {
  const location = useLocation();
  const [loginForm, setLoginForm] = useState({ identifier: '', password: '' });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Navigation items
  const navItems: NavItem[] = [
    { name: 'Home', icon: <HomeIcon className="h-7 w-7" />, path: '/' },
    { name: 'Explore', icon: <MagnifyingGlassIcon className="h-7 w-7" />, path: '/explore' },
    { name: 'Notifications', icon: <BellIcon className="h-7 w-7" />, path: '/notifications' },
    { name: 'Messages', icon: <EnvelopeIcon className="h-7 w-7" />, path: '/messages' },
    { name: 'Profile', icon: <UserIcon className="h-7 w-7" />, path: '/profile' },
    { name: 'Settings', icon: <Cog6ToothIcon className="h-7 w-7" />, path: '/settings' }
  ];
  
  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    
    try {
      const sessionData = await invoke<string>('login', {
        service: 'https://bsky.social',
        identifier: loginForm.identifier,
        password: loginForm.password
      });
      
      setSession(sessionData);
      setIsLoginModalOpen(false);
      setLoginForm({ identifier: '', password: '' });
    } catch (err) {
      console.error('Login failed:', err);
      setLoginError('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  // Handle input changes for login form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle logout
  const handleLogout = () => {
    setSession(null);
  };
  
  return (
    <div className="flex flex-col h-screen p-4 justify-between sticky top-0">
      {/* Logo */}
      <div className="my-4">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-bluesky-500 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
              <path d="M12 3.75a.75.75 0 01.75.75v.75h1.5V4.5a.75.75 0 011.5 0v.75h.75a.75.75 0 010 1.5h-.75v1.5h.75a.75.75 0 010 1.5h-.75v1.5h.75a.75.75 0 010 1.5h-.75v.75a.75.75 0 01-1.5 0v-.75h-1.5v.75a.75.75 0 01-1.5 0v-.75h-.75a.75.75 0 010-1.5h.75v-1.5h-.75a.75.75 0 010-1.5h.75v-1.5h-.75a.75.75 0 010-1.5h.75V4.5a.75.75 0 01.75-.75zM12 9.75h1.5V8.25H12v1.5zm0 3h1.5V11.25H12v1.5zm-1.5-3H9v1.5h1.5v-1.5zm0-3H9v1.5h1.5v-1.5z" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-bluesky-500">Bluesky</span>
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 my-8">
        <ul className="space-y-3">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link 
                to={item.path} 
                className={`
                  flex items-center space-x-4 px-4 py-3 rounded-full transition-colors
                  ${location.pathname === item.path 
                    ? 'font-bold text-bluesky-500 bg-bluesky-50' 
                    : 'text-gray-700 hover:bg-gray-100'}
                `}
              >
                {React.cloneElement(item.icon as React.ReactElement, { 
                  className: `${(item.icon as React.ReactElement).props.className} ${
                    location.pathname === item.path ? 'text-bluesky-500' : ''
                  }`
                })}
                <span className="hidden xl:inline-block">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Post Button */}
      <div className="my-4">
        <button
          className="w-full bg-bluesky-500 hover:bg-bluesky-600 text-white rounded-full p-3 font-bold flex items-center justify-center xl:justify-start space-x-2 transition-colors shadow-md hover:shadow-lg"
        >
          <PencilSquareIcon className="h-6 w-6" />
          <span className="hidden xl:inline">Post</span>
        </button>
      </div>
      
      {/* User Account Section */}
      <div className="mt-auto mb-4">
        {session ? (
          <div
            className="flex items-center justify-between p-3 rounded-full hover:bg-gray-100 cursor-pointer"
            onClick={handleLogout}
          >
            <div className="flex items-center space-x-2">
              <img 
                src="https://i.pravatar.cc/150?img=3" 
                alt="Your Profile" 
                className="h-10 w-10 rounded-full"
              />
              <div className="hidden xl:block">
                <p className="font-bold text-sm">Your Name</p>
                <p className="text-gray-500 text-xs">@yourhandle</p>
              </div>
            </div>
            <button className="text-sm text-red-500 hover:text-red-600 hidden xl:block">
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="w-full bg-bluesky-500 hover:bg-bluesky-600 text-white rounded-full p-3 font-bold transition-colors shadow-md hover:shadow-lg"
          >
            Sign In
          </button>
        )}
      </div>
      
      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Sign in to Bluesky</h3>
              <button 
                onClick={() => setIsLoginModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            {loginError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {loginError}
              </div>
            )}
            
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="identifier">
                  Handle or Email
                </label>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  value={loginForm.identifier}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bluesky-500 focus:border-bluesky-500"
                  placeholder="username.bsky.social"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={loginForm.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bluesky-500 focus:border-bluesky-500"
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-bluesky-500 hover:bg-bluesky-600 text-white py-2 rounded-lg font-bold transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isLoggingIn ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  'Sign In'
                )}
              </button>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                Don't have an account?{' '}
                <a 
                  href="https://bsky.app/create-account"
                  target="_blank"
                  rel="noreferrer"
                  className="text-bluesky-500 hover:underline"
                >
                  Create one on bsky.app
                </a>
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar; 