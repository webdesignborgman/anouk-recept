'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, Menu, X, LogOut, ChevronDown, Plus, BookOpen, ChefHat } from 'lucide-react';

interface HeaderProps {
  user?: {
    displayName: string | null;
    photoURL: string | null;
    email: string | null;
  } | null;
  onSignOut: () => void;
}

export const Header = ({ user, onSignOut }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      window.addEventListener('mousedown', handleClick);
    }
    return () => window.removeEventListener('mousedown', handleClick);
  }, [isDropdownOpen]);

  return (
    <header className="bg-accent shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-primary">
          {/* Kies het icoon dat je wilt: ChefHat of BookOpen */}
          <ChefHat size={28} className="text-orange-500" />
          {/* <BookOpen size={26} className="text-orange-500" /> */}
          <span>Anouk&apos;s recepten</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/dashboard" className="text-gray-700 hover:text-orange-600 transition-colors">
            Mijn recepten
          </Link>
          {user && (
            <Link href="/upload" className="text-gray-700 hover:text-orange-600 transition-colors">
              Recept uploaden
            </Link>
          )}

          {/* User Dropdown */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen((v) => !v)}
                className="flex items-center space-x-2 group focus:outline-none"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border border-gray-300"
                  />
                ) : (
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <User size={16} className="text-orange-600" />
                  </div>
                )}
                <span className="text-sm text-gray-700">{user.displayName || user.email}</span>
                <ChevronDown size={18} className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""} text-gray-500`} />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profiel
                  </Link>
                  <button
                    onClick={() => {
                      onSignOut();
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 transition flex items-center space-x-2"
                  >
                    <LogOut size={16} />
                    <span>Uitloggen</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <span className="text-sm text-gray-500">Niet ingelogd</span>
          )}
        </nav>

        {/* Mobile Actions */}
        <div className="md:hidden flex items-center space-x-3">
          {user && (
            <Link
              href="/upload"
              className="bg-orange-600 text-white p-2 rounded-full hover:bg-orange-700 transition-colors"
            >
              <Plus size={20} />
            </Link>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 hover:text-orange-600 p-2"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 border-t border-gray-100 px-4 pb-4 space-y-3">
          <Link
            href="/dashboard"
            className="block py-2 text-gray-700 hover:text-orange-600 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Mijn recepten
          </Link>
          <Link
            href="/upload"
            className="block py-2 text-gray-700 hover:text-orange-600 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Recept uploaden
          </Link>

          {user && (
            <>
              <div className="flex items-center space-x-3 py-2">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <User size={20} className="text-orange-600" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">{user.displayName || 'User'}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              {/* Profiel en Uitloggen als submenu */}
              <Link
                href="/profile"
                className="block py-2 text-gray-700 hover:text-orange-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Profiel
              </Link>
              <button
                onClick={() => {
                  onSignOut();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left py-2 text-red-600 hover:text-red-800 transition-colors flex items-center space-x-2"
              >
                <LogOut size={20} />
                <span>Uitloggen</span>
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
