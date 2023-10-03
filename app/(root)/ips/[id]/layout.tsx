import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faHandshakeAngle, faPeopleGroup, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";

import { fetchIP } from "@/actions/ip.action";
import { getMembersFromUnions } from "@/actions/union.action";
import { formatDateString } from "@/lib/utils";
import RequestIP from "@/components/forms/RequestIP";
import CategoryTab from "@/components/shared/CategoryTab";

export default async function layout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  const { IPRes } = await fetchIP({ IPId: params.id });
  if (!IPRes) redirect("/notfound");

  const { members } = await getMembersFromUnions({ unionIds: IPRes.unions });
  console.log(members);

  // 基本信息卡
  const basicInfo = [
    { count: IPRes.unions.length, icon: faHandshakeAngle, title: "工会" },
    { count: IPRes.adaptations.length, icon: faWandMagicSparkles, title: "二创" },
    { count: members.length, icon: faPeopleGroup, title: "孵化者" },
    { count: 0, icon: faBell, title: "关注" },
  ];
  const basicCard: JSX.Element[] = basicInfo.map((info, index) => (
    <div key={index}>
      <h2 className="text-zinc-200 text-heading4-medium mb-1">{info.count}</h2>
      <p className="flex leading-none text-zinc-400 text-small-regular">
        <FontAwesomeIcon className="w-[14px] h-[14px] mr-1" icon={info.icon} />
        <span>{info.title}</span>
      </p>
    </div>
  ));

  return (
    <div className="relative w-full">
      <div className="relative w-full h-[240px] overflow-hidden z-0">
        <Image
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          src={IPRes.cover}
          alt="IP-cover"
          width={1600}
          height={900}
        />
      </div>

      <div className="relative max-w-4xl mx-auto z-10 -mt-16 px-6">
        <Image
          className="bg-violet-900 hover:bg-violet-800 duration-200 rounded-full"
          src={IPRes.avatar}
          alt="IP-avatar"
          width={140}
          height={140}
        />

        <div className="sm:flex justify-between item-start mt-8">
          <div className="sm:mb-0 mb-8">
            <h1 className="text-heading2-semibold text-zinc-50 mb-1">{IPRes.title}</h1>

            <div className="flex items-center text-small-regular">
              <p className="text-gray-1">{formatDateString(IPRes.createdAt)}</p>

              <p className="text-gray-1 mx-1">由</p>

              <Link
                href={`/profile/${IPRes.author._id}`}
                className="flex items-center text-sky-400 hover:text-sky-300 duration-200"
              >
                <p>{IPRes.author.username}</p>
                <Image
                  src={IPRes.author.avatar}
                  alt={IPRes.author.username}
                  width={30}
                  height={30}
                  className="ml-1 rounded-full object-cover"
                />
              </Link>

              <p className="text-gray-1 mx-1">创建</p>
            </div>
          </div>

          {/* <RequestIP
            requested={requested}
            joined={joined}
            IPId={String(IPRes._id)}
            unionId={String(unionRes._id)}
            path={`/ips/${params.id}`}
          /> */}
        </div>

        <div className="flex items-center sm:gap-16 gap-8 my-8">{basicCard}</div>

        <CategoryTab
          tabs={["简介", "工会", "二创", "授权协议"]}
          routes={["", "/unions", "/adaptations", "/agreement"]}
          root={`/ips/${params.id}`}
        />

        {children}
      </div>
    </div>
  );
}
