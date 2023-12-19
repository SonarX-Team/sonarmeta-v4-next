import { notFound } from "next/navigation";

import { getCurrentUser } from "@/actions/user.action";
import { getNodeTba } from "@/actions/creation.action";

import NodeListings from "@/components/forms/NodeListings";

export default async function page({ params }: { params: { tokenId: number } }) {
  const { user } = await getCurrentUser();
  if (!user) notFound();

  const { tbaAddr } = await getNodeTba({ tokenId: params.tokenId });

  return <NodeListings userAddr={user.address} tbaAddr={tbaAddr} />;
}
