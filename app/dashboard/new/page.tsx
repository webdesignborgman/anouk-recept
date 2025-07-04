'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, storage } from '../../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function NewItemPage() {
  const [title, setTitle] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert('Log eerst in om items op te slaan.');
      return;
    }
    if (!file) {
      alert('Selecteer eerst een bestand!');
      return;
    }

    setSaving(true);
    try {
      // 1) Upload bestand naar Storage
      const storageRef = ref(storage, `pdfs/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      // 2) Verkrijg ID-token voor REST-auth
      const idToken = await user.getIdToken();

      // 3) REST-call naar Firestore
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY!;
      const firestoreUrl =
        `https://firestore.googleapis.com/v1/projects/${projectId}` +
        `/databases/(default)/documents/items?key=${apiKey}`;

      const body = {
        fields: {
          title: { stringValue: title },
          url: { stringValue: url },
          uid: { stringValue: user.uid },
          createdAt: { timestampValue: new Date().toISOString() },
        },
      };

      const res = await fetch(firestoreUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Firestore REST write failed: ${errorText}`);
      }

      router.push('/dashboard');
    } catch (error_) {
      console.error('❌ Error during upload + Firestore write:', error_);
      const message =
        error_ instanceof Error ? error_.message : 'Onbekende fout tijdens opslaan.';
      alert(`Fout tijdens opslaan: ${message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto mt-8 bg-card p-6 rounded-xl shadow-soft"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titel"
        required
        className="w-full p-3 border border-border rounded-xl bg-card text-foreground placeholder:text-muted-foreground focus:outline-primary"
      />

      <input
        type="file"
        accept="application/pdf,image/*,text/plain"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="w-full text-sm text-foreground"
      />

      <button
        type="submit"
        disabled={saving}
        className={`w-full py-3 rounded-xl font-medium transition ${
          saving
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : 'bg-primary text-primary-foreground hover:bg-primary/90'
        }`}
      >
        {saving ? 'Bezig met opslaan…' : 'Opslaan'}
      </button>
    </form>
  );
}
