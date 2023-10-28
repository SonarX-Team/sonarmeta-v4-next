import { redirect } from "next/navigation";
import _ from "lodash";

import { getCurrentUser } from "@/actions/user.action";
import { fetchIPs } from "@/actions/ip.action";

import PostAdaptation from "@/components/forms/PostAdaptation";

import { BasicIPsType } from "@/types/IPTypes";

export default async function page({ params }: { params: { id: string } }) {
  const { user } = await getCurrentUser();

  // 按当前页面工会获取与其签约的IP列表
  const { IPs } = await fetchIPs({ pageNumber: 1, pageSize: 20, unionId: params.id });
  const basicIPs: BasicIPsType[] = [];
  for (let i = 0; i < IPs.length; i++) {
    const newIP = _.pick(IPs[i], ["_id", "title", "avatar"]);
    newIP._id = String(newIP._id);
    basicIPs.push(newIP);
  }

  return (
    <div className="w-full max-w-4xl mt-8 px-6">
      <h1 className="head-text text-left mb-10">Create a new adaptation</h1>
      {user ? (
        <PostAdaptation userId={user.id} unionId={params.id} IPs={basicIPs} />
      ) : (
        <p className="mt-3 text-base-regular text-zinc-400">
          Please find &quot;Connect Wallet&quot; button on the topbar and connect it to continue use SonarMeta.
        </p>
      )}
    </div>
  );
}
