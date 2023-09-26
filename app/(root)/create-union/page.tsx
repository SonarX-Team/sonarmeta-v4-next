import { getCurrentUser } from "@/actions/user.action";
import { redirect } from "next/navigation";

import PostUnion from "@/components/forms/PostUnion";

export default async function page() {
  const { user } = await getCurrentUser();

  if (!user) redirect("/sign-in");

  return (
    <div className="w-full max-w-4xl">
      <h1 className="head-text text-left mb-10">创建新工会</h1>
      <PostUnion userId={user.id} />
    </div>
  );
}
