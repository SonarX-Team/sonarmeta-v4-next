"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { TokenboundClient } from "@tokenbound/sdk";
import { useContractRead, useNetwork } from "wagmi";
import { http, createWalletClient, WalletClient, custom, createPublicClient } from "viem";
import { polygonMumbai } from "viem/chains";

import { applyAuthorization } from "@/actions/creation.action";
import AppInput from "../ui/AppInput";
import AppButton from "../ui/AppButton";

import { CREATION_CONTRACT, MAIN_CONTRACT } from "@/constants";
import mainContractAbi from "@/contracts/sonarmeta/SonarMeta.json";
import creationContractAbi from "@/contracts/sonarmeta/Creation.json";

export default function RequestAuthorization({
  issuerTokenId,
  userAddr,
}: {
  issuerTokenId: number;
  userAddr?: `0x${string}`;
}) {
  const path = usePathname();

  const [errMsg, setErrMsg] = useState<string>("");

  const { chain } = useNetwork();

  const { data: creations } = useContractRead({
    address: CREATION_CONTRACT,
    abi: creationContractAbi,
    chainId: chain?.id,
    functionName: "getTokenIds",
    // @ts-ignore
    args: [userAddr],
  }) as { data: bigint[] };

  async function applyAction(formData: FormData) {
    if (userAddr === "0x") return alert("Please connect your wallet and sign in first");

    setErrMsg("");

    const inclinedTokenId = Number(formData.get("inclinedTokenId"));

    // Check tokenID validation
    if (!creations.some((creation: bigint) => Number(creation) === inclinedTokenId))
      return setErrMsg("Invalid creation tokenID");
    if (issuerTokenId === inclinedTokenId) return setErrMsg("Cannot apply itself");

    // Check TBA deployment
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

    // Check TBA signed or not
    const publicClient = createPublicClient({
      chain: polygonMumbai,
      transport: http(),
    });
    // @ts-ignore
    const signed: boolean = await publicClient.readContract({
      address: MAIN_CONTRACT,
      abi: mainContractAbi,
      functionName: "isTbaSigned",
      args: [tba],
    });

    if (!signed) return setErrMsg("TBA of it not signed");

    const { status, errMsg } = await applyAuthorization({ issuerTokenId, inclinedTokenId, path });

    if (status === 200) alert("Applied");
    else if (status === 400) alert(`Failed with error: ${errMsg}`);
    else if (status === 500) alert(errMsg);
  }

  return (
    <form className="flex flex-col gap-3" action={applyAction}>
      <AppInput
        name="inclinedTokenId"
        label="Creation tokenID"
        placeholder="Creation tokenID for which you wish to apply"
        required={true}
        type="text"
        errMsg={errMsg}
      />

      <div className="text-small-regular h-[44px]">
        <AppButton text="Apply for authorization" pendingText="Submitting..." type="submit" />
      </div>
    </form>
  );
}
