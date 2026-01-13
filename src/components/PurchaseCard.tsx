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
        "flex justify-between items-center p-4 bg-surface/50 border border-white/5 rounded-2xl mb-2 transition-all hover:bg-surface hover:scale-[1.01] cursor-pointer active:scale-[0.98]",
        className
      )}
    >
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
