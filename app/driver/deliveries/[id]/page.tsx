"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { DeliveryDetail } from "@/components/pages/delivery-detail";
import { useErpStore } from "@/lib/store";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const delivery = useErpStore((s) => s.deliveries.find((d) => d.id === id));

  useEffect(() => {
    if (!delivery) router.replace("/driver/deliveries");
  }, [delivery, router]);

  if (!delivery) return null;
  return <DeliveryDetail delivery={delivery} />;
}
