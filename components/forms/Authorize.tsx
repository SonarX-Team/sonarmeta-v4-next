"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { TokenboundClient } from "@tokenbound/sdk";
import { useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { http, createWalletClient, WalletClient, custom } from "viem";
import { polygonMumbai } from "viem/chains";
import toast from "react-hot-toast";

import { authorize } from "@/actions/creation.action";

import AppButton from "../ui/AppButton";
import TxToast from "../ui/TxToast";

import { CREATION_CONTRACT, MAIN_CONTRACT } from "@/constants";
import mainContractAbi from "@/contracts/sonarmeta/SonarMeta.json";

export default function Authorize({
  issuerTokenId,
  inclinedTokenId,
  userAddr,
}: {
  issuerTokenId: number;
  inclinedTokenId: number;
  userAddr?: `0x${string}`;
}) {
  const path = usePathname();

  const [inclinedTba, setInclinedTba] = useState<`0x${string}`>("0x");
  const [inclinedTbaDeployed, setInclinedTbaDeployed] = useState<boolean>(false);
  const [issuerTba, setIssuerTba] = useState<`0x${string}`>("0x");
  const [issuerTbaDeployed, setIssuerTbaDeployed] = useState<boolean>(false);

  const { chain } = useNetwork();

  const { config } = usePrepareContractWrite({
    address: MAIN_CONTRACT,
    abi: mainContractAbi,
    functionName: "authorize",
    chainId: chain?.id,
    // @ts-ignore
    args: [issuerTba, inclinedTba, issuerTokenId], // _from, _to, _tokenId
  });

  const { data: tx, writeAsync } = useContractWrite(config);

  const { error, isSuccess, isError, isLoading } = useWaitForTransaction({
    hash: tx?.hash,
  });

  // onMounted, when window object is available
  useEffect(() => {
    if (!window) return;

    async function mounted() {
      const walletClient: WalletClient = createWalletClient({
        account: userAddr,
        chain: polygonMumbai,
        // @ts-ignore
        transport: window.ethereum ? custom(window.ethereum) : http(),
      });

      // @ts-ignore
      const tokenboundClient = new TokenboundClient({ walletClient, chain: polygonMumbai });

      const inclined = tokenboundClient.getAccount({
        tokenContract: CREATION_CONTRACT,
        tokenId: inclinedTokenId.toString(),
      });
      setInclinedTba(inclined);

      const inclinedDeployed = await tokenboundClient.checkAccountDeployment({
        accountAddress: inclined,
      });
      setInclinedTbaDeployed(inclinedDeployed);

      const issuer = tokenboundClient.getAccount({
        tokenContract: CREATION_CONTRACT,
        tokenId: issuerTokenId.toString(),
      });
      setIssuerTba(issuer);

      const issuerDeployed = await tokenboundClient.checkAccountDeployment({
        accountAddress: issuer,
      });
      setIssuerTbaDeployed(issuerDeployed);
    }

    mounted();
  }, [userAddr, inclinedTokenId, issuerTokenId]);

  // Tx receipt watcher
  useEffect(() => {
    async function authorizeDb() {
      if (isSuccess) {
        await authorize({ issuerTokenId, inclinedTokenId, path });
        toast.custom(<TxToast title="Authorized successfully!" hash={tx?.hash} />);
      }

      if (isError) toast.error(`Failed with error: ${error?.message}`);
    }

    authorizeDb();
  }, [isSuccess, isError, tx?.hash, error?.message, inclinedTokenId, issuerTokenId, path]);

  async function authorizeAction() {
    if (!inclinedTbaDeployed)
      return toast.error(`Token-bound account of the creation #${inclinedTokenId} has not been deployed yet`);
    if (!issuerTbaDeployed)
      return toast.error(`Token-bound account of the creation #${issuerTokenId} has not been deployed yet`);

    toast("You will be prompted to confirm the tx, please check your wallet.", { icon: "✍️" });

    try {
      await writeAsync?.();
    } catch (error: any) {
      if (error.message.includes("User rejected the request.")) toast.error("You rejected the request in your wallet.");
    }
  }

  return (
    <form action={authorizeAction} className="text-small-regular">
      <AppButton
        text={writeAsync ? "Authorize" : "Cannot authorize"}
        otherPendingStatus={isLoading}
        pendingText={isLoading ? "Writing contract..." : "Authorizing..."}
        disabled={!writeAsync}
        type="submit"
      />
    </form>
  );
}
