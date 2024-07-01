import { api } from "~/trpc/server";

export default async function LeaderboardPage() {
  const users = await api.user.leaderboard();
  return (
    <main className="mx-auto max-w-screen-sm px-8">
      <ol className="list-decimal list-inside">
        {users.map((user) => (
          <li key={user.id}>
            <span className="font-bold">{user.username}</span>:{" "}
            {user.oopsiesCount} {user.oopsiesCount > 1 ? "oopsies" : "oopsie"}
          </li>
        ))}
      </ol>
    </main>
  );
}
