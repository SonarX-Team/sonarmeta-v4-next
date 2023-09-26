import { fetchUser, getCurrentUser } from "@/actions/user.action";
import { redirect } from "next/navigation";

import AccountProfile from "@/components/forms/AccountProfile";

export default async function page() {
  const res = await getCurrentUser();
  if (res.status === 401 || !res.user) redirect("/sign-in");

  const userInfo = await fetchUser(res.user.id);
  if (userInfo.onboarded) redirect("/");

  const userData = {
    id: userInfo.id,
    phone: userInfo.phone,
    username: userInfo.username,
    email: userInfo.email ? userInfo.email : "",
    bio: userInfo.bio ? userInfo.bio : "",
    avatar: userInfo.avatar ? userInfo.avatar : "",
  };

  return (
    <div className="basis-full p-10">
      <div className="mb-8">
        <h1 className="head-text">还差一步即可开启...</h1>
        <p className="mt-3 text-base-regular text-zinc-400">请提供一些您的用户信息以便继续使用声呐元~</p>
      </div>

      <AccountProfile {...userData} />
    </div>
  );
}
