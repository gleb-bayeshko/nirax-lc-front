import * as z from "zod";

export const LoginSchema = z.object({
  login: z.string().min(3, { message: "Введите корректный логин" }),
  password: z
    .string()
    .min(6, { message: "Пароль должен быть не менее 6 символов" }),
});

export const RegisterSchema = z.object({
  companyName: z.string().min(2, "Название компании слишком короткое"),
  fullName: z.string().min(3, "ФИО слишком короткое"),
  phone: z.string().min(10, "Введите корректный номер телефона"),
  email: z.string().email("Введите корректный email"),
});

export type LoginFormValues = z.infer<typeof LoginSchema>;
export type RegisterFormValues = z.infer<typeof RegisterSchema>;
