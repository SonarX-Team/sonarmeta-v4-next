"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import toast from "react-hot-toast";

import { addMember } from "@/actions/ipdao.action";
import AppButton from "../ui/AppButton";
import ipDaoContractAbi from "@/contracts/sonarmeta/IpDao.json";

export default function AddMember({
  ownerAddr,
  userAddr,
  ipDaoAddr,
}: {
  ownerAddr: `0x${string}`;
  userAddr: `0x${string}`;
  ipDaoAddr: `0x${string}`;
}) {
  const path = usePathname();

  const { chain } = useNetwork();

  const { config } = usePrepareContractWrite({
    address: ipDaoAddr,
    abi: ipDaoContractAbi,
    functionName: "addMember",
    chainId: chain?.id,
    // @ts-ignore
    args: [userAddr],
  });

  const { data: tx, write } = useContractWrite(config);

  const { error, isSuccess, isError, isLoading } = useWaitForTransaction({
    hash: tx?.hash,
  });

  useEffect(() => {
    if (isSuccess)
      toast.custom(
        <div className="w-[300px] bg-light-1 shadow-lg rounded-xl text-body-normal flex items-center gap-3 py-4 px-6">
          <div>😃</div>
          <div>
            Member added successfully! You can check the tx on{" "}
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

    if (isError) toast.error(`Failed with error: ${error?.message}`);
  }, [isSuccess, isError, tx?.hash, error?.message]);

  async function addAction() {
    const { status, message } = await addMember({ userAddr, ownerAddr, ipDaoAddr, path });

    if (status === 200 && message === "Added") {
      toast("You will be prompted to confirm the tx, please check your wallet.", { icon: "✍️" });
      write?.();
    }
  }

  return (
    <form action={addAction} className="text-small-regular leading-none h-[44px]">
      <AppButton
        text={write ? "Add" : "Cannot add"}
        otherPendingStatus={isLoading}
        pendingText={isLoading ? "Writing contract..." : "Adding..."}
        disabled={!write}
        type="submit"
      />
    </form>
  );
}
