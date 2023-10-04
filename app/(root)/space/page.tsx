import { getCurrentUser } from "@/actions/user.action";
import { redirect } from "next/navigation";

export default async function page() {
  const res = await getCurrentUser();

  if (res.status === 401 || !res.user) redirect("/sign-in");
  else redirect(`/space/${res.user.id}`);
}
