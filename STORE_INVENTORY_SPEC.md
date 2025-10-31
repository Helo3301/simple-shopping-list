# Store Inventory Integration - Feature Specification

## Overview

Allow users to integrate grocery store inventory data to enhance their shopping experience while maintaining **complete privacy** and **local-only** operation.

**Core Principle**: No automatic connections to stores. All data must be manually imported, community-contributed, or crowd-sourced. Users stay in control.

---

## The Problem We're Solving

**Current issues**:
1. User doesn't know if store has item in stock
2. Can't compare prices across stores
3. Doesn't know which aisle/location items are in
4. May shop at wrong store for what they need
5. Can't optimize shopping route within store

**Better experience**:
1. User knows which stores carry their items
2. Can see price estimates (if they choose to track)
3. Knows exact aisle locations for faster shopping
4. Can pick the best store for their list
5. Gets optimized shopping route through store

---

## Privacy-First Approach

### What We WON'T Do

❌ Automatic API connections to stores (privacy violation)
❌ Send user's shopping list to external servers
❌ Track which stores users visit
❌ Require user accounts or login
❌ Share user data with retailers
❌ Use location tracking

### What We WILL Do

✅ Manual import of store data (CSV, JSON)
✅ Community-contributed store layouts (opt-in download)
✅ Local matching of items to store inventory
✅ Optional manual price tracking (stored locally)
✅ Offline-first operation
✅ User controls all data

---

## Feature 1: Store Profiles

### What is a Store Profile?

A **Store Profile** contains information about a specific grocery store location:
- Store name and location
- Department layout and ordering
- Aisle mapping (which items in which aisles)
- Optional: Product catalog
- Optional: Price data (user-entered or imported)

### Data Models

```typescript
interface Store {
  id: string;
  name: string; // "Kroger - Main Street"
  chain?: string; // "Kroger"
  address?: string;
  emoji?: string; // 🏪
  createdAt: number;
  updatedAt: number;
  isActive: boolean; // User's primary store
}

interface StoreLayout {
  id: string;
  storeId: string;
  departmentId: string; // Links to app's departments
  aisleNumber?: string; // "Aisle 3", "Aisle 12", etc.
  section?: string; // "Left side", "End cap", etc.
  sortOrder: number; // Order you encounter while shopping
}

interface StoreProduct {
  id: string;
  storeId: string;
  name: string; // Store's name for item
  brand?: string;
  size?: string; // "64 oz", "1 lb", etc.
  departmentId: string;
  aisleNumber?: string;
  price?: number; // Optional, user-entered
  priceUpdatedAt?: number;
  upc?: string; // For barcode scanning (future)
}

interface ItemStoreMapping {
  id: string;
  itemName: string; // User's generic name ("Milk")
  storeProductId: string; // Links to StoreProduct
  confidence: number; // 0-1, how confident the mapping is
  createdAt: number;
}
```

---

## Feature 2: Store Data Import

### Method 1: Manual Store Setup

**User creates store profile manually**:
1. Add store name and location
2. Customize department order (matches physical layout)
3. Optionally add aisle numbers to departments
4. Save profile

**Example**:
```
Store: Kroger - Main Street

Department Layout:
1. Produce (Aisles 1-2)
2. Bakery (Aisle 3)
3. Meat & Seafood (Aisle 4-5)
4. Dairy & Eggs (Aisle 6)
5. Frozen Foods (Aisle 7-8)
6. Canned Goods (Aisle 9-10)
7. Snacks (Aisle 11)
8. Beverages (Aisle 12)
9. Cleaning (Aisle 13)
10. Personal Care (Aisle 14)
```

### Method 2: Community Store Templates

**Shareable store profiles** (JSON format):

**What gets shared**:
- Store chain name
- Department ordering
- Aisle layout
- Generic product mappings (no prices, no personal data)

**What stays private**:
- User's shopping lists
- User's purchase history
- User's price data

**Example community template**:
```json
{
  "templateVersion": "1.0",
  "storeName": "Kroger",
  "chain": "Kroger",
  "layout": [
    {
      "department": "Produce",
      "aisles": ["1", "2"],
      "sortOrder": 1
    },
    {
      "department": "Bakery",
      "aisles": ["3"],
      "sortOrder": 2
    }
  ],
  "commonProducts": [
    {
      "name": "Bananas",
      "department": "Produce",
      "aisle": "1",
      "aliases": ["banana", "bananna", "yellow bananas"]
    }
  ]
}
```

**User workflow**:
1. User goes to "Add Store"
2. Selects "Import Store Template"
3. Chooses from pre-made templates OR imports JSON file
4. Template populates store profile
5. User customizes if needed (their store might differ slightly)

### Method 3: Scan Store Receipt (Advanced)

**Future feature - OCR receipt scanning**:
- User takes photo of receipt
- App extracts: Items, prices, store name
- Auto-creates product mappings
- Updates price data
- All processing done locally (no cloud OCR)

---

## Feature 3: Smart Item-to-Product Matching

### The Matching Problem

User enters generic names:
- "Milk" → Store sells "Kroger 2% Milk 1 Gal", "Horizon Organic Milk", etc.
- "Chicken" → Store has "Boneless Chicken Breast", "Whole Chicken", "Chicken Thighs"

**Solution**: Fuzzy matching with user confirmation

### Matching Algorithm

```typescript
function matchItemToStoreProducts(
  itemName: string,
  storeId: string,
  storeProducts: StoreProduct[]
): MatchResult[] {
  const results: MatchResult[] = [];

  storeProducts.forEach(product => {
    let score = 0;

    // Exact match
    if (product.name.toLowerCase() === itemName.toLowerCase()) {
      score = 1.0;
    }
    // Product name contains item name
    else if (product.name.toLowerCase().includes(itemName.toLowerCase())) {
      score = 0.8;
    }
    // Item name contains product name
    else if (itemName.toLowerCase().includes(product.name.toLowerCase())) {
      score = 0.7;
    }
    // Check aliases/synonyms
    else {
      const aliases = SYNONYM_MAP[itemName.toLowerCase()] || [];
      if (aliases.some(alias => product.name.toLowerCase().includes(alias))) {
        score = 0.6;
      }
    }

    // Consider department match (bonus points)
    if (product.departmentId === item.departmentId) {
      score += 0.1;
    }

    if (score > 0.5) {
      results.push({
        product,
        confidence: Math.min(score, 1.0),
        reason: `Matched "${itemName}" to "${product.name}"`
      });
    }
  });

  return results.sort((a, b) => b.confidence - a.confidence);
}
```

**Synonym mapping** (user-editable):
```typescript
const SYNONYM_MAP = {
  "milk": ["dairy milk", "whole milk", "2% milk", "skim milk"],
  "chicken": ["chicken breast", "chicken thigh", "whole chicken"],
  "bananas": ["banana", "yellow bananas", "organic bananas"],
  // ... etc.
};
```

### User Confirmation Workflow

1. User adds "Milk" to shopping list
2. App finds 3 store products with high match scores:
   - "Kroger 2% Milk 1 Gal" (90% match)
   - "Horizon Organic Milk" (85% match)
   - "Great Value Whole Milk" (80% match)
3. User selects their preferred product
4. App remembers this mapping for future lists
5. Next time user adds "Milk", it auto-maps to their choice

---

## Feature 4: Multi-Store Shopping

### Store Comparison View

**Show which stores carry user's items**:

```
Your List: Weekly Groceries (12 items)

┌─────────────────────────────────────────┐
│ 🏪 Kroger - Main Street                │
│ ✓ Has 12 of 12 items (100%)            │
│ Estimated total: $47.23                 │
│ Distance: 2.5 mi                        │
│                                         │
│ [Shop Here]                             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🏪 Walmart Supercenter                 │
│ ✓ Has 11 of 12 items (92%)             │
│ Missing: Organic Bananas                │
│ Estimated total: $42.10                 │
│ Distance: 3.1 mi                        │
│                                         │
│ [Shop Here]                             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🏪 Whole Foods Market                  │
│ ✓ Has 10 of 12 items (83%)             │
│ Missing: Generic Brand items            │
│ Estimated total: $62.45                 │
│ Distance: 1.8 mi                        │
│                                         │
│ [Shop Here]                             │
└─────────────────────────────────────────┘
```

### Split Shopping Lists

**Optimize across multiple stores**:

User has 20 items:
- 15 items available at Kroger ($45 total)
- 5 items only at Whole Foods ($18 total)

App suggests:
```
💡 Shop at 2 stores to save $12:

🏪 Kroger (15 items) - $45.00
  → Bananas, Milk, Eggs, Bread, ...

🏪 Whole Foods (5 items) - $18.00
  → Organic Quinoa, Almond Butter, ...

Total: $63.00
(vs. $75 at Whole Foods alone)

[Create Split Lists]  [Shop One Store]
```

Tapping "Create Split Lists" generates two separate lists.

---

## Feature 5: In-Store Navigation

### Aisle-by-Aisle Organization

**Standard view** (by department):
```
🥬 Produce (Aisle 1-2)
  □ Bananas
  □ Apples

🥛 Dairy (Aisle 6)
  □ Milk
  □ Yogurt
```

**Store navigation view** (by aisle order):
```
Shopping at: Kroger - Main Street

Aisle 1-2: Produce
  □ Bananas
  □ Apples

Aisle 6: Dairy & Eggs
  □ Milk
  □ Yogurt

Aisle 9: Canned Goods
  □ Tomato Sauce
  □ Black Beans
```

### Route Optimization

**Algorithm**: Minimize backtracking

```
Store layout: Entrance → Aisles 1-14 → Checkout

User's items in:
- Aisle 1 (Produce)
- Aisle 6 (Dairy)
- Aisle 3 (Bakery)
- Aisle 12 (Beverages)

Optimized route:
  1. Start at Aisle 1 (Produce)
  2. Go to Aisle 3 (Bakery)
  3. Continue to Aisle 6 (Dairy)
  4. End at Aisle 12 (Beverages)
  5. Head to checkout

Saves you from going:
  Aisle 1 → 6 → 3 → 12 (more back-and-forth)
```

**Visual route indicator**:
```
🚶 Your shopping route:

1️⃣  Aisle 1-2 (Produce) ────────┐
                                 │
2️⃣  Aisle 3 (Bakery) ◀──────────┘
                                 │
3️⃣  Aisle 6 (Dairy) ◀───────────┘
                                 │
4️⃣  Aisle 12 (Beverages) ◀──────┘
                                 │
✓   Checkout ◀──────────────────┘
```

---

## Feature 6: Price Tracking (Optional)

### User-Controlled Price Data

**Opt-in feature** - users choose whether to track prices.

**How it works**:
1. User manually enters prices as they shop
2. Or scans receipt to extract prices (OCR, local only)
3. App stores prices with timestamps
4. Shows price history and trends
5. Estimates total cost for shopping lists

**Price history view**:
```
🥛 Milk (Kroger 2% 1 Gal)

Price History:
  $3.29  ← Current (Updated 2 days ago)
  $3.49  (1 week ago)
  $2.99  (3 weeks ago) ⬅ Lowest
  $3.39  (5 weeks ago)

Average: $3.29
Trend: ↘ Decreasing

[Update Price]  [View All Prices]
```

**Price comparison**:
```
🥛 Milk (2% 1 Gal)

Kroger:     $3.29
Walmart:    $2.89  ← Cheapest
Whole Foods: $4.49

Last updated:
  Kroger - 2 days ago
  Walmart - 1 week ago
  Whole Foods - 3 weeks ago
```

**Budget tracking**:
```
Weekly Groceries

Estimated Total: $47.23
  Produce:      $12.50
  Dairy:        $8.75
  Meat:         $15.00
  Other:        $10.98

Based on prices from:
  Kroger - Main Street
  (Last updated 3 days ago)

⚠ Prices may have changed
```

### Privacy Note

All price data:
- ✅ Stored locally only
- ✅ Never shared with stores
- ✅ Never sent to external servers
- ✅ User can clear anytime
- ✅ Completely optional feature

---

## Feature 7: Community Contributions

### Shareable Store Data

**What users can share**:
1. **Store layout templates** (department order, aisles)
2. **Product catalogs** (item names, departments, aisles)
3. **Item aliases** (synonyms for better matching)

**What stays private**:
- Shopping lists
- Purchase history
- Price data
- Personal preferences

### Export/Import Format

**Store Template JSON**:
```json
{
  "version": "1.0",
  "type": "store-template",
  "storeName": "Kroger",
  "chain": "Kroger",
  "location": {
    "city": "Springfield",
    "state": "IL"
  },
  "layout": [
    {
      "department": "Produce",
      "aisles": ["1", "2"],
      "sortOrder": 1
    }
  ],
  "products": [
    {
      "name": "Kroger 2% Milk 1 Gal",
      "genericName": "Milk",
      "brand": "Kroger",
      "department": "Dairy",
      "aisle": "6"
    }
  ],
  "createdAt": "2025-01-15",
  "contributedBy": "anonymous"
}
```

**How to share**:
1. User exports their store profile
2. File is saved as JSON
3. User shares via email, Discord, forum, etc.
4. Others import and customize

**Community repository** (optional, future):
- GitHub repo with community-contributed templates
- Users can browse and download
- No central server or tracking
- Open-source contributions

---

## Implementation Plan

### Phase 1: Basic Store Profiles (Week 1-2)

- [ ] Add Store data model
- [ ] Create Store management UI
- [ ] Allow custom department ordering per store
- [ ] Store selection in shopping lists

### Phase 2: Product Mapping (Week 3-4)

- [ ] StoreProduct data model
- [ ] Item-to-product matching algorithm
- [ ] User confirmation workflow
- [ ] Mapping storage and learning

### Phase 3: Store Import/Export (Week 5-6)

- [ ] JSON export format
- [ ] Import store templates
- [ ] Template browser/selector
- [ ] Community template guidelines

### Phase 4: Multi-Store Features (Week 7-8)

- [ ] Store comparison view
- [ ] Split list generation
- [ ] Store availability checking

### Phase 5: In-Store Navigation (Week 9-10)

- [ ] Aisle-based organization
- [ ] Route optimization algorithm
- [ ] Visual route display

### Phase 6: Price Tracking (Week 11-12)

- [ ] Optional price data model
- [ ] Price entry UI
- [ ] Price history and trends
- [ ] Budget estimation

---

## Technical Requirements

### Data Storage

**Local only** - All data in IndexedDB:
- ~50KB per store profile
- ~500KB per product catalog (2000 products)
- ~5KB per shopping list with mappings
- Total: <5MB for average user

### Performance

- Store matching: < 100ms
- Route optimization: < 50ms
- Product search: < 200ms
- Large catalogs (10k+ products): Use search indexes

### Offline Support

- All features work without internet
- Import/export via local files
- No cloud dependencies

---

## User Settings

**Store Features Settings**:

```
⚙️ Store Features

General
  ✓ Enable store profiles
  → Manage my stores

Primary Store: [Kroger - Main Street ▼]

Product Matching
  ✓ Suggest store products
  ✓ Auto-match high confidence (>90%)
  ✓ Remember my product choices

  → View product mappings
  → Edit synonyms dictionary

Navigation
  ✓ Show aisle numbers
  ✓ Optimize shopping route
  ✓ Group by aisle order (vs. department)

Price Tracking (Optional)
  ☐ Track product prices
  ☐ Show price history
  ☐ Estimate list totals
  ☐ Compare prices across stores

  → Manage price data
  → Clear all prices

Privacy
  → What data is stored locally
  → Export my store data
  → Clear all store data
```

---

## Open Questions

1. **Barcode scanning**: Add UPC scanning for exact product matching?
2. **Store API partnerships**: If stores offer official APIs, integrate?
3. **Location services**: Use GPS to detect nearby stores? (opt-in only)
4. **Recipe integration**: Import recipes and auto-generate shopping lists?
5. **Coupons**: Track digital coupons and discounts? (privacy-preserving)

---

## Example User Journey

### Setup
1. User creates store profile: "Kroger - Main Street"
2. Imports community template for Kroger layouts
3. Customizes aisle order to match their local store
4. Sets as primary store

### First Shopping Trip
1. Creates list "Weekly Groceries"
2. Adds: Milk, Eggs, Bread, Bananas, Chicken
3. App suggests store products:
   - "Milk" → "Kroger 2% Milk 1 Gal"
   - User confirms: "Yes, that's what I buy"
4. App remembers mapping for future
5. Switches to "Store Navigation" view
6. Items organized by aisle order
7. Shops efficiently, following optimized route

### Future Trips
1. Creates new list
2. Items auto-map to known products
3. Can see which aisles to visit
4. Optional: Enters prices to track budget
5. Exports store data to share with family

---

## Privacy Guarantees

**We promise**:
1. ✅ No automatic connections to stores
2. ✅ No sharing of shopping lists
3. ✅ No location tracking
4. ✅ No user accounts required
5. ✅ All data stored locally
6. ✅ User controls all exports
7. ✅ No telemetry or analytics
8. ✅ Open-source matching algorithms

**Users control**:
- What stores they add
- What data they import
- What data they share
- When to enable features
- What price data to track

---

## Success Criteria

- User can set up store in < 2 minutes
- Product matching accuracy > 80%
- Route optimization saves ≥30% backtracking
- <10% of users disable store features
- Community contributes ≥5 store templates

---

This feature respects privacy while adding real utility. No black boxes, no external dependencies, just honest tools to make shopping easier!
