'use client';

import { Trash2, Pencil, FileText, Eye } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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

interface DashboardProps {
  recipes: Recipe[];
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (recipeId: string, fileUrl: string) => void;
}

export const Dashboard = ({ recipes, onEditRecipe, onDeleteRecipe }: DashboardProps) => {
  const router = useRouter();

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('nl-NL');
  };

  const handleViewRecipe = (recipe: Recipe) => {
    if (recipe.fileType === 'pdf') {
      window.open(recipe.fileUrl, '_blank');
    } else {
      router.push(`/recipes/${recipe.id}`);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">My Recipes</h1>

      {recipes.length === 0 ? (
        <p className="text-gray-600">Je hebt nog geen recepten opgeslagen.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-xl shadow hover:shadow-md transition-shadow overflow-hidden flex flex-col"
            >
              {/* Image or PDF icon */}
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                {recipe.fileType === 'image' ? (
                  <Image
                    src={recipe.fileUrl}
                    alt={recipe.name}
                    width={200}
                    height={150}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <FileText size={40} className="text-gray-400" />
                )}
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{recipe.name}</h3>
                <p className="text-sm text-gray-500">{recipe.category}</p>
                <p className="text-xs text-gray-400 mt-1">Geüpload op {formatDate(recipe.createdAt)}</p>

                {/* Actions */}
                <div className="mt-auto pt-4 flex justify-between text-sm">
                  <button
                    onClick={() => handleViewRecipe(recipe)}
                    className="text-orange-600 hover:underline flex items-center space-x-1"
                  >
                    <Eye size={16} />
                    <span>Bekijk</span>
                  </button>

                  <button
                    onClick={() => onEditRecipe(recipe)}
                    className="text-blue-600 hover:underline flex items-center space-x-1"
                  >
                    <Pencil size={16} />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => onDeleteRecipe(recipe.id, recipe.fileUrl)}
                    className="text-red-600 hover:underline flex items-center space-x-1"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
