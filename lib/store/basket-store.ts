import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BasketItem {
  id: string;
  priceId: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
  weight_g?: number;
}

interface BasketStore {
  items: BasketItem[];
  addItem: (item: Omit<BasketItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearBasket: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useBasketStore = create<BasketStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);

          if (existingItem) {
            return {
              items: state.items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)),
            };
          }

          return {
            items: [...state.items, { ...item, quantity: 1 }],
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
        }));
      },

      clearBasket: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: "basket-storage",
    },
  ),
);
