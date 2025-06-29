"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

// Interface voor itemgegevens
interface Item {
  uid: string;
  title: string;
  url?: string;
  createdAt: string;
}

export default function ItemDetail({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params
  const { id } = use(params);
  const [user, loading] = useAuthState(auth);
  const [item, setItem] = useState<Item | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    async function loadItem() {
      try {
        // Haal ID-token
        const idToken = await user.getIdToken();
        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
        const databaseName = "anouk-recept"; // jouw database-naam
        const url =
          `https://firestore.googleapis.com/v1/projects/${projectId}` +
          `/databases/${databaseName}/documents/items/${id}`;

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (!res.ok) {
          console.error("REST fetch failed:", await res.text());
          return router.push("/dashboard");
        }

        const json = await res.json();
        const f = json.fields;
        const data: Item = {
          uid: f.uid.stringValue,
          title: f.title.stringValue,
          url: f.url?.stringValue,
          createdAt: f.createdAt.timestampValue,
        };

        // Check uid
        if (data.uid !== user.uid) {
          return router.push("/dashboard");
        }

        setItem(data);
      } catch (err) {
        console.error("Error loading item via REST:", err);
        router.push("/dashboard");
      }
    }

    loadItem();
  }, [loading, user, id, router]);

  if (loading || !item) {
    return <div className="p-4 text-center">Loading…</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">{item.title}</h2>
      {item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition mb-4"
        >
          Open bestand / link
        </a>
      ) : (
        <p className="text-gray-600 mb-4">Er is geen URL opgeslagen.</p>
      )}
      <button
        onClick={() => router.push("/dashboard")}
        className="mt-4 text-gray-500 underline hover:text-gray-700"
      >
        ← Terug naar overzicht
      </button>
    </div>
  );
}
