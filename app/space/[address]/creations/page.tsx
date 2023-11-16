import { createPublicClient, http } from "viem";
import { goerli } from "viem/chains";

import { fetchCreations } from "@/actions/creation.action";

import CreationEntryCard from "@/components/cards/CreationEntryCard";
import SadPlaceholder from "@/components/shared/SadPlaceholder";

import { CREATION_CONTRACT } from "@/constants";
import creationContractAbi from "@/contracts/sonarmeta/Creation.json";
import { creationsType } from "@/types/creation.type";

export default async function page({ params }: { params: { address: `0x${string}` } }) {
  const publicClient = createPublicClient({
    chain: goerli,
    transport: http(),
  });

  // @ts-ignore
  const tokenIds: bigint[] = await publicClient.readContract({
    address: CREATION_CONTRACT,
    abi: creationContractAbi,
    functionName: "getTokenIds",
    args: [params.address],
  });

  // Todo: 之后把本人持有的ipDAO持有的creation也要加进来
  const ids: number[] = tokenIds.map((tokenId: bigint) => Number(tokenId));

  const { creations } = (await fetchCreations({ pageNumber: 1, pageSize: 20, tokenIds: ids })) as {
    creations: creationsType[];
  };

  return (
    <>
      {creations && creations.length > 0 ? (
        <section className="grid xl:grid-cols-3 md:grid-cols-2 gap-4">
          {creations.map((creation, index) => (
            <CreationEntryCard key={index} {...creation} />
          ))}
        </section>
      ) : (
        <SadPlaceholder size={300} text="No creations available, please mint some first" />
      )}
    </>
  );
}
