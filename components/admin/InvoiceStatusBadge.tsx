import { Badge } from "@/components/ui/badge";
import type { InvoiceStatus } from "@/lib/schemas/orders-schema";

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
}

const invoiceStatusConfig: Record<InvoiceStatus, { colorClass: string }> = {
  draft: {
    colorClass: "bg-gray-100 text-gray-800 border-gray-200",
  },
  open: {
    colorClass: "bg-blue-100 text-blue-800 border-blue-200",
  },
  paid: {
    colorClass: "bg-green-100 text-green-800 border-green-200",
  },
  void: {
    colorClass: "bg-red-100 text-red-800 border-red-200",
  },
  uncollectible: {
    colorClass: "bg-orange-100 text-orange-800 border-orange-200",
  },
};

export function InvoiceStatusBadge({ status, className = "" }: InvoiceStatusBadgeProps) {
  const config = invoiceStatusConfig[status] || invoiceStatusConfig.draft;

  return (
    <Badge variant="outline" className={`py-0.5 ${config.colorClass} ${className}`}>
      {status}
    </Badge>
  );
}
