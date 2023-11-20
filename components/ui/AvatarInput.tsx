"use client";

import { useState } from "react";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  name: string;
  label: string;
  type: "square" | "circle";
  defaultValue?: string;
  required?: boolean;
  errMsg?: string;
};

const AvatarInput: React.FC<Props> = ({ name, label, type, defaultValue, required, errMsg }) => {
  const [avatarUrl, setAvatarUrl] = useState<string>(defaultValue ? defaultValue : "");

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    setAvatarUrl(fileUrl);
  };

  return (
    <div className="flex items-center gap-4">
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
              ? "border-2 border-dashed border-zinc-400 text-zinc-700 bg-slate-300/30 hover:bg-slate-400/20"
              : "bg-violet-300 hover:bg-violet-200"
          } duration-200 ${type === "circle" ? "rounded-full" : "rounded-xl"} cursor-pointer`}
          htmlFor="avatarInput"
        >
          {avatarUrl ? (
            <img
              className={`w-[120px] h-[120px] ${type === "circle" ? "rounded-full" : "rounded-xl"}`}
              src={avatarUrl}
              alt="avatar"
            />
          ) : (
            <>
              <FontAwesomeIcon className="w-[24px] h-[24px] text-dark-2 mb-2" icon={faCloudArrowUp} />
              <p className="text-zinc-700 text-center mx-3">Aspect 1:1</p>
            </>
          )}
        </label>
      </div>

      <div>
        <label htmlFor="avatarInput" className="text-violet-700 hover:text-violet-600 duration-200 cursor-pointer">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
        {errMsg && <p className="text-small-regular text-red-600 mt-1">{errMsg}</p>}
      </div>
    </div>
  );
};

export default AvatarInput;
