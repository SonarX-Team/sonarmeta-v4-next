"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContractRead, useNetwork, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";
import toast from "react-hot-toast";

import AppButton from "../ui/AppButton";
import { AUTHORIZATION_CONTRACT, MARKETPLACE_CONTRACT } from "@/constants";
import authorizationContractAbi from "@/contracts/sonarmeta/Authorization.json";

export default function ApproveMarket({ address }: { address: `0x${string}` }) {
  const router = useRouter();

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

  // Approve watcher
  useEffect(() => {
    if (isSuccess) {
      toast.custom(
        <div className="w-[300px] bg-light-1 shadow-lg rounded-xl text-body-normal flex items-center gap-3 py-4 px-6">
          <div>😃</div>
          <div>
            Approved successfully! You can check the tx on{" "}
            <Link
              className="text-violet-700 hover:text-violet-600 duration-200"
              href={`https://mumbai.polygonscan.com/tx/${tx?.hash}`}
              target="_blank"
            >
              Polygonscan
            </Link>
          </div>
        </div>
      );

      router.refresh();
    }

    if (isError) toast.error(`Failed with error: ${error?.message}`);
  }, [isSuccess, isError, tx?.hash, error?.message, router]);

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
