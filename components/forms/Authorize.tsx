"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { TokenboundClient } from "@tokenbound/sdk";
import { useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { http, createWalletClient, WalletClient, custom } from "viem";
import { polygonMumbai } from "viem/chains";

import { authorize } from "@/actions/creation.action";
import AppButton from "../ui/AppButton";
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

  const { data: mintTx, write } = useContractWrite(config);

  const { error, isSuccess, isError, isLoading } = useWaitForTransaction({
    hash: mintTx?.hash,
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

  useEffect(() => {
    if (isSuccess) alert(`Authorized! The tx hash is: ${mintTx?.hash}`);
    if (isError) alert(`Failed with error: ${error?.message}`);
  }, [isSuccess, isError, mintTx?.hash, error?.message]);

  async function authorizeAction() {
    if (!inclinedTbaDeployed)
      return alert(`Token-bound account of the creation #${inclinedTokenId} has not been deployed yet`);
    if (!issuerTbaDeployed)
      return alert(`Token-bound account of the creation #${issuerTokenId} has not been deployed yet`);

    alert("You will be prompted to confirm the tx, please check your wallet");

    write?.();

    const { status, message } = await authorize({ issuerTokenId, inclinedTokenId, path });
    if (status === 200 && message === "Authorized") return;
  }

  return (
    <form action={authorizeAction} className="text-small-regular leading-none h-[44px]">
      <AppButton
        text={write ? "Authorize" : "Cannot authorize"}
        otherPendingStatus={isLoading}
        pendingText={isLoading ? "Writing contract..." : "Authorizing..."}
        disabled={!write}
        type="submit"
      />
    </form>
  );
}
