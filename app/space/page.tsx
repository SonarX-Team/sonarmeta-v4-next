import { getCurrentUser } from "@/actions/user.action";
import { notFound, redirect } from "next/navigation";

export default async function page() {
  const { user } = await getCurrentUser();

  if (!user) notFound();
  else redirect(`/space/${user.address}`);
}
