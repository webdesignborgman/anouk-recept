'use client';

import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import { Upload, FileText, Image, Search, ArrowRight, LogIn, UserPlus } from 'lucide-react';

export default function HomePage() {
  const [user] = useAuthState(auth);

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 min-h-screen px-4 py-8">
      <div className="max-w-md mx-auto text-center pt-8">
        {/* Hero Heading */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
          Your Personal
          <span className="text-orange-600 block">Recipe Collection</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Store and organize all your favorite recipes. Upload photos and PDFs to build your digital cookbook.
        </p>

        {/* CTA Buttons */}
        <div className="space-y-4 mb-12">
          {user ? (
            <Link
              href="/dashboard"
              className="w-full bg-orange-600 text-white px-6 py-4 rounded-xl text-lg font-semibold hover:bg-orange-700 transition-colors shadow-lg flex items-center justify-center space-x-2"
            >
              <span>Go to My Recipes</span>
              <ArrowRight size={20} />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="w-full bg-orange-600 text-white px-6 py-4 rounded-xl text-lg font-semibold hover:bg-orange-700 transition-colors shadow-lg flex items-center justify-center space-x-2"
              >
                <LogIn size={20} />
                <span>Login</span>
              </Link>
              <Link
                href="/signup"
                className="w-full border-2 border-orange-600 text-orange-600 px-6 py-4 rounded-xl text-lg font-semibold hover:bg-orange-600 hover:text-white transition-colors flex items-center justify-center space-x-2"
              >
                <UserPlus size={20} />
                <span>Create Account</span>
              </Link>
            </>
          )}
        </div>

        {/* Feature Highlights */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-orange-600" size={20} />
            </div>
            <h3 className="text-lg font-semibold mb-2">PDF Storage</h3>
            <p className="text-gray-600 text-sm">Upload recipe PDFs and access them anywhere</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Image className="text-orange-600" size={20} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Photo Upload</h3>
            <p className="text-gray-600 text-sm">Snap photos of recipe cards and cookbook pages</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-orange-600" size={20} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Easy Search</h3>
            <p className="text-gray-600 text-sm">Find any recipe quickly with smart search</p>
          </div>
        </div>
      </div>
    </div>
  );
}
