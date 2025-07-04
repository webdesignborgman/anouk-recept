'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, Menu, X, LogOut, ChevronDown, ChefHat } from 'lucide-react';

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
    <header className="bg-accent shadow-lg border-b border-border sticky top-0 z-50">
      <div className="px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-primary">
          <ChefHat size={28} className="text-primary" />
          <span>Anouk&apos;s recepten</span>
        </Link>

        {/* Mobile: userinfo + hamburger */}
        <div className="flex items-center space-x-3 md:hidden">
          {user ? (
            <div className="flex items-center space-x-2">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border border-border"
                />
              ) : (
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center border border-border">
                  <User size={16} className="text-primary" />
                </div>
              )}
              <span className="text-sm text-foreground max-w-[120px] truncate">
                {user.displayName || user.email}
              </span>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded shadow-sm hover:bg-primary/90 transition-colors"
            >
              Login
            </Link>
          )}

          {/* Hamburger menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-foreground hover:text-primary p-2"
            aria-label="Menu openen"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop/tablet: navigatie en user dropdown helemaal rechts */}
        <div className="hidden md:flex flex-1 items-center justify-end space-x-6">
          <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">
            Mijn recepten
          </Link>
          {user && (
            <Link href="/upload" className="text-foreground hover:text-primary transition-colors">
              Recept uploaden
            </Link>
          )}

          {/* Gebruiker dropdown helemaal rechts */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen((v) => !v)}
                className="flex items-center space-x-2 group focus:outline-none px-3 py-1 rounded-xl hover:bg-card transition shadow-soft"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center border border-border">
                    <User size={16} className="text-primary" />
                  </div>
                )}
                <span className="text-sm text-foreground max-w-[120px] truncate">
                  {user.displayName || user.email}
                </span>
                <ChevronDown size={18} className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""} text-muted-foreground`} />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-card border border-border rounded-xl shadow-lg py-2 z-50 animate-fadeIn">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-foreground hover:bg-accent hover:text-primary transition rounded"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profiel
                  </Link>
                  <button
                    onClick={() => {
                      onSignOut();
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-destructive hover:bg-destructive hover:text-destructive-foreground transition rounded flex items-center space-x-2"
                  >
                    <LogOut size={16} />
                    <span>Uitloggen</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded shadow-sm hover:bg-primary/90 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 border-t border-border px-4 pb-4 space-y-3 bg-background rounded-b-xl shadow-soft">
          <Link
            href="/dashboard"
            className="block py-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Mijn recepten
          </Link>
          <Link
            href="/upload"
            className="block py-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Recept uploaden
          </Link>
          {user && (
            <>
              <Link
                href="/profile"
                className="block py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Profiel
              </Link>
              <button
                onClick={() => {
                  onSignOut();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left py-2 text-destructive hover:bg-destructive hover:text-destructive-foreground transition rounded flex items-center space-x-2"
              >
                <LogOut size={20} />
                <span>Uitloggen</span>
              </button>
            </>
          )}
          {!user && (
            <Link
              href="/login"
              className="block py-2 text-primary hover:bg-primary/10 hover:text-primary-foreground rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
