import * as z from "zod";

// 密码规则
const passwordRule = z
  .string()
  .min(6, { message: "Within the range of 6 to 16." })
  .max(16, { message: "Within the range of 6 to 16." })
  .refine((password) => /[A-Z]/.test(password), {
    message: "Must include at least one uppercase letter.",
  })
  .refine((password) => /[a-z]/.test(password), {
    message: "Must include at least one lowercase letter.",
  })
  .refine((password) => /[0-9]/.test(password), {
    message: "Must include at least one number.",
  });

// 登录用户的校验
export const SignInValidation = (user: { phone: string; password: string }) => {
  const schema = z.object({
    phone: z
      .string()
      .min(5, { message: "Within the range of 5 to 16." })
      .max(16, { message: "Within the range of 5 to 16." }),
    password: passwordRule,
  });

  const result = schema.safeParse(user);

  if (result.success) return { isValid: true, errors: null };
  else return { isValid: false, errors: result.error.format() };
};

// 注册新用户的校验
export const SignUpValidation = (user: { phone: string; password: string; passwordAgain: string }) => {
  const schema = z.object({
    phone: z
      .string()
      .min(5, { message: "Within the range of 5 to 16." })
      .max(16, { message: "Within the range of 5 to 16." }),
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
    username: z.string().nonempty({ message: "No empty" }).max(30, { message: "Username is too long" }),
    email: z.string().email({ message: "Invalid email format" }).or(z.literal("")),
    bio: z.string().max(1000, { message: "Bio is too long" }),
  });

  const result = schema.safeParse(user);

  if (result.success) return { isValid: true, errors: null };
  else return { isValid: false, errors: result.error.format() };
};
