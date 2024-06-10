import Link from "next/link";
import { Button } from "~/components/ui/button";
import { signOutAction } from "~/server/auth/sign-out";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function Navbar() {
  return (
    <nav className="sticky top-0 mb-4 flex justify-between gap-4 border-b border-border/40 px-8 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Link href="/" className="hidden items-center text-xl font-bold sm:flex">
        Office Oopsies
      </Link>
      <ul className="flex h-16 items-center gap-4">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/leaderboard">Leaderboard</Link>
        </li>
        <li>
          <Link href="/profile">Profile</Link>
        </li>
      </ul>
      <ul className="flex items-center">
        <li>
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
        </li>
      </ul>
    </nav>
  );
}
