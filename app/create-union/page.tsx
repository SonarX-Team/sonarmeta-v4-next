import { redirect } from "next/navigation";

import { getCurrentUser } from "@/actions/user.action";
import PostUnion from "@/components/forms/PostUnion";

export default async function page() {
  const { user } = await getCurrentUser();

  return (
    <div className="w-full max-w-4xl mt-8 px-6">
      <h1 className="head-text text-left mb-10">Create a new union</h1>
      {user ? (
        <PostUnion userId={user.id} />
      ) : (
        <p className="mt-3 text-base-regular text-zinc-400">
          Please find "Connect Wallet" button on the topbar and connect it to continue use SonarMeta.
        </p>
      )}
    </div>
  );
}
