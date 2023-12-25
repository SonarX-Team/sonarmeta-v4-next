"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useContractRead, useNetwork } from "wagmi";
import { http, createPublicClient } from "viem";
import { lineaTestnet } from "viem/chains";
import toast from "react-hot-toast";

import AppSelect from "../ui/AppSelect";
import AppButton from "../ui/AppButton";

import { CREATION_CONTRACT, MAIN_CONTRACT } from "@/constants";
import mainContractAbi from "@/contracts/sonarmeta/SonarMeta.json";
import creationContractAbi from "@/contracts/sonarmeta/Creation.json";

import { applyAuthorization, fetchCreations, getNodeTba } from "@/actions/creation.action";
import { creationsType } from "@/types/creation.type";

export default function ApplyAuthorization({
  issuerTokenId,
  issuerAddr,
  userAddr,
}: {
  issuerTokenId: number;
  issuerAddr: `0x${string}` | "";
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

  // Mounted - 按当期登录用户获取TokenIds
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
    const { tbaAddr: inclinedAddr } = await getNodeTba({ tokenId: inclinedTokenId });

    if (!issuerAddr || !inclinedAddr) return setErrMsg("Nodes must be all generated");

    // Check node signed or not
    const publicClient = createPublicClient({
      chain: lineaTestnet,
      transport: http(),
    });
    // @ts-ignore
    const issuerSigned: boolean = await publicClient.readContract({
      address: MAIN_CONTRACT,
      abi: mainContractAbi,
      functionName: "isNodeSigned",
      args: [issuerAddr],
    });
    // @ts-ignore
    const inclinedSigned: boolean = await publicClient.readContract({
      address: MAIN_CONTRACT,
      abi: mainContractAbi,
      functionName: "isNodeSigned",
      args: [inclinedAddr],
    });

    if (!issuerSigned || !inclinedSigned) return setErrMsg("Nodes must be all signed");

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

      <div className="text-small-regular">
        <AppButton text="Apply for authorization" pendingText="Submitting..." type="submit" />
      </div>
    </form>
  );
}
