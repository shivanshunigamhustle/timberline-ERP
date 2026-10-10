import { Suspense } from "react";
import { StockOverview } from "@/components/pages/stock-overview";

export default function Page() {
  return (
    <Suspense>
      <StockOverview basePath="/owner/inventory" role="owner" />
    </Suspense>
  );
}
