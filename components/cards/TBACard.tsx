"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TokenboundClient } from "@tokenbound/sdk";
import { useNetwork } from "wagmi";
import { http, createWalletClient, WalletClient, custom, createPublicClient } from "viem";
import { goerli } from "viem/chains";

import TitleCard from "../cards/TitleCard";
import { CREATION_CONTRACT } from "@/constants";
import creationContractAbi from "@/contracts/sonarmeta/Creation.json";
import { hiddenAddress } from "@/lib/utils";

export default function TBACard({ address, tokenId }: { address: `0x${string}`; tokenId: number }) {
  const [tbaAddr, setTbaAddr] = useState<`0x${string}`>("0x");
  const [tbaDeployed, setTbaDeployed] = useState<boolean>(false);
  const [creationsOfTba, setCreationsOfTba] = useState<bigint[]>([]);

  const { chain } = useNetwork();

  // onMounted, when window object is available
  useEffect(() => {
    if (!window) return;

    const walletClient: WalletClient = createWalletClient({
      account: address,
      chain: goerli,
      // @ts-ignore
      transport: window.ethereum ? custom(window.ethereum) : http(),
    });

    const tokenboundClient = new TokenboundClient({ walletClient, chainId: goerli.id });

    const tba = tokenboundClient.getAccount({
      tokenContract: CREATION_CONTRACT,
      tokenId: tokenId.toString(),
    });
    setTbaAddr(tba);

    async function checkDeployed(client: TokenboundClient, tba: `0x${string}`) {
      const isAccountDeployed = await client.checkAccountDeployment({
        accountAddress: tba,
      });

      setTbaDeployed(isAccountDeployed);
    }

    checkDeployed(tokenboundClient, tba);
  }, [address, tokenId]);

  // Watcher for tbaAddr to get creations of it
  useEffect(() => {
    async function getCreationsByTba() {
      if (tbaAddr === "0x") return;

      const publicClient = createPublicClient({
        chain: goerli,
        transport: http(),
      });

      // @ts-ignore
      const data: bigint[] = await publicClient.readContract({
        address: CREATION_CONTRACT,
        abi: creationContractAbi,
        functionName: "getTokenIds",
        args: [tbaAddr],
      });

      setCreationsOfTba(data);
    }

    getCreationsByTba();
  }, [tbaAddr, chain?.id]);

  return (
    <TitleCard title="Token-bound account">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div>
            TBA address{" "}
            <Link className="text-zinc-500 hover:text-zinc-400 duration-200" href={`/space/${tbaAddr}`}>
              {hiddenAddress(tbaAddr)}
            </Link>
          </div>

          {tbaDeployed ? (
            <div className="bg-green-700 text-subtle-medium text-light-2 rounded-md px-2 py-1">Deployed</div>
          ) : (
            <div className="bg-red-700 text-subtle-medium text-light-2 rounded-md px-2 py-1">Not deployed</div>
          )}
        </div>

        <div>
          <p className="text-zinc-500">Creations that this TBA owns {creationsOfTba?.length}</p>
          {creationsOfTba?.map((creation, index) => (
            <div className="flex flex-wrap gap-4 items-center" key={index}>
              #{Number(creation)}
            </div>
          ))}
        </div>
      </div>
    </TitleCard>
  );
}
