"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from "wagmi";

import { addMember } from "@/actions/ipdao.action";
import AppButton from "../ui/AppButton";
import { hiddenAddress } from "@/lib/utils";
import ipDaoContractAbi from "@/contracts/sonarmeta/IpDao.json";

export default function AddMember({
  adminAddr,
  userAddr,
  ipDaoAddr,
}: {
  adminAddr: `0x${string}`;
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

  const { data: mintTx, write } = useContractWrite(config);

  const { error, isSuccess, isError, isLoading } = useWaitForTransaction({
    hash: mintTx?.hash,
  });

  useEffect(() => {
    if (isSuccess) alert(`Member added! The tx hash is: ${mintTx?.hash}`);
    if (isError) alert(`Failed with error: ${error?.message}`);
  }, [isSuccess, isError, mintTx?.hash, error?.message]);

  async function addAction() {
    const { status, message } = await addMember({ userAddr, adminAddr, ipDaoAddr, path });

    write?.();

    if (status === 200 && message === "Added") return;
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
