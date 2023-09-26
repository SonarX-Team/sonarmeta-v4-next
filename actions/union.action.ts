"use server";

import { connectToDB } from "@/lib/mongoose";
import Union from "@/models/union.model";
import { createUnionValidation } from "@/validations/union.validation";

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

  // 对客户端传来的数据做校验
  const { isValid, errors } = createUnionValidation({ title, description });
  if (!isValid) return { ValidationErrors: errors };

  try {
    await connectToDB();

    const union = new Union({
      title,
      description,
      avatar,
      cover,
      creator: userId,
    });
    await union.save();

    return { status: 201, message: "Created" };
  } catch (error: any) {
    throw new Error(`Failed to create union: ${error.message}`);
  }
}