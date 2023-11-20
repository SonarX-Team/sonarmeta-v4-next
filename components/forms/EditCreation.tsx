"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import { updateCreation } from "@/actions/creation.action";

import AppButton from "../ui/AppButton";
import AppTextarea from "../ui/AppTextarea";

export default function EditCreation({ tokenId, agreement }: { tokenId: number; agreement: string }) {
  const [agreementErr, setAgreementErr] = useState<string>("");

  async function updateAgreementAction(formData: FormData) {
    setAgreementErr("");

    const res = await updateCreation({
      tokenId: tokenId,
      formData,
    });

    // 处理校验信息失败
    if (res.ValidationErrors) {
      if (res.ValidationErrors.agreement) setAgreementErr(res.ValidationErrors.agreement._errors[0]);
    }

    if (res.status === 200 && res.message === "Updated") toast.success("Saved successfully!");
    else {
      if (res.status === 400) toast.error("The information you entered contains errors.");
      if (res.status === 500) toast.error("Internal server error.");
    }
  }

  return (
    <form action={updateAgreementAction} className="flex flex-col justify-start gap-8">
      <AppTextarea
        name="agreement"
        label="Agreement"
        placeholder="Provide specific instructions on how you would like to authorize."
        required={true}
        defaultValue={agreement}
        rows={10}
        errMsg={agreementErr}
      />

      <div className="h-[50px]">
        <AppButton text="Save agreement" pendingText="Saving..." type="submit" />
      </div>
    </form>
  );
}
