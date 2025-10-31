# Community Sharing Platform - Specification

## Overview

A decentralized, privacy-preserving platform for users to share:
- **Collections** (shopping templates like "Weekly Staples", "Taco Night")
- **Store Layouts** (department ordering and aisle mappings)
- **Product Catalogs** (store-specific item lists)
- **Item Aliases** (synonyms for better search)

**Core Principle**: Share knowledge, not personal data. No central tracking server.

---

## Privacy-First Architecture

### What We WON'T Do

❌ Central database of user data
❌ User accounts with tracking
❌ Analytics on who downloads what
❌ Personal information collection
❌ Ads or monetization
❌ Proprietary/closed formats

### What We WILL Do

✅ Open JSON format for all shared data
✅ GitHub-based community repository (optional)
✅ Peer-to-peer file sharing
✅ Local import/export
✅ Community moderation (quality, not censorship)
✅ Open-source everything

---

## Sharing Architecture

### Method 1: Official Community Repository (GitHub)

**Repository structure**:
```
simple-shopping-list-community/
├── collections/
│   ├── weekly-staples/
│   │   ├── basic.json
│   │   ├── vegetarian.json
│   │   └── large-family.json
│   ├── meal-prep/
│   │   ├── breakfast-week.json
│   │   └── lunch-batch-cooking.json
│   └── special-occasions/
│       ├── taco-tuesday.json
│       ├── pizza-night.json
│       └── thanksgiving-dinner.json
├── stores/
│   ├── kroger/
│   │   ├── template-standard.json
│   │   └── template-marketplace.json
│   ├── walmart/
│   │   └── template-supercenter.json
│   └── whole-foods/
│       └── template-standard.json
├── product-catalogs/
│   └── (optional - large files)
└── CONTRIBUTING.md
```

**How it works**:
1. Community members submit PRs with new templates
2. Maintainers review for quality and privacy
3. Approved templates added to repo
4. Users browse and download via app or website

**Advantages**:
- ✅ Free hosting (GitHub)
- ✅ Version control (Git)
- ✅ Community moderation (PR reviews)
- ✅ Discoverable (GitHub search)
- ✅ No tracking

### Method 2: Direct File Sharing

**Users share JSON files directly**:
- Email attachments
- Discord/Slack file uploads
- Forum posts
- Personal websites/blogs
- Cloud storage links (Dropbox, Google Drive)

**Workflow**:
1. User exports collection/store as JSON
2. Shares file anywhere
3. Recipient imports JSON into app
4. No middleman needed

### Method 3: QR Code Sharing

**For in-person sharing**:
1. User generates QR code from collection
2. Shows QR code on screen
3. Friend scans with phone camera
4. App imports collection directly

**Use cases**:
- Sharing at family gatherings
- Roommates sharing shopping templates
- Friends recommending collections
- In-store sharing (if helping someone)

### Method 4: Community Website (Optional)

**Simple static website** (GitHub Pages):
- Browse collections by category
- Search by keywords
- Preview before downloading
- One-click import link
- No backend server needed

**Example**: `shopping-list-community.github.io`

---

## Data Format Standards

### Collection JSON Format

```json
{
  "type": "shopping-collection",
  "version": "1.0.0",
  "metadata": {
    "name": "Weekly Staples",
    "description": "Basic groceries for a family of 4, one week",
    "author": "anonymous",
    "category": "weekly",
    "tags": ["family", "staples", "groceries"],
    "createdAt": "2025-01-15",
    "language": "en-US"
  },
  "items": [
    {
      "name": "Milk",
      "department": "Dairy & Eggs",
      "quantity": "1 gallon",
      "notes": "2% or whole",
      "aliases": ["milk", "dairy milk", "whole milk"]
    },
    {
      "name": "Eggs",
      "department": "Dairy & Eggs",
      "quantity": "1 dozen",
      "notes": "Large, any brand"
    },
    {
      "name": "Bread",
      "department": "Bakery",
      "quantity": "1 loaf",
      "notes": "Whole wheat preferred"
    }
  ],
  "tips": [
    "Buy milk in larger quantities if you have freezer space",
    "Check eggs for cracks before purchasing"
  ]
}
```

### Store Template JSON Format

```json
{
  "type": "store-template",
  "version": "1.0.0",
  "metadata": {
    "storeName": "Kroger",
    "storeChain": "Kroger",
    "templateName": "Standard Layout",
    "location": {
      "country": "US",
      "region": "Midwest"
    },
    "author": "anonymous",
    "createdAt": "2025-01-15",
    "lastUpdated": "2025-01-15"
  },
  "layout": [
    {
      "department": "Produce",
      "aisles": ["1", "2"],
      "sortOrder": 1,
      "notes": "Usually near entrance"
    },
    {
      "department": "Bakery",
      "aisles": ["3"],
      "sortOrder": 2
    },
    {
      "department": "Meat & Seafood",
      "aisles": ["4", "5"],
      "sortOrder": 3
    }
  ],
  "commonProducts": [
    {
      "name": "Kroger 2% Milk 1 Gal",
      "genericName": "Milk",
      "department": "Dairy & Eggs",
      "aisle": "6",
      "brand": "Kroger"
    }
  ]
}
```

### Privacy Sanitization

**Before sharing, app removes**:
- User-specific identifiers
- Personal notes (unless explicitly marked as shareable)
- Price data
- Purchase history
- Timestamps (replaced with generic dates)
- Any location data

**What stays**:
- Item names (generic)
- Department categorization
- Quantity suggestions
- Generic tips/notes
- Store layout info

---

## In-App Community Browser

### UI Design

**Community Tab** in app:

```
┌─────────────────────────────────────────┐
│  🌍 Community                           │
├─────────────────────────────────────────┤
│  Browse Collections                     │
│                                         │
│  Popular This Week                      │
│  ┌───────────────────────────────────┐ │
│  │ 🍞 Weekly Staples                 │ │
│  │ 15 items • 1.2k downloads         │ │
│  │ ⭐⭐⭐⭐⭐ (234 ratings)              │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 🌮 Taco Tuesday                   │ │
│  │ 8 items • 856 downloads           │ │
│  │ ⭐⭐⭐⭐⭐ (167 ratings)              │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Categories                             │
│  [Weekly] [Meal Prep] [Special Events] │
│  [Dietary] [Budget] [Quick Meals]       │
│                                         │
│  Store Templates                        │
│  ┌───────────────────────────────────┐ │
│  │ 🏪 Kroger - Standard Layout       │ │
│  │ 11 departments • 342 downloads    │ │
│  └───────────────────────────────────┘ │
│                                         │
│  [Upload Your Collection]               │
└─────────────────────────────────────────┘
```

### Collection Detail View

```
┌─────────────────────────────────────────┐
│  ← Weekly Staples                       │
├─────────────────────────────────────────┤
│  🍞 Weekly Staples                      │
│  by Community Member                    │
│                                         │
│  ⭐⭐⭐⭐⭐ 4.8 (234 ratings)              │
│  1.2k downloads                         │
│                                         │
│  Description:                           │
│  "Basic groceries for a family of 4,   │
│   enough for one week. Focuses on      │
│   versatile staples."                  │
│                                         │
│  Tags: #family #staples #weekly        │
│                                         │
│  Items (15):                            │
│  • Milk (1 gallon)                     │
│  • Eggs (1 dozen)                      │
│  • Bread (1 loaf)                      │
│  • Bananas                             │
│  • Chicken breast (2 lbs)              │
│  ... [View All]                        │
│                                         │
│  Tips:                                  │
│  • Buy milk in bulk if you have space  │
│  • Check egg cartons for cracks        │
│                                         │
│  [Download]  [Preview]  [Share]        │
└─────────────────────────────────────────┘
```

### Search & Filter

```
┌─────────────────────────────────────────┐
│  🔍 Search collections...               │
├─────────────────────────────────────────┤
│                                         │
│  Filter by:                             │
│                                         │
│  Category:                              │
│  ☐ Weekly Shopping                     │
│  ☐ Meal Prep                           │
│  ☑ Special Occasions                   │
│  ☐ Dietary Restrictions                │
│                                         │
│  Size:                                  │
│  ☐ Small (< 10 items)                  │
│  ☑ Medium (10-20 items)                │
│  ☐ Large (> 20 items)                  │
│                                         │
│  Dietary:                               │
│  ☐ Vegetarian                          │
│  ☐ Vegan                               │
│  ☐ Gluten-free                         │
│  ☐ Keto                                │
│                                         │
│  Sort by:                               │
│  • Most Popular ▼                      │
│  • Highest Rated                       │
│  • Recently Added                      │
│  • Most Downloaded                     │
│                                         │
│  [Apply Filters]                        │
└─────────────────────────────────────────┘
```

---

## Contributing Flow

### How Users Share Collections

**Step 1: Prepare Collection**
1. User creates/refines collection in app
2. Adds helpful description and tips
3. Reviews items for privacy (no personal notes)
4. Adds tags and category

**Step 2: Export**
1. Tap "Share with Community"
2. App generates sanitized JSON
3. Shows preview of what will be shared
4. User confirms export

**Step 3: Submit to Community**

**Option A: GitHub PR** (technical users):
1. Fork community repo
2. Add JSON file to appropriate folder
3. Submit pull request
4. Maintainers review and merge

**Option B: Web Form** (non-technical users):
1. Go to community website
2. Upload JSON file via form
3. Form creates GitHub issue
4. Maintainers convert to PR

**Option C: Direct Sharing** (skip community repo):
1. Share JSON file via any method
2. Post link on Discord, Reddit, etc.
3. Others download directly

### Quality Guidelines

**Collections must**:
- ✅ Have clear, descriptive names
- ✅ Include at least 3 items
- ✅ Categorize items by department
- ✅ Provide helpful description
- ✅ Use appropriate tags
- ✅ Be in correct JSON format
- ✅ Not contain personal information

**Collections should**:
- Include quantity suggestions
- Provide helpful tips
- Use common item names
- Be well-organized
- Specify dietary restrictions (if applicable)

**Collections must NOT**:
- Contain offensive content
- Include price data
- Have personal notes
- Use proprietary information
- Violate copyright

---

## Moderation & Quality Control

### Review Process

**For official community repo**:
1. User submits PR with collection
2. Automated checks run:
   - Valid JSON format ✓
   - No personal data ✓
   - Minimum 3 items ✓
   - All required fields present ✓
3. Human reviewer checks:
   - Quality of descriptions
   - Usefulness of collection
   - Appropriate categorization
4. If approved: Merge to main
5. If needs work: Request changes
6. If rejected: Close with explanation

### Rating System

**Users can rate downloaded collections**:
- ⭐⭐⭐⭐⭐ (1-5 stars)
- Optional text review
- Ratings stored locally (no central database)
- Aggregated counts shown (if using official repo)

**How ratings work without central server**:
- GitHub repo has `ratings.json` file
- Updated via PRs when users submit ratings
- Counts are approximate (not every user submits)
- Still useful for discovering popular collections

### Quality Badges

Collections can earn badges:
- 🏆 **Community Favorite** (>1000 downloads, >4.5 stars)
- ✓ **Verified Quality** (reviewed by maintainers)
- 🆕 **New This Week** (recently added)
- 🔥 **Trending** (high download velocity)
- 💚 **Dietary Friendly** (vegetarian, vegan, etc.)

---

## Discovery Features

### Personalized Recommendations

**Based on local data only**:
- "You might like these collections"
- Suggested based on:
  - Collections you've already downloaded
  - Items you frequently buy
  - Your dietary preferences (if set)
  - Store you shop at

**Algorithm** (runs locally):
```typescript
function recommendCollections(
  userPreferences: UserData,
  availableCollections: Collection[]
): Collection[] {
  return availableCollections
    .filter(collection => {
      // Filter by user's dietary preferences
      if (userPreferences.dietary.vegetarian && !collection.tags.includes('vegetarian')) {
        return false;
      }
      // Filter by size preference
      if (collection.items.length > userPreferences.maxListSize) {
        return false;
      }
      return true;
    })
    .map(collection => {
      // Score based on item overlap with user's recent purchases
      const score = calculateSimilarity(
        collection.items,
        userPreferences.recentItems
      );
      return { collection, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(item => item.collection);
}
```

### Featured Collections

**Curated by maintainers**:
- Seasonal collections (Thanksgiving, Christmas)
- New user starter packs
- Regional specialties
- Popular dietary options

---

## Technical Implementation

### Phase 1: Export/Import (Week 1-2)

- [ ] Implement JSON export for collections
- [ ] Add privacy sanitization
- [ ] Create import functionality
- [ ] Add validation for imported data
- [ ] Handle format versioning

### Phase 2: File Sharing (Week 3-4)

- [ ] QR code generation
- [ ] QR code scanning
- [ ] Share via system share sheet
- [ ] Handle import from various sources

### Phase 3: Community Browser (Week 5-8)

- [ ] Build GitHub API integration (read-only)
- [ ] Create collection browser UI
- [ ] Implement search and filtering
- [ ] Add preview functionality
- [ ] Download and import collections

### Phase 4: Contributing (Week 9-10)

- [ ] "Share with Community" workflow
- [ ] Privacy preview before sharing
- [ ] Integration with GitHub (optional)
- [ ] Web form for non-technical users

### Phase 5: Discovery (Week 11-12)

- [ ] Personalized recommendations
- [ ] Rating system
- [ ] Featured collections
- [ ] Category browsing

---

## GitHub Repository Setup

### Repository Structure

```
simple-shopping-list-community/
├── README.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── LICENSE (MIT or CC0)
│
├── collections/
│   ├── weekly/
│   ├── meal-prep/
│   ├── special-occasions/
│   ├── dietary/
│   │   ├── vegetarian/
│   │   ├── vegan/
│   │   ├── gluten-free/
│   │   └── keto/
│   └── budget/
│
├── stores/
│   ├── kroger/
│   ├── walmart/
│   ├── whole-foods/
│   ├── trader-joes/
│   └── costco/
│
├── metadata/
│   ├── ratings.json
│   ├── downloads.json
│   └── featured.json
│
├── scripts/
│   ├── validate.js (PR validation)
│   └── update-stats.js (update download counts)
│
└── website/
    ├── index.html
    ├── browse.html
    └── submit.html
```

### Automation

**GitHub Actions workflows**:

1. **Validate PR**:
```yaml
name: Validate Collection

on:
  pull_request:
    paths:
      - 'collections/**/*.json'
      - 'stores/**/*.json'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Validate JSON
        run: node scripts/validate.js
      - name: Check for personal data
        run: node scripts/privacy-check.js
```

2. **Update Stats**:
```yaml
name: Update Download Stats

on:
  schedule:
    - cron: '0 0 * * *' # Daily

jobs:
  update-stats:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Update counts
        run: node scripts/update-stats.js
```

---

## Privacy Considerations

### What Gets Shared

**Allowed in community submissions**:
- ✅ Generic item names ("Milk", "Eggs")
- ✅ Department categories
- ✅ Quantity suggestions
- ✅ Generic tips ("Check expiration dates")
- ✅ Dietary tags
- ✅ Store layout information

**Never shared**:
- ❌ Personal identifiers
- ❌ Purchase history
- ❌ Price data
- ❌ Location data
- ❌ Personal notes
- ❌ Shopping habits
- ❌ User preferences

### Pre-Share Privacy Check

**App shows warning before sharing**:
```
┌─────────────────────────────────────────┐
│  Privacy Check                          │
├─────────────────────────────────────────┤
│  Before sharing, we'll remove:          │
│                                         │
│  ✓ Personal notes                      │
│  ✓ Price information                   │
│  ✓ Your name and identifiers           │
│  ✓ Specific purchase dates             │
│                                         │
│  What will be shared:                   │
│  • Item names: Milk, Eggs, Bread       │
│  • Departments: Dairy, Bakery          │
│  • Quantities: 1 gallon, 1 dozen       │
│  • Generic tips (optional)             │
│                                         │
│  [Review Preview]  [Cancel]  [Share]   │
└─────────────────────────────────────────┘
```

---

## Community Guidelines

### Code of Conduct

**Community members agree to**:
- Be respectful and inclusive
- Share helpful, accurate information
- Respect others' privacy
- Provide constructive feedback
- Follow contribution guidelines

**Not tolerated**:
- Harassment or discrimination
- Spam or self-promotion
- Malicious code or data
- Copyright violations
- Privacy violations

### Contribution Guidelines

**Good collection examples**:
- "Weekly Staples - Family of 4" (clear audience)
- "Vegetarian Meal Prep Sunday" (specific diet)
- "Budget-Friendly Groceries <$50" (helpful constraint)
- "Thanksgiving Dinner for 8" (special occasion)

**Poor collection examples**:
- "My Groceries" (too vague)
- "Random Items" (not useful)
- "Super Secret List" (not descriptive)
- Contains brand-specific items only

---

## Monetization (Optional Future)

**If community grows, optional revenue streams**:

### Option 1: Voluntary Donations
- "Buy us a coffee" link
- Funds cover hosting costs
- No required payment

### Option 2: Premium Templates
- Some collections are "premium" (pay-what-you-want)
- Created by professional meal planners
- Revenue shared with creators
- All basic collections remain free

### Option 3: Book/Course Sales
- "Ultimate Shopping List Guide" eBook
- Video courses on meal planning
- Not required to use app

**Key principle**: Core app and community always free and open-source.

---

## Success Metrics

**For community health**:
- Number of contributions per month
- Contributor diversity (not dominated by few users)
- Collection quality (average rating)
- Community engagement (comments, feedback)
- Download/usage rates

**Targets** (Year 1):
- 100+ collections
- 50+ store templates
- 10+ active contributors
- 1000+ total downloads
- 4.0+ average rating

---

## User Stories

### Sarah (Busy Mom)
1. Downloads app
2. Browses "Family Collections"
3. Finds "Weekly Staples - Family of 4"
4. Imports with one tap
5. Customizes to her preferences
6. Uses every week
7. Later shares her improved version

### Mike (Meal Prep Enthusiast)
1. Creates "Sunday Meal Prep" collection
2. Exports to JSON
3. Posts on Reddit r/MealPrepSunday
4. 500 people download
5. They rate it 5 stars
6. Mike's collection becomes featured

### Community Member
1. Submits new "Keto Basics" collection
2. Creates PR on GitHub
3. Maintainer reviews, approves
4. Others find it useful
5. Gets "Community Favorite" badge
6. Feels good about helping others

---

## Open Questions

1. **Moderation**: How many maintainers needed?
2. **Versioning**: How to handle updates to popular collections?
3. **Localization**: Support multiple languages?
4. **Regional Variations**: Different templates for different countries?
5. **Integration**: Link with recipe websites?

---

This creates a thriving community while respecting everyone's privacy. No central tracking, open formats, and user empowerment! 🌍✨
