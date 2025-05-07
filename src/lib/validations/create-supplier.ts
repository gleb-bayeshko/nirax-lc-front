import * as z from "zod";

export const createSupplierSchema = z.object({
  site: z.string().min(1, "Обязательное поле"),
  siteRU: z.string().min(1, "Обязательное поле"),
  description: z.string().min(1, "Обязательное поле"),
});

export type CreateSupplierSchema = z.infer<typeof createSupplierSchema>;
