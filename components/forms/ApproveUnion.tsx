"use client";

import { useRouter } from "next/navigation";

import { joinUnion } from "@/actions/union.action";
import AppButton from "../ui/AppButton";

export default function ApproveUnion({
  userId,
  unionId,
  path,
}: {
  userId: string | undefined;
  unionId: string;
  path: string;
}) {
  const router = useRouter();

  async function approveAction() {
    if (!userId) return router.push("/sign-in");
    await joinUnion({ userId, unionId, path });
  }

  return (
    <form action={approveAction} className="text-small-regular leading-none h-[44px]">
      <AppButton text="批准" pendingText="批准中..." type="submit" />
    </form>
  );
}
