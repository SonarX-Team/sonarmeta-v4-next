import { getCurrentUser } from "@/actions/user.action";
import { redirect } from "next/navigation";

import EditIP from "@/components/forms/EditIP";
import { fetchIP } from "@/actions/ip.action";

export default async function page({ params }: { params: { id: string } }) {
  const { user } = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const { IPRes } = await fetchIP({ IPId: params.id });
  if (!IPRes || String(IPRes.author._id) !== user.id) redirect("/notfound");

  return (
    <div className="w-full max-w-4xl mt-12 px-6">
      <h1 className="head-text text-left mb-10">编辑IP信息</h1>
      <EditIP
        IPId={String(IPRes._id)}
        userId={user.id}
        title={IPRes.title}
        description={IPRes.description}
        agreement={IPRes.agreement}
        officialLink={IPRes.officialLink}
        images={IPRes.images}
        avatar={IPRes.avatar}
        cover={IPRes.cover}
      />
    </div>
  );
}
