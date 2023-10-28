import { getCurrentUser } from "@/actions/user.action";
import { redirect } from "next/navigation";

export default async function page() {
  const { user } = await getCurrentUser();

  if (!user) redirect("/sign-in");
  else redirect(`/space/${user.id}`);
}
