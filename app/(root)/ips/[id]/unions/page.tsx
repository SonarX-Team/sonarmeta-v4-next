import { redirect } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandshakeAngle } from "@fortawesome/free-solid-svg-icons";

import { fetchIP } from "@/actions/ip.action";
import { fetchUnions } from "@/actions/union.action";

import SadPlaceholder from "@/components/shared/SadPlaceholder";
import UnionEntryCard from "@/components/cards/UnionEntryCard";

export default async function page({ params }: { params: { id: string } }) {
  const { IPRes } = await fetchIP({ IPId: params.id });
  if (!IPRes) redirect("/notfound");

  const { unions } = await fetchUnions({ pageNumber: 1, pageSize: 20, IPId: IPRes._id });

  return (
    <>
      <div className="mt-8">
        <h3 className="flex leading-none text-base-regular text-zinc-400 mb-4">
          <FontAwesomeIcon className="w-[16px] h-[16px] mr-2" icon={faHandshakeAngle} />
          提供孵化的工会
        </h3>

        {unions.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {unions.map((union, index) => (
              <UnionEntryCard key={index} {...union} />
            ))}
          </div>
        ) : (
          <SadPlaceholder size={300} text="没有找到任何数据" />
        )}
      </div>
    </>
  );
}
