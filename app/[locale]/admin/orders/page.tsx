"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  FileText,
  MoreVertical,
  Package,
  Search,
  Tag,
  Trash2,
  Truck,
} from "lucide-react";
import { AdminOrdersQuery, UpdateOrder } from "@/lib/schemas/admin-orders-schema";
import type { Order } from "@/lib/schemas/orders-schema";
import { toast } from "sonner";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { Spinner } from "@/components/ui/spinner";
import { ShippingStatusBadge } from "@/components/admin/ShippingStatusBadge";
import { InvoiceStatusBadge } from "@/components/admin/InvoiceStatusBadge";
import { EditShippingDialog } from "@/components/admin/EditShippingDialog";
import { SelectShippingDialog } from "@/components/admin/SelectShippingDialog";
import { PageSizeSelector } from "@/components/PageSizeSelector";
import { useUpdateUrlParams } from "@/lib/hooks/useUpdateUrlParams";
import { AuthGuard } from "@/components/AuthGuard";
import { getTranslatedError } from "@/lib/api/translate-error";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  useAdminOrders,
  useApplyInvoiceDiscounts,
  useDeleteInvoiceDiscounts,
  useGetInvoiceShippingOptions,
  useUpdateInvoiceShipping,
  useUpdateOrder,
} from "@/lib/api/hooks";
import { ShippingRate } from "@/lib/schemas/invoice-operations-schema";

function Page() {
  const searchParams = useSearchParams();
  const t = useTranslations("admin.orders");
  const tOrders = useTranslations("orders");
  const tError = useTranslations();

  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [filters, setFilters] = useState<AdminOrdersQuery>({
    page: parseInt(searchParams.get("page") || "1"),
    limit: parseInt(searchParams.get("limit") || "10"),
    search: searchParams.get("search") || "",
    shippingStatus: searchParams.get("shippingStatus") || "",
  });
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [shippingDialogOrder, setShippingDialogOrder] = useState<Order | null>(null);
  const [shippingRates, setShippingRates] = useState<Array<ShippingRate>>([]);
  const [selectedShippingRate, setSelectedShippingRate] = useState<string | null>(null);

  const updateUrlParams = useUpdateUrlParams({ defaultLimit: 10 });

  const adminOrders = useAdminOrders(filters);

  const updateOrderMutation = useUpdateOrder({
    onSuccess: () => {
      setEditingOrder(null);
      adminOrders.refetch();
      toast.success(t("updateSuccess"));
    },
    onError: (error) => {
      const errorMessage = getTranslatedError(error, (key, params) => tError(key, params));
      toast.error(errorMessage);
    },
  });

  const getShippingOptionsMutation = useGetInvoiceShippingOptions({
    onSuccess: (data) => {
      setShippingRates(data.shipping_rates);
    },
    onError: (error) => {
      const errorMessage = getTranslatedError(error, (key, params) => tError(key, params));
      toast.error(errorMessage);
    },
  });

  const updateShippingMutation = useUpdateInvoiceShipping({
    onSuccess: () => {
      toast.success(t("shippingOptionUpdated"));
      setShippingDialogOrder(null);
      setShippingRates([]);
      setSelectedShippingRate(null);
      adminOrders.refetch();
    },
    onError: (error) => {
      const errorMessage = getTranslatedError(error, (key, params) => tError(key, params));
      toast.error(errorMessage);
    },
  });

  const applyDiscountsMutation = useApplyInvoiceDiscounts({
    onSuccess: (data) => {
      if (data.appliedCoupons > 0) {
        toast.success(t("appliedDiscounts", { count: data.appliedCoupons }));
      } else {
        toast.info(t("noApplicableDiscounts"));
      }
      adminOrders.refetch();
    },
    onError: (error) => {
      console.log(error);
      const errorMessage = getTranslatedError(error, (key, params) => tError(key, params));
      toast.error(errorMessage);
    },
  });

  const deleteDiscountsMutation = useDeleteInvoiceDiscounts({
    onSuccess: () => {
      toast.success(t("discountsRemoved"));
      adminOrders.refetch();
    },
    onError: (error) => {
      const errorMessage = getTranslatedError(error, (key, params) => tError(key, params));
      toast.error(errorMessage);
    },
  });

  const updateFilters = (newFilters: AdminOrdersQuery) => {
    setFilters(newFilters);
    updateUrlParams(newFilters);
    adminOrders.refetch();
  };

  const handleSearch = () => {
    const newFilters = { ...filters, search: searchInput, page: 1 };
    updateFilters(newFilters);
  };

  const handleFilterChange = (value: string) => {
    const newFilters = { ...filters, shippingStatus: value, page: 1 };
    updateFilters(newFilters);
  };

  const handleClearAllFilters = () => {
    const newFilters = {
      page: 1,
      limit: 10,
      search: "",
      shippingStatus: "",
    };
    setSearchInput("");
    updateFilters(newFilters);
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
  };

  const onSubmitEdit = (data: UpdateOrder) => {
    if (!editingOrder) {
      return;
    }

    updateOrderMutation.mutate({
      orderId: editingOrder.id,
      data,
    });
  };

  const handleSelectShipping = (order: Order) => {
    setShippingDialogOrder(order);
    setShippingRates([]);
    setSelectedShippingRate(null);
    getShippingOptionsMutation.mutate(order.id);
  };

  const handleSaveShipping = () => {
    if (!shippingDialogOrder || !selectedShippingRate) {
      return;
    }

    updateShippingMutation.mutate({
      invoiceId: shippingDialogOrder.id,
      data: { shipping_rate_id: selectedShippingRate },
    });
  };

  const handleApplyDiscounts = (order: Order) => {
    applyDiscountsMutation.mutate(order.id);
  };

  const handleDeleteDiscounts = (order: Order) => {
    deleteDiscountsMutation.mutate(order.id);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("title")}</CardTitle>
              <CardDescription>{t("description")}</CardDescription>
            </div>
            <Button asChild>
              <a
                href="https://dashboard.stripe.com/invoices/create"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" />
                </svg>
                {t("createOrderInvoice")}
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex gap-2">
            <div className="flex-1">
              <Input
                placeholder={t("searchPlaceholder")}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
            </div>
            <Button onClick={handleSearch}>
              <Search className="w-4 h-4 mr-2" />
              {t("search")}
            </Button>
          </div>

          <div className="mb-6 flex gap-4 items-center flex-wrap">
            <div className="flex gap-2 items-center">
              <Label htmlFor="status-filter" className="whitespace-nowrap">
                {t("filterByStatus")}:
              </Label>
              <Select value={filters.shippingStatus || ""} onValueChange={handleFilterChange}>
                <SelectTrigger id="status-filter" className="w-[250px]">
                  <SelectValue placeholder={t("allStatuses")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="awaiting_shipment">{tOrders("status.awaiting_shipment")}</SelectItem>
                  <SelectItem value="shipped">{tOrders("status.shipped")}</SelectItem>
                  <SelectItem value="delivered">{tOrders("status.delivered")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <PageSizeSelector
              value={filters.limit}
              onChange={(value) => {
                const newFilters = { ...filters, limit: value, page: 1 };
                updateFilters(newFilters);
              }}
              label={`${t("pageSize")}:`}
            />

            {(filters.search || filters.shippingStatus || filters.limit !== 10) && (
              <Button variant="outline" size="sm" onClick={handleClearAllFilters}>
                {t("clearAllFilters")}
              </Button>
            )}
          </div>

          {adminOrders.isLoading && <LoadingState className="py-8" />}

          {adminOrders.error && <ErrorState message={t("errorLoading")} className="my-4" />}

          {adminOrders.data && adminOrders.data.orders.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">{t("noOrders")}</p>
            </div>
          )}

          {adminOrders.data && adminOrders.data.orders.length > 0 && (
            <>
              <div className="overflow-x-auto relative">
                {adminOrders.isFetching && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-lg border">
                      <Spinner className="w-5 h-5" />
                      <span className="text-sm font-medium text-gray-700">{t("updatingOrders")}</span>
                    </div>
                  </div>
                )}
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        {t("customerColumn")}
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        {t("dateColumn")}
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        {t("amountColumn")}
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        {t("invoiceColumn")}
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        {t("roleColumn")}
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        {t("discountsColumn")}
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        {t("creditNotesColumn")}
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        {t("shippingColumn")}
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        {t("actionsColumn")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {adminOrders.data.orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2">
                          <div
                            className="font-medium text-gray-900 truncate max-w-40"
                            title={order.customerName || order.customerEmail}
                          >
                            {order.customerName || order.customerEmail}
                          </div>
                        </td>
                        <td className="px-2 py-2 text-gray-500 whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="px-2 py-2 text-gray-900 whitespace-nowrap">
                          {formatCurrency(order.totalAmount, order.currency)}
                        </td>
                        <td className="px-2 py-2">
                          <InvoiceStatusBadge status={order.invoiceStatus} />
                        </td>
                        <td className="px-2 py-2 text-gray-900">{order.customerRole || "-"}</td>
                        <td className="px-2 py-2">
                          {order.discountsCount > 0 ? (
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 py-0.5">
                              <Tag className="w-3 h-3 mr-1" />
                              {order.discountsCount}
                            </Badge>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-2 py-2">
                          {order.hasCreditNotes ? (
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="bg-orange-100 text-orange-800 border-orange-300 py-0.5"
                              >
                                {formatCurrency(order.creditNotesAmount, order.currency)}
                              </Badge>
                              {order.creditNoteUrls.length > 0 && (
                                <div className="flex items-center gap-1">
                                  {order.creditNoteUrls.map((url, index) => (
                                    <a
                                      key={url}
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center text-xs text-orange-600 hover:text-orange-800 hover:underline"
                                      title="View credit note"
                                    >
                                      <FileText className="w-3 h-3" />
                                      {order.creditNoteUrls.length > 1 && `#${index + 1}`}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-2 py-2">
                          <div className="flex flex-col gap-1">
                            {order.carrierName && (
                              <div className="text-gray-900 truncate max-w-32" title={order.carrierName}>
                                {order.carrierName}
                              </div>
                            )}
                            <ShippingStatusBadge status={order.shippingStatus} />
                            {order.trackingNumber && (
                              <div className="text-xs text-gray-500 truncate max-w-32" title={order.trackingNumber}>
                                {order.trackingUrl ? (
                                  <a
                                    href={order.trackingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline"
                                  >
                                    {t("trackingNumberPrefix")}
                                    {order.trackingNumber}
                                  </a>
                                ) : (
                                  <>
                                    {t("trackingNumberPrefix")}
                                    {order.trackingNumber}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-2 py-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <MoreVertical className="w-3.5 h-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => handleEdit(order)}>
                                <Edit className="w-4 h-4 mr-2" />
                                {t("editShippingDetails")}
                              </DropdownMenuItem>

                              <DropdownMenuItem asChild>
                                <a
                                  href={`https://dashboard.stripe.com/invoices/${order.stripeInvoiceId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center cursor-pointer"
                                >
                                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" />
                                  </svg>
                                  {t("viewInStripe")}
                                </a>
                              </DropdownMenuItem>

                              {order.invoiceStatus === "draft" && (
                                <>
                                  <DropdownMenuSeparator />

                                  <DropdownMenuItem
                                    onClick={() => handleSelectShipping(order)}
                                    disabled={getShippingOptionsMutation.isPending}
                                  >
                                    <Truck className="w-4 h-4 mr-2" />
                                    {t("selectShipping")}
                                  </DropdownMenuItem>

                                  {order.discountsCount === 0 ? (
                                    <DropdownMenuItem
                                      onClick={() => handleApplyDiscounts(order)}
                                      disabled={applyDiscountsMutation.isPending}
                                    >
                                      <Tag className="w-4 h-4 mr-2" />
                                      {t("applyDiscounts")}
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteDiscounts(order)}
                                      disabled={deleteDiscountsMutation.isPending}
                                      className="text-red-600 focus:text-red-600"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      {t("removeDiscounts")}
                                    </DropdownMenuItem>
                                  )}
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {t("showing", {
                    from: (filters.page - 1) * filters.limit + 1,
                    to: Math.min(filters.page * filters.limit, adminOrders.data.total),
                    total: adminOrders.data.total,
                  })}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newFilters = { ...filters, page: filters.page - 1 };
                      updateFilters(newFilters);
                    }}
                    disabled={filters.page === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    {t("previous")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newFilters = { ...filters, page: filters.page + 1 };
                      updateFilters(newFilters);
                    }}
                    disabled={filters.page >= adminOrders.data.totalPages}
                  >
                    {t("next")}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <EditShippingDialog
        order={editingOrder}
        isOpen={!!editingOrder}
        isPending={updateOrderMutation.isPending}
        onClose={() => setEditingOrder(null)}
        onSubmit={onSubmitEdit}
      />

      <SelectShippingDialog
        order={shippingDialogOrder}
        isOpen={!!shippingDialogOrder}
        isLoading={getShippingOptionsMutation.isPending}
        isSaving={updateShippingMutation.isPending}
        shippingRates={shippingRates}
        selectedRateId={selectedShippingRate}
        onClose={() => {
          setShippingDialogOrder(null);
          setShippingRates([]);
          setSelectedShippingRate(null);
        }}
        onSelectRate={setSelectedShippingRate}
        onSave={handleSaveShipping}
      />
    </AdminLayout>
  );
}

export default function AdminOrdersPage() {
  return <AuthGuard requiredRole="admin">{() => <Page />}</AuthGuard>;
}
