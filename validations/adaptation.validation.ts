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
    title: z.string().nonempty({ message: "No empty" }).max(30, { message: "Adaptation's name is too long" }),
    description: z.string().nonempty({ message: "No empty" }).max(2000, { message: "Adaptation's description is too long" }),
    url: z
      .string()
      .nonempty({ message: "No empty" })
      .refine(urlValidator, { message: "Follow the example format: https://example.com" }),
  });

  const result = schema.safeParse(adaptation);

  if (result.success) return { isValid: true, errors: null };
  else return { isValid: false, errors: result.error.format() };
};
