import { createPublicClient, http } from "viem";
import { polygonMumbai } from "viem/chains";

import { getCurrentUser } from "@/actions/user.action";
import { fetchCreations } from "@/actions/creation.action";

import ApproveMarket from "@/components/forms/ApproveMarket";
import StudioListingItem from "@/components/forms/StudioListingItem";
import SadPlaceholder from "@/components/shared/SadPlaceholder";

import { AUTHORIZATION_CONTRACT } from "@/constants";
import authorizationContractAbi from "@/contracts/sonarmeta/Authorization.json";
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
  const aTokenIds: bigint[] = await publicClient.readContract({
    address: AUTHORIZATION_CONTRACT,
    abi: authorizationContractAbi,
    functionName: "getTokenIds",
    args: [user.address],
  });

  const aids: number[] = aTokenIds.map((tokenId: bigint) => Number(tokenId));

  const { creations } = (await fetchCreations({
    pageNumber: 1,
    pageSize: 20,
    tokenIds: aids,
  })) as { creations: creationsType[] };

  return (
    <div className="flex flex-col gap-8">
      <ApproveMarket address={user.address} />

      {creations.length > 0 ? (
        <div className="table table-fixed w-full">
          <div className="table-header-group">
            <div className="table-row text-base-bold text-zinc-500">
              <div className="table-cell border-b-[1px] border-zinc-300 py-2">Represent for</div>
              <div className="table-cell border-b-[1px] border-zinc-300 py-2">Available</div>
              <div className="table-cell border-b-[1px] border-zinc-300 py-2">Base price</div>
              <div className="table-cell border-b-[1px] border-zinc-300 py-2">Amount</div>
              <div className="table-cell border-b-[1px] border-zinc-300 py-2">List</div>
            </div>
          </div>
          <div className="table-row-group">
            {creations.map((creation, index) => (
              <StudioListingItem key={index} {...creation} address={user.address} />
            ))}
          </div>
        </div>
      ) : (
        <SadPlaceholder size={300} text="Your account has no authorization tokens" />
      )}
    </div>
  );
}
