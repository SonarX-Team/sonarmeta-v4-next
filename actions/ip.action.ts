"use server";

import _ from "lodash";

import IP from "@/models/ip.model";
import User from "@/models/user.model";
import { connectToDB } from "@/lib/mongoose";
import { createIPValidation } from "@/validations/ip.validation";

type IPType = {
  _id: string;
  title: string;
  description: string;
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

    const IPs: IPType[] = [];
    for (let i = 0; i < IPsRes.length; i++) {
      const ip = _.pick(IPsRes[i], [
        "_id",
        "title",
        "description",
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
      cover,
      images,
      author: userId,
    });
    await ip.save();

    return { status: 201, message: "Created" };
  } catch (error: any) {
    throw new Error(`Failed to create ip: ${error.message}`);
  }
}
