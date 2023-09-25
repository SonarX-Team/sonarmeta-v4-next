"use client";

import Image from "next/image";
import { useState } from "react";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  name: string;
  defaultValue?: string;
  required?: boolean;
  errMsg?: string;
};

const AvatarInput: React.FC<Props> = ({ name, defaultValue, required, errMsg }) => {
  const [avatarUrl, setAvatarUrl] = useState<string>(defaultValue ? defaultValue : "");

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    setAvatarUrl(fileUrl);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center text-small-regular">
        <div className="flex-1">
          <input
            id="avatarInput"
            className="hidden"
            name={name}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
          />
          <label
            className={`flex flex-col justify-center items-center w-[140px] h-[140px] ${
              !avatarUrl
                ? "border-2 border-dashed border-zinc-400 text-zinc-400 bg-white/10 hover:bg-zinc-400/10 duration-200"
                : ""
            } rounded-full cursor-pointer`}
            htmlFor="avatarInput"
          >
            {avatarUrl ? (
              <Image className="rounded-full" src={avatarUrl} alt="avatar" width={140} height={140} />
            ) : (
              <>
                <FontAwesomeIcon className="w-[24px] h-[24px] text-light-2 mb-2" icon={faCloudArrowUp} />
                <p className="text-zinc-400 text-center mx-3">请您裁剪并上传方形图片</p>
              </>
            )}
          </label>
        </div>

        <div className="text-small-regular ml-3">
          <label htmlFor="avatarInput" className="text-sky-400 hover:text-sky-300 duration-200 cursor-pointer">
            选择头像图片 {required && <span className="text-red-400">*</span>}
          </label>
          <p className={`sm:w-1/2 ${errMsg ? "text-red-400" : "text-zinc-400"}`}>
            {errMsg
              ? errMsg
              : "在测试版中，我们为了节省开发时间没有提供图片裁剪器，请您自行裁剪一个按提示比例的图案，正式版上线后将会提供，造成的不便请您谅解"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AvatarInput;
