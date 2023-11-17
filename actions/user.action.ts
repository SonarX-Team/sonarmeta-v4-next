"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { sign, verify } from "jsonwebtoken";
import _ from "lodash";
import { verifyMessage } from "viem/utils";

import User from "@/models/user.model";
import { connectToDB } from "@/lib/mongoose";
import { UpdateUserValidation } from "@/validations/user.validation";
import { COOKIE_NAME, EXPIRE_AGE } from "@/constants";
import { UserBasicType } from "@/types/user.type";

// 获取当前登录用户信息 - GET
export async function getCurrentUser() {
  const token = cookies().get(COOKIE_NAME);

  if (!token) return { status: 401, message: "Access denied. No token provided", user: null };
  if (!token.value) return { status: 401, message: "Access denied. No token provided", user: null };

  try {
    const secret = process.env.JWT_SECRET || "";
    const decoded = verify(token.value, secret);

    return {
      status: 200,
      message: "ok",
      user: _.pick(decoded, ["address", "username", "avatar", "bio"]) as {
        address: `0x${string}`;
        username: string;
        avatar: string;
        bio: string;
      },
    };
  } catch (error: any) {
    return { status: 500, errMsg: `Failed to get the current user: ${error.message}` };
  }
}

// 获取用户信息 - GET
export async function fetchUser({
  address,
  isBasic,
  isId,
}: {
  address: `0x${string}`;
  isBasic?: boolean;
  isId?: boolean;
}) {
  try {
    await connectToDB();

    const user = await User.findOne({ address });

    if (!user) return { status: 404 };

    if (isBasic) return _.pick(user, ["address", "username", "email", "bio", "avatar"]) as UserBasicType;
    if (isId) return { userId: String(user._id) };
    else return user;
  } catch (error: any) {
    return { status: 500, errMsg: `Failed to fetch user: ${error.message}` };
  }
}

// 更新用户的个人信息 - PATCH
export async function updateUser({
  address,
  formData,
  avatar,
}: {
  address: `0x${string}`;
  formData: FormData;
  avatar: string;
}) {
  const username = String(formData.get("username"));
  const email = String(formData.get("email"));
  const bio = String(formData.get("bio"));

  // 对客户端传来的数据做校验
  const { isValid, errors } = UpdateUserValidation({ username, email, bio });
  if (!isValid) return { status: 400, ValidationErrors: errors };

  try {
    await connectToDB();

    let user = await User.findOne({ username });

    if (user && String(user.address) !== address)
      return { status:400, errName: "username", errMsg: "Username has been already used!" };

    await User.findOneAndUpdate(
      { address },
      {
        username,
        email,
        bio,
        avatar,
      }
    );

    const tokenData = {
      address,
      username,
      avatar,
      bio,
    };

    // 对更新后的用户重新生成JWT
    const secret = process.env.JWT_SECRET || "";
    const token = sign(tokenData, secret, {
      expiresIn: EXPIRE_AGE,
    });

    // 对更新后的用户重新设置Cookies
    cookies().set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: EXPIRE_AGE,
      path: "/",
    });

    revalidatePath("/account");

    return { status: 200, message: "Updated" };
  } catch (error: any) {
    return { status: 500, errMsg: `Failed to update user: ${error.message}` };
  }
}

// 生成需要用户去签名的Message
export async function requestMessage({ address }: { address: `0x${string}` }) {
  try {
    const nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const message =
      `Welcome to SonarMeta - On-chain nuturing & authorization network for emerging IPs.\n\n` +
      `Click to sign in and accept the SonarMeta Terms of Service (https://www.sonarmeta.com/tos) and Privacy Policy (https://www.sonarmeta.com/privacy).\n\n` +
      `This request will not trigger a blockchain transaction or cost any gas fees.\n\n` +
      `Wallet address:\n${address}\n\n` +
      `Nonce:\n${nonce}`;

    return { message };
  } catch (error: any) {
    return { status: 500, errMsg: `Failed to generate message: ${error.message}`, message: "" };
  }
}

// 验证用户的签名并登录用户
export async function verifySignature({
  address,
  message,
  signature,
}: {
  address: `0x${string}`;
  message: string;
  signature: `0x${string}`;
}) {
  try {
    const recoveredAddress = await verifyMessage({ address, message, signature });

    // 验证签名是否匹配用户地址
    if (!recoveredAddress) return { status: 401, message: "Unauthenticated" };

    await connectToDB();

    let user = await User.findOne({ address });

    if (!user) {
      user = new User({
        address,
        username: `SonarMeta user-${Date.now()}`,
        bio: "This guy has nothing to say...",
      });
      await user.save();
    }

    const tokenData = {
      address,
      username: user ? user.username : `SonarMeta user-${Date.now()}`,
      avatar: user ? user.avatar : "",
      bio: user ? user.bio : "This guy has nothing to say...",
    };

    // 生成JWT
    const secret = process.env.JWT_SECRET || "";
    const token = sign(tokenData, secret, {
      expiresIn: EXPIRE_AGE,
    });

    // 设置Cookies
    cookies().set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: EXPIRE_AGE,
      path: "/",
    });

    return { status: 200, message: "Authenticated" };
  } catch (error: any) {
    return { status: 500, errMsg: `Failed to verify message: ${error.message}` };
  }
}

// 登出用户
export async function signOutUser() {
  cookies().delete(COOKIE_NAME);
  return { message: "Signed out" };
}
