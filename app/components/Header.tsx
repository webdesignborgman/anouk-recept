'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Upload, User, Menu, X, LogOut, Plus } from 'lucide-react';

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

  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-orange-600">
          Anouk's Recipes
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-700 hover:text-orange-600 transition-colors">
            Home
          </Link>
          <Link href="/dashboard" className="text-gray-700 hover:text-orange-600 transition-colors">
            My Recipes
          </Link>
          {user && (
            <Link href="/upload" className="text-gray-700 hover:text-orange-600 transition-colors">
              Upload Recipe
            </Link>
          )}
          {user && (
            <Link href="/profile" className="text-gray-700 hover:text-orange-600 transition-colors">
              Profile
            </Link>
          )}
          {user && (
            <button
              onClick={onSignOut}
              className="text-red-600 hover:text-red-800 transition-colors flex items-center space-x-1"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
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
            href="/"
            className="block py-2 text-gray-700 hover:text-orange-600 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="block py-2 text-gray-700 hover:text-orange-600 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            My Recipes
          </Link>
          <Link
            href="/upload"
            className="block py-2 text-gray-700 hover:text-orange-600 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Upload Recipe
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

              <Link
                href="/profile"
                className="block py-2 text-gray-700 hover:text-orange-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile Settings
              </Link>

              <button
                onClick={() => {
                  onSignOut();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left py-2 text-red-600 hover:text-red-800 transition-colors flex items-center space-x-2"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
