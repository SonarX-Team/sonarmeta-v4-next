import { redirect } from "next/navigation";

import { getCurrentUser } from "@/actions/user.action";
import PostUnion from "@/components/forms/PostUnion";

export default async function page() {
  const { user } = await getCurrentUser();

  if (!user) redirect("/sign-in");

  return (
    <div className="w-full max-w-4xl mt-12 px-6">
      <h1 className="head-text text-left mb-10">Create a new union</h1>
      <PostUnion userId={user.id} />
    </div>
  );
}
