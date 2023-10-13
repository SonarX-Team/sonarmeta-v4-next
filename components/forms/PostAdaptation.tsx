"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import _ from "lodash";

import { deleteMulti, uploadFile } from "@/lib/alioss";
import { createAdaptation } from "@/actions/adaptation.action";

import CoverInput from "../ui/coverInput";
import IPsPicker from "../ui/IPsPicker";
import AppInput from "../ui/AppInput";
import AppButton from "../ui/AppButton";
import AppTextarea from "../ui/AppTextarea";

import { BasicIPsType } from "@/types/IPTypes";

export default function PostAdaptation({
  userId,
  unionId,
  IPs,
}: {
  userId: string;
  unionId: string;
  IPs: BasicIPsType[];
}) {
  const router = useRouter();

  const [coverErr, setCoverErr] = useState<string>("");
  const [titleErr, setTitleErr] = useState<string>("");
  const [descriptionErr, setDescriptionErr] = useState<string>("");
  const [urlErr, setUrlErr] = useState<string>("");
  const [IPsErr, setIPsErr] = useState<string>("");

  const IPsPicked = useRef<string[]>([]);

  // 创建二创逻辑
  async function createAdaptationAction(formData: FormData) {
    setCoverErr("");
    setTitleErr("");
    setDescriptionErr("");
    setUrlErr("");
    setIPsErr("");

    const timeStamp = Date.now();

    const coverFile = formData.get("cover") as File;

    if (!(coverFile && coverFile.size > 0)) return setCoverErr("二创封面不能为空");
    if (IPsPicked.current.length === 0) return setIPsErr("必须至少选择一个IP");

    // 客户端处理图片上传
    const coverRes = await uploadFile(`adaptations/${timeStamp}/cover.png`, coverFile);

    const res = await createAdaptation({
      userId,
      formData,
      cover: coverRes.url,
      unionId,
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
    if (res.status === 401) {
      setIPsErr("所选IP存在未授权当前工会的情况");
      // 回滚：删掉上传了的图片
      if (coverFile && coverFile.size > 0) await deleteMulti([coverRes.url]);
      return;
    }
    if (res.status === 403) {
      alert("您无权对当前工会进行操作");
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

      <IPsPicker
        label="选择IP（可多选）"
        ips={IPs}
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
