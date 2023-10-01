import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDove, faPeopleGroup, faPersonRunning, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";

import { formatDateString } from "@/lib/utils";
import { UnionsType } from "@/types/UnionTypes";

export default function UnionEntryCard({
  _id,
  title,
  avatar,
  cover,
  members,
  signedIPs,
  adaptations,
  createdAt,
}: UnionsType) {
  return (
    <Link
      href={`/unions/${_id}`}
      className="relative bg-zinc-900 hover:bg-zinc-800 duration-200 rounded-xl overflow-hidden h-full z-0"
    >
      <div className="relative w-full aspect-[16/9] bg-zinc-700 hover:bg-zinc-600 duration-200">
        <Image src={cover} alt="union-cover" fill />
      </div>

      <div className="relative -mt-12 p-4 z-10">
        <Image className="bg-violet-900/70 rounded-full mb-2" src={avatar} alt="union-avatar" width={56} height={56} />

        <h1 className="text-body-bold text-light-2 mb-4">{title}</h1>

        <div className="flex items-center text-small-regular leading-none gap-6 mb-4">
          <div className="flex items-center gap-1 text-zinc-400">
            <FontAwesomeIcon className="w-[16px] h-[16px]" icon={faDove} />
            <p>{signedIPs.length}</p>
          </div>
          <div className="flex items-center gap-1 text-zinc-400">
            <FontAwesomeIcon className="w-[16px] h-[16px]" icon={faWandMagicSparkles} />
            <p>{adaptations.length}</p>
          </div>
          <div className="flex items-center gap-1 text-zinc-400">
            <FontAwesomeIcon className="w-[16px] h-[16px]" icon={faPeopleGroup} />
            <p>{members.length}</p>
          </div>
          <div className="flex items-center gap-1 text-zinc-400">
            <FontAwesomeIcon className="w-[16px] h-[16px]" icon={faPersonRunning} />
            <p>8600</p>
          </div>
        </div>

        <p className="text-subtle-medium text-gray-1">{formatDateString(createdAt)}</p>
      </div>
    </Link>
  );
}
