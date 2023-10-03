"use client";

import { useState } from "react";

import AvatarInput from "../ui/AvatarInput";
import CoverInput from "../ui/coverInput";
import AppInput from "../ui/AppInput";
import AppTextarea from "../ui/AppTextarea";
import AppButton from "../ui/AppButton";

export default function EditUnion({
  unionId,
  userId,
  avatar,
  cover,
  title,
  description,
  recruitment,
}: {
  unionId: string;
  userId: string;
  avatar: string;
  cover: string;
  title: string;
  description: string;
  recruitment: string;
}) {
  const [avatarErr, setAvatarErr] = useState<string>("");
  const [coverErr, setCoverErr] = useState<string>("");
  const [titleErr, setTitleErr] = useState<string>("");
  const [descriptionErr, setDescriptionErr] = useState<string>("");
  const [recruitmentErr, setRecruitmentErr] = useState<string>("");

  return (
    <div className="flex flex-col justify-start gap-8">
      <form action="" className="sm:flex justify-between items-center">
        <AvatarInput name="avatar" defaultValue={avatar} required={true} errMsg={avatarErr} />
        <div className="flex justify-end sm:mt-0 mt-3">
          <div className="text-small-regular w-[100px] h-[44px]">
            <AppButton text="保存" pendingText="保存中..." type="submit" />
          </div>
        </div>
      </form>

      <hr className="border-bottom-[1px] border-zinc-600" />

      <form action="" className="sm:flex justify-between items-center">
        <CoverInput name="cover" defaultValue={cover} required={true} errMsg={coverErr} />
        <div className="flex justify-end sm:mt-0 mt-3">
          <div className="text-small-regular w-[100px] h-[44px]">
            <AppButton text="保存" pendingText="保存中..." type="submit" />
          </div>
        </div>
      </form>

      <hr className="border-bottom-[1px] border-zinc-600" />

      <form action="" className="">
        <AppInput
          name="title"
          label="工会名称"
          placeholder="请输入您的工会名称"
          defaultValue={title}
          required={true}
          type="text"
          errMsg={titleErr}
        />
        <div className="flex justify-end mt-3">
          <div className="text-small-regular w-[100px] h-[44px]">
            <AppButton text="保存" pendingText="保存中..." type="submit" />
          </div>
        </div>
      </form>

      <hr className="border-bottom-[1px] border-zinc-600" />

      <form action="">
        <h1 className="text-body-bold text-light-1 mb-3">基本信息</h1>

        <div className="flex flex-col justify-start gap-6">
          <AppTextarea
            name="description"
            label="工会描述"
            placeholder="请输入您的工会描述"
            defaultValue={description}
            required={true}
            rows={10}
            errMsg={descriptionErr}
          />
          <AppTextarea
            name="recruitment"
            label="招募说明"
            placeholder="请输入您希望招募什么样的人才的说明"
            defaultValue={recruitment}
            required={true}
            rows={10}
            errMsg={recruitmentErr}
          />
        </div>

        <div className="flex justify-end mt-3">
          <div className="text-small-regular w-[100px] h-[44px]">
            <AppButton text="保存" pendingText="保存中..." type="submit" />
          </div>
        </div>
      </form>
    </div>
  );
}
