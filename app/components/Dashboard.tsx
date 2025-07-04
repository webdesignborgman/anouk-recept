'use client';

import { useState, ChangeEvent } from 'react';
import { Timestamp } from 'firebase/firestore';

export interface DashboardItem {
  id: string;
  name: string;
  category: string;
  fileType: 'pdf' | 'image';
  fileUrl: string;
  createdAt: Timestamp;
  userId: string;
  tags?: string[];
}

interface DashboardProps {
  items: DashboardItem[];
  onDelete: (id: string, fileUrl: string) => void;
  onEdit: (item: DashboardItem) => void;
}

export default function Dashboard({ items, onDelete, onEdit }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

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
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(searchLower) ||
      item.tags?.some((tag) => tag.toLowerCase().includes(searchLower));

    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Zoekveld */}
      <input
        type="text"
        placeholder="Zoeken op naam of tags..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full p-3 mb-4 border border-border rounded-xl shadow-soft bg-card text-foreground placeholder:text-muted-foreground focus:outline-primary"
      />

      {/* Categorie dropdown */}
      {categories.length > 0 && (
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full p-3 mb-4 border border-border rounded-xl shadow-soft bg-card text-foreground focus:outline-primary"
        >
          <option value="">Alle categorieën</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      )}

      {/* Resultaten */}
      {filteredItems.length > 0 ? (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-4 border border-border rounded-xl shadow-soft bg-card"
            >
              <h2 className="text-lg font-semibold text-primary-foreground">
                {item.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                Categorie: {item.category}
              </p>
              {item.tags && (
                <div className="mt-1 text-xs text-muted-foreground">
                  Tags: {item.tags.join(', ')}
                </div>
              )}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => onEdit(item)}
                  className="px-3 py-1 text-sm bg-accent text-primary-foreground rounded-xl hover:bg-secondary transition"
                >
                  Bewerken
                </button>
                <button
                  onClick={() => onDelete(item.id, item.fileUrl)}
                  className="px-3 py-1 text-sm bg-destructive text-card-foreground rounded-xl hover:bg-destructive/90 transition"
                >
                  Verwijderen
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : searchQuery || selectedCategory ? (
        <p className="text-muted-foreground">Geen resultaten gevonden.</p>
      ) : (
        <p className="text-muted-foreground">Je hebt nog geen recepten.</p>
      )}
    </div>
  );
}
