import { notFound } from "next/navigation";

import NodeFactory from "@/components/forms/NodeFactory";
import { getCurrentUser } from "@/actions/user.action";

export default async function page({ params }: { params: { tokenId: number } }) {
  const { user } = await getCurrentUser();
  if (!user) notFound();

  return <NodeFactory userAddr={user.address} tokenId={params.tokenId} />;
}
