'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore, storage } from '../../firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, where, doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { Dashboard } from '../components/Dashboard';
import { Toast } from '../components/Toast';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Recipe {
  id: string;
  name: string;
  category: string;
  fileType: 'pdf' | 'image';
  fileUrl: string;
  createdAt: any;
  userId: string;
  tags?: string[];
}

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

  const [recipesSnapshot, loadingRecipes, error] = useCollection(userRecipesQuery);

  const handleDeleteRecipe = async (recipeId: string, fileUrl: string) => {
    const confirmDelete = window.confirm('Weet je zeker dat je dit recept wilt verwijderen?');
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(firestore, 'recipes', recipeId));

      if (fileUrl.startsWith('https://')) {
        // Firebase Storage delete vanuit URL
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
    return <div className="p-4">Loading...</div>;
  }

  const recipes: Recipe[] =
    recipesSnapshot?.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Recipe, 'id'>),
    })) ?? [];

  return (
    <>
      <Dashboard
        recipes={recipes}
        onEditRecipe={(recipe) => console.log('Edit:', recipe)}
        onDeleteRecipe={(id, fileUrl) => handleDeleteRecipe(id, fileUrl)}
      />

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
