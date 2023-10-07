"use client";

import { nurtureIP } from "@/actions/ip.action";
import AppButton from "../ui/AppButton";

export default function ApproveIP({
  adminId,
  IPId,
  unionId,
  path,
}: {
  adminId: string;
  IPId: string;
  unionId: string;
  path: string;
}) {
  async function approveAction() {
    const { status } = await nurtureIP({ adminId, IPId, unionId, path });

    if (status === 200) alert("批准成功");
  }

  return (
    <form action={approveAction} className="text-small-regular leading-none h-[44px]">
      <AppButton text="批准" pendingText="批准中..." type="submit" />
    </form>
  );
}