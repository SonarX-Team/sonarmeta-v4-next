"use server";

import { connectToDB } from "@/lib/mongoose";
import Union from "@/models/union.model";
import User from "@/models/user.model";
import { createUnionValidation } from "@/validations/union.validation";
import { revalidatePath } from "next/cache";

// 创建新工会
export async function createUnion({
  userId,
  formData,
  avatar,
  cover,
}: {
  userId: string;
  formData: FormData;
  avatar: string;
  cover: string;
}) {
  const title = String(formData.get("title"));
  const description = String(formData.get("description"));
  const recruitment = String(formData.get("recruitment"));

  // 对客户端传来的数据做校验
  const { isValid, errors } = createUnionValidation({ title, description, recruitment });
  if (!isValid) return { ValidationErrors: errors };

  try {
    await connectToDB();

    const union = new Union({
      title,
      description,
      recruitment,
      avatar,
      cover,
      creator: userId,
    });
    await union.save();

    // 更新User
    await User.findByIdAndUpdate(userId, {
      $push: { unions: union._id },
    });

    revalidatePath("/unions");

    return { status: 201, message: "Created" };
  } catch (error: any) {
    throw new Error(`Failed to create union: ${error.message}`);
  }
}
