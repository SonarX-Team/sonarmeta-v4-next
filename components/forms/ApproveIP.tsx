"use client";

import { usePathname } from "next/navigation";

import { nurtureIP } from "@/actions/ip.action";
import AppButton from "../ui/AppButton";

export default function ApproveIP({ adminId, IPId, unionId }: { adminId: string; IPId: string; unionId: string }) {
  const path = usePathname();

  async function approveAction() {
    const { status } = await nurtureIP({ adminId, IPId, unionId, path });

    if (status === 200) alert("Approved Successfully");
  }

  return (
    <form action={approveAction} className="text-small-regular leading-none h-[44px]">
      <AppButton text="Approve" pendingText="Proceeding..." type="submit" />
    </form>
  );
}
