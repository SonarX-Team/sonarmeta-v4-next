import { fetchUser, getCurrentUser } from "@/actions/user.action";
import { redirect } from "next/navigation";

import AccountProfile from "@/components/forms/AccountProfile";

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
  };

  return (
    <div className="w-full max-w-4xl mt-12 px-6">
      <h1 className="head-text text-left mb-10">编辑账户信息</h1>
      <AccountProfile {...userData} />
    </div>
  );
}
