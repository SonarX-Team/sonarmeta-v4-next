"use client";

import { useRef, useState } from "react";

import AvatarInput from "../ui/AvatarInput";
import CoverInput from "../ui/coverInput";
import AppInput from "../ui/AppInput";
import AppTextarea from "../ui/AppTextarea";
import AppButton from "../ui/AppButton";
import ImagesInput from "../ui/ImagesInput";

export default function EditIP({
  IPId,
  userId,
  cover,
  avatar,
  title,
  description,
  agreement,
  officialLink,
  images,
}: {
  IPId: string;
  userId: string;
  avatar: string;
  cover: string;
  title: string;
  description: string;
  agreement: string;
  officialLink: string;
  images: string[];
}) {
  const [avatarErr, setAvatarErr] = useState<string>("");
  const [coverErr, setCoverErr] = useState<string>("");
  const [titleErr, setTitleErr] = useState<string>("");
  const [descriptionErr, setDescriptionErr] = useState<string>("");
  const [agreementErr, setAgreementErr] = useState<string>("");
  const [officialLinkErr, setOfficialLinkErr] = useState<string>("");
  const [imagesErr, setImagesErr] = useState<string>("");

  const imagesAdded = useRef<File[]>([]);

  return (
    <div className="flex flex-col justify-start gap-8">
      <form action="" className="sm:flex justify-between items-center">
        <AvatarInput name="avatar" defaultValue={avatar} required={true} errMsg={avatarErr} />
        <div className="flex justify-end sm:mt-0 mt-3">
          <div className="text-small-regular w-[100px]">
            <AppButton text="保存" pendingText="保存中..." type="submit" />
          </div>
        </div>
      </form>

      <hr className="border-bottom-[1px] border-zinc-600" />

      <form action="" className="sm:flex justify-between items-center">
        <CoverInput name="cover" defaultValue={cover} required={true} errMsg={coverErr} />
        <div className="flex justify-end sm:mt-0 mt-3">
          <div className="text-small-regular w-[100px]">
            <AppButton text="保存" pendingText="保存中..." type="submit" />
          </div>
        </div>
      </form>

      <hr className="border-bottom-[1px] border-zinc-600" />

      <form action="" className="">
        <AppInput
          name="title"
          label="IP名称"
          placeholder="请输入您的IP名称"
          defaultValue={title}
          required={true}
          type="text"
          errMsg={titleErr}
        />
        <div className="flex justify-end mt-3">
          <div className="text-small-regular w-[100px]">
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
            label="IP故事"
            placeholder="请输入您的IP故事"
            defaultValue={description}
            required={true}
            rows={10}
            errMsg={descriptionErr}
          />
          <AppTextarea
            name="agreement"
            label="授权协议"
            placeholder="请输入您希望怎样去授权孵化的具体说明"
            defaultValue={agreement}
            required={true}
            rows={10}
            errMsg={agreementErr}
          />
          <AppInput
            name="officialLink"
            label="IP官网链接"
            placeholder="请输入您的IP官网链接，格式如https://example.com"
            defaultValue={officialLink}
            type="text"
            errMsg={officialLinkErr}
          />
        </div>

        <div className="flex justify-end mt-3">
          <div className="text-small-regular w-[100px]">
            <AppButton text="保存" pendingText="保存中..." type="submit" />
          </div>
        </div>
      </form>

      <hr className="border-bottom-[1px] border-zinc-600" />

      <form action="">
        <ImagesInput
          name="images"
          getResults={(fs: File[]) => (imagesAdded.current = fs)}
          getUrlsLeft={(urls: string[]) => console.log(urls)}
          defaultValue={images}
          errMsg={imagesErr}
        />

        <div className="flex justify-end mt-3">
          <div className="text-small-regular w-[100px]">
            <AppButton text="保存" pendingText="保存中..." type="submit" />
          </div>
        </div>
      </form>
    </div>
  );
}
