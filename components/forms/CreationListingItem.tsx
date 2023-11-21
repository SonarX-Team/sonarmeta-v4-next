"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { TokenboundClient } from "@tokenbound/sdk";
import { useContractRead, useNetwork } from "wagmi";
import { parseEther, WalletClient, createWalletClient, encodeFunctionData, custom, formatEther } from "viem";
import { polygonMumbai } from "viem/chains";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import toast from "react-hot-toast";

import AppButton from "../ui/AppButton";
import { upsertListing } from "@/actions/listing.action";
import { AUTHORIZATION_CONTRACT, MARKETPLACE_CONTRACT } from "@/constants";
import authorizationContractAbi from "@/contracts/sonarmeta/Authorization.json";
import marketplaceContractAbi from "@/contracts/sonarmeta/Marketplace.json";
import { creationsType } from "@/types/creation.type";

export default function CreationListingItem({
  tokenId,
  title,
  avatar,
  userAddr,
  tbaAddr,
}: creationsType & { userAddr: `0x${string}`; tbaAddr: `0x${string}` }) {
  const path = usePathname();
  const router = useRouter();

  const [basePrice, setBasePrice] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [walletClient, setWalletClient] = useState<WalletClient>();

  const { chain } = useNetwork();

  // @ts-ignore
  const tokenboundClient = useMemo(() => new TokenboundClient({ walletClient, chain: polygonMumbai }), [walletClient]);

  const { data: listing } = useContractRead({
    address: MARKETPLACE_CONTRACT,
    abi: marketplaceContractAbi,
    functionName: "getListing",
    chainId: chain?.id,
    // @ts-ignore
    args: [tokenId, tbaAddr],
  }) as { data: { amount: bigint; basePrice: bigint } };

  const { data: available } = useContractRead({
    address: AUTHORIZATION_CONTRACT,
    abi: authorizationContractAbi,
    functionName: "balanceOf",
    chainId: chain?.id,
    // @ts-ignore
    args: [tbaAddr, tokenId],
  }) as { data: bigint };

  // onMounted, when window object is available
  useEffect(() => {
    if (!window) return;

    const wc: WalletClient = createWalletClient({
      account: userAddr,
      chain: polygonMumbai,
      // @ts-ignore
      transport: window.ethereum ? custom(window.ethereum) : http(),
    });
    setWalletClient(wc);

    if (!listing) return;

    setBasePrice(formatEther(listing.basePrice));
    setAmount(listing.amount.toString());
  }, [userAddr, listing]);

  async function listAction() {
    const isValidSigner = await tokenboundClient.isValidSigner({
      account: tbaAddr,
    });

    if (!isValidSigner) return toast.error("Your account is not the valid signer of your TBA");

    // 校验信息
    if (!basePrice || Number.isNaN(Number(basePrice))) return toast.error("Invalid base price.");
    if (!amount || Number.isNaN(Number(amount))) return toast.error("Invalid amount.");
    if (Number(amount) > Number(available)) return toast.error("Insufficient token amount.");

    //@ts-ignore
    const functionData = encodeFunctionData({
      abi: marketplaceContractAbi,
      functionName: "listItem",
      args: [tokenId, Number(amount), parseEther(basePrice)],
    });

    try {
      toast("You will be prompted to confirm the tx, please check your wallet.", { icon: "✍️" });

      const txHash = await tokenboundClient.execute({
        account: tbaAddr,
        to: MARKETPLACE_CONTRACT,
        // @ts-ignore
        value: 0n,
        data: functionData,
      });

      toast.custom(
        <div className="w-[300px] bg-light-1 shadow-lg rounded-xl text-body-normal flex items-center gap-3 py-4 px-6">
          <div>😃</div>
          <div>
            Listed successfully! You can check the tx on{" "}
            <Link
              className="text-violet-700 hover:text-violet-600 duration-200"
              href={`https://mumbai.polygonscan.com/tx/${txHash}`}
              target="_blank"
            >
              Polygonscan
            </Link>
          </div>
        </div>
      );

      const { status } = await upsertListing({ tokenId, seller: tbaAddr, path });

      if (status === 500) toast.error("Internal server error.");

      router.refresh();
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
        <AppButton text="List" pendingText="Listing..." />
      </form>
    </div>
  );
}
