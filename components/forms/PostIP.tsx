"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { deleteMulti, uploadFile } from "@/lib/alioss";
import { createIP } from "@/actions/ip.action";

import AppInput from "../ui/AppInput";
import AppButton from "../ui/AppButton";
import AppTextarea from "../ui/AppTextarea";
import AvatarInput from "../ui/AvatarInput";
import ImagesInput from "../ui/ImagesInput";
import CoverInput from "../ui/coverInput";

export default function PostIP({ userId }: { userId: string }) {
  const router = useRouter();

  const [avatarErr, setAvatarErr] = useState<string>("");
  const [coverErr, setCoverErr] = useState<string>("");
  const [titleErr, setTitleErr] = useState<string>("");
  const [descriptionErr, setDescriptionErr] = useState<string>("");
  const [officialLinkErr, setOfficialLinkErr] = useState<string>("");
  const [imagesErr, setImagesErr] = useState<string>("");

  const files = useRef<File[]>([]);

  async function createIPAction(formData: FormData) {
    setAvatarErr("");
    setCoverErr("");
    setTitleErr("");
    setDescriptionErr("");
    setOfficialLinkErr("");
    setImagesErr("");

    const timeStamp = Date.now();

    const avatarFile = formData.get("avatar") as File;
    const coverFile = formData.get("cover") as File;

    // 客户端处理图片上传
    if (!(avatarFile && avatarFile.size > 0)) return setAvatarErr("IP头像不能为空");
    if (!(coverFile && coverFile.size > 0)) return setAvatarErr("IP封面不能为空");
    if (!files.current) return setImagesErr("至少为IP图片列表加一个图片");

    const avatarRes = await uploadFile(`ips/${String(formData.get("title"))}-${timeStamp}/avatar.png`, avatarFile);
    const coverRes = await uploadFile(`ips/${String(formData.get("title"))}-${timeStamp}/cover.png`, coverFile);

    const imageUrls: string[] = [];
    for (let i = 0; i < files.current.length; i++) {
      const result = await uploadFile(
        `ips/${String(formData.get("title"))}-${timeStamp}/image-${i}.png`,
        files.current[i]
      );
      imageUrls.push(result.url);
    }

    const res = await createIP({ userId, formData, avatar: avatarRes.url, cover: coverRes.url, images: imageUrls });

    // 处理校验信息失败
    if (res.ValidationErrors) {
      if (res.ValidationErrors.title) setTitleErr(res.ValidationErrors.title._errors[0]);
      if (res.ValidationErrors.description) setDescriptionErr(res.ValidationErrors.description._errors[0]);
      if (res.ValidationErrors.officialLink) setOfficialLinkErr(res.ValidationErrors.officialLink._errors[0]);

      // 删掉上传了的图片
      imageUrls.push(avatarRes.url);
      imageUrls.push(coverRes.url);
      await deleteMulti(imageUrls);

      return;
    }

    // 更新成功后
    if (res.status !== 201 || res.message !== "Created") return;
    router.push("/");
  }

  return (
    <form action={createIPAction} className="flex flex-col justify-start">
      <div className="sm:flex justify-between items-center">
        <div className="sm:basis-1/2">
          <AvatarInput name="avatar" required={true} errMsg={avatarErr} />
        </div>
        <div className="sm:basis-1/2">
          <CoverInput name="cover" required={true} errMsg={coverErr} />
        </div>
      </div>
      
      <AppInput
        name="title"
        label="IP名称"
        placeholder="请输入您的IP名称"
        required={true}
        type="text"
        errMsg={titleErr}
      />
      <AppTextarea
        name="description"
        label="IP描述"
        placeholder="请输入您的IP描述"
        required={true}
        rows={10}
        errMsg={descriptionErr}
      />
      <AppInput
        name="officialLink"
        label="IP官网链接"
        placeholder="请输入您的IP官网链接，格式如https://example.com"
        type="text"
        errMsg={officialLinkErr}
      />
      <ImagesInput name="images" getResults={(fs: File[]) => (files.current = fs)} errMsg={imagesErr} />

      <div className="h-[50px]">
        <AppButton text="创 建" pendingText="创建中..." type="submit" />
      </div>
    </form>
  );
}
