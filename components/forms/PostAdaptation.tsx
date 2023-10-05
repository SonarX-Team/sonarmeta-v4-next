"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import _ from "lodash";

import { deleteMulti, uploadFile } from "@/lib/alioss";
import { createAdaptation } from "@/actions/adaptation.action";
import { fetchIPs } from "@/actions/ip.action";

import CoverInput from "../ui/coverInput";
import UnionPicker from "../ui/UnionPicker";
import IPsPicker from "../ui/IPsPicker";
import AppInput from "../ui/AppInput";
import AppButton from "../ui/AppButton";
import AppTextarea from "../ui/AppTextarea";

import { BasicUnionsType } from "@/types/UnionTypes";
import { BasicIPsType } from "@/types/IPTypes";

export default function PostAdaptation({ userId, unions }: { userId: string; unions: BasicUnionsType[] }) {
  const router = useRouter();

  const [IPList, setIPList] = useState<BasicIPsType[]>([]);

  const [coverErr, setCoverErr] = useState<string>("");
  const [titleErr, setTitleErr] = useState<string>("");
  const [descriptionErr, setDescriptionErr] = useState<string>("");
  const [urlErr, setUrlErr] = useState<string>("");
  const [unionErr, setUnionErr] = useState<string>("");
  const [IPsErr, setIPsErr] = useState<string>("");

  const unionPicked = useRef<string>("");
  const IPsPicked = useRef<string[]>([]);

  async function changeIPList() {
    // 按当前工会获取与其签约的IP列表
    const { IPs } = await fetchIPs({ pageNumber: 1, pageSize: 20, unionId: unionPicked.current });
    const basicIPs: BasicIPsType[] = [];
    for (let i = 0; i < IPs.length; i++) {
      const newIP = _.pick(IPs[i], ["_id", "title", "avatar"]);
      newIP._id = String(newIP._id);
      basicIPs.push(newIP);
    }

    setIPList(basicIPs);
  }

  // 创建二创逻辑
  async function createAdaptationAction(formData: FormData) {
    setCoverErr("");
    setTitleErr("");
    setDescriptionErr("");
    setUrlErr("");
    setUnionErr("");
    setIPsErr("");

    const timeStamp = Date.now();

    const coverFile = formData.get("cover") as File;

    // 客户端处理图片上传
    if (!(coverFile && coverFile.size > 0)) return setCoverErr("二创封面不能为空");

    if (!unionPicked.current) return setUnionErr("必须选择一个工会");
    if (IPsPicked.current.length === 0) return setIPsErr("必须选择至少一个IP");

    const coverRes = await uploadFile(`adaptations/${String(formData.get("title"))}-${timeStamp}/cover.png`, coverFile);

    const res = await createAdaptation({
      userId,
      formData,
      cover: coverRes.url,
      unionId: unionPicked.current,
      IPIds: IPsPicked.current,
    });

    // 处理校验信息失败
    if (res.ValidationErrors) {
      if (res.ValidationErrors.title) setTitleErr(res.ValidationErrors.title._errors[0]);
      if (res.ValidationErrors.description) setDescriptionErr(res.ValidationErrors.description._errors[0]);
      if (res.ValidationErrors.url) setUrlErr(res.ValidationErrors.url._errors[0]);

      // 回滚：删掉上传了的图片
      if (coverFile && coverFile.size > 0) await deleteMulti([coverRes.url]);

      return;
    }

    // 处理4开头异常
    if (res.status) {
      if (res.status === 401) setIPsErr("所选IP存在未授权选定工会的情况");
      else if (res.status === 403) setUnionErr("您无权对选定的工会进行操作");

      // 回滚：删掉上传了的图片
      if (coverFile && coverFile.size > 0) await deleteMulti([coverRes.url]);

      return;
    }

    // 更新成功后
    if (res.status !== 201 || res.message !== "Created") return;
    router.back();
  }

  return (
    <form action={createAdaptationAction} className="flex flex-col justify-start gap-8">
      <CoverInput name="cover" required={true} errMsg={coverErr} />

      <UnionPicker
        label="选择工会"
        unions={unions}
        getUnion={(unionId: string) => {
          unionPicked.current = unionId;
          if (unionPicked.current) changeIPList();
        }}
        required={true}
        errMsg={unionErr}
      />
      <IPsPicker
        label="选择IP（可多选）"
        ips={IPList}
        getIPs={(IPIds: string[]) => (IPsPicked.current = IPIds)}
        required={true}
        errMsg={IPsErr}
      />

      <AppInput
        name="title"
        label="二创名称"
        placeholder="请输入您的二创名称"
        required={true}
        type="text"
        errMsg={titleErr}
      />
      <AppTextarea
        name="description"
        label="二创简介"
        placeholder="请输入您的二创简介"
        required={true}
        rows={10}
        errMsg={descriptionErr}
      />
      <AppInput
        name="url"
        label="二创链接"
        placeholder="请输入二创发布平台的链接，格式如https://example.com"
        required={true}
        type="text"
        errMsg={urlErr}
      />

      <div className="h-[50px]">
        <AppButton text="创 建" pendingText="创建中..." type="submit" />
      </div>
    </form>
  );
}
