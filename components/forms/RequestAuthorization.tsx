"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { TokenboundClient } from "@tokenbound/sdk";
import { useContractRead, useNetwork } from "wagmi";
import { http, createWalletClient, WalletClient, custom, createPublicClient } from "viem";
import { polygonMumbai } from "viem/chains";
import toast from "react-hot-toast";

import AppSelect from "../ui/AppSelect";
import AppButton from "../ui/AppButton";

import { CREATION_CONTRACT, MAIN_CONTRACT } from "@/constants";
import mainContractAbi from "@/contracts/sonarmeta/SonarMeta.json";
import creationContractAbi from "@/contracts/sonarmeta/Creation.json";

import { applyAuthorization, fetchCreations } from "@/actions/creation.action";
import { creationsType } from "@/types/creation.type";

export default function RequestAuthorization({
  issuerTokenId,
  userAddr,
}: {
  issuerTokenId: number;
  userAddr?: `0x${string}`;
}) {
  const path = usePathname();

  const [options, setOptions] = useState<{ value: number; label: string }[]>([]);
  const [errMsg, setErrMsg] = useState<string>("");

  const { chain } = useNetwork();

  const { data: tokenIds } = useContractRead({
    address: CREATION_CONTRACT,
    abi: creationContractAbi,
    chainId: chain?.id,
    functionName: "getTokenIds",
    // @ts-ignore
    args: [userAddr],
  }) as { data: bigint[] };

  useEffect(() => {
    async function getCreations() {
      if (!tokenIds) return;

      const ids: number[] = tokenIds.map((tokenId: bigint) => Number(tokenId));

      const { creations } = (await fetchCreations({
        pageNumber: 1,
        pageSize: 20,
        tokenIds: ids,
      })) as { creations: creationsType[] };

      let ops: { value: number; label: string }[] = [];

      ops = creations.map((creation: creationsType) => ({
        value: creation.tokenId,
        label: `#${creation.tokenId} ${creation.title}`,
      }));

      setOptions(ops);
    }

    getCreations();
  }, [tokenIds]);

  async function applyAction(formData: FormData) {
    setErrMsg("");

    const inclinedTokenId = Number(formData.get("inclinedTokenId"));

    // Check node is generated or not
    const walletClient: WalletClient = createWalletClient({
      account: userAddr,
      chain: polygonMumbai,
      // @ts-ignore
      transport: window.ethereum ? custom(window.ethereum) : http(),
    });
    // @ts-ignore
    const tokenboundClient = new TokenboundClient({ walletClient, chain: polygonMumbai });
    const tba = tokenboundClient.getAccount({
      tokenContract: CREATION_CONTRACT,
      tokenId: inclinedTokenId.toString(),
    });
    const deployed = await tokenboundClient.checkAccountDeployment({
      accountAddress: tba,
    });

    if (!deployed) return setErrMsg("TBA of it not deployed");

    // Check node signed or not
    const publicClient = createPublicClient({
      chain: polygonMumbai,
      transport: http(),
    });
    // @ts-ignore
    const signed: boolean = await publicClient.readContract({
      address: MAIN_CONTRACT,
      abi: mainContractAbi,
      functionName: "isNodeSigned",
      args: [tba],
    });

    if (!signed) return setErrMsg("Node is not signed");

    const { status, errMsg } = await applyAuthorization({ issuerTokenId, inclinedTokenId, path });

    if (status === 200) toast.success("Applied successfully!");
    else if (status === 400 || status === 500) toast.error(`Failed with error: ${errMsg}!`);
  }

  return (
    <form className="flex flex-col gap-3" action={applyAction}>
      <AppSelect
        name="inclinedTokenId"
        label="Pick a node"
        placeholder="Node that you want to apply"
        options={options}
        errMsg={errMsg}
      />

      <div className="text-small-regular h-[44px]">
        <AppButton text="Apply for authorization" pendingText="Submitting..." type="submit" />
      </div>
    </form>
  );
}
