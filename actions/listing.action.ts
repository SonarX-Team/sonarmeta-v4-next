"use server";

import { revalidatePath } from "next/cache";
import { ObjectId } from "mongoose";
import _ from "lodash";

import Listing from "@/models/listing.model";
import Creation from "@/models/creation.model";

import { connectToDB } from "@/lib/mongoose";

// 获取Listing列表 - GET
export async function fetchListings({
  pageNumber = 1,
  pageSize = 20,
  tokenId,
}: {
  pageNumber: number;
  pageSize: number;
  tokenId?: number;
}) {
  try {
    await connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    // 处理filter
    let filter = {};

    const query = Listing.find(filter).sort({ createdAt: "desc" }).skip(skipAmount).limit(pageSize).populate({
      path: "creation",
      model: Creation,
      select: "tokenId title avatar",
    });

    const listings = await query.exec();

    const totalCount = await Listing.countDocuments();

    const isNext = totalCount > skipAmount + listings.length;

    return { listings, isNext };
  } catch (error: any) {
    return { status: 500, errMsg: `Failed to get listings: ${error.message}` };
  }
}

// 创建或更新一个Listing - POST/PATCH
export async function upsertListing({
  tokenId,
  seller,
  path,
}: {
  tokenId: number;
  seller: `0x${string}`;
  path: string;
}) {
  try {
    await connectToDB();

    const creation = await Creation.findOne({ tokenId });

    const res = await Listing.findOneAndUpdate(
      { creation: creation._id, seller }, // Filter
      { creation: creation._id, seller }, // Update
      { upsert: true }
    );

    revalidatePath(path);

    return { status: 200, message: "Upserted" };
  } catch (error: any) {
    return { status: 500, errMsg: `Failed to upsert listing: ${error.message}` };
  }
}
