import { fetchUser, getCurrentUser } from "@/actions/user.action";
import EditAccount from "@/components/forms/EditAccount";

export default async function page() {
  const { user } = await getCurrentUser();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="head-text text-left mb-10">Edit account</h1>
        <p className="mt-3 text-base-regular text-zinc-400">
          Please find &quot;Connect Wallet&quot; button on the topbar and connect it to continue use SonarMeta.
        </p>
      </div>
    );
  }

  const userInfo = await fetchUser({ address: user.address, isBasic: true });

  const userData = {
    address: userInfo.address,
    username: userInfo.username,
    email: userInfo.email ? userInfo.email : "",
    bio: userInfo.bio ? userInfo.bio : "",
    avatar: userInfo.avatar ? userInfo.avatar : "",
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="head-text text-left mb-10">Edit account</h1>
      <EditAccount {...userData} />
    </div>
  );
}
