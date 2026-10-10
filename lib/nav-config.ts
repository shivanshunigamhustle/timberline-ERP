import {
  LayoutDashboard,
  FileText,
  Trees,
  Warehouse,
  Truck,
  Wallet,
  BarChart3,
  Users,
  Settings,
  BookOpen,
  FileSpreadsheet,
  Download,
  ClipboardList,
  PackagePlus,
  ListChecks,
  Banknote,
  History,
  ShoppingCart,
  MapPin,
  Fuel,
  Car,
} from "lucide-react";
import type { Role } from "./types";

export interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

export const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  Owner: [
    { label: "Dashboard", href: "/owner/dashboard", icon: LayoutDashboard },
    { label: "Invoices", href: "/owner/invoices", icon: FileText },
    { label: "Timber", href: "/owner/products/timber", icon: Trees },
    { label: "Gas", href: "/owner/products/gas", icon: Fuel },
    { label: "Bio-products", href: "/owner/products/bio", icon: PackagePlus },
    { label: "Stock overview", href: "/owner/inventory", icon: Warehouse },
    { label: "Fleet register", href: "/owner/fleet", icon: Truck },
    { label: "Equipment", href: "/owner/equipment", icon: ListChecks },
    { label: "Till summary", href: "/owner/cash/till", icon: Wallet },
    { label: "Bank reconciliation", href: "/owner/cash/bank", icon: Banknote },
    { label: "Profit by line", href: "/owner/reports/profit", icon: BarChart3 },
    { label: "Cash flow", href: "/owner/reports/cashflow", icon: BarChart3 },
    { label: "Financial statements", href: "/owner/reports/statements", icon: FileSpreadsheet },
    { label: "Users & roles", href: "/owner/users", icon: Users },
    { label: "Settings", href: "/owner/settings", icon: Settings },
  ],
  Accountant: [
    { label: "Financial dashboard", href: "/accountant/dashboard", icon: LayoutDashboard },
    { label: "Financial statements", href: "/accountant/statements", icon: FileSpreadsheet },
    { label: "Transactions ledger", href: "/accountant/ledger", icon: BookOpen },
    { label: "Invoices", href: "/accountant/invoices", icon: FileText },
    { label: "Export center", href: "/accountant/export", icon: Download },
  ],
  Cashier: [
    { label: "Till", href: "/cashier/till", icon: Wallet },
    { label: "New sale", href: "/cashier/new-sale", icon: ShoppingCart },
    { label: "Till history", href: "/cashier/history", icon: History },
    { label: "Bank deposit log", href: "/cashier/deposits", icon: Banknote },
  ],
  Warehouse: [
    { label: "Stock overview", href: "/warehouse/stock", icon: Warehouse },
    { label: "Reorder queue", href: "/warehouse/reorder", icon: ClipboardList },
    { label: "Stock intake", href: "/warehouse/intake", icon: PackagePlus },
  ],
  Driver: [
    { label: "Today's deliveries", href: "/driver/deliveries", icon: MapPin },
    { label: "Truck log", href: "/driver/truck-log", icon: Fuel },
    { label: "My truck", href: "/driver/my-truck", icon: Car },
  ],
};

export const ROLE_LANDING: Record<Role, string> = {
  Owner: "/owner/dashboard",
  Accountant: "/accountant/dashboard",
  Cashier: "/cashier/till",
  Warehouse: "/warehouse/stock",
  Driver: "/driver/deliveries",
};
