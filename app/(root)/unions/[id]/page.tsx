import { redirect } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";

import { fetchUnion } from "@/actions/union.action";

export default async function page({ params }: { params: { id: string } }) {
  const { unionRes } = await fetchUnion({ unionId: params.id });
  if (!unionRes) redirect("/notfound");

  return (
    <>
      <div className="mt-8">
        <h3 className="flex leading-none text-base-regular text-zinc-400 mb-4">
          <FontAwesomeIcon className="w-[16px] h-[16px] mr-2" icon={faBook} />
          工会描述
        </h3>
        <p className="mt-2 text-small-regular text-zinc-300 whitespace-pre-line">{unionRes.description}</p>
      </div>
    </>
  );
}
