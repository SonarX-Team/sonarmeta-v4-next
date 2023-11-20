import { notFound } from "next/navigation";

import { getCurrentUser } from "@/actions/user.action";
import { fetchCreation, fetchCreations } from "@/actions/creation.action";

import Contribution from "@/components/forms/Contribution";

import { creationsType } from "@/types/creation.type";

export default async function page({ params }: { params: { tokenId: number } }) {
  const { user } = await getCurrentUser();
  const { res } = await fetchCreation({ tokenId: params.tokenId.toString() });

  if (!user) notFound();

  const ids: number[] = res.derivatives.map((derivatives: { tokenId: string }) => Number(derivatives.tokenId));

  const { creations } = (await fetchCreations({
    pageNumber: 1,
    pageSize: 20,
    tokenIds: ids,
  })) as { creations: creationsType[] };

  return (
    <div className="flex flex-col gap-4">
      {creations.map((creation, index) => (
        <Contribution key={index} {...creation} address={user.address} issuerTokenId={params.tokenId} />
      ))}
    </div>
  );
}
