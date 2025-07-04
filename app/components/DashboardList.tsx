'use client';

import { useState, ChangeEvent } from 'react';
import { Button } from '../components/ui/button';
import { Pencil, Trash2, X, Check, Loader } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { Toast } from './Toast';

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
  onEdit?: (item: DashboardItem) => void;
}

// VASTE CATEGORIEEN:
const categories = [
  'Ontbijt',
  'Lunch',
  'Diner',
  'Snack',
  'Bakje Geluk',
  'Baksels',
  'Info & Tips'
];

export default function DashboardList({
  items,
  onDelete,
}: DashboardListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ name: string; category: string }>({
    name: '',
    category: '',
  });
  const [loadingSave, setLoadingSave] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

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

  const handleEditClick = (item: DashboardItem) => {
    setEditingId(item.id);
    setEditValues({ name: item.name, category: item.category || '' });
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  const handleEditSave = async (item: DashboardItem) => {
    setLoadingSave(true);
    try {
      const ref = doc(firestore, 'recipes', item.id);
      await updateDoc(ref, {
        name: editValues.name,
        category: editValues.category,
      });
      setToast({ message: 'Recept bijgewerkt ✅', type: 'success' });
      setEditingId(null);
    } catch (err) {
      setToast({ message: 'Fout bij opslaan ❌', type: 'error' });
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Zoeken op naam of tags..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full p-2 mb-4 border rounded shadow-sm text-black"
      />

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

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => {
            const isEditing = editingId === item.id;
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

                {/* Info of edit-form */}
                {!isEditing ? (
                  <>
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
                    {/* Icon Buttons */}
                    <div className="mt-2 flex justify-end gap-2">
                      <Button
                        type="button"
                        aria-label="Bewerken"
                        className="p-2 rounded-full bg-orange-100/70 text-orange-600 hover:bg-orange-200 shadow border border-orange-200 transition"
                        onClick={() => handleEditClick(item)}
                      >
                        <Pencil className="w-5 h-5" />
                      </Button>
                      <Button
                        type="button"
                        aria-label="Verwijderen"
                        className="p-2 rounded-full bg-red-100/70 text-red-600 hover:bg-red-200 shadow border border-red-200 transition"
                        onClick={() => onDelete(item.id, item.fileUrl)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={editValues.name}
                        onChange={handleEditChange}
                        className="w-full mb-2 p-2 border rounded text-black"
                        placeholder="Titel"
                        disabled={loadingSave}
                      />
                      <select
                        name="category"
                        value={editValues.category}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded text-black bg-white"
                        disabled={loadingSave}
                      >
                        <option value="">Categorie kiezen...</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-2 flex justify-end gap-2">
                      <Button
                        type="button"
                        aria-label="Annuleren"
                        className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 shadow border transition"
                        onClick={handleEditCancel}
                        disabled={loadingSave}
                      >
                        <X className="w-5 h-5" />
                      </Button>
                      <Button
                        type="button"
                        aria-label="Opslaan"
                        className="p-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200 shadow border transition"
                        onClick={() => handleEditSave(item)}
                        disabled={loadingSave}
                      >
                        {loadingSave ? (
                          <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                          <Check className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      ) : searchQuery || selectedCategory ? (
        <p className="text-gray-500">Geen resultaten gevonden.</p>
      ) : (
        <p className="text-gray-500">Je hebt nog geen recepten.</p>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
