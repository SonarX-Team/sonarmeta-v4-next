"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import AvatarPicker from "../ui/AvatarPicker";
import AppInput from "../ui/AppInput";
import AppButton from "../ui/AppButton";
import AppTextarea from "../ui/AppTextarea";

import { updateUser } from "@/actions/user.action";
import { deleteMulti, uploadFile } from "@/lib/alioss";
import { UserBasicType } from "@/types/user.type";

export default function EditAccount({ address, username, email, bio, avatar }: UserBasicType) {
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
      const result = await uploadFile(`users/${address}/avatar.png`, avatarFile);
      avatarUrl = result.url;
    }

    const res = await updateUser({ address, formData, avatar: avatarUrl });

    // 处理校验信息失败
    if (res.ValidationErrors) {
      if (res.ValidationErrors.username) setUsernameErr(res.ValidationErrors.username._errors[0]);
      if (res.ValidationErrors.email) setEmailErr(res.ValidationErrors.email._errors[0]);
      if (res.ValidationErrors.bio) setBioErr(res.ValidationErrors.bio._errors[0]);
    }
    if (res.errName === "username") setUsernameErr(res.errMsg);

    // 更新成功后
    if (res.status === 200 && res.message === "Updated") toast.success("Saved successfully");
    else {
      if (res.status === 400) toast.error("The information you entered contains errors.");
      if (res.status === 500) toast.error("Internal server error.");
      if (avatarFile && avatarFile.size > 0) await deleteMulti([avatarUrl]); // 回滚
    }
  }

  return (
    <form action={updateUserAction} className="flex flex-col justify-start gap-8">
      <AvatarPicker name="avatar" label="Select your avatar image" type="circle" defaultValue={avatar} />
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

      <AppButton text="Save" pendingText="Saving..." type="submit" />
    </form>
  );
}
