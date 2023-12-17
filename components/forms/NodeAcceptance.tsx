"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { TokenboundClient } from "@tokenbound/sdk";
import { createWalletClient, custom, http, WalletClient, encodeFunctionData } from "viem";
import { polygonMumbai } from "viem/chains";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import toast from "react-hot-toast";

import mainContractAbi from "@/contracts/sonarmeta/SonarMeta.json";
import authorizationContractAbi from "@/contracts/sonarmeta/Authorization.json";
import { AUTHORIZATION_CONTRACT, CREATION_CONTRACT, INTERNSHIP_LOCKING_AMOUNT, MAIN_CONTRACT } from "@/constants";

import AppButton from "../ui/AppButton";
import TxToast from "../ui/TxToast";
import { acceptApplication } from "@/actions/creation.action";

export default function NodeAcceptance({
  issuerTokenId,
  inclinedTokenId,
  title,
  avatar,
  userAddr,
}: {
  issuerTokenId: number;
  inclinedTokenId: number;
  title: string;
  avatar: string;
  userAddr: `0x${string}`;
}) {
  const path = usePathname();
  const router = useRouter();

  const [inclinedTba, setInclinedTba] = useState<`0x${string}`>("0x");
  const [issuerTba, setIssuerTba] = useState<`0x${string}`>("0x");
  const [walletClient, setWalletClient] = useState<WalletClient>();

  // @ts-ignore
  const tokenboundClient = useMemo(() => new TokenboundClient({ walletClient, chain: polygonMumbai }), [walletClient]);

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
  }, [userAddr]);

  // TBA watcher
  useEffect(() => {
    async function watchTba() {
      const inclined = tokenboundClient.getAccount({
        tokenContract: CREATION_CONTRACT,
        tokenId: inclinedTokenId.toString(),
      });

      setInclinedTba(inclined);

      const issuer = tokenboundClient.getAccount({
        tokenContract: CREATION_CONTRACT,
        tokenId: issuerTokenId.toString(),
      });

      setIssuerTba(issuer);
    }

    watchTba();
  }, [inclinedTokenId, issuerTokenId, tokenboundClient]);

  async function acceptAction() {
    const isValidSigner = await tokenboundClient.isValidSigner({
      account: issuerTba,
    });

    if (!isValidSigner) return toast.error("Your account is not the valid signer of your TBA");

    // @ts-ignore
    const transferData = encodeFunctionData({
      abi: authorizationContractAbi,
      functionName: "safeTransferFrom",
      args: [issuerTba, inclinedTba, issuerTokenId, INTERNSHIP_LOCKING_AMOUNT, ""],
    });

    // @ts-ignore
    const accpetData = encodeFunctionData({
      abi: mainContractAbi,
      functionName: "acceptApplication",
      args: [issuerTokenId, inclinedTba, INTERNSHIP_LOCKING_AMOUNT],
    });

    try {
      toast("You will be prompted to confirm the tx, please check your wallet.", { icon: "✍️" });

      const transferTx = await tokenboundClient.execute({
        account: issuerTba,
        to: AUTHORIZATION_CONTRACT,
        // @ts-ignore
        value: 0n,
        data: transferData,
      });

      const acceptTx = await tokenboundClient.execute({
        account: issuerTba,
        to: MAIN_CONTRACT,
        // @ts-ignore
        value: 0n,
        data: accpetData,
      });

      const { status, errMsg } = await acceptApplication({ issuerTokenId, inclinedTokenId, path });

      if (status === 200) toast.custom(<TxToast title="Accepted successfully!" hash={acceptTx} />);
      else if (status === 400 && errMsg) toast.error(errMsg);
      else if (status === 500) toast.error("Internal server error.");

      router.refresh();
    } catch (error: any) {
      if (error.message.includes("User rejected the request.")) toast.error("You rejected the request in your wallet.");
    }
  }

  return (
    <div className="flex flex-col bg-light-1 shadow-sm hover:shadow-md duration-200 rounded-xl h-full">
      <Link
        href={`/creations/${inclinedTokenId}`}
        target="_blank"
        className="relative w-full aspect-[1] overflow-hidden rounded-t-xl z-0 mb-4"
      >
        <img
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          src={avatar}
          alt="creation-avatar"
        />
      </Link>

      <div className="flex px-4 mb-4">
        <h1 className="line-clamp-1">{title}</h1>
        <div className="flex items-center gap-1">
          <FontAwesomeIcon className="w-[18px] text-violet-400" icon={faEthereum} />
          <p className="text-small-regular text-zinc-700 leading-none">#{inclinedTokenId}</p>
        </div>
      </div>

      <form action={acceptAction} className="h-[44px] text-small-regular mb-4 mx-4">
        <AppButton text="Accept" pendingText="Writing contract..." />
      </form>
    </div>
  );
}
