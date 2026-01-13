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
    <main className="min-h-screen p-4 max-w-md mx-auto font-sans">
      {/* Header */}
      <div className="flex items-center mb-8 pt-4">
        <Link
          href="/"
          className="group p-2 -ml-2 text-zinc-400 hover:text-white transition-colors bg-white/5 rounded-full hover:bg-white/10"
        >
          <ChevronLeft
            size={24}
            className="group-active:scale-95 transition-transform"
          />
        </Link>
        <h1 className="text-xl font-bold ml-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
          New Purchase
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 animate-in slide-in-from-bottom-4 duration-500"
      >
        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-sm font-medium animate-in fade-in zoom-in-95">
            {error}
          </div>
        )}

        {/* Amount (Big Input - Calculator Style) */}
        <div className="py-8 flex flex-col items-center justify-center relative min-h-[160px]">
          {/* Glow background behind amount */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/20 blur-[80px] rounded-full pointer-events-none" />

          <label className="block text-xs uppercase tracking-widest text-blue-400/80 mb-4 font-bold">
            Total Amount
          </label>
          <div className="flex items-center justify-center gap-2 relative z-10 w-full px-4">
            <span
              className="font-bold text-zinc-500/50 transition-all duration-300"
              style={{
                fontSize:
                  formData.amount.length > 9
                    ? "2rem"
                    : formData.amount.length > 6
                    ? "2.5rem"
                    : "3rem",
                marginBottom: "0.5rem",
              }}
            >
              ₦
            </span>
            <input
              type="number"
              step="0.01"
              required
              autoFocus
              className="bg-transparent font-bold focus:outline-none placeholder-white/5 text-white tabular-nums caret-blue-500 text-center drop-shadow-2xl transition-all duration-300 max-w-full"
              placeholder="0"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              style={{
                width: `${Math.max(1, formData.amount.length)}ch`,
                fontSize:
                  formData.amount.length > 12
                    ? "2rem"
                    : formData.amount.length > 9
                    ? "3rem"
                    : formData.amount.length > 6
                    ? "3.75rem"
                    : "4.5rem",
              }}
            />
          </div>
        </div>

        <div className="space-y-5 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-xl">
          {/* Item Name */}
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2 ml-1">
              Item Details
            </label>
            <input
              type="text"
              required
              className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-lg focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 focus:outline-none transition-all placeholder-white/20 text-white"
              placeholder="What did you buy?"
              value={formData.itemName}
              onChange={(e) =>
                setFormData({ ...formData, itemName: e.target.value })
              }
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2 ml-1">
              Date
            </label>
            <input
              type="date"
              required
              className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-base focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 focus:outline-none transition-all scheme-dark appearance-none text-white/90"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>

          {/* Note Toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowNote(!showNote)}
              className="text-blue-400 text-sm font-semibold hover:text-blue-300 flex items-center gap-2 transition-colors py-1"
            >
              {showNote ? "− Remove Note" : "+ Add Note"}
            </button>

            {showNote && (
              <textarea
                className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 mt-3 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 focus:outline-none transition-all animate-in fade-in slide-in-from-top-2 resize-none placeholder-white/20 text-white"
                rows={3}
                placeholder="Add any extra details..."
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
              />
            )}
          </div>
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase mb-2 ml-1">
            Invoice Photo
          </label>
          <label className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-white/20 bg-white/5 rounded-2xl cursor-pointer hover:bg-white/10 hover:border-blue-500/50 transition-all group relative overflow-hidden">
            {invoicePhoto && (
              <div className="absolute inset-0 bg-emerald-500/10 z-0 animate-in fade-in" />
            )}

            <div className="text-center relative z-10">
              {invoicePhoto ? (
                <div className="text-emerald-400 flex items-center gap-2 bg-black/40 backdrop-blur px-4 py-2 rounded-full border border-emerald-500/30">
                  <Camera size={18} />
                  <span className="text-sm font-medium truncate max-w-[200px]">
                    {(invoicePhoto as File).name}
                  </span>
                </div>
              ) : (
                <div className="text-zinc-400 group-hover:text-blue-400 flex flex-col items-center gap-2 transition-colors">
                  <Upload size={24} />
                  <span className="text-sm font-medium">
                    Tap to upload receipt
                  </span>
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
            "w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-2xl text-lg shadow-lg hover:shadow-blue-500/25 hover:scale-[1.01] active:scale-[0.98] transition-all mt-4 border border-white/10",
            loading && "opacity-50 cursor-not-allowed grayscale"
          )}
        >
          {loading ? "Saving..." : "Save Purchase"}
        </button>
      </form>
    </main>
  );
}
