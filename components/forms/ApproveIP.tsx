"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAccount, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";

import { nurtureIP } from "@/actions/ip.action";
import AppButton from "../ui/AppButton";
import { MAIN_CONTRACT } from "@/constants";
import mainContract from "@/contracts/SonarMeta.sol/SonarMeta.json";

export default function ApproveIP({ adminId, IPId, unionId }: { adminId: string; IPId: string; unionId: string }) {
  const path = usePathname();

  const { address: userAddress } = useAccount();

  // 准备调用合约
  const { config } = usePrepareContractWrite({
    address: MAIN_CONTRACT,
    abi: mainContract.abi,
    functionName: "grantToUnion",
    chainId: 534351,
    args: [userAddress, 0, 0, 1000000] as any,
  });

  const { data, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    if (isSuccess) alert(`Approved! The tx hash is: ${data?.hash}`);
  }, [isSuccess]);

  async function approveAction() {
    const { status } = await nurtureIP({ adminId, IPId, unionId, path });

    // 调用合约
    write?.();

    if (status === 200) alert("Approved Successfully");
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
