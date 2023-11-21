import { redirect } from "next/navigation";

export default async function page({ params }: { params: { tokenId: number } }) {
  redirect(`/creations/${params.tokenId}/studio/edit`);
}
