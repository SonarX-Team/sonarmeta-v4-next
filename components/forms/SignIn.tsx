"use client";

import { useState } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AppButton from "@/components/ui/AppButton";
import AppInput from "@/components/ui/AppInput";

import { signInUser } from "@/actions/user.action";

export default function SignIn() {
  const router = useRouter();

  const { pending } = useFormStatus();

  const [phoneErr, setPhoneErr] = useState<string>("");
  const [passwordErr, setPasswordErr] = useState<string>("");
  const [isChecked, setIsChecked] = useState<boolean>(false);

  async function signInAction(formData: FormData) {
    setPhoneErr("");
    setPasswordErr("");

    const res = await signInUser(formData);

    // 处理校验信息失败
    if (res.ValidationErrors) {
      if (res.ValidationErrors.phone) setPhoneErr(res.ValidationErrors.phone._errors[0]);
      if (res.ValidationErrors.password) setPasswordErr(res.ValidationErrors.password._errors[0]);
      return;
    }
    if (res.errName === "phone") {
      setPhoneErr(res.errMsg);
      return;
    }
    if (res.errName === "password") {
      setPasswordErr(res.errMsg);
      return;
    }

    // 登录成功后
    if (res.status !== 200 || res.message !== "Authenticated") return;

    router.push("/onboarding");
  }

  return (
    <form action={signInAction}>
      <AppInput name="phone" label="手机号" placeholder="请输入您的手机号" type="text" errMsg={phoneErr} />
      <AppInput name="password" label="密码" placeholder="请输入您的密码" type="password" errMsg={passwordErr} />

      <hr className="border-1 border-zinc-600 mt-8 mb-2" />

      <div className="mb-8">
        <input
          id="confirm"
          name="protocol"
          type="checkbox"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
        />
        <label htmlFor="confirm" className="text-small-regular text-zinc-400 ml-2">
          我已阅读并同意
          <Link
            href="https://deck.sonarmeta.com"
            className="text-sky-400 hover:text-sky-300 duration-200"
            target="_blank"
          >
            《用户使用协议》
          </Link>
        </label>
      </div>

      <div className="h-[50px]">
        <AppButton text={pending ? "登录中..." : "登 录"} type="submit" disabled={!isChecked} pending={pending} />
      </div>
    </form>
  );
}
