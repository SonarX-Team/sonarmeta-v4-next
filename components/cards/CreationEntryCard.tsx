import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";

import { formatDateString } from "@/lib/utils";
import { creationsType } from "@/types/creation.type";

export default function CreationEntryCard({ tokenId, title, description, avatar, createdAt }: creationsType) {
  return (
    <Link
      href={`/creations/${tokenId}`}
      className="flex flex-col bg-light-1 shadow-sm hover:shadow-md duration-200 rounded-xl h-full"
    >
      <div className="mb-4">
        <div className="relative w-full aspect-[1] overflow-hidden rounded-t-xl z-0">
          <img
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            src={avatar}
            alt="creation-avatar"
          />
        </div>
      </div>

      <div className="flex-1 px-4 mb-6">
        <h1 className="text-body-bold">{title}</h1>
        <p className="line-clamp-3 whitespace-pre-line text-small-regular text-zinc-700">{description}</p>
      </div>

      <div className="flex justify-between items-end px-4 pb-4">
        <div className="flex items-center gap-1">
          <FontAwesomeIcon className="w-[18px] text-violet-400" icon={faEthereum} />
          <p className="text-small-regular text-zinc-700 leading-none">#{tokenId}</p>
        </div>

        <p className="text-subtle-medium text-zinc-500 leading-none">{formatDateString(createdAt)}</p>
      </div>
    </Link>
  );
}
