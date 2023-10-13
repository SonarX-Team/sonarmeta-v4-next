import { redirect } from "next/navigation";

import { fetchUser, getCurrentUser } from "@/actions/user.action";
import EditAccount from "@/components/forms/EditAccount";

export default async function page() {
  const res = await getCurrentUser();
  if (res.status === 401 || !res.user) redirect("/sign-in");

  const userInfo = await fetchUser({ userId: res.user.id, isBasic: true });

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
    <div className="w-full max-w-4xl mt-12 px-6">
      <h1 className="head-text text-left mb-10">Edit account</h1>
      <EditAccount {...userData} />
    </div>
  );
}
