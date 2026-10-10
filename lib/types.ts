export type ProductLine = "Timber" | "Gas" | "Bio-products";

export type Role = "Owner" | "Accountant" | "Cashier" | "Warehouse" | "Driver";

export type InvoiceStatus = "Draft" | "Sent" | "Paid" | "Overdue";
export type EtimsStatus = "Submitted" | "Pending";

export interface InvoiceLineItem {
  id: string;
  itemId: string;
  description: string;
  qty: number;
  unitPrice: number;
}

export interface InvoiceActivity {
  id: string;
  label: string;
  actor: string;
  timestamp: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone?: string;
  customerKraPin?: string;
  productLine: ProductLine;
  lineItems: InvoiceLineItem[];
  amount: number;
  vatAmount: number;
  etimsStatus: EtimsStatus;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  activity: InvoiceActivity[];
}

export type ItemStatus = "In stock" | "Low" | "Reorder" | "On order";

export interface Item {
  id: string;
  name: string;
  productLine: ProductLine;
  unit: string;
  stockOnHand: number;
  reorderPoint: number;
  unitPrice: number;
  status: ItemStatus;
  lastRestocked: string;
  supplier: string;
  avgMonthlyUsage: number;
}

export type MovementType = "Intake" | "Sale" | "Adjustment";

export interface StockMovement {
  id: string;
  itemId: string;
  date: string;
  type: MovementType;
  quantity: number;
  balanceAfter: number;
  note: string;
}

export type TruckStatus = "On route" | "At depot" | "In service";

export interface Truck {
  id: string;
  registration: string;
  makeModel: string;
  year: number;
  assignedDriver: string;
  status: TruckStatus;
  monthlyRunningCost: number;
}

export type CostType = "Fuel" | "Service" | "Repair" | "Insurance" | "Other";

export interface RunningCost {
  id: string;
  truckId: string;
  type: CostType;
  amount: number;
  date: string;
  note: string;
}

export type DeliveryStatus = "Pending" | "En route" | "Delivered" | "Failed";

export interface Delivery {
  id: string;
  truckId: string;
  customerName: string;
  phone: string;
  area: string;
  productLine: ProductLine;
  itemsSummary: string;
  items: { name: string; qty: number; unit: string }[];
  status: DeliveryStatus;
  date: string;
  receivedBy?: string;
  failReason?: string;
}

export type EquipmentCategory = "Loading equipment" | "Workshop tools" | "Office equipment" | "Other";
export type EquipmentCondition = "Good" | "Needs attention" | "Out of service";

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  purchaseDate: string;
  purchaseValue: number;
  condition: EquipmentCondition;
}

export type PaymentMethod = "Cash" | "M-Pesa" | "Bank transfer";

export interface TillTransaction {
  id: string;
  tillId: string;
  time: string;
  customerName: string;
  productLine: ProductLine;
  amount: number;
  paymentMethod: PaymentMethod;
}

export type TillStatus = "Open" | "Closed" | "Reconciled";

export interface Till {
  id: string;
  name: string;
  cashierOnDuty: string;
  openingFloat: number;
  status: TillStatus;
  countedCash?: number;
  variance?: number;
}

export type Bank = "Equity Bank" | "KCB" | "Co-operative Bank";
export type DepositStatus = "Matched" | "Mismatch";

export interface BankDeposit {
  id: string;
  date: string;
  amount: number;
  bank: Bank;
  reference: string;
  matchedTillTotal: number;
  status: DepositStatus;
  loggedBy: string;
}

export type LedgerType = "Sale" | "Purchase" | "Expense" | "Payment";

export interface LedgerEntry {
  id: string;
  date: string;
  reference: string;
  description: string;
  productLine?: ProductLine;
  type: LedgerType;
  debit: number;
  credit: number;
  runningBalance: number;
}

export type ReorderStatus = "Flagged" | "Ordered" | "Received";

export interface ReorderQueueEntry {
  id: string;
  itemId: string;
  qtyToOrder: number;
  preferredSupplier: string;
  status: ReorderStatus;
  expectedDelivery?: string;
}

export type UserStatus = "Active" | "Invited" | "Deactivated";

export interface AppUser {
  id: string;
  name: string;
  role: Role;
  status: UserStatus;
  lastActive: string;
  email: string;
}

export interface MonthlyFinancial {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
}

export interface ProductLineMonthly extends MonthlyFinancial {
  productLine: ProductLine;
}
