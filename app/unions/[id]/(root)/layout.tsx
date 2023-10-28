import Link from "next/link";
import { redirect } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDove, faPeopleGroup, faBell, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";

import { fetchUnion } from "@/actions/union.action";
import { getCurrentUser } from "@/actions/user.action";

import { formatDateString } from "@/lib/utils";

import RequestUnion from "@/components/forms/RequestUnion";
import CategoryTab from "@/components/shared/CategoryTab";

export default async function layout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  const { unionRes } = await fetchUnion({ unionId: params.id });
  if (!unionRes) redirect("/notfound");

  const { user } = await getCurrentUser();

  // 检查当前用户是否已经申请加入或已经在这个工会里了
  let requested = false,
    joined = false;
  if (user && unionRes.inclinedMembers.some((memberId) => String(memberId) === user.id)) requested = true;
  if (user && unionRes.members.some((member) => String(member._id) === user.id)) joined = true;

  // 基本信息卡
  const basicInfo = [
    { count: unionRes.signedIPs.length, icon: faDove, title: "Nurtures" },
    { count: unionRes.adaptations.length, icon: faWandMagicSparkles, title: "Adaptations" },
    { count: unionRes.members.length, icon: faPeopleGroup, title: "Members" },
    { count: 0, icon: faBell, title: "Followers" },
  ];
  const basicCard: JSX.Element[] = basicInfo.map((info, index) => (
    <div key={index}>
      <h2 className="text-zinc-800 text-heading4-medium mb-1">{info.count}</h2>
      <p className="flex leading-none text-slate-500 text-small-regular">
        <FontAwesomeIcon className="w-[14px] h-[14px] mr-1" icon={info.icon} />
        <span>{info.title}</span>
      </p>
    </div>
  ));

  return (
    <div className="relative w-full">
      <div className="relative w-full h-[240px] overflow-hidden z-0">
        <img
          className="absolute w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          src={unionRes.cover}
          alt="IP-cover"
        />
      </div>

      <div className="relative max-w-4xl mx-auto z-10 -mt-16 px-6">
        <img
          className="w-[140px] h-[140px] bg-violet-300 hover:bg-violet-200 duration-200 rounded-full"
          src={unionRes.avatar}
          alt="union-avatar"
        />

        <div className="sm:flex justify-between item-start mt-8">
          <div className="sm:mb-0 mb-8">
            <h1 className="text-heading2-semibold mb-1">{unionRes.title}</h1>

            <div className="flex items-center text-small-regular">
              <p className="text-zinc-500">{formatDateString(unionRes.createdAt)}</p>

              <p className="text-zinc-500 mx-1">by</p>

              <Link
                href={`/space/${unionRes.creator._id}`}
                className="flex items-center text-violet-700 hover:text-violet-600 duration-200"
              >
                <p>{unionRes.creator.username}</p>
                <img
                  className="w-[30px] h-[30px] ml-1 rounded-full object-cover"
                  src={unionRes.creator.avatar}
                  alt={unionRes.creator.username}
                />
              </Link>
            </div>
          </div>

          <RequestUnion requested={requested} joined={joined} userId={user?.id} unionId={String(unionRes._id)} />
        </div>

        <div className="flex items-center sm:gap-16 gap-8 my-8">{basicCard}</div>

        <CategoryTab
          tabs={["Intro", "Nurtures", "Adaptations", "Recruitment"]}
          routes={["", "/nurtures", "/adaptations", "/recruitment"]}
          root={`/unions/${params.id}`}
        />

        {children}
      </div>
    </div>
  );
}