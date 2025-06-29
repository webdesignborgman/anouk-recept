"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, loading] = useAuthState(auth);
  const [items, setItems] = useState<{ id: string; title: string; url?: string }[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (loading || !user) return;

    (async () => {
      try {
        // Verkrijg ID-token voor REST-auth
        const idToken = await user.getIdToken();
        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
        const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY!;
        const databaseName = "anouk-recept";
        const url =
          `https://firestore.googleapis.com/v1/projects/${projectId}` +
          `/databases/${databaseName}/documents/items?key=${apiKey}`;

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        const json = await res.json();
        if (json.error) {
          console.error("Firestore REST fetch error:", json.error);
          return;
        }

        // Parse de documenten
        const docs = json.documents || [];
        const parsed = docs.map((doc: any) => {
          const fields = doc.fields;
          return {
            id: doc.name.split("/").pop(),
            title: fields.title.stringValue,
            url: fields.url?.stringValue,
          };
        });
        setItems(parsed);
      } catch (err) {
        console.error("Error fetching items via REST:", err);
      }
    })();
  }, [user, loading]);

  if (loading) {
    return <div className="p-4">Loading…</div>;
  }
  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white p-6 rounded-lg shadow" >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Mijn Items</h1>
        <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Mijn Items</h1>
        <Link href="/dashboard/new">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Nieuw item
          </button>
        </Link>
      </div>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-gray-500">Nog geen items gevonden.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((it) => (
            <li key={it.id}>
              <Link href={`/dashboard/${it.id}`} className="block p-4 bg-gray-100 rounded hover:bg-gray-200 transition">
                {it.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
