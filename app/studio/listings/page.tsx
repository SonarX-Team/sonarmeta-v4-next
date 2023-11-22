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
        <table className="table-fixed w-full">
          <thead className="text-left">
            <tr className="text-base-bold text-zinc-500">
              <th className="border-b-[1px] border-zinc-300 py-2">Represent for</th>
              <th className="border-b-[1px] border-zinc-300 py-2">Available</th>
              <th className="border-b-[1px] border-zinc-300 py-2">Base price</th>
              <th className="border-b-[1px] border-zinc-300 py-2">Amount</th>
              <th className="border-b-[1px] border-zinc-300 py-2">List</th>
            </tr>
          </thead>
          <tbody>
            {creations.map((creation, index) => (
              <StudioListingItem key={index} {...creation} address={user.address} />
            ))}
          </tbody>
        </table>
      ) : (
        <SadPlaceholder size={300} text="Your account has no authorization tokens" />
      )}
    </div>
  );
}
