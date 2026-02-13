"use client";

import { useState } from "react";
import Image from "next/image";
import { useBasketStore } from "@/lib/store/basket-store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { AddToBasketModal } from "@/components/AddToBasketModal";
import { Separator } from "@/components/ui/separator";

interface ProductImage {
  src: string;
  alt: string;
}

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    images: ProductImage[];
    price: number | null;
    priceId: string;
    currency: string;
    colorHex: string;
    weight_g?: number;
    inStock: boolean;
  };
  formattedPrice: string;
}

export function ProductCard({ product, formattedPrice }: ProductCardProps) {
  const t = useTranslations();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const addItem = useBasketStore((state) => state.addItem);

  const isOutOfStock = !product.inStock;

  const handleAddToBasket = () => {
    if (!product.priceId) {
      console.error("Cannot add product without priceId:", product.id);
      return;
    }

    addItem({
      id: product.id,
      priceId: product.priceId,
      name: product.name,
      price: (product.price || 0) / 100,
      image: product.images[0]?.src || "/logo-noatec.svg",
      weight_g: product.weight_g,
    });

    setIsModalOpen(true);
  };

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
  };

  const nextImage = () => {
    if (product.images.length > 0) {
      setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product.images.length > 0) {
      setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const currentMainImage = product.images[selectedImageIndex];

  return (
    <>
      <article className="border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col bg-white">
        {currentMainImage && (
          <div className="p-4 pb-2">
            <button
              type="button"
              onClick={() => openLightbox(selectedImageIndex)}
              className="relative w-full mb-3 cursor-zoom-in group block"
              style={{ paddingBottom: "70%" }}
            >
              <Image
                src={currentMainImage.src}
                alt={currentMainImage.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover rounded-md transition-transform group-hover:scale-105"
              />
            </button>

            {product.images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={image.src}
                    type="button"
                    onClick={() => {
                      setSelectedImageIndex(index);
                    }}
                    className={`relative w-16 h-16 border rounded overflow-hidden bg-white flex-shrink-0 transition-all ${
                      index === selectedImageIndex
                        ? "border-brand-orange ring-2 ring-brand-orange"
                        : "border-gray-200 hover:border-brand-orange"
                    } focus:outline-none focus:ring-2 focus:ring-brand-orange`}
                  >
                    <Image src={image.src} alt={image.alt} fill sizes="64px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="px-5 pb-5 pt-2 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2 gap-3">
            <h2 className="text-lg font-semibold text-text-light min-w-0">{product.name}</h2>
            {product.colorHex && (
              <span className="inline-flex items-center gap-2 text-xs text-text-medium flex-shrink-0 max-w-[50%]">
                <span
                  className="inline-block w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                  style={{ backgroundColor: product.colorHex }}
                />
              </span>
            )}
          </div>

          {product.description !== "" && (
            <p className="text-sm text-text-medium mb-4 line-clamp-4">{product.description}</p>
          )}

          <div className="mt-auto pt-4">
            <Separator className="mb-4" />
            {isOutOfStock && (
              <div className="mb-3 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-3 py-2">
                <span className="font-medium">{t("basket.restocking")}</span>
                <br />
                {t("basket.restockingNotice")}
              </div>
            )}
            <div className="flex items-center justify-between gap-3">
              {formattedPrice !== "" && <span className="text-lg font-bold text-brand-orange">{formattedPrice}</span>}
              <Button onClick={handleAddToBasket} size="sm">
                <ShoppingCart className="w-4 h-4 mr-2" />
                {t("basket.addToBasket")}
              </Button>
            </div>
          </div>
        </div>
      </article>

      {/* Add to Basket Modal */}
      <AddToBasketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={{
          id: product.id,
          name: product.name,
          image: product.images[0]?.src || "/logo-noatec.svg",
          price: (product.price || 0) / 100,
          priceId: product.priceId,
          weight_g: product.weight_g,
        }}
        formattedPrice={formattedPrice}
      />

      {/* Lightbox Modal */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-black border-none text-white">
          {/* Navigation buttons */}
          {product.images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 hover:bg-white/10 h-12 w-12 p-0"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 hover:bg-white/10 h-12 w-12 p-0"
                aria-label="Next image"
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </>
          )}

          {/* Main image */}
          <div className="flex items-center justify-center h-full w-full p-4">
            <div className="relative w-full h-full">
              <Image
                src={product.images[selectedImageIndex]?.src}
                alt={product.images[selectedImageIndex]?.alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>

          {/* Image counter */}
          {product.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded">
              {selectedImageIndex + 1} / {product.images.length}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
