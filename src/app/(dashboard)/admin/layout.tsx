"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarFooter,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { RxAvatar } from "react-icons/rx";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

// Константа с пунктами меню
const menuItems = [
  { name: "Заявки", path: "/admin" },
  // Можно добавить дополнительные пункты меню по мере необходимости
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname(); // Получаем текущий путь

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("supplier");
    router.push("/login");
  };

  return (
    <SidebarProvider>
      {/* Сайдбар */}
      <Sidebar>
        <SidebarContent className=" text-white">
          <div className="flex items-center py-3 px-2">
            <img src="/logo-white.png" alt="logo" className="w-[100px] ml-9" />
          </div>
          {/* Секции меню */}
          <SidebarGroup className="p-0 mt-10">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`hover:bg-gray-700 py-3 px-4 ${
                  pathname === item.path ? "bg-gray-600" : ""
                }`} // Подсветка активного пункта
              >
                {item.name}
              </Link>
            ))}
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* Основной контент */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow p-4 px-10 flex justify-end items-center fixed w-[calc(100%-200px)]">
          <div className="mr-4">Администратор</div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
              <RxAvatar className="w-[24px] h-[24px] text-primary" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="" side="bottom" align="end">
              <DropdownMenuItem onClick={handleLogout}>Выйти</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="p-6 mt-[56px]">{children}</main>
      </div>
    </SidebarProvider>
  );
}
