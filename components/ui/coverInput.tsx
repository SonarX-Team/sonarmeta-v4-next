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

const CoverInput: React.FC<Props> = ({ name, defaultValue, required, errMsg }) => {
  const [coverUrl, setCoverUrl] = useState<string>(defaultValue ? defaultValue : "");

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    setCoverUrl(fileUrl);
  };

  return (
    <div className="flex items-center text-small-regular gap-4">
      <div>
        <input
          id="coverInput"
          className="hidden"
          name={name}
          type="file"
          accept="image/*"
          onChange={handleCoverChange}
        />
        <label
          className={`flex flex-col justify-center items-center w-[160px] h-[90px] ${
            !coverUrl
              ? "border-2 border-dashed border-zinc-400 text-zinc-400 bg-white/10 hover:bg-zinc-400/10 duration-200"
              : ""
          } rounded-lg cursor-pointer`}
          htmlFor="coverInput"
        >
          {coverUrl ? (
            <Image className="rounded-lg h-[90px]" src={coverUrl} alt="cover" width={160} height={90} priority />
          ) : (
            <>
              <FontAwesomeIcon className="w-[24px] h-[24px] text-light-2 mb-2" icon={faCloudArrowUp} />
              <p className="text-zinc-400 text-center mx-3">Aspect 16:9</p>
            </>
          )}
        </label>
      </div>

      <div className="text-small-regular">
        <label htmlFor="coverInput" className="text-sky-400 hover:text-sky-300 duration-200 cursor-pointer">
          Select your cover image {required && <span className="text-red-400">*</span>}
        </label>
        {errMsg && <p className="text-red-400 mt-1">{errMsg}</p>}
      </div>
    </div>
  );
};

export default CoverInput;
