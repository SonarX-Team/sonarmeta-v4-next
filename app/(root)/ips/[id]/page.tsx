import Image from "next/image";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faHandshakeAngle,
  faImages,
  faLink,
  faPeopleGroup,
  faPersonRunning,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons";

import { fetchIP } from "@/actions/ip.action";
import { formatDateString } from "@/lib/utils";

export default async function page({ params }: { params: { id: string } }) {
  const { IPRes } = await fetchIP({ IPid: params.id });

  return (
    <div className="relative w-full">
      <div className="relative w-full h-[240px] overflow-hidden z-0">
        <Image
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          src={IPRes.cover}
          alt="IP-cover"
          width={1600}
          height={900}
        />
      </div>

      <div className="relative max-w-4xl mx-auto z-10 -mt-16 px-6">
        <Image
          className="bg-violet-900 hover:bg-violet-800 duration-200 rounded-full"
          src={IPRes.avatar}
          alt="IP-avatar"
          width={140}
          height={140}
        />

        <div className="sm:flex justify-between item-start mt-8">
          <div className="sm:mb-0 mb-8">
            <h1 className="text-heading2-semibold text-zinc-50 mb-1">{IPRes.title}</h1>

            <div className="flex items-center text-small-regular">
              <p className="text-gray-1">{formatDateString(IPRes.createdAt)}</p>

              <p className="text-gray-1 mx-1">由</p>

              <Link
                href={`/profile/${IPRes.author._id}`}
                className="flex items-center text-sky-400 hover:text-sky-300 duration-200"
              >
                <p>{IPRes.author.username}</p>
                <Image
                  src={IPRes.author.avatar}
                  alt={IPRes.author.username}
                  width={30}
                  height={30}
                  className="ml-1 rounded-full object-cover"
                />
              </Link>

              <p className="text-gray-1 mx-1">创建</p>
            </div>
          </div>

          <div className="flex items-start text-small-regular gap-3 leading-none">
            <button className="flex items-center gap-2 border-2 border-rose-400 hover:border-rose-300 text-rose-400 hover:text-rose-300 duration-200 rounded-md px-4 py-2">
              <FontAwesomeIcon className="w-[16px] h-[16px]" icon={faThumbsUp} />
              <p> 8886</p>
            </button>
            <button className="border-2 border-violet-300 hover:border-violet-200 bg-violet-300 hover:bg-violet-200 duration-200 text-zinc-900 rounded-md px-4 py-2">
              + 关注
            </button>
          </div>
        </div>

        <div className="flex items-center sm:gap-16 gap-8 mt-8">
          <div>
            <h2 className="text-zinc-200 text-heading4-medium mb-1">200 +</h2>
            <p className="flex leading-none text-zinc-400 text-small-regular">
              <FontAwesomeIcon className="w-[14px] h-[14px] mr-1" icon={faHandshakeAngle} />
              <span>工会</span>
            </p>
          </div>
          <div>
            <h2 className="text-zinc-200 text-heading4-medium mb-1">1000 +</h2>
            <p className="flex leading-none text-zinc-400 text-small-regular">
              <FontAwesomeIcon className="w-[14px] h-[14px] mr-1" icon={faWandMagicSparkles} />
              <span>二创</span>
            </p>
          </div>
          <div>
            <h2 className="text-zinc-200 text-heading4-medium mb-1">1500 +</h2>
            <p className="flex leading-none items-center text-zinc-400 text-small-regular">
              <FontAwesomeIcon className="w-[14px] h-[14px] mr-1" icon={faPeopleGroup} />
              <span>成员</span>
            </p>
          </div>
          <div>
            <h2 className="text-zinc-200 text-heading4-medium mb-1">8600 +</h2>
            <p className="flex leading-none text-zinc-400 text-small-regular">
              <FontAwesomeIcon className="w-[14px] h-[14px] mr-1" icon={faPersonRunning} />
              <span>关注者</span>
            </p>
          </div>
        </div>

        {IPRes.officialLink && (
          <div className="mt-8">
            <h3 className="flex leading-none text-base-regular text-zinc-400 mb-2">
              <FontAwesomeIcon className="w-[16px] h-[16px] mr-2" icon={faLink} />
              官方链接
            </h3>
            <Link
              className="text-small-regular text-sky-400 hover:text-sky-300 duration-200"
              href={IPRes.officialLink}
              target="_blank"
            >
              {IPRes.officialLink}
            </Link>
          </div>
        )}

        <div className="mt-8">
          <h3 className="flex leading-none text-base-regular text-zinc-400 mb-3">
            <FontAwesomeIcon className="w-[16px] h-[16px] mr-2" icon={faImages} />
            IP图册
          </h3>
          <div className="flex flex-wrap overflow-y-auto h-[200px] gap-4">
            {IPRes.images.map((image, index) => (
              <div className="flex justify-center items-center bg-zinc-800 rounded-lg min-w-[150px] h-[200px]">
                <Image key={index} className="rounded-lg" src={image} alt="ip-image" width={150} height={200} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="flex leading-none text-base-regular text-zinc-400 mb-4">
            <FontAwesomeIcon className="w-[16px] h-[16px] mr-2" icon={faBook} />
            IP故事
          </h3>
          <p className="mt-2 text-small-regular text-zinc-300 whitespace-pre-line">{IPRes.description}</p>
        </div>
      </div>
    </div>
  );
}
