"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, storage } from "../../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function NewItemPage() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert("Log eerst in om items op te slaan.");
      return;
    }
    if (!file) {
      alert("Selecteer eerst een file!");
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
      const databaseName = "anouk-recept"; // corrected default database name
      const firestoreUrl =
        `https://firestore.googleapis.com/v1/projects/${projectId}` +
        `/databases/${databaseName}/documents/items?key=${apiKey}`;

      const body = {
        fields: {
          title: { stringValue: title },
          url: { stringValue: url },
          uid: { stringValue: user.uid },
          createdAt: { timestampValue: new Date().toISOString() },
        },
      };

      const res = await fetch(firestoreUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Firestore REST write failed: ${errorText}`);
      }

      const json = await res.json();
      console.log("✅ Firestore REST-write succeeded:", json);

      router.push("/dashboard");
    } catch (error: any) {
      console.error("❌ Error during upload + Firestore write:", error);
      alert(`Fout tijdens opslaan: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-8">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titel"
        className="w-full border rounded p-2"
        required
      />

      <input
        type="file"
        accept="application/pdf,image/*,text/plain"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block"
      />

      <button
        type="submit"
        disabled={saving}
        className={`px-4 py-2 text-white rounded transition ${
          saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {saving ? "Bezig met opslaan…" : "Opslaan"}
      </button>
    </form>
  );
}
