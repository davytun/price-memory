"use client";

import { useState } from "react";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/storage";
import { PurchaseCard } from "@/components/PurchaseCard";
import { differenceInCalendarDays, parseISO, format } from "date-fns";
import { Plus, Search, Download } from "lucide-react";
import { PurchaseDetailsModal } from "@/components/PurchaseDetailsModal";
import { Purchase } from "@/types";

interface PurchaseSectionProps {
  title: string;
  items: Purchase[];
  onSelect: (p: Purchase) => void;
}

function PurchaseSection({ title, items, onSelect }: PurchaseSectionProps) {
  if (items.length === 0) return null;
  return (
    <section className="mb-8 animate-in slide-in-from-bottom duration-500">
      <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 pl-1">
        {title}
      </h2>
      {items.map((p) => (
        <PurchaseCard key={p.id} purchase={p} onClick={() => onSelect(p)} />
      ))}
    </section>
  );
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null
  );

  // Dexie hook to watch db changes live
  const purchases = useLiveQuery(
    () => db.purchases.orderBy("purchasedAt").reverse().toArray(),
    []
  );

  const handleExport = async () => {
    if (!purchases || purchases.length === 0) return;

    // Create CSV content
    const headers = ["Date", "Item", "Amount", "Note"];
    const rows = purchases.map((p) => {
      return [
        `"${format(new Date(p.purchasedAt), "yyyy-MM-dd HH:mm")}"`,
        `"${p.itemName.replace(/"/g, '""')}"`,
        p.amount,
        `"${(p.note || "").replace(/"/g, '""')}"`,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `price_memory_backup_${format(new Date(), "yyyy-MM-dd")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (purchases === undefined)
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-500">
        Loading...
      </div>
    );

  const now = new Date();
  const grouped = {
    today: [] as Purchase[],
    yesterday: [] as Purchase[],
    lastWeek: [] as Purchase[],
    older: [] as Purchase[],
  };

  // Filter only if we have a query
  const filteredPurchases = searchQuery
    ? purchases.filter((p) =>
        p.itemName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : purchases;

  filteredPurchases.forEach((p) => {
    const date = parseISO(p.purchasedAt);
    const diff = differenceInCalendarDays(now, date);

    if (diff === 0) grouped.today.push(p);
    else if (diff === 1) grouped.yesterday.push(p);
    else if (diff <= 7) grouped.lastWeek.push(p);
    else grouped.older.push(p);
  });

  const isEmpty = purchases.length === 0;

  return (
    <main className="min-h-screen p-4 max-w-md mx-auto pb-24 font-sans">
      <header className="mb-8 mt-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
            Price Memory
          </h1>
          <p className="text-sm text-zinc-400">
            Remember what you bought and how much you paid
          </p>
        </div>

        {/* Export Button (only if data exists) */}
        {!isEmpty && (
          <button
            onClick={handleExport}
            className="p-2 text-zinc-500 hover:text-blue-400 transition-colors bg-white/5 rounded-full"
            title="Export to CSV"
          >
            <Download size={20} />
          </button>
        )}
      </header>

      {/* Search Input - HIDDEN if no data at all */}
      {!isEmpty && (
        <div className="relative group mb-8">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-white"
            size={16}
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm focus:bg-white/10 focus:border-white/10 focus:outline-none transition-all placeholder:text-zinc-600 text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {/* Sections */}
      <PurchaseSection
        title="Today"
        items={grouped.today}
        onSelect={setSelectedPurchase}
      />
      <PurchaseSection
        title="Yesterday"
        items={grouped.yesterday}
        onSelect={setSelectedPurchase}
      />
      <PurchaseSection
        title="Last 7 Days"
        items={grouped.lastWeek}
        onSelect={setSelectedPurchase}
      />
      <PurchaseSection
        title="Older"
        items={grouped.older}
        onSelect={setSelectedPurchase}
      />

      {/* Empty State - Guides user to add first purchase */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-700">
          <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
            <Plus size={40} className="text-blue-500/50" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            No purchases yet
          </h3>
          <p className="text-zinc-500 max-w-[200px]">
            Tap the + button below to add your first purchase.
          </p>
        </div>
      )}

      {/* Search Empty State */}
      {!isEmpty && filteredPurchases.length === 0 && (
        <div className="text-center py-20 text-zinc-500">
          <p>No results found for "{searchQuery}"</p>
        </div>
      )}

      {/* Floating Action Button */}
      <Link
        href="/add"
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-lg shadow-blue-600/30 transition-all active:scale-95 group"
      >
        <Plus
          size={28}
          strokeWidth={2.5}
          className="group-hover:rotate-90 transition-transform duration-300"
        />
      </Link>

      {/* Details Modal */}
      {selectedPurchase && (
        <PurchaseDetailsModal
          purchase={selectedPurchase}
          onClose={() => setSelectedPurchase(null)}
        />
      )}
    </main>
  );
}
