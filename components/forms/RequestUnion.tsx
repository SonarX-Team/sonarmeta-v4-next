"use client";

import { usePathname, useRouter } from "next/navigation";

import { requestUnion } from "@/actions/union.action";
import AppButton from "../ui/AppButton";

export default function RequestUnion({
  userId,
  unionId,
  requested,
  joined,
}: {
  userId: string | undefined;
  unionId: string;
  requested: boolean;
  joined: boolean;
}) {
  const router = useRouter();
  const path = usePathname();

  async function subscribeAction() {
    if (!userId) return router.push("/sign-in");
    // await subscribeUnion({ userId, unionId, path });
  }

  async function requestAction() {
    if (!userId) return router.push("/sign-in");

    const { status, message } = await requestUnion({ userId, unionId, path });

    if (status === 400 || status === 401) return alert(message);
    if (status === 200 && message === "Requested") alert("Applied successfully");
  }

  return (
    <div className="flex items-start text-small-regular gap-3 leading-none h-[44px]">
      <form action={subscribeAction}>
        <AppButton text="+ Follow" pendingText="Proceeding..." type="submit" />
      </form>

      <form action={requestAction}>
        {!requested && !joined && <AppButton text="Apply to join" pendingText="Proceeding..." type="submit" />}
        {requested && <AppButton text="Under review" disabled={true} />}
        {joined && <AppButton text="Joined" disabled={true} />}
      </form>
    </div>
  );
}
