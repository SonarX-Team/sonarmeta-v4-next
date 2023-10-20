import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  title: string;
  description: string;
  icon: any;
};

const GuideCard: React.FC<Props> = ({ title, description, icon }) => {
  return (
    <div className="flex flex-col gap-4 h-full bg-light-1 rounded-xl shadow-sm hover:shadow-md duration-200 p-6">
      <FontAwesomeIcon className="w-[36px] h-[36px] text-slate-500" icon={icon} />

      <h4 className="text-dark-2 text-body-bold font-bold">{title}</h4>

      <p className="text-zinc-700 text-base-regular">{description}</p>
    </div>
  );
};

export default GuideCard;
