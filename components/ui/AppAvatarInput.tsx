"use client";

import Image from "next/image";
import { useState } from "react";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  name: string;
  defaultValue: string;
};

const AppAvatarInput: React.FC<Props> = ({ name, defaultValue }) => {
  const [avatarUrl, setAvatarUrl] = useState<string>(defaultValue);

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
            className={`flex justify-center items-center w-[108px] h-[108px] ${
              !avatarUrl
                ? "border-2 border-dashed border-zinc-400 text-zinc-400 bg-white/10 hover:bg-zinc-400/10 duration-200"
                : ""
            } rounded-full cursor-pointer`}
            htmlFor="avatarInput"
          >
            {avatarUrl ? (
              <Image className="rounded-full" src={avatarUrl} alt="avatar" width={108} height={108} />
            ) : (
              <FontAwesomeIcon className="w-[24px] h-[24px] text-light-2" icon={faCloudArrowUp} />
            )}
          </label>
        </div>

        <div className="text-small-regular ml-3">
          <label htmlFor="avatarInput" className="text-sky-400 hover:text-sky-300 duration-200 cursor-pointer">
            选择头像图片
          </label>
          <p className="w-1/2 text-zinc-400">
            在测试版中，我们为了节省开发时间没有提供图片裁剪器，请您自行裁剪一个方形图案，正式版上线后将修复，造成不便请您谅解
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppAvatarInput;
