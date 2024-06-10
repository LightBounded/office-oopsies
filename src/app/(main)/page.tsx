import { redirect } from "next/navigation";
import { validateRequest } from "~/server/auth/validate-request";
import { CreateOopsieButton } from "./_components/create-oopsie-button";
import { OopsiesList } from "./_components/oopsies-list";

export default async function Home() {
  const { session } = await validateRequest();
  if (!session) redirect("/sign-in");

  return (
    <main className="px-8">
      <div className="mx-auto max-w-screen-sm">
        <CreateOopsieButton />
        <OopsiesList />
      </div>
    </main>
  );
}
