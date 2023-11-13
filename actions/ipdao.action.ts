"use server";

import { revalidatePath } from "next/cache";
import { ObjectId } from "mongoose";
import _ from "lodash";

import IpDao from "@/models/ipdao.model";
import User from "@/models/user.model";

import { connectToDB } from "@/lib/mongoose";

import { ipDaoValidation } from "@/validations/ipdao.validation";

import { ipDaosType, ipDaoType } from "@/types/ipdao.type";

// 获取IP DAOs - GET
export async function fetchIpDaos({
  pageNumber = 1,
  pageSize = 20,
  owner,
  member,
}: {
  pageNumber: number;
  pageSize: number;
  owner?: `0x${string}`;
  member?: `0x${string}`;
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

    const ipDaos: ipDaosType[] = [];
    for (let i = 0; i < res.length; i++) {
      const ipDao = _.pick(res[i], [
        "address",
        "title",
        "description",
        "avatar",
        "cover",
        "owner",
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

    // 更新User
    await User.findByIdAndUpdate(user._id, {
      $push: { ipDaos: ipDao._id },
    });

    revalidatePath(`/space/${owner}/ip-daos`);

    return { status: 201, message: "Created" };
  } catch (error: any) {
    return { status: 500, errMsg: `Failed to create IP DAO: ${error.message}` };
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

    // 看这个用户是否已经加入或已经申请加入该IP DAO了
    const ipDao = await IpDao.findOne({ address: ipDaoAddr });
    const user = await User.findOne({ address: userAddr });
    if (
      ipDao.inclinedMembers.some((memberId: ObjectId) => String(memberId) === user._id) ||
      ipDao.members.some((memberId: ObjectId) => String(memberId) === user._id)
    )
      return { status: 400, message: "Already requested or joined" };

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
  userAddr,
  adminAddr,
  ipDaoAddr,
  path,
}: {
  userAddr: `0x${string}`;
  adminAddr: `0x${string}`;
  ipDaoAddr: `0x${string}`;
  path: string;
}) {
  try {
    await connectToDB();

    const ipDao = await IpDao.findOne({ address: ipDaoAddr });
    const user = await User.findOne({ address: userAddr });
    const admin = await User.findOne({ address: adminAddr });

    // 看当前操作者是否有权限
    if (String(ipDao.owner) !== admin._id) return { status: 401, message: "No accesss to this IP DAO" };

    // 看这个用户是否已经加入该IP DAO了
    if (user.ipDaos.some((ipDaoId: ObjectId) => String(ipDaoId) === ipDao._id))
      return { status: 400, message: "Already joined" };

    // 更新IP DAO
    ipDao.inclinedMembers = ipDao.inclinedMembers.filter((memberId: ObjectId) => String(memberId) !== user._id);
    ipDao.members.push(user._id);
    ipDao.save();

    // 更新User
    user.ipDaos.push(ipDao._id);
    user.save();

    revalidatePath(path);

    return { status: 200, message: "Joined" };
  } catch (error: any) {
    return { status: 500, errMsg: `Failed to add user to your IP DAO: ${error.message}` };
  }
}
