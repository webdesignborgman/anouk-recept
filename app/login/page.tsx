'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../firebase';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [user, loading] = useAuthState(auth);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  // Redirect als je al ingelogd bent
  useEffect(() => {
    if (loading) return;
    if (user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  const handleGoogleLogin = async () => {
    setError('');
    setLoginLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // router.replace volgt vanzelf door de useEffect hierboven
    } catch (error_) {
      console.error('Google login error:', error_);
      setError('Inloggen mislukt. Probeer het opnieuw.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Laat niks zien als al ingelogd (router.replace gaat supersnel)
  if (user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-accent">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-accent overflow-hidden px-4">
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="z-10 bg-card/95 rounded-xl shadow-soft max-w-md w-full p-8 flex flex-col items-center gap-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="mb-2"
        >
          <KitchenIllustration />
        </motion.div>

        <span className="text-3xl font-bold text-primary-foreground mb-1">
          Anouk’s Recipes
        </span>
        <div className="text-muted-foreground text-center text-lg mb-4">
          Log in met Google om je persoonlijke recepten te bekijken en op te slaan.
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loginLoading}
          className={`flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition text-lg font-medium shadow-soft min-w-[220px] ${
            loginLoading ? 'opacity-80 pointer-events-none' : ''
          }`}
        >
          <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
            {/* Google logo paths */}
          </svg>
          {loginLoading ? (
            <span className="flex items-center gap-2">
              <Spinner />
              Bezig...
            </span>
          ) : (
            <span>Log in met Google</span>
          )}
        </button>

        {error && <div className="text-destructive text-sm mt-2">{error}</div>}
      </motion.div>
    </div>
  );
}

function AnimatedBackground() {
  return (
    <>
      <motion.div
        className="absolute top-4 left-10 w-[22rem] h-[22rem] rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 60% 40%, #cbb5f7 85%, transparent 100%)',
          filter: 'blur(15px)',
          opacity: 0.7,
        }}
        animate={{ y: [0, 70, -30, 0], x: [0, 40, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-4 right-10 w-[17.6rem] h-[17.6rem] rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 40% 60%, #98f7b8 85%, transparent 100%)',
          filter: 'blur(15px)',
          opacity: 0.65,
        }}
        animate={{ y: [0, -60, 30, 0], x: [0, -30, 20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  );
}

function KitchenIllustration() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
      <ellipse cx="48" cy="86" rx="28" ry="5" fill="#e9e6f8" opacity="0.5" />
      <rect x="12" y="28" width="32" height="40" rx="7" fill="#ede8fa" stroke="#cbb5f7" strokeWidth="2.2" />
      <rect x="52" y="28" width="32" height="40" rx="7" fill="#d0f7ec" stroke="#98d7b6" strokeWidth="2.2" />
      <rect x="18" y="34" width="20" height="30" rx="5" fill="#fff" opacity="0.95" />
      <rect x="58" y="34" width="20" height="30" rx="5" fill="#fff" opacity="0.92" />
      <rect x="46" y="28" width="4" height="40" rx="2" fill="#cbb5f7" opacity="0.7" />
      <rect x="63" y="38" width="4" height="18" rx="2" fill="#ffc9cb" />
      <rect x="22" y="40" width="12" height="2.2" rx="1.1" fill="#b8a2e5" opacity="0.35" />
      <rect x="22" y="45" width="10" height="2" rx="1" fill="#b8a2e5" opacity="0.25" />
      <rect x="62" y="40" width="12" height="2.2" rx="1.1" fill="#98d7b6" opacity="0.32" />
      <rect x="62" y="45" width="8" height="2" rx="1" fill="#98d7b6" opacity="0.22" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}
