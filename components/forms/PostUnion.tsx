"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { deleteMulti, uploadFile } from "@/lib/alioss";
import { createUnion } from "@/actions/union.action";

import AppInput from "../ui/AppInput";
import AppButton from "../ui/AppButton";
import AppTextarea from "../ui/AppTextarea";
import AvatarInput from "../ui/AvatarInput";
import CoverInput from "../ui/coverInput";

export default function PostUnion({ userId }: { userId: string }) {
  const router = useRouter();

  const [avatarErr, setAvatarErr] = useState<string>("");
  const [coverErr, setCoverErr] = useState<string>("");
  const [titleErr, setTitleErr] = useState<string>("");
  const [descriptionErr, setDescriptionErr] = useState<string>("");
  const [recruitmentErr, setRecruitmentErr] = useState<string>("");

  async function createUnionAction(formData: FormData) {
    setAvatarErr("");
    setCoverErr("");
    setTitleErr("");
    setDescriptionErr("");
    setRecruitmentErr("");

    const timeStamp = Date.now();

    const avatarFile = formData.get("avatar") as File;
    const coverFile = formData.get("cover") as File;

    // 客户端处理图片上传
    if (!(avatarFile && avatarFile.size > 0)) return setAvatarErr("工会头像不能为空");
    if (!(coverFile && coverFile.size > 0)) return setCoverErr("工会封面不能为空");

    const avatarRes = await uploadFile(`unions/${String(formData.get("title"))}-${timeStamp}/avatar.png`, avatarFile);
    const coverRes = await uploadFile(`unions/${String(formData.get("title"))}-${timeStamp}/cover.png`, coverFile);

    const res = await createUnion({ userId, formData, avatar: avatarRes.url, cover: coverRes.url });

    // 处理校验信息失败
    if (res.ValidationErrors) {
      if (res.ValidationErrors.title) setTitleErr(res.ValidationErrors.title._errors[0]);
      if (res.ValidationErrors.description) setDescriptionErr(res.ValidationErrors.description._errors[0]);
      if (res.ValidationErrors.recruitment) setRecruitmentErr(res.ValidationErrors.recruitment._errors[0]);

      // 删掉上传了的图片
      await deleteMulti([avatarRes.url, coverRes.url]);

      return;
    }

    // 更新成功后
    if (res.status !== 201 || res.message !== "Created") return;
    router.push("/unions");
  }

  return (
    <form action={createUnionAction} className="flex flex-col justify-start">
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
        label="工会名称"
        placeholder="请输入您的工会名称"
        required={true}
        type="text"
        errMsg={titleErr}
      />
      <AppTextarea
        name="description"
        label="工会描述"
        placeholder="请输入您的工会描述"
        required={true}
        rows={10}
        errMsg={descriptionErr}
      />
      <AppTextarea
        name="recruitment"
        label="招募说明"
        placeholder="请输入您希望招募什么样的人才的说明"
        required={true}
        rows={10}
        errMsg={recruitmentErr}
      />

      <div className="h-[50px]">
        <AppButton text="创 建" pendingText="创建中..." type="submit" />
      </div>
    </form>
  );
}
