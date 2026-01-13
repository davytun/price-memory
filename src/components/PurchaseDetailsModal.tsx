"use client";

import { Purchase } from "@/types";
import { format } from "date-fns";
import { X, Trash2 } from "lucide-react";
import { storage } from "@/lib/storage";
import { cn } from "@/lib/utils";

interface PurchaseDetailsModalProps {
  purchase: Purchase;
  onClose: () => void;
}

export function PurchaseDetailsModal({
  purchase,
  onClose,
}: PurchaseDetailsModalProps) {
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this purchase?")) {
      await storage.deletePurchase(purchase.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-[#111] border border-white/10 w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 p-2 rounded-full"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold pr-10">{purchase.itemName}</h2>
            <p className="text-gray-400 mt-1">
              {format(
                new Date(purchase.purchasedAt),
                "EEEE, MMMM d, yyyy 'at' h:mm a"
              )}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">
              Amount
            </p>
            <p className="text-4xl font-bold text-blue-400">
              ₦{purchase.amount.toLocaleString()}
            </p>
          </div>

          {purchase.note && (
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">
                Note
              </p>
              <div className="bg-white/5 p-4 rounded-xl text-gray-200 whitespace-pre-wrap">
                {purchase.note}
              </div>
            </div>
          )}

          {purchase.invoicePhoto && (
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">
                Invoice
              </p>
              <div className="rounded-xl overflow-hidden border border-white/10">
                {/* Using img tag with base64 dataUrl */}
                <img
                  src={purchase.invoicePhoto.dataUrl}
                  alt="Invoice"
                  className="w-full h-auto object-contain max-h-[60vh] bg-black"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 text-red-500 hover:text-red-400 px-4 py-2 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <Trash2 size={18} />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Click backdrop to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
}
