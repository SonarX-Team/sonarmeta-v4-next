"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TokenboundClient } from "@tokenbound/sdk";
import { useContractRead, useNetwork } from "wagmi";
import { WalletClient, createWalletClient, encodeFunctionData, custom } from "viem";
import { polygonMumbai } from "viem/chains";
import toast from "react-hot-toast";

import AppButton from "../ui/AppButton";
import CreationListingItem from "@/components/forms/CreationListingItem";
import SadPlaceholder from "@/components/shared/SadPlaceholder";

import { fetchCreations } from "@/actions/creation.action";
import { AUTHORIZATION_CONTRACT, CREATION_CONTRACT, MARKETPLACE_CONTRACT } from "@/constants";
import authorizationContractAbi from "@/contracts/sonarmeta/Authorization.json";
import { creationsType } from "@/types/creation.type";

export default function TbaListings({ address, tokenId }: { address: `0x${string}`; tokenId: number }) {
  const router = useRouter();

  const [tba, setTba] = useState<`0x${string}`>("0x");
  const [creations, setCreations] = useState<creationsType[]>([]);
  const [walletClient, setWalletClient] = useState<WalletClient>();

  const { chain } = useNetwork();

  // @ts-ignore
  const tokenboundClient = useMemo(() => new TokenboundClient({ walletClient, chain: polygonMumbai }), [walletClient]);

  const { data: aTokenIds } = useContractRead({
    address: AUTHORIZATION_CONTRACT,
    abi: authorizationContractAbi,
    functionName: "getTokenIds",
    chainId: chain?.id,
    // @ts-ignore
    args: [tba],
  }) as { data: bigint[] };

  const { data: isApproved } = useContractRead({
    address: AUTHORIZATION_CONTRACT,
    abi: authorizationContractAbi,
    functionName: "isApprovedForAll",
    chainId: chain?.id,
    // @ts-ignore
    args: [tba, MARKETPLACE_CONTRACT],
  }) as { data: boolean };

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
        tokenId: tokenId.toString(),
      });

      setTba(creationTba);
    }

    watchTba();
  }, [tokenId, tokenboundClient]);

  useEffect(() => {
    async function getCreations() {
      if (!aTokenIds) return;

      const aids: number[] = aTokenIds.map((tokenId: bigint) => Number(tokenId));

      const { creations: cs } = (await fetchCreations({
        pageNumber: 1,
        pageSize: 20,
        tokenIds: aids,
      })) as { creations: creationsType[] };

      setCreations(cs);
    }

    getCreations();
  }, [aTokenIds]);

  async function approveAction() {
    toast("You will be prompted to confirm the tx, please check your wallet.", { icon: "✍️" });

    const isValidSigner = await tokenboundClient.isValidSigner({
      account: tba,
    });

    if (!isValidSigner) return toast.error("Your account is not the valid signer of your TBA");

    //@ts-ignore
    const functionData = encodeFunctionData({
      abi: authorizationContractAbi,
      functionName: "setApprovalForAll",
      args: [MARKETPLACE_CONTRACT, true],
    });

    try {
      const txHash = await tokenboundClient.execute({
        account: tba,
        to: AUTHORIZATION_CONTRACT,
        // @ts-ignore
        value: 0n,
        data: functionData,
      });

      toast.custom(
        <div className="w-[300px] bg-light-1 shadow-lg rounded-xl text-body-normal flex items-center gap-3 py-4 px-6">
          <div>😃</div>
          <div>
            Approved successfully! You can check the tx on{" "}
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

      router.refresh();
    } catch (error: any) {
      if (error.message.includes("User rejected the request.")) toast.error("You rejected the request in your wallet.");
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <form action={approveAction} className="h-[50px]">
        <AppButton
          text={isApproved ? "Already approved for the marketplace" : "Approve for the marketplace"}
          pendingText="Approving..."
          disabled={isApproved}
        />
      </form>

      {creations.length > 0 ? (
        <div className="table table-fixed w-full">
          <div className="table-header-group">
            <div className="table-row text-base-bold text-zinc-500">
              <div className="table-cell border-b-[1px] border-zinc-300 py-2">Represent for</div>
              <div className="table-cell border-b-[1px] border-zinc-300 py-2">Available</div>
              <div className="table-cell border-b-[1px] border-zinc-300 py-2">Base price</div>
              <div className="table-cell border-b-[1px] border-zinc-300 py-2">Amount</div>
              <div className="table-cell border-b-[1px] border-zinc-300 py-2">List</div>
            </div>
          </div>
          <div className="table-row-group">
            {creations.map((creation, index) => (
              <CreationListingItem key={index} {...creation} userAddr={address} tbaAddr={tba} />
            ))}
          </div>
        </div>
      ) : (
        <SadPlaceholder size={300} text="TBA of this creation has no authorization tokens" />
      )}
    </div>
  );
}
