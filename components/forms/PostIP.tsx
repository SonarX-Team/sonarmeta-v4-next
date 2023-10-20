"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useNetwork, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";

import { deleteMulti, uploadFile } from "@/lib/alioss";
import { createIP } from "@/actions/ip.action";

import AppInput from "../ui/AppInput";
import AppButton from "../ui/AppButton";
import AppTextarea from "../ui/AppTextarea";
import AvatarInput from "../ui/AvatarInput";
import ImagesInput from "../ui/ImagesInput";
import CoverInput from "../ui/coverInput";

import { MAIN_CONTRACT } from "@/constants";

import mainContract from "@/contracts/SonarMeta.sol/SonarMeta.json";

export default function PostIP({ userId }: { userId: string }) {
  const router = useRouter();

  const { address: userAddress } = useAccount();
  const { chain } = useNetwork();

  // todo 不连钱包提醒不能使用

  const [avatarErr, setAvatarErr] = useState<string>("");
  const [coverErr, setCoverErr] = useState<string>("");
  const [titleErr, setTitleErr] = useState<string>("");
  const [descriptionErr, setDescriptionErr] = useState<string>("");
  const [agreementErr, setAgreementErr] = useState<string>("");
  const [officialLinkErr, setOfficialLinkErr] = useState<string>("");
  const [imagesErr, setImagesErr] = useState<string>("");

  const imagesAdded = useRef<File[]>([]);
  const avatarUrlRef = useRef<string>("");

  // 准备调用合约
  const { config } = usePrepareContractWrite({
    address: MAIN_CONTRACT,
    abi: mainContract.abi,
    functionName: "createNewIP",
    chainId: 534351,
    args: [avatarUrlRef.current, userAddress, chain?.id],
  });

  const { data, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    if (isSuccess) {
      alert(`IP created! The tx hash is: ${data?.hash}`);
      router.push("/");
    }
  }, [isSuccess]);

  async function createIPAction(formData: FormData) {
    setAvatarErr("");
    setCoverErr("");
    setTitleErr("");
    setDescriptionErr("");
    setAgreementErr("");
    setOfficialLinkErr("");
    setImagesErr("");

    const timeStamp = Date.now();

    const avatarFile = formData.get("avatar") as File;
    const coverFile = formData.get("cover") as File;

    if (!(avatarFile && avatarFile.size > 0)) return setAvatarErr("Must select an avatar");
    if (!(coverFile && coverFile.size > 0)) return setCoverErr("Must select a cover");
    if (imagesAdded.current.length === 0) return setImagesErr("Must add one image at least");

    // 处理头像和封面
    const avatarRes = await uploadFile(`ips/${timeStamp}/avatar.png`, avatarFile);
    const coverRes = await uploadFile(`ips/${timeStamp}/cover.png`, coverFile);

    // 保存头像的地址用于和IP token链接
    avatarUrlRef.current = avatarRes.url;

    // 处理图册
    const imageUrls: string[] = [];
    for (let i = 0; i < imagesAdded.current.length; i++) {
      const result = await uploadFile(`ips/${timeStamp}/image-${i}.png`, imagesAdded.current[i]);
      imageUrls.push(result.url);
    }

    // 图册在formData里可能引起413错误，所以这个action不传formData，把字段读出来
    const title = String(formData.get("title"));
    const description = String(formData.get("description"));
    const agreement = String(formData.get("agreement"));
    const officialLink = String(formData.get("officialLink"));

    const res = await createIP({
      userId,
      title,
      description,
      agreement,
      officialLink,
      avatar: avatarRes.url,
      cover: coverRes.url,
      images: imageUrls,
    });

    // 处理校验信息失败
    if (res.ValidationErrors) {
      if (res.ValidationErrors.title) setTitleErr(res.ValidationErrors.title._errors[0]);
      if (res.ValidationErrors.description) setDescriptionErr(res.ValidationErrors.description._errors[0]);
      if (res.ValidationErrors.agreement) setAgreementErr(res.ValidationErrors.agreement._errors[0]);
      if (res.ValidationErrors.officialLink) setOfficialLinkErr(res.ValidationErrors.officialLink._errors[0]);

      // 回滚：删掉上传了的图片
      if (avatarFile && avatarFile.size > 0) await deleteMulti([avatarRes.url]);
      if (coverFile && coverFile.size > 0) await deleteMulti([coverRes.url]);
      if (imagesAdded.current.length > 0) await deleteMulti(imageUrls);
      avatarUrlRef.current = "";

      return;
    }

    // 调用合约
    write?.();

    // 更新成功后
    if (res.status !== 201 || res.message !== "Created") return;
    // router.push("/");
  }

  return (
    <form action={createIPAction} className="flex flex-col justify-start gap-8">
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
        label="IP name"
        placeholder="Type your IP's name"
        required={true}
        type="text"
        errMsg={titleErr}
      />
      <AppTextarea
        name="description"
        label="IP story"
        placeholder="Type a story for your IP"
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
        name="officialLink"
        label="Official link"
        placeholder="Type the official link of your IP，e.g. https://example.com"
        type="text"
        errMsg={officialLinkErr}
      />
      <ImagesInput
        name="images"
        getResults={(fs: File[]) => (imagesAdded.current = fs)}
        getUrlsLeft={(urls: string[]) => console.log(urls)}
        errMsg={imagesErr}
      />

      <div className="h-[50px]">
        <AppButton
          text={write ? "Create" : "Cannot create"}
          otherPendingStatus={isLoading}
          pendingText={isLoading ? "Calling contract..." : "Creating..."}
          disabled={!write}
          type="submit"
        />
      </div>
    </form>
  );
}
