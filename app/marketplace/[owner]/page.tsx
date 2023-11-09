import Link from "next/link";

import { formatDateString } from "@/lib/utils";
import NftEntryCard from "@/components/cards/NftEntryCard";

export default function page({ params }: { params: { owner: string } }) {
  // 基本信息卡
  const basicInfo = [
    { count: "0.013 ETH", title: "Floor price" },
    { count: 48936, title: "Node value" },
    { count: "0.1 ETH", title: "Total volume" },
    { count: 78, title: "Items" },
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
              src="/auth-bg.jpeg"
              alt="authorization-cover"
            />
          </div>

          <img
            className="relative -mt-28 ml-16 w-[140px] h-[140px] bg-violet-300 hover:bg-violet-200 duration-200 border-4 border-light-1 rounded-full shadow-lg z-10"
            src="/user.png"
            alt="authorization-avatar"
          />
        </div>

        <div className="flex flex-col gap-6 max-w-7xl mx-auto px-6 mt-3 pb-12">
          <h1 className="head-text">The name of the original creation</h1>

          <div className="flex items-center text-small-regular">
            <p className="text-zinc-500 mr-1">By</p>

            <Link href={`/space/${1}`} className="flex items-center text-violet-700 hover:text-violet-600 duration-200">
              <p>{"Creation Name"}</p>
              <img className="w-[30px] h-[30px] ml-1 rounded-full object-cover" src="/user.png" alt={"IP DAO NAME"} />
            </Link>
          </div>

          <p className="sm:w-1/2">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis quibusdam numquam nam. Molestias sint,
            nostrum atque vitae maxime perferendis dicta autem quos asperiores inventore alias qui cupiditate possimus
            nulla aut!
          </p>

          <div className="flex items-center sm:gap-16 gap-8">{basicCard}</div>
        </div>
      </div>

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <section className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
            <NftEntryCard
              url={`/marketplace/${params.owner}/authorizations/${0}`}
              title="Design Bear"
              avatar="/nft-cards/nft-1.jpg"
              price="1.33"
              nodeValue="120"
              holderId="1"
              holder="AwonderIP"
              holderAvatar="/user.png"
            />
            <NftEntryCard
              url={`/marketplace/${params.owner}/authorizations/${0}`}
              title="Design Bear"
              avatar="/nft-cards/nft-2.png"
              price="1.33"
              nodeValue="120"
              holderId="2"
              holder="AwonderIP"
              holderAvatar="/user.png"
            />
            <NftEntryCard
              url={`/marketplace/${params.owner}/authorizations/${0}`}
              title="Design Bear"
              avatar="/nft-cards/nft-3.png"
              price="1.33"
              nodeValue="120"
              holderId="3"
              holder="AwonderIP"
              holderAvatar="/user.png"
            />
          </section>
        </div>
      </div>
    </>
  );
}
