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

// 创建 or 更新 IP 的校验
export const createIPValidation = (ip: { title: string; description: string; officialLink: string }) => {
  const schema = z.object({
    title: z.string().nonempty({ message: "不能为空" }).max(30, { message: "IP名称太长了" }),
    description: z.string().nonempty({ message: "不能为空" }).max(2000, { message: "IP介绍内容太长了" }),
    officialLink: z.string().refine(urlValidator, { message: "不是正确的网络路由格式" }),
  });

  const result = schema.safeParse(ip);

  if (result.success) return { isValid: true, errors: null };
  else return { isValid: false, errors: result.error.format() };
};
