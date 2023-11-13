"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNetwork, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";

import { deleteMulti, uploadFile } from "@/lib/alioss";
import { createCreation } from "@/actions/creation.action";

import AppInput from "../ui/AppInput";
import AppButton from "../ui/AppButton";
import AppTextarea from "../ui/AppTextarea";
import AvatarInput from "../ui/AvatarInput";

import mainContractAbi from "@/contracts/sonarmeta/SonarMeta.json";

import { MAIN_CONTRACT } from "@/constants";

export default function CreateCreation({ address }: { address: `0x${string}` }) {
  const router = useRouter();

  const { chain } = useNetwork();

  const [avatarErr, setAvatarErr] = useState<string>("");
  const [titleErr, setTitleErr] = useState<string>("");
  const [descriptionErr, setDescriptionErr] = useState<string>("");
  const [agreementErr, setAgreementErr] = useState<string>("");
  const [externalLinkErr, setExternalLinkErr] = useState<string>("");

  const { config } = usePrepareContractWrite({
    address: MAIN_CONTRACT,
    abi: mainContractAbi,
    functionName: "mintCreation",
    chainId: chain?.id,
    // @ts-ignore
    args: [address],
  });

  const { data: mintTx, write } = useContractWrite(config);

  const { error, isSuccess, isError, isLoading } = useWaitForTransaction({
    hash: mintTx?.hash,
  });

  useEffect(() => {
    if (isSuccess) {
      alert(`Creation created! The tx hash is: ${mintTx?.hash}`);
      router.push("/creations");
    }

    if (isError) alert(`Failed with error: ${error?.message}`);
  }, [isSuccess, isError, mintTx?.hash, error?.message, router]);

  async function createAction(formData: FormData) {
    setAvatarErr("");
    setTitleErr("");
    setDescriptionErr("");
    setAgreementErr("");
    setExternalLinkErr("");

    const timeStamp = Date.now();

    const avatarFile = formData.get("avatar") as File;

    if (!(avatarFile && avatarFile.size > 0)) return setAvatarErr("Must select an avatar");
    const avatarRes = await uploadFile(`creations/${timeStamp}/avatar.png`, avatarFile);

    const res = await createCreation({
      tokenId: Number(config.result),
      formData,
      avatar: avatarRes.url,
    });

    // 处理校验信息失败
    if (res.ValidationErrors) {
      if (res.ValidationErrors.title) setTitleErr(res.ValidationErrors.title._errors[0]);
      if (res.ValidationErrors.description) setDescriptionErr(res.ValidationErrors.description._errors[0]);
      if (res.ValidationErrors.agreement) setAgreementErr(res.ValidationErrors.agreement._errors[0]);
      if (res.ValidationErrors.externalLink) setExternalLinkErr(res.ValidationErrors.externalLink._errors[0]);

      // 回滚：删掉上传了的图片
      if (avatarFile && avatarFile.size > 0) await deleteMulti([avatarRes.url]);
      return;
    }

    if (res.status === 500) {
      // 回滚：删掉上传了的图片
      if (avatarFile && avatarFile.size > 0) await deleteMulti([avatarRes.url]);
      return;
    }

    // 调用合约
    write?.();

    // 更新成功后
    if (res.status !== 201 || res.message !== "Created") return;
  }

  return (
    <form action={createAction} className="flex flex-col justify-start gap-8">
      <div className="sm:basis-1/2 sm:mb-0 mb-8">
        <AvatarInput name="avatar" required={true} errMsg={avatarErr} />
      </div>

      <AppInput
        name="title"
        label="Creation name"
        placeholder="Set a name for your creation"
        required={true}
        type="text"
        errMsg={titleErr}
      />
      <AppTextarea
        name="description"
        label="Description"
        placeholder="Set a brief intro, story, or something about your creation"
        required={true}
        rows={10}
        errMsg={descriptionErr}
      />
      <AppTextarea
        name="agreement"
        label="Agreement"
        placeholder="Provide specific instructions on how you would like to authorize."
        required={true}
        rows={10}
        errMsg={agreementErr}
      />
      <AppInput
        name="externalLink"
        label="External link"
        placeholder="Set the external link to your creation，e.g. https://example.com"
        type="text"
        errMsg={externalLinkErr}
      />

      <div className="h-[50px]">
        <AppButton
          text={write ? "Create and mint" : "Cannot create"}
          otherPendingStatus={isLoading}
          pendingText={isLoading ? "Minting your creation NFT..." : "Creating..."}
          disabled={!write}
          type="submit"
        />
      </div>
    </form>
  );
}
