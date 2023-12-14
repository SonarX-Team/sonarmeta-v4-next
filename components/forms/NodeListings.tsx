"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { TokenboundClient } from "@tokenbound/sdk";
import { useContractRead, useNetwork } from "wagmi";
import { WalletClient, createWalletClient, encodeFunctionData, custom } from "viem";
import { polygonMumbai } from "viem/chains";
import toast from "react-hot-toast";

import AppButton from "../ui/AppButton";
import TxToast from "../ui/TxToast";
import ListingItem from "@/components/forms/ListingItem";
import SadPlaceholder from "@/components/shared/SadPlaceholder";

import { fetchCreations } from "@/actions/creation.action";
import { creationsType } from "@/types/creation.type";

import { AUTHORIZATION_CONTRACT, CREATION_CONTRACT, MARKETPLACE_CONTRACT } from "@/constants";
import authorizationContractAbi from "@/contracts/sonarmeta/Authorization.json";

export default function NodeListings({ address, tokenId }: { address: `0x${string}`; tokenId: number }) {
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

      toast.custom(<TxToast title="Approved successfully!" hash={txHash} />);

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
        <table className="table-fixed w-full">
          <thead className="text-left">
            <tr className="text-base-bold text-zinc-500">
              <th className="border-b-[1px] border-zinc-300 py-2">Represent for</th>
              <th className="border-b-[1px] border-zinc-300 py-2">Available</th>
              <th className="border-b-[1px] border-zinc-300 py-2">Base price</th>
              <th className="border-b-[1px] border-zinc-300 py-2">Amount</th>
              <th className="border-b-[1px] border-zinc-300 py-2">List</th>
            </tr>
          </thead>
          <tbody>
            {creations.map((creation, index) => (
              <ListingItem key={index} {...creation} userAddr={address} tbaAddr={tba} />
            ))}
          </tbody>
        </table>
      ) : (
        <SadPlaceholder size={300} text="This node has no authorization tokens" />
      )}
    </div>
  );
}
