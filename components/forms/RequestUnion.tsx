"use client";

import { useRouter } from "next/navigation";
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

  async function requestAction() {
    if (!userId) return router.push("/sign-in");
    await requestUnion({ userId, unionId, path });
  }

  return (
    <form action={requestAction} className="flex items-start text-small-regular gap-3 leading-none h-[44px]">
      <button className="flex items-center gap-2 border-2 border-rose-400 hover:border-rose-300 text-rose-400 hover:text-rose-300 duration-200 rounded-md px-4 py-2">
        <FontAwesomeIcon className="w-[16px] h-[16px]" icon={faThumbsUp} />
        <p> 9999</p>
      </button>
      {!requested && !joined && <AppButton text="申请加入" pendingText="加载中..." type="submit" />}
      {requested && <AppButton text="申请审核中" disabled={true} />}
      {joined && <AppButton text="已加入" disabled={true} />}
    </form>
  );
}
