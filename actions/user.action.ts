"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import bcryptjs from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import _ from "lodash";

import { connectToDB } from "@/lib/mongoose";
import User from "@/models/user.model";
import { SignInValidation, SignUpValidation, UpdateUserValidation } from "@/validations/user.validation";
import { COOKIE_NAME, EXPIRE_AGE } from "@/constants";
import { UserBasicType } from "@/types/UserTypes";

// 获取当前登录用户信息 - GET
export async function getCurrentUser() {
  const token = cookies().get(COOKIE_NAME);

  if (!token) return { status: 401, message: "Access denied. No token provided", user: null };

  try {
    const secret = process.env.JWT_SECRET || "";
    const decoded = verify(token.value, secret);

    return {
      status: 200,
      message: "ok",
      user: _.pick(decoded, ["id", "phone", "username", "avatar"]) as {
        id: string;
        phone: string;
        username: string;
        avatar: string;
      },
    };
  } catch (error: any) {
    throw new Error(`Failed to get the current user: ${error.message}`);
  }
}

// 获取用户信息 - GET
export async function fetchUser({ userId, isBasic }: { userId: string; isBasic: boolean }) {
  try {
    await connectToDB();

    const user = await User.findById(userId);

    if (isBasic) return _.pick(user, ["_id", "phone", "username", "email", "bio", "avatar"]) as UserBasicType;
    else return user;
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

// 登录用户 - POST
export async function signInUser(formData: FormData) {
  const phone = String(formData.get("phone"));
  const password = String(formData.get("password"));

  // 对客户端传来的数据做校验
  const { isValid, errors } = SignInValidation({ phone, password });
  if (!isValid) return { ValidationErrors: errors };

  try {
    await connectToDB();

    let user = await User.findOne({ phone });
    if (!user) return { errName: "phone", errMsg: "未注册或无效的手机号" };

    // 解密哈希密码并和客户端密码比对
    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) return { errName: "password", errMsg: "密码不匹配该手机号" };

    // 生成JWT
    const secret = process.env.JWT_SECRET || "";
    const token = sign(
      {
        id: user._id,
        phone: user.phone,
        username: user.username,
        avatar: user.avatar,
      },
      secret,
      {
        expiresIn: EXPIRE_AGE,
      }
    );

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
    throw new Error(`Failed to sign in user: ${error.message}`);
  }
}

// 登出用户
export async function signOutUser() {
  cookies().delete(COOKIE_NAME);
  return { message: "Signed out" };
}

// 注册新用户 - POST
export async function createUser(formData: FormData) {
  const phone = String(formData.get("phone"));
  const password = String(formData.get("password"));
  const passwordAgain = String(formData.get("passwordAgain"));

  // 对客户端传来的数据做校验
  const { isValid, errors } = SignUpValidation({ phone, password, passwordAgain });
  if (!isValid) return { ValidationErrors: errors };

  try {
    await connectToDB();

    let user = await User.findOne({ phone });
    if (user) return { errName: "phone", errMsg: "此手机号已经被注册了" };

    if (password !== passwordAgain) return { errName: "passwordAgain", errMsg: "两次密码输入的不一致" };

    // 对密码进行哈希加密
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    user = new User({
      phone,
      username: `声呐元用户-${Date.now()}`,
      password: hashedPassword,
    });
    await user.save();

    return { status: 201, message: "Created" };
  } catch (error: any) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
}

// 更新用户的个人信息 - PATCH
export async function updateUser({
  userId,
  phone,
  formData,
  pathname,
  avatar,
}: {
  userId: string;
  phone: string;
  formData: FormData;
  pathname: string;
  avatar: string;
}) {
  const username = String(formData.get("username"));
  const email = String(formData.get("email"));
  const bio = String(formData.get("bio"));

  // 对客户端传来的数据做校验
  const { isValid, errors } = UpdateUserValidation({ username, email, bio });
  if (!isValid) return { ValidationErrors: errors };

  try {
    await connectToDB();

    let user = await User.findOne({ username });

    if (user && String(user._id) !== userId) return { errName: "username", errMsg: "此用户名已经被使用了" };

    await User.findByIdAndUpdate(userId, {
      username,
      email,
      bio,
      avatar,
      onboarded: true,
    });

    // 对更新后的用户重新生成JWT
    const secret = process.env.JWT_SECRET || "";
    const token = sign(
      {
        id: userId,
        phone,
        username,
        avatar,
      },
      secret,
      {
        expiresIn: EXPIRE_AGE,
      }
    );

    // 对更新后的用户重新设置Cookies
    cookies().set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: EXPIRE_AGE,
      path: "/",
    });

    if (pathname === "/account") revalidatePath(pathname);

    return { status: 200, message: "Updated" };
  } catch (error: any) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
}
