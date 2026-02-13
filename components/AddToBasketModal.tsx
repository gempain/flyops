"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useBasketStore } from "@/lib/store/basket-store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface AddToBasketModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
    priceId: string;
    weight_g?: number;
  };
  formattedPrice: string;
}

export function AddToBasketModal({ isOpen, onClose, product, formattedPrice }: AddToBasketModalProps) {
  const t = useTranslations();
  const router = useRouter();
  const { items, updateQuantity } = useBasketStore();

  const basketItem = items.find((item) => item.id === product.id);
  const currentQuantity = basketItem?.quantity || 1;

  const [quantity, setQuantity] = useState(currentQuantity);

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    if (basketItem) {
      updateQuantity(product.id, newQuantity);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      if (basketItem) {
        updateQuantity(product.id, newQuantity);
      }
    }
  };

  const handleViewBasket = () => {
    onClose();
    router.push("/basket");
  };

  const handleContinueShopping = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-green-100 rounded-full p-2">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
            <DialogTitle className="text-xl">{t("basket.addedToBasket")}</DialogTitle>
          </div>
        </DialogHeader>

        {/* Product info */}
        <div className="flex gap-4 pb-6">
          <div className="relative w-20 h-20 flex-shrink-0">
            <Image src={product.image} alt={product.name} fill sizes="80px" className="object-cover rounded-md" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
            <p className="text-lg font-bold text-brand-orange">{formattedPrice}</p>
          </div>
        </div>
        <Separator />

        {/* Quantity controls */}
        <div className="py-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">{t("basket.quantity")}</label>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecrease}
              disabled={quantity <= 1}
              className="h-10 w-10 p-0"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-xl font-semibold text-gray-900 min-w-[3ch] text-center">{quantity}</span>
            <Button variant="outline" size="sm" onClick={handleIncrease} className="h-10 w-10 p-0">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <Button onClick={handleViewBasket} className="w-full bg-brand-orange hover:bg-[#e67300]" size="lg">
            <ShoppingCart className="w-4 h-4 mr-2" />
            {t("basket.viewBasket")}
          </Button>
          <Button onClick={handleContinueShopping} variant="outline" className="w-full" size="lg">
            {t("basket.continueShopping")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
