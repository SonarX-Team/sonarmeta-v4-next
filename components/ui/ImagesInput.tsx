"use client";

import React, { useRef, useState } from "react";
import { faCircleXmark, faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  name: string;
  getResults: (files: File[]) => void; // 只负责监听客户端文件添加或删除的情况并返回最终文件列表
  getUrlsLeft?: (urls: string[]) => void; // 只负责监听已上传文件被删除的情况并返回最终url列表
  defaultValue?: string[];
  errMsg?: string;
};

const ImagesInput: React.FC<Props> = ({ name, getResults, getUrlsLeft, defaultValue, errMsg }) => {
  const [urls, setUrls] = useState<string[]>(defaultValue ? defaultValue : []);

  const files = useRef<File[]>([]);
  const urlIndexesLength = useRef<number>(defaultValue ? defaultValue.length : 0);

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

    if (indexToRemove < urlIndexesLength.current && !!getUrlsLeft) {
      urlIndexesLength.current -= 1;
      getUrlsLeft(urls.slice(0, urlIndexesLength.current + 1));
    }

    files.current = files.current.filter((_, index) => index !== indexToRemove - urlIndexesLength.current);
    getResults(files.current);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="font-bold text-zinc-800">
          Pictures <span className="text-red-600">*</span>
        </label>

        {errMsg && <label className="text-small-regular text-red-600">{errMsg}</label>}
      </div>

      <p className="text-small-regular text-zinc-500 mb-3">
        Provide additional portfolio images to describe your IP DAO.
      </p>

      <div className="grid lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-4 grid-cols-2 gap-4 text-small-regular">
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
            className="flex flex-col justify-center items-center h-[160px] border-2 border-dashed border-zinc-400 text-zinc-700 bg-slate-300/30 hover:bg-slate-400/20 duration-200 rounded-lg cursor-pointer"
            htmlFor="imagesInput"
          >
            <FontAwesomeIcon className="w-[24px] h-[24px] text-dark-2 mb-2" icon={faCloudArrowUp} />
            <p className="text-zinc-700 text-center mx-3">Add images</p>
          </label>
        </div>

        {urls.map((url, index) => (
          <div className="flex justify-center items-center relative bg-zinc-200 rounded-lg h-[160px]" key={index}>
            <img className="w-[120px] rounded-lg" src={url} alt="ip-image" />
            <button
              className="flex justify-center items-center absolute top-0 right-0 translate-x-1/3 -translate-y-1/3"
              type="button"
              onClick={() => removeImage(index)}
            >
              <FontAwesomeIcon className="w-[24px] h-[24px] text-red-500 mb-2" icon={faCircleXmark} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagesInput;
