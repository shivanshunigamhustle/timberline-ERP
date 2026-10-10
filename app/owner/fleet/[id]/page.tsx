"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { TruckDetail } from "@/components/pages/truck-detail";
import { useErpStore } from "@/lib/store";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const truck = useErpStore((s) => s.trucks.find((t) => t.id === id));

  useEffect(() => {
    if (!truck) router.replace("/owner/fleet");
  }, [truck, router]);

  if (!truck) return null;
  return <TruckDetail truck={truck} basePath="/owner/fleet" />;
}
