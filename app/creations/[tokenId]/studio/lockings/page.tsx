import { notFound } from "next/navigation";

import { getCurrentUser } from "@/actions/user.action";
import NodeLockings from "@/components/forms/NodeLockings";
import { getNodeTba, isInternship } from "@/actions/creation.action";

export default async function page({ params }: { params: { tokenId: number } }) {
  const { user } = await getCurrentUser();
  if (!user) notFound();

  const { res } = await isInternship({ tokenId: params.tokenId });
  const { tbaAddr } = await getNodeTba({ tokenId: params.tokenId });

  return (
    <div>
      {res?.map((creation) => (
        <NodeLockings
          key={creation._id}
          issuerTokenId={creation.tokenId}
          inclinedTokenId={params.tokenId}
          tbaAddr={tbaAddr}
        />
      ))}
    </div>
  );
}
