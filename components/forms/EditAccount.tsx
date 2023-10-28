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
import { UserBasicType } from "@/types/UserTypes";

export default function EditAccount({ _id, address, username, email, bio, avatar }: UserBasicType) {
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
    let avatarUrl = avatar;
    const avatarFile = formData.get("avatar") as File;
    if (avatarFile && avatarFile.size > 0) {
      const result = await uploadFile(`users/${_id}-${String(formData.get("username"))}/avatar.png`, avatarFile);
      avatarUrl = result.url;
    }

    const res = await updateUser({ userId: _id, address, formData, pathname, avatar: avatarUrl });

    // 处理校验信息失败
    if (res.ValidationErrors) {
      if (res.ValidationErrors.username) setUsernameErr(res.ValidationErrors.username._errors[0]);
      if (res.ValidationErrors.email) setEmailErr(res.ValidationErrors.email._errors[0]);
      if (res.ValidationErrors.bio) setBioErr(res.ValidationErrors.bio._errors[0]);

      // 回滚：删掉上传了的图片
      if (avatarFile && avatarFile.size > 0) await deleteMulti([avatarUrl]);

      return;
    }
    if (res.errName === "username") {
      // 回滚：删掉上传了的图片
      if (avatarFile && avatarFile.size > 0) await deleteMulti([avatarUrl]);
      return setUsernameErr(res.errMsg);
    }

    // 更新成功后
    if (res.status !== 200 || res.message !== "Updated") return;

    if (pathname === "/onboarding") router.push("/");
    else router.back();
  }

  return (
    <form action={updateUserAction} className="flex flex-col justify-start gap-8">
      <AvatarInput name="avatar" defaultValue={avatar} />
      <AppInput
        name="username"
        label="Username"
        defaultValue={username}
        placeholder="Set your username"
        required={true}
        type="text"
        errMsg={usernameErr}
      />
      <AppInput
        name="email"
        label="Email"
        defaultValue={email}
        placeholder="Set your email"
        type="text"
        errMsg={emailErr}
      />
      <AppTextarea
        name="bio"
        label="Bio"
        defaultValue={bio}
        placeholder="Write something as your bio..."
        rows={10}
        errMsg={bioErr}
      />

      <div className="h-[50px]">
        <AppButton text="Save" pendingText="Saving..." type="submit" />
      </div>
    </form>
  );
}
