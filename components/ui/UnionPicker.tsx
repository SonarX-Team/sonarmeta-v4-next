"use client";

import { useState } from "react";
import Image from "next/image";

import SadPlaceholder from "../shared/SadPlaceholder";
import { BasicUnionsType } from "@/types/UnionTypes";

type Props = {
  label: string;
  unions: BasicUnionsType[];
  getUnion: (unionId: string) => void;
  required?: boolean;
  errMsg?: string;
};

export default function UnionPicker({ label, unions, getUnion, required, errMsg }: Props) {
  const [currentUnion, setCurrentUnion] = useState<string>("");

  const handleClick = (unionId: string) => {
    if (currentUnion !== unionId) {
      setCurrentUnion(unionId);
      getUnion(unionId);
    } else {
      setCurrentUnion("");
      getUnion("");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center text-small-regular mb-2">
        <label className="font-bold text-zinc-200">
          {label} {required && <span className="text-red-400">*</span>}
        </label>

        {errMsg && <label className="text-red-400">{errMsg}</label>}
      </div>

      {unions.length > 0 && (
        <div className="grid sm:grid-cols-3 grid-cols-1 gap-4">
          {unions.map((union, index) => (
            <div
              key={index}
              onClick={() => handleClick(String(union._id))}
              className={`flex items-center bg-zinc-900 hover:bg-zinc-800 duration-200 border-2 ${
                currentUnion === String(union._id)
                  ? "border-sky-300 hover:border-zinc-200"
                  : "border-zinc-900 hover:border-zinc-800"
              } rounded-xl cursor-pointer gap-4 px-4 py-2`}
            >
              <Image className="rounded-full" src={union.avatar} alt="user-avatar" width={48} height={48} />
              <h1 className="flex-1 text-body-bold text-light-2">{union.title}</h1>
            </div>
          ))}
        </div>
      )}
      {unions.length === 0 && (
        <div className="flex justify-center items-center">
          <SadPlaceholder size={300} text="暂无可选择的工会" />
        </div>
      )}
    </div>
  );
}
