"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TokenboundClient } from "@tokenbound/sdk";
import { useContractRead, useNetwork, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";
import { http, createWalletClient, WalletClient, custom } from "viem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faWallet } from "@fortawesome/free-solid-svg-icons";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import toast from "react-hot-toast";

import AppButton from "../ui/AppButton";
import TxToast from "../ui/TxToast";

import { CREATION_CONTRACT, MAIN_CONTRACT } from "@/constants";
import mainContractAbi from "@/contracts/sonarmeta/SonarMeta.json";
import creationContractAbi from "@/contracts/sonarmeta/Creation.json";

import { formatDateString, hiddenAddress } from "@/lib/utils";
import { creationsType } from "@/types/creation.type";
import { victionTestnet } from "@/lib/viction";

export default function GiveReward({
  tokenId,
  title,
  description,
  avatar,
  createdAt,
  address,
  issuerTokenId,
}: creationsType & { address: `0x${string}`; issuerTokenId: number }) {
  const router = useRouter();

  const [issuer, setIssuer] = useState<`0x${string}`>("0x");
  const [holder, setHolder] = useState<`0x${string}`>("0x");
  const [amount, setAmount] = useState<string>("1");

  const { chain } = useNetwork();

  const { data: owner } = useContractRead({
    address: CREATION_CONTRACT,
    abi: creationContractAbi,
    chainId: chain?.id,
    functionName: "ownerOf",
    // @ts-ignore
    args: [tokenId],
  }) as { data: `0x${string}` };

  const { config } = usePrepareContractWrite({
    address: MAIN_CONTRACT,
    abi: mainContractAbi,
    chainId: chain?.id,
    functionName: "contribute",
    // @ts-ignore
    args: [issuer, holder, issuerTokenId, Number(amount)],
  });

  const { data: tx, writeAsync } = useContractWrite(config);

  const { error, isSuccess, isError, isLoading } = useWaitForTransaction({
    hash: tx?.hash,
  });

  // onMounted, when window object is available
  useEffect(() => {
    if (!window) return;

    const walletClient: WalletClient = createWalletClient({
      account: address,
      chain: victionTestnet,
      // @ts-ignore
      transport: window.ethereum ? custom(window.ethereum) : http(),
    });

    // @ts-ignore
    const tokenboundClient = new TokenboundClient({ walletClient, chain: victionTestnet });

    const issuerTba = tokenboundClient.getAccount({
      tokenContract: CREATION_CONTRACT,
      tokenId: issuerTokenId.toString(),
    });
    const holderTba = tokenboundClient.getAccount({
      tokenContract: CREATION_CONTRACT,
      tokenId: tokenId.toString(),
    });

    setIssuer(issuerTba);
    setHolder(holderTba);
  }, [address, issuerTokenId, tokenId]);

  // Tx receipt watcher
  useEffect(() => {
    if (isSuccess) {
      toast.custom(<TxToast title="Reward was given successfully!" hash={tx?.hash} />);
      router.refresh();
    }

    if (isError) toast.error(`Failed with error: ${error?.message}`);
  }, [isSuccess, isError, tx?.hash, error?.message, router]);

  async function contributeAction() {
    toast("You will be prompted to confirm the tx, please check your wallet.", { icon: "✍️" });

    try {
      await writeAsync?.();
    } catch (error: any) {
      if (error.message.includes("User rejected the request.")) toast.error("You rejected the request in your wallet.");
    }
  }

  return (
    <div className="flex items-center bg-light-1 shadow-sm hover:shadow-md duration-200 rounded-xl gap-6 p-6">
      <img className="w-[108px] aspect-[1] rounded-xl" src={avatar} alt="creation-avatar" />

      <div className="flex flex-col gap-3 flex-1">
        <h1 className="text-body-bold line-clamp-1">{title}</h1>
        <p className="line-clamp-3 whitespace-pre-line text-small-regular text-zinc-700">{description}</p>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <FontAwesomeIcon className="w-[18px] text-violet-400" icon={faEthereum} />
            <p className="text-small-regular text-zinc-700 leading-none">#{tokenId}</p>
          </div>

          <div className="flex items-center gap-1">
            <FontAwesomeIcon className="w-[14px] text-violet-400" icon={faWallet} />
            <p className="text-small-regular text-zinc-700 leading-none">{hiddenAddress(holder)}</p>
          </div>

          <div className="flex items-center gap-1">
            <FontAwesomeIcon className="w-[12px] text-violet-400" icon={faUser} />
            <p className="text-small-regular text-zinc-700 leading-none">{hiddenAddress(owner)}</p>
          </div>

          <p className="text-subtle-medium text-zinc-500 leading-none">{formatDateString(createdAt)}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold text-zinc-800">Give reward</label>

        <div className="flex items-center gap-3">
          <div className="flex border-[1px] max-w-[100px] bg-transparent border-zinc-300 hover:border-zinc-500 rounded-md duration-200">
            <input
              className="flex-1 border-none outline-none bg-transparent py-2 mx-4"
              value={amount}
              onChange={(e) => {
                const input = e.target.value;
                if (/^[1-9]\d*$/.test(input)) setAmount(input);
                else if (input === "") setAmount("1");
              }}
              type="text"
            />
          </div>

          <form action={contributeAction} className="text-small-regular">
            <AppButton
              text={writeAsync ? "Give" : "Cannot give"}
              otherPendingStatus={isLoading}
              pendingText={isLoading ? "Writing contract..." : "Giving..."}
              disabled={!writeAsync}
              type="submit"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
