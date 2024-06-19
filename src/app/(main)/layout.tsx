import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { signOutAction } from "~/server/auth/sign-out";
import { validateRequest } from "~/server/auth/validate-request";

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

async function Navbar() {
  const { session } = await validateRequest();

  return (
    <nav className="sticky top-0 z-10 mb-4 flex h-16 justify-between gap-4 border-b border-border/40 px-8 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Link href="/" className="hidden items-center text-xl font-bold sm:flex">
        Office Oopsies
      </Link>
      <MobileMenu />
      <ul className="hidden items-center gap-4 sm:flex">
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
      <div className="my-auto">
        {session ? (
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
        ) : (
          <Link href="/sign-in" passHref>
            <Button>Sign In</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

function MobileMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="my-auto sm:hidden" variant="outline">
          Menu
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="sm:hidden" align="start">
        <DropdownMenuLabel>Where to?</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/">Home</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/leaderboard">Leaderboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
