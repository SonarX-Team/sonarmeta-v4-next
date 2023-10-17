import { fetchUser, getCurrentUser } from "@/actions/user.action";
import { redirect } from "next/navigation";

import EditAccount from "@/components/forms/EditAccount";

export default async function page() {
  const res = await getCurrentUser();
  if (res.status === 401 || !res.user) redirect("/sign-in");

  const userInfo = await fetchUser({ userId: res.user.id, isBasic: true });
  if (userInfo.onboarded) redirect("/");

  const userData = {
    _id: String(userInfo._id),
    phone: userInfo.phone,
    username: userInfo.username,
    email: userInfo.email ? userInfo.email : "",
    bio: userInfo.bio ? userInfo.bio : "",
    avatar: userInfo.avatar ? userInfo.avatar : "",
    onboarded: userInfo.onboarded,
  };

  return (
    <div className="basis-full p-10">
      <div className="mb-8">
        <h1 className="head-text">One step away from starting...</h1>
        <p className="mt-3 text-base-regular text-zinc-700">
          Please provide some of your user information to continue using SonarMeta.~
        </p>
      </div>

      <EditAccount {...userData} />
    </div>
  );
}
