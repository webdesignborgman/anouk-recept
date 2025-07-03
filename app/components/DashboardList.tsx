'use client';

import { useState, ChangeEvent } from 'react';

export interface DashboardItem {
  id: string;
  name: string;
  category: string;
  fileType: 'pdf' | 'image';
  fileUrl: string;
  thumbUrl?: string;
  createdAt: any;
  userId: string;
  tags?: string[];
}

interface DashboardListProps {
  items: DashboardItem[];
  onDelete: (id: string, fileUrl: string) => void;
  onEdit: (item: DashboardItem) => void;
}

export default function DashboardList({
  items,
  onDelete,
  onEdit,
}: DashboardListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const categories = Array.from(
    new Set(items.map((item) => item.category).filter(Boolean))
  );

  const filteredItems = items.filter((item) => {
    const lower = searchQuery.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(lower) ||
      item.tags?.some((tag) => tag.toLowerCase().includes(lower));
    const matchesCategory = selectedCategory
      ? item.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Zoeken op naam of tags..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full p-2 mb-4 border rounded shadow-sm text-black"
      />

      {categories.length > 0 && (
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full p-2 mb-4 border rounded shadow-sm bg-white text-black"
        >
          <option value="">Alle categorieën</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      )}

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => {
            const isPdf = item.fileType === 'pdf';
            const previewUrl = isPdf ? item.thumbUrl || item.fileUrl : item.fileUrl;

            return (
              <div
                key={item.id}
                className="p-4 bg-white rounded-xl shadow-md flex flex-col justify-between"
              >
                {/* Klikbare preview */}
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mb-2 rounded overflow-hidden"
                >
                  <img
                    src={previewUrl}
                    alt={item.name}
                    className="w-full h-32 object-cover rounded bg-orange-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </a>

                {/* Info met klikbare titel */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {item.name}
                    </a>
                  </h2>
                  <p className="text-sm text-gray-500">Categorie: {item.category}</p>
                  {item.tags && (
                    <div className="mt-1 text-xs text-gray-400">
                      Tags: {item.tags.join(', ')}
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="mt-2 flex flex-row lg:flex-col gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
                  >
                    Bewerken
                  </button>
                  <button
                    onClick={() => onDelete(item.id, item.fileUrl)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Verwijderen
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : searchQuery || selectedCategory ? (
        <p className="text-gray-500">Geen resultaten gevonden.</p>
      ) : (
        <p className="text-gray-500">Je hebt nog geen recepten.</p>
      )}
    </div>
  );
}
