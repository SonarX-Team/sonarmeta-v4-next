import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons";

import { fetchIpDao } from "@/actions/ipdao.action";

import UserCard from "@/components/cards/UserCard";
import SadPlaceholder from "@/components/shared/SadPlaceholder";

export default async function page({ params }: { params: { address: `0x${string}` } }) {
  const { res } = await fetchIpDao({ address: params.address });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h3 className="flex leading-none text-zinc-600 mb-4">
        <FontAwesomeIcon className="w-[16px] h-[16px] mr-2" icon={faPeopleGroup} />
        Members
      </h3>

      {res && res.members.length > 0 ? (
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-4">
          {res.members.map((member, index) => (
            <UserCard
              key={index}
              address={member.address}
              username={member.username}
              avatar={member.avatar}
              bio={member.bio}
            />
          ))}
        </div>
      ) : (
        <SadPlaceholder size={300} text="No data source found" />
      )}
    </div>
  );
}
