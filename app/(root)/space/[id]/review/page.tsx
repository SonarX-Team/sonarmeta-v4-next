import Link from "next/link";
import { redirect } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDove, faHandshakeAngle } from "@fortawesome/free-solid-svg-icons";

import { fetchIPs } from "@/actions/ip.action";
import { fetchUnions } from "@/actions/union.action";
import { getCurrentUser } from "@/actions/user.action";

import ApproveIP from "@/components/forms/ApproveIP";
import ApproveUnion from "@/components/forms/ApproveUnion";
import SadPlaceholder from "@/components/shared/SadPlaceholder";

export default async function page({ params }: { params: { id: string } }) {
  const { user } = await getCurrentUser();
  if (!user || user.id !== params.id) return redirect("sign-in"); // 只有自己才能看到本页面

  const { IPs } = await fetchIPs({ pageNumber: 1, pageSize: 20, authorId: user.id });
  const { unions } = await fetchUnions({ pageNumber: 1, pageSize: 20, creatorId: user.id });

  // 准备IP的审核列表
  const IPRequests = [];
  for (let i = 0; i < IPs.length; i++) {
    for (let j = 0; j < IPs[i].inclinedUnions.length; j++) {
      IPRequests.push({
        IPId: String(IPs[i]._id),
        IPTitle: IPs[i].title,
        IPAvatar: IPs[i].avatar,
        unionId: String(IPs[i].inclinedUnions[j]._id),
        unionTitle: IPs[i].inclinedUnions[j].title,
        unionAvatar: IPs[i].inclinedUnions[j].avatar,
      });
    }
  }

  // 准备工会的审核列表
  const unionRequests = [];
  for (let i = 0; i < unions.length; i++) {
    for (let j = 0; j < unions[i].inclinedMembers.length; j++) {
      unionRequests.push({
        unionId: String(unions[i]._id),
        unionTitle: unions[i].title,
        unionAvatar: unions[i].avatar,
        memberId: String(unions[i].inclinedMembers[j]._id),
        memberName: unions[i].inclinedMembers[j].username,
        memberAvatar: unions[i].inclinedMembers[j].avatar,
      });
    }
  }

  return (
    <div className="flex flex-col justify-start gap-8">
      <div>
        <h3 className="flex leading-none text-body-bold text-light-1 mb-6">
          <FontAwesomeIcon className="w-[16px] h-[16px] mr-2" icon={faDove} />
          Nurturing applies
        </h3>

        <div className="min-h-[200px] max-h-[800px] bg-dark-2 rounded-xl px-6 py-3 overflow-y-auto">
          {IPRequests.length > 0 ? (
            IPRequests.map((request, index) => (
              <div key={index} className="flex justify-between items-center gap-3">
                <div className="sm:flex items-center gap-3">
                  <p className="flex justify-center items-center w-[24px] h-[24px] bg-violet-600 text-light-1 text-small-semibold leading-none rounded-full p-2">
                    {index + 1}
                  </p>

                  <Link
                    href={`/unions/${request.unionId}`}
                    className="flex items-center text-sky-400 hover:text-sky-300 duration-200"
                  >
                    <p>{request.IPTitle}</p>
                    <img
                      className="w-[24px] h-[24px] ml-1 rounded-full object-cover"
                      src={request.IPAvatar}
                      alt={request.IPTitle}
                    />
                  </Link>

                  <p className="text-small-regular text-zinc-200 leading-none">wants to nurture</p>

                  <Link
                    href={`/ips/${request.IPId}`}
                    className="flex items-center text-sky-400 hover:text-sky-300 duration-200"
                  >
                    <p>{request.unionTitle}</p>
                    <img
                      className="w-[24px] h-[24px] ml-1 rounded-full object-cover"
                      src={request.unionAvatar}
                      alt={request.unionTitle}
                    />
                  </Link>
                </div>

                <ApproveIP adminId={user.id} IPId={request.IPId} unionId={request.unionId} />
              </div>
            ))
          ) : (
            <SadPlaceholder size={300} text="No IPs waiting review" />
          )}
        </div>
      </div>

      <div>
        <h3 className="flex leading-none text-body-bold text-light-1 mb-6">
          <FontAwesomeIcon className="w-[16px] h-[16px] mr-2" icon={faHandshakeAngle} />
          Union applies
        </h3>

        <div className="min-h-[200px] max-h-[800px] bg-dark-2 rounded-xl px-6 py-3 overflow-y-auto">
          {unionRequests.length > 0 ? (
            unionRequests.map((request, index) => (
              <div key={index} className="flex justify-between items-center gap-3">
                <div className="sm:flex items-center gap-3">
                  <p className="flex justify-center items-center w-[24px] h-[24px] bg-violet-600 text-light-1 text-small-semibold leading-none rounded-full p-2">
                    {index + 1}
                  </p>

                  <Link
                    href={`/space/${request.memberId}`}
                    className="flex items-center text-sky-400 hover:text-sky-300 duration-200"
                  >
                    <p>{request.memberName}</p>
                    <img
                      className="w-[24px] h-[24px] ml-1 rounded-full object-cover"
                      src={request.memberAvatar}
                      alt={request.memberName}
                    />
                  </Link>

                  <p className="text-small-regular text-zinc-200 leading-none">wants to join</p>

                  <Link
                    href={`/space/${request.unionId}`}
                    className="flex items-center text-sky-400 hover:text-sky-300 duration-200"
                  >
                    <p>{request.unionTitle}</p>
                    <img
                      className="w-[24px] h-[24px] ml-1 rounded-full object-cover"
                      src={request.unionAvatar}
                      alt={request.unionTitle}
                    />
                  </Link>
                </div>

                <ApproveUnion userId={request.memberId} adminId={user.id} unionId={request.unionId} />
              </div>
            ))
          ) : (
            <SadPlaceholder size={300} text="No unions waiting review" />
          )}
        </div>
      </div>
    </div>
  );
}
