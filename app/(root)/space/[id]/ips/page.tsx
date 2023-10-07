import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDove } from "@fortawesome/free-solid-svg-icons";

import { fetchIPs } from "@/actions/ip.action";
import { getCurrentUser } from "@/actions/user.action";

import IPEntryCard from "@/components/cards/IPEntryCard";
import SadPlaceholder from "@/components/shared/SadPlaceholder";

export default async function page({ params }: { params: { id: string } }) {
  const { user } = await getCurrentUser();

  const { IPs } = await fetchIPs({ pageNumber: 1, pageSize: 20, authorId: params.id });

  return (
    <>
      <h3 className="flex leading-none text-body-bold text-light-1 mb-6">
        <FontAwesomeIcon className="w-[16px] h-[16px] mr-2" icon={faDove} />
        创建的IP
      </h3>

      <div className="flex flex-col gap-10">
        {IPs.length > 0 ? (
          IPs.map((IP, index) => <IPEntryCard key={index} {...IP} editMode={String(IP.author._id) === user?.id} />)
        ) : (
          <SadPlaceholder size={300} text="没有找到任何数据" />
        )}
      </div>
    </>
  );
}
