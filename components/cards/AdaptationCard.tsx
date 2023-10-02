import Link from "next/link";
import Image from "next/image";

import { formatDateString } from "@/lib/utils";

export default function AdaptationCard({
  title,
  description,
  url,
  cover,
  createdAt,
}: {
  title: string;
  description: string;
  url: string;
  cover: string;
  createdAt: string;
}) {
  return (
    <div className="sm:flex bg-dark-2 rounded-xl overflow-hidden gap-4 p-4">
      <div className="sm:mb-0 mb-2">
        <Image className="rounded-xl" src={cover} alt="adaptation-cover" width={160} height={90} />
      </div>

      <div className="flex flex-col flex-1 gap-2">
        <h1 className="text-body-bold text-light-2">{title}</h1>

        <p className="text-small-regular text-zinc-400">{description}</p>

        <div className="flex items-center text-subtle-medium">
          <p className=" text-gray-1">{formatDateString(createdAt)}</p>
          <p className="text-gray-1 mx-1">-</p>
          <Link className="text-sky-400 hover:text-sky-300 duration-200" href={url} target="_blank">
            {url}
          </Link>
        </div>
      </div>
    </div>
  );
}
