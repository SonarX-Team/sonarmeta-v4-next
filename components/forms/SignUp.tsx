"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AppButton from "@/components/ui/AppButton";
import AppInput from "@/components/ui/AppInput";

import { createUser } from "@/actions/user.action";

export default function SignUp() {
  const router = useRouter();

  const [phoneErr, setPhoneErr] = useState<string>("");
  const [passwordErr, setPasswordErr] = useState<string>("");
  const [passwordAgainErr, setPasswordAgainErr] = useState<string>("");
  const [isChecked, setIsChecked] = useState<boolean>(false);

  async function signUpAction(formData: FormData) {
    setPhoneErr("");
    setPasswordErr("");
    setPasswordAgainErr("");

    const res = await createUser(formData);

    // 处理校验信息失败
    if (res.ValidationErrors) {
      if (res.ValidationErrors.phone) setPhoneErr(res.ValidationErrors.phone._errors[0]);
      if (res.ValidationErrors.password) setPasswordErr(res.ValidationErrors.password._errors[0]);
      if (res.ValidationErrors.passwordAgain) setPasswordAgainErr(res.ValidationErrors.passwordAgain._errors[0]);
      return;
    }
    if (res.errName === "phone") return setPhoneErr(res.errMsg);
    if (res.errName === "passwordAgain") return setPasswordAgainErr(res.errMsg);

    // 注册成功后
    if (res.status !== 201 || res.message !== "Created") return;
    router.push("/sign-in");
  }

  return (
    <form action={signUpAction}>
      <div className="flex flex-col justify-start gap-6">
        <AppInput name="phone" label="Phone" placeholder="Set your phone number" type="text" errMsg={phoneErr} />
        <AppInput
          name="password"
          label="Password"
          placeholder="Set your password"
          type="password"
          errMsg={passwordErr}
        />
        <AppInput
          name="passwordAgain"
          label="Password again"
          placeholder="Type your password again"
          type="password"
          errMsg={passwordAgainErr}
        />
      </div>

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
          I agree to the
          <Link
            href="https://deck.sonarmeta.com"
            className="text-sky-400 hover:text-sky-300 duration-200 ml-1"
            target="_blank"
          >
            Terms of Service
          </Link>
        </label>
      </div>

      <div className="h-[50px]">
        <AppButton text="Sign up" pendingText="Proceeding..." type="submit" disabled={!isChecked} />
      </div>
    </form>
  );
}
