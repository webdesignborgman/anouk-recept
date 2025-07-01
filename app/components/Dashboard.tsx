'use client';

import { Plus, Grid3x3, Trash2, Pencil, FileText } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Recipe {
  id: string;
  name: string;
  category: string;
  fileType: 'pdf' | 'image';
  fileUrl: string;
  storagePath?: string;
  createdAt: string;
  userId: string;
  tags?: string[];
}

interface DashboardProps {
  recipes: Recipe[];
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (recipeId: string, storagePath?: string) => void;
}

export const Dashboard = ({ recipes, onEditRecipe, onDeleteRecipe }: DashboardProps) => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white px-4 py-6 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Recipes</h1>
          <p className="text-gray-600">
            {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} stored
          </p>
        </div>
        <Link
          href="/upload"
          className="bg-orange-600 text-white p-3 rounded-full hover:bg-orange-700 transition-colors shadow-lg"
        >
          <Plus size={20} />
        </Link>
      </div>

      {/* Recipe Grid */}
      <div className="p-4 space-y-4">
        {recipes.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Grid3x3 className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes yet</h3>
            <p className="text-gray-600 mb-6">
              Start building your collection by uploading your first recipe
            </p>
            <Link
              href="/upload"
              className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
            >
              Upload Recipe
            </Link>
          </div>
        ) : (
          recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white p-4 rounded-lg shadow border border-gray-100 flex flex-col md:flex-row md:items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                {/* File preview */}
                {recipe.fileType === 'image' ? (
                  <Link href={`/recipes/${recipe.id}`} className="block w-20 h-20 relative">
                    <Image
                      src={recipe.fileUrl}
                      alt={recipe.name}
                      fill
                      className="rounded object-cover"
                    />
                  </Link>
                ) : (
                  <a
                    href={recipe.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <FileText size={32} className="mr-2" />
                    <span>Open PDF</span>
                  </a>
                )}

                {/* Recipe Info */}
                <div>
                  <Link
                    href={`/recipes/${recipe.id}`}
                    className="text-lg font-bold text-orange-600 hover:underline"
                  >
                    {recipe.name}
                  </Link>
                  <p className="text-sm text-gray-500">{recipe.category}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 mt-4 md:mt-0">
                <button
                  onClick={() => onEditRecipe(recipe)}
                  className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-sm"
                >
                  <Pencil size={16} />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => {
                    const confirmDelete = window.confirm(
                      `Weet je zeker dat je "${recipe.name}" wilt verwijderen?`
                    );
                    if (confirmDelete) {
                      onDeleteRecipe(recipe.id, recipe.storagePath);
                    }
                  }}
                  className="text-red-600 hover:text-red-800 flex items-center space-x-1 text-sm"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
