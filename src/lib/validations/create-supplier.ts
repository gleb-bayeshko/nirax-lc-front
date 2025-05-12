import * as z from "zod";

export const createSupplierSchema = z.object({
  site: z
    .string()
    .min(1, "Обязательное поле")
    .regex(
      /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/,
      "Неверный формат сайта (например, example.com)"
    ),
  description: z.string(),
  company: z.string(),
  contactPerson: z.string(),
  phone: z
    .string(),
  email: z.string().min(1, "Обязательное поле").email("Некорректный email"),
});

export type CreateSupplierSchema = z.infer<typeof createSupplierSchema>;
