"use client";
import { useState, ChangeEvent } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useSupplierData } from "@/api/supplier-card/user-supplier-data";
import { useUploadSupplierPhotos } from "@/api/supplier-card/use-upload-supplier-photos";
import { useDeleteSupplierPhotos } from "@/api/supplier-card/use-delete-supplier-photos";
import { Button } from "@/components/ui/button";

const MAX_PHOTOS = 10;

export function SupplierPhotos({ supplierId }: { supplierId: number }) {
  const { data, isLoading } = useSupplierData(supplierId);
  const { mutate: uploadPhotos, isPending: isUploading } =
    useUploadSupplierPhotos(supplierId);
  const { mutate: deletePhoto, isPending: isDeleting } =
    useDeleteSupplierPhotos(supplierId);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);
    const currentCount = (data?.photos?.length || 0) + selectedFiles.length;

    if (currentCount + newFiles.length > MAX_PHOTOS) {
      alert(`Максимальное количество фотографий: ${MAX_PHOTOS}`);
      return;
    }

    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) return;

    uploadPhotos(selectedFiles, {
      onSuccess: () => {
        setSelectedFiles([]);
      },
    });
  };

  const handleRemoveNewFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeletePhoto = (photoUrl: string) => {
    if (isDeleting) return;
    deletePhoto([photoUrl]);
  };

  const totalPhotosCount = (data?.photos?.length || 0) + selectedFiles.length;
  const canUploadMore = totalPhotosCount < MAX_PHOTOS;

  return (
    <div className="space-y-4 relative">
      {(isLoading || isUploading || isDeleting) && (
        <div className="absolute left-0 top-0 w-full h-full bg-[#ffffff69]" />
      )}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl mb-4 mt-6">{`Фотографии (${totalPhotosCount}/10)`}</h2>
      </div>

      {/* Превью всех фотографий */}
      <div className="flex flex-wrap gap-4">
        {/* Существующие фото из data */}
        {data?.photos?.map((photoUrl, index) => (
          <div key={`existing-${index}`} className="relative group">
            <div className="w-32 h-32 relative rounded-md overflow-hidden border">
              <Image
                src={photoUrl}
                alt={`Фото поставщика ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => handleDeletePhoto(photoUrl)}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              disabled={isDeleting}
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        ))}

        {/* Новые выбранные файлы */}
        {selectedFiles.map((file, index) => (
          <div key={`new-${index}`} className="relative group">
            <div className="w-32 h-32 relative rounded-md overflow-hidden border">
              <Image
                src={URL.createObjectURL(file)}
                alt={`Новое фото ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => handleRemoveNewFile(index)}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        ))}

        {/* Кнопка добавления новых фото */}
        {canUploadMore && (
          <label className="w-32 h-32 flex items-center justify-center border-2 border-dashed rounded-md cursor-pointer hover:border-primary transition-colors">
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
            <span className="text-gray-500">+ Добавить</span>
          </label>
        )}
      </div>

      {/* Кнопка загрузки, если есть новые файлы */}
      {selectedFiles.length > 0 && (
        <div>
          <Button
            type="button"
            onClick={handleUpload}
            className=""
            disabled={isUploading}
          >
            {isUploading
              ? "Загрузка..."
              : `Загрузить ${selectedFiles.length} фото`}
          </Button>
          <Button
            type="button"
            onClick={() => setSelectedFiles([])}
            variant="outline"
            className="ml-3"
          >
            Отмена
          </Button>
        </div>
      )}
    </div>
  );
}
