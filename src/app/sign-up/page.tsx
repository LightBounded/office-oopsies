import { validateRequest } from "~/server/auth/validate-request";
import SignUp from "./sign-up";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const { session } = await validateRequest();
  if (session) redirect("/");

  return <SignUp />;
}
