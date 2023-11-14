"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useNetwork, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";

import { deleteMulti, uploadFile } from "@/lib/alioss";
import { createIpDao } from "@/actions/ipdao.action";

import AppInput from "../ui/AppInput";
import AppButton from "../ui/AppButton";
import AppTextarea from "../ui/AppTextarea";
import AvatarInput from "../ui/AvatarInput";
import CoverInput from "../ui/coverInput";
import ImagesInput from "../ui/ImagesInput";

import { MAIN_CONTRACT } from "@/constants";

import mainContractAbi from "@/contracts/sonarmeta/SonarMeta.json";

export default function CreateIpDao({ address }: { address: `0x${string}` }) {
  const router = useRouter();

  const [avatarErr, setAvatarErr] = useState<string>("");
  const [coverErr, setCoverErr] = useState<string>("");
  const [titleErr, setTitleErr] = useState<string>("");
  const [descriptionErr, setDescriptionErr] = useState<string>("");
  const [recruitmentErr, setRecruitmentErr] = useState<string>("");
  const [externalLinkErr, setExternalLinkErr] = useState<string>("");
  const [imagesErr, setImagesErr] = useState<string>("");

  const imagesAdded = useRef<File[]>([]);

  const { chain } = useNetwork();

  const { config } = usePrepareContractWrite({
    address: MAIN_CONTRACT,
    abi: mainContractAbi,
    functionName: "deployIpDao",
    chainId: chain?.id,
  });

  const { data: createTx, write } = useContractWrite(config);

  const { error, isLoading, isSuccess, isError } = useWaitForTransaction({
    hash: createTx?.hash,
  });

  useEffect(() => {
    if (isSuccess) {
      alert(`IP DAO with address ${config.result} created! The tx hash is: ${createTx?.hash}`);
      router.push(`/space/${address}/ip-daos`);
    }

    if (isError) alert(`Failed with error: ${error?.message}`);
  }, [isSuccess, isError, createTx?.hash, error?.message, router, address, config.result]);

  async function createAction(formData: FormData) {
    setAvatarErr("");
    setCoverErr("");
    setTitleErr("");
    setDescriptionErr("");
    setRecruitmentErr("");
    setImagesErr("");
    setExternalLinkErr("");

    const timeStamp = Date.now();

    const avatarFile = formData.get("avatar") as File;
    const coverFile = formData.get("cover") as File;

    // 客户端处理图片上传
    if (!(avatarFile && avatarFile.size > 0)) return setAvatarErr("Must select an avatar");
    if (!(coverFile && coverFile.size > 0)) return setCoverErr("Must select a cover");
    if (imagesAdded.current.length === 0) return setImagesErr("Must add one image at least");

    // 处理头像和封面
    const avatarRes = await uploadFile(`ipdaos/${timeStamp}/avatar.png`, avatarFile);
    const coverRes = await uploadFile(`ipdaos/${timeStamp}/cover.png`, coverFile);

    // 处理图册
    const imageUrls: string[] = [];
    for (let i = 0; i < imagesAdded.current.length; i++) {
      const result = await uploadFile(`ipdaos/${timeStamp}/image-${i}.png`, imagesAdded.current[i]);
      imageUrls.push(result.url);
    }

    // 图册在formData里可能引起413错误，所以这个action不传formData，把字段读出来
    const title = String(formData.get("title"));
    const description = String(formData.get("description"));
    const recruitment = String(formData.get("recruitment"));
    const externalLink = String(formData.get("externalLink"));

    const res = await createIpDao({
      address: String(config.result) as `0x${string}`,
      title,
      description,
      recruitment,
      externalLink,
      owner: address,
      avatar: avatarRes.url,
      cover: coverRes.url,
      images: imageUrls,
    });

    // 处理校验信息失败
    if (res.ValidationErrors) {
      if (res.ValidationErrors.title) setTitleErr(res.ValidationErrors.title._errors[0]);
      if (res.ValidationErrors.description) setDescriptionErr(res.ValidationErrors.description._errors[0]);
      if (res.ValidationErrors.recruitment) setRecruitmentErr(res.ValidationErrors.recruitment._errors[0]);
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
    if (res.status === 201 && res.message === "Created")
      alert("You will be prompted to confirm the tx, please check your wallet");
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
        label="IP DAO name"
        placeholder="Set a name for your IP DAO"
        required={true}
        type="text"
        errMsg={titleErr}
      />
      <AppTextarea
        name="description"
        label="Description"
        placeholder="Set a brief intro or something about your IP DAO"
        required={true}
        rows={10}
        errMsg={descriptionErr}
      />
      <AppTextarea
        name="recruitment"
        label="Recruitment"
        placeholder="Provide rules of the type of talent your IP DAO wishes to recruit."
        required={true}
        rows={10}
        errMsg={recruitmentErr}
      />
      <AppInput
        name="externalLink"
        label="External link"
        placeholder="Set the external link to your IP DAO, e.g. https://example.com"
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
          text={write ? "Create and deploy" : "Cannot create"}
          otherPendingStatus={isLoading}
          pendingText={isLoading ? "Deploying a new IP DAO contract..." : "Creating..."}
          disabled={!write}
          type="submit"
        />
      </div>
    </form>
  );
}
