"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { InvoiceDetail } from "@/components/pages/invoice-detail";
import { useErpStore } from "@/lib/store";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const invoice = useErpStore((s) => s.invoices.find((i) => i.id === id));

  useEffect(() => {
    if (!invoice) router.replace("/owner/invoices");
  }, [invoice, router]);

  if (!invoice) return null;
  return <InvoiceDetail invoice={invoice} basePath="/owner/invoices" />;
}
