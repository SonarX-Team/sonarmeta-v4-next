import { redirect } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDove } from "@fortawesome/free-solid-svg-icons";

import { fetchUnion } from "@/actions/union.action";
import { fetchIPs } from "@/actions/ip.action";

import SadPlaceholder from "@/components/shared/SadPlaceholder";
import IPEntryCard from "@/components/cards/IPEntryCard";

export default async function page({ params }: { params: { id: string } }) {
  const { unionRes } = await fetchUnion({ unionId: params.id });
  if (!unionRes) redirect("/notfound");

  const { IPs } = await fetchIPs({ pageNumber: 1, pageSize: 20, unionId: unionRes._id });

  return (
    <div className="mt-8">
      <h3 className="flex leading-none text-base-regular text-zinc-400 mb-4">
        <FontAwesomeIcon className="w-[16px] h-[16px] mr-2" icon={faDove} />
        孵化中的IP
      </h3>

      <div className="flex flex-col gap-10">
        {IPs.length > 0 ? (
          IPs.map((IP, index) => <IPEntryCard key={index} {...IP} />)
        ) : (
          <SadPlaceholder size={300} text="没有找到任何数据" />
        )}
      </div>
    </div>
  );
}
