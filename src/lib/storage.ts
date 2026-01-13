import Dexie, { type EntityTable } from 'dexie';
import { Purchase } from '@/types';

// Extend Dexie with our schema
const db = new Dexie('PriceMemoryDatabase') as Dexie & {
  purchases: EntityTable<Purchase, 'id'>;
};

// Schema declaration:
// id = primary key
// purchasedAt = index for sorting
// Schema declaration:
// id = primary key
// purchasedAt = index for sorting
db.version(2).stores({
  purchases: 'id, purchasedAt'
});

export const storage = {
  async listPurchases(): Promise<Purchase[]> {
    try {
      // Return sorted by date descending (newest first)
      return await db.purchases.orderBy('purchasedAt').reverse().toArray();
    } catch (error) {
      console.error("Failed to list purchases:", error);
      return [];
    }
  },

  async addPurchase(purchase: Purchase): Promise<void> {
    try {
      await db.purchases.add(purchase);
    } catch (error) {
      console.error("Failed to add purchase:", error);
      throw error;
    }
  },

  async deletePurchase(id: string): Promise<void> {
    try {
      await db.purchases.delete(id);
    } catch (error) {
      console.error(`Failed to delete purchase ${id}:`, error);
      throw error;
    }
  }
};

export { db };
