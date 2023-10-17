import Link from "next/link";
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
    <div className="relative bg-light-1 shadow-sm hover:shadow-md duration-200 rounded-xl overflow-hidden h-full z-0">
      <div className="relative w-full aspect-[16/9] bg-zinc-700 hover:bg-zinc-600 duration-200">
        <Link href={`/unions/${_id}`} className="w-fit">
          <img className="w-full" src={cover} alt="union-cover" />
        </Link>
      </div>

      <div className="relative -mt-12 p-4 z-10">
        <Link href={`/unions/${_id}`} className="w-fit">
          <img className="w-[56px] h-[56px] bg-violet-300 rounded-full mb-2" src={avatar} alt="union-avatar" />
        </Link>

        <div className="flex justify-between items-center mb-4">
          <Link href={`/unions/${_id}`} className="w-fit">
            <h4 className="text-body-bold text-violet-700 hover:text-violet-600 duration-200">{title}</h4>
          </Link>

          <div className="flex items-center gap-2">
            {memberMode && (
              <Link
                href={`/unions/${_id}/record-adaptation`}
                className="flex justify-center items-center gap-2 text-small-regular bg-violet-200 hover:bg-violet-200/70 text-zinc-700 duration-200 rounded-lg px-3 py-2"
              >
                <FontAwesomeIcon className="w-[14px] h-[14px]" icon={faDatabase} />
                <p className="leading-none">Record</p>
              </Link>
            )}

            {editMode && (
              <Link
                href={`/edit-union/${_id}`}
                className="flex justify-center items-center gap-2 text-small-regular bg-violet-200 hover:bg-violet-200/70 text-zinc-700 duration-200 rounded-lg px-3 py-2"
              >
                <FontAwesomeIcon className="w-[14px] h-[14px]" icon={faPencil} />
                <p className="leading-none">Edit</p>
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center text-small-regular leading-none gap-6 mb-4">
          <div className="flex items-center gap-1 text-slate-500">
            <FontAwesomeIcon className="w-[16px] h-[16px]" icon={faDove} />
            <p>{signedIPs.length}</p>
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <FontAwesomeIcon className="w-[16px] h-[16px]" icon={faWandMagicSparkles} />
            <p>{adaptations.length}</p>
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <FontAwesomeIcon className="w-[16px] h-[16px]" icon={faPeopleGroup} />
            <p>{members.length}</p>
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <FontAwesomeIcon className="w-[16px] h-[16px]" icon={faBell} />
            <p>8600</p>
          </div>
        </div>

        <p className="text-subtle-medium text-zinc-500">{formatDateString(createdAt)}</p>
      </div>
    </div>
  );
}
