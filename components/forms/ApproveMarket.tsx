"use client";

import { useEffect } from "react";
import { useContractRead, useNetwork, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";
import toast from "react-hot-toast";

import AppButton from "../ui/AppButton";
import TxToast from "../ui/TxToast";

import { AUTHORIZATION_CONTRACT, MARKETPLACE_CONTRACT } from "@/constants";
import authorizationContractAbi from "@/contracts/sonarmeta/Authorization.json";

export default function ApproveMarket({ address }: { address: `0x${string}` }) {
  const { chain } = useNetwork();

  const { data: isApproved } = useContractRead({
    address: AUTHORIZATION_CONTRACT,
    abi: authorizationContractAbi,
    functionName: "isApprovedForAll",
    chainId: chain?.id,
    // @ts-ignore
    args: [address, MARKETPLACE_CONTRACT],
  }) as { data: boolean };

  const { config: config } = usePrepareContractWrite({
    address: AUTHORIZATION_CONTRACT,
    abi: authorizationContractAbi,
    chainId: chain?.id,
    functionName: "setApprovalForAll",
    // @ts-ignore
    args: [MARKETPLACE_CONTRACT, true],
  });

  const { data: tx, writeAsync } = useContractWrite(config);

  const { error, isSuccess, isError, isLoading } = useWaitForTransaction({
    hash: tx?.hash,
  });

  // Tx receipt watcher
  useEffect(() => {
    if (isSuccess) {
      toast.custom(<TxToast title="Approved successfully!" hash={tx?.hash} />);
      location.reload();
    }

    if (isError) toast.error(`Failed with error: ${error?.message}`);
  }, [isSuccess, isError, tx?.hash, error?.message]);

  async function approveAction() {
    toast("You will be prompted to confirm the tx, please check your wallet.", { icon: "✍️" });

    try {
      await writeAsync?.();
    } catch (error: any) {
      if (error.message.includes("User rejected the request.")) toast.error("You rejected the request in your wallet.");
    }
  }

  return (
    <form action={approveAction} className="h-[50px]">
      <AppButton
        text={
          writeAsync
            ? isApproved
              ? "Already approved for the marketplace"
              : "Approve for the marketplace"
            : "Cannot approve"
        }
        otherPendingStatus={isLoading}
        pendingText={isLoading ? "Writing contract..." : "Approving..."}
        disabled={!writeAsync || isApproved}
        type="submit"
      />
    </form>
  );
}
