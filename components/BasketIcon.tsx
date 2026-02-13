"use client";

import { useBasketStore } from "@/lib/store/basket-store";
import { ShoppingCart } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function BasketIcon() {
  const [mounted, setMounted] = useState(false);
  const items = useBasketStore((state) => state.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Link href="/basket" className="relative p-2 text-gray-700 hover:text-brand-green transition-colors">
        <ShoppingCart className="w-6 h-6" />
      </Link>
    );
  }

  return (
    <Link href="/basket" className="relative p-2 text-gray-700 hover:text-brand-green transition-colors">
      <ShoppingCart className="w-6 h-6" />
      {totalItems > 0 && (
        <Badge className="absolute -top-1 -right-1 bg-brand-green hover:bg-brand-green text-white text-xs font-bold rounded-full w-5 h-5 p-0 flex items-center justify-center">
          {totalItems > 9 ? "9+" : totalItems}
        </Badge>
      )}
    </Link>
  );
}
