"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAccount, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";

import { joinUnion } from "@/actions/union.action";
import AppButton from "../ui/AppButton";
import { MAIN_CONTRACT } from "@/constants";
import mainContract from "@/contracts/SonarMeta.sol/SonarMeta.json";

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

  const { address: userAddress } = useAccount();

  // 准备调用合约
  const { config } = usePrepareContractWrite({
    address: MAIN_CONTRACT,
    abi: mainContract.abi,
    functionName: "addMemberToUnion",
    chainId: 534351,
    args: [0, userAddress, 10] as any,
  });

  const { data, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    if (isSuccess) alert(`Approved! The tx hash is: ${data?.hash}`);
  }, [isSuccess]);

  async function approveAction() {
    const { status } = await joinUnion({ userId, adminId, unionId, path });

    // 调用合约
    write?.();

    if (status === 200) return;
  }

  return (
    <form action={approveAction} className="text-small-regular leading-none h-[44px]">
      <AppButton
        text={write ? "Approve" : "Cannot approve"}
        otherPendingStatus={isLoading}
        pendingText={isLoading ? "Calling contract..." : "Proceeding..."}
        disabled={!write}
        type="submit"
      />
    </form>
  );
}
