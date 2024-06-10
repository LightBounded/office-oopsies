import { redirect } from "next/navigation";
import { validateRequest } from "~/server/auth/validate-request";
import { CreateOopsieButton } from "./_components/create-oopsie-button";

export default async function Home() {
  const { session } = await validateRequest();
  if (!session) redirect("/sign-in");

  return (
    <main className="px-8">
      <CreateOopsieButton />
    </main>
  );
}
