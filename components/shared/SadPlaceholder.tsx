import React from "react";
import Image from "next/image";

type Props = {
  size: number;
  text: string;
};

const SadPlaceholder: React.FC<Props> = ({ size, text }) => {
  return (
    <div className="flex flex-col justify-center items-center py-12">
      <Image src="/sad.png" alt="sad" width={size} height={size} />
      <p className="text-zinc-500 text-lg">{text}</p>
    </div>
  );
};

export default SadPlaceholder;
