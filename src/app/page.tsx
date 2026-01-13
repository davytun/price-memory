"use client";

import { useState } from "react";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/storage";
import { PurchaseCard } from "@/components/PurchaseCard";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { Plus, Search } from "lucide-react";
import { PurchaseDetailsModal } from "@/components/PurchaseDetailsModal"; // New Import
import { Purchase } from "@/types";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null
  ); // New State

  // Dexie hook to watch db changes live
  const purchases = useLiveQuery(
    () => db.purchases.orderBy("purchasedAt").reverse().toArray(),
    []
  );

  if (!purchases)
    return <div className="p-8 text-center text-gray-500">Loading...</div>;

  const now = new Date();
  const grouped = {
    today: [] as typeof purchases,
    yesterday: [] as typeof purchases,
    lastWeek: [] as typeof purchases,
    older: [] as typeof purchases,
  };

  const filteredPurchases = purchases.filter((p) =>
    p.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  filteredPurchases.forEach((p) => {
    const date = parseISO(p.purchasedAt);
    const diff = differenceInCalendarDays(now, date);

    if (diff === 0) grouped.today.push(p);
    else if (diff === 1) grouped.yesterday.push(p);
    else if (diff <= 7) grouped.lastWeek.push(p);
    else grouped.older.push(p);
  });

  return (
    <main className="min-h-screen p-4 max-w-md mx-auto pb-24 font-sans">
      <header className="mb-8 mt-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
          Price Memory
        </h1>
        <p className="text-sm text-muted mb-6">Track your trading expenses</p>

        {/* Search Input */}
        <div className="relative group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted transition-colors group-focus-within:text-foreground"
            size={16}
          />
          <input
            type="text"
            placeholder="Search purchases..."
            className="w-full bg-surface/50 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm focus:bg-surface focus:border-white/10 focus:outline-none transition-all placeholder:text-muted/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

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

      {/* Empty State */}
      {filteredPurchases.length === 0 && (
        <div className="text-center py-20 opacity-50">
          <p>
            {purchases.length === 0
              ? "No purchases recorded yet."
              : "No results found."}
          </p>
        </div>
      )}

      {/* Floating Action Button */}
      <Link
        href="/add"
        className="fixed bottom-6 right-6 bg-primary hover:bg-blue-600 text-white p-4 rounded-full shadow-[0_8px_30px_rgb(59,130,246,0.5)] transition-all active:scale-95"
      >
        <Plus size={24} strokeWidth={2.5} />
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

interface PurchaseSectionProps {
  title: string;
  items: Purchase[];
  onSelect: (p: Purchase) => void;
}

function PurchaseSection({ title, items, onSelect }: PurchaseSectionProps) {
  if (items.length === 0) return null;
  return (
    <section className="mb-8">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4 pl-1">
        {title}
      </h2>
      {items.map((p) => (
        <PurchaseCard key={p.id} purchase={p} onClick={() => onSelect(p)} />
      ))}
    </section>
  );
}
