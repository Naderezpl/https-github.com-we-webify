import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClient } from "@/utils/supabase/client";

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
  completed: boolean;
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
  setCompleted: (orderId: string, completed: boolean) => void;
  deleteOrder: (orderId: string) => void;
  syncToDatabase: () => Promise<boolean>;
  syncFromDatabase: () => Promise<boolean>;
};

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
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
            completed: false,
          };

          (async () => {
            try {
              const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
              if (!supabaseUrl) return;
              const supabase = createClient();
              await supabase.from("site_orders").insert({
                id: createdOrder.id,
                sequence_number: createdOrder.sequenceNumber,
                order_code: createdOrder.orderCode,
                bundle_id: createdOrder.bundleId,
                bundle_name: createdOrder.bundleName,
                customer_name: createdOrder.customerName,
                customer_phone: createdOrder.customerPhone,
                site_name: createdOrder.siteName,
                notes: createdOrder.notes,
                bundle_features: createdOrder.bundleFeatures,
                created_at: createdOrder.createdAt,
                completed: createdOrder.completed,
              });
              await supabase
                .from("site_settings")
                .upsert(
                  { id: "main", next_order_seq: sequenceNumber + 1, updated_at: new Date().toISOString() },
                  { onConflict: "id" }
                );
            } catch (err) {
              console.error("createOrder DB insert failed:", err);
            }
          })();

          return {
            orders: [createdOrder, ...state.orders],
            nextSequenceNumber: sequenceNumber + 1,
          };
        });

        return createdOrder;
      },
      clearOrders: () => {
        set({ orders: [], nextSequenceNumber: 1 });
        (async () => {
          try {
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            if (!supabaseUrl) return;
            const supabase = createClient();
            await supabase.from("site_orders").delete().neq("id", "00000000-0000-0000-0000-000000000000");
            await supabase
              .from("site_settings")
              .upsert(
                { id: "main", next_order_seq: 1, updated_at: new Date().toISOString() },
                { onConflict: "id" }
              );
          } catch (err) {
            console.error("clearOrders DB delete failed:", err);
          }
        })();
      },
      setCompleted: (orderId, completed) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, completed } : o
          ),
        }));
        (async () => {
          try {
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            if (!supabaseUrl) return;
            const supabase = createClient();
            await supabase
              .from("site_orders")
              .update({ completed })
              .eq("id", orderId);
          } catch (err) {
            console.error("setCompleted DB update failed:", err);
          }
        })();
      },
      deleteOrder: (orderId) => {
        set((state) => ({
          orders: state.orders.filter((o) => o.id !== orderId),
        }));
        (async () => {
          try {
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            if (!supabaseUrl) return;
            const supabase = createClient();
            await supabase.from("site_orders").delete().eq("id", orderId);
          } catch (err) {
            console.error("deleteOrder DB delete failed:", err);
          }
        })();
      },
      syncToDatabase: async () => {
        try {
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
          if (!supabaseUrl) return false;
          const supabase = createClient();
          const { orders, nextSequenceNumber } = get();

          if (orders.length > 0) {
            const rows = orders.map((o) => ({
              id: o.id,
              sequence_number: o.sequenceNumber,
              order_code: o.orderCode,
              bundle_id: o.bundleId,
              bundle_name: o.bundleName,
              customer_name: o.customerName,
              customer_phone: o.customerPhone,
              site_name: o.siteName,
              notes: o.notes,
              bundle_features: o.bundleFeatures,
              created_at: o.createdAt,
              completed: o.completed,
            }));
            const { error } = await supabase
              .from("site_orders")
              .upsert(rows, { onConflict: "id", ignoreDuplicates: false });
            if (error) {
              console.error("Orders syncToDatabase insert error:", error);
              return false;
            }
          }

          const { error: settingError } = await supabase
            .from("site_settings")
            .upsert(
              { id: "main", next_order_seq: nextSequenceNumber, updated_at: new Date().toISOString() },
              { onConflict: "id" }
            );
          if (settingError) {
            console.error("Orders syncToDatabase setting error:", settingError);
            return false;
          }

          return true;
        } catch (err) {
          console.error("Orders syncToDatabase failed:", err);
          return false;
        }
      },
      syncFromDatabase: async () => {
        try {
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
          if (!supabaseUrl) return false;
          const supabase = createClient();

          const { data: ordersData, error: ordersError } = await supabase
            .from("site_orders")
            .select("*")
            .order("created_at", { ascending: false });
          if (ordersError) {
            console.error("Orders syncFromDatabase orders error:", ordersError);
            return false;
          }

          const { data: settingData, error: settingError } = await supabase
            .from("site_settings")
            .select("next_order_seq")
            .eq("id", "main")
            .maybeSingle();
          if (settingError && settingError.code !== "PGRST116") {
            console.error("Orders syncFromDatabase setting error:", settingError);
          }

          const mappedOrders: CustomerOrder[] = (ordersData ?? []).map((row) => ({
            id: row.id,
            sequenceNumber: row.sequence_number,
            orderCode: row.order_code,
            bundleId: row.bundle_id,
            bundleName: row.bundle_name,
            customerName: row.customer_name,
            customerPhone: row.customer_phone,
            siteName: row.site_name,
            notes: row.notes ?? "",
            bundleFeatures: Array.isArray(row.bundle_features) ? row.bundle_features : [],
            createdAt: row.created_at,
            completed: !!row.completed,
          }));

          const nextSeq =
            settingData?.next_order_seq && settingData.next_order_seq > 0
              ? settingData.next_order_seq
              : mappedOrders.length > 0
              ? Math.max(...mappedOrders.map((o) => o.sequenceNumber)) + 1
              : 1;

          set({
            orders: mappedOrders,
            nextSequenceNumber: nextSeq,
          });
          return true;
        } catch (err) {
          console.error("Orders syncFromDatabase failed:", err);
          return false;
        }
      },
    }),
    {
      name: "webify.orders.v1",
      version: 1,
    }
  )
);
