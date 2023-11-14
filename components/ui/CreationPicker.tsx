"use client";

import { useEffect, useState } from "react";

import { creationsType } from "@/types/creation.type";

type Props = {
  label: string;
  creations: creationsType[];
  getCreation: (tokenId: number) => void;
  required?: boolean;
  errMsg?: string;
};

export default function CreationPicker({ label, creations, getCreation, required, errMsg }: Props) {
  const [pickedCreation, setPickedCreation] = useState<number>(0);

  useEffect(() => {
    getCreation(pickedCreation);
  }, [pickedCreation, getCreation]);

  return (
    <div>
      <div className="flex justify-between items-center text-small-regular mb-2">
        <label className="font-bold text-zinc-800">
          {label} {required && <span className="text-red-600">*</span>}
        </label>

        {errMsg && <label className="text-red-600">{errMsg}</label>}
      </div>

      <div className="grid sm:grid-cols-3 grid-cols-1 gap-4">
        {creations.map((creation, index) => (
          <div
            key={index}
            onClick={() => setPickedCreation(creation.tokenId)}
            className={`flex items-center bg-light-1 shadow-sm hover:shadow-md duration-200 border-2 ${
              pickedCreation === creation.tokenId ? "border-violet-700" : "border-light-1"
            } rounded-xl cursor-pointer gap-4 px-4 py-2`}
          >
            <img className="w-[48px] h-[48px] rounded-full" src={creation.avatar} alt="user-avatar" />
            <h1 className="flex-1 text-dark-2 line-clamp-2">{creation.title}</h1>
          </div>
        ))}
      </div>
    </div>
  );
}
