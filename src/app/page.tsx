import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { signOutAction } from "~/server/auth/sign-out";
import { validateRequest } from "~/server/auth/validate-request";

export default async function Home() {
  const { session } = await validateRequest();
  if (!session) redirect("/sign-in");

  return (
    <main>
      <form>
        <Button
          formAction={async () => {
            "use server";
            await signOutAction();
          }}
        >
          Sign Out
        </Button>
      </form>
    </main>
  );
}
