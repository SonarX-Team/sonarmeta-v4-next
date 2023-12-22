"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useNetwork, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";
import toast from "react-hot-toast";

import { uploadFile } from "@/lib/alioss";
import { createIpDao } from "@/actions/ipdao.action";
import { ipDaoValidation } from "@/validations/ipdao.validation";

import AppInput from "../ui/AppInput";
import AppButton from "../ui/AppButton";
import AppTextarea from "../ui/AppTextarea";
import AvatarInput from "../ui/AvatarInput";
import CoverInput from "../ui/CoverInput";
import ImagesInput from "../ui/ImagesInput";
import TxToast from "../ui/TxToast";

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

  const { data: tx, writeAsync } = useContractWrite(config);

  const { error, isLoading, isSuccess, isError } = useWaitForTransaction({
    hash: tx?.hash,
  });

  // Tx receipt watcher
  useEffect(() => {
    if (isSuccess) {
      toast.custom(<TxToast title="IP DAO created successfully!" hash={tx?.hash} />);
      router.push(`/space/${address}/ip-daos`);
    }

    if (isError) toast.error(`Failed with error: ${error?.message}`);
  }, [isSuccess, isError, tx?.hash, error?.message, router, address, config.result]);

  async function createAction(formData: FormData) {
    // step0 清空页面报错
    setAvatarErr("");
    setCoverErr("");
    setTitleErr("");
    setDescriptionErr("");
    setRecruitmentErr("");
    setImagesErr("");
    setExternalLinkErr("");

    // step2 获取信息
    const avatarFile = formData.get("avatar") as File;
    const coverFile = formData.get("cover") as File;
    const title = String(formData.get("title"));
    const description = String(formData.get("description"));
    const recruitment = String(formData.get("recruitment"));
    const externalLink = String(formData.get("externalLink"));

    // step3 信息校验
    const { isValid, errors: validationErrors } = ipDaoValidation({ title, description, recruitment, externalLink });
    if (!isValid && validationErrors) {
      if (validationErrors.title) setTitleErr(validationErrors.title._errors[0]);
      if (validationErrors.description) setDescriptionErr(validationErrors.description._errors[0]);
      if (validationErrors.recruitment) setRecruitmentErr(validationErrors.recruitment._errors[0]);
      if (validationErrors.externalLink) setExternalLinkErr(validationErrors.externalLink._errors[0]);

      return toast.error("The information you entered contains errors.");
    }

    if (!(avatarFile && avatarFile.size > 0)) {
      toast.error("The information you entered contains errors.");
      return setAvatarErr("Must select an avatar");
    }
    if (!(coverFile && coverFile.size > 0)) {
      toast.error("The information you entered contains errors.");
      return setCoverErr("Must select a cover");
    }
    if (imagesAdded.current.length === 0) {
      toast.error("The information you entered contains errors.");
      return setImagesErr("Must add one image at least");
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
    const timeStamp = Date.now();

    const avatarRes = await uploadFile(`ipdaos/${timeStamp}/avatar.png`, avatarFile);
    const coverRes = await uploadFile(`ipdaos/${timeStamp}/cover.png`, coverFile);

    const imageUrls: string[] = [];
    for (let i = 0; i < imagesAdded.current.length; i++) {
      const result = await uploadFile(`ipdaos/${timeStamp}/image-${i}.png`, imagesAdded.current[i]);
      imageUrls.push(result.url);
    }

    // step6 后端逻辑
    await createIpDao({
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
  }

  return (
    <form action={createAction} className="flex flex-col justify-start gap-8">
      <div className="sm:flex justify-between items-center">
        <div className="sm:basis-1/2 sm:mb-0 mb-8">
          <AvatarInput
            name="avatar"
            label="Select your avatar image"
            type="circle"
            required={true}
            errMsg={avatarErr}
          />
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

      <AppButton
        // text={writeAsync ? "Create and deploy" : "Cannot create"}
        text="Coming soon"
        otherPendingStatus={isLoading}
        pendingText={isLoading ? "Deploying a new IP DAO contract..." : "Creating..."}
        // disabled={!writeAsync}
        disabled={true}
        type="submit"
      />
    </form>
  );
}
