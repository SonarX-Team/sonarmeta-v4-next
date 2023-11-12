"use server";

import { revalidatePath } from "next/cache";
import _ from "lodash";

import Creation from "@/models/creation.model";
import { connectToDB } from "@/lib/mongoose";
import { creationValidation } from "@/validations/creation.validation";
import { creationType, creationsType } from "@/types/creation.type";

// 获取Creations - GET
export async function fetchCreations({
  pageNumber = 1,
  pageSize = 20,
  tokenIds,
}: {
  pageNumber: number;
  pageSize: number;
  tokenIds?: number[];
}) {
  try {
    await connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    // 处理filter
    let filter = {};
    if (tokenIds && tokenIds.length > 0) filter = { tokenId: { $in: tokenIds } };

    const query = Creation.find(filter).sort({ createdAt: "desc" }).skip(skipAmount).limit(pageSize);

    const res = await query.exec();

    const creations: creationsType[] = [];
    for (let i = 0; i < res.length; i++) {
      const creation = _.pick(res[i], ["title", "description", "tokenId", "avatar", "externalLink", "createdAt"]);
      creations.push(creation);
    }

    const totalCount = await Creation.countDocuments();

    const isNext = totalCount > skipAmount + res.length;

    return { creations, isNext };
  } catch (error: any) {
    return { status: 500, errMsg: `Failed to fetch creations: ${error.message}` };
  }
}

// 获取Creation - RETRIEVE
export async function fetchCreationBy({ tokenId }: { tokenId: string }) {
  try {
    await connectToDB();

    const res = (await Creation.findOne({ tokenId })) as creationType;

    return { res };
  } catch (error: any) {
    return { status: 500, errMsg: `Failed to fetch the creation: ${error.message}` };
  }
}

// 创建新Creation - POST
export async function createCreation({
  title,
  description,
  tokenId,
  agreement,
  externalLink,
  avatar,
  cover,
  images,
}: {
  title: string;
  description: string;
  tokenId: number;
  agreement: string;
  externalLink: string;
  avatar: string;
  cover: string;
  images: string[];
}) {
  // 对客户端传来的数据做校验
  const { isValid, errors } = creationValidation({ title, description, agreement, externalLink });
  if (!isValid) return { ValidationErrors: errors };

  try {
    await connectToDB();

    const creation = new Creation({
      title,
      description,
      tokenId,
      agreement,
      externalLink,
      avatar,
      cover,
      images,
    });
    await creation.save();

    revalidatePath("/creations");

    return { status: 201, message: "Created" };
  } catch (error: any) {
    return { status: 500, errMsg: `Failed to create creation: ${error.message}` };
  }
}
