import { redirect } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";

import { fetchUnion } from "@/actions/union.action";
import { fetchAdaptations } from "@/actions/adaptation.action";

import AdaptationCard from "@/components/cards/AdaptationCard";
import SadPlaceholder from "@/components/shared/SadPlaceholder";

export default async function page({ params }: { params: { id: string } }) {
  const { unionRes } = await fetchUnion({ unionId: params.id });
  if (!unionRes) redirect("/notfound");

  const { adaptations } = await fetchAdaptations({ pageNumber: 1, pageSize: 20, unionId: params.id });

  return (
    <div className="mt-8">
      <h3 className="flex leading-none text-base-regular text-zinc-400 mb-4">
        <FontAwesomeIcon className="w-[16px] h-[16px] mr-2" icon={faWandMagicSparkles} />
        二创列表
      </h3>

      <div className="flex flex-col gap-6">
        {adaptations.length > 0 ? (
          adaptations.map((adaptation, index) => <AdaptationCard key={index} {...adaptation} />)
        ) : (
          <SadPlaceholder size={300} text="没有找到任何数据" />
        )}
      </div>
    </div>
  );
}
