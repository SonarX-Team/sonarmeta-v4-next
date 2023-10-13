import { redirect } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFeatherPointed } from "@fortawesome/free-solid-svg-icons";

import { fetchIP } from "@/actions/ip.action";

export default async function page({ params }: { params: { id: string } }) {
  const { IPRes } = await fetchIP({ IPId: params.id });
  if (!IPRes) redirect("/notfound");

  return (
    <div className="mt-8">
      <h3 className="flex leading-none text-base-regular text-zinc-400 mb-4">
        <FontAwesomeIcon className="w-[16px] h-[16px] mr-2" icon={faFeatherPointed} />
        Agreement
      </h3>

      <p className="text-small-regular text-zinc-300 whitespace-pre-line">{IPRes.agreement}</p>
    </div>
  );
}
