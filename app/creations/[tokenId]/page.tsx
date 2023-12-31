import Link from "next/link";
import { createPublicClient, http } from "viem";
import { lineaTestnet } from "viem/chains";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

import { fetchCreation } from "@/actions/creation.action";
import { getCurrentUser } from "@/actions/user.action";

import TitleCard from "@/components/cards/TitleCard";
import TBACard from "@/components/cards/TBACard";
import ApplyAuthorization from "@/components/forms/ApplyAuthorization";
import SadPlaceholder from "@/components/shared/SadPlaceholder";

import { CREATION_CONTRACT } from "@/constants";
import creationContractAbi from "@/contracts/sonarmeta/Creation.json";
import { hiddenAddress } from "@/lib/utils";

export default async function page({ params }: { params: { tokenId: number } }) {
  const { user } = await getCurrentUser();

  const { res } = await fetchCreation({ tokenId: params.tokenId });

  const publicClient = createPublicClient({
    chain: lineaTestnet,
    transport: http(),
  });

  // @ts-ignore
  const owner: `0x${string}` = await publicClient.readContract({
    address: CREATION_CONTRACT,
    abi: creationContractAbi,
    functionName: "ownerOf",
    args: [params.tokenId],
  });

  // 详情信息卡
  const detailInfo = [
    { info: hiddenAddress(CREATION_CONTRACT), title: "Contract address" },
    { info: `#${params.tokenId}`, title: "Token ID" },
    { info: "ERC-721", title: "Token standard" },
    { info: "Linea Testnet", title: "Chain" },
  ];
  const detailCard: JSX.Element[] = detailInfo.map((info, index) => (
    <div key={index} className="flex flex-col gap-2">
      <p className="text-small-medium text-zinc-500">{info.title}</p>
      <p className="text-small-medium line-clamp-1">{info.info}</p>
    </div>
  ));

  return (
    <div className="py-12">
      <div className="md:flex max-w-6xl mx-auto px-6 gap-8">
        <div className="flex-1 flex flex-col gap-8">
          <img className="aspect-[1] rounded-xl" src={res?.avatar} alt="creation-image" />

          <div className="md:hidden flex flex-col gap-4">
            <h3 className="text-body-bold leading-none">SonarMeta Creation Network Node</h3>

            <h1 className="head-text leading-none">
              {res?.title} #{params.tokenId}
            </h1>

            <TitleCard title="Authorization agreement">
              <div className="flex flex-col gap-6">
                <p>{res?.agreement}</p>

                {user && user.address !== owner && (
                  <ApplyAuthorization
                    issuerTokenId={Number(params.tokenId)}
                    issuerAddr={res.tbaAddr}
                    userAddr={user.address}
                  />
                )}
              </div>
            </TitleCard>
          </div>

          <TitleCard title="Description">
            <div className="flex flex-col gap-3">
              <div>
                Owned by{" "}
                <Link className="text-zinc-500 hover:text-zinc-400 duration-200" href={`/space/${owner}`}>
                  {hiddenAddress(owner)}
                </Link>
              </div>
              <p>{res?.description}</p>
              {res && (
                <div className="flex items-center gap-3">
                  <Link
                    className="text-violet-600 hover:text-violet-500 duration-200"
                    href={res.externalLink}
                    target="_blank"
                  >
                    Website
                  </Link>
                </div>
              )}
            </div>
          </TitleCard>

          <TBACard tbaAddr={res.tbaAddr} />

          <TitleCard title="Activity">
            <SadPlaceholder size={300} text="No data source found" />
          </TitleCard>

          <TitleCard title="Details">
            <div className="grid sm:grid-cols-4 grid-cols-2 gap-8">{detailCard}</div>
          </TitleCard>
        </div>

        <div className="relative min-w-[360px]">
          <div className="md:fixed max-md:hidden w-[360px] flex flex-col gap-6">
            <h3 className="flex items-center gap-2 text-body-bold leading-none">
              SonarMeta IP Network Node
              <FontAwesomeIcon className="w-[18px] text-violet-400" icon={faCircleCheck} />
            </h3>

            <h1 className="head-text leading-none">
              {res?.title} #{params.tokenId}
            </h1>

            <TitleCard title="Authorization agreement">
              <div className="flex flex-col gap-6">
                <p>{res?.agreement}</p>

                {user && user.address !== owner && (
                  <ApplyAuthorization
                    issuerTokenId={Number(params.tokenId)}
                    issuerAddr={res.tbaAddr}
                    userAddr={user.address}
                  />
                )}
              </div>
            </TitleCard>
          </div>
        </div>
      </div>
    </div>
  );
}
