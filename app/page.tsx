// app/page.tsx (Server Component)
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  // await cookies() omdat het nu een Promise is
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    // redirect gooit intern een speciale redirect-exceptie
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
