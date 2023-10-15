import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDove,
  faPeopleGroup,
  faBell,
  faWandMagicSparkles,
  faPencil,
  faDatabase,
} from "@fortawesome/free-solid-svg-icons";

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
  memberMode,
  editMode,
}: UnionsType & { memberMode?: boolean; editMode?: boolean }) {
  return (
    <div className="relative bg-dark-2 rounded-xl overflow-hidden h-full z-0">
      <div className="relative w-full aspect-[16/9] bg-zinc-700 hover:bg-zinc-600 duration-200">
        <Link href={`/unions/${_id}`} className="w-fit">
          <Image src={cover} alt="union-cover" fill priority />
        </Link>
      </div>

      <div className="relative -mt-12 p-4 z-10">
        <Link href={`/unions/${_id}`} className="w-fit">
          <Image
            className="bg-violet-900/70 rounded-full mb-2"
            src={avatar}
            alt="union-avatar"
            width={56}
            height={56}
            priority
          />
        </Link>

        <div className="flex justify-between items-center mb-4">
          <Link href={`/unions/${_id}`} className="w-fit">
            <h4 className="text-body-bold text-sky-300 hover:text-sky-200 duration-200">{title}</h4>
          </Link>

          <div className="flex items-center gap-2">
            {memberMode && (
              <Link
                href={`/unions/${_id}/record-adaptation`}
                className="flex justify-center items-center gap-2 text-small-regular bg-sky-300 hover:bg-sky-200 duration-200 rounded-lg px-3 py-2"
              >
                <FontAwesomeIcon className="w-[14px] h-[14px]" icon={faDatabase} />
                <p className="leading-none">Record</p>
              </Link>
            )}

            {editMode && (
              <Link
                href={`/edit-union/${_id}`}
                className="flex justify-center items-center gap-2 text-small-regular bg-sky-300 hover:bg-sky-200 duration-200 rounded-lg px-3 py-2"
              >
                <FontAwesomeIcon className="w-[14px] h-[14px]" icon={faPencil} />
                <p className="leading-none">Edit</p>
              </Link>
            )}
          </div>
        </div>

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
            <FontAwesomeIcon className="w-[16px] h-[16px]" icon={faBell} />
            <p>8600</p>
          </div>
        </div>

        <p className="text-subtle-medium text-gray-1">{formatDateString(createdAt)}</p>
      </div>
    </div>
  );
}
