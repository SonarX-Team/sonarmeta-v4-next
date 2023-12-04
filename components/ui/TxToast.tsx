"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useNetwork } from "wagmi";

export default function TxToast({ title, hash }: { title: string; hash?: `0x${string}` }) {
  const [url, setUrl] = useState("");

  const { chain } = useNetwork();

  useEffect(() => {
    if (chain?.name === "Polygon Mumbai") setUrl(`https://mumbai.polygonscan.com/tx/${hash}`);
  }, [chain?.name]);

  return (
    <div className="w-[300px] bg-light-1 shadow-lg rounded-xl text-body-normal flex items-center gap-3 py-4 px-6">
      <div>😃</div>
      <div>
        {title}{" "}
        <Link className="text-violet-700 hover:text-violet-600 duration-200" href={url} target="_blank">
          Click here to check
        </Link>
        .
      </div>
    </div>
  );
}
