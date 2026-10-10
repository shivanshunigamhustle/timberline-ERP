"use client";

import { create } from "zustand";
import {
  BANK_DEPOSITS,
  DELIVERIES,
  EQUIPMENT,
  INVOICES,
  ITEMS,
  LEDGER_ENTRIES,
  REORDER_QUEUE,
  RUNNING_COSTS,
  STOCK_MOVEMENTS,
  TILLS,
  TILL_TRANSACTIONS,
  TRUCKS,
  USERS,
} from "./mock-data";
import type {
  AppUser,
  BankDeposit,
  Delivery,
  DeliveryStatus,
  Equipment,
  EquipmentCondition,
  Invoice,
  InvoiceLineItem,
  Item,
  ItemStatus,
  LedgerEntry,
  PaymentMethod,
  ProductLine,
  ReorderQueueEntry,
  Role,
  RunningCost,
  StockMovement,
  Till,
  TillTransaction,
  Truck,
  TruckStatus,
} from "./types";
import { genId, todayIso } from "./utils";
import { toast } from "./toast-store";

interface SessionState {
  role: Role | null;
  userName: string | null;
  login: (role: Role, userName: string) => void;
  logout: () => void;
}

export const useSession = create<SessionState>((set) => ({
  role: null,
  userName: null,
  login: (role, userName) => set({ role, userName }),
  logout: () => set({ role: null, userName: null }),
}));

interface ErpState {
  invoices: Invoice[];
  items: Item[];
  stockMovements: StockMovement[];
  reorderQueue: ReorderQueueEntry[];
  trucks: Truck[];
  runningCosts: RunningCost[];
  deliveries: Delivery[];
  equipment: Equipment[];
  tills: Till[];
  tillTransactions: TillTransaction[];
  bankDeposits: BankDeposit[];
  ledgerEntries: LedgerEntry[];
  users: AppUser[];

  // Invoices
  createInvoice: (input: {
    customerName: string;
    productLine: ProductLine;
    lineItems: InvoiceLineItem[];
    status: "Draft" | "Sent";
  }) => Invoice;
  markInvoicePaid: (id: string) => void;
  sendInvoice: (id: string) => void;
  recordPayment: (id: string, amount: number, method: PaymentMethod, reference: string) => void;

  // Inventory
  createPurchaseOrder: (itemId: string, supplier: string, qty: number, expectedDelivery: string) => void;
  markReorderReceived: (reorderId: string) => void;
  flagForReorder: (itemId: string) => void;
  submitOrder: (reorderId: string) => void;
  adjustStock: (itemId: string, type: "Damage" | "Count correction" | "Internal use", qty: number, note: string) => void;
  intakeStock: (itemId: string, qty: number, supplier: string, date: string, note: string) => void;
  editItem: (itemId: string, patch: Partial<Item>) => void;

  // Fleet
  updateTruckStatus: (truckId: string, status: TruckStatus) => void;
  logRunningCost: (truckId: string, cost: Omit<RunningCost, "id" | "truckId">) => void;
  addTruck: (truck: Omit<Truck, "id" | "status" | "monthlyRunningCost">) => void;

  // Equipment
  addEquipment: (item: Omit<Equipment, "id">) => void;
  updateEquipmentCondition: (id: string, condition: EquipmentCondition) => void;

  // Deliveries
  updateDeliveryStatus: (
    id: string,
    status: DeliveryStatus,
    extra?: { receivedBy?: string; notes?: string; failReason?: string }
  ) => void;

  // Till / cash
  openTill: (tillId: string, openingFloat: number) => void;
  closeTill: (tillId: string, countedCash: number) => void;
  reconcileTill: (tillId: string, countedCash: number) => void;
  completeSale: (
    tillId: string,
    cart: { itemId: string; name: string; qty: number; unitPrice: number; productLine: ProductLine }[],
    paymentMethod: PaymentMethod,
    customerName: string
  ) => void;
  logBankDeposit: (deposit: Omit<BankDeposit, "id" | "matchedTillTotal" | "status" | "loggedBy">) => void;

  // Users
  inviteUser: (user: { name: string; role: Role; email: string }) => void;
  deactivateUser: (id: string) => void;
}

export const useErpStore = create<ErpState>((set, get) => ({
  invoices: INVOICES,
  items: ITEMS,
  stockMovements: STOCK_MOVEMENTS,
  reorderQueue: REORDER_QUEUE,
  trucks: TRUCKS,
  runningCosts: RUNNING_COSTS,
  deliveries: DELIVERIES,
  equipment: EQUIPMENT,
  tills: TILLS,
  tillTransactions: TILL_TRANSACTIONS,
  bankDeposits: BANK_DEPOSITS,
  ledgerEntries: LEDGER_ENTRIES,
  users: USERS,

  createInvoice: ({ customerName, productLine, lineItems, status }) => {
    const subtotal = lineItems.reduce((sum, li) => sum + li.qty * li.unitPrice, 0);
    const vat = subtotal * 0.16;
    const seq = 400 + get().invoices.length + 1;
    const invoice: Invoice = {
      id: genId("inv"),
      invoiceNumber: `TL-2026-${seq}`,
      customerName,
      productLine,
      lineItems,
      amount: subtotal,
      vatAmount: vat,
      etimsStatus: "Submitted",
      status,
      issueDate: todayIso(),
      dueDate: todayIso(),
      activity: [
        { id: genId("act"), label: "Invoice created", actor: "Owner", timestamp: new Date().toLocaleString("en-KE") },
        ...(status === "Sent"
          ? [{ id: genId("act"), label: "Sent to customer", actor: "Owner", timestamp: new Date().toLocaleString("en-KE") }]
          : []),
      ],
    };
    set((s) => ({ invoices: [invoice, ...s.invoices] }));
    return invoice;
  },

  markInvoicePaid: (id) => {
    set((s) => ({
      invoices: s.invoices.map((inv) => (inv.id === id ? { ...inv, status: "Paid" } : inv)),
    }));
    const inv = get().invoices.find((i) => i.id === id);
    toast(`Invoice ${inv?.invoiceNumber ?? ""} marked paid`, "success");
  },

  sendInvoice: (id) => {
    set((s) => ({
      invoices: s.invoices.map((inv) =>
        inv.id === id
          ? {
              ...inv,
              status: "Sent",
              activity: [
                ...inv.activity,
                { id: genId("act"), label: "Sent to customer", actor: "Owner", timestamp: new Date().toLocaleString("en-KE") },
              ],
            }
          : inv
      ),
    }));
    toast("Invoice sent", "success");
  },

  recordPayment: (id, amount, method, reference) => {
    set((s) => ({
      invoices: s.invoices.map((inv) =>
        inv.id === id
          ? {
              ...inv,
              status: "Paid",
              activity: [
                ...inv.activity,
                {
                  id: genId("act"),
                  label: `Payment received — ${method}${reference ? ` (${reference})` : ""}`,
                  actor: "Owner",
                  timestamp: new Date().toLocaleString("en-KE"),
                },
              ],
            }
          : inv
      ),
      ledgerEntries: [
        {
          id: genId("le"),
          date: todayIso(),
          reference,
          description: `Payment received — ${s.invoices.find((i) => i.id === id)?.customerName ?? ""}`,
          type: "Payment",
          debit: 0,
          credit: amount,
          runningBalance: (s.ledgerEntries[0]?.runningBalance ?? 0) + amount,
        },
        ...s.ledgerEntries,
      ],
    }));
    toast("Payment recorded", "success");
  },

  createPurchaseOrder: (itemId, supplier, qty, expectedDelivery) => {
    set((s) => ({
      items: s.items.map((it) => (it.id === itemId ? { ...it, status: "On order" as ItemStatus } : it)),
      reorderQueue: [
        ...s.reorderQueue.filter((r) => r.itemId !== itemId),
        { id: genId("rq"), itemId, qtyToOrder: qty, preferredSupplier: supplier, status: "Ordered", expectedDelivery },
      ],
    }));
    toast("Purchase order created", "success");
  },

  markReorderReceived: (reorderId) => {
    const entry = get().reorderQueue.find((r) => r.id === reorderId);
    if (!entry) return;
    set((s) => ({
      reorderQueue: s.reorderQueue.filter((r) => r.id !== reorderId),
      items: s.items.map((it) =>
        it.id === entry.itemId
          ? {
              ...it,
              stockOnHand: it.stockOnHand + entry.qtyToOrder,
              status: "In stock" as ItemStatus,
              lastRestocked: todayIso(),
            }
          : it
      ),
      stockMovements: [
        {
          id: genId("mv"),
          itemId: entry.itemId,
          date: todayIso(),
          type: "Intake",
          quantity: entry.qtyToOrder,
          balanceAfter:
            (s.items.find((i) => i.id === entry.itemId)?.stockOnHand ?? 0) + entry.qtyToOrder,
          note: `Received from ${entry.preferredSupplier}`,
        },
        ...s.stockMovements,
      ],
    }));
    const name = get().items.find((i) => i.id === entry.itemId)?.name ?? "item";
    toast(`Stock received: ${name}`, "success");
  },

  flagForReorder: (itemId) => {
    const item = get().items.find((i) => i.id === itemId);
    if (!item) return;
    set((s) => ({
      items: s.items.map((it) => (it.id === itemId ? { ...it, status: "Reorder" as ItemStatus } : it)),
      reorderQueue: [
        ...s.reorderQueue.filter((r) => r.itemId !== itemId),
        {
          id: genId("rq"),
          itemId,
          qtyToOrder: Math.max(item.reorderPoint * 2 - item.stockOnHand, item.reorderPoint),
          preferredSupplier: item.supplier,
          status: "Flagged",
        },
      ],
    }));
    toast("Flagged for reorder", "success");
  },

  submitOrder: (reorderId) => {
    const entry = get().reorderQueue.find((r) => r.id === reorderId);
    if (!entry) return;
    set((s) => ({
      reorderQueue: s.reorderQueue.map((r) =>
        r.id === reorderId ? { ...r, status: "Ordered", expectedDelivery: todayIso() } : r
      ),
      items: s.items.map((it) => (it.id === entry.itemId ? { ...it, status: "On order" as ItemStatus } : it)),
    }));
    toast(`Order submitted to ${entry.preferredSupplier}`, "success");
  },

  adjustStock: (itemId, type, qty, note) => {
    const item = get().items.find((i) => i.id === itemId);
    if (!item) return;
    const newBalance = item.stockOnHand + qty;
    set((s) => ({
      items: s.items.map((it) => (it.id === itemId ? { ...it, stockOnHand: newBalance } : it)),
      stockMovements: [
        { id: genId("mv"), itemId, date: todayIso(), type: "Adjustment", quantity: qty, balanceAfter: newBalance, note: `${type}: ${note}` },
        ...s.stockMovements,
      ],
    }));
    toast("Stock adjusted", "success");
  },

  intakeStock: (itemId, qty, supplier, date, note) => {
    const item = get().items.find((i) => i.id === itemId);
    if (!item) return;
    const newBalance = item.stockOnHand + qty;
    set((s) => ({
      items: s.items.map((it) =>
        it.id === itemId ? { ...it, stockOnHand: newBalance, lastRestocked: date, status: "In stock" as ItemStatus } : it
      ),
      stockMovements: [
        { id: genId("mv"), itemId, date, type: "Intake", quantity: qty, balanceAfter: newBalance, note: `${supplier} — DN ${note}` },
        ...s.stockMovements,
      ],
    }));
    toast("Intake logged", "success");
  },

  editItem: (itemId, patch) => {
    set((s) => ({ items: s.items.map((it) => (it.id === itemId ? { ...it, ...patch } : it)) }));
    toast("Item updated", "success");
  },

  updateTruckStatus: (truckId, status) => {
    set((s) => ({ trucks: s.trucks.map((t) => (t.id === truckId ? { ...t, status } : t)) }));
    toast("Status updated", "success");
  },

  logRunningCost: (truckId, cost) => {
    set((s) => ({
      runningCosts: [{ id: genId("rc"), truckId, ...cost }, ...s.runningCosts],
      trucks: s.trucks.map((t) => (t.id === truckId ? { ...t, monthlyRunningCost: t.monthlyRunningCost + cost.amount } : t)),
    }));
    toast("Cost logged", "success");
  },

  addTruck: (truck) => {
    set((s) => ({
      trucks: [...s.trucks, { id: genId("trk"), status: "At depot", monthlyRunningCost: 0, ...truck }],
    }));
    toast("Truck added", "success");
  },

  addEquipment: (item) => {
    set((s) => ({ equipment: [{ id: genId("eq"), ...item }, ...s.equipment] }));
    toast("Equipment added", "success");
  },

  updateEquipmentCondition: (id, condition) => {
    set((s) => ({ equipment: s.equipment.map((e) => (e.id === id ? { ...e, condition } : e)) }));
  },

  updateDeliveryStatus: (id, status, extra) => {
    set((s) => ({
      deliveries: s.deliveries.map((d) =>
        d.id === id
          ? {
              ...d,
              status,
              receivedBy: extra?.receivedBy ?? d.receivedBy,
              failReason: extra?.failReason ?? d.failReason,
            }
          : d
      ),
    }));
    const label =
      status === "En route" ? "Delivery started" : status === "Delivered" ? "Delivery completed" : status === "Failed" ? "Delivery marked failed" : "Delivery updated";
    toast(label, status === "Failed" ? "error" : "success");
  },

  openTill: (tillId, openingFloat) => {
    set((s) => ({
      tills: s.tills.map((t) => (t.id === tillId ? { ...t, status: "Open", openingFloat, countedCash: undefined, variance: undefined } : t)),
    }));
    toast("Till opened", "success");
  },

  closeTill: (tillId, countedCash) => {
    const till = get().tills.find((t) => t.id === tillId);
    const total = get().tillTransactions.filter((t) => t.tillId === tillId).reduce((sum, t) => sum + t.amount, 0);
    const expected = (till?.openingFloat ?? 0) + total;
    set((s) => ({
      tills: s.tills.map((t) => (t.id === tillId ? { ...t, status: "Closed", countedCash, variance: countedCash - expected } : t)),
    }));
    toast("Till closed — ready for reconciliation", "success");
  },

  reconcileTill: (tillId, countedCash) => {
    const till = get().tills.find((t) => t.id === tillId);
    const total = get().tillTransactions.filter((t) => t.tillId === tillId).reduce((sum, t) => sum + t.amount, 0);
    const expected = (till?.openingFloat ?? 0) + total;
    set((s) => ({
      tills: s.tills.map((t) => (t.id === tillId ? { ...t, status: "Reconciled", countedCash, variance: countedCash - expected } : t)),
    }));
    toast("Till reconciled", "success");
  },

  completeSale: (tillId, cart, paymentMethod, customerName) => {
    const total = cart.reduce((sum, c) => sum + c.qty * c.unitPrice, 0);
    const now = new Date();
    const time = now.toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" });
    const productLine = cart[0]?.productLine ?? "Timber";
    set((s) => ({
      tillTransactions: [
        { id: genId("tt"), tillId, time, customerName: customerName || "Walk-in", productLine, amount: total, paymentMethod },
        ...s.tillTransactions,
      ],
      items: s.items.map((it) => {
        const line = cart.find((c) => c.itemId === it.id);
        if (!line) return it;
        return { ...it, stockOnHand: Math.max(0, it.stockOnHand - line.qty) };
      }),
      stockMovements: [
        ...cart.map((line) => ({
          id: genId("mv"),
          itemId: line.itemId,
          date: todayIso(),
          type: "Sale" as const,
          quantity: -line.qty,
          balanceAfter: Math.max(0, (s.items.find((i) => i.id === line.itemId)?.stockOnHand ?? 0) - line.qty),
          note: "Till sale",
        })),
        ...s.stockMovements,
      ],
    }));
    toast(`Sale recorded — KES ${Math.round(total).toLocaleString("en-KE")}`, "success");
  },

  logBankDeposit: (deposit) => {
    const tillTotalToday = get()
      .tillTransactions
      .reduce((sum, t) => sum + t.amount, 0);
    const status = Math.abs(tillTotalToday - deposit.amount) < 500 ? "Matched" : "Mismatch";
    set((s) => ({
      bankDeposits: [
        { id: genId("bd"), matchedTillTotal: tillTotalToday, status, loggedBy: "Grace Wanjiru", ...deposit },
        ...s.bankDeposits,
      ],
    }));
    toast("Deposit logged", "success");
  },

  inviteUser: ({ name, role, email }) => {
    set((s) => ({
      users: [{ id: genId("u"), name, role, email, status: "Invited", lastActive: "Never" }, ...s.users],
    }));
    toast("Invite sent", "success");
  },

  deactivateUser: (id) => {
    set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, status: "Deactivated" } : u)) }));
    toast("User deactivated", "success");
  },
}));
