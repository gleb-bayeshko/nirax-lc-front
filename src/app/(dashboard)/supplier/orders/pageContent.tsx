"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomPagination } from "@/components/common/CustomPagination";
import { useOrders } from "@/api/orders/use-orders";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function OrdersPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const id = localStorage.getItem("supplierId");

  const currentPage = Number(searchParams.get("page")) || 1;
  const limit = 40;

  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const formatDate = (date: Date) => date.toISOString().slice(0, 10);

  const defaultDateFrom = formatDate(firstDayOfMonth);
  const defaultDateTo = formatDate(today);

  const [dateFrom, setDateFrom] = useState(
    searchParams.get("dateFrom") || defaultDateFrom
  );
  const [dateTo, setDateTo] = useState(
    searchParams.get("dateTo") || defaultDateTo
  );
  const [dateSort, setDateSort] = useState<"ASC" | "DESC">(
    (searchParams.get("sort") as "ASC" | "DESC") || "DESC"
  );

  const updateParams = (paramsUpdate: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(paramsUpdate)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    updateParams({
      dateFrom,
      dateTo,
      sort: dateSort,
      page: "1",
    });
  }, [dateFrom, dateTo, dateSort]);

  const { data, isLoading } = useOrders(
    +id! || 0,
    currentPage,
    limit,
    dateFrom,
    dateTo,
    dateSort
  );

  const handlePageChange = (page: number) => {
    updateParams({
      page: page.toString(),
      dateFrom,
      dateTo,
      sort: dateSort,
    });
  };

  return (
    <div className="container mx-auto pb-8 w-full">
      <h1 className="text-2xl font-bold mb-6">История заказов</h1>

      <div className="flex justify-between">
        <div className="flex items-end gap-4 mb-6 flex-wrap ">
          <div className="flex flex-col">
            <Label htmlFor="sort" className="mb-2">
              Сортировка
            </Label>
            <Select
              value={dateSort}
              onValueChange={(value: "ASC" | "DESC") => setDateSort(value)}
            >
              <SelectTrigger id="sort" className="w-[160px]">
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DESC">Сначала новые</SelectItem>
                <SelectItem value="ASC">Сначала старые</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col">
            <Label htmlFor="dateFrom" className="mb-2">
              С даты
            </Label>
            <Input
              type="date"
              id="dateFrom"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <Label htmlFor="dateTo" className="mb-2">
              По дату
            </Label>
            <Input
              type="date"
              id="dateTo"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </div>
        <div>
          {`Итого за период: количество `}
          <span className="font-bold">{`${data?.totalDeliveryCount}`}</span>
          {`, сумма `}
          <span className="font-bold">{`${data?.totalPriceIn?.toLocaleString(
            "ru-RU"
          )} ₽`}</span>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-y-2">
          {Array.from({ length: 10 }).map((_, idx) => (
            <Skeleton key={idx} className="h-10 w-full" />
          ))}
        </div>
      ) : (
        <>
          <div className="rounded-md border max-w-full overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Дата</TableHead>
                  <TableHead>Артикул</TableHead>
                  <TableHead>Производитель</TableHead>
                  <TableHead>Наименование</TableHead>
                  <TableHead>Склад</TableHead>
                  <TableHead>Количество</TableHead>
                  <TableHead>Цена</TableHead>
                  <TableHead>Сумма</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.date
                        ? new Intl.DateTimeFormat("ru-RU", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(new Date(item.date))
                        : ""}
                    </TableCell>
                    <TableCell className="max-w-[100px]">
                      {item.article}
                    </TableCell>
                    <TableCell className="max-w-[100px] text-wrap whitespace-normal">
                      {item.manufacturer}
                    </TableCell>
                    <TableCell className="text-wrap whitespace-normal max-w-[100px]">
                      {item.articleName}
                    </TableCell>
                    <TableCell className="max-w-[100px] text-wrap whitespace-normal">
                      {item.supplierStore}
                    </TableCell>
                    <TableCell className="max-w-[60px] text-wrap whitespace-normal">
                      {item.deliveryCount}
                    </TableCell>
                    <TableCell>
                      {item.priceIn.toLocaleString("ru-RU")} ₽
                    </TableCell>
                    <TableCell>
                      {(item.priceIn * item.deliveryCount).toLocaleString(
                        "ru-RU"
                      )}{" "}
                      ₽
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {data && (
            <div className="mt-8">
              <CustomPagination
                currentPage={currentPage}
                pages={Math.ceil(data.total / limit)}
                limit={limit}
                total={data.total}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
