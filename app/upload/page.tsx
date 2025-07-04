'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const categories = ['Ontbijt', 'Lunch', 'Diner', 'Snack', 'Bakje Geluk', 'Baksels', 'Info & Tips'];

  // Bepaal of de gekozen file een PDF is
  const isPdf =
    (file?.type && file.type.includes('pdf')) ||
    (file?.name && file.name.toLowerCase().endsWith('.pdf'));

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

    // Als het een pdf is, verplicht een thumbnail
    if (isPdf && !thumbFile) {
      setToastType('error');
      setToastMessage('Selecteer een thumbnail voor je PDF.');
      return;
    }

    setLoading(true);

    try {
      // 1. Upload bestand (PDF of image)
      const fileRef = ref(storage, `recipes/${user.uid}/${file.name}`);
      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);

      // 2. Upload thumbnail (alleen bij PDF)
      let thumbUrl = fileUrl;
      if (isPdf && thumbFile) {
        const thumbRef = ref(storage, `recipes/${user.uid}/thumbs/${thumbFile.name}`);
        await uploadBytes(thumbRef, thumbFile);
        thumbUrl = await getDownloadURL(thumbRef);
      }

      // 3. Opslaan in Firestore
      await addDoc(collection(firestore, 'recipes'), {
        name,
        category,
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
            onChange={(e) => {
              const selected = e.target.files?.[0] || null;
              setFile(selected);
              setThumbFile(null); // Reset thumb als je een nieuw bestand kiest
            }}
            className="w-full"
          />
        </div>

        {/* Alleen tonen als er een PDF geselecteerd is */}
        {isPdf && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecteer een thumbnail voor je PDF (JPG/PNG)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbFile(e.target.files?.[0] || null)}
              className="w-full"
            />
            {thumbFile && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(thumbFile)}
                  alt="PDF Thumbnail Preview"
                  className="w-32 h-32 object-cover rounded border mt-1"
                />
              </div>
            )}
          </div>
        )}

        {/* Framer Motion animatie op button */}
        <motion.button
          type="submit"
          disabled={loading}
          className="bg-orange-600 text-white w-full py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center"
          whileTap={{ scale: 0.97 }}
          animate={loading ? { opacity: 0.7, scale: 0.97 } : { opacity: 1, scale: 1 }}
        >
          {loading ? (
            <motion.span
              className="inline-block mr-2"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              {/* Spinner SVG */}
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            </motion.span>
          ) : null}
          {loading ? "Bezig met uploaden..." : "Recept Uploaden"}
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
