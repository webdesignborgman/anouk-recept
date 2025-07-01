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
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    const fetchRecipe = async () => {
      try {
        const docRef = doc(firestore, 'recipes', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setError('Recept niet gevonden.');
          return;
        }

        const data = docSnap.data() as Omit<Recipe, 'id'>;

        // Check of het recept van de ingelogde gebruiker is
        if (data.userId !== user.uid) {
          setError('Geen toegang tot dit recept.');
          return;
        }

        setRecipe({ id: docSnap.id, ...data });
      } catch (err) {
        console.error('Fout bij ophalen recept:', err);
        setError('Er ging iets mis bij het laden van het recept.');
      } finally {
        setFetching(false);
      }
    };

    fetchRecipe();
  }, [id, user, loading, router]);

  if (loading || fetching) {
    return <div className="p-4">Laden...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (!recipe) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-lg">
      {/* ✅ Deze kleur zie je gegarandeerd */}
      <h1 className="text-3xl font-bold mb-2 text-orange-700">{recipe.name}</h1>
      <p className="text-sm text-yellow-500 mb-4">{recipe.category}</p>

      {recipe.fileType === 'image' ? (
        <div className="w-full overflow-hidden rounded border">
          <Image
            src={recipe.fileUrl}
            alt={recipe.name}
            width={800}
            height={600}
            className="w-full h-auto object-contain"
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

      <button
        onClick={() => router.push('/dashboard')}
        className="mt-6 text-gray-500 underline hover:text-gray-700 flex items-center space-x-2"
      >
        <ArrowLeft size={18} />
        <span>Terug naar overzicht</span>
      </button>
    </div>
  );
}
