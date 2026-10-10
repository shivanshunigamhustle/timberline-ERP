import { cn } from "@/lib/utils";
import { categoryImageUrl, truckImageUrl } from "@/lib/images";
import type { ProductLine } from "@/lib/types";

export function TruckImage({ index, className }: { index: number; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={truckImageUrl(index, 640, 280)}
      alt=""
      className={cn("w-full h-28 rounded-[10px] object-cover shrink-0 bg-[var(--surface-muted)]", className)}
      loading="lazy"
    />
  );
}

export function ItemImage({
  productLine,
  seed,
  size = 44,
  className,
}: {
  productLine: ProductLine;
  seed: string;
  size?: number;
  className?: string;
}) {
  const hasCustomSize = className?.includes("w-") || className?.includes("h-");
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={categoryImageUrl(productLine, seed, size * 2, size * 2)}
      alt=""
      className={cn("rounded-[8px] object-cover shrink-0 bg-[var(--surface-muted)]", className)}
      style={hasCustomSize ? undefined : { width: size, height: size }}
      loading="lazy"
    />
  );
}
