import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateOrder, updateOrderSchema } from "@/lib/schemas/admin-orders-schema";
import type { Order } from "@/lib/schemas/orders-schema";
import { useTranslations } from "next-intl";

interface EditShippingDialogProps {
  order: Order | null;
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateOrder) => void;
}

export function EditShippingDialog({ order, isOpen, isPending, onClose, onSubmit }: EditShippingDialogProps) {
  const t = useTranslations("admin.orders");
  const tOrders = useTranslations("orders");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UpdateOrder>({
    resolver: zodResolver(updateOrderSchema),
    defaultValues: {
      shippingStatus: order?.shippingStatus || null,
      trackingNumber: order?.trackingNumber || null,
      trackingUrl: order?.trackingUrl || null,
      carrierName: order?.carrierName || null,
      sendcloudOrderId: order?.sendcloudOrderId || null,
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: UpdateOrder) => {
    onSubmit(data);
    reset();
  };

  if (!order) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("editShippingDetails")}</DialogTitle>
          <DialogDescription>{t("editShippingDescription")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>{t("customer")}</Label>
            <div className="text-sm">{order.customerName || order.customerEmail}</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shippingStatus">{t("shippingStatus")}</Label>
            <Select
              defaultValue={order.shippingStatus}
              onValueChange={(value) => setValue("shippingStatus", value as UpdateOrder["shippingStatus"])}
            >
              <SelectTrigger id="shippingStatus">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="awaiting_shipment">{tOrders("status.awaiting_shipment")}</SelectItem>
                <SelectItem value="shipped">{tOrders("status.shipped")}</SelectItem>
                <SelectItem value="delivered">{tOrders("status.delivered")}</SelectItem>
              </SelectContent>
            </Select>
            {errors.shippingStatus && <p className="text-red-600">{errors.shippingStatus.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="trackingNumber">{t("trackingNumber")}</Label>
            <Input id="trackingNumber" {...register("trackingNumber")} placeholder={t("trackingNumberPlaceholder")} />
            {errors.trackingNumber && <p className="text-red-600">{errors.trackingNumber.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="trackingUrl">{t("trackingUrl")}</Label>
            <Input id="trackingUrl" {...register("trackingUrl")} placeholder={t("trackingUrlPlaceholder")} />
            {errors.trackingUrl && <p className="text-red-600">{errors.trackingUrl.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="carrierName">{t("carrierName")}</Label>
            <Input id="carrierName" {...register("carrierName")} placeholder={t("carrierNamePlaceholder")} />
            {errors.carrierName && <p className="text-red-600">{errors.carrierName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sendcloudOrderId">{t("sendcloudOrderId")}</Label>
            <Input
              id="sendcloudOrderId"
              {...register("sendcloudOrderId")}
              placeholder={t("sendcloudOrderIdPlaceholder")}
            />
            {errors.sendcloudOrderId && <p className="text-red-600">{errors.sendcloudOrderId.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? t("saving") : t("save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
