import Link from "next/link";

import TitleCard from "@/components/cards/TitleCard";
import BuyItem from "@/components/forms/BuyItem";

export default function page({ params }: { params: { owner: string; tokenId: string } }) {
  // 详情信息卡
  const detailInfo = [
    { info: "0x58f1...FE22", title: "Contract address" },
    { info: 1, title: "Token ID" },
    { info: "ERC-1155", title: "Token standard" },
    { info: "Etherum", title: "Blockchain" },
    { info: 12893, title: "Total supply" },
    { info: "creation tba", title: "Issuer" },
  ];
  const detailCard: JSX.Element[] = detailInfo.map((info, index) => (
    <div key={index} className="flex flex-col gap-2">
      <p className="text-small-medium text-zinc-500">{info.title}</p>
      <p className="text-small-medium">{info.info}</p>
    </div>
  ));

  return (
    <div className="py-12">
      <div className="sm:flex max-w-6xl mx-auto px-6 gap-8">
        <div className="flex-1 flex flex-col gap-8">
          <div className="mx-6">
            <img className="rounded-xl" src="/nft-cards/nft-2.png" alt="nft-image" />
          </div>

          <TitleCard title="Description">
            <p className="mb-2">
              By <span className="text-zinc-500">{params.owner}</span>
            </p>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officia provident optio repellendus? Aperiam
              porro quasi, repudiandae dolorem magnam, molestiae facilis asperiores magni ut veniam suscipit quos
              obcaecati vero nostrum cumque.
            </p>
          </TitleCard>

          <TitleCard title="Listings">
            <div className="table w-full">
              <div className="table-header-group">
                <div className="table-row text-base-bold text-zinc-500">
                  <div className="table-cell py-2 text-left">Seller</div>
                  <div className="table-cell py-2 text-left">Base price</div>
                  <div className="table-cell py-2 text-left">Contribution</div>
                  <div className="table-cell py-2 text-left">Pick</div>
                </div>
              </div>
              <div className="table-row-group">
                <div className="table-row">
                  <div className="table-cell py-2">0x58f1...FE22</div>
                  <div className="table-cell py-2">0.013 ETH</div>
                  <div className="table-cell py-2">256</div>
                  <div className="table-cell py-2">
                    <div className="text-small-regular w-[50px] border-[1px] rounded-md border-zinc-300 hover:border-zinc-500 duration-200 px-1">
                      <input className="w-full flex-1 border-none outline-none bg-transparent" type="number" />
                    </div>
                  </div>
                </div>
                <div className="table-row">
                  <div className="table-cell py-2">0x9715...F83f</div>
                  <div className="table-cell py-2">0.013 ETH</div>
                  <div className="table-cell py-2">122</div>
                  <div className="table-cell py-2">
                    <div className="text-small-regular w-[50px] border-[1px] rounded-md border-zinc-300 hover:border-zinc-500 duration-200 px-1">
                      <input className="w-full flex-1 border-none outline-none bg-transparent" type="number" />
                    </div>
                  </div>
                </div>
                <div className="table-row">
                  <div className="table-cell py-2">0xCfb4...f632</div>
                  <div className="table-cell py-2">0.013 ETH</div>
                  <div className="table-cell py-2">354</div>
                  <div className="table-cell py-2">
                    <div className="text-small-regular w-[50px] border-[1px] rounded-md border-zinc-300 hover:border-zinc-500 duration-200 px-1">
                      <input className="w-full flex-1 border-none outline-none bg-transparent" type="number" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TitleCard>

          <TitleCard title="Details">
            <div className="grid grid-cols-4 gap-8">{detailCard}</div>
          </TitleCard>
        </div>

        <div className="relative min-w-[360px]">
          <div className="fixed w-[360px] flex flex-col gap-6">
            <h3 className="text-body-bold leading-none">The name of the original creation</h3>

            <h1 className="head-text leading-none">The name of this token #1</h1>

            <TitleCard title="Settlement calculator">
              <div className="flex flex-col gap-8">
                <div className="flex items-end gap-2">
                  <div className="text-heading3-bold leading-none">0.1 USDC</div>
                  <p className="text-zinc-500 leading-none">in total</p>
                </div>

                <BuyItem price={100000} tokenId={parseInt(params.tokenId)} amount={6} />
              </div>
            </TitleCard>
          </div>
        </div>
      </div>
    </div>
  );
}
