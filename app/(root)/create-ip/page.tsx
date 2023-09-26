import { getCurrentUser } from "@/actions/user.action";
import { redirect } from "next/navigation";

import PostIP from "@/components/forms/PostIP";

export default async function page() {
  const { user } = await getCurrentUser();

  if (!user) redirect("/sign-in");

  return (
    <div className="w-full max-w-4xl">
      <h1 className="head-text text-left mb-10">创建新IP</h1>
      <PostIP userId={user.id} />
    </div>
  );
}
