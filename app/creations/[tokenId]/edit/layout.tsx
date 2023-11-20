import Link from "next/link";
import { notFound } from "next/navigation";
import { createPublicClient, http } from "viem";
import { polygonMumbai } from "viem/chains";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

import { fetchCreation } from "@/actions/creation.action";
import { getCurrentUser } from "@/actions/user.action";

import TitleCard from "@/components/cards/TitleCard";
import CategoryTab from "@/components/shared/CategoryTab";

import { CREATION_CONTRACT } from "@/constants";
import creationContractAbi from "@/contracts/sonarmeta/Creation.json";
import { hiddenAddress } from "@/lib/utils";

export default async function layout({ params, children }: { params: { tokenId: number }; children: React.ReactNode }) {
  const { user } = await getCurrentUser();

  const { res, status } = await fetchCreation({ tokenId: params.tokenId.toString() });

  if (!user || status === 404 || !res) notFound();

  const publicClient = createPublicClient({
    chain: polygonMumbai,
    transport: http(),
  });

  // @ts-ignore
  const owner: `0x${string}` = await publicClient.readContract({
    address: CREATION_CONTRACT,
    abi: creationContractAbi,
    functionName: "ownerOf",
    args: [params.tokenId],
  });

  // TODO，Owner或者是间接持有者
  if (owner !== user.address) notFound();

  // 详情信息卡
  const detailInfo = [
    { info: hiddenAddress(CREATION_CONTRACT), title: "Contract address" },
    { info: `#${params.tokenId}`, title: "Token ID" },
    { info: "ERC-721", title: "Token standard" },
    { info: "Polygon Mumbai", title: "Chain" },
  ];
  const detailCard: JSX.Element[] = detailInfo.map((info, index) => (
    <div key={index} className="flex flex-col gap-2">
      <p className="text-small-medium text-zinc-500">{info.title}</p>
      <p className="text-small-medium line-clamp-1">{info.info}</p>
    </div>
  ));

  return (
    <div className="max-w-4xl flex flex-col gap-10 mx-auto px-6 py-12">
      <h1 className="head-text text-left">Edit creation</h1>

      <CategoryTab
        tabs={["Edit", "Token-bound account", "Holders"]}
        routes={["", "/tba", "/holders"]}
        root={`/creations/${params.tokenId}/edit`}
      />

      <div className="flex item-start gap-6">
        <img className="max-w-[369px] aspect-[1] rounded-xl" src={res?.avatar} alt="creation-image" />

        <div className="flex flex-col gap-6 flex-1">
          <h3 className="flex items-center gap-2 text-body-bold leading-none">
            SonarMeta Creation Network Node
            <FontAwesomeIcon className="w-[18px] text-violet-400" icon={faCircleCheck} />
          </h3>

          <h1 className="head-text leading-none">
            {res?.title} #{params.tokenId}
          </h1>

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
                    {res.externalLink}
                  </Link>
                </div>
              )}
            </div>
          </TitleCard>
        </div>
      </div>

      <TitleCard title="Details">
        <div className="grid sm:grid-cols-4 grid-cols-2 gap-8">{detailCard}</div>
      </TitleCard>

      {children}
    </div>
  );
}
