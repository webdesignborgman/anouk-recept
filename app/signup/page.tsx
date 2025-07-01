'use client';

import { auth } from '../../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogIn } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Google login error:', err);
      setError('Er ging iets mis met Google login. Probeer opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white shadow-md rounded-xl mt-8 text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Account Aanmaken</h1>

      <p className="text-gray-700 mb-6">
        Wij werken alleen met Google login.  
        Geen wachtwoorden, geen gedoe. Gewoon veilig inloggen met je Google account.
      </p>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center space-x-3"
      >
        <LogIn size={20} />
        <span>{loading ? 'Bezig met inloggen...' : 'Login met Google'}</span>
      </button>

      <p className="text-sm text-gray-500 mt-6">
        Heb je al een account? Klik gewoon op de knop hierboven om verder te gaan.
      </p>
    </div>
  );
}
