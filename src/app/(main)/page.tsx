import { validateRequest } from "~/server/auth/validate-request";
import { CreateOopsieButton } from "./_components/create-oopsie-button";
import { OopsiesList } from "./_components/oopsies-list";

export default async function HomePage() {
  const { session } = await validateRequest();

  return (
    <main className="mx-auto max-w-screen-sm px-8">
      {session && <CreateOopsieButton />}
      <OopsiesList />
    </main>
  );
}
