"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";
import { StockProduct, UpdateStockForm } from "@/lib/schemas/stock-schema";
import { EditStockDialog } from "@/components/admin/EditStockDialog";
import { AuthGuard } from "@/components/AuthGuard";
import { getTranslatedError } from "@/lib/api/translate-error";
import { useStockProducts, useUpdateStock } from "@/lib/api/hooks";
import { AdminLayout } from "@/components/admin/AdminLayout";

function Page() {
  const t = useTranslations("admin.stock");
  const tError = useTranslations();
  const [editingProduct, setEditingProduct] = useState<StockProduct | null>(null);
  const queryClient = useQueryClient();

  const { data: products, isLoading, error } = useStockProducts();

  const updateStockMutation = useUpdateStock({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-products"] });
      toast.success(t("updateSuccess"));
      setEditingProduct(null);
    },
    onError: (error) => {
      console.error("Failed to update stock:", error);
      const errorMessage = getTranslatedError(error, (key, params) => tError(key, params));
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: UpdateStockForm) => {
    if (!editingProduct) {
      return;
    }

    updateStockMutation.mutate({ productId: editingProduct.id, quantity: data.quantity });
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={t("loadError")} />;
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
        <p className="text-gray-600">{t("description")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="w-5 h-5" />
                {product.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative w-full h-48">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{t("currentStock")}</p>
                    <p
                      className={`text-2xl font-bold ${
                        product.stockQuantity <= 0
                          ? "text-red-600"
                          : product.stockQuantity < 10
                            ? "text-orange-600"
                            : "text-green-600"
                      }`}
                    >
                      {product.stockQuantity}
                    </p>
                  </div>
                  <Button onClick={() => setEditingProduct(product)} size="sm">
                    {t("setQuantity")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products && products.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">{t("noProducts")}</p>
        </div>
      )}

      <EditStockDialog
        product={editingProduct}
        isOpen={!!editingProduct}
        isPending={updateStockMutation.isPending}
        onClose={() => setEditingProduct(null)}
        onSubmit={onSubmit}
      />
    </AdminLayout>
  );
}

export default function AdminStockPage() {
  return <AuthGuard requiredRole="admin">{() => <Page />}</AuthGuard>;
}
