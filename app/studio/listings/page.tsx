import { createPublicClient, http } from "viem";
import { polygonMumbai } from "viem/chains";

import { getCurrentUser } from "@/actions/user.action";
import { fetchCreations } from "@/actions/creation.action";

import StudioCreationCard from "@/components/cards/StudioCreationCard";
import { AUTHORIZATION_CONTRACT, CREATION_CONTRACT } from "@/constants";
import authorizationContractAbi from "@/contracts/sonarmeta/Authorization.json";
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

  // 从当前登录用户自己的钱包中检索Authorization

  // @ts-ignore
  const aTokenIds: bigint[] = await publicClient.readContract({
    address: AUTHORIZATION_CONTRACT,
    abi: authorizationContractAbi,
    functionName: "getTokenIds",
    args: [user.address],
  });

  const aids: number[] = aTokenIds.map((tokenId: bigint) => Number(tokenId));
  const addrList: `0x${string}`[] = aids.map(() => user.address);

  // @ts-ignore
  const aTokenAmounts: bigint[] = await publicClient.readContract({
    address: AUTHORIZATION_CONTRACT,
    abi: authorizationContractAbi,
    functionName: "balanceOfBatch",
    args: [addrList, aids],
  });

  // 从当前登录用户持有的Creation的TBA中检索Authorization

  // @ts-ignore
  const cTokenIds: bigint[] = await publicClient.readContract({
    address: CREATION_CONTRACT,
    abi: creationContractAbi,
    functionName: "getTokenIds",
    args: [user.address],
  });

  const cids: number[] = cTokenIds.map((tokenId: bigint) => Number(tokenId));

  const { creations } = (await fetchCreations({
    pageNumber: 1,
    pageSize: 20,
    tokenIds: cids,
  })) as { creations: creationsType[] };

  return (
    <div className="flex flex-col gap-4">
      {creations.map((creation, index) => (
        <StudioCreationCard key={index} {...creation} />
      ))}
    </div>
  );
}
