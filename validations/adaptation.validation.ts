import * as z from "zod";

const urlValidator = (value: string) => {
  try {
    if (!value) return true;

    new URL(value);
    return true;
  } catch {
    return false;
  }
};

// 创建 or 更新 Adaptation 的校验
export const createAdaptationValidation = (adaptation: { title: string; description: string; url: string }) => {
  const schema = z.object({
    title: z.string().nonempty({ message: "不能为空" }).max(30, { message: "二创名称太长了" }),
    description: z.string().nonempty({ message: "不能为空" }).max(2000, { message: "二创简介太长了" }),
    url: z
      .string()
      .nonempty({ message: "不能为空" })
      .refine(urlValidator, { message: "路由格式请参考https://example.com" }),
  });

  const result = schema.safeParse(adaptation);

  if (result.success) return { isValid: true, errors: null };
  else return { isValid: false, errors: result.error.format() };
};
