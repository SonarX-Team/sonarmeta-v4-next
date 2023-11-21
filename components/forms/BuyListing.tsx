"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContractRead, useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { formatEther, parseEther } from "viem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import toast from "react-hot-toast";

import AppButton from "../ui/AppButton";

import { MARKETPLACE_CONTRACT } from "@/constants";
import marketplaceContractAbi from "@/contracts/sonarmeta/Marketplace.json";
import { hiddenAddress } from "@/lib/utils";

export default function BuyListing({
  tokenId,
  title,
  avatar,
  seller,
}: {
  tokenId: number;
  title: string;
  avatar: string;
  seller: `0x${string}`;
}) {
  const router = useRouter();

  const [amount, setAmount] = useState<number>(0);
  const [available, setAvailable] = useState<string>("");
  const [basePrice, setBasePrice] = useState<string>("");

  const { chain } = useNetwork();

  const { data: listing } = useContractRead({
    address: MARKETPLACE_CONTRACT,
    abi: marketplaceContractAbi,
    functionName: "getListing",
    chainId: chain?.id,
    // @ts-ignore
    args: [tokenId, seller],
  }) as { data: { amount: bigint; basePrice: bigint } };

  const { config } = usePrepareContractWrite({
    address: MARKETPLACE_CONTRACT,
    abi: marketplaceContractAbi,
    functionName: "buyItem",
    value: parseEther((Number(basePrice) * amount).toString()),
    chainId: chain?.id,
    // @ts-ignore
    args: [tokenId, seller, amount], // _from, _to, _tokenId
  });

  const { data: tx, writeAsync } = useContractWrite(config);

  const { error, isSuccess, isError, isLoading } = useWaitForTransaction({
    hash: tx?.hash,
  });

  useEffect(() => {
    if (isSuccess) {
      toast.custom(
        <div className="w-[300px] bg-light-1 shadow-lg rounded-xl text-body-normal flex items-center gap-3 py-4 px-6">
          <div>😃</div>
          <div>
            Bought successfully! You can check the tx on{" "}
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

  // onMounted
  useEffect(() => {
    if (!listing) return;

    setBasePrice(formatEther(listing.basePrice));
    setAvailable(listing.amount.toString());
  }, [listing]);

  async function buyAction() {
    toast("You will be prompted to confirm the tx, please check your wallet.", { icon: "✍️" });

    try {
      await writeAsync?.();
    } catch (error: any) {
      if (error.message.includes("User rejected the request.")) toast.error("You rejected the request in your wallet.");
    }
  }

  return (
    <div className="table-row">
      {/* Represent for */}
      <div className="table-cell border-b-[1px] border-zinc-300 py-6">
        <div className="flex items-center gap-2 mb-2">
          <img src={avatar} alt="creation-image" className="w-[48px] aspect-[1] rounded-md" />

          <div className="flex items-center gap-1">
            <FontAwesomeIcon className="w-[18px] text-violet-400" icon={faEthereum} />
            <p className="text-body-bold leading-none">#{tokenId}</p>
          </div>
        </div>

        <p className="text-small-regular line-clamp-1">{title}</p>
      </div>

      {/* Seller */}
      <div className="table-cell border-b-[1px] border-zinc-300 py-6">{hiddenAddress(seller)}</div>

      {/* Base price */}
      <div className="table-cell border-b-[1px] border-zinc-300 py-6">{basePrice} MATIC</div>

      {/* Available */}
      <div className="table-cell border-b-[1px] border-zinc-300 py-6">{Number(available)}</div>

      <div className="table-cell border-b-[1px] border-zinc-300 py-6">
        <form action={buyAction} className="flex flex-col gap-4">
          <input
            className="w-full"
            type="range"
            max={available}
            step={1}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />

          <div className="flex items-center gap-4">
            <div className="w-full">
              <p>{amount}</p>
              <p>{(Number(basePrice) * amount).toFixed(4)} MATIC</p>
            </div>

            <div className="text-small-regular h-[44px]">
              <AppButton
                text={writeAsync ? "Buy" : "Cannot buy"}
                otherPendingStatus={isLoading}
                pendingText={isLoading ? "Writing contract..." : "Buying..."}
                disabled={!writeAsync}
                type="submit"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
