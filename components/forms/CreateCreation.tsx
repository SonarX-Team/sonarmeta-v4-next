"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useNetwork, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";
import toast from "react-hot-toast";

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
      toast.custom(
        <div className="w-[300px] bg-light-1 shadow-lg rounded-xl text-body-normal flex items-center gap-3 py-4 px-6">
          <div>😃</div>
          <div>
            Creation minted successfully! You can check the tx on{" "}
            <Link
              className="text-violet-700 hover:text-violet-600 duration-200"
              href={`https://mumbai.polygonscan.com/tx/${mintTx?.hash}`}
              target="_blank"
            >
              Polygonscan
            </Link>
          </div>
        </div>
      );

      router.push("/studio/creations");
    }

    if (isError) toast.error(`Failed with error: ${error?.message}`); // TODO回滚
  }, [isSuccess, isError, mintTx?.hash, error?.message, router]);

  async function createAction(formData: FormData) {
    setAvatarErr("");
    setTitleErr("");
    setDescriptionErr("");
    setAgreementErr("");
    setExternalLinkErr("");

    const timeStamp = Date.now();

    const avatarFile = formData.get("avatar") as File;

    if (!(avatarFile && avatarFile.size > 0)) {
      toast.error("The information you entered contains errors.");
      return setAvatarErr("Must select an avatar");
    }

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
    }

    if (res.status === 201 && res.message === "Created") {
      toast("You will be prompted to confirm the tx, please check your wallet.", { icon: "✍️" });
      write?.();
    } else {
      if (res.status === 400) toast.error("The information you entered contains errors.");
      if (res.status === 500) toast.error("Internal server error.");
      await deleteMulti([avatarRes.url]); // 回滚
    }
  }

  return (
    <form action={createAction} className="flex flex-col justify-start gap-8">
      <AvatarInput name="avatar" label="Select your creation image" type="square" required={true} errMsg={avatarErr} />
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
