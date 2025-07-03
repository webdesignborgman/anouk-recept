'use client';

import { useState } from 'react';
import { Toast } from '../components/Toast';
import { storage, firestore, auth } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const categories = ['Ontbijt', 'Lunch', 'Diner', 'Tussendoor', 'Extra informatie'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !category || !file) {
      setToastType('error');
      setToastMessage('Vul alle velden in en selecteer een bestand.');
      return;
    }

    if (!user) {
      setToastType('error');
      setToastMessage('Je moet ingelogd zijn om te uploaden.');
      return;
    }

    setLoading(true);

    try {
      const storageRef = ref(storage, `recipes/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const isPdf = file.type.includes('pdf');
      // Robuuste regex: werkt ook als er querystrings aanwezig zijn in downloadURL!
      const thumbUrl = isPdf
        ? downloadURL.replace(/\.pdf(\?.*)?$/, '_thumb.jpg$1')
        : downloadURL;

      await addDoc(collection(firestore, 'recipes'), {
        name,
        category,
        fileUrl: downloadURL,
        fileType: isPdf ? 'pdf' : 'image',
        thumbUrl, // 🔥 hier zit nu ALTIJD de juiste jpg-url
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      setToastType('success');
      setToastMessage('Recept succesvol geüpload ✅');

      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err) {
      console.error('Upload error:', err);
      setToastType('error');
      setToastMessage('Er ging iets mis bij het uploaden ❌');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-md rounded-xl mt-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Upload Nieuw Recept</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Receptnaam</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-orange-500 focus:border-orange-500 text-gray-900"
            placeholder="Bijv. Appeltaart Baked Oats"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Categorie</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-orange-500 focus:border-orange-500 text-gray-900"
          >
            <option value="">Selecteer categorie</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bestand (PDF of afbeelding)
          </label>
          <input
            type="file"
            accept="application/pdf, image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-orange-600 text-white w-full py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
        >
          {loading ? 'Bezig met uploaden...' : 'Recept Uploaden'}
        </button>
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
