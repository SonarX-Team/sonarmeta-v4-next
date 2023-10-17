import Link from "next/link";

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
    <div className="sm:flex bg-light-1 shadow-sm hover:shadow-md duration-200 rounded-xl overflow-hidden gap-4 p-4">
      <div className="sm:mb-0 mb-2">
        <img className="w-[160px] rounded-xl" src={cover} alt="adaptation-cover" />
      </div>

      <div className="flex flex-col flex-1 gap-2">
        <h1 className="text-body-bold text-dark-2">{title}</h1>

        <p className="text-small-regular text-zinc-700">{description}</p>

        <div className="flex items-center text-subtle-medium">
          <p className=" text-zinc-500">{formatDateString(createdAt)}</p>
          <p className="text-zinc-500 mx-1">-</p>
          <Link className="text-violet-700 hover:text-violet-600 duration-200" href={url} target="_blank">
            {url}
          </Link>
        </div>
      </div>
    </div>
  );
}
