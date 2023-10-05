"use server";

import { revalidatePath } from "next/cache";
import _ from "lodash";

import Adaptation from "@/models/adaptation.model";
import IP from "@/models/ip.model";
import Union from "@/models/union.model";
import User from "@/models/user.model";
import { connectToDB } from "@/lib/mongoose";
import { createAdaptationValidation } from "@/validations/adaptation.validation";
import { AdaptationsType, AdaptationType } from "@/types/AdaptationTypes";

// 获取Adaptations - GET
export async function fetchAdaptations({ pageNumber = 1, pageSize = 20 }: { pageNumber: number; pageSize: number }) {
  try {
    await connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    // 处理filter
    let filter = {};

    const adaptationsQuery = Adaptation.find(filter).sort({ createdAt: "desc" }).skip(skipAmount).limit(pageSize);

    const adaptationsRes = await adaptationsQuery.exec();

    const adaptations: AdaptationsType[] = [];
    for (let i = 0; i < adaptationsRes.length; i++) {
      const adaptation = _.pick(adaptationsRes[i], ["_id", "title", "description", "url", "cover", "createdAt"]);
      adaptations.push(adaptation);
    }

    const totalAdaptationsCount = await Adaptation.countDocuments();

    const isNext = totalAdaptationsCount > skipAmount + adaptationsRes.length;

    return { adaptations, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch adaptations: ${error.message}`);
  }
}

// 获取Adaptation - RETRIEVE
export async function fetchAdaptation({ adaptationId }: { adaptationId: string }) {
  try {
    await connectToDB();

    const adaptationRes = (await Adaptation.findById(adaptationId)) as AdaptationType;

    return { adaptationRes };
  } catch (error: any) {
    throw new Error(`Failed to fetch adaptation: ${error.message}`);
  }
}

// 创建新Adaptation - POST
export async function createAdaptation({
  userId,
  unionId,
  IPIds,
  formData,
  cover,
}: {
  userId: string;
  unionId: string;
  IPIds: string[];
  formData: FormData;
  cover: string;
}) {
  const title = String(formData.get("title"));
  const description = String(formData.get("description"));
  const url = String(formData.get("url"));

  // 对客户端传来的数据做校验
  const { isValid, errors } = createAdaptationValidation({ title, description, url });
  if (!isValid) return { ValidationErrors: errors };

  try {
    await connectToDB();

    // 查看给定的IP列表是否全都是已签约了的
    const result = await Union.find({ signedIPs: { $nin: IPIds } });
    if (result.length > 0) return { status: 403, message: "Not all given IPs are signed" };

    // 查看这个用户是否属于这个Union
    const union = await Union.findById(unionId);
    if (!union.members.includes(userId)) return { status: 401, message: "No access to this union" };

    // 创建逻辑
    const adaptation = new Adaptation({
      title,
      description,
      url,
      cover,
      union: unionId,
      relatedIPs: IPIds,
    });
    await adaptation.save();

    // 更新给定的IP列表
    for (let i = 0; i < IPIds.length; i++) {
      await IP.findByIdAndUpdate(IPIds[i], {
        $push: { adaptations: adaptation._id },
      });
    }

    // 更新Union
    union.adaptations.push(adaptation._id);
    await union.save();

    // 更新User
    await User.findByIdAndUpdate(userId, {
      $push: { adaptations: adaptation._id },
    });

    return { status: 201, message: "Created" };
  } catch (error: any) {
    throw new Error(`Failed to create adaptation: ${error.message}`);
  }
}
