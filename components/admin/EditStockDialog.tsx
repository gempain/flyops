import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StockProduct, UpdateStockForm, updateStockSchema } from "@/lib/schemas/stock-schema";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

interface EditStockDialogProps {
  product: StockProduct | null;
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateStockForm) => void;
}

export function EditStockDialog({ product, isOpen, isPending, onClose, onSubmit }: EditStockDialogProps) {
  const t = useTranslations("admin.stock");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateStockForm>({
    resolver: zodResolver(updateStockSchema),
    defaultValues: {
      quantity: product?.stockQuantity || 0,
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: UpdateStockForm) => {
    onSubmit(data);
    reset();
  };

  useEffect(() => {
    if (product) {
      reset({
        quantity: product.stockQuantity || 0,
      });
    }
  }, [product]);

  if (!product) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("dialogTitle")}</DialogTitle>
          <DialogDescription>{product.name}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">{t("quantity")}</Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              {...register("quantity", { valueAsNumber: true })}
              placeholder="0"
            />
            {errors.quantity && <p className="text-sm text-red-600 mt-1">{errors.quantity.message}</p>}
          </div>
          <div className="flex gap-2 justify-end">
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
