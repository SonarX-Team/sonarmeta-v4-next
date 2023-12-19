"use client";

import { useContractRead, useNetwork } from "wagmi";

import { LOCKING_VAULT } from "@/constants";
import lockingVaultContractAbi from "@/contracts/sonarmeta/LockingVault.json";

export default function NodeLockings({
  issuerTokenId,
  inclinedTokenId,
  tbaAddr,
}: {
  issuerTokenId: number;
  inclinedTokenId: number;
  tbaAddr: `0x${string}`;
}) {
  const { chain } = useNetwork();

  const { data: lockingInfo } = useContractRead({
    address: LOCKING_VAULT,
    abi: lockingVaultContractAbi,
    functionName: "getLockingInfo",
    chainId: chain?.id,
    // @ts-ignore
    args: [issuerTokenId, tbaAddr],
  });

  return <div>NodeLockings</div>;
}
