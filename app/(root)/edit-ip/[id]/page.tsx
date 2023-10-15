import { redirect } from "next/navigation";

import { getCurrentUser } from "@/actions/user.action";
import { fetchIP } from "@/actions/ip.action";

import EditIP from "@/components/forms/EditIP";

export default async function page({ params }: { params: { id: string } }) {
  const { user } = await getCurrentUser();
  if (!user) redirect("/sign-in");

  // 如果当前用户不是这个IP的创建者或管理员，则跳转404页面
  const { IPRes } = await fetchIP({ IPId: params.id });
  if (!IPRes || String(IPRes.author._id) !== user.id) redirect("/notfound");

  return (
    <div className="w-full max-w-4xl mt-12 px-6">
      <h1 className="head-text text-left mb-10">Edit IP info (coming soon)</h1>
      <EditIP
        IPId={String(IPRes._id)}
        userId={user.id}
        avatar={IPRes.avatar}
        cover={IPRes.cover}
        title={IPRes.title}
        description={IPRes.description}
        agreement={IPRes.agreement}
        officialLink={IPRes.officialLink}
        images={IPRes.images}
      />
    </div>
  );
}
