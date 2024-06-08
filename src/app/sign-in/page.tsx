import { validateRequest } from "~/server/auth/validate-request";
import SignIn from "./sign-in";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const { session } = await validateRequest();
  if (session) redirect("/");

  return <SignIn />;
}
