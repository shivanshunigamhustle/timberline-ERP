"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ItemDetail } from "@/components/pages/item-detail";
import { useErpStore } from "@/lib/store";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const item = useErpStore((s) => s.items.find((i) => i.id === id));

  useEffect(() => {
    if (!item) router.replace("/warehouse/stock");
  }, [item, router]);

  if (!item) return null;
  return <ItemDetail item={item} basePath="/warehouse/stock" role="warehouse" />;
}
