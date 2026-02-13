import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import type { Order } from "@/lib/schemas/orders-schema";
import { useTranslations } from "next-intl";
import { ShippingRate } from "@/lib/schemas/invoice-operations-schema";

interface SelectShippingDialogProps {
  order: Order | null;
  isOpen: boolean;
  isLoading: boolean;
  isSaving: boolean;
  shippingRates: ShippingRate[];
  selectedRateId: string | null;
  onClose: () => void;
  onSelectRate: (rateId: string) => void;
  onSave: () => void;
}

export function SelectShippingDialog({
  order,
  isOpen,
  isLoading,
  isSaving,
  shippingRates,
  selectedRateId,
  onClose,
  onSelectRate,
  onSave,
}: SelectShippingDialogProps) {
  const t = useTranslations("admin.orders");

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  if (!order) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("selectShippingOption")}</DialogTitle>
          <DialogDescription>{t("selectShippingDescription")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t("customer")}</Label>
            <div className="text-sm">{order.customerName || order.customerEmail}</div>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Spinner className="w-8 h-8" />
              <span className="ml-2 text-sm text-gray-600">{t("loadingShippingOptions")}</span>
            </div>
          )}

          {!isLoading && shippingRates.length === 0 && (
            <div className="text-center py-8 text-gray-500">{t("noShippingOptions")}</div>
          )}

          {!isLoading && shippingRates.length > 0 && (
            <div className="space-y-2">
              <Label>{t("availableShippingOptions")}</Label>
              <div className="space-y-2">
                {shippingRates.map((rate) => {
                  const isDifferent = rate.amount !== rate.real_cost;
                  return (
                    <div
                      key={rate.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedRateId === rate.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => onSelectRate(rate.id)}
                    >
                      <div className="flex items-stretch justify-between">
                        <div className="flex-1 justify-between flex flex-col gap-2">
                          <div className="font-medium text-sm">{rate.display_name}</div>
                          <Badge variant="outline" className="text-xs">
                            {rate.carrier_name}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(rate.amount, rate.currency)}</div>
                          {isDifferent && (
                            <div className="text-red-600 font-medium mt-1 bg-red-50 px-2 py-1 rounded border border-red-200">
                              {t("realCost")}: {formatCurrency(rate.real_cost, rate.currency)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              {t("cancel")}
            </Button>
            <Button onClick={onSave} disabled={!selectedRateId || isSaving}>
              {isSaving ? t("saving") : t("saveShippingOption")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
