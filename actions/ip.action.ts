"use server";

import _ from "lodash";

import IP from "@/models/ip.model";
import User from "@/models/user.model";
import { connectToDB } from "@/lib/mongoose";
import { createIPValidation } from "@/validations/ip.validation";
import { revalidatePath } from "next/cache";

type IPsType = {
  _id: string;
  title: string;
  description: string;
  agreement: string;
  avatar: string;
  author: {
    _id: string;
    username: string;
    avatar: string;
  };
  officialLink: string;
  createdAt: string;
  unions: string[];
  adaptations: string[];
};

type IPType = {
  _id: string;
  title: string;
  description: string;
  agreement: string;
  avatar: string;
  cover: string;
  author: {
    _id: string;
    username: string;
    avatar: string;
  };
  officialLink: string;
  images: string[];
  createdAt: string;
  unions: string[];
  adaptations: string[];
};

// 获取IPs - GET
export async function fetchIPs({ pageNumber = 1, pageSize = 20 }: { pageNumber: number; pageSize: number }) {
  try {
    await connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const IPsQuery = IP.find().sort({ createdAt: "desc" }).skip(skipAmount).limit(pageSize).populate({
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
        "createdAt",
        "unions",
        "adaptations",
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

// 通过IPid获取IP - GET
export async function fetchIP({ IPid }: { IPid: string }) {
  try {
    await connectToDB();

    const IPRes = (await IP.findById(IPid).populate({
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
