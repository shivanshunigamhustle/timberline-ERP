import { cn } from "@/lib/utils";

const PALETTE = ["1f6b4a", "2563a6", "b8790c", "6b4fa0", "c23b3b", "0f766e", "946200", "475569"];

function colorFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export function Avatar({
  name,
  size = 32,
  className,
  ring,
}: {
  name: string;
  size?: number;
  className?: string;
  ring?: boolean;
}) {
  const bg = colorFor(name);
  const src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&bold=true&font-size=0.38&length=2`;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      className={cn("rounded-full object-cover shrink-0", ring && "ring-2 ring-white shadow-[var(--shadow-sm)]", className)}
      style={{ width: size, height: size }}
    />
  );
}
