"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContractRead, useNetwork, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";
import { formatEther, parseEther } from "viem";
import toast from "react-hot-toast";

import AppButton from "../ui/AppButton";
import { upsertListing } from "@/actions/listing.action";
import { AUTHORIZATION_CONTRACT, MARKETPLACE_CONTRACT } from "@/constants";
import authorizationContractAbi from "@/contracts/sonarmeta/Authorization.json";
import marketplaceContractAbi from "@/contracts/sonarmeta/Marketplace.json";
import { creationsType } from "@/types/creation.type";

export default function StudioListingItem({
  tokenId,
  title,
  avatar,
  address,
}: creationsType & { address: `0x${string}` }) {
  const path = usePathname();
  const router = useRouter();

  const [basePrice, setBasePrice] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const { chain } = useNetwork();

  const { data: listing } = useContractRead({
    address: MARKETPLACE_CONTRACT,
    abi: marketplaceContractAbi,
    functionName: "getListing",
    chainId: chain?.id,
    // @ts-ignore
    args: [tokenId, address],
  }) as { data: { amount: bigint; basePrice: bigint } };

  const { data: available } = useContractRead({
    address: AUTHORIZATION_CONTRACT,
    abi: authorizationContractAbi,
    functionName: "balanceOf",
    chainId: chain?.id,
    // @ts-ignore
    args: [address, tokenId],
  }) as { data: bigint };

  const { config } = usePrepareContractWrite({
    address: MARKETPLACE_CONTRACT,
    abi: marketplaceContractAbi,
    chainId: chain?.id,
    functionName: "listItem",
    // @ts-ignore
    args: [tokenId, Number(amount), parseEther(basePrice)],
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
            Listed successfully! You can check the tx on{" "}
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
    setAmount(listing.amount.toString());
  }, [listing]);

  async function listAction() {
    toast("You will be prompted to confirm the tx, please check your wallet.", { icon: "✍️" });

    // 校验信息
    if (!basePrice || Number.isNaN(Number(basePrice))) return toast.error("Invalid base price.");
    if (!amount || Number.isNaN(Number(amount))) return toast.error("Invalid amount.");
    if (Number(amount) > Number(available)) return toast.error("Insufficient token amount.");

    try {
      await writeAsync?.();

      const { status } = await upsertListing({ tokenId, seller: address, path });

      if (status === 500) toast.error("Internal server error.");
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
          <p className="leading-none">#{tokenId}</p>
        </div>

        <p className="line-clamp-1">{title}</p>
      </div>

      {/* Available */}
      <div className="table-cell border-b-[1px] border-zinc-300 py-6">{Number(available)}</div>

      {/* Base price */}
      <div className="table-cell border-b-[1px] border-zinc-300 py-6">
        <div className="flex border-[1px] max-w-[120px] bg-transparent border-zinc-300 hover:border-zinc-500 rounded-md duration-200">
          <input
            className="w-full border-none outline-none bg-transparent py-2 mx-4"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            placeholder="Set in $MATIC"
            type="text"
          />
        </div>
      </div>

      {/* Amount to sell */}
      <div className="table-cell border-b-[1px] border-zinc-300 py-6">
        <div className="flex border-[1px] max-w-[120px] bg-transparent border-zinc-300 hover:border-zinc-500 rounded-md duration-200">
          <input
            className="w-full border-none outline-none bg-transparent py-2 mx-4"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Set amount"
            type="text"
          />
        </div>
      </div>

      <form action={listAction} className="table-cell border-b-[1px] border-zinc-300 py-6">
        <AppButton
          text={writeAsync ? "List" : "Cannot list"}
          otherPendingStatus={isLoading}
          pendingText={isLoading ? "Writing contract..." : "Listing..."}
          disabled={!writeAsync}
          type="submit"
        />
      </form>
    </div>
  );
}
