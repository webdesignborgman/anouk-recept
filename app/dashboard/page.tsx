'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore, storage } from '../../firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, where, doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import DashboardList, { DashboardItem } from '../components/DashboardList';
import { Toast } from '../components/Toast';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const [user, loadingUser] = useAuthState(auth);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const router = useRouter();

  useEffect(() => {
    if (!loadingUser && !user) {
      router.push('/login');
    }
  }, [loadingUser, user, router]);

  const recipesRef = collection(firestore, 'recipes');
  const userRecipesQuery = user
    ? query(recipesRef, where('userId', '==', user.uid))
    : query(recipesRef, where('userId', '==', '__no_user__'));

  const [recipesSnapshot, loadingRecipes] = useCollection(userRecipesQuery);

  const handleDeleteRecipe = async (recipeId: string, fileUrl: string) => {
    const confirmDelete = window.confirm('Weet je zeker dat je dit recept wilt verwijderen?');
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(firestore, 'recipes', recipeId));

      if (fileUrl.startsWith('https://')) {
        const url = new URL(fileUrl);
        const storagePath = decodeURIComponent(url.pathname.split('/o/')[1].split('?')[0]);
        const fileRef = ref(storage, storagePath);
        await deleteObject(fileRef);
      }

      setToastType('success');
      setToastMessage('Recept succesvol verwijderd ✅');
    } catch (err) {
      console.error('Delete error:', err);
      setToastType('error');
      setToastMessage('Fout bij verwijderen ❌');
    }
  };

  if (loadingUser || loadingRecipes || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  const recipes: DashboardItem[] =
    recipesSnapshot?.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<DashboardItem, 'id'>),
    })) ?? [];

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-3xl mx-auto p-4">
          <div className="mb-5">
            <div className="bg-card rounded-xl shadow-soft border border-border p-6 flex flex-col gap-2">
              <h1 className="text-2xl font-bold mb-2 text-primary-foreground">
                Mijn Recepten
              </h1>
              <p className="text-muted-foreground text-sm">
                Al jouw opgeslagen recepten overzichtelijk op één plek.
              </p>
            </div>
          </div>
          <DashboardList
            items={recipes}
            onDelete={(id, fileUrl) => handleDeleteRecipe(id, fileUrl)}
            onEdit={(recipe) => console.log('Edit:', recipe)}
          />
        </div>
      </div>

      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}
    </>
  );
}
