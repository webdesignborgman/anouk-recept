"use client";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  if (loading) return <div>Loading…</div>;
  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 bg-white shadow">
        <h1 className="text-xl">Mijn Verzamelplek</h1>
      </header>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
