'use client';

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import { collection, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { LogOut, User, Loader2 } from 'lucide-react';

interface Recipe {
  id: string;
  name: string;
  category: string;
  fileType: 'image' | 'pdf';
  fileUrl: string;
  createdAt: any;
  userId: string;
}

interface MottoDoc {
  motto?: string;
}

function formatDate(isoOrTimestamp?: any): string {
  if (!isoOrTimestamp) return '';
  let date: Date;
  if (typeof isoOrTimestamp === 'string') {
    date = new Date(isoOrTimestamp);
  } else if (typeof isoOrTimestamp.toDate === 'function') {
    date = isoOrTimestamp.toDate();
  } else {
    date = new Date(isoOrTimestamp);
  }
  return date.toLocaleString('nl-NL', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ProfilePage() {
  const [user, loadingAuth] = useAuthState(auth);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [motto, setMotto] = useState<string>('');
  const [mottoEdit, setMottoEdit] = useState<string>('');
  const [savingMotto, setSavingMotto] = useState(false);
  const [mottoEditMode, setMottoEditMode] = useState(false);
  const [loadingMotto, setLoadingMotto] = useState(true);

  // Statistieken
  const recipeCount = recipes.length;
  const mostUsedCategory =
    recipeCount > 0
      ? Object.entries(
          recipes.reduce<Record<string, number>>((acc, r) => {
            acc[r.category] = (acc[r.category] || 0) + 1;
            return acc;
          }, {})
        )
          .sort((a, b) => b[1] - a[1])[0][0]
      : '-';
  const totalUploads = recipeCount;

  // Motto ophalen
  useEffect(() => {
    if (!user) return;
    setLoadingMotto(true);
    const ref = doc(firestore, 'users', user.uid);
    getDoc(ref).then((snap) => {
      const data = snap.data() as MottoDoc | undefined;
      setMotto(data?.motto || 'Koken is liefde die je proeft!');
      setMottoEdit(data?.motto || '');
      setLoadingMotto(false);
    });
  }, [user]);

  // Recepten ophalen
  useEffect(() => {
    if (!user) return;
    setLoadingRecipes(true);
    const fetch = async () => {
      const q = query(collection(firestore, 'recipes'), where('userId', '==', user.uid));
      const snap = await getDocs(q);
      setRecipes(
        snap.docs.map(
          (docSnap) =>
            ({
              id: docSnap.id,
              ...docSnap.data(),
            } as Recipe)
        )
      );
      setLoadingRecipes(false);
    };
    fetch();
  }, [user]);

  const handleMottoSave = async () => {
    if (!user) return;
    setSavingMotto(true);
    const ref = doc(firestore, 'users', user.uid);
    await setDoc(ref, { motto: mottoEdit }, { merge: true });
    setMotto(mottoEdit);
    setMottoEditMode(false);
    setSavingMotto(false);
  };

  if (loadingAuth)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin w-12 h-12 text-primary" />
      </div>
    );

  if (!user)
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-foreground">Niet ingelogd</h2>
        <Link href="/login" className="bg-primary text-primary-foreground px-4 py-2 rounded-xl shadow hover:bg-primary/90 transition">
          Inloggen
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-8">
      <motion.div
        className="w-full max-w-2xl bg-card rounded-xl shadow-soft p-6 md:p-10 flex flex-col gap-6"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Avatar & naam */}
        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4, type: 'spring', stiffness: 200 }}
        >
          <div className="w-28 h-28 rounded-full shadow-md bg-accent flex items-center justify-center mb-2 border-4 border-background relative overflow-hidden">
            {user.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.photoURL}
                alt={user.displayName || 'Profielfoto'}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={48} className="text-primary" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-foreground">{user.displayName || 'Gebruiker'}</h1>
          <p className="text-muted-foreground text-sm">{user.email}</p>
        </motion.div>

        {/* Grid: statistieken en quote */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Statistieken */}
          <motion.div
            className="flex flex-col gap-3"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <div className="bg-muted rounded-xl shadow-soft px-6 py-4 flex flex-col items-center">
              <span className="text-3xl font-extrabold text-primary">{loadingRecipes ? <Loader2 className="animate-spin" /> : recipeCount}</span>
              <span className="text-muted-foreground text-xs">Recepten opgeslagen</span>
            </div>
            <div className="bg-muted rounded-xl shadow-soft px-6 py-4 flex flex-col items-center">
              <span className="text-lg font-semibold text-foreground">{loadingRecipes ? <Loader2 className="animate-spin" /> : mostUsedCategory}</span>
              <span className="text-muted-foreground text-xs">Meest gebruikt</span>
            </div>
            <div className="bg-muted rounded-xl shadow-soft px-6 py-4 flex flex-col items-center">
              <span className="text-lg font-semibold text-foreground">{loadingRecipes ? <Loader2 className="animate-spin" /> : totalUploads}</span>
              <span className="text-muted-foreground text-xs">Totaal uploads</span>
            </div>
          </motion.div>
          {/* Quote + metadata */}
          <motion.div
            className="flex flex-col gap-4 justify-between"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {/* Motto */}
            <div className="bg-accent rounded-xl p-4 shadow-soft flex flex-col items-center justify-center text-center">
              {loadingMotto ? (
                <Loader2 className="animate-spin mx-auto text-primary" />
              ) : mottoEditMode ? (
                <form
                  className="flex flex-col items-center gap-3 w-full"
                  onSubmit={e => {
                    e.preventDefault();
                    handleMottoSave();
                  }}
                >
                  <input
                    className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground shadow focus:outline-none"
                    value={mottoEdit}
                    onChange={e => setMottoEdit(e.target.value)}
                    maxLength={100}
                    placeholder="Jouw receptenmotto..."
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="px-3 py-1 rounded-xl bg-muted text-muted-foreground hover:bg-card shadow-sm transition"
                      onClick={() => {
                        setMottoEditMode(false);
                        setMottoEdit(motto);
                      }}
                      disabled={savingMotto}
                    >
                      Annuleren
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 rounded-xl bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition"
                      disabled={savingMotto}
                    >
                      {savingMotto ? <Loader2 className="animate-spin w-5 h-5" /> : 'Opslaan'}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <span className="italic text-primary text-lg leading-relaxed">{`"${motto}"`}</span>
                  <button
                    className="mt-2 text-xs text-muted-foreground hover:underline"
                    onClick={() => setMottoEditMode(true)}
                  >
                    Motto aanpassen
                  </button>
                </>
              )}
            </div>
            <div className="flex flex-col items-center gap-1 mt-2">
              <span className="text-xs text-muted-foreground">
                Lid sinds:{' '}
                <span className="font-medium">
                  {formatDate(user.metadata?.creationTime)}
                </span>
              </span>
              <span className="text-xs text-muted-foreground">
                Laatste login:{' '}
                <span className="font-medium">
                  {formatDate(user.metadata?.lastSignInTime)}
                </span>
              </span>
            </div>
          </motion.div>
        </div>

        {/* Acties */}
        <motion.div
          className="flex flex-col md:flex-row gap-3 md:gap-5 justify-end pt-2"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.35 }}
        >
          <Link
            href="/dashboard"
            className="flex-1 md:flex-none text-center bg-muted text-foreground px-4 py-2 rounded-xl shadow-sm border border-border hover:bg-accent transition"
          >
            Terug naar dashboard
          </Link>
          <button
            onClick={() => auth.signOut()}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-destructive text-destructive-foreground px-4 py-2 rounded-xl shadow-sm hover:bg-destructive/90 transition"
          >
            <LogOut size={18} />
            Uitloggen
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
