"use client";

import { useRouter } from "next/navigation";

import { requestUnion } from "@/actions/union.action";
import AppButton from "../ui/AppButton";

export default function RequestUnion({
  userId,
  unionId,
  path,
  requested,
  joined,
}: {
  userId: string | undefined;
  unionId: string;
  path: string;
  requested: boolean;
  joined: boolean;
}) {
  const router = useRouter();

  async function subscribeAction() {
    if (!userId) return router.push("/sign-in");
    // await subscribeUnion({ userId, unionId, path });
  }

  async function requestAction() {
    if (!userId) return router.push("/sign-in");
    await requestUnion({ userId, unionId, path });
  }

  return (
    <div className="flex items-start text-small-regular gap-3 leading-none h-[44px]">
      <form action={subscribeAction}>
        <AppButton text="+ 关注" pendingText="关注中..." type="submit" />
      </form>

      <form action={requestAction}>
        {!requested && !joined && <AppButton text="申请加入" pendingText="提交中..." type="submit" />}
        {requested && <AppButton text="申请审核中" disabled={true} />}
        {joined && <AppButton text="已加入" disabled={true} />}
      </form>
    </div>
  );
}
