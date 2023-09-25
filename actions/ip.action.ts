"use server";

import { connectToDB } from "@/lib/mongoose";
import IP from "@/models/ip.model";
import { createIPValidation } from "@/validations/ip.validation";

// 创建新IP - POST
export async function createIP({
  userId,
  formData,
  avatar,
  images,
}: {
  userId: string;
  formData: FormData;
  avatar: string;
  images: string[];
}) {
  const title = String(formData.get("title"));
  const description = String(formData.get("description"));
  const officialLink = String(formData.get("officialLink"));

  // 对客户端传来的数据做校验
  const { isValid, errors } = createIPValidation({ title, description, officialLink });
  if (!isValid) return { ValidationErrors: errors };

  try {
    await connectToDB();

    const ip = new IP({
      title,
      description,
      officialLink,
      avatar,
      images,
      author: userId,
    });
    await ip.save();

    return { status: 201, message: "Created" };
  } catch (error: any) {
    throw new Error(`Failed to create ip: ${error.message}`);
  }
}
