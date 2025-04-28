"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { LoginForm } from "./_components/login-form";
import { RegisterForm } from "./_components/register-form";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const accessToken = localStorage.getItem("accessToken");
  const decoded = accessToken ? jwtDecode(accessToken) : {};


  if (accessToken) {
    router.push(decoded.role === "admin" ? "/admin" : "/supplier");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-[420px]">
        <CardContent className="p-6 pt-0">
          <div className="flex justify-center mb-10">
            <Image src="/logo.png" alt="Logo" width={100} height={100} />
          </div>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Вход</TabsTrigger>
              <TabsTrigger value="register">Регистрация</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
