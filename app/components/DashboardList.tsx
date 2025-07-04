'use client';

import { useState, useRef, useEffect, ChangeEvent } from 'react';
import Image from 'next/image';
import { Button } from '../components/ui/button';
import { Pencil, Trash2, X, Check, Loader, ChevronDown } from 'lucide-react';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { Toast } from './Toast';

export interface DashboardItem {
  id: string;
  name: string;
  categories: string[];
  fileType: 'pdf' | 'image';
  fileUrl: string;
  thumbUrl?: string;
  createdAt: Timestamp;
  userId: string;
  tags?: string[];
}

interface DashboardListProps {
  items: DashboardItem[];
  onDelete: (id: string, fileUrl: string) => void;
  onEdit?: (item: DashboardItem) => void;
}

const categories = [
  'Ontbijt',
  'Lunch',
  'Diner',
  'Snack',
  'Bakje Geluk',
  'Baksels',
  'Info & Tips',
];

// Multi-select dropdown (herbruikbaar)
function MultiSelectDropdown({
  selected,
  setSelected,
  disabled = false,
  placeholder = 'Kies categorieën...',
}: {
  selected: string[];
  setSelected: (cats: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={`w-full p-2 border border-border bg-card rounded-xl text-left focus:outline-primary flex flex-wrap min-h-[44px] transition ${
          open ? 'ring-2 ring-primary' : ''
        }`}
      >
        {selected.length === 0 ? (
          <span className="text-muted-foreground">{placeholder}</span>
        ) : (
          <>
            {selected.map((cat) => (
              <span
                key={cat}
                className="bg-primary/10 text-primary-foreground px-2 py-1 mr-2 mb-1 rounded-lg text-xs font-medium"
              >
                {cat}
              </span>
            ))}
          </>
        )}
        <ChevronDown className="ml-auto text-muted-foreground" size={18} />
      </button>
      {open && (
        <div className="absolute z-20 bg-card border border-border rounded-xl mt-2 w-full shadow-soft max-h-60 overflow-auto">
          {categories.map((cat) => (
            <label
              key={cat}
              className="flex items-center px-4 py-2 cursor-pointer hover:bg-accent transition"
            >
              <input
                type="checkbox"
                checked={selected.includes(cat)}
                onChange={() => {
                  setSelected(
                    selected.includes(cat)
                      ? selected.filter((c) => c !== cat)
                      : [...selected, cat]
                  );
                }}
                className="mr-2 accent-primary"
                disabled={disabled}
              />
              <span className="text-foreground">{cat}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardList({
  items,
  onDelete,
}: DashboardListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ name: string; categories: string[] }>({
    name: '',
    categories: [],
  });
  const [loadingSave, setLoadingSave] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Filtering logica
  const filteredItems = items.filter((item) => {
    const lower = searchQuery.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(lower) ||
      item.tags?.some((tag) => tag.toLowerCase().includes(lower));
    const matchesCategory =
      selectedCategories.length === 0
        ? true
        : (Array.isArray(item.categories) ? item.categories : []).some((cat) =>
            selectedCategories.includes(cat)
          );
    return matchesSearch && matchesCategory;
  });

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Edit handlers
  const handleEditClick = (item: DashboardItem) => {
    setEditingId(item.id);
    setEditValues({ name: item.name, categories: item.categories ?? [] });
  };

  const handleEditNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditValues((prev) => ({ ...prev, name: e.target.value }));
  };

  const handleEditCategories = (cats: string[]) => {
    setEditValues((prev) => ({
      ...prev,
      categories: cats,
    }));
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
        categories: editValues.categories,
      });
      setToast({ message: 'Recept bijgewerkt ✅', type: 'success' });
      setEditingId(null);
    } catch {
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
        className="w-full p-3 mb-4 border border-border rounded-xl shadow-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-primary"
      />

      {/* Multi-select filtering: dropdown */}
      <div className="mb-4 max-w-xs">
        <MultiSelectDropdown
          selected={selectedCategories}
          setSelected={setSelectedCategories}
          disabled={false}
        />
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => {
            const isEditing = editingId === item.id;
            const isPdf = item.fileType === 'pdf';
            const previewUrl = isPdf ? item.thumbUrl || item.fileUrl : item.fileUrl;

            return (
              <div
                key={item.id}
                className="p-4 bg-card rounded-xl shadow-soft flex flex-col justify-between border border-border"
              >
                {/* Klikbare preview */}
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mb-2 rounded-xl overflow-hidden bg-accent"
                >
                  <div className="relative w-full h-32">
                    <Image
                      src={previewUrl}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover rounded-xl"
                      onError={({ currentTarget }) => {
                        currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </a>

                {/* Info of edit-form */}
                {!isEditing ? (
                  <>
                    <div>
                      <h2 className="text-lg font-semibold text-primary-foreground mb-1">
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {item.name}
                        </a>
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Categorieën: {item.categories?.length ? item.categories.join(', ') : '-'}
                      </p>
                      {item.tags && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          Tags: {item.tags.join(', ')}
                        </div>
                      )}
                    </div>
                    {/* Icon Buttons */}
                    <div className="mt-2 flex justify-end gap-2">
                      <Button
                        type="button"
                        aria-label="Bewerken"
                        className="p-2 rounded-full bg-accent text-primary hover:bg-primary/10 shadow border border-border transition"
                        onClick={() => handleEditClick(item)}
                      >
                        <Pencil className="w-5 h-5" />
                      </Button>
                      <Button
                        type="button"
                        aria-label="Verwijderen"
                        className="p-2 rounded-full bg-destructive/20 text-destructive hover:bg-destructive/40 shadow border border-destructive/30 transition"
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
                        onChange={handleEditNameChange}
                        className="w-full mb-2 p-2 border border-border rounded-xl text-foreground bg-card placeholder:text-muted-foreground focus:outline-primary"
                        placeholder="Titel"
                        disabled={loadingSave}
                      />
                      {/* Multi-select dropdown voor categorieën */}
                      <MultiSelectDropdown
                        selected={editValues.categories}
                        setSelected={handleEditCategories}
                        disabled={loadingSave}
                      />
                    </div>
                    <div className="mt-2 flex justify-end gap-2">
                      <Button
                        type="button"
                        aria-label="Annuleren"
                        className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-card shadow border border-border transition"
                        onClick={handleEditCancel}
                        disabled={loadingSave}
                      >
                        <X className="w-5 h-5" />
                      </Button>
                      <Button
                        type="button"
                        aria-label="Opslaan"
                        className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow border border-primary transition"
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
      ) : searchQuery || selectedCategories.length ? (
        <p className="text-muted-foreground">Geen resultaten gevonden.</p>
      ) : (
        <p className="text-muted-foreground">Je hebt nog geen recepten.</p>
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
