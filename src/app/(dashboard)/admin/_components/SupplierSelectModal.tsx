"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSuppliersList } from "@/api/applications/use-suppliers-list";

interface SupplierSelectModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (supplierId: number) => void;
}

export function SupplierSelectModal({ open, onClose, onSelect }: SupplierSelectModalProps) {
  const { data: suppliers, isLoading } = useSuppliersList();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSuppliers = suppliers?.filter(supplier => {
    const searchLower = searchTerm.toLowerCase();
    return (
      supplier.site.toLowerCase().includes(searchLower) ||
      (supplier.siteRU && supplier.siteRU.toLowerCase().includes(searchLower))
    );
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Выберите поставщика</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Input
            placeholder="Поиск поставщика..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          {isLoading ? (
            <div className="text-center py-4">Загрузка списка поставщиков...</div>
          ) : (
            <ScrollArea className="h-64 rounded-md border">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}