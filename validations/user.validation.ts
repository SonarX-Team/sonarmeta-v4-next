import * as z from "zod";

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
