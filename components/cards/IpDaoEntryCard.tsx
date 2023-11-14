import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faPeopleGroup } from "@fortawesome/free-solid-svg-icons";

import { formatDateString } from "@/lib/utils";
import { ipDaosType } from "@/types/ipdao.type";

export default function IpDaoEntryCard({
  address,
  title,
  description,
  avatar,
  cover,
  members,
  subscribers,
  createdAt,
}: ipDaosType) {
  return (
    <Link
      href={`/ip-daos/${address}`}
      className="flex flex-col bg-light-1 shadow-sm hover:shadow-md duration-200 rounded-xl h-full"
    >
      <div className="relative mb-4">
        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-t-xl z-0">
          <img className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" src={cover} alt="ipdao-cover" />
        </div>

        <img
          className="relative -mt-8 ml-4 w-[56px] aspect-[1] bg-violet-300 hover:bg-violet-200 duration-200 border-2 border-light-1 rounded-full shadow-md z-10"
          src={avatar}
          alt="ipdao-avatar"
        />
      </div>

      <div className="flex-1 px-4 mb-2">
        <h1 className="text-body-bold">{title}</h1>
        <p className="line-clamp-3 whitespace-pre-line text-small-regular text-zinc-700">{description}</p>
      </div>

      <div className="px-4 mb-6">
        <p className="text-subtle-medium text-zinc-500">{formatDateString(createdAt)}</p>
      </div>

      <div className="flex items-end gap-4 px-4 pb-4">
        <div className="flex items-center gap-1">
          <FontAwesomeIcon className="w-[18px] text-violet-400" icon={faPeopleGroup} />
          <p className="text-small-regular text-zinc-700 leading-none">
            {members.length} {members.length > 1 ? "members" : "member"}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <FontAwesomeIcon className="w-[18px] text-violet-400" icon={faBell} />
          <p className="text-small-regular text-zinc-700 leading-none">
            {subscribers.length} {subscribers.length > 1 ? "subscribers" : "subscriber"}
          </p>
        </div>
      </div>
    </Link>
  );
}
