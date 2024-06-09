import Link from "next/link";

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
    <nav className="sticky top-0 mb-4 border-b border-border/40  px-8 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <ul className="flex h-14 items-center mx-auto gap-4">
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
    </nav>
  );
}
