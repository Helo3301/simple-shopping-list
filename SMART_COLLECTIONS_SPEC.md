# Smart Collections - Feature Specification

## Overview

Smart Collections allow users to create reusable templates of items that they can apply to new shopping lists. The system can also suggest similar items based on transparent, user-visible rules - no black-box AI.

**Core Principle**: The recommendation algorithm must be simple, understandable, and fully visible to the user. No hidden machine learning or opaque scoring systems.

---

## The Problem We're Solving

**Current workflow**:
1. User creates "Weekly Groceries" every week
2. Manually adds: Milk, Eggs, Bread, Bananas, Chicken, etc.
3. Next week, starts from scratch again
4. Forgets items they usually buy

**Better workflow with Smart Collections**:
1. User creates a "Weekly Staples" collection once
2. When starting a new list, applies the collection → all items added instantly
3. System suggests items they often buy together with collection items
4. User can see exactly WHY each item is suggested

---

## Feature 1: Collections (Templates)

### What is a Collection?

A **Collection** is a reusable set of items that can be applied to any shopping list.

**Examples**:
- "Weekly Staples" - Milk, Eggs, Bread, Butter, etc.
- "Taco Night" - Ground beef, Tortillas, Lettuce, Cheese, Salsa
- "Breakfast Basics" - Cereal, Milk, Bananas, Coffee, Juice
- "Baking Supplies" - Flour, Sugar, Eggs, Vanilla extract

### Data Model

```typescript
interface Collection {
  id: string;
  name: string;
  description?: string;
  emoji?: string; // Visual identifier (🍞, 🌮, etc.)
  createdAt: number;
  updatedAt: number;
}

interface CollectionItem {
  id: string;
  collectionId: string; // Foreign key
  name: string;
  departmentId: string;
  quantity?: string;
  notes?: string;
  sortOrder: number;
}
```

### User Workflows

#### Creating a Collection

**Method 1: From Scratch**
1. User goes to Collections tab
2. Taps "New Collection"
3. Names it (e.g., "Weekly Staples")
4. Adds items one by one
5. Saves collection

**Method 2: From Existing List**
1. User has completed shopping list
2. Taps "Save as Collection"
3. Names the collection
4. All items from that list are saved as a template

#### Applying a Collection to a List

1. User creates new shopping list
2. Taps "Add from Collection"
3. Selects "Weekly Staples"
4. All collection items are added to the list
5. User can modify, add, or remove items as needed

#### Editing a Collection

1. User goes to Collections tab
2. Selects collection to edit
3. Can add/remove/reorder items
4. Changes save to template (don't affect existing lists)

---

## Feature 2: Transparent Recommendations

### The Recommendation Engine

**Goal**: Suggest items the user might want to add, based on clear, visible rules.

**NOT using**:
- ❌ Black-box machine learning
- ❌ Hidden scoring algorithms
- ❌ External data or "AI"

**USING**:
- ✅ Simple frequency counting
- ✅ Co-occurrence patterns (items bought together)
- ✅ User-visible rule explanations

### How It Works

#### Rule 1: Frequency-Based Suggestions

**Logic**: "You often buy [item] with items from [collection]"

**Example**:
- User applies "Taco Night" collection
- System looks at past lists that included taco items
- Finds user often adds "Sour Cream" when buying taco ingredients
- Suggests: **"Sour Cream"** → *"You added this to 4 of the last 5 taco-related lists"*

**Algorithm**:
```
For each collection:
  1. Look at all past shopping lists
  2. Find lists that contain ≥50% of the collection's items
  3. Count which other items appeared in those lists
  4. Rank items by frequency
  5. Suggest top 5 items not already in current list
```

#### Rule 2: Time-Based Patterns

**Logic**: "It's been [X days] since you bought [item]"

**Example**:
- User buys milk every 7-10 days
- Last milk purchase was 8 days ago
- System suggests: **"Milk"** → *"You usually buy this every 7 days. Last purchased 8 days ago."*

**Algorithm**:
```
For each frequently bought item:
  1. Calculate average days between purchases
  2. Check days since last purchase
  3. If (days_since_last ≥ average_interval * 0.9):
       Suggest item with time-based explanation
```

#### Rule 3: Department Clusters

**Logic**: "When you shop in [department], you usually also get..."

**Example**:
- User adds item from Produce
- System checks: "When you buy produce, you also buy from Dairy 80% of the time"
- Suggests: **"Yogurt"** → *"You usually buy dairy items when shopping for produce"*

**Algorithm**:
```
For each item added to current list:
  1. Note the item's department
  2. Look at past lists with items from that department
  3. Find which OTHER departments appear frequently (>60%)
  4. Suggest popular items from those departments
```

### Recommendation UI

**Suggestion Card**:
```
┌─────────────────────────────────────────┐
│ 💡 Suggested for you                    │
├─────────────────────────────────────────┤
│                                         │
│ 🥛 Milk                                 │
│ → You added this to 4 of the last 5    │
│    lists with similar items             │
│                                         │
│              [Ignore]  [Add to List]    │
└─────────────────────────────────────────┘
```

**Why This Item? (Tap to expand)**:
```
┌─────────────────────────────────────────┐
│ Why is Milk suggested?                  │
├─────────────────────────────────────────┤
│                                         │
│ ✓ You bought it 4 times in the last    │
│   5 lists that included eggs and bread  │
│                                         │
│ ✓ Average time between purchases:      │
│   7 days (last bought 8 days ago)      │
│                                         │
│ ✓ Usually bought with Dairy items:     │
│   Yogurt, Cheese                        │
│                                         │
│ [View Purchase History]                 │
└─────────────────────────────────────────┘
```

---

## Feature 3: Smart Insights (Optional)

Show users patterns in their shopping behavior.

### Insights Examples

**Pattern Detection**:
- "You always buy bananas with cereal"
- "Taco ingredients appear in your lists every 2 weeks"
- "You haven't bought milk in 10 days (usually every 7 days)"

**Weekly Report** (optional):
```
This Week's Shopping Insights

🔄 Regular Items Due:
   • Milk (last bought 8 days ago)
   • Eggs (last bought 6 days ago)

📊 Common Patterns:
   • You buy produce 90% of the time
   • Avg items per trip: 12
   • Most frequent: Bananas (bought 8 times)

💰 Budget Insight:
   • You typically spend on 4 departments
   • Most common: Produce, Dairy, Meat
```

---

## Implementation Plan

### Phase 1: Collections (Week 1-2)

**Tasks**:
- [ ] Add Collections data model (database tables)
- [ ] Create Collections management UI
  - [ ] List all collections
  - [ ] Create new collection
  - [ ] Edit collection
  - [ ] Delete collection
- [ ] Implement "Save List as Collection"
- [ ] Implement "Add Collection to List"

**UI Screens**:
1. Collections Tab (new tab in main nav)
2. Collection Detail View
3. "Apply Collection" modal in Shopping View

### Phase 2: Basic Recommendations (Week 3-4)

**Tasks**:
- [ ] Implement frequency-based recommendation algorithm
- [ ] Add suggestion UI in Shopping View
- [ ] Show recommendation explanations
- [ ] Add "Ignore" and "Add" actions
- [ ] Track ignored suggestions (don't re-suggest)

**Algorithm Implementation**:
```typescript
function getFrequencyBasedSuggestions(
  currentList: ShoppingItem[],
  allPastLists: ShoppingList[],
  allPastItems: ShoppingItem[]
): Suggestion[] {
  // 1. Get item names from current list
  const currentItemNames = currentList.map(item => item.name);

  // 2. Find past lists with similar items (≥50% overlap)
  const similarLists = allPastLists.filter(pastList => {
    const pastItemNames = allPastItems
      .filter(item => item.listId === pastList.id)
      .map(item => item.name);

    const overlap = currentItemNames.filter(name =>
      pastItemNames.includes(name)
    ).length;

    return overlap >= currentItemNames.length * 0.5;
  });

  // 3. Count frequency of other items in similar lists
  const itemFrequency = new Map<string, number>();

  similarLists.forEach(list => {
    const items = allPastItems
      .filter(item => item.listId === list.id)
      .filter(item => !currentItemNames.includes(item.name));

    items.forEach(item => {
      itemFrequency.set(
        item.name,
        (itemFrequency.get(item.name) || 0) + 1
      );
    });
  });

  // 4. Sort by frequency and return top 5
  const suggestions = Array.from(itemFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({
      itemName: name,
      reason: `You added this to ${count} of the last ${similarLists.length} similar lists`,
      confidence: count / similarLists.length
    }));

  return suggestions;
}
```

### Phase 3: Advanced Patterns (Week 5-6)

**Tasks**:
- [ ] Implement time-based suggestions
- [ ] Implement department clustering
- [ ] Add "Why this item?" expandable explanation
- [ ] Add purchase history view
- [ ] Optimize recommendation performance

### Phase 4: Smart Insights (Week 7-8)

**Tasks**:
- [ ] Pattern detection algorithms
- [ ] Weekly insights generation
- [ ] Insights UI/dashboard
- [ ] Settings to enable/disable insights

---

## Data Requirements

### New Tables

**collections**
```sql
CREATE TABLE collections (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  emoji TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
```

**collection_items**
```sql
CREATE TABLE collection_items (
  id TEXT PRIMARY KEY,
  collection_id TEXT NOT NULL,
  name TEXT NOT NULL,
  department_id TEXT NOT NULL,
  quantity TEXT,
  notes TEXT,
  sort_order INTEGER NOT NULL,
  FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);
```

**suggestion_feedback** (for learning what to suggest)
```sql
CREATE TABLE suggestion_feedback (
  id TEXT PRIMARY KEY,
  item_name TEXT NOT NULL,
  context_items TEXT NOT NULL, -- JSON array of items in list when suggested
  was_accepted BOOLEAN NOT NULL,
  created_at INTEGER NOT NULL
);
```

### Required Indexes

```sql
CREATE INDEX idx_collection_items_collection_id ON collection_items(collection_id);
CREATE INDEX idx_items_list_id ON items(list_id);
CREATE INDEX idx_items_created_at ON items(created_at);
CREATE INDEX idx_suggestion_feedback_item_name ON suggestion_feedback(item_name);
```

---

## Privacy Considerations

**All processing stays local**:
- ✅ Recommendations calculated on-device
- ✅ No data sent to servers
- ✅ No external APIs
- ✅ Algorithm fully transparent

**User Control**:
- ✅ Can disable recommendations entirely
- ✅ Can clear suggestion history
- ✅ Can see exactly why each item is suggested
- ✅ Can mark items as "Never Suggest"

**Data retention**:
- Suggestion feedback stored locally only
- User can clear feedback data
- No telemetry about which suggestions were accepted

---

## User Settings

**New Settings Section**: "Smart Features"

```
⚙️ Smart Features

Collections
  ✓ Enable Collections
  → Manage Collections

Recommendations
  ✓ Show item suggestions
  ✓ Use frequency-based suggestions
  ✓ Use time-based suggestions
  ✓ Use department clustering

  Suggestion Sensitivity: [Low] [Medium] [High]

  → View suggestion history
  → Clear suggestion feedback
  → Never suggest certain items

Insights (Optional)
  ✓ Show shopping insights
  ✓ Weekly pattern reports
```

---

## Success Metrics

**Collections**:
- Number of collections created per user
- Average items per collection
- Frequency of collection application
- % of lists using at least one collection

**Recommendations**:
- Suggestion acceptance rate (target: >30%)
- Number of suggestions shown per list
- User engagement with "Why?" explanations
- % of users who disable suggestions (target: <10%)

**Performance**:
- Recommendation calculation time (<100ms)
- No lag when adding items
- Smooth UI interactions

---

## Example User Journey

### Setup Phase
1. Sarah creates "Weekly Staples" collection with 15 common items
2. Creates "Breakfast Essentials" with 8 items
3. Creates "Baking Day" with 12 items

### Weekly Shopping
1. Sarah creates new list "Groceries - Week 32"
2. Applies "Weekly Staples" → 15 items added instantly
3. System suggests: **"Bananas"**
   - Reason: "You added this to 8 of the last 10 weekly grocery lists"
   - Sarah taps "Add" → added to list
4. System suggests: **"Yogurt"**
   - Reason: "You usually buy dairy when shopping for produce"
   - Sarah taps "Ignore" (already has yogurt at home)
5. Sarah manually adds "Coffee" (running low)
6. Goes shopping with organized list by department

### Next Week
1. Sarah applies "Weekly Staples" again
2. System suggests "Coffee" this time
   - Reason: "Last purchased 7 days ago, usually bought every 6 days"
   - Also suggests "Bananas" again (frequent purchase)
3. Sarah accepts both suggestions
4. List is complete in seconds

---

## Visual Mockup (Text-based)

### Collections Tab
```
┌─────────────────────────────────────────┐
│  ☰  Collections                    +    │
├─────────────────────────────────────────┤
│                                         │
│  My Collections                         │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 🍞 Weekly Staples                 │ │
│  │ 15 items                          │ │
│  │ Used 23 times                     │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 🌮 Taco Night                     │ │
│  │ 8 items                           │ │
│  │ Used 12 times                     │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 🍰 Baking Day                     │ │
│  │ 12 items                          │ │
│  │ Used 5 times                      │ │
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### Suggestions in Shopping View
```
┌─────────────────────────────────────────┐
│  💡 Suggested for you (3)               │
├─────────────────────────────────────────┤
│                                         │
│  🍌 Bananas                        [+]  │
│  You added this to 8 of the last       │
│  10 similar lists                  [×]  │
│                                         │
│  🥤 Orange Juice                   [+]  │
│  Usually bought every 5 days.          │
│  Last purchased 6 days ago         [×]  │
│                                         │
│  🧀 Cheddar Cheese                 [+]  │
│  Often bought with dairy items     [×]  │
│                                         │
│  [Show More] [Hide Suggestions]         │
└─────────────────────────────────────────┘
```

---

## Technical Notes

**Performance Optimization**:
- Cache recommendation calculations
- Compute suggestions in background (Web Worker)
- Limit analysis to last 50 lists (configurable)
- Index frequently queried fields

**Testing Strategy**:
- Unit tests for recommendation algorithms
- Test with mock shopping history
- Verify explanation accuracy
- Performance benchmarks (<100ms per suggestion)

**Accessibility**:
- Screen reader descriptions for suggestions
- Keyboard navigation for suggestion cards
- Clear visual hierarchy
- Haptic feedback on acceptance/rejection

---

## Open Questions

1. **Collection Sharing**: Should users be able to share collections with family/friends via JSON export?
2. **Negative Feedback**: Track items user explicitly doesn't want suggested?
3. **Seasonal Patterns**: Detect and suggest based on time of year?
4. **Price Awareness**: Allow users to optionally track prices for budgeting?

---

## Next Steps

1. Review spec with user (Lex and friend)
2. Prioritize features (Collections first, then recommendations)
3. Create detailed UI mockups
4. Begin Phase 1 implementation
5. Test with real usage patterns

---

**This spec maintains the app's core principles**:
- ✅ Privacy-first (all local)
- ✅ Transparent (no black-box algorithms)
- ✅ User control (can disable any feature)
- ✅ Simple and understandable
- ✅ No external dependencies

Let's build smart features the honest way!
