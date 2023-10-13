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
export const createIPValidation = (ip: {
  title: string;
  description: string;
  agreement: string;
  officialLink: string;
}) => {
  const schema = z.object({
    title: z.string().nonempty({ message: "No empty" }).max(30, { message: "IP's name is too long" }),
    description: z.string().nonempty({ message: "No empty" }).max(2000, { message: "IP's story is too long" }),
    agreement: z.string().nonempty({ message: "No empty" }).max(2000, { message: "Agreement is too long" }),
    officialLink: z.string().refine(urlValidator, { message: "Follow the example format: https://example.com" }),
  });

  const result = schema.safeParse(ip);

  if (result.success) return { isValid: true, errors: null };
  else return { isValid: false, errors: result.error.format() };
};
