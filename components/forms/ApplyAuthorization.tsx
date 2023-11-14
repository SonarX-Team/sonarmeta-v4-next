"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useContractRead, useNetwork } from "wagmi";

import { applyAuthorization } from "@/actions/creation.action";
import AppInput from "../ui/AppInput";
import AppButton from "../ui/AppButton";

import { CREATION_CONTRACT } from "@/constants";
import creationContractAbi from "@/contracts/sonarmeta/Creation.json";

export default function ApplyAuthorization({
  adminTokenId,
  userAddr,
}: {
  adminTokenId: number;
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
    if (!userAddr) return alert("Please connect your wallet and sign in first");

    setErrMsg("");

    const inclinedTokenId = Number(formData.get("inclinedTokenId"));

    if (!creations.some((creation: bigint) => Number(creation) === inclinedTokenId))
      return setErrMsg("Invalid creation tokenID");

    const { status, errMsg } = await applyAuthorization({ adminTokenId, inclinedTokenId, path });

    if (status === 200) alert("Applied");
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
