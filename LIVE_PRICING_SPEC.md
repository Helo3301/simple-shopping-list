# Live Pricing & Community Data - Specification

## Overview
Transform Simple Shopping List into a price-aware shopping assistant by integrating live grocery pricing from APIs and crowdsourced community data. Users can see real-time prices, compare across stores, and contribute pricing data to help others.

## Problem Statement
Shoppers need to:
- Know current prices before going to the store
- Compare prices across different grocery chains
- Find the best deals on their shopping list items
- Share pricing information with their community
- Budget accurately based on real-time costs

## API Integration Options

### Free/Open APIs Available

#### 1. **Kroger API** (FREE with registration)
- **URL**: https://developer.kroger.com/
- **Coverage**: Kroger, Fred Meyer, Ralphs, King Soopers, etc.
- **Features**: Product search, pricing, availability, store locations
- **Authentication**: OAuth 2.0
- **Rate Limits**: 10,000 requests/day (free tier)
- **Data**: Real-time prices, product images, nutrition info

#### 2. **Spoonacular API** (FREE tier available)
- **URL**: https://spoonacular.com/food-api
- **Coverage**: Aggregate grocery data
- **Features**: Product search, grocery stores, prices (limited)
- **Rate Limits**: 150 requests/day (free)
- **Data**: Product info, estimated prices

#### 3. **Open Food Facts API** (100% FREE & Open)
- **URL**: https://world.openfoodfacts.org/data
- **Coverage**: Global crowdsourced food database
- **Features**: Product info, barcodes, ingredients
- **Authentication**: None required
- **Rate Limits**: Reasonable use
- **Data**: Product details, but NO live pricing

#### 4. **UPC Database API** (FREE tier)
- **URL**: https://upcdatabase.org/
- **Coverage**: Product lookup by barcode
- **Features**: UPC/EAN lookup
- **Rate Limits**: Limited on free tier
- **Data**: Product identification, no pricing

### Limited/Paid APIs

#### 5. **Albertsons API** (RESTRICTED)
- **Status**: No public API - requires partnership
- **Workaround**: Web scraping (legal gray area)

#### 6. **Costco API** (NONE)
- **Status**: No public API
- **Workaround**: Web scraping (violates ToS)

#### 7. **Walmart API** (PARTNER ONLY)
- **Status**: Requires Walmart partnership
- **Alternative**: Affiliate API (limited)

#### 8. **Instacart API** (RESTRICTED)
- **Status**: Enterprise partnerships only

### Recommended Strategy
**Phase 1**: Start with Kroger API + Open Food Facts (100% free)
**Phase 2**: Add community crowdsourcing for stores without APIs
**Phase 3**: Consider paid APIs if user base grows

## Architecture

### Data Model

```typescript
// Price tracking
interface PriceEntry {
  id: string;
  itemName: string; // normalized lowercase
  barcode?: string; // UPC/EAN
  storeId: string; // foreign key to Store
  price: number; // in cents (avoid float issues)
  unit?: string; // "per lb", "each", "per gallon"
  salePrice?: number; // cents
  saleEndDate?: number; // timestamp
  source: 'api' | 'community' | 'manual';
  sourceDetails?: string; // API name or user ID
  lastVerified: number; // timestamp
  verificationCount: number; // community confirmations
  createdAt: number; // timestamp
}

// API configuration
interface APIConfig {
  id: string;
  provider: 'kroger' | 'spoonacular' | 'openfoodfacts' | 'custom';
  enabled: boolean;
  apiKey?: string; // encrypted
  authToken?: string; // OAuth token
  refreshToken?: string;
  tokenExpiry?: number;
  rateLimit: number; // requests per day
  requestsToday: number;
  lastRequestAt: number;
}

// Central server configuration
interface ServerConfig {
  id: string;
  name: string;
  url: string; // e.g., "https://api.myshoppinglist.com"
  enabled: boolean;
  pushEnabled: boolean; // Allow data push
  pullEnabled: boolean; // Allow data pull
  apiKey?: string; // For authentication
  syncInterval: number; // minutes between syncs
  lastSyncAt: number;
  privacyMode: 'anonymous' | 'authenticated' | 'opt-in';
}

// Community contribution
interface PriceContribution {
  id: string;
  priceEntryId: string;
  userId?: string; // Anonymous or signed
  verified: boolean;
  confidence: number; // 0-100
  photo?: string; // Receipt/shelf photo (base64)
  timestamp: number;
}
```

### Database Schema v5.0.0

```typescript
this.version(5).stores({
  departments: 'id, sortOrder',
  shoppingLists: 'id, name, createdAt',
  items: 'id, listId, departmentId, isChecked, createdAt',
  recentItems: 'id, name, lastUsedAt, useCount',
  collections: 'id, name, createdAt, updatedAt',
  collectionItems: 'id, collectionId, sortOrder',
  stores: 'id, name, isActive, createdAt, updatedAt',
  storeLayouts: 'id, storeId, departmentId, sortOrder',
  staples: 'id, name, frequency, lastPurchased, createdAt',
  itemPairs: 'id, item1, item2, count, lastSeen',
  // NEW TABLES
  priceEntries: 'id, itemName, storeId, barcode, price, lastVerified',
  apiConfigs: 'id, provider, enabled',
  serverConfigs: 'id, name, enabled, syncInterval',
  priceContributions: 'id, priceEntryId, userId, verified, timestamp',
});
```

## Features

### 1. API Integration (Kroger)

#### Setup Flow
1. **Settings → APIs → Connect Kroger**
2. User redirected to Kroger OAuth
3. Grant permissions (read products, prices)
4. Store access token securely (encrypted in IndexedDB)
5. Link Kroger stores to user's Store profiles

#### Price Fetching
- Search by item name
- Filter by user's active store
- Cache results for 4 hours
- Show freshness indicator ("Updated 2 hours ago")

#### UI Features
```
┌─────────────────────────────────────┐
│ 🛒 Weekly Groceries                 │
├─────────────────────────────────────┤
│ 🥛 Milk                             │
│ └─ $3.99 at Kroger - Main Street   │
│    ⏱️ Updated 1 hour ago            │
│    💰 Save $1.00 (on sale!)         │
└─────────────────────────────────────┘
```

### 2. Community Data Push

#### What Gets Shared
Users can opt to share:
- ✅ Item prices (anonymous)
- ✅ Store location
- ✅ Timestamp
- ✅ Verification status
- ❌ Personal information
- ❌ Full shopping list

#### Privacy Levels
1. **Anonymous**: Share data without user ID
2. **Authenticated**: Link to user account (reputation system)
3. **Opt-in**: Share specific items only

#### Push Format (REST API)
```json
POST /api/v1/prices/contribute
{
  "items": [
    {
      "name": "milk",
      "normalized": "milk whole gallon",
      "barcode": "0001234567890",
      "storeId": "store-123",
      "storeName": "Kroger - Main Street",
      "storeChain": "kroger",
      "price": 399,
      "unit": "per gallon",
      "salePrice": 299,
      "timestamp": 1699564800000,
      "photo": "base64..." // optional receipt photo
    }
  ],
  "userId": "anonymous", // or actual user ID
  "appVersion": "4.0.0"
}
```

#### Pull Format (REST API)
```json
GET /api/v1/prices?store=kroger-main-street&items=milk,eggs,bread

Response:
{
  "prices": [
    {
      "itemName": "milk",
      "price": 399,
      "confidence": 95,
      "lastVerified": 1699564800000,
      "verificationCount": 12,
      "salePrice": 299,
      "saleEndDate": 1699651200000
    }
  ],
  "meta": {
    "cached": false,
    "timestamp": 1699564800000
  }
}
```

### 3. Central Server Configuration

#### Server Setup UI
```
Settings → Community Data

┌─────────────────────────────────────┐
│ Add Server                          │
├─────────────────────────────────────┤
│ Name: Community Prices              │
│ URL:  https://prices.example.com    │
│ API Key: ••••••••••••••             │
│                                     │
│ ☑️ Enable pulling prices            │
│ ☑️ Enable pushing my prices         │
│                                     │
│ Privacy: [Anonymous ▼]              │
│ Sync Every: [30 minutes ▼]          │
│                                     │
│ [Test Connection] [Save]            │
└─────────────────────────────────────┘
```

#### Multiple Server Support
- Users can configure multiple servers
- Pull prices from all enabled servers
- Push to selected servers only
- Conflict resolution (newest wins)

### 4. Price Display & Comparison

#### Shopping View Integration
```
┌─────────────────────────────────────┐
│ 🥛 Dairy                            │
├─────────────────────────────────────┤
│ [ ] Milk                            │
│     💰 $3.99 (Kroger)               │
│     🏪 Compare prices →             │
│                                     │
│ [ ] Eggs                            │
│     💰 $4.29 (Kroger) ⚠️ Price up!  │
│     💡 $3.99 at Costco (2mi away)   │
└─────────────────────────────────────┘
```

#### Price Comparison Modal
```
┌─────────────────────────────────────┐
│ Milk Prices Near You                │
├─────────────────────────────────────┤
│ ✅ Kroger - Main St    $3.99        │
│    1.2 mi · Updated 1h ago          │
│                                     │
│    Costco - Downtown    $3.49       │
│    2.1 mi · Updated 3h ago          │
│    💡 Best price!                   │
│                                     │
│    Walmart - East       $4.19       │
│    0.8 mi · Updated 2d ago          │
│    ⚠️ Price may be outdated         │
└─────────────────────────────────────┘
```

### 5. Manual Price Entry

#### Quick Entry
- Long-press item → "Update price"
- Enter price
- Optionally add photo
- Submit to community servers

#### Receipt Scanner (Future)
- Take photo of receipt
- OCR extracts items and prices
- Batch upload to servers

### 6. Budget Tracking

#### Total Calculation
```
┌─────────────────────────────────────┐
│ Estimated Total: $45.23             │
│ At Kroger - Main Street             │
│                                     │
│ 💰 Save $8.50 at Costco             │
│    [View breakdown]                 │
└─────────────────────────────────────┘
```

#### Price Alerts
- "Milk price increased by 15%"
- "Eggs on sale - save $1.00!"
- "Better price at nearby store"

## Implementation Plan

### Phase 1: Foundation (Week 1)
- [ ] Create database schema v5
- [ ] Build PriceEntry, APIConfig, ServerConfig models
- [ ] Create settings UI for API configuration
- [ ] Implement Kroger OAuth flow

### Phase 2: Kroger Integration (Week 2)
- [ ] Build Kroger API service
- [ ] Product search by name
- [ ] Price fetching
- [ ] Cache management (4-hour TTL)
- [ ] Display prices in ShoppingView

### Phase 3: Open Food Facts (Week 2)
- [ ] Integrate Open Food Facts API
- [ ] Barcode lookup
- [ ] Product information enrichment
- [ ] Combine with pricing data

### Phase 4: Community Data (Week 3)
- [ ] Build central server REST API spec
- [ ] Implement push functionality
- [ ] Implement pull functionality
- [ ] Privacy controls
- [ ] Manual price entry UI

### Phase 5: Price Comparison (Week 4)
- [ ] Price comparison modal
- [ ] Cross-store analysis
- [ ] Budget calculation
- [ ] Price history charts
- [ ] Price alerts

### Phase 6: Advanced Features (Future)
- [ ] Receipt OCR scanning
- [ ] Price prediction (ML)
- [ ] Deal notifications
- [ ] Shopping route optimization
- [ ] Coupon integration

## Technical Considerations

### Security
1. **API Keys**: Encrypt at rest in IndexedDB
2. **OAuth Tokens**: Secure storage, auto-refresh
3. **Server Communication**: HTTPS only
4. **Rate Limiting**: Client-side throttling
5. **Privacy**: Anonymize user data

### Performance
1. **Caching**: 4-hour TTL for prices
2. **Batch Requests**: Group API calls
3. **Lazy Loading**: Fetch prices on-demand
4. **Background Sync**: Service worker for offline push

### Offline Support
1. **Cache Prices**: Store locally
2. **Queue Contributions**: Push when online
3. **Stale Indicators**: Show age of cached data

### Error Handling
1. **API Failures**: Fallback to cached/community data
2. **Network Issues**: Graceful degradation
3. **Rate Limits**: Queue and retry
4. **Invalid Data**: Validation and sanitization

## User Flows

### Flow 1: First-Time Setup
1. User goes to Settings → APIs
2. Clicks "Connect Kroger"
3. Redirected to Kroger OAuth
4. Grants permissions
5. Returns to app with access token
6. App fetches nearby Kroger stores
7. User links to existing Store profile
8. Prices now appear on shopping lists

### Flow 2: Community Contribution
1. User adds item to list
2. Long-press item → "I know the price"
3. Enter $3.99, optionally add photo
4. Select privacy level
5. Submit to configured servers
6. Confirmation: "Thanks! 12 people will see this"

### Flow 3: Price Comparison
1. User views shopping list
2. Sees "$3.99 at Kroger"
3. Taps "Compare prices"
4. Modal shows prices at 3 nearby stores
5. User sees Costco is $0.50 cheaper
6. Taps "Switch to Costco"
7. App updates active store
8. Recalculates total

## Open Questions

1. **Server Infrastructure**: Self-hosted vs cloud service?
2. **Data Retention**: How long to keep old prices?
3. **Moderation**: How to prevent spam/fake prices?
4. **Verification**: Require photo proof?
5. **Monetization**: Ads? Premium APIs? Affiliate links?

## Success Metrics

- API integration success rate > 95%
- Price freshness < 4 hours
- Community contributions > 100/day
- User savings average $5/trip
- Price accuracy > 90%

## Next Steps

1. Review and approve this spec
2. Prioritize features (MVP vs nice-to-have)
3. Begin Phase 1 implementation
4. Set up test Kroger API account
5. Design central server API
6. Build proof-of-concept
