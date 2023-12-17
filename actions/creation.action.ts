"use server";

import { revalidatePath } from "next/cache";
import { ObjectId } from "mongoose";
import _ from "lodash";

import Creation from "@/models/creation.model";

import { connectToDB } from "@/lib/mongoose";
import { updateCreationValidation } from "@/validations/creation.validation";
import { creationsType, inclinedDerivativesType } from "@/types/creation.type";

// 获取Creations - GET
export async function fetchCreations({
  pageNumber = 1,
  pageSize = 20,
  tokenIds,
  inclined,
}: {
  pageNumber: number;
  pageSize: number;
  tokenIds?: number[];
  inclined?: boolean;
}) {
  try {
    await connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    // 处理filter
    let filter = {};
    if (tokenIds) filter = { tokenId: { $in: tokenIds } };

    const query = Creation.find(filter).sort({ createdAt: "desc" }).skip(skipAmount).limit(pageSize).populate({
      path: "inclinedDerivatives",
      model: Creation,
      select: "tokenId title avatar",
    });

    const res = await query.exec();

    const creations = [];

    if (inclined)
      for (let i = 0; i < res.length; i++) {
        const creation: inclinedDerivativesType = _.pick(res[i], ["tokenId", "title", "avatar", "inclinedDerivatives"]);
        creations.push(creation);
      }
    else
      for (let i = 0; i < res.length; i++) {
        const creation: creationsType = _.pick(res[i], [
          "title",
          "description",
          "tokenId",
          "avatar",
          "externalLink",
          "createdAt",
        ]);
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
export async function fetchCreation({ tokenId }: { tokenId: string }) {
  try {
    await connectToDB();

    const res = await Creation.findOne({ tokenId })
      .populate({
        path: "inclinedDerivatives",
        model: Creation,
        select: "tokenId title avatar",
      })
      .populate({
        path: "internshipDerivatives",
        model: Creation,
        select: "tokenId title avatar",
      })
      .populate({
        path: "derivatives",
        model: Creation,
        select: "tokenId title avatar",
      });

    if (!res) return { status: 404, errMsg: "No creation found" };

    return { status: 200, res };
  } catch (error: any) {
    return { status: 500, errMsg: `Failed to fetch the creation: ${error.message}` };
  }
}

// 查看给定node在哪些其他node下实习中
export async function isInternship({ tokenId }: { tokenId: string }) {
  try {
    await connectToDB();

    const internshipNode = await Creation.findOne({ tokenId });
    if (!internshipNode) return { status: 404, errMsg: "No creation found" };

    const res = await Creation.find({
      tokenId: { $ne: tokenId },
      internshipDerivatives: { $in: internshipNode._id },
    });

    return { status: 200, res };
  } catch (error: any) {
    return { status: 500, errMsg: `Failed to fetch the creation: ${error.message}` };
  }
}

// 创建新Creation - POST
export async function createCreation({
  tokenId,
  title,
  description,
  agreement,
  externalLink,
  avatar,
}: {
  tokenId: number;
  title: string;
  description: string;
  agreement: string;
  externalLink: string;
  avatar: string;
}) {
  // 无需二次数据校验，前端已可信
  try {
    await connectToDB();

    const creation = new Creation({
      title,
      description,
      tokenId,
      agreement,
      externalLink,
      avatar,
    });
    await creation.save();

    revalidatePath("/studio/creations");

    return { status: 201, message: "Created" };
  } catch (error: any) {
    return { status: 500, errMsg: `Failed to create creation: ${error.message}` };
  }
}

// 更新Creation - PATCH
export async function updateCreation({ tokenId, formData }: { tokenId: number; formData: FormData }) {
  const agreement = String(formData.get("agreement"));

  // 对客户端传来的数据做校验
  const { isValid, errors } = updateCreationValidation({ agreement });
  if (!isValid) return { status: 400, ValidationErrors: errors };

  try {
    await connectToDB();

    await Creation.findOneAndUpdate({ tokenId }, { agreement });

    revalidatePath(`/creations/${tokenId}/studio`);

    return { status: 200, message: "Updated" };
  } catch (error: any) {
    return { status: 500, errMsg: `Failed to create creation: ${error.message}` };
  }
}

// 意向成为衍生品的Node申请原生Node的授权
export async function applyAuthorization({
  issuerTokenId,
  inclinedTokenId,
  path,
}: {
  issuerTokenId: number;
  inclinedTokenId: number;
  path: string;
}) {
  try {
    await connectToDB();

    const issuerToken = await Creation.findOne({ tokenId: issuerTokenId });
    const inclinedToken = await Creation.findOne({ tokenId: inclinedTokenId });

    // 看inclinedTokenId是不是已经在三个列表中的任何一个了
    if (
      issuerToken.inclinedDerivatives.some(
        (creationId: ObjectId) => String(creationId) === String(inclinedToken._id)
      ) ||
      issuerToken.internshipDerivatives.some(
        (creationId: ObjectId) => String(creationId) === String(inclinedToken._id)
      ) ||
      issuerToken.derivatives.some((creationId: ObjectId) => String(creationId) === String(inclinedToken._id))
    )
      return { status: 400, errMsg: "Already applied or authorized" };

    // 更新被申请的Creation
    issuerToken.inclinedDerivatives.push(inclinedToken._id);
    issuerToken.save();

    revalidatePath(path);

    return { status: 200, message: "Applied" };
  } catch (error: any) {
    return { status: 500, errMsg: `Failed to apply creation: ${error.message}` };
  }
}

// 原生Node接受申请
export async function acceptApplication({
  issuerTokenId,
  inclinedTokenId,
  path,
}: {
  issuerTokenId: number;
  inclinedTokenId: number;
  path: string;
}) {
  try {
    await connectToDB();

    const issuerToken = await Creation.findOne({ tokenId: issuerTokenId });
    const inclinedToken = await Creation.findOne({ tokenId: inclinedTokenId });

    // 看inclinedTokenId在不在申请列表中
    if (
      !issuerToken.inclinedDerivatives.some((creationId: ObjectId) => String(creationId) === String(inclinedToken._id))
    )
      return { status: 400, errMsg: "No application from this node" };

    // 看inclinedTokenId是否已经被授权过了
    if (issuerToken.derivatives.some((creationId: ObjectId) => String(creationId) === String(inclinedToken._id)))
      return { status: 400, errMsg: "Already authorized" };

    // 更新被申请的Creation
    issuerToken.inclinedDerivatives = issuerToken.inclinedDerivatives.filter(
      (inclined: ObjectId) => String(inclined) !== String(inclinedToken._id)
    );
    issuerToken.internshipDerivatives.push(inclinedToken._id);
    issuerToken.save();

    revalidatePath(path);

    return { status: 200, message: "Authorized" };
  } catch (error: any) {
    return { status: 500, errMsg: `Failed to authorize creation: ${error.message}` };
  }
}

// 原生Node确认授权
export async function authorize({
  issuerTokenId,
  inclinedTokenId,
  path,
}: {
  issuerTokenId: number;
  inclinedTokenId: number;
  path: string;
}) {
  try {
    await connectToDB();

    const issuerToken = await Creation.findOne({ tokenId: issuerTokenId });
    const inclinedToken = await Creation.findOne({ tokenId: inclinedTokenId });

    // 看inclinedTokenId在不在实习列表中
    if (
      !issuerToken.internshipDerivatives.some(
        (creationId: ObjectId) => String(creationId) === String(inclinedToken._id)
      )
    )
      return { status: 400, errMsg: "No acceptance to this node" };

    // 看inclinedTokenId是否已经被授权过了
    if (issuerToken.derivatives.some((creationId: ObjectId) => String(creationId) === String(inclinedToken._id)))
      return { status: 400, errMsg: "Already authorized" };

    // 更新被申请的Creation
    issuerToken.inclinedDerivatives = issuerToken.inclinedDerivatives.filter(
      (inclined: ObjectId) => String(inclined) !== String(inclinedToken._id)
    );
    issuerToken.derivatives.push(inclinedToken._id);
    issuerToken.save();

    revalidatePath(path);

    return { status: 200, message: "Authorized" };
  } catch (error: any) {
    return { status: 500, errMsg: `Failed to authorize creation: ${error.message}` };
  }
}
