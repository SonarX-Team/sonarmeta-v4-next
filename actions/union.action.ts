"use server";

import { revalidatePath } from "next/cache";
import _ from "lodash";

import { connectToDB } from "@/lib/mongoose";
import Union from "@/models/union.model";
import User from "@/models/user.model";
import { createUnionValidation } from "@/validations/union.validation";
import { UnionsType, UnionType } from "@/types/UnionTypes";

// 获取Unions - GET
export async function fetchUnions({
  pageNumber = 1,
  pageSize = 20,
  userId,
  IPId,
}: {
  pageNumber: number;
  pageSize: number;
  userId?: string;
  IPId?: string;
}) {
  try {
    await connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    // 处理filter
    let filter = {};
    if (userId) filter = { members: { $elemMatch: { $eq: userId } } };
    if (IPId) filter = { signedIPs: { $elemMatch: { $eq: IPId } } };

    const unionsQuery = Union.find(filter).sort({ createdAt: "desc" }).skip(skipAmount).limit(pageSize).populate({
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

    const unionRes = (await Union.findById(unionId)
      .populate({
        path: "creator",
        model: User,
        select: "_id username avatar",
      })
      .populate({
        path: "members",
        model: User,
        select: "_id username avatar bio",
      })) as UnionType;

    return { unionRes };
  } catch (error: any) {
    throw new Error(`Failed to fetch union: ${error.message}`);
  }
}

// 按Union[]获得members信息 - GET
export async function getMembersFromUnions({ unionIds }: { unionIds: string[] }) {
  try {
    await connectToDB();

    const members = await Union.aggregate([
      {
        $match: {
          _id: { $in: unionIds },
        },
      },
      {
        $unwind: "$members",
      },
      {
        $lookup: {
          from: "users", // User模型的集合名
          localField: "members",
          foreignField: "_id",
          as: "memberInfo",
        },
      },
      {
        $unwind: "$memberInfo",
      },
      {
        $project: {
          _id: "$memberInfo._id",
          username: "$memberInfo.username",
          avatar: "$memberInfo.avatar",
        },
      },
    ]);

    return { members };
  } catch (error: any) {
    throw new Error(`Failed to get members of unions: ${error.message}`);
  }
}

// 创建新Union - POST
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
      members: [userId],
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

// 用户申请加入Union - PATCH
export async function requestUnion({ userId, unionId, path }: { userId: string; unionId: string; path: string }) {
  try {
    await connectToDB();

    // 看这个用户是否已经加入或已经申请加入该Union了
    const union = await Union.findById(unionId);
    if (union.inclinedMembers.includes(userId) || union.members.includes(userId))
      return { status: 400, message: "Already requested or joined" };

    // 更新Union
    union.inclinedMembers.push(userId);
    union.save();

    revalidatePath(path);

    return { status: 200, message: "Requested" };
  } catch (error: any) {
    throw new Error(`Failed to request union: ${error.message}`);
  }
}

// 准许用户加入Union - PATCH
export async function joinUnion({ userId, unionId, path }: { userId: string; unionId: string; path: string }) {
  try {
    await connectToDB();

    // 看这个用户是否已经加入该Union了
    const user = await User.findById(userId);
    if (user.unions.includes(unionId)) return { status: 400, message: "Already joined" };

    // 更新Union
    await Union.findByIdAndUpdate(unionId, {
      $pull: { inclinedMembers: userId },
      $push: { members: userId },
    });

    // 更新User
    user.unions.push(userId);
    user.save();

    revalidatePath(path);

    return { status: 200, message: "Joined" };
  } catch (error: any) {
    throw new Error(`Failed to join union: ${error.message}`);
  }
}
