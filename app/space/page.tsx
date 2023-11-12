import { getCurrentUser } from "@/actions/user.action";
import { redirect } from "next/navigation";

export default async function page() {
  const { user } = await getCurrentUser();

  if (!user) redirect("/notfound");
  else redirect(`/space/${user.address}`);
}
