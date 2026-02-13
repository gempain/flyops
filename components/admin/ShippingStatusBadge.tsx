import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

interface ShippingStatusBadgeProps {
  status: string;
  className?: string;
}

const shippingStatusConfig: Record<string, { colorClass: string; labelKey: string }> = {
  awaiting_shipment: {
    colorClass: "bg-yellow-100 text-yellow-800 border-yellow-200",
    labelKey: "awaiting_shipment",
  },
  shipped: {
    colorClass: "bg-blue-100 text-blue-800 border-blue-200",
    labelKey: "shipped",
  },
  delivered: {
    colorClass: "bg-green-100 text-green-800 border-green-200",
    labelKey: "delivered",
  },
};

export function ShippingStatusBadge({ status, className = "" }: ShippingStatusBadgeProps) {
  const t = useTranslations("orders.status");

  const config = shippingStatusConfig[status] || shippingStatusConfig.awaiting_shipment;

  return (
    <Badge variant="outline" className={`py-0.5 w-fit ${config.colorClass} ${className}`}>
      {t(config.labelKey)}
    </Badge>
  );
}
