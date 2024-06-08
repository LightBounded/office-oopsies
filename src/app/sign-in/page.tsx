import { Input } from "~/components/ui/input";

export default async function SignInPage() {
  return (
    <main className="grid min-h-screen place-content-center">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" placeholder="Email" />
      </div>
    </main>
  );
}
