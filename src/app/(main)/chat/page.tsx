import { validateRequest } from "~/server/auth/validate-request";
import { Chat } from "./chat";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const { user } = await validateRequest();
  if (user == null) redirect("/sign-up");
  return <Chat user={user} />;
}
