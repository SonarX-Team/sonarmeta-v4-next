import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFeatherPointed, faImages } from "@fortawesome/free-solid-svg-icons";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";

import { fetchIpDao } from "@/actions/ipdao.action";
import CategoryTab from "@/components/shared/CategoryTab";
import { hiddenAddress } from "@/lib/utils";

export default async function page({ params }: { params: { address: `0x${string}` } }) {
  const { res } = await fetchIpDao({ address: params.address });

  // 基本信息卡
  const basicInfo = [
    {
      count: res && res.members.length > 1 ? res.members.length : 1,
      title: res && res.members.length > 1 ? "Members" : "Member",
    },
    {
      count: res && res.subscribers.length > 0 ? res.subscribers.length : 0,
      title: res && res.subscribers.length > 1 ? "Subscribers" : "Subscriber",
    },
    { count: 48936, title: "Node value" },
  ];
  const basicCard: JSX.Element[] = basicInfo.map((info, index) => (
    <div key={index}>
      <h2 className="text-zinc-800 text-heading4-medium mb-1">{info.count}</h2>
      <p className="flex leading-none text-slate-500 text-small-regular">{info.title}</p>
    </div>
  ));

  return (
    <>
      <div className="bg-light-1">
        <div className="relative pt-6">
          <div className="relative h-[270px] overflow-hidden rounded-xl mx-6 z-0">
            <img
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              src={res?.cover}
              alt="ipdao-cover"
            />
          </div>

          <img
            className="relative -mt-28 ml-16 w-[140px] h-[140px] bg-violet-300 hover:bg-violet-200 duration-200 border-4 border-light-1 rounded-full shadow-lg z-10"
            src={res?.avatar}
            alt="ipdao-avatar"
          />
        </div>

        <div className="flex flex-col gap-6 max-w-7xl mx-auto px-6 mt-3 pb-8">
          <h1 className="head-text">{res?.title}</h1>

          <div className="flex items-center gap-2 text-small-regular">
            <Link
              href={`/space/${res?.owner.address}`}
              className="flex items-center text-violet-700 hover:text-violet-600 duration-200"
            >
              <FontAwesomeIcon className="w-[18px] h-[18px]" icon={faEthereum} />
              {hiddenAddress(params.address)}
            </Link>

            <p className="text-zinc-500">Contract created by</p>

            <Link
              href={`/space/${res?.owner.address}`}
              className="flex items-center gap-1 text-violet-700 hover:text-violet-600 duration-200"
            >
              <p>{res?.owner.username}</p>
              <img
                className="w-[30px] h-[30px] rounded-full object-cover"
                src={res?.owner.avatar}
                alt={"IP DAO NAME"}
              />
            </Link>
          </div>

          <p className="sm:w-1/2">{res?.description}</p>

          <div className="flex items-center sm:gap-16 gap-8">{basicCard}</div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <CategoryTab
            tabs={["Overview", "Creations", "Members"]}
            routes={["/", "/creations", "/members"]}
            root="/create"
          />
        </div>
      </div>

      <div className="flex flex-col gap-8 max-w-7xl mx-auto px-6 py-12">
        <div>
          <h3 className="flex leading-none text-body-bold mb-4">
            <FontAwesomeIcon className="w-[16px] h-[16px] mr-2" icon={faFeatherPointed} />
            Recruitment
          </h3>

          <p className="sm:w-1/2">{res?.description}</p>
        </div>

        <div>
          <h3 className="flex leading-none text-body-bold mb-4">
            <FontAwesomeIcon className="w-[16px] h-[16px] mr-2" icon={faImages} />
            Image collection
          </h3>

          <div className="flex flex-wrap overflow-y-auto h-[200px] gap-4">
            {res?.images.map((image, index) => (
              <div className="flex justify-center items-center bg-zinc-200 rounded-lg min-w-[150px] h-[200px]">
                <img key={index} className="rounded-lg" src={image} alt="ip-image" width={150} height={200} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
