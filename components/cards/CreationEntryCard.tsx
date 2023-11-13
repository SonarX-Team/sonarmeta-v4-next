"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandshakeAngle,
  faPeopleGroup,
  faBell,
  faWandMagicSparkles,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { useContractRead, useNetwork } from "wagmi";

import { formatDateString } from "@/lib/utils";
import { creationsType } from "@/types/creation.type";
import creationContractAbi from "@/contracts/sonarmeta/Creation.json";
import { CREATION_CONTRACT } from "@/constants";

export default function CreationEntryCard({
  title,
  description,
  avatar,
  tokenId,
  externalLink,
  createdAt,
  editMode,
}: creationsType & { editMode?: boolean }) {
  const [owner, setOwner] = useState<`0x${string}`>("0x");

  const { chain } = useNetwork();

  const { data, isSuccess } = useContractRead({
    address: CREATION_CONTRACT,
    abi: creationContractAbi,
    functionName: "ownerOf",
    chainId: chain?.id,
    // @ts-ignore
    args: [tokenId],
  });

  useEffect(() => {
    // @ts-ignore
    if (isSuccess) setOwner(data);
  }, [data, isSuccess]);

  return (
    <div className="flex flex-col bg-light-1 shadow-sm hover:shadow-md duration-200 rounded-xl p-7">
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link
              href={`/creations/${CREATION_CONTRACT}/${tokenId}`}
              className="relative w-[81px] aspect-[1] border-2 rounded-xl bg-violet-300 hover:bg-violet-200 duration-200"
            >
              <img src={avatar} alt="user_community_image" className="cursor-pointer rounded-xl" />
            </Link>

            <div className="thread-card_bar" />
          </div>

          <div className="flex w-full flex-col gap-2">
            <div className="flex justify-between items-center">
              <Link href={`/creations/${CREATION_CONTRACT}/${tokenId}`} className="w-fit">
                <h4 className="cursor-pointer text-body-semibold text-violet-700 hover:text-violet-600 duration-200">
                  {title}
                </h4>
              </Link>

              {editMode && (
                <Link
                  href={`/edit-creation/${CREATION_CONTRACT}/${tokenId}`}
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
                href={`/creations/${CREATION_CONTRACT}/${tokenId}`}
                className="text-small-regular text-violet-700 hover:text-violet-600 duration-200"
              >
                Learn more...
              </Link>
            </p>

            <div className="flex items-center gap-6 mt-5">
              <div className="flex items-center gap-1 text-zinc-500">
                <FontAwesomeIcon className="w-[18px] h-[18px]" icon={faHandshakeAngle} />
                <p className="text-small-regular leading-none">{123}</p>
              </div>
              <div className="flex items-center gap-1 text-zinc-500">
                <FontAwesomeIcon className="w-[18px] h-[18px]" icon={faWandMagicSparkles} />
                <p className="text-small-regular leading-none">{234}</p>
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

        <Link href={`/space/${owner}`} className="flex items-center text-violet-700 hover:text-violet-600 duration-200">
          {owner}
        </Link>

        {externalLink && <p className="text-zinc-500 mx-1 max-sm:hidden">-</p>}

        {externalLink && (
          <Link className="text-violet-700 hover:text-violet-600 duration-200" href={externalLink} target="_blank">
            {externalLink}
          </Link>
        )}
      </div>
    </div>
  );
}
