import type { PricingTier } from "@/store/pricing";
import type { CustomerOrder } from "@/store/orders";
import type { SiteContent } from "@/store/siteContent";

const STORAGE_KEY = "webify.persisted-site-state.v1";
const STORAGE_VERSION = 1;

export type PersistedSiteStateData = {
  pricingTiers: PricingTier[];
  content: SiteContent;
  orders: CustomerOrder[];
  nextSequenceNumber: number;
};

export type PersistedSiteState = PersistedSiteStateData & {
  version: number;
  savedAt: number;
};

function canUseStorage() {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function hasPersistedSiteState(): boolean {
  if (!canUseStorage()) return false;
  return !!window.localStorage.getItem(STORAGE_KEY);
}

export function readPersistedSiteState(): PersistedSiteState | null {
  if (!canUseStorage()) return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as unknown;
    if (!isRecord(parsed)) return null;

    const pricingTiers = Array.isArray(parsed.pricingTiers)
      ? parsed.pricingTiers
      : null;
    const orders = Array.isArray(parsed.orders) ? parsed.orders : null;
    const content = isRecord(parsed.content) ? parsed.content : null;
    const nextSequenceNumber =
      typeof parsed.nextSequenceNumber === "number"
        ? parsed.nextSequenceNumber
        : null;

    if (!pricingTiers || !orders || !content || nextSequenceNumber === null) {
      return null;
    }

    return {
      version:
        typeof parsed.version === "number" ? parsed.version : STORAGE_VERSION,
      savedAt: typeof parsed.savedAt === "number" ? parsed.savedAt : Date.now(),
      pricingTiers: pricingTiers as PricingTier[],
      content: content as SiteContent,
      orders: orders as CustomerOrder[],
      nextSequenceNumber,
    };
  } catch (error) {
    console.error("Failed to read persisted site state:", error);
    return null;
  }
}

export function writePersistedSiteState(
  data: PersistedSiteStateData,
): PersistedSiteState | null {
  if (!canUseStorage()) return null;

  const snapshot: PersistedSiteState = {
    version: STORAGE_VERSION,
    savedAt: Date.now(),
    pricingTiers: data.pricingTiers,
    content: data.content,
    orders: data.orders,
    nextSequenceNumber: data.nextSequenceNumber,
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    return snapshot;
  } catch (error) {
    console.error("Failed to write persisted site state:", error);
    return null;
  }
}

export function getPersistedSiteStateSignature(
  data: PersistedSiteStateData,
): string {
  return JSON.stringify({
    pricingTiers: data.pricingTiers,
    content: data.content,
    orders: data.orders,
    nextSequenceNumber: data.nextSequenceNumber,
  });
}

export function getPersistedPricingTiers(): PricingTier[] | null {
  return readPersistedSiteState()?.pricingTiers ?? null;
}

export function getPersistedContent(): SiteContent | null {
  return readPersistedSiteState()?.content ?? null;
}

export function getPersistedOrders(): Pick<
  PersistedSiteStateData,
  "orders" | "nextSequenceNumber"
> | null {
  const snapshot = readPersistedSiteState();
  if (!snapshot) return null;
  return {
    orders: snapshot.orders,
    nextSequenceNumber: snapshot.nextSequenceNumber,
  };
}
