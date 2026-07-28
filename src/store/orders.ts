import { create } from "zustand";
import { persist } from "zustand/middleware";

const uid = () =>
  crypto?.randomUUID?.() ??
  Math.random().toString(36).slice(2) + Date.now().toString(36);

const normalizeBundleName = (bundleName: string) =>
  bundleName.trim().replace(/\s+/g, " ");

export const formatOrderCode = (sequenceNumber: number, bundleName: string) =>
  `PN-${String(sequenceNumber).padStart(4, "0")}-${normalizeBundleName(bundleName)}`;

export type CustomerOrder = {
  id: string;
  sequenceNumber: number;
  orderCode: string;
  bundleId: string;
  bundleName: string;
  customerName: string;
  customerPhone: string;
  siteName: string;
  notes: string;
  bundleFeatures: string[];
  createdAt: string;
};

type CreateOrderInput = {
  bundleId: string;
  bundleName: string;
  customerName: string;
  customerPhone: string;
  siteName: string;
  notes: string;
  bundleFeatures: string[];
};

type OrdersState = {
  orders: CustomerOrder[];
  nextSequenceNumber: number;
  createOrder: (input: CreateOrderInput) => CustomerOrder;
  clearOrders: () => void;
};

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set) => ({
      orders: [],
      nextSequenceNumber: 1,
      createOrder: (input) => {
        let createdOrder!: CustomerOrder;

        set((state) => {
          const sequenceNumber = state.nextSequenceNumber;
          createdOrder = {
            id: uid(),
            sequenceNumber,
            orderCode: formatOrderCode(sequenceNumber, input.bundleName),
            bundleId: input.bundleId,
            bundleName: normalizeBundleName(input.bundleName),
            customerName: input.customerName.trim(),
            customerPhone: input.customerPhone.trim(),
            siteName: input.siteName.trim(),
            notes: input.notes.trim(),
            bundleFeatures: input.bundleFeatures,
            createdAt: new Date().toISOString(),
          };

          return {
            orders: [createdOrder, ...state.orders],
            nextSequenceNumber: sequenceNumber + 1,
          };
        });

        return createdOrder;
      },
      clearOrders: () => set({ orders: [], nextSequenceNumber: 1 }),
    }),
    {
      name: "webify.orders.v1",
      version: 1,
    }
  )
);
