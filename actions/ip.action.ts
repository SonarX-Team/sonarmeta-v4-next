"use server";

import { revalidatePath } from "next/cache";
import _ from "lodash";

import IP from "@/models/ip.model";
import Union from "@/models/union.model";
import User from "@/models/user.model";
import { connectToDB } from "@/lib/mongoose";
import { createIPValidation } from "@/validations/ip.validation";
import { IPType, IPsType } from "@/types/IPTypes";

// 获取IPs - GET
export async function fetchIPs({
  pageNumber = 1,
  pageSize = 20,
  userId,
  unionId,
}: {
  pageNumber: number;
  pageSize: number;
  userId?: string;
  unionId?: string;
}) {
  try {
    await connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    // 处理filter
    let filter = {};
    if (userId) filter = { author: userId };
    if (unionId) filter = { unions: { $elemMatch: { $eq: unionId } } };

    const IPsQuery = IP.find(filter).sort({ createdAt: "desc" }).skip(skipAmount).limit(pageSize).populate({
      path: "author",
      model: User,
      select: "_id username avatar",
    });

    const IPsRes = await IPsQuery.exec();

    const IPs: IPsType[] = [];
    for (let i = 0; i < IPsRes.length; i++) {
      const ip = _.pick(IPsRes[i], [
        "_id",
        "title",
        "description",
        "agreement",
        "avatar",
        "author",
        "officialLink",
        "unions",
        "adaptations",
        "createdAt",
      ]);
      IPs.push(ip);
    }

    const totalIPsCount = await IP.countDocuments();

    const isNext = totalIPsCount > skipAmount + IPsRes.length;

    return { IPs, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch ips: ${error.message}`);
  }
}

// 获取IP - RETRIEVE
export async function fetchIP({ IPId }: { IPId: string }) {
  try {
    await connectToDB();

    const IPRes = (await IP.findById(IPId).populate({
      path: "author",
      model: User,
      select: "_id username avatar",
    })) as IPType;

    return { IPRes };
  } catch (error: any) {
    throw new Error(`Failed to fetch ip: ${error.message}`);
  }
}

// 创建新IP - POST
export async function createIP({
  userId,
  formData,
  avatar,
  cover,
  images,
}: {
  userId: string;
  formData: FormData;
  avatar: string;
  cover: string;
  images: string[];
}) {
  const title = String(formData.get("title"));
  const description = String(formData.get("description"));
  const agreement = String(formData.get("agreement"));
  const officialLink = String(formData.get("officialLink"));

  // 对客户端传来的数据做校验
  const { isValid, errors } = createIPValidation({ title, description, agreement, officialLink });
  if (!isValid) return { ValidationErrors: errors };

  try {
    await connectToDB();

    const ip = new IP({
      title,
      description,
      agreement,
      officialLink,
      avatar,
      cover,
      images,
      author: userId,
    });
    await ip.save();

    // 更新User
    await User.findByIdAndUpdate(userId, {
      $push: { IPs: ip._id },
    });

    revalidatePath("/");

    return { status: 201, message: "Created" };
  } catch (error: any) {
    throw new Error(`Failed to create ip: ${error.message}`);
  }
}

// Union申请孵化IP - PATCH
export async function requestIP({ unionId, IPId, path }: { unionId: string; IPId: string; path: string }) {
  try {
    await connectToDB();

    // 看这个Union是否已经孵化或已经申请孵化该IP了
    const IPRes = await IP.findById(IPId);
    if (IPRes.inclinedUnions.includes(unionId) || IPRes.unions.includes(unionId))
      return { status: 400, message: "Already requested or nurtured" };

    // 更新IP
    IPRes.inclinedUnions.push(unionId);
    IPRes.save();

    revalidatePath(path);

    return { status: 200, message: "Requested" };
  } catch (error: any) {
    throw new Error(`Failed to request IP: ${error.message}`);
  }
}

// 准许Union孵化IP - PATCH
export async function nurtureIP({ unionId, IPId, path }: { unionId: string; IPId: string; path: string }) {
  try {
    await connectToDB();

    // 看这个Union是否已经孵化该IP了
    const union = await Union.findById(unionId);
    if (union.signedIPs.includes(IPId)) return { status: 400, message: "Already nurtured" };

    // 更新IP
    await IP.findByIdAndUpdate(IPId, {
      $pull: { inclinedUnions: unionId },
      $push: { unions: unionId },
    });

    // 更新Union
    union.signedIPs.push(IPId);
    union.save();

    revalidatePath(path);

    return { status: 200, message: "Nurtured" };
  } catch (error: any) {
    throw new Error(`Failed to nurture IP: ${error.message}`);
  }
}
