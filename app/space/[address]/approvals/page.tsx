import Link from "next/link";
import { notFound } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDove } from "@fortawesome/free-solid-svg-icons";

import { fetchIpDaos } from "@/actions/ipdao.action";
import { getCurrentUser } from "@/actions/user.action";

import AddMember from "@/components/forms/AddMember";
import SadPlaceholder from "@/components/shared/SadPlaceholder";
import { inclinedIpDaosType } from "@/types/ipdao.type";

export default async function page({ params }: { params: { address: `0x${string}` } }) {
  const { user } = await getCurrentUser();
  if (!user || user.address !== params.address) notFound(); // 只有自己才能看到本页面

  const { ipDaos } = await fetchIpDaos({ pageNumber: 1, pageSize: 20, owner: user.address, inclined: true });

  const daos = ipDaos ? (ipDaos as inclinedIpDaosType[]) : [];

  // 准备审核列表
  const applications = [];
  for (let i = 0; i < daos.length; i++) {
    for (let j = 0; j < daos[i].inclinedMembers.length; j++) {
      applications.push({
        memberAddr: daos[i].inclinedMembers[j].address,
        memberName: daos[i].inclinedMembers[j].username,
        memberAvatar: daos[i].inclinedMembers[j].avatar,
        ipDaoAddr: daos[i].address,
        ipDaoTitle: daos[i].title,
        ipDaoAvatar: daos[i].avatar,
      });
    }
  }

  return (
    <div>
      <h3 className="flex leading-none text-body-bold text-dark-1 mb-6">
        <FontAwesomeIcon className="w-[16px] h-[16px] mr-2" icon={faDove} />
        IP DAO applications
      </h3>

      <div className="min-h-[200px] max-h-[800px] bg-light-1 rounded-xl px-6 py-3 overflow-y-auto">
        {applications.length > 0 ? (
          applications.map((application, index) => (
            <div key={index} className="flex justify-between items-center gap-3">
              <div className="flex items-center gap-3">
                <p className="flex justify-center items-center w-[24px] h-[24px] bg-violet-200 text-zinc-700 text-small-semibold leading-none rounded-full p-2">
                  {index + 1}
                </p>

                <Link
                  href={`/space/${application.memberAddr}`}
                  className="flex items-center text-violet-700 hover:text-violet-600 duration-200"
                >
                  <p>{application.memberName}</p>
                  {application.memberAvatar ? (
                    <img
                      src={application.memberAvatar}
                      alt={application.memberName}
                      className="w-[24px] aspect-[1] ml-1 rounded-full object-cover"
                    />
                  ) : (
                    <img
                      src="/user.png"
                      alt={application.memberName}
                      className="w-[24px] aspect-[1] ml-1 rounded-full object-cover bg-violet-200 hover:bg-violet-100 duration-150"
                    />
                  )}
                </Link>

                <p className="text-small-regular text-zinc-500 leading-none">wants to join</p>

                <Link
                  href={`/ip-daos/${application.ipDaoAddr}`}
                  className="flex items-center text-violet-700 hover:text-violet-600 duration-200"
                >
                  <p>{application.ipDaoTitle}</p>
                  <img
                    src={application.ipDaoAvatar}
                    alt={application.ipDaoTitle}
                    className="w-[24px] aspect-[1] ml-1 rounded-full object-cover"
                  />
                </Link>
              </div>

              <AddMember adminAddr={user.address} userAddr={application.memberAddr} ipDaoAddr={application.ipDaoAddr} />
            </div>
          ))
        ) : (
          <SadPlaceholder size={300} text="No data source found" />
        )}
      </div>
    </div>
  );
}
