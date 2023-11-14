"use server";

import { revalidatePath } from "next/cache";
import { ObjectId } from "mongoose";
import _ from "lodash";

import IpDao from "@/models/ipdao.model";
import User from "@/models/user.model";

import { connectToDB } from "@/lib/mongoose";

import { ipDaoValidation } from "@/validations/ipdao.validation";

import { inclinedIpDaosType, ipDaosType, ipDaoType } from "@/types/ipdao.type";

// 获取IP DAOs - GET
export async function fetchIpDaos({
  pageNumber = 1,
  pageSize = 20,
  owner,
  member,
  inclined,
}: {
  pageNumber: number;
  pageSize: number;
  owner?: `0x${string}`;
  member?: `0x${string}`;
  inclined?: boolean;
}) {
  try {
    await connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    // 处理filter
    let filter = {};
    if (owner) {
      const user = await User.findOne({ address: owner });
      filter = { owner: user._id };
    }
    if (member) {
      const user = await User.findOne({ address: member });
      filter = { members: { $elemMatch: { $eq: user._id } } };
    }

    const query = IpDao.find(filter).sort({ createdAt: "desc" }).skip(skipAmount).limit(pageSize).populate({
      path: "inclinedMembers",
      model: User,
      select: "address username avatar",
    });

    const res = await query.exec();

    const ipDaos = [];

    if (inclined)
      for (let i = 0; i < res.length; i++) {
        const ipDao: inclinedIpDaosType = _.pick(res[i], ["address", "title", "avatar", "inclinedMembers"]);
        ipDaos.push(ipDao);
      }
    else
      for (let i = 0; i < res.length; i++) {
        const ipDao: ipDaosType = _.pick(res[i], [
          "address",
          "title",
          "description",
          "avatar",
          "cover",
          "owner",
          "subscribers",
          "members",
          "createdAt",
        ]);
        ipDaos.push(ipDao);
      }

    const totalipDaosCount = await IpDao.countDocuments();

    const isNext = totalipDaosCount > skipAmount + res.length;

    return { ipDaos, isNext };
  } catch (error: any) {
    return { status: 500, errMsg: `Failed to fetch IP DAOs: ${error.message}` };
  }
}

// 获取IP DAO - RETRIEVE
export async function fetchIpDao({ address }: { address: string }) {
  try {
    await connectToDB();

    const res = (await IpDao.findOne({ address })
      .populate({
        path: "owner",
        model: User,
        select: "address username avatar",
      })
      .populate({
        path: "members",
        model: User,
        select: "address username avatar bio",
      })) as ipDaoType;

    return { res };
  } catch (error: any) {
    return { status: 500, errMsg: `Failed to fetch IP DAO: ${error.message}` };
  }
}

// 创建新IP DAO - POST
export async function createIpDao({
  address,
  title,
  description,
  recruitment,
  externalLink,
  owner,
  avatar,
  cover,
  images,
}: {
  address: `0x${string}`;
  owner: `0x${string}`;
  title: string;
  description: string;
  recruitment: string;
  externalLink: string;
  avatar: string;
  cover: string;
  images: string[];
}) {
  // 对客户端传来的数据做校验
  const { isValid, errors } = ipDaoValidation({ title, description, recruitment, externalLink });
  if (!isValid) return { ValidationErrors: errors };

  try {
    await connectToDB();

    const user = await User.findOne({ address: owner });

    const ipDao = new IpDao({
      address,
      title,
      description,
      recruitment,
      externalLink,
      avatar,
      cover,
      images,
      owner: user._id,
      members: [user._id],
    });
    await ipDao.save();

    revalidatePath(`/space/${owner}/ip-daos`);

    return { status: 201, message: "Created" };
  } catch (error: any) {
    return { status: 500, errMsg: `Failed to create IP DAO: ${error.message}` };
  }
}

// 用户关注IP DAO - PATCH
export async function subscribeIpDao({
  userAddr,
  ipDaoAddr,
  path,
}: {
  userAddr: `0x${string}`;
  ipDaoAddr: `0x${string}`;
  path: string;
}) {
  try {
    await connectToDB();

    const ipDao = await IpDao.findOne({ address: ipDaoAddr });
    const user = await User.findOne({ address: userAddr });

    if (ipDao.subscribers.some((memberId: ObjectId) => String(memberId) === String(user._id)))
      ipDao.subscribers = ipDao.subscribers.filter((memberId: ObjectId) => String(memberId) !== String(user._id));
    else ipDao.subscribers.push(user._id);

    ipDao.save();

    revalidatePath(path);

    return { status: 200 };
  } catch (error: any) {
    return { status: 500, errMsg: `Failed to subscribe IP DAO: ${error.message}` };
  }
}

// 用户申请加入IP DAO - PATCH
export async function applyIpDao({
  userAddr,
  ipDaoAddr,
  path,
}: {
  userAddr: `0x${string}`;
  ipDaoAddr: `0x${string}`;
  path: string;
}) {
  try {
    await connectToDB();

    const ipDao = await IpDao.findOne({ address: ipDaoAddr });
    const user = await User.findOne({ address: userAddr });

    // 看这个用户是否已经加入或已经申请加入该IP DAO了
    if (
      ipDao.inclinedMembers.some((memberId: ObjectId) => String(memberId) === String(user._id)) ||
      ipDao.members.some((memberId: ObjectId) => String(memberId) === String(user._id))
    )
      return { status: 400, errMsg: "Already applied or joined" };

    // 更新IpDao
    ipDao.inclinedMembers.push(user._id);
    ipDao.save();

    revalidatePath(path);

    return { status: 200, message: "Applied" };
  } catch (error: any) {
    return { status: 500, errMsg: `Failed to apply IP DAO: ${error.message}` };
  }
}

// 准许用户加入IP DAO - PATCH
export async function addMember({
  adminAddr,
  userAddr,
  ipDaoAddr,
  path,
}: {
  adminAddr: `0x${string}`;
  userAddr: `0x${string}`;
  ipDaoAddr: `0x${string}`;
  path: string;
}) {
  try {
    await connectToDB();

    const ipDao = await IpDao.findOne({ address: ipDaoAddr });
    const user = await User.findOne({ address: userAddr });
    const admin = await User.findOne({ address: adminAddr });

    // 看当前操作者是否有权限
    if (String(ipDao.owner) !== String(admin._id)) return { status: 401, errMsg: "No accesss to this IP DAO" };

    // 看这个用户是否已经申请了该IP DAO
    if (!ipDao.inclinedMembers.some((memberId: ObjectId) => String(memberId) === String(user._id)))
      return { status: 400, errMsg: "No application from this user" };

    // 看这个用户是否已经加入该IP DAO
    if (ipDao.members.some((memberId: ObjectId) => String(memberId) === String(user._id)))
      return { status: 400, errMsg: "Already Added" };

    // 更新IP DAO
    ipDao.inclinedMembers = ipDao.inclinedMembers.filter((memberId: ObjectId) => String(memberId) !== String(user._id));
    ipDao.members.push(user._id);
    ipDao.save();

    revalidatePath(path);

    return { status: 200, message: "Added" };
  } catch (error: any) {
    return { status: 500, errMsg: `Failed to add user to your IP DAO: ${error.message}` };
  }
}
