"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSuppliersList } from "@/api/applications/use-suppliers-list";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useCreateSupplier } from "@/api/applications/use-create-supplier";
import {
  createSupplierSchema,
  CreateSupplierSchema,
} from "@/lib/validations/create-supplier";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface SupplierSelectModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (supplierId: number) => void;
  onSelectNew: (supplierId?: number) => void;
  site?: string;
  email?: string;
  contactPerson?: string;
  phone?: string;
  company?: string;
  description?: string;
  applicationId?: number | null;
}

export function SupplierSelectModal({
  open,
  onClose,
  onSelect,
  onSelectNew,
  company,
  contactPerson,
  description,
  email,
  phone,
  site,
  applicationId,
}: SupplierSelectModalProps) {
  const { data: suppliers, isLoading } = useSuppliersList();
  const { mutateAsync: createSupplier, isPending: isCreating } =
    useCreateSupplier();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSuppliers = suppliers?.filter((supplier) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      supplier.site.toLowerCase().includes(searchLower) ||
      (supplier.siteRU && supplier.siteRU.toLowerCase().includes(searchLower))
    );
  });

  const form = useForm<CreateSupplierSchema>({
    resolver: zodResolver(createSupplierSchema),
    values: {
      site: site || "",
      email: email || "",
      contactPerson: contactPerson || "",
      phone: phone || "",
      company: company || "",
      description: description || "",
    },
  });

  const onSubmit = async (values: CreateSupplierSchema) => {
    try {
      const res = await createSupplier({
        ...values,
        applicationId: applicationId,
      });
      onSelectNew();
      onClose();
    } catch (error) {
      console.error("Ошибка при создании поставщика", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Выберите или создайте поставщика</DialogTitle>
        </DialogHeader>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <Tabs defaultValue="existing" className="space-y-4">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="existing">Текущий поставщик</TabsTrigger>
              <TabsTrigger value="new">Новый поставщик</TabsTrigger>
            </TabsList>

            <TabsContent value="existing">
              <Input
                placeholder="Поиск поставщика..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {isLoading ? (
                <div className="text-center py-4">
                  Загрузка списка поставщиков...
                </div>
              ) : (
                <ScrollArea className="h-64 rounded-md border mt-2">
                  <div className="divide-y">
                    {filteredSuppliers?.map((supplier) => (
                      <div
                        key={supplier.idSupplier}
                        className="p-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          onSelect(supplier.idSupplier);
                          onClose();
                        }}
                      >
                        <div className="font-medium">
                          {supplier.siteRU || supplier.site}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {supplier.idSupplier}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
            <TabsContent value="new" className="max-w-full">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <Label htmlFor="site">Сайт поставщика</Label>
                <Input
                  placeholder="Сайт поставщика в формате example.com"
                  {...form.register("site")}
                />
                {form.formState.errors.site && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.site.message}
                  </p>
                )}

                <Label htmlFor="email">Email</Label>
                <Input placeholder="Email" {...form.register("email")} />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}

                <Label htmlFor="company">Компания</Label>
                <Input placeholder="Компания" {...form.register("company")} />
                {form.formState.errors.company && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.company.message}
                  </p>
                )}

                <Label htmlFor="contactPerson">Контактное лицо</Label>
                <Input
                  placeholder="Контактное лицо"
                  {...form.register("contactPerson")}
                />
                {form.formState.errors.contactPerson && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.contactPerson.message}
                  </p>
                )}

                <Label htmlFor="phone">Телефон</Label>
                <Input placeholder="Телефон" {...form.register("phone")} />
                {form.formState.errors.phone && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.phone.message}
                  </p>
                )}

                <Label htmlFor="description">Описание</Label>
                <Textarea
                  placeholder="Описание"
                  className="resize-none min-h-[200px] max-w-full"
                  {...form.register("description")}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.description.message}
                  </p>
                )}

                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Создание..." : "Создать и принять заявку"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
