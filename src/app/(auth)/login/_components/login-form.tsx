"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginFormValues } from "@/lib/validations/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/api/auth/use-login";
import { enqueueSnackbar } from "notistack";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { DecodedToken } from "@/hooks/useAuth";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
  });

  const loginMutation = useLogin();

  const router = useRouter();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const { result: res } = await loginMutation.mutateAsync(data);

      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);

      const decoded = jwtDecode<DecodedToken>(res.accessToken);

      localStorage.setItem("role", decoded.role);
      if (decoded.role === "supplier") {
        localStorage.setItem("supplierId", decoded.id);
      }

      enqueueSnackbar("Успешный вход", { variant: "success" });

      router.push(decoded.role === "admin" ? "/admin" : "/supplier");
      return null;
      // TODO: redirect на дашборд
    } catch (error) {
      // Ошибки уже ловятся интерцептором
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Input
          placeholder="Логин"
          {...register("login")}
          aria-invalid={errors.login ? "true" : "false"}
        />
        {errors.login && (
          <p className="text-sm text-destructive">{errors.login.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Input
          placeholder="Пароль"
          type="password"
          {...register("password")}
          aria-invalid={errors.password ? "true" : "false"}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || loginMutation.isPending}
      >
        Войти
      </Button>
    </form>
  );
}
