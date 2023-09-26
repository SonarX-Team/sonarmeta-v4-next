"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";
import { faCircleXmark, faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  name: string;
  getResults: (files: File[]) => void;
  errMsg?: string;
};

const ImagesInput: React.FC<Props> = ({ name, getResults, errMsg }) => {
  const [urls, setUrls] = useState<string[]>([]);

  const files = useRef<File[]>([]);

  const AddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const fs = Array.from(e.target.files);

    if (fs.length === 0) return;

    for (let i = 0; i < fs.length; i++) files.current.push(fs[i]);
    getResults(files.current);

    // 因为setUrls是异步的，因此在回调函数内部使用数组prev进行操作可能会导致不可预测的结果，因为prev可能不是最新的状态。
    // 创建一个新的数组newUrls以保存更新后的值，然后再返回
    setUrls((prev) => {
      const newUrls = [...prev];
      for (let i = 0; i < fs.length; i++) {
        const fileUrl = URL.createObjectURL(fs[i]);
        newUrls.push(fileUrl);
      }
      return newUrls;
    });
  };

  const removeImage = (indexToRemove: number) => {
    setUrls((prev) => {
      const newUrls = prev.filter((_, index) => index !== indexToRemove);
      return newUrls;
    });

    files.current = files.current.filter((_, index) => index !== indexToRemove);
    getResults(files.current);
  };

  return (
    <>
      <div className="flex justify-between items-center text-small-regular mb-2">
        <label className="font-bold text-zinc-200">
          添加图片组 <span className="text-red-400">*</span>
        </label>

        {errMsg && <label className="text-red-400 err-message">{errMsg}</label>}
      </div>

      <div className="grid lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-4 grid-cols-2 gap-4 text-small-regular mb-6">
        <div>
          <input
            id="imagesInput"
            className="hidden"
            name={name}
            type="file"
            accept="image/*"
            multiple
            onChange={AddImage}
          />
          <label
            className="flex flex-col justify-center items-center h-[160px] border-2 border-dashed border-zinc-400 text-zinc-400 bg-white/10 hover:bg-zinc-400/10 duration-200 rounded-lg cursor-pointer"
            htmlFor="imagesInput"
          >
            <FontAwesomeIcon className="w-[24px] h-[24px] text-light-2 mb-2" icon={faCloudArrowUp} />
            <p className="text-zinc-400 text-center mx-3">添加图片组</p>
          </label>
        </div>

        {urls.map((url, index) => (
          <div className="flex justify-center items-center relative bg-zinc-800 rounded-lg h-[160px]" key={index}>
            <Image className="rounded-lg" src={url} alt="ip-image" width={120} height={160} />
            <button
              className="flex justify-center items-center absolute top-0 right-0 translate-x-1/3 -translate-y-1/3"
              type="button"
              onClick={() => removeImage(index)}
            >
              <FontAwesomeIcon className="w-[24px] h-[24px] text-red-400 mb-2" icon={faCircleXmark} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default ImagesInput;