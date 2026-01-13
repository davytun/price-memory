"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { storage } from "@/lib/storage";
import { ChevronLeft, Camera, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

// Helper to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export default function AddPurchase() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    itemName: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });
  const [invoicePhoto, setInvoicePhoto] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.itemName.trim()) {
      setError("Item name is required");
      return;
    }
    const amountVal = parseFloat(formData.amount);
    if (isNaN(amountVal) || amountVal <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    setLoading(true);

    try {
      let photoData = undefined;
      if (invoicePhoto) {
        const base64 = await fileToBase64(invoicePhoto);
        photoData = {
          name: invoicePhoto.name,
          type: invoicePhoto.type,
          dataUrl: base64,
        };
      }

      await storage.addPurchase({
        id: crypto.randomUUID(),
        itemName: formData.itemName.trim(),
        amount: amountVal,
        purchasedAt: new Date(formData.date).toISOString(),
        note: formData.note.trim(),
        invoicePhoto: photoData,
      });
      router.push("/");
    } catch (error) {
      console.error("Failed to add purchase:", error);
      setError("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setInvoicePhoto(e.target.files[0]);
    }
  };

  return (
    <main className="min-h-screen p-4 max-w-md mx-auto font-sans bg-zinc-950 text-zinc-50">
      {/* Header */}
      <div className="flex items-center mb-8 pt-2">
        <Link
          href="/"
          className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold ml-2 tracking-tight">New Purchase</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {/* Amount (Big Input - Calculator Style) */}
        <div className="py-8 flex flex-col items-center justify-center">
          <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-4 font-medium">
            Amount
          </label>
          <div className="flex items-center justify-center gap-1">
            <span className="text-4xl font-bold text-zinc-600">₦</span>
            <input
              type="number"
              step="0.01"
              required
              autoFocus
              className="bg-transparent text-5xl font-bold focus:outline-none placeholder-zinc-800 text-white tabular-nums caret-blue-500 text-center"
              placeholder="0"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              style={{ width: `${Math.max(3, formData.amount.length + 1)}ch` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5 ml-1">
              What did you buy?
            </label>
            <input
              type="text"
              required
              className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 text-base focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 focus:outline-none transition-all placeholder-zinc-600"
              placeholder="e.g. 50 bags of cement"
              value={formData.itemName}
              onChange={(e) =>
                setFormData({ ...formData, itemName: e.target.value })
              }
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5 ml-1">
              Date
            </label>
            <input
              type="date"
              required
              className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 text-base focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 focus:outline-none transition-all scheme-dark appearance-none text-white"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>
        </div>

        {/* Note Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowNote(!showNote)}
            className="text-blue-500 text-sm font-medium hover:text-blue-400 flex items-center gap-1.5 transition-colors"
          >
            {showNote ? "− Remove Note" : "+ Add Note"}
          </button>

          {showNote && (
            <textarea
              className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 mt-3 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 focus:outline-none transition-all animate-in fade-in slide-in-from-top-1 resize-none placeholder-zinc-600"
              rows={3}
              placeholder="Add any extra details..."
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
            />
          )}
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1.5 ml-1">
            Invoice Photo{" "}
            <span className="text-zinc-600 font-normal">(Optional)</span>
          </label>
          <label className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-zinc-800 bg-zinc-900/30 rounded-2xl cursor-pointer hover:bg-zinc-900/50 hover:border-blue-500/30 transition-all group">
            <div className="text-center">
              {invoicePhoto ? (
                <div className="text-emerald-500 flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full">
                  <Camera size={18} />
                  <span className="text-sm font-medium truncate max-w-[200px]">
                    {(invoicePhoto as File).name}
                  </span>
                </div>
              ) : (
                <div className="text-zinc-500 group-hover:text-blue-500/80 flex flex-col items-center gap-2 transition-colors">
                  <Upload size={24} />
                  <span className="text-sm">Tap to upload</span>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={cn(
            "w-full bg-white text-black font-bold py-4 rounded-2xl text-lg shadow-xl hover:bg-zinc-200 active:scale-[0.98] transition-all mt-4",
            loading && "opacity-50 cursor-not-allowed"
          )}
        >
          {loading ? "Saving..." : "Save Purchase"}
        </button>
      </form>
    </main>
  );
}
