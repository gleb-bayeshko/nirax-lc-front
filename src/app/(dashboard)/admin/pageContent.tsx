"use client";

import {
  useApplications,
  useConfirmApplication,
  useRejectApplication,
} from "@/api/applications/use-applications";
import { CustomPagination } from "@/components/common/CustomPagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SupplierSelectModal } from "./_components/SupplierSelectModal";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentPage = Number(searchParams.get("page")) || 1;
  const limit = 10;

  const { data, isLoading } = useApplications(currentPage, limit);
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  const [selectedAppData, setSelectedAppData] = useState<{
    login: string;
    password: string;
  } | null>(null);
  const { mutateAsync: confirmApplication } = useConfirmApplication();
  const { mutateAsync: rejectApplication } = useRejectApplication();
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleAcceptClick = (applicationId: number) => {
    setSelectedAppId(applicationId);
    setIsSelectModalOpen(true);
  };

  const handleViewCredentials = (app: { login: string; password: string }) => {
    setSelectedAppData(app);
    setIsViewModalOpen(true);
  };

  const handleSupplierSelect = (supplierId: number) => {
    if (!selectedAppId) return;

    confirmApplication({
      id: selectedAppId,
      supplierId,
      page: currentPage,
      limit,
    }).then(() => {
      enqueueSnackbar("Заявка принята", { variant: "success" });
    });
  };

  const handleNewSupplierSelect = () => {
    enqueueSnackbar("Заявка принята", { variant: "success" });
  };

  const handleReject = (applicationId: number) => {
    rejectApplication({
      id: applicationId,
      page: currentPage,
      limit,
    }).then(() => {
      enqueueSnackbar("Заявка отклонена", { variant: "success" });
    });
  };

  const currentApplicationInfo = selectedAppId
    ? data?.data?.find((c) => c.id === selectedAppId)
    : {};

  return (
    <>
      <div className="container mx-auto pb-8">
        <h1 className="text-2xl font-bold mb-6">Заявки поставщиков</h1>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-y-1">
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
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Дата</TableHead>
                    <TableHead>Компания</TableHead>
                    <TableHead>Контактное лицо</TableHead>
                    <TableHead>Телефон</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data?.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        {app.createdAt
                          ? new Intl.DateTimeFormat("ru-RU", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              timeZone: "Europe/Moscow", // Указываем московскую таймзону
                            }).format(new Date(app.createdAt))
                          : ""}
                      </TableCell>
                      <TableCell>{app.companyName}</TableCell>
                      <TableCell>{app.fullName}</TableCell>
                      <TableCell>{app.phone}</TableCell>
                      <TableCell>{app.email}</TableCell>
                      <TableCell>
                        {app.status === "accepted" && (
                          <span className="text-green-600">Принята</span>
                        )}
                        {app.status === "rejected" && (
                          <span className="text-red-600">Отклонена</span>
                        )}
                        {app.status === "pending" && (
                          <span className="text-yellow-600">
                            На рассмотрении
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {app.status === "pending" ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAcceptClick(app.id)}
                              >
                                <Check className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReject(app.id)}
                              >
                                <X className="h-4 w-4 text-red-600" />
                              </Button>
                            </>
                          ) : (
                            app.status === "accepted" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleViewCredentials({
                                    login: app.login,
                                    password: app.password,
                                  })
                                }
                              >
                                <Eye className="h-4 w-4 text-blue-600" />
                              </Button>
                            )
                          )}
                        </div>
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
                  pages={Math.ceil(data.total / 10)}
                  limit={20}
                  total={data.total}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}

        <SupplierSelectModal
          open={isSelectModalOpen}
          onClose={() => {
            setIsSelectModalOpen(false);
            setSelectedAppId(null);
          }}
          onSelect={handleNewSupplierSelect}
          email={currentApplicationInfo?.email || ""}
          contactPerson={currentApplicationInfo?.fullName || ""}
          phone={currentApplicationInfo?.phone || ""}
          company={currentApplicationInfo?.companyName || ""}
          applicationId={selectedAppId}
        />

        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Данные для входа</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Логин</p>
                <p className="mt-1 text-lg font-mono">
                  {selectedAppData?.login}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Пароль</p>
                <p className="mt-1 text-lg font-mono">
                  {selectedAppData?.password}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
