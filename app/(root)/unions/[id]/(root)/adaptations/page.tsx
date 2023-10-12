import { redirect } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";

import { fetchUnion } from "@/actions/union.action";
import SadPlaceholder from "@/components/shared/SadPlaceholder";
import AdaptationCard from "@/components/cards/AdaptationCard";

export default async function page({ params }: { params: { id: string } }) {
  const { unionRes } = await fetchUnion({ unionId: params.id });
  if (!unionRes) redirect("/notfound");

  return (
    <div className="mt-8">
      <h3 className="flex leading-none text-base-regular text-zinc-400 mb-4">
        <FontAwesomeIcon className="w-[16px] h-[16px] mr-2" icon={faWandMagicSparkles} />
        二创列表
      </h3>

      <div className="flex flex-col gap-6">
        {/* {unionRes.adaptations.length > 0 ? <AdaptationCard /> : <SadPlaceholder size={300} text="没有找到任何数据" />} */}
        <AdaptationCard
          title="123"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni deserunt alias, ipsa impedit quam nam, omnis dolores voluptas enim esse reprehenderit totam. Numquam dolore amet, quaerat explicabo praesentium ea quasi?Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni deserunt alias, ipsa impedit quam nam, omnis dolores voluptas enim esse reprehenderit totam. Numquam dolore amet, quaerat explicabo praesentium ea quasi?"
          url="https://baidu.com"
          cover="/auth-bg.webp"
          createdAt="2023-09-28T02:22:54.822+00:00"
        />
      </div>
    </div>
  );
}
