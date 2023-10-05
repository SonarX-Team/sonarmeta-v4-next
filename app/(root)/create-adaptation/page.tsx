import { redirect } from "next/navigation";

import { getCurrentUser } from "@/actions/user.action";
import PostAdaptation from "@/components/forms/PostAdaptation";

export default async function page() {
  const { user } = await getCurrentUser();

  if (!user) redirect("/sign-in");

  return (
    <div className="w-full max-w-4xl mt-12 px-6">
      <h1 className="head-text text-left mb-10">创建新二创</h1>
      <PostAdaptation userId={user.id} />
    </div>
  );
}
