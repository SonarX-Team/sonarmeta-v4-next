import * as z from "zod";

import { urlValidator } from "@/lib/utils";

// 创建or更新IP DAO的校验
export const ipDaoValidation = (ipDao: {
  title: string;
  description: string;
  recruitment: string;
  externalLink: string;
}) => {
  const schema = z.object({
    title: z.string().nonempty({ message: "No empty" }).max(60, { message: "IP DAO's name is too long" }),
    description: z
      .string()
      .nonempty({ message: "No empty" })
      .max(2000, { message: "IP DAO's description is too long" }),
    recruitment: z.string().nonempty({ message: "No empty" }).max(2000, { message: "Recruitment is too long" }),
    externalLink: z.string().refine(urlValidator, { message: "Follow the example format: https://example.com" }),
  });

  const result = schema.safeParse(ipDao);

  if (result.success) return { isValid: true, errors: null };
  else return { isValid: false, errors: result.error.format() };
};
