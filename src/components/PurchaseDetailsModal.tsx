"use client";

import { useState } from "react";
import { Purchase } from "@/types";
import { format } from "date-fns";
import {
  X,
  Trash2,
  ReceiptText,
  Calendar,
  AlignLeft,
  Info,
  Maximize2,
} from "lucide-react";
import { storage } from "@/lib/storage";

interface PurchaseDetailsModalProps {
  purchase: Purchase;
  onClose: () => void;
}

export function PurchaseDetailsModal({
  purchase,
  onClose,
}: PurchaseDetailsModalProps) {
  const [isImageViewing, setIsImageViewing] = useState(false);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this purchase?")) {
      await storage.deletePurchase(purchase.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Main Modal / Bottom Sheet */}
      <div
        className="relative w-full max-w-md bg-[#0f0f11]/90 backdrop-blur-xl border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar for mobile feel */}
        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-6 sm:hidden" />

        <div className="flex justify-between items-start mb-6">
          <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-400">
            <ReceiptText size={28} strokeWidth={1.5} />
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-white transition-colors bg-white/5 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Big Amount */}
        <div className="mb-8">
          <p className="text-sm text-zinc-500 uppercase tracking-widest font-medium mb-1">
            Total Amount
          </p>
          <h2 className="text-5xl font-bold text-white tracking-tight">
            <span className="text-zinc-600 text-3xl align-top mr-1">₦</span>
            {purchase.amount.toLocaleString()}
          </h2>
        </div>

        {/* Details Grid */}
        <div className="space-y-6">
          {/* Item */}
          <div className="flex gap-4 items-start">
            <div className="mt-1 text-zinc-600">
              <Info size={18} />
            </div>
            <div>
              <label className="text-xs text-zinc-500 uppercase font-bold block mb-1">
                Item
              </label>
              <p className="text-lg text-zinc-200 font-medium leading-tight">
                {purchase.itemName}
              </p>
            </div>
          </div>

          {/* Date */}
          <div className="flex gap-4 items-start">
            <div className="mt-1 text-zinc-600">
              <Calendar size={18} />
            </div>
            <div>
              <label className="text-xs text-zinc-500 uppercase font-bold block mb-1">
                Date
              </label>
              <p className="text-base text-zinc-300">
                {format(new Date(purchase.purchasedAt), "MMMM d, yyyy")}
                <span className="text-zinc-600 mx-2">•</span>
                {format(new Date(purchase.purchasedAt), "h:mm a")}
              </p>
            </div>
          </div>

          {/* Note */}
          {purchase.note && (
            <div className="flex gap-4 items-start">
              <div className="mt-1 text-zinc-600">
                <AlignLeft size={18} />
              </div>
              <div className="flex-1">
                <label className="text-xs text-zinc-500 uppercase font-bold block mb-1">
                  Note
                </label>
                <div className="bg-white/5 p-3 rounded-xl text-zinc-300 text-sm whitespace-pre-wrap leading-relaxed border border-white/5">
                  {purchase.note}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Invoice Photo */}
        {purchase.invoicePhoto && (
          <div className="mt-8">
            <label className="text-xs text-zinc-500 uppercase font-bold block mb-3 pl-1">
              Invoice Receipt
            </label>
            <div
              className="rounded-2xl overflow-hidden border border-white/10 bg-black/50 relative group cursor-pointer"
              onClick={() => setIsImageViewing(true)}
            >
              <img
                src={purchase.invoicePhoto.dataUrl}
                alt="Invoice"
                className="w-full h-auto object-cover max-h-[300px] hover:opacity-80 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/40 backdrop-blur-sm p-2 rounded-full text-white/50 group-hover:text-white group-hover:bg-black/60 transition-all">
                  <Maximize2 size={24} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-10 pt-6 border-t border-white/5 flex justify-between items-center">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 text-red-500/80 hover:text-red-500 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors text-sm font-medium"
          >
            <Trash2 size={16} />
            Delete Purchase
          </button>

          <button
            onClick={onClose}
            className="bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-zinc-200 transition-colors active:scale-95"
          >
            Done
          </button>
        </div>
      </div>

      {/* Lightbox for Full Screen Image View */}
      {isImageViewing && purchase.invoicePhoto && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsImageViewing(false)}
        >
          <button
            onClick={() => setIsImageViewing(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 p-3 rounded-full"
          >
            <X size={24} />
          </button>
          <img
            src={purchase.invoicePhoto.dataUrl}
            alt="Full Invoice"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
          />
        </div>
      )}
    </div>
  );
}
