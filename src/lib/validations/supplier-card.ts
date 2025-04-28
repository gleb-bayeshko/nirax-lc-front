import * as z from "zod";

const optionalStringSchema = z
  .union([
    z.string().min(1), // Непустая строка
    z.literal(""),
    z.null(),
  ])
  .transform((val) => (val === null ? "" : val));

export const SupplierSchema = z.object({
  companyName: z.string().min(2, "Название компании слишком короткое"),
  website: optionalStringSchema.refine(
    (val) => val === "" || z.string().url().safeParse(val).success,
    {
      message: "Некорректная ссылка на сайт",
    }
  ),
  description: optionalStringSchema.refine(
    (val) => val === "" || val.length >= 10,
    {
      message: "Описание слишком короткое",
    }
  ),
  phone: optionalStringSchema.refine((val) => val === "" || val.length >= 10, {
    message: "Введите корректный номер телефона",
  }),
  assortment: optionalStringSchema.refine(
    (val) => val === "" || val.length >= 3,
    {
      message: "Введите ассортимент товаров",
    }
  ),
  storageArea: optionalStringSchema.refine(
    (val) => val === "" || val.length >= 3,
    {
      message: "Введите зону хранения товаров",
    }
  ),
  ownBrand: optionalStringSchema.refine(
    (val) => val === "" || val.length >= 3,
    {
      message: "Введите собственный бренд",
    }
  ),
  regions: optionalStringSchema.refine((val) => val === "" || val.length >= 3, {
    message: "Введите регионы доставки",
  }),
  priceListToEmail: z.boolean().default(false),
  workByApi: z.boolean().default(false),
  serverSpeed: z.number().min(0, "Укажите скорость ответа сервера").default(0),
  apiDocUrl: optionalStringSchema.refine(
    (val) => val === "" || z.string().url().safeParse(val).success,
    {
      message: "Некорректная ссылка на документацию API",
    }
  ),
  apiSearch: z.boolean().default(false),
  apiOrder: z.boolean().default(false),
  apiTracking: z.boolean().default(false),
  fullName: optionalStringSchema.refine(
    (val) => val === "" || val.length >= 3,
    {
      message: "ФИО контактного лица слишком короткое",
    }
  ),
  contactPhone: optionalStringSchema.refine(
    (val) => val === "" || val.length >= 10,
    {
      message: "Введите корректный контактный телефон",
    }
  ),
  contactEmail: optionalStringSchema.refine(
    (val) => val === "" || z.string().email().safeParse(val).success,
    {
      message: "Некорректный контактный email",
    }
  ),
});

export type SupplierFormValues = z.infer<typeof SupplierSchema>;
