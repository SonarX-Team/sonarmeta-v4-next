"use client";

import { usePathname } from "next/navigation";

import { joinUnion } from "@/actions/union.action";
import AppButton from "../ui/AppButton";

export default function ApproveUnion({
  userId, // 待加入工会的用户
  adminId,
  unionId,
}: {
  userId: string;
  adminId: string;
  unionId: string;
}) {
  const path = usePathname();

  async function approveAction() {
    const { status } = await joinUnion({ userId, adminId, unionId, path });

    if (status === 200) alert("Approved Successfully");
  }

  return (
    <form action={approveAction} className="text-small-regular leading-none h-[44px]">
      <AppButton text="Approve" pendingText="Proceeding..." type="submit" />
    </form>
  );
}
