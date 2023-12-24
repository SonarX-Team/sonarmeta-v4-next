import { createPublicClient, http } from "viem";

import { getCurrentUser } from "@/actions/user.action";
import { fetchCreations } from "@/actions/creation.action";

import StudioCreationCard from "@/components/cards/StudioCreationCard";
import SadPlaceholder from "@/components/shared/SadPlaceholder";

import { CREATION_CONTRACT } from "@/constants";
import creationContractAbi from "@/contracts/sonarmeta/Creation.json";
import { creationsType } from "@/types/creation.type";
import { victionTestnet } from "@/lib/viction";

export default async function page() {
  const { user } = await getCurrentUser();

  if (!user)
    return (
      <p className="mt-3 text-base-regular text-zinc-400">
        Please find &quot;Connect Wallet&quot; button on the topbar and connect it to continue use SonarMeta.
      </p>
    );

  const publicClient = createPublicClient({
    chain: victionTestnet,
    transport: http(),
  });

  // @ts-ignore
  const tokenIds: bigint[] = await publicClient.readContract({
    address: CREATION_CONTRACT,
    abi: creationContractAbi,
    functionName: "getTokenIds",
    args: [user.address],
  });

  const ids: number[] = tokenIds.map((tokenId: bigint) => Number(tokenId));

  const { creations } = (await fetchCreations({
    pageNumber: 1,
    pageSize: 20,
    tokenIds: ids,
  })) as { creations: creationsType[] };

  return (
    <div className="flex flex-col gap-4">
      {creations.length > 0 ? (
        creations.map((creation, index) => <StudioCreationCard key={index} {...creation} />)
      ) : (
        <SadPlaceholder size={300} text="No data source found" />
      )}
    </div>
  );
}
