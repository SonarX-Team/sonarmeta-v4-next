import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandshakeAngle } from "@fortawesome/free-solid-svg-icons";

import { fetchUnions } from "@/actions/union.action";
import { getCurrentUser } from "@/actions/user.action";

import UnionEntryCard from "@/components/cards/UnionEntryCard";
import SadPlaceholder from "@/components/shared/SadPlaceholder";

export default async function page({ params }: { params: { id: string } }) {
  const { user } = await getCurrentUser();

  const { unions } = await fetchUnions({ pageNumber: 1, pageSize: 20, memberId: params.id });

  return (
    <>
      <h3 className="flex leading-none text-body-bold text-light-1 mb-6">
        <FontAwesomeIcon className="w-[16px] h-[16px] mr-2" icon={faHandshakeAngle} />
        加入的工会
      </h3>

      {unions.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {unions.map((union, index) => (
            <UnionEntryCard key={index} {...union} editMode={String(union.creator) === user?.id} />
          ))}
        </div>
      ) : (
        <SadPlaceholder size={300} text="没有找到任何数据" />
      )}
    </>
  );
}
