'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { auth, firestore } from '../../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

interface Recipe {
  id: string;
  name: string;
  category: string;
  fileType: 'pdf' | 'image';
  fileUrl: string;
  createdAt: Timestamp;
  userId: string;
  tags?: string[];
}

export default function RecipeDetailPage() {
  const { id } = useParams() as { id: string };
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
        const docRef = doc(firestore, 'recipes', id) as any; // Firestore-ref typing
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setError('Recept niet gevonden.');
          return;
        }

        const data = docSnap.data() as Omit<Recipe, 'id'>;

        if (data.userId !== user.uid) {
          setError('Geen toegang tot dit recept.');
          return;
        }

        setRecipe({ id: docSnap.id, ...data });
      } catch (fetchError) {
        console.error(fetchError);
        setError('Er ging iets mis bij het laden van het recept.');
      } finally {
        setFetching(false);
      }
    };

    fetchRecipe();
  }, [id, user, loading, router]);

  if (loading || fetching) {
    return <div className="p-4 text-muted-foreground">Laden...</div>;
  }

  if (error) {
    return <div className="p-4 text-destructive">{error}</div>;
  }

  if (!recipe) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-card p-6 rounded-xl shadow-soft">
      <h1 className="text-3xl font-bold mb-2 text-primary-foreground">{recipe.name}</h1>
      <p className="text-sm text-muted-foreground mb-4">{recipe.category}</p>

      {recipe.fileType === 'image' ? (
        <div className="w-full overflow-hidden rounded-xl border border-border mb-6 relative h-[400px]">
          <Image
            src={recipe.fileUrl}
            alt={recipe.name}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 100vw, 800px"
          />
        </div>
      ) : (
        <a
          href={recipe.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition mb-6"
        >
          Open PDF
        </a>
      )}

      <button
        onClick={() => router.push('/dashboard')}
        className="text-sm text-muted-foreground underline hover:text-foreground flex items-center space-x-2"
      >
        <ArrowLeft size={18} />
        <span>Terug naar overzicht</span>
      </button>
    </div>
  );
}
