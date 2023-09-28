"use server";

import { revalidatePath } from "next/cache";
import _ from "lodash";

import { connectToDB } from "@/lib/mongoose";
import Union from "@/models/union.model";
import User from "@/models/user.model";
import { createUnionValidation } from "@/validations/union.validation";
import { UnionsType, UnionType } from "@/types/UnionTypes";

// 获取工会 - GET
export async function fetchUnions({ pageNumber = 1, pageSize = 20 }: { pageNumber: number; pageSize: number }) {
  try {
    await connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const unionsQuery = Union.find().sort({ createdAt: "desc" }).skip(skipAmount).limit(pageSize).populate({
      path: "creator",
      model: User,
      select: "_id username avatar",
    });

    const unionsRes = await unionsQuery.exec();

    const unions: UnionsType[] = [];
    for (let i = 0; i < unionsRes.length; i++) {
      const union = _.pick(unionsRes[i], [
        "_id",
        "title",
        "avatar",
        "cover",
        "members",
        "signedIPs",
        "adaptations",
        "createdAt",
      ]);
      unions.push(union);
    }

    const totalUnionsCount = await Union.countDocuments();

    const isNext = totalUnionsCount > skipAmount + unionsRes.length;

    return { unions, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch unions: ${error.message}`);
  }
}

// 获取Union - RETRIEVE
export async function fetchUnion({ unionId }: { unionId: string }) {
  try {
    await connectToDB();

    const UnionRes = (await Union.findById(unionId).populate({
      path: "creator",
      model: User,
      select: "_id username avatar",
    })) as UnionType;

    return { UnionRes };
  } catch (error: any) {
    throw new Error(`Failed to fetch union: ${error.message}`);
  }
}

// 创建新工会 - POST
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
