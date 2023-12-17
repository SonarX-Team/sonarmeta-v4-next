"use client";

import { useEffect, useMemo, useState } from "react";
import { TokenboundClient } from "@tokenbound/sdk";
import { useContractRead, useNetwork } from "wagmi";
import { WalletClient, createWalletClient, custom, http } from "viem";
import { polygonMumbai } from "viem/chains";

import { CREATION_CONTRACT, LOCKING_VAULT } from "@/constants";
import lockingVaultContractAbi from "@/contracts/sonarmeta/LockingVault.json";

export default function NodeLockings({
  address,
  issuerTokenId,
  inclinedTokenId,
}: {
  address: `0x${string}`;
  issuerTokenId: number;
  inclinedTokenId: number;
}) {
  const [tba, setTba] = useState<`0x${string}`>("0x");
  const [walletClient, setWalletClient] = useState<WalletClient>();

  const { chain } = useNetwork();

  // @ts-ignore
  const tokenboundClient = useMemo(() => new TokenboundClient({ walletClient, chain: polygonMumbai }), [walletClient]);

  const { data: lockingInfo } = useContractRead({
    address: LOCKING_VAULT,
    abi: lockingVaultContractAbi,
    functionName: "getLockingInfo",
    chainId: chain?.id,
    // @ts-ignore
    args: [issuerTokenId, tba],
  });

  // onMounted, when window object is available
  useEffect(() => {
    if (!window) return;

    const wc: WalletClient = createWalletClient({
      account: address,
      chain: polygonMumbai,
      // @ts-ignore
      transport: window.ethereum ? custom(window.ethereum) : http(),
    });

    setWalletClient(wc);
  }, [address]);

  // TBA watcher
  useEffect(() => {
    async function watchTba() {
      const creationTba = tokenboundClient.getAccount({
        tokenContract: CREATION_CONTRACT,
        tokenId: inclinedTokenId.toString(),
      });

      setTba(creationTba);
    }

    watchTba();
  }, [inclinedTokenId, tokenboundClient]);

  return <div>NodeLockings</div>;
}
