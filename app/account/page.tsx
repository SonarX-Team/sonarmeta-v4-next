import { fetchUser, getCurrentUser } from "@/actions/user.action";
import EditAccount from "@/components/forms/EditAccount";

export default async function page() {
  const { user } = await getCurrentUser();

  if (!user) {
    return (
      <div className="w-full max-w-4xl mt-8 px-6">
        <h1 className="head-text text-left mb-10">Edit account</h1>
        <p className="mt-3 text-base-regular text-zinc-400">
          Please find "Connect Wallet" button on the topbar and connect it to continue use SonarMeta.
        </p>
      </div>
    );
  }

  const userInfo = await fetchUser({ userId: user.id, isBasic: true });

  const userData = {
    _id: String(userInfo._id),
    address: userInfo.address,
    username: userInfo.username,
    email: userInfo.email ? userInfo.email : "",
    bio: userInfo.bio ? userInfo.bio : "",
    avatar: userInfo.avatar ? userInfo.avatar : "",
    onboarded: userInfo.onboarded,
  };

  return (
    <div className="w-full max-w-4xl mt-8 px-6">
      <h1 className="head-text text-left mb-10">Edit account</h1>
      <EditAccount {...userData} />
    </div>
  );
}
