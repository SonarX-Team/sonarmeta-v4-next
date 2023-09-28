import * as z from "zod";

// 创建 or 更新 Union 的校验
export const createUnionValidation = (union: { title: string; description: string; recruitment: string}) => {
  const schema = z.object({
    title: z.string().nonempty({ message: "不能为空" }).max(30, { message: "工会名称太长了" }),
    description: z.string().nonempty({ message: "不能为空" }).max(2000, { message: "工会介绍内容太长了" }),
    recruitment: z.string().nonempty({ message: "不能为空" }).max(2000, { message: "招募说明内容太长了" }),
  });

  const result = schema.safeParse(union);

  if (result.success) return { isValid: true, errors: null };
  else return { isValid: false, errors: result.error.format() };
};
