"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useNetwork, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";

import { deleteMulti, uploadFile } from "@/lib/alioss";
import { createCreation } from "@/actions/creation.action";

import AppInput from "../ui/AppInput";
import AppButton from "../ui/AppButton";
import AppTextarea from "../ui/AppTextarea";
import AvatarInput from "../ui/AvatarInput";
import ImagesInput from "../ui/ImagesInput";
import CoverInput from "../ui/coverInput";

import mainContractAbi from "@/contracts/sonarmeta/SonarMeta.json";

import { MAIN_CONTRACT } from "@/constants";

export default function CreateCreation({ address }: { address: `0x${string}` }) {
  const router = useRouter();

  const { chain } = useNetwork();

  const [avatarErr, setAvatarErr] = useState<string>("");
  const [coverErr, setCoverErr] = useState<string>("");
  const [titleErr, setTitleErr] = useState<string>("");
  const [descriptionErr, setDescriptionErr] = useState<string>("");
  const [agreementErr, setAgreementErr] = useState<string>("");
  const [externalLinkErr, setExternalLinkErr] = useState<string>("");
  const [imagesErr, setImagesErr] = useState<string>("");

  const imagesAdded = useRef<File[]>([]);

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
    setCoverErr("");
    setTitleErr("");
    setDescriptionErr("");
    setAgreementErr("");
    setExternalLinkErr("");
    setImagesErr("");

    const timeStamp = Date.now();

    const avatarFile = formData.get("avatar") as File;
    const coverFile = formData.get("cover") as File;

    if (!(avatarFile && avatarFile.size > 0)) return setAvatarErr("Must select an avatar");
    if (!(coverFile && coverFile.size > 0)) return setCoverErr("Must select a cover");
    if (imagesAdded.current.length === 0) return setImagesErr("Must add one image at least");

    // 处理头像和封面
    const avatarRes = await uploadFile(`creations/${timeStamp}/avatar.png`, avatarFile);
    const coverRes = await uploadFile(`creations/${timeStamp}/cover.png`, coverFile);

    // 处理图册
    const imageUrls: string[] = [];
    for (let i = 0; i < imagesAdded.current.length; i++) {
      const result = await uploadFile(`creations/${timeStamp}/image-${i}.png`, imagesAdded.current[i]);
      imageUrls.push(result.url);
    }

    // 图册在formData里可能引起413错误，所以这个action不传formData，把字段读出来
    const title = String(formData.get("title"));
    const description = String(formData.get("description"));
    const agreement = String(formData.get("agreement"));
    const externalLink = String(formData.get("externalLink"));

    const res = await createCreation({
      title,
      description,
      tokenId: Number(config.result),
      agreement,
      externalLink,
      avatar: avatarRes.url,
      cover: coverRes.url,
      images: imageUrls,
    });

    // 处理校验信息失败
    if (res.ValidationErrors) {
      if (res.ValidationErrors.title) setTitleErr(res.ValidationErrors.title._errors[0]);
      if (res.ValidationErrors.description) setDescriptionErr(res.ValidationErrors.description._errors[0]);
      if (res.ValidationErrors.agreement) setAgreementErr(res.ValidationErrors.agreement._errors[0]);
      if (res.ValidationErrors.externalLink) setExternalLinkErr(res.ValidationErrors.externalLink._errors[0]);

      // 回滚：删掉上传了的图片
      if (avatarFile && avatarFile.size > 0) await deleteMulti([avatarRes.url]);
      if (coverFile && coverFile.size > 0) await deleteMulti([coverRes.url]);
      if (imagesAdded.current.length > 0) await deleteMulti(imageUrls);

      return;
    }

    if (res.status === 500) {
      // 回滚：删掉上传了的图片
      if (avatarFile && avatarFile.size > 0) await deleteMulti([avatarRes.url]);
      if (coverFile && coverFile.size > 0) await deleteMulti([coverRes.url]);
      if (imagesAdded.current.length > 0) await deleteMulti(imageUrls);

      return;
    }

    // 调用合约
    write?.();

    // 更新成功后
    if (res.status !== 201 || res.message !== "Created") return;
  }

  return (
    <form action={createAction} className="flex flex-col justify-start gap-8">
      <div className="sm:flex justify-between items-center">
        <div className="sm:basis-1/2 sm:mb-0 mb-8">
          <AvatarInput name="avatar" required={true} errMsg={avatarErr} />
        </div>
        <div className="sm:basis-1/2">
          <CoverInput name="cover" required={true} errMsg={coverErr} />
        </div>
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
      <ImagesInput
        name="images"
        getResults={(fs: File[]) => (imagesAdded.current = fs)}
        getUrlsLeft={(urls: string[]) => console.log(urls)}
        errMsg={imagesErr}
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
