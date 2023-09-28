import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandshakeAngle,
  faPeopleGroup,
  faPersonRunning,
  faWandMagicSparkles,
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
}: IPsType) {
  return (
    <div className="flex flex-col bg-dark-2 rounded-xl p-7">
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link
              href={`/ips/${_id}`}
              className="relative w-[81px] h-[81px] rounded-full bg-violet-900 hover:bg-violet-800 duration-200"
            >
              <Image src={avatar} alt="user_community_image" fill className="cursor-pointer rounded-full" />
            </Link>

            <div className="thread-card_bar" />
          </div>

          <div className="flex w-full flex-col">
            <Link href={`/ips/${_id}`} className="w-fit">
              <h4 className="cursor-pointer text-body-semibold text-sky-400 hover:text-sky-300 duration-200">
                {title}
              </h4>
            </Link>

            <p className="mt-2 text-small-regular text-light-2 whitespace-pre-line">{description.slice(0, 240)}</p>

            <p className="mt-2">
              <Link href={`/ips/${_id}`} className="text-small-regular text-sky-400 hover:text-sky-300 duration-200">
                了解更多
              </Link>
            </p>

            <div className="flex items-center gap-6 mt-5">
              <div className="flex items-center gap-1 text-zinc-400">
                <FontAwesomeIcon className="w-[20px] h-[20px]" icon={faHandshakeAngle} />
                <p className="text-small-regular leading-none">{unions.length}</p>
              </div>
              <div className="flex items-center gap-1 text-zinc-400">
                <FontAwesomeIcon className="w-[20px] h-[20px]" icon={faWandMagicSparkles} />
                <p className="text-small-regular leading-none">{adaptations.length}</p>
              </div>
              <div className="flex items-center gap-1 text-zinc-400">
                <FontAwesomeIcon className="w-[20px] h-[20px]" icon={faPeopleGroup} />
                <p className="text-small-regular leading-none">{100}</p>
              </div>
              <div className="flex items-center gap-1 text-zinc-400">
                <FontAwesomeIcon className="w-[20px] h-[20px]" icon={faPersonRunning} />
                <p className="text-small-regular leading-none">{8600}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center text-subtle-medium mt-5">
        <p className="text-gray-1">{formatDateString(createdAt)}</p>

        <p className="text-gray-1 mx-1">-</p>

        <Link
          href={`/profile/${author._id}`}
          className="flex items-center text-sky-400 hover:text-sky-300 duration-200"
        >
          <p>{author.username}</p>
          <Image
            src={author.avatar}
            alt={author.username}
            width={24}
            height={24}
            className="ml-1 rounded-full object-cover"
          />
        </Link>

        <p className="text-gray-1 mx-1">-</p>

        <Link className="text-sky-400 hover:text-sky-300 duration-200" href={officialLink} target="_blank">
          {officialLink}
        </Link>
      </div>
    </div>
  );
}
