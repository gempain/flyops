import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Customer } from "@/lib/schemas/customer-role-schema";
import { UpdateCustomerRole, updateCustomerRoleSchema } from "@/lib/schemas/customer-role-schema";
import { CustomerRoleEnum } from "@/lib/schemas/customer-metadata-schema";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface EditCustomerRoleDialogProps {
  customer: Customer | null;
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateCustomerRole) => void;
}

export function EditCustomerRoleDialog({
  customer,
  isOpen,
  isPending,
  onClose,
  onSubmit,
}: EditCustomerRoleDialogProps) {
  const t = useTranslations("admin.customers");
  const [roleValue, setRoleValue] = useState<CustomerRoleEnum>((customer?.role as CustomerRoleEnum) || "particulier");

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdateCustomerRole>({
    resolver: zodResolver(updateCustomerRoleSchema),
    defaultValues: {
      role: (customer?.role as CustomerRoleEnum) || "particulier",
    },
  });

  useEffect(() => {
    if (customer) {
      const newRole = (customer.role as CustomerRoleEnum) || "particulier";
      setRoleValue(newRole);
      setValue("role", newRole);
    }
  }, [customer, setValue]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: UpdateCustomerRole) => {
    onSubmit(data);
    reset();
  };

  if (!customer) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("editCustomerRole")}</DialogTitle>
          <DialogDescription>{t("editCustomerRoleDescription")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer-email">{t("email")}</Label>
            <Input id="customer-email" value={customer.email || ""} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer-role">{t("role")}</Label>
            <Select
              value={roleValue}
              onValueChange={(value) => {
                const newRole = (value as CustomerRoleEnum) || "particulier";
                setRoleValue(newRole);
                setValue("role", newRole);
              }}
              disabled={isPending}
            >
              <SelectTrigger id="customer-role">
                <SelectValue placeholder={t("selectRole")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revendeur">{t("roles.revendeur")}</SelectItem>
                <SelectItem value="particulier">{t("roles.particulier")}</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && <p className="text-sm text-red-600">{errors.role.message}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Spinner className="w-4 h-4 mr-2" />}
              {isPending ? t("saving") : t("save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
