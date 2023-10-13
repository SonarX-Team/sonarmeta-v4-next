import * as z from "zod";

// 创建 or 更新 Union 的校验
export const createUnionValidation = (union: { title: string; description: string; recruitment: string }) => {
  const schema = z.object({
    title: z.string().nonempty({ message: "No empty" }).max(30, { message: "Union's name is too long" }),
    description: z.string().nonempty({ message: "No empty" }).max(2000, { message: "Union's description is too long" }),
    recruitment: z.string().nonempty({ message: "No empty" }).max(2000, { message: "Recruitment is too long" }),
  });

  const result = schema.safeParse(union);

  if (result.success) return { isValid: true, errors: null };
  else return { isValid: false, errors: result.error.format() };
};
