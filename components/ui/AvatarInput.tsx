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
    <div className="flex items-center text-small-regular gap-4">
      <div>
        <input
          id="avatarInput"
          className="hidden"
          name={name}
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
        />
        <label
          className={`flex flex-col justify-center items-center w-[120px] h-[120px] ${
            !avatarUrl
              ? "border-2 border-dashed border-zinc-400 text-zinc-400 bg-white/10 hover:bg-zinc-400/10"
              : "bg-violet-900 hover:bg-violet-800"
          } duration-200 rounded-full cursor-pointer`}
          htmlFor="avatarInput"
        >
          {avatarUrl ? (
            <Image className="rounded-full" src={avatarUrl} alt="avatar" width={120} height={120} priority />
          ) : (
            <>
              <FontAwesomeIcon className="w-[24px] h-[24px] text-light-2 mb-2" icon={faCloudArrowUp} />
              <p className="text-zinc-400 text-center mx-3">Aspect 1:1</p>
            </>
          )}
        </label>
      </div>

      <div className="text-small-regular">
        <label htmlFor="avatarInput" className="text-sky-400 hover:text-sky-300 duration-200 cursor-pointer">
          Select your avatar image {required && <span className="text-red-400">*</span>}
        </label>
        {errMsg && <p className="text-red-400 mt-1">{errMsg}</p>}
      </div>
    </div>
  );
};

export default AvatarInput;
