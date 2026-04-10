import { cn } from "@/lib/utils";
import { MousePointer2, type LucideProps } from "lucide-react";

export function CursorMark({ className, ...props }: LucideProps) {
  return (
    <MousePointer2
      aria-hidden
      className={cn("shrink-0", className)}
      strokeWidth={1.75}
      absoluteStrokeWidth
      {...props}
    />
  );
}
