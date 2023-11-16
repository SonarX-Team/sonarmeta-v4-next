import { createPublicClient, http } from "viem";
import { polygonMumbai } from "viem/chains";

import { getCurrentUser } from "@/actions/user.action";
import { fetchCreations } from "@/actions/creation.action";

import CreateTBA from "@/components/forms/CreateTBA";
import { CREATION_CONTRACT } from "@/constants";
import creationContractAbi from "@/contracts/sonarmeta/Creation.json";
import { creationsType } from "@/types/creation.type";

export default async function page() {
  const { user } = await getCurrentUser();

  if (!user)
    return (
      <p className="mt-3 text-base-regular text-zinc-400">
        Please find &quot;Connect Wallet&quot; button on the topbar and connect it to continue use SonarMeta.
      </p>
    );

  const publicClient = createPublicClient({
    chain: polygonMumbai,
    transport: http(),
  });

  // @ts-ignore
  const tokenIds: bigint[] = await publicClient.readContract({
    address: CREATION_CONTRACT,
    abi: creationContractAbi,
    functionName: "getTokenIds",
    args: [user?.address],
  });

  const ids: number[] = tokenIds.map((tokenId: bigint) => Number(tokenId));

  const { creations } = (await fetchCreations({
    pageNumber: 1,
    pageSize: 20,
    tokenIds: ids,
  })) as { creations: creationsType[] };

  return <CreateTBA address={user.address} creations={creations ? creations : []} />;
}
