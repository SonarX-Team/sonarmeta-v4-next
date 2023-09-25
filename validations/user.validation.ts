import * as z from "zod";

// 密码规则
const passwordRule = z
  .string()
  .min(6, { message: "长度在6~16范围内" })
  .max(16, { message: "长度在6~16范围内" })
  .refine((password) => /[A-Z]/.test(password), {
    message: "至少包含一个大写字母",
  })
  .refine((password) => /[a-z]/.test(password), {
    message: "至少包含一个小写字母",
  })
  .refine((password) => /[0-9]/.test(password), {
    message: "至少包含一个数字",
  });

// 登录用户的校验
export const SignInValidation = (user: { phone: string; password: string }) => {
  const schema = z.object({
    phone: z.string().min(5, { message: "长度在5~16范围内" }).max(16, { message: "长度在5~16范围内" }),
    password: passwordRule,
  });

  const result = schema.safeParse(user);

  if (result.success) return { isValid: true, errors: null };
  else return { isValid: false, errors: result.error.format() };
};

// 注册新用户的校验
export const SignUpValidation = (user: { phone: string; password: string; passwordAgain: string }) => {
  const schema = z.object({
    phone: z.string().min(5, { message: "长度在5~16范围内" }).max(16, { message: "长度在5~16范围内" }),
    password: passwordRule,
    passwordAgain: passwordRule,
  });

  const result = schema.safeParse(user);

  if (result.success) return { isValid: true, errors: null };
  else return { isValid: false, errors: result.error.format() };
};

// 更新用户的校验
export const UpdateUserValidation = (user: { username: string; email: string; bio: string }) => {
  const schema = z.object({
    username: z.string().nonempty({ message: "不能为空" }).max(30, { message: "用户名太长了" }),
    email: z.string().email({ message: "无效的邮箱格式" }).or(z.literal("")),
    bio: z.string().max(1000, { message: "个性签名内容太长了" }),
  });

  const result = schema.safeParse(user);

  if (result.success) return { isValid: true, errors: null };
  else return { isValid: false, errors: result.error.format() };
};
