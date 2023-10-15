"use client";

import { useState } from "react";

import SadPlaceholder from "../shared/SadPlaceholder";
import { BasicIPsType } from "@/types/IPTypes";

type Props = {
  label: string;
  ips: BasicIPsType[];
  getIPs: (IPIds: string[]) => void;
  required?: boolean;
  errMsg?: string;
};

export default function IPsPicker({ label, ips, getIPs, required, errMsg }: Props) {
  const [pickedIPs, setPickedIPs] = useState<string[]>([]);

  const handleClick = (IPId: string) => {
    // 因为setPickedIPs是异步的，因此在回调函数内部使用数组prev进行操作可能会导致不可预测的结果，因为prev可能不是最新的状态。
    // 创建一个新的数组newPickedIPs以保存更新后的值，然后再返回
    if (pickedIPs.includes(IPId)) {
      setPickedIPs((prev) => {
        let newPickedIPs = [...prev];
        newPickedIPs = newPickedIPs.filter((id: string) => id !== IPId);
        getIPs(newPickedIPs);
        return newPickedIPs;
      });
    } else {
      setPickedIPs((prev) => {
        const newPickedIPs = [...prev];
        newPickedIPs.push(IPId);
        getIPs(newPickedIPs);
        return newPickedIPs;
      });
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

      {ips.length > 0 && (
        <div className="grid sm:grid-cols-3 grid-cols-1 gap-4">
          {ips.map((ip, index) => (
            <div
              key={index}
              onClick={() => handleClick(ip._id)}
              className={`flex items-center bg-zinc-900 hover:bg-zinc-800 duration-200 border-2 ${
                pickedIPs.includes(ip._id)
                  ? "border-sky-300 hover:border-zinc-200"
                  : "border-zinc-900 hover:border-zinc-800"
              } rounded-xl cursor-pointer gap-4 px-4 py-2`}
            >
              <img className="w-[48px] h-[48px] rounded-full" src={ip.avatar} alt="user-avatar" />
              <h1 className="flex-1 text-body-bold text-light-2">{ip.title}</h1>
            </div>
          ))}
        </div>
      )}
      {ips.length === 0 && (
        <div className="flex justify-center items-center">
          <SadPlaceholder size={300} text="No IP available" />
        </div>
      )}
    </div>
  );
}
