import { fetchCreation } from "@/actions/creation.action";
import EditCreation from "@/components/forms/EditCreation";

export default async function page({ params }: { params: { tokenId: number } }) {
  const { res } = await fetchCreation({ tokenId: params.tokenId.toString() });

  return <EditCreation tokenId={params.tokenId} agreement={res?.agreement} />;
}
