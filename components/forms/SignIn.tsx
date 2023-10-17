"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AppButton from "@/components/ui/AppButton";
import AppInput from "@/components/ui/AppInput";

import { signInUser } from "@/actions/user.action";

export default function SignIn() {
  const router = useRouter();

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
    if (res.errName === "phone") return setPhoneErr(res.errMsg);
    if (res.errName === "password") return setPasswordErr(res.errMsg);

    // 登录成功后
    if (res.status !== 200 || res.message !== "Authenticated") return;
    router.push("/onboarding");
  }

  return (
    <form action={signInAction}>
      <div className="flex flex-col justify-start gap-6">
        <AppInput name="phone" label="Phone" placeholder="Type your phone number" type="text" errMsg={phoneErr} />
        <AppInput
          name="password"
          label="Password"
          placeholder="Type your password"
          type="password"
          errMsg={passwordErr}
        />
      </div>

      <hr className="border-zinc-300 mt-8 mb-2" />

      <div className="mb-8">
        <input
          id="confirm"
          name="protocol"
          type="checkbox"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
        />
        <label htmlFor="confirm" className="text-small-regular text-zinc-700 ml-2">
          I agree to the
          <Link
            href="https://deck.sonarmeta.com"
            className="text-violet-700 hover:text-violet-600 duration-200 ml-1"
            target="_blank"
          >
            Terms of Service
          </Link>
        </label>
      </div>

      <div className="h-[50px]">
        <AppButton text="Sign in" pendingText="Proceeding..." type="submit" disabled={!isChecked} />
      </div>
    </form>
  );
}
