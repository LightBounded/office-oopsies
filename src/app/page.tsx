import { redirect } from "next/navigation";
import { validateRequest } from "~/server/auth/validate-request";

export default async function Home() {
  const { session } = await validateRequest();
  if (!session) redirect("/sign-in");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white"></main>
  );
}
