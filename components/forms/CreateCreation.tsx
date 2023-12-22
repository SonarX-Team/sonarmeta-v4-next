"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNetwork, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";
import toast from "react-hot-toast";

import { uploadFile } from "@/lib/alioss";
import { createCreation } from "@/actions/creation.action";
import { createCreationValidation } from "@/validations/creation.validation";

import AppInput from "../ui/AppInput";
import AppButton from "../ui/AppButton";
import AppTextarea from "../ui/AppTextarea";
import AvatarPicker from "../ui/AvatarPicker";
import TxToast from "../ui/TxToast";

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

  const { data: tx, writeAsync } = useContractWrite(config);

  const { error, isSuccess, isError, isLoading } = useWaitForTransaction({
    hash: tx?.hash,
  });

  // Tx receipt watcher
  useEffect(() => {
    if (isSuccess) {
      toast.custom(<TxToast title="Creation minted successfully!" hash={tx?.hash} />);
      router.push("/studio/creations");
    }

    if (isError) toast.error(`Failed with error: ${error?.message}`); // TODO回滚
  }, [isSuccess, isError, tx?.hash, error?.message, router]);

  async function createAction(formData: FormData) {
    // step1 清空页面报错
    setAvatarErr("");
    setTitleErr("");
    setDescriptionErr("");
    setAgreementErr("");
    setExternalLinkErr("");

    // step2 获取信息
    const avatarFile = formData.get("avatar") as File;
    const title = String(formData.get("title"));
    const description = String(formData.get("description"));
    const agreement = String(formData.get("agreement"));
    const externalLink = String(formData.get("externalLink"));

    // step3 信息校验
    const { isValid, errors: validationErrors } = createCreationValidation({
      title,
      description,
      agreement,
      externalLink,
    });
    if (!isValid && validationErrors) {
      if (validationErrors.title) setTitleErr(validationErrors.title._errors[0]);
      if (validationErrors.description) setDescriptionErr(validationErrors.description._errors[0]);
      if (validationErrors.agreement) setAgreementErr(validationErrors.agreement._errors[0]);
      if (validationErrors.externalLink) setExternalLinkErr(validationErrors.externalLink._errors[0]);

      return toast.error("The information you entered contains errors.");
    }

    if (!(avatarFile && avatarFile.size > 0)) {
      toast.error("The information you entered contains errors.");
      return setAvatarErr("Must select an avatar");
    }

    // step4 校验全部通过后进行钱包交互
    try {
      toast("You will be prompted to confirm the tx, please check your wallet.", { icon: "✍️" });

      await writeAsync?.();
    } catch (error: any) {
      if (error.message.includes("User rejected the request."))
        return toast.error("You rejected the request in your wallet.");
    }

    // step5 上传图片
    const avatarRes = await uploadFile(`creations/${Date.now()}/avatar.png`, avatarFile);

    // step6 后端逻辑
    await createCreation({
      tokenId: Number(config.result),
      title,
      description,
      agreement,
      externalLink,
      avatar: avatarRes.url,
    });
  }

  return (
    <form action={createAction} className="flex flex-col justify-start gap-8">
      <AvatarPicker name="avatar" label="Select your creation image" type="square" required={true} errMsg={avatarErr} />
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

      <AppButton
        text={writeAsync ? "Create and mint" : "Cannot create"}
        otherPendingStatus={isLoading}
        pendingText={isLoading ? "Minting your creation..." : "Creating..."}
        disabled={!writeAsync}
        type="submit"
      />
    </form>
  );
}
