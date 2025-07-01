'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { auth, firestore } from '../../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

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

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [user, loadingUser] = useAuthState(auth);
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loadingUser && !user) {
      router.push('/login');
    }
  }, [loadingUser, user, router]);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const docRef = doc(firestore, 'recipes', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as Omit<Recipe, 'id'>;
          setRecipe({ id: docSnap.id, ...data });
        } else {
          setError('Recept niet gevonden.');
        }
      } catch (err) {
        console.error('Error loading recipe:', err);
        setError('Er ging iets mis bij het ophalen van het recept.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchRecipe();
    }
  }, [id, user]);

  if (loadingUser || loading) {
    return <div className="p-4 text-center">Loading…</div>;
  }

  if (error || !recipe) {
    return <div className="p-4 text-center text-red-600">{error || 'Recept niet gevonden.'}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-lg">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="text-orange-600 hover:text-orange-800 mb-4 flex items-center space-x-2"
      >
        <ArrowLeft size={18} />
        <span>Terug naar My Recipes</span>
      </button>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-2 text-orange-700">{recipe.name}</h1>
      <p className="text-sm text-gray-500 mb-4">{recipe.category}</p>

      {/* Preview */}
      {recipe.fileType === 'image' ? (
        <div className="overflow-hidden rounded border">
          <Image
            src={recipe.fileUrl}
            alt={recipe.name}
            width={800}
            height={600}
            className="w-full h-auto object-contain"
            style={{ touchAction: 'manipulation' }}
          />
        </div>
      ) : (
        <a
          href={recipe.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Open PDF
        </a>
      )}
    </div>
  );
}
