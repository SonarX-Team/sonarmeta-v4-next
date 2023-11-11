import { getCurrentUser } from "@/actions/user.action";
import CreateCreation from "@/components/forms/CreateCreation";

export default async function page() {
  const { user } = await getCurrentUser();

  return (
    <div>
      {user ? (
        <CreateCreation address={user.address} />
      ) : (
        <p className="mt-3 text-base-regular text-zinc-400">
          Please find &quot;Connect Wallet&quot; button on the topbar and connect it to continue use SonarMeta.
        </p>
      )}
    </div>
  );
}
