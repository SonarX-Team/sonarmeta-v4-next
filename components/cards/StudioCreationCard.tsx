import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";

import ServerButton from "../ui/ServerButton";
import { formatDateString } from "@/lib/utils";
import { creationsType } from "@/types/creation.type";

export default function StudioCreationCard({ tokenId, title, description, avatar, createdAt }: creationsType) {
  return (
    <div className="flex items-center bg-light-1 shadow-sm hover:shadow-md duration-200 rounded-xl gap-6 p-6">
      <img className="w-[108px] aspect-[1] rounded-xl" src={avatar} alt="creation-avatar" />

      <div className="flex flex-col gap-3 flex-1">
        <h1 className="text-body-bold line-clamp-1">{title}</h1>
        <p className="line-clamp-3 whitespace-pre-line text-small-regular text-zinc-700">{description}</p>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1">
            <FontAwesomeIcon className="w-[18px] text-violet-400" icon={faEthereum} />
            <p className="text-small-regular text-zinc-700 leading-none">#{tokenId}</p>
          </div>

          <p className="text-subtle-medium text-zinc-500 leading-none">{formatDateString(createdAt)}</p>
        </div>
      </div>

      <div className="flex items-center text-small-regular gap-3">
        <Link href={`/creations/${tokenId}/edit`}>
          <ServerButton text="Edit" />
        </Link>
        <Link href={`/creations/${tokenId}`}>
          <ServerButton text="View" />
        </Link>
      </div>
    </div>
  );
}
