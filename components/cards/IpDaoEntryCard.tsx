import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandshakeAngle,
  faPeopleGroup,
  faBell,
  faWandMagicSparkles,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";

import { formatDateString, hiddenAddress } from "@/lib/utils";
import { ipDaosType } from "@/types/ipdao.type";

export default function IpDaoEntryCard({
  address,
  title,
  description,
  avatar,
  cover,
  members,
  createdAt,
  editMode,
}: ipDaosType & { editMode?: boolean }) {
  return (
    <Link href={`/ip-daos/${address}`} className="bg-light-1 shadow-sm hover:shadow-md duration-200 rounded-xl h-full">
      <div className="relative mb-4">
        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-t-xl z-0">
          <img className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" src={cover} alt="ipdao-cover" />
        </div>

        <img
          className="relative -mt-8 ml-4 w-[48px] aspect-[1] bg-violet-300 hover:bg-violet-200 duration-200 border-2 border-light-1 rounded-xl shadow-md z-10"
          src={avatar}
          alt="ipdao-avatar"
        />
      </div>

      <div className="px-4 mb-6">
        <h1 className="text-body-bold">{title}</h1>
        <p className="line-clamp-3 whitespace-pre-line text-small-regular text-zinc-700">{description}</p>
      </div>

      <div className="flex justify-between items-end px-4 pb-4">
        <div className="flex items-center gap-1">
          <FontAwesomeIcon className="w-[18px] text-violet-400" icon={faPeopleGroup} />
          <p className="text-small-regular text-zinc-700 leading-none">
            {members.length} {members.length > 1 ? "members" : "member"}
          </p>
        </div>

        <p className="text-subtle-medium text-zinc-500 leading-none">{formatDateString(createdAt)}</p>
      </div>
    </Link>
  );
}
