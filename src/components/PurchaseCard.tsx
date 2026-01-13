import { Purchase } from "@/types";
import { format, isToday } from "date-fns";
import { cn } from "@/lib/utils";

interface PurchaseCardProps {
  purchase: Purchase;
  className?: string;
  onClick?: () => void;
}

export function PurchaseCard({
  purchase,
  className,
  onClick,
}: PurchaseCardProps) {
  const date = new Date(purchase.purchasedAt);
  const dateFormat = isToday(date) ? "h:mm a" : "MMM d, h:mm a";

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex justify-between items-center p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl mb-2 transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-blue-500/5 active:scale-[0.98] cursor-pointer overflow-hidden",
        className
      )}
    >
      {/* Subtle shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
      <div className="flex-1 min-w-0 pr-4">
        <h3 className="font-medium text-base text-foreground truncate">
          {purchase.itemName}
        </h3>
        <p className="text-xs text-muted mt-0.5">
          {format(date, dateFormat)}
          {purchase.note && (
            <span className="text-muted/70"> • {purchase.note}</span>
          )}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-lg font-semibold tracking-tight text-foreground">
          ₦{purchase.amount.toLocaleString()}
        </p>

        {/* Visual indicator for invoice */}
        {purchase.invoicePhoto && (
          <span className="text-[10px] uppercase font-medium bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded ml-auto block w-fit mt-1 tracking-wider border border-emerald-500/20">
            Invoice
          </span>
        )}
      </div>
    </div>
  );
}
