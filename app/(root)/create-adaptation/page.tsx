import { redirect } from "next/navigation";
import _ from "lodash";

import { getCurrentUser } from "@/actions/user.action";
import { fetchUnions } from "@/actions/union.action";

import PostAdaptation from "@/components/forms/PostAdaptation";

import { BasicUnionsType } from "@/types/UnionTypes";

export default async function page() {
  const { user } = await getCurrentUser();
  if (!user) redirect("/sign-in");

  // 按当前用户获取可选的公会列表
  const { unions } = await fetchUnions({ pageNumber: 1, pageSize: 20, memberId: user.id });
  const basicUnions: BasicUnionsType[] = [];
  for (let i = 0; i < unions.length; i++) {
    const newUnion = _.pick(unions[i], ["_id", "title", "avatar"]);
    newUnion._id = String(newUnion._id);
    basicUnions.push(newUnion);
  }

  return (
    <div className="w-full max-w-4xl mt-12 px-6">
      <h1 className="head-text text-left mb-10">创建新二创</h1>
      <PostAdaptation userId={user.id} unions={basicUnions} />
    </div>
  );
}
