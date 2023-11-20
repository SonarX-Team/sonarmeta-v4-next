"use client";

import { useState } from "react";
import { TokenboundClient } from "@tokenbound/sdk";
import { useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { http, createWalletClient, WalletClient, custom } from "viem";
import { polygonMumbai } from "viem/chains";
import toast from "react-hot-toast";

import AppButton from "../ui/AppButton";

import { MARKETPLACE_CONTRACT } from "@/constants";
import marketplaceContractAbi from "@/contracts/sonarmeta/Marketplace.json";

export default function BuyListing({
  tokenId,
  seller,
  basePrice,
  max,
}: {
  tokenId: number;
  seller: `0x${string}`;
  basePrice: number;
  max: number;
}) {
  const [amount, setAmount] = useState<number>(0);

  const { chain } = useNetwork();

  const { config } = usePrepareContractWrite({
    address: MARKETPLACE_CONTRACT,
    abi: marketplaceContractAbi,
    functionName: "buyItem",
    chainId: chain?.id,
    // @ts-ignore
    args: [tokenId, seller, amount], // _from, _to, _tokenId
  });

  const { data: tx, write } = useContractWrite(config);

  const { error, isSuccess, isError, isLoading } = useWaitForTransaction({
    hash: tx?.hash,
  });

  async function buyAction() {}

  return (
    <form action={buyAction} className="flex flex-col gap-4">
      <input
        className="w-full"
        type="range"
        max={max}
        step={1}
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />

      <div className="flex items-center gap-4">
        <div className="w-full">
          <p>{amount}</p>
          <p>{(basePrice * amount).toFixed(4)} ETH</p>
        </div>

        <div className="text-small-regular h-[44px]">
          <AppButton
            text={write ? "Buy" : "Cannot buy"}
            otherPendingStatus={isLoading}
            pendingText={isLoading ? "Writing contract..." : "Buying..."}
            disabled={!write}
            type="submit"
          />
        </div>
      </div>
    </form>
  );
}
