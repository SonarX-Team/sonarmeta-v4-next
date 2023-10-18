import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandshakeAngle,
  faPeopleGroup,
  faBell,
  faWandMagicSparkles,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";

import { formatDateString } from "@/lib/utils";
import { IPsType } from "@/types/IPTypes";

export default function IPEntryCard({
  _id,
  title,
  description,
  avatar,
  author,
  officialLink,
  createdAt,
  unions,
  adaptations,
  editMode,
}: IPsType & { editMode?: boolean }) {
  return (
    <div className="flex flex-col bg-light-1 shadow-sm hover:shadow-md duration-200 rounded-xl p-7">
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link
              href={`/ips/${_id}`}
              className="relative w-[81px] h-[81px] border-2 rounded-full bg-violet-300 hover:bg-violet-200 duration-200"
            >
              <img src={avatar} alt="user_community_image" className="cursor-pointer rounded-full" />
            </Link>

            <div className="thread-card_bar" />
          </div>

          <div className="flex w-full flex-col gap-2">
            <div className="flex justify-between items-center">
              <Link href={`/ips/${_id}`} className="w-fit">
                <h4 className="cursor-pointer text-body-semibold text-violet-700 hover:text-violet-600 duration-200">
                  {title}
                </h4>
              </Link>

              {editMode && (
                <Link
                  href={`/edit-ip/${_id}`}
                  className="flex justify-center items-center gap-2 text-small-regular bg-violet-200 hover:bg-violet-200/70 text-zinc-700 duration-200 rounded-lg px-3 py-2"
                >
                  <FontAwesomeIcon className="w-[14px] h-[14px]" icon={faPencil} />
                  <p className="leading-none">Edit</p>
                </Link>
              )}
            </div>

            <p className="mt-2 text-small-regular text-dark-2 line-clamp-6 whitespace-pre-line">{description}</p>

            <p className="mt-2">
              <Link
                href={`/ips/${_id}`}
                className="text-small-regular text-violet-700 hover:text-violet-600 duration-200"
              >
                Learn more...
              </Link>
            </p>

            <div className="flex items-center gap-6 mt-5">
              <div className="flex items-center gap-1 text-zinc-500">
                <FontAwesomeIcon className="w-[18px] h-[18px]" icon={faHandshakeAngle} />
                <p className="text-small-regular leading-none">{unions.length}</p>
              </div>
              <div className="flex items-center gap-1 text-zinc-500">
                <FontAwesomeIcon className="w-[18px] h-[18px]" icon={faWandMagicSparkles} />
                <p className="text-small-regular leading-none">{adaptations.length}</p>
              </div>
              <div className="flex items-center gap-1 text-zinc-500">
                <FontAwesomeIcon className="w-[18px] h-[18px]" icon={faPeopleGroup} />
                <p className="text-small-regular leading-none">{100}</p>
              </div>
              <div className="flex items-center gap-1 text-zinc-500">
                <FontAwesomeIcon className="w-[16px] h-[16px]" icon={faBell} />
                <p className="text-small-regular leading-none">{8600}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:flex items-center text-subtle-medium mt-5">
        <p className="text-zinc-500">{formatDateString(createdAt)}</p>

        <p className="text-zinc-500 mx-1 max-sm:hidden">-</p>

        <Link
          href={`/space/${author._id}`}
          className="flex items-center text-violet-700 hover:text-violet-600 duration-200"
        >
          <p>{author.username}</p>
          <img className="w-[24px] h-[24px] ml-1 rounded-full object-cover" src={author.avatar} alt={author.username} />
        </Link>

        <p className="text-zinc-500 mx-1 max-sm:hidden">-</p>

        <Link className="text-violet-700 hover:text-violet-600 duration-200" href={officialLink} target="_blank">
          {officialLink}
        </Link>
      </div>
    </div>
  );
}
