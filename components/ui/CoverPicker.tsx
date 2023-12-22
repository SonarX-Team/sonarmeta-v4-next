"use client";

import { useState } from "react";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  name: string;
  defaultValue?: string;
  required?: boolean;
  errMsg?: string;
};

const CoverPicker: React.FC<Props> = ({ name, defaultValue, required, errMsg }) => {
  const [coverUrl, setCoverUrl] = useState<string>(defaultValue ? defaultValue : "");

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    setCoverUrl(fileUrl);
  };

  return (
    <div className="flex items-center gap-4">
      <div>
        <input
          id="coverPicker"
          className="hidden"
          name={name}
          type="file"
          accept="image/*"
          onChange={handleCoverChange}
        />
        <label
          className={`flex flex-col justify-center items-center w-[160px] h-[90px] ${
            !coverUrl
              ? "border-2 border-dashed border-zinc-400 text-zinc-700 bg-slate-300/30 hover:bg-slate-400/20 duration-200"
              : ""
          } rounded-lg cursor-pointer`}
          htmlFor="coverPicker"
        >
          {coverUrl ? (
            <img className="w-[160px] h-[90px] rounded-lg h-[90px]" src={coverUrl} alt="cover" />
          ) : (
            <>
              <FontAwesomeIcon className="w-[24px] h-[24px] text-dark-2 mb-2" icon={faCloudArrowUp} />
              <p className="text-zinc-700 text-center mx-3">Aspect 16:9</p>
            </>
          )}
        </label>
      </div>

      <div>
        <label htmlFor="coverPicker" className="text-violet-700 hover:text-violet-600 duration-200 cursor-pointer">
          Select your cover image {required && <span className="text-red-600">*</span>}
        </label>
        {errMsg && <p className="text-small-regular text-red-600 mt-1">{errMsg}</p>}
      </div>
    </div>
  );
};

export default CoverPicker;
