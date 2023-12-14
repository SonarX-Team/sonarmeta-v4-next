import { createPublicClient, http } from "viem";
import { polygonMumbai } from "viem/chains";

import NodeListings from "@/components/forms/NodeListings";
import { CREATION_CONTRACT } from "@/constants";
import creationContractAbi from "@/contracts/sonarmeta/Creation.json";

export default async function page({ params }: { params: { tokenId: number } }) {
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

  return <NodeListings address={owner} tokenId={params.tokenId} />;
}
