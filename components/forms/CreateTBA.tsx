"use client";

import { useEffect, useMemo, useState } from "react";
import { TokenboundClient } from "@tokenbound/sdk";
import { useContractRead, useWaitForTransaction } from "wagmi";
import { http, createWalletClient, WalletClient, custom } from "viem";
import { goerli } from "viem/chains";

import TitleCard from "../cards/TitleCard";
import CreationPicker from "../ui/CreationPicker";
import AppButton from "../ui/AppButton";

import { CREATION_CONTRACT } from "@/constants";
import creationContractAbi from "@/contracts/sonarmeta/Creation.json";
import { fetchCreations } from "@/actions/creation.action";
import { creationsType } from "@/types/creation.type";
import { formatDateString, hiddenAddress } from "@/lib/utils";

export default function CreateTBA({ address }: { address: `0x${string}` }) {
  const [creations, setCreations] = useState<creationsType[]>();
  const [currentTba, setCurrentTba] = useState<`0x${string}`>("0x");
  const [currentTbaDeployed, setCurrentTbaDeployed] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<`0x${string}`>();

  const [pickedTokenId, setPickedTokenId] = useState<number>(0);

  const { data: tokenIds } = useContractRead({
    address: CREATION_CONTRACT,
    abi: creationContractAbi,
    functionName: "getTokenIds",
    // @ts-ignore
    args: [address],
  });

  const { isSuccess, isLoading, isError, error } = useWaitForTransaction({
    hash: txHash,
  });

  const walletClient: WalletClient = createWalletClient({
    account: address,
    chain: goerli,
    // @ts-ignore
    transport: window.ethereum ? custom(window.ethereum) : http(),
  });

  const tokenboundClient = useMemo(() => new TokenboundClient({ walletClient, chainId: goerli.id }), [walletClient]);

  // Mounted fetch
  useEffect(() => {
    async function getCreations() {
      // @ts-ignore
      if (!tokenIds || tokenIds.length === 0) return;

      // @ts-ignore
      const ids: number[] = tokenIds.map((tokenId) => Number(tokenId));

      const { creations } = await fetchCreations({ pageNumber: 1, pageSize: 20, tokenIds: ids });

      const cs = creations?.map((creation) => {
        creation._id = "";
        return creation;
      });

      setCreations(cs);
    }

    getCreations();
  }, [tokenIds]);

  // TBA wather
  useEffect(() => {
    async function watchTba() {
      const tba = tokenboundClient.getAccount({
        tokenContract: CREATION_CONTRACT,
        tokenId: pickedTokenId.toString(),
      });

      setCurrentTba(tba);

      const isAccountDeployed = await tokenboundClient.checkAccountDeployment({
        accountAddress: tba,
      });

      setCurrentTbaDeployed(isAccountDeployed);
    }

    watchTba();
  }, [pickedTokenId, tokenboundClient]);

  // Create TBA tx watcher
  useEffect(() => {
    if (isSuccess) {
      alert(
        `Token-bound account ${currentTba} for creation tokenId: ${pickedTokenId} with tx hash: ${txHash} was successfully created`
      );
      location.reload();
    }

    if (isError) alert(`Failed with error: ${error?.message}`);
  }, [isSuccess, isError, currentTba, error?.message, pickedTokenId, txHash]);

  async function createAction() {
    if (currentTbaDeployed) return;

    const { account, txHash: createTxHash } = await tokenboundClient.createAccount({
      tokenContract: CREATION_CONTRACT,
      tokenId: pickedTokenId.toString(),
    });

    setTxHash(createTxHash);
    setCurrentTba(account);
  }

  return (
    <form action={createAction} className="flex flex-col justify-start gap-8">
      <CreationPicker
        label="Select a creation"
        creations={creations ? creations : []}
        getCreation={(tokenId) => setPickedTokenId(tokenId)}
        required={true}
      />

      {pickedTokenId > 0 && (
        <TitleCard title="Token details">
          {creations?.map((creation, index) => {
            if (creation.tokenId !== pickedTokenId) return;

            const detailInfo = [
              { info: `#${pickedTokenId}`, title: "Token ID" },
              { info: "ERC-721", title: "Token standard" },
              { info: hiddenAddress(CREATION_CONTRACT), title: "Contract address" },
              { info: hiddenAddress(address), title: "Owner" },
              { info: hiddenAddress(currentTba), title: "Token-bound account" },
              { info: currentTbaDeployed ? "Deployed" : "Not deployed", title: "TBA deployed" },
              { info: creation.externalLink ? creation.externalLink : "-", title: "External link" },
              { info: formatDateString(creation.createdAt), title: "Minted at" },
            ];
            const detailCard: JSX.Element[] = detailInfo.map((info, index) => (
              <div key={index} className="flex flex-col gap-2">
                <p className="text-small-medium text-zinc-500">{info.title}</p>
                <p className="text-small-medium line-clamp-1">{info.info}</p>
              </div>
            ));

            return (
              <div key={index} className="flex flex-col gap-8">
                <div className="grid grid-cols-4 gap-8">{detailCard}</div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-small-medium text-zinc-500">Description</h3>
                  <p className="text-small-medium line-clamp-6 whitespace-pre-line">{creation.description}</p>
                </div>
              </div>
            );
          })}
        </TitleCard>
      )}

      <div className="h-[50px]">
        <AppButton
          text={currentTbaDeployed ? "Deployment of aother TBA not supporting" : "Pick a creation and deploy"}
          otherPendingStatus={isLoading}
          pendingText={isLoading ? "Writing contract..." : "Deploying..."}
          disabled={pickedTokenId === 0 || currentTbaDeployed}
          type="submit"
        />
      </div>
    </form>
  );
}
