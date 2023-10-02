import { redirect } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faPeopleGroup } from "@fortawesome/free-solid-svg-icons";

import { fetchUnion } from "@/actions/union.action";

import SadPlaceholder from "@/components/shared/SadPlaceholder";
import UserCard from "@/components/cards/UserCard";

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

        <p className="text-small-regular text-zinc-300 whitespace-pre-line">{unionRes.description}</p>
      </div>

      <div className="mt-8">
        <h3 className="flex leading-none text-base-regular text-zinc-400 mb-4">
          <FontAwesomeIcon className="w-[16px] h-[16px] mr-2" icon={faPeopleGroup} />
          工会成员
        </h3>

        {unionRes.members.length > 0 ? (
          <div className="grid sm:grid-cols-3 grid-cols-2 gap-4">
            {unionRes.members.map((member, index) => (
              <UserCard key={index} username={member.username} avatar={member.avatar} bio={member.bio} />
            ))}
          </div>
        ) : (
          <SadPlaceholder size={300} text="没有找到任何数据" />
        )}
      </div>
    </>
  );
}
