import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDove, faHandshakeAngle } from "@fortawesome/free-solid-svg-icons";

import { fetchUnions } from "@/actions/union.action";
import { getCurrentUser } from "@/actions/user.action";

import ApproveUnion from "@/components/forms/ApproveUnion";
import SadPlaceholder from "@/components/shared/SadPlaceholder";

export default async function page({ params }: { params: { id: string } }) {
  const { user } = await getCurrentUser();

  const { unions } = await fetchUnions({ pageNumber: 1, pageSize: 20, userId: params.id });

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
        <h3 className="flex leading-none text-body-bold text-light-1 mb-3">
          <FontAwesomeIcon className="w-[16px] h-[16px] mr-2" icon={faDove} />
          孵化申请
        </h3>

        {/* <div className="min-h-[200px] max-h-[800px] overflow-y-auto">
          {unionRequests.length > 0 ? (
            unionRequests.map((request, index) => (
              <div key={index} className="flex justify-between items-center text-small-regular">
                <div className="flex items-center">
                  <Link
                    href={`/space/${request.memberId}`}
                    className="flex items-center text-sky-400 hover:text-sky-300 duration-200"
                  >
                    <p>{request.memberName}</p>
                    <Image
                      src={request.memberAvatar}
                      alt={request.memberName}
                      width={24}
                      height={24}
                      className="ml-1 rounded-full object-cover"
                    />
                  </Link>

                  <p className="text-zinc-400 mx-1">想要申请加入</p>

                  <Link
                    href={`/space/${request.unionId}`}
                    className="flex items-center text-sky-400 hover:text-sky-300 duration-200"
                  >
                    <p>{request.unionTitle}</p>
                    <Image
                      src={request.unionAvatar}
                      alt={request.unionTitle}
                      width={24}
                      height={24}
                      className="ml-1 rounded-full object-cover"
                    />
                  </Link>
                </div>

                <ApproveUnion userId={user?.id} unionId={request.unionId} path={`/space/${params.id}/request`} />
              </div>
            ))
          ) : (
            <SadPlaceholder size={300} text="没有找到任何数据" />
          )}
        </div> */}
      </div>

      <div>
        <h3 className="flex leading-none text-body-bold text-light-1 mb-3">
          <FontAwesomeIcon className="w-[16px] h-[16px] mr-2" icon={faHandshakeAngle} />
          工会申请
        </h3>

        <div className="min-h-[200px] max-h-[800px] bg-dark-2 rounded-xl px-6 py-3 overflow-y-auto">
          {unionRequests.length > 0 ? (
            unionRequests.map((request, index) => (
              <div key={index} className="flex justify-between items-center gap-3">
                <div className="sm:flex items-center gap-3">
                  <p className="flex justify-center items-center w-[24px] h-[24px] bg-red-600 text-light-1 text-small-semibold leading-none rounded-full p-2">
                    {index + 1}
                  </p>

                  <Link
                    href={`/space/${request.memberId}`}
                    className="flex items-center text-sky-400 hover:text-sky-300 duration-200"
                  >
                    <p>{request.memberName}</p>
                    <Image
                      src={request.memberAvatar}
                      alt={request.memberName}
                      width={24}
                      height={24}
                      className="ml-1 rounded-full object-cover"
                    />
                  </Link>

                  <p className="text-small-regular text-zinc-200 leading-none">想要申请加入</p>

                  <Link
                    href={`/space/${request.unionId}`}
                    className="flex items-center text-sky-400 hover:text-sky-300 duration-200"
                  >
                    <p>{request.unionTitle}</p>
                    <Image
                      src={request.unionAvatar}
                      alt={request.unionTitle}
                      width={24}
                      height={24}
                      className="ml-1 rounded-full object-cover"
                    />
                  </Link>
                </div>

                <ApproveUnion
                  userId={request.memberId}
                  unionId={request.unionId}
                  path={`/space/${params.id}/request`}
                />
              </div>
            ))
          ) : (
            <SadPlaceholder size={300} text="没有找到任何数据" />
          )}
        </div>
      </div>
    </div>
  );
}
