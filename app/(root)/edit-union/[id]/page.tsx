import { redirect } from "next/navigation";

import { getCurrentUser } from "@/actions/user.action";
import { fetchUnion } from "@/actions/union.action";

import EditUnion from "@/components/forms/EditUnion";

export default async function page({ params }: { params: { id: string } }) {
  const { user } = await getCurrentUser();
  if (!user) redirect("/sign-in");

  // 如果当前用户不是这个Union的创建者或管理员，则跳转404页面
  const { unionRes } = await fetchUnion({ unionId: params.id });
  if (!unionRes || String(unionRes.creator._id) !== user.id) redirect("/notfound");

  return (
    <div className="w-full max-w-4xl mt-12 px-6">
      <h1 className="head-text text-left mb-10">Edit union info (coming soon)</h1>
      <EditUnion
        unionId={String(unionRes._id)}
        userId={user.id}
        avatar={unionRes.avatar}
        cover={unionRes.cover}
        title={unionRes.title}
        description={unionRes.description}
        recruitment={unionRes.recruitment}
      />
    </div>
  );
}
