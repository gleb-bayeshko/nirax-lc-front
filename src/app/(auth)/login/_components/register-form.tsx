"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, RegisterFormValues } from "@/lib/validations/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRegister } from "@/api/auth/use-register";
import { enqueueSnackbar } from "notistack";

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
  });

  const registerMutation = useRegister();

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerMutation.mutateAsync(data);
      enqueueSnackbar("Заявка на регистрацию создана. В ближайшее время с вами свяжется наш менеджер", { variant: "success" });
      reset()
      // TODO: можно переключить таб на "login"
    } catch (error) {
      // Ошибки уже ловятся интерцептором
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Input
          placeholder="Название компании"
          {...register("companyName")}
          aria-invalid={errors.companyName ? "true" : "false"}
        />
        {errors.companyName && (
          <p className="text-sm text-destructive">
            {errors.companyName.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Input
          placeholder="ФИО"
          {...register("fullName")}
          aria-invalid={errors.fullName ? "true" : "false"}
        />
        {errors.fullName && (
          <p className="text-sm text-destructive">{errors.fullName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Input
          placeholder="Телефон"
          {...register("phone")}
          aria-invalid={errors.phone ? "true" : "false"}
        />
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Input
          placeholder="Email"
          {...register("email")}
          aria-invalid={errors.email ? "true" : "false"}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || registerMutation.isPending}
      >
        Зарегистрироваться
      </Button>
    </form>
  );
}
