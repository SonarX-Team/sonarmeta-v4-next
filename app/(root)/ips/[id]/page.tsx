import Link from "next/link";
import { redirect } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faImages, faLink } from "@fortawesome/free-solid-svg-icons";

import { fetchIP } from "@/actions/ip.action";

export default async function page({ params }: { params: { id: string } }) {
  const { IPRes } = await fetchIP({ IPId: params.id });
  if (!IPRes) redirect("/notfound");

  return (
    <>
      {IPRes.officialLink && (
        <div className="mt-8">
          <h3 className="flex leading-none text-base-regular text-zinc-700 mb-2">
            <FontAwesomeIcon className="w-[16px] h-[16px] mr-2" icon={faLink} />
            Official link
          </h3>

          <Link
            className="text-small-regular text-violet-700 hover:text-violet-600 duration-200"
            href={IPRes.officialLink}
            target="_blank"
          >
            {IPRes.officialLink}
          </Link>
        </div>
      )}

      <div className="mt-8">
        <h3 className="flex leading-none text-base-regular text-zinc-700 mb-3">
          <FontAwesomeIcon className="w-[16px] h-[16px] mr-2" icon={faImages} />
          IP image collection
        </h3>

        <div className="flex flex-wrap overflow-y-auto h-[200px] gap-4">
          {IPRes.images.map((image, index) => (
            <div
              key={index}
              className="flex justify-center items-center bg-zinc-200 rounded-lg min-w-[150px] h-[200px]"
            >
              <img className="w-[150px] rounded-lg" src={image} alt="ip-image" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="flex leading-none text-base-regular text-zinc-700 mb-4">
          <FontAwesomeIcon className="w-[16px] h-[16px] mr-2" icon={faBook} />
          IP story
        </h3>

        <p className="text-small-regular text-zinc-700 whitespace-pre-line">{IPRes.description}</p>
      </div>
    </>
  );
}
