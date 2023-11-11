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

// 创建or更新Creation的校验
export const creationValidation = (creation: {
  title: string;
  description: string;
  agreement: string;
  externalLink: string;
}) => {
  const schema = z.object({
    title: z.string().nonempty({ message: "No empty" }).max(30, { message: "Creation's name is too long" }),
    description: z
      .string()
      .nonempty({ message: "No empty" })
      .max(2000, { message: "Creation's description is too long" }),
    agreement: z.string().nonempty({ message: "No empty" }).max(2000, { message: "Agreement is too long" }),
    externalLink: z.string().refine(urlValidator, { message: "Follow the example format: https://example.com" }),
  });

  const result = schema.safeParse(creation);

  if (result.success) return { isValid: true, errors: null };
  else return { isValid: false, errors: result.error.format() };
};
