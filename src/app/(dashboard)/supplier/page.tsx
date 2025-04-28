"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSupplierData } from "@/api/supplier-card/user-supplier-data";
import { useUpdateSupplierData } from "@/api/supplier-card/use-update-supplier-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  SupplierFormValues,
  SupplierSchema,
} from "@/lib/validations/supplier-card";
import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { enqueueSnackbar } from "notistack";
import { SupplierPhotos } from "./_components/supplier-photos";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function SupplierPage() {
  const id = localStorage.getItem("supplierId");
  const { data, isLoading, isFetched } = useSupplierData(+id! || 0);
  const { mutateAsync } = useUpdateSupplierData();

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isDirty },
    setValue,
    watch,
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(SupplierSchema),
    values: {
      ...data,
      companyName: data?.companyName || "",
      priceListToEmail: data?.priceListToEmail ? true : false,
      workByApi: data?.workByApi ? true : false,
      apiSearch: data?.apiSearch ? true : false,
      apiOrder: data?.apiOrder ? true : false,
      apiTracking: data?.apiTracking ? true : false,
    },
  });

  console.log(touchedFields);

  const onSubmit = async (formData: SupplierFormValues) => {
    const payload = {
      ...formData,
      id: +id!,
      priceListToEmail: formData.priceListToEmail ? 1 : 0,
      workByApi: formData.workByApi ? 1 : 0,
      apiSearch: formData.apiSearch ? 1 : 0,
      apiOrder: formData.apiOrder ? 1 : 0,
      apiTracking: formData.apiTracking ? 1 : 0,
    };

    await mutateAsync(payload).then(() => {
      enqueueSnackbar("Данные сохранены", { variant: "success" });
    });
  };

  return (
    <div>
      <h1 className="text-3xl mb-6">Профиль Поставщика</h1>
      {isLoading ? (
        <div className="grid grid-cols-2 gap-x-20">
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-2xl mb-4">Общая информация</h2>
            <div className="grid grid-cols-2 gap-x-20">
              <div>
                <div className="mb-[20px]">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Название компании
                  </p>
                  <input
                    {...register("companyName")}
                    className={`block w-full px-3 py-2 border rounded-md text-sm focus:outline-none ${
                      errors.companyName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.companyName && (
                    <p className="text-xs text-red-500 mt-2">
                      {errors.companyName?.message}
                    </p>
                  )}
                </div>

                <div className="mb-[20px]">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Сайт компании
                  </p>
                  <input
                    {...register("website")}
                    className={`block w-full px-3 py-2 border rounded-md text-sm focus:outline-none ${
                      errors.website ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.website && (
                    <p className="text-xs text-red-500 mt-2">
                      {errors.website?.message}
                    </p>
                  )}
                </div>

                <div className="mb-[20px]">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Описание компании
                  </p>
                  <input
                    {...register("description")}
                    className={`block w-full px-3 py-2 border rounded-md text-sm focus:outline-none ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500 mt-2">
                      {errors.description?.message}
                    </p>
                  )}
                </div>

                <div className="mb-[20px]">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Телефон
                  </p>
                  <input
                    {...register("phone")}
                    className={`block w-full px-3 py-2 border rounded-md text-sm focus:outline-none ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-2">
                      {errors.phone?.message}
                    </p>
                  )}
                </div>

                <div className="mb-[20px]">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Ассортимент товаров
                  </p>
                  <input
                    {...register("assortment")}
                    className={`block w-full px-3 py-2 border rounded-md text-sm focus:outline-none ${
                      errors.assortment ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.assortment && (
                    <p className="text-xs text-red-500 mt-2">
                      {errors.assortment?.message}
                    </p>
                  )}
                </div>

                <div className="mb-[20px]">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Зона хранения товаров
                  </p>
                  <input
                    {...register("storageArea")}
                    className={`block w-full px-3 py-2 border rounded-md text-sm focus:outline-none ${
                      errors.storageArea ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.storageArea && (
                    <p className="text-xs text-red-500 mt-2">
                      {errors.storageArea?.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="mb-[20px]">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Собственный бренд
                  </p>
                  <input
                    {...register("ownBrand")}
                    className={`block w-full px-3 py-2 border rounded-md text-sm focus:outline-none ${
                      errors.ownBrand ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.ownBrand && (
                    <p className="text-xs text-red-500 mt-2">
                      {errors.ownBrand?.message}
                    </p>
                  )}
                </div>

                <div className="mb-[20px]">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Регионы доставки
                  </p>
                  <input
                    {...register("regions")}
                    className={`block w-full px-3 py-2 border rounded-md text-sm focus:outline-none ${
                      errors.regions ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.regions && (
                    <p className="text-xs text-red-500 mt-2">
                      {errors.regions?.message}
                    </p>
                  )}
                </div>

                <div className="mb-[20px]">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Полное имя контактного лица
                  </p>
                  <input
                    {...register("fullName")}
                    className={`block w-full px-3 py-2 border rounded-md text-sm focus:outline-none ${
                      errors.fullName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-500 mt-2">
                      {errors.fullName?.message}
                    </p>
                  )}
                </div>

                <div className="mb-[20px]">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Контактный телефон
                  </p>
                  <input
                    {...register("contactPhone")}
                    className={`block w-full px-3 py-2 border rounded-md text-sm focus:outline-none ${
                      errors.contactPhone ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.contactPhone && (
                    <p className="text-xs text-red-500 mt-2">
                      {errors.contactPhone?.message}
                    </p>
                  )}
                </div>

                <div className="mb-[20px]">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Контактный email
                  </p>
                  <input
                    {...register("contactEmail")}
                    className={`block w-full px-3 py-2 border rounded-md text-sm focus:outline-none ${
                      errors.contactEmail ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.contactEmail && (
                    <p className="text-xs text-red-500 mt-2">
                      {errors.contactEmail?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <h2 className="text-2xl mb-4 mt-6">Техническая информация</h2>
            <div className="col-span-2 grid grid-cols-2 gap-x-20 gap-y-4 mt-6">
              <div className="flex items-center space-x-4">
                <Switch
                  id="priceListToEmail"
                  checked={watch("priceListToEmail")}
                  onCheckedChange={(checked) =>
                    setValue("priceListToEmail", checked, { shouldDirty: true })
                  }
                />
                <Label htmlFor="priceListToEmail">Прайс-лист по email</Label>
              </div>

              <div className="flex items-center space-x-4">
                <Switch
                  id="workByApi"
                  checked={watch("workByApi")}
                  onCheckedChange={(checked) =>
                    setValue("workByApi", checked, { shouldDirty: true })
                  }
                />
                <Label htmlFor="workByApi">Работа по API</Label>
              </div>

              <div className="flex items-center space-x-4">
                <Switch
                  id="apiSearch"
                  checked={watch("apiSearch")}
                  onCheckedChange={(checked) =>
                    setValue("apiSearch", checked, { shouldDirty: true })
                  }
                />
                <Label htmlFor="apiSearch">API поиска</Label>
              </div>

              <div className="flex items-center space-x-4">
                <Switch
                  id="apiOrder"
                  checked={watch("apiOrder")}
                  onCheckedChange={(checked) =>
                    setValue("apiOrder", checked, { shouldDirty: true })
                  }
                />
                <Label htmlFor="apiOrder">API заказов</Label>
              </div>

              <div className="flex items-center space-x-4">
                <Switch
                  id="apiTracking"
                  checked={watch("apiTracking")}
                  onCheckedChange={(checked) =>
                    setValue("apiTracking", checked, { shouldDirty: true })
                  }
                />
                <Label htmlFor="apiTracking">API отслеживания</Label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-20 mt-6">
              <div className="mb-[20px]">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Скорость ответа сервера (сек)
                </p>
                <input
                  type="number"
                  step="0.01"
                  {...register("serverSpeed", { valueAsNumber: true })}
                  className={`block w-full px-3 py-2 border rounded-md text-sm focus:outline-none ${
                    errors.serverSpeed ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.serverSpeed && (
                  <p className="text-xs text-red-500 mt-2">
                    {errors.serverSpeed?.message}
                  </p>
                )}
              </div>

              {/* Поле для apiDocUrl */}
              <div className="mb-[20px]">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Ссылка на документацию API
                </p>
                <input
                  {...register("apiDocUrl")}
                  className={`block w-full px-3 py-2 border rounded-md text-sm focus:outline-none ${
                    errors.apiDocUrl ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.apiDocUrl && (
                  <p className="text-xs text-red-500 mt-2">
                    {errors.apiDocUrl?.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="min-w-[200px] min-h-4"
                disabled={!isDirty}
              >
                Сохранить
              </Button>
            </div>
          </form>

          <SupplierPhotos supplierId={+id!} />
        </>
      )}
    </div>
  );
}
