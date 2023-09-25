"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

import AvatarInput from "../ui/AvatarInput";
import AppInput from "../ui/AppInput";
import AppButton from "../ui/AppButton";
import AppTextarea from "../ui/AppTextarea";

import { updateUser } from "@/actions/user.action";
import { deleteMulti, uploadFile } from "@/lib/alioss";

type Props = {
  id: string;
  username: string;
  email: string;
  bio: string;
  avatar: string;
};

export default function AccountProfile({ id, username, email, bio, avatar }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [usernameErr, setUsernameErr] = useState<string>("");
  const [emailErr, setEmailErr] = useState<string>("");
  const [bioErr, setBioErr] = useState<string>("");

  async function updateUserAction(formData: FormData) {
    setUsernameErr("");
    setEmailErr("");
    setBioErr("");

    // 客户端处理头像上传
    let avatarUrl = "";
    const avatarFile = formData.get("avatar") as File;
    if (avatarFile && avatarFile.size > 0) {
      const result = await uploadFile(`users/${id}-${String(formData.get("username"))}/avatar.png`, avatarFile);
      avatarUrl = result.url;
    }

    const res = await updateUser({ userId: id, formData, pathname, avatar: avatarUrl });

    // 处理校验信息失败
    if (res.ValidationErrors) {
      if (res.ValidationErrors.username) setUsernameErr(res.ValidationErrors.username._errors[0]);
      if (res.ValidationErrors.email) setEmailErr(res.ValidationErrors.email._errors[0]);
      if (res.ValidationErrors.bio) setBioErr(res.ValidationErrors.bio._errors[0]);

      // 删掉上传了的图片
      await deleteMulti([avatarUrl]);

      return;
    }

    // 更新成功后
    if (res.status !== 200 || res.message !== "Updated") return;

    if (pathname === "/profile/edit") router.back();
    else router.push("/");
  }

  return (
    <form action={updateUserAction} className="flex flex-col justify-start">
      <AvatarInput name="avatar" defaultValue={avatar} />
      <AppInput
        name="username"
        label="用户名"
        defaultValue={username}
        placeholder="请设置您的用户名"
        required={true}
        type="text"
        errMsg={usernameErr}
      />
      <AppInput
        name="email"
        label="邮箱"
        defaultValue={email}
        placeholder="请设置您的邮箱"
        type="text"
        errMsg={emailErr}
      />
      <AppTextarea
        name="bio"
        label="个性描述"
        defaultValue={bio}
        placeholder="请设置您的个性描述"
        rows={3}
        errMsg={bioErr}
      />

      <div className="h-[50px]">
        <AppButton text="提 交" pendingText="提交中..." type="submit" />
      </div>
    </form>
  );
}
