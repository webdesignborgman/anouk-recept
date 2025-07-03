"use client";

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebase"; // <-- eventueel pad aanpassen!
import { useState } from "react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    try {
      setError("");
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (e) {
      setError("Inloggen mislukt. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-accent overflow-hidden px-4">
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="z-10 bg-card/95 rounded-2xl shadow-soft max-w-md w-full p-8 flex flex-col items-center gap-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="mb-2"
        >
          <KitchenIllustration />
        </motion.div>
        <span className="text-3xl font-bold text-primary mb-1">
          Anouk’s Recipes
        </span>
        <div className="text-muted-foreground text-center text-lg mb-4">
          Log in met Google om je persoonlijke recepten te bekijken en op te slaan.
        </div>
        <button
          onClick={handleGoogleLogin}
          className={`flex items-center justify-center gap-3 px-6 py-4 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition text-lg font-medium shadow-soft min-w-[220px] ${
            loading ? "opacity-80 pointer-events-none" : ""
          }`}
          disabled={loading}
        >
          <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
            <g>
              <path fill="#4285F4" d="M43.6 20.5h-1.8V20H24v8h11.2c-1.6 4-5.4 7-10.2 7-6.1 0-11-4.9-11-11s4.9-11 11-11c2.3 0 4.5.7 6.3 2l6.2-6.2C33.5 7.2 29 5.2 24 5.2 13.9 5.2 5.2 13.9 5.2 24S13.9 42.8 24 42.8c9.2 0 17.3-6.5 18.5-15.3.1-.5.2-1 .2-1.5 0-1-.1-2-.3-2.9z"/>
              <path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.3 16.1 18.8 13 24 13c2.3 0 4.5.7 6.3 2l6.2-6.2C33.5 7.2 29 5.2 24 5.2c-6.8 0-12.7 4-15.7 9.5z"/>
              <path fill="#FBBC05" d="M24 43.8c4.9 0 9.5-1.7 13-4.6l-6-4.9c-1.8 1.3-4 2-6.3 2-4.8 0-8.8-3.1-10.3-7.3l-6.5 5c3 5.5 8.9 9.5 15.8 9.5z"/>
              <path fill="#EA4335" d="M43.6 20.5h-1.8V20H24v8h11.2c-0.7 1.9-2.1 3.5-3.7 4.6h.1l6 4.9c1.7-1.5 3-3.7 3.8-6.2.5-1.4.8-2.9.8-4.4 0-.7-.1-1.4-.2-2.1z"/>
            </g>
          </svg>
          {loading ? (
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

// Animated pastel blobs (20% kleiner!)
function AnimatedBackground() {
  return (
    <>
      <motion.div
        className="absolute top-4 left-10 w-[22rem] h-[22rem] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at 60% 40%, #cbb5f7 85%, transparent 100%)",
          filter: "blur(15px)",
          opacity: 0.7,
        }}
        animate={{ y: [0, 70, -30, 0], x: [0, 40, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-4 right-10 w-[17.6rem] h-[17.6rem] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at 40% 60%, #98f7b8 85%, transparent 100%)",
          filter: "blur(15px)",
          opacity: 0.65,
        }}
        animate={{ y: [0, -60, 30, 0], x: [0, -30, 20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

function KitchenIllustration() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
      {/* Zachte schaduw */}
      <ellipse cx="48" cy="86" rx="28" ry="5" fill="#e9e6f8" opacity="0.5"/>
      {/* Boek cover links */}
      <rect x="12" y="28" width="32" height="40" rx="7" fill="#ede8fa" stroke="#cbb5f7" strokeWidth="2.2"/>
      {/* Boek cover rechts */}
      <rect x="52" y="28" width="32" height="40" rx="7" fill="#d0f7ec" stroke="#98d7b6" strokeWidth="2.2"/>
      {/* Pagina links */}
      <rect x="18" y="34" width="20" height="30" rx="5" fill="#fff" opacity="0.95"/>
      {/* Pagina rechts */}
      <rect x="58" y="34" width="20" height="30" rx="5" fill="#fff" opacity="0.92"/>
      {/* Middennaad */}
      <rect x="46" y="28" width="4" height="40" rx="2" fill="#cbb5f7" opacity="0.7"/>
      {/* Bladwijzer */}
      <rect x="63" y="38" width="4" height="18" rx="2" fill="#ffc9cb"/>
      {/* Accents (lijntjes op de pagina's) */}
      <rect x="22" y="40" width="12" height="2.2" rx="1.1" fill="#b8a2e5" opacity="0.35"/>
      <rect x="22" y="45" width="10" height="2" rx="1" fill="#b8a2e5" opacity="0.25"/>
      <rect x="62" y="40" width="12" height="2.2" rx="1.1" fill="#98d7b6" opacity="0.32"/>
      <rect x="62" y="45" width="8" height="2" rx="1" fill="#98d7b6" opacity="0.22"/>
    </svg>
  );
}



// Spinner
function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-primary-foreground"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}
