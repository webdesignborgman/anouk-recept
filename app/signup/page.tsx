'use client';

import { auth } from '../../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogIn } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error_) {
      console.error('Google login error:', error_);
      setError('Er ging iets mis met Google login. Probeer het opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-card rounded-xl shadow-soft mt-8 text-center">
      <h1 className="text-3xl font-bold text-primary-foreground mb-4">
        Account aanmaken
      </h1>

      <p className="text-foreground mb-6">
        Wij werken alleen met Google login.<br />
        Geen wachtwoorden, geen gedoe. Gewoon veilig inloggen met je Google account.
      </p>

      {error && <p className="text-destructive mb-4">{error}</p>}

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:bg-primary/90 transition flex items-center justify-center gap-3 disabled:opacity-50"
      >
        <LogIn className="w-5 h-5" />
        <span>{loading ? 'Bezig met inloggen...' : 'Login met Google'}</span>
      </button>

      <p className="text-sm text-muted-foreground mt-6">
        Heb je al een account? Klik op de knop hierboven om verder te gaan.
      </p>
    </div>
  );
}
