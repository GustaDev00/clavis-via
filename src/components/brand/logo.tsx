import { cn } from "@/lib/cn";
import { KeyMark } from "./key-mark";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-ink", className)}>
      <KeyMark className="h-7 w-auto" />
      <span className="font-display text-[14px] font-semibold tracking-[0.22em]">CLAVIS VIA</span>
    </span>
  );
}
