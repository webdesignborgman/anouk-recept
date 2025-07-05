'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toast } from '../components/Toast';
import { storage, firestore, auth } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { Loader2, ChevronDown } from 'lucide-react';

const categories = [
  'Ontbijt',
  'Lunch',
  'Diner',
  'Snack',
  'Bakje Geluk',
  'Baksels',
  'Info & Tips',
];

// Multi-select dropdown component (herbruikbaar)
function MultiSelectDropdown({
  selected,
  setSelected,
  disabled = false,
  placeholder = "Kies categorieën...",
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
        className={`w-full p-2 border border-border bg-background rounded-xl text-left focus:outline-primary flex flex-wrap min-h-[44px] transition ${
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

export default function UploadPage() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const [name, setName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const isPdf =
    (file?.type && file.type.includes('pdf')) ||
    (file?.name && file.name.toLowerCase().endsWith('.pdf'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || selectedCategories.length === 0 || !file) {
      setToastType('error');
      setToastMessage('Vul alle velden in en selecteer minimaal één categorie.');
      return;
    }

    if (!user) {
      setToastType('error');
      setToastMessage('Je moet ingelogd zijn om te uploaden.');
      return;
    }

    if (isPdf && !thumbFile) {
      setToastType('error');
      setToastMessage('Selecteer een thumbnail voor je PDF.');
      return;
    }

    setLoading(true);

    try {
      const fileRef = ref(storage, `recipes/${user.uid}/${file.name}`);
      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);

      let thumbUrl = fileUrl;
      if (isPdf && thumbFile) {
        const thumbRef = ref(storage, `recipes/${user.uid}/thumbs/${thumbFile.name}`);
        await uploadBytes(thumbRef, thumbFile);
        thumbUrl = await getDownloadURL(thumbRef);
      }

      await addDoc(collection(firestore, 'recipes'), {
        name,
        categories: selectedCategories,
        fileUrl,
        fileType: isPdf ? 'pdf' : 'image',
        thumbUrl,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      setToastType('success');
      setToastMessage('Recept succesvol geüpload ✅');
      setTimeout(() => router.push('/dashboard'), 1000);
    } catch (err) {
      console.error('Upload error:', err);
      setToastType('error');
      setToastMessage('Er ging iets mis bij het uploaden ❌');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-card shadow-soft rounded-xl mt-8">
      <h1 className="text-3xl font-bold text-primary-foreground mb-6">Upload Nieuw Recept</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Receptnaam</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-border rounded-lg p-3 shadow-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-primary"
            placeholder="Bijv. Appeltaart Baked Oats"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Categorieën</label>
          <MultiSelectDropdown
            selected={selectedCategories}
            setSelected={setSelectedCategories}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Bestand (PDF of afbeelding)
          </label>
          <input
            type="file"
            accept="application/pdf, image/*"
            onChange={(e) => {
              const selected = e.target.files?.[0] || null;
              setFile(selected);
              setThumbFile(null);
            }}
            className="w-full text-foreground"
          />
        </div>

        {isPdf && (
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Thumbnail voor je PDF (JPG/PNG)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbFile(e.target.files?.[0] || null)}
              className="w-full text-foreground"
            />
            {thumbFile && (
              <img
                src={URL.createObjectURL(thumbFile)}
                alt="Thumbnail Preview"
                className="w-32 h-32 object-cover rounded-xl border border-border mt-2"
              />
            )}
          </div>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          className="bg-primary text-primary-foreground w-full py-3 rounded-xl shadow-soft font-medium hover:bg-primary/90 transition flex items-center justify-center"
          whileTap={{ scale: 0.97 }}
        >
          {loading ? (
            <Loader2 className="animate-spin mr-2" />
          ) : null}
          {loading ? 'Bezig met uploaden...' : 'Recept Uploaden'}
        </motion.button>
      </form>

      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
