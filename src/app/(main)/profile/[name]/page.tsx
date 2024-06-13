export default function ProfilePage({
  params,
}: {
  params: {
    name: string;
  };
}) {
  return (
    <main className="px-6">
      Hello, {params.name}! This page is coming soon!
    </main>
  );
}
