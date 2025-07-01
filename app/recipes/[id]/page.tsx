'use client';

import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface Recipe {
  id: string;
  name: string;
  category: string;
  fileType: 'pdf' | 'image';
  fileUrl: string;
  createdAt: string;
  userId: string;
  tags?: string[];
}

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const docRef = doc(firestore, 'recipes', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data()) {
          const data = docSnap.data() as Omit<Recipe, 'id'>;
          setRecipe({ id: docSnap.id, ...data });
        } else {
          setError('Recept niet gevonden.');
        }
      } catch (err) {
        console.error(err);
        setError('Fout bij het ophalen van recept.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return <div className="p-4">Laden...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!recipe) return null;

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="text-orange-600 hover:text-orange-800 mb-4 flex items-center space-x-2"
      >
        <ArrowLeft size={18} />
        <span>Terug naar My Recipes</span>
      </button>

      {/* Recipe Info */}
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{recipe.name}</h1>
      <p className="text-sm text-gray-500 mb-6">{recipe.category}</p>

      {/* File Preview */}
      {recipe.fileType === 'image' ? (
        <div className="w-full overflow-hidden rounded-lg border max-h-[80vh]">
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
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Open PDF
        </a>
      )}
    </div>
  );
}
