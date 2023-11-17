"use client";

import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

import { applyIpDao, subscribeIpDao } from "@/actions/ipdao.action";
import AppButton from "../ui/AppButton";

export default function RequestIpDao({
  userAddr,
  ipDaoAddr,
  applied,
  joined,
  subscribed,
}: {
  userAddr?: `0x${string}`;
  ipDaoAddr: `0x${string}`;
  applied?: boolean;
  joined?: boolean;
  subscribed?: boolean;
}) {
  const path = usePathname();

  async function applyAction() {
    if (!userAddr) return toast.error("Please connect your wallet and sign in first!");

    const { status, errMsg } = await applyIpDao({ userAddr, ipDaoAddr, path });

    if (status === 200) toast.success("Applied successfully!");
    else if (status === 500) toast.error("Internal server error.");
  }

  async function subscribeAction() {
    if (!userAddr) return toast.error("Please connect your wallet and sign in first!");

    await subscribeIpDao({ userAddr, ipDaoAddr, path });
  }

  return (
    <div className="flex items-start text-small-regular gap-3 leading-none h-[44px]">
      <form action={applyAction}>
        {!applied && !joined && <AppButton text="Apply to join" pendingText="Submitting..." type="submit" />}
        {applied && <AppButton text="Under review" disabled={true} />}
        {joined && <AppButton text="Joined" disabled={true} />}
      </form>

      <form action={subscribeAction}>
        <AppButton text={subscribed ? "- Unsubscribe" : "+ Subscribe"} pendingText="Submitting..." type="submit" />
      </form>
    </div>
  );
}
