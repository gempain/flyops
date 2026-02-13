"use client";

import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ExternalLink, FileText, Package } from "lucide-react";
import type { Order } from "@/lib/schemas/orders-schema";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useOrders } from "@/lib/api/hooks";

const shippingStatusStyles: Record<
  string,
  {
    icon: typeof CheckCircle2;
    colorClass: string;
    iconColorClass: string;
  }
> = {
  awaiting_shipment: {
    icon: CheckCircle2,
    colorClass: "bg-yellow-100 text-yellow-800 border-yellow-200",
    iconColorClass: "text-yellow-600",
  },
  shipped: {
    icon: CheckCircle2,
    colorClass: "bg-blue-100 text-blue-800 border-blue-200",
    iconColorClass: "text-blue-600",
  },
  delivered: {
    icon: CheckCircle2,
    colorClass: "bg-green-100 text-green-800 border-green-200",
    iconColorClass: "text-green-600",
  },
  cancelled: {
    icon: CheckCircle2,
    colorClass: "bg-red-100 text-red-800 border-red-200",
    iconColorClass: "text-red-600",
  },
};

export default function OrdersList() {
  const t = useTranslations("orders");
  const locale = useLocale();

  const addLocaleToUrl = (url: string | null): string | null => {
    if (!url) {
      return null;
    }
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set("locale", locale);
      return urlObj.toString();
    } catch {
      return url;
    }
  };

  const { data, isLoading, error } = useOrders();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingState className="py-8" message={t("loading")} />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorState message={t("errorLoading")} className="my-4" />
        </CardContent>
      </Card>
    );
  }

  const orders: Order[] = data?.orders || [];

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-2">{t("noOrders")}</p>
            <p className="text-gray-500 text-sm">{t("noOrdersDescription")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
      </Card>

      {orders.map((order) => {
        const shippingStatusStyle = shippingStatusStyles[order.shippingStatus];
        const StatusIcon = shippingStatusStyle.icon;

        return (
          <Card key={order.id}>
            <div className="bg-linear-to-r from-green-50 to-emerald-50 border-b border-green-100 px-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-2xl font-bold text-green-900">
                        {formatCurrency(order.totalAmount, order.currency)}
                      </span>
                      <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                        {t("paidSuccessfully")}
                      </Badge>
                      {order.hasCreditNotes && (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-orange-50 border-orange-200 text-orange-700">
                            {t("creditNote")}: {formatCurrency(order.creditNotesAmount, order.currency)}
                          </Badge>
                          {order.creditNoteUrls.length > 0 && (
                            <div className="flex items-center gap-1">
                              {order.creditNoteUrls.map((url, index) => (
                                <a
                                  key={url}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-orange-600 hover:text-orange-800 hover:underline"
                                  title={t("downloadCreditNote")}
                                >
                                  <FileText className="w-3 h-3" />
                                  {order.creditNoteUrls.length > 1 ? `#${index + 1}` : t("download")}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {order.paidAt && (
                      <p className="text-sm text-green-700">
                        {t("paidOn")} {formatDateTime(order.paidAt)}
                      </p>
                    )}
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`flex items-center gap-2 px-3 py-1 ${shippingStatusStyle.colorClass}`}
                >
                  <StatusIcon className="w-4 h-4" />
                  {t(`status.${order.shippingStatus}`)}
                </Badge>
              </div>
            </div>

            <CardContent>
              <div className="space-y-4">
                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{t("orderId")}</p>
                    <p className="font-mono text-sm font-medium">{order.number}</p>
                  </div>
                  {order.orderedAt && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{t("orderedAt")}</p>
                      <p className="text-sm font-medium">{formatDateTime(order.orderedAt)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{t("carrier")}</p>
                    <p className="text-sm font-medium">{order.carrierName}</p>
                  </div>
                  {order.trackingNumber && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{t("trackingNumber")}</p>
                      <p className="font-mono text-sm font-medium">{order.trackingNumber}</p>
                    </div>
                  )}
                  {order.trackingUrl && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{t("tracking")}</p>
                      <a
                        href={order.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
                      >
                        {t("trackPackage")}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Invoice Link */}
                {order.invoiceUrl && (
                  <a
                    href={addLocaleToUrl(order.invoiceUrl) || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 h-10 rounded-md px-4 border border-blue-600 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    {t("viewInvoice")}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
