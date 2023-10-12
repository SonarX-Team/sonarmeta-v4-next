"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

import { requestIP } from "@/actions/ip.action";

import AppButton from "../ui/AppButton";
import SadPlaceholder from "../shared/SadPlaceholder";

import { BasicUnionsType } from "@/types/UnionTypes";

export default function RequestIP({
  userId,
  unions,
  IPId,
}: {
  userId: string | undefined;
  unions: BasicUnionsType[];
  IPId: string;
}) {
  const router = useRouter();
  const path = usePathname();

  const [modalFlag, setModalFlag] = useState<boolean>(false);
  const [unionSelected, setUnionSelected] = useState<string>("");
  const [unionErr, setUnionErr] = useState<string>("");

  async function subscribeAction() {
    if (!userId) return router.push("/sign-in");
    // await subscribeUnion({ userId, IPId, path });
  }

  async function requestAction() {
    if (!userId) return router.push("/sign-in");

    if (!unionSelected) return setUnionErr("* 必须选择一个工会");

    const { status, message } = await requestIP({ adminId: userId, unionId: unionSelected, IPId, path });
    if (status === 401) alert("您无权操作此工会");
    if (status === 400) alert("该工会已经在当前IP的审核列表中，或已经审核通过了");

    // 请求成功后
    if (status === 200 && message === "Requested") {
      setModalFlag(false);
      alert("申请成功");
    }
  }

  const handleClick = (unionId: string) => {
    if (unionSelected !== unionId) setUnionSelected(unionId);
    else setUnionSelected("");
  };

  return (
    <>
      {/* 选择工会列表的弹窗 */}
      {modalFlag && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-70"></div>

          <div className="relative z-10 bg-dark-2 rounded-xl w-[400px] p-6">
            <h2 className="text-body-bold text-light-1 mb-4">选择工会</h2>

            {unions.length > 0 && (
              <>
                <div className="flex flex-col justify-start gap-4 max-h-[800px] overflow-y-auto mb-4">
                  {unions.map((union, index) => (
                    <div
                      key={index}
                      onClick={() => handleClick(union._id)}
                      className={`flex items-center bg-zinc-800 hover:bg-zinc-700 duration-200 border-2 ${
                        unionSelected === union._id
                          ? "border-sky-300 hover:border-zinc-200"
                          : "border-zinc-900 hover:border-zinc-800"
                      } rounded-xl cursor-pointer gap-4 px-4 py-2`}
                    >
                      <Image className="rounded-full" src={union.avatar} alt="user-avatar" width={48} height={48} />
                      <h1 className="flex-1 text-body-bold text-light-2">{union.title}</h1>
                    </div>
                  ))}
                </div>

                <form action={requestAction}>
                  <p className="text-small-regular text-red-400 mb-2">{unionErr}</p>
                  <AppButton text="确定孵化" pendingText="提交中..." type="submit" />
                </form>
              </>
            )}
            {unions.length === 0 && (
              <div className="flex justify-center items-center">
                <SadPlaceholder size={300} text="暂无可选择的工会" />
              </div>
            )}

            {/* 关闭按钮 */}
            <button
              className="absolute top-6 right-6 text-gray-300 hover:text-gray-200"
              onClick={() => setModalFlag(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* 按钮部分 */}
      <div className="flex items-start text-small-regular gap-3 leading-none h-[44px]">
        <form action={subscribeAction}>
          <AppButton text="+ 关注" pendingText="关注中..." type="submit" />
        </form>

        <div>
          <AppButton text="申请孵化" type="button" handleClick={() => setModalFlag(true)} />
        </div>
      </div>
    </>
  );
}
