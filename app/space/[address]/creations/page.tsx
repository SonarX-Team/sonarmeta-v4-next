import { createPublicClient, http } from "viem";
import { goerli } from "viem/chains";

import { fetchCreations } from "@/actions/creation.action";

import CreationEntryCard from "@/components/cards/CreationEntryCard";
import SadPlaceholder from "@/components/shared/SadPlaceholder";

import { CREATION_CONTRACT } from "@/constants";
import creationContractAbi from "@/contracts/sonarmeta/Creation.json";

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

  const ids: number[] = tokenIds.map((tokenId: bigint) => Number(tokenId));

  const { creations } = await fetchCreations({ pageNumber: 1, pageSize: 20, tokenIds: ids });

  return (
    <section className="grid xl:grid-cols-3 md:grid-cols-2 gap-4">
      {creations && creations.length > 0 ? (
        creations.map((creation, index) => <CreationEntryCard key={index} {...creation} />)
      ) : (
        <SadPlaceholder size={300} text="No creations available, please mint some first" />
      )}
    </section>
  );
}
