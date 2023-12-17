import { notFound } from "next/navigation";

import { getCurrentUser } from "@/actions/user.action";
import NodeLockings from "@/components/forms/NodeLockings";
import { isInternship } from "@/actions/creation.action";

export default async function page({ params }: { params: { tokenId: number } }) {
  const { user } = await getCurrentUser();
  if (!user) notFound();

  const { res } = await isInternship({ tokenId: params.tokenId.toString() });

  return (
    <div>
      {res?.map((creation) => {
        creation._id = creation._id.toString();

        return (
          <NodeLockings
            key={creation._id}
            address={user.address}
            issuerTokenId={creation.tokenId}
            inclinedTokenId={params.tokenId}
          />
        );
      })}
    </div>
  );
}
