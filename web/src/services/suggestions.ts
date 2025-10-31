import { db } from './database';
import { Staple, ShoppingItem, ItemPair } from '../types/models';
import { v4 as uuidv4 } from 'uuid';

export interface Suggestion {
  id: string;
  name: string;
  departmentId: string;
  reason: 'staple' | 'frequency' | 'pair';
  details: string;
  priority: number; // Higher = more important
}

// Track item pairs when items are checked off together
export async function trackItemPairs(listId: string): Promise<void> {
  try {
    // Get all checked items from this list
    const checkedItems = await db.items
      .where('listId')
      .equals(listId)
      .and(item => item.isChecked)
      .toArray();

    if (checkedItems.length < 2) return;

    // Get unique item names (normalized)
    const itemNames = checkedItems.map(item => item.name.toLowerCase().trim());

    // Track all pairs
    for (let i = 0; i < itemNames.length; i++) {
      for (let j = i + 1; j < itemNames.length; j++) {
        const [item1, item2] = [itemNames[i], itemNames[j]].sort(); // Alphabetical order

        // Check if pair exists
        const existing = await db.itemPairs
          .where('[item1+item2]')
          .equals([item1, item2])
          .first();

        if (existing) {
          // Increment count
          await db.itemPairs.update(existing.id, {
            count: existing.count + 1,
            lastSeen: Date.now(),
          });
        } else {
          // Create new pair
          const pair: ItemPair = {
            id: uuidv4(),
            item1,
            item2,
            count: 1,
            lastSeen: Date.now(),
          };
          await db.itemPairs.add(pair);
        }
      }
    }
  } catch (error) {
    console.error('Error tracking item pairs:', error);
  }
}

// Update staple last purchased date when item is added
export async function updateStaplePurchased(itemName: string): Promise<void> {
  try {
    const normalized = itemName.toLowerCase().trim();
    const staple = await db.staples
      .where('name')
      .equals(normalized)
      .first();

    if (staple) {
      await db.staples.update(staple.id, {
        lastPurchased: Date.now(),
      });
    }
  } catch (error) {
    console.error('Error updating staple:', error);
  }
}

// Get suggestions based on current list
export async function getSuggestions(currentItems: ShoppingItem[]): Promise<Suggestion[]> {
  const suggestions: Suggestion[] = [];

  // Get current item names (normalized)
  const currentItemNames = new Set(
    currentItems.map(item => item.name.toLowerCase().trim())
  );

  try {
    // 1. Check staples (manual reminders)
    const staples = await db.staples.toArray();
    for (const staple of staples) {
      if (currentItemNames.has(staple.name)) continue; // Already in list

      const shouldSuggest = checkStapleSuggestion(staple);
      if (shouldSuggest) {
        suggestions.push({
          id: `staple-${staple.id}`,
          name: staple.name,
          departmentId: staple.departmentId,
          reason: 'staple',
          details: getStapleReason(staple),
          priority: 10, // Highest priority
        });
      }
    }

    // 2. Check frequency (recentItems analysis)
    const frequentSuggestions = await getFrequencyBasedSuggestions(currentItemNames);
    suggestions.push(...frequentSuggestions);

    // 3. Check item pairs (items bought together)
    if (currentItems.length > 0) {
      const pairSuggestions = await getPairBasedSuggestions(currentItemNames);
      suggestions.push(...pairSuggestions);
    }

    // Sort by priority (highest first)
    suggestions.sort((a, b) => b.priority - a.priority);

    // Return top 5 suggestions
    return suggestions.slice(0, 5);
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return [];
  }
}

// Check if a staple should be suggested
function checkStapleSuggestion(staple: Staple): boolean {
  const now = Date.now();
  const lastPurchased = staple.lastPurchased || 0;
  const daysSince = (now - lastPurchased) / (1000 * 60 * 60 * 24);

  switch (staple.frequency) {
    case 'always':
      return true; // Always suggest
    case 'weekly':
      return daysSince >= 7;
    case 'biweekly':
      return daysSince >= 14;
    case 'monthly':
      return daysSince >= 30;
    default:
      return false;
  }
}

// Get reason text for staple suggestion
function getStapleReason(staple: Staple): string {
  const daysSince = staple.lastPurchased
    ? Math.floor((Date.now() - staple.lastPurchased) / (1000 * 60 * 60 * 24))
    : null;

  if (staple.frequency === 'always') {
    return 'You marked this as a staple item';
  }

  if (daysSince !== null) {
    return `Last bought ${daysSince} days ago (${staple.frequency} reminder)`;
  }

  return `${staple.frequency} reminder`;
}

// Get frequency-based suggestions from recentItems
async function getFrequencyBasedSuggestions(currentItems: Set<string>): Promise<Suggestion[]> {
  const suggestions: Suggestion[] = [];

  try {
    // Get top recent items (high use count)
    const recentItems = await db.recentItems
      .orderBy('useCount')
      .reverse()
      .limit(20)
      .toArray();

    for (const item of recentItems) {
      const normalized = item.name.toLowerCase().trim();
      if (currentItems.has(normalized)) continue;

      // Suggest if:
      // - Used 5+ times
      // - Last used within 60 days
      const daysSince = (Date.now() - item.lastUsedAt) / (1000 * 60 * 60 * 24);

      if (item.useCount >= 5 && daysSince <= 60) {
        const priority = Math.min(9, Math.floor(item.useCount / 2)); // 5-9 priority

        suggestions.push({
          id: `freq-${item.id}`,
          name: item.name,
          departmentId: item.departmentId,
          reason: 'frequency',
          details: `You buy this often (${item.useCount} times)`,
          priority,
        });
      }
    }
  } catch (error) {
    console.error('Error getting frequency suggestions:', error);
  }

  return suggestions;
}

// Get pair-based suggestions (items bought together)
async function getPairBasedSuggestions(currentItems: Set<string>): Promise<Suggestion[]> {
  const suggestions: Suggestion[] = [];

  try {
    // Get all pairs that include any of our current items
    const pairs = await db.itemPairs.toArray();
    const pairScores = new Map<string, { count: number; departmentId?: string }>();

    for (const pair of pairs) {
      // Skip if both items already in list
      if (currentItems.has(pair.item1) && currentItems.has(pair.item2)) {
        continue;
      }

      // Check if one item is in current list
      if (currentItems.has(pair.item1)) {
        const current = pairScores.get(pair.item2) || { count: 0 };
        pairScores.set(pair.item2, { count: current.count + pair.count });
      } else if (currentItems.has(pair.item2)) {
        const current = pairScores.get(pair.item1) || { count: 0 };
        pairScores.set(pair.item1, { count: current.count + pair.count });
      }
    }

    // Convert to suggestions (only if bought together 3+ times)
    for (const [itemName, data] of pairScores.entries()) {
      if (data.count >= 3) {
        // Try to get department from recentItems
        const recent = await db.recentItems
          .where('name')
          .equalsIgnoreCase(itemName)
          .first();

        const priority = Math.min(8, 3 + Math.floor(data.count / 2)); // 3-8 priority

        suggestions.push({
          id: `pair-${itemName}`,
          name: itemName,
          departmentId: recent?.departmentId || '',
          reason: 'pair',
          details: `Often bought with your other items`,
          priority,
        });
      }
    }
  } catch (error) {
    console.error('Error getting pair suggestions:', error);
  }

  return suggestions;
}

// Helper: Add staple
export async function addStaple(
  name: string,
  departmentId: string,
  frequency: Staple['frequency']
): Promise<void> {
  try {
    const normalized = name.toLowerCase().trim();

    // Check if already exists
    const existing = await db.staples
      .where('name')
      .equals(normalized)
      .first();

    if (existing) {
      throw new Error('This item is already a staple');
    }

    const staple: Staple = {
      id: uuidv4(),
      name: normalized,
      departmentId,
      frequency,
      createdAt: Date.now(),
    };

    await db.staples.add(staple);
  } catch (error) {
    console.error('Error adding staple:', error);
    throw error;
  }
}

// Helper: Remove staple
export async function removeStaple(stapleId: string): Promise<void> {
  try {
    await db.staples.delete(stapleId);
  } catch (error) {
    console.error('Error removing staple:', error);
    throw error;
  }
}

// Helper: Update staple
export async function updateStaple(
  stapleId: string,
  updates: Partial<Pick<Staple, 'name' | 'departmentId' | 'frequency'>>
): Promise<void> {
  try {
    const updateData: any = { ...updates };
    if (updates.name) {
      updateData.name = updates.name.toLowerCase().trim();
    }
    await db.staples.update(stapleId, updateData);
  } catch (error) {
    console.error('Error updating staple:', error);
    throw error;
  }
}
