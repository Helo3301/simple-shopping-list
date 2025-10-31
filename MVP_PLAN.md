# Simple Shopping List - MVP Plan

## What We're Building (Version 1.0)

A simple, beautiful shopping list app that organizes items by department so you can shop efficiently without backtracking through the store.

**The Core Promise**: No ads, no tracking, no cloud. Just a clean tool that works offline and respects your privacy.

---

## Platform Decision

**RECOMMENDATION: Start with Web (React PWA)**

**Why Web First:**
1. ✅ Fastest to prototype and iterate
2. ✅ Works on all devices (desktop, mobile, tablet)
3. ✅ Easy to test without app store deployment
4. ✅ Can be self-hosted
5. ✅ Same codebase serves desktop and mobile web
6. ✅ Once working, informs iOS/Android development

**After Web MVP:**
- Port to iOS (native SwiftUI)
- Port to Android (native Compose)

---

## MVP Features (Phase 1 - Week 1-2)

### Must-Have Features

#### 1. List Management
- [ ] Create new shopping list
- [ ] View list of all shopping lists
- [ ] Delete shopping list
- [ ] Select active shopping list

#### 2. Item Management
- [ ] Add item with name
- [ ] Assign item to department (dropdown selector)
- [ ] Check off item (mark as complete)
- [ ] Uncheck item
- [ ] Delete item

#### 3. Department Organization
- [ ] Pre-populated default departments (10-12 standard ones)
- [ ] Display items grouped by department
- [ ] Show department headers with item counts

#### 4. Data Persistence
- [ ] Save lists to IndexedDB
- [ ] Save items to IndexedDB
- [ ] Load data on app start
- [ ] No data loss on refresh

---

## MVP Features (Phase 2 - Week 3-4)

### Important UX Features

#### 5. Smart Entry
- [ ] Recent items list (shows previously added items)
- [ ] Quick-add from recent items
- [ ] Remember department for each item name

#### 6. Visual Polish
- [ ] Progress indicator (X of Y items checked)
- [ ] Strikethrough checked items
- [ ] Clean, minimal design
- [ ] Responsive layout (mobile + desktop)
- [ ] Dark mode support

#### 7. Sharing & Data Export
- [ ] Export list as formatted text
- [ ] Copy to clipboard
- [ ] Share via system share (mobile web)
- [ ] **Export all data (backup)** - Download complete database as JSON
- [ ] **Import data (restore)** - Upload JSON backup to restore all lists/items/settings

#### 8. Department Customization
- [ ] Reorder departments (drag and drop)
- [ ] Hide empty departments (toggle)

---

## Data Export & Backup System

### Export Format (JSON)

The app will support full data backup and restore via JSON export:

```json
{
  "version": "1.0.0",
  "exportedAt": "2025-01-15T10:30:00Z",
  "departments": [
    {
      "id": "uuid-1",
      "name": "Produce",
      "icon": "🥬",
      "color": "#10B981",
      "sortOrder": 0,
      "isDefault": true
    }
  ],
  "shoppingLists": [
    {
      "id": "uuid-2",
      "name": "Weekly Groceries",
      "createdAt": 1705315800000,
      "updatedAt": 1705315900000
    }
  ],
  "items": [
    {
      "id": "uuid-3",
      "listId": "uuid-2",
      "name": "Bananas",
      "departmentId": "uuid-1",
      "isChecked": false,
      "createdAt": 1705315800000
    }
  ],
  "recentItems": [
    {
      "id": "uuid-4",
      "name": "Milk",
      "departmentId": "uuid-dairy",
      "useCount": 5,
      "lastUsedAt": 1705315800000
    }
  ]
}
```

### Export Features

**Backup (Export)**:
- Download complete database as `shopping-list-backup-YYYY-MM-DD.json`
- Includes all lists, items, departments, and recent items
- Timestamped for version tracking
- Human-readable JSON format

**Restore (Import)**:
- Upload JSON file to restore data
- Option to merge with existing data or replace entirely
- Validation before import (check version compatibility)
- Preview import contents before confirming

**Use Cases**:
1. **Backup before clearing data** - Export, then delete old lists
2. **Transfer between devices** - Export on phone, import on tablet
3. **Share setup with family** - Export department configuration
4. **Recover from mistakes** - Restore from previous backup

### UI Components

**Settings Menu**:
```
⚙️ Settings
├── 📤 Export Data (Backup)
├── 📥 Import Data (Restore)
├── 🗑️ Clear All Data
└── ℹ️ About
```

**Export Flow**:
1. User clicks "Export Data"
2. JSON file generated from IndexedDB
3. Browser downloads file: `shopping-list-backup-2025-01-15.json`
4. Success message shown

**Import Flow**:
1. User clicks "Import Data"
2. File picker opens (accept: `.json`)
3. JSON validated
4. Preview modal shows what will be imported
5. User chooses "Merge" or "Replace"
6. Data imported to IndexedDB
7. App refreshes to show imported data

---

## Features EXCLUDED from MVP

**Saving for Post-MVP:**
- ❌ Custom department creation (use defaults only)
- ❌ Swipe gestures (desktop-first, add later for mobile)
- ❌ Bulk add items
- ❌ Edit existing items (delete and re-add for MVP)
- ❌ List templates
- ❌ Archive lists (just delete)
- ❌ Search/filter
- ❌ Quantity and notes fields (name only for MVP)
- ❌ Collapsible departments (show all for MVP)
- ❌ Animations (functional first, pretty later)

**Why Excluded:**
- Keep scope tight for fast delivery
- Validate core concept first
- Add based on real usage feedback

---

## Tech Stack (Web MVP)

### Core Technologies
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Dexie.js** for IndexedDB wrapper
- **Zustand** or **Context API** for state management

### No External Dependencies For:
- ❌ UI component libraries (build custom, keep it light)
- ❌ Animation libraries (CSS only)
- ❌ State management (Context API sufficient for MVP)
- ❌ Routing (single-page app)

### Development Tools
- ESLint for code quality
- Prettier for formatting
- TypeScript for type safety

---

## Project Structure

```
simple-shopping-list-web/
├── public/
│   ├── index.html
│   ├── manifest.json (PWA)
│   └── icons/
├── src/
│   ├── components/
│   │   ├── ListSelection.tsx
│   │   ├── ShoppingView.tsx
│   │   ├── ItemEntry.tsx
│   │   ├── DepartmentSection.tsx
│   │   └── ItemRow.tsx
│   ├── hooks/
│   │   ├── useShoppingLists.ts
│   │   ├── useItems.ts
│   │   └── useRecentItems.ts
│   ├── services/
│   │   └── database.ts (Dexie setup)
│   ├── types/
│   │   └── models.ts
│   ├── utils/
│   │   └── defaultDepartments.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

---

## Database Schema (IndexedDB)

### Tables

**departments**
```typescript
{
  id: string (uuid)
  name: string
  icon: string (emoji)
  color: string (hex)
  sortOrder: number
  isDefault: boolean
}
```

**shopping_lists**
```typescript
{
  id: string (uuid)
  name: string
  createdAt: number (timestamp)
  updatedAt: number (timestamp)
}
```

**items**
```typescript
{
  id: string (uuid)
  listId: string (foreign key)
  name: string
  departmentId: string (foreign key)
  isChecked: boolean
  checkedAt: number | null (timestamp)
  createdAt: number (timestamp)
}
```

**recent_items**
```typescript
{
  id: string (uuid)
  name: string
  departmentId: string
  useCount: number
  lastUsedAt: number (timestamp)
}
```

### Indexes
- items.listId (for filtering by list)
- items.departmentId (for grouping)
- recent_items.name (for autocomplete)
- recent_items.lastUsedAt (for sorting)

---

## Default Departments

```typescript
[
  { name: 'Produce', icon: '🥬', color: '#10B981' },
  { name: 'Meat & Seafood', icon: '🥩', color: '#EF4444' },
  { name: 'Dairy & Eggs', icon: '🥛', color: '#F59E0B' },
  { name: 'Bakery', icon: '🍞', color: '#D97706' },
  { name: 'Frozen Foods', icon: '❄️', color: '#3B82F6' },
  { name: 'Canned Goods', icon: '🥫', color: '#8B5CF6' },
  { name: 'Snacks', icon: '🍿', color: '#EC4899' },
  { name: 'Beverages', icon: '🥤', color: '#06B6D4' },
  { name: 'Cleaning Supplies', icon: '🧹', color: '#84CC16' },
  { name: 'Personal Care', icon: '🧴', color: '#A855F7' },
  { name: 'Other', icon: '📦', color: '#6B7280' },
]
```

---

## Development Timeline

### Week 1: Foundation
**Days 1-2: Project Setup**
- [ ] Initialize Vite + React + TypeScript project
- [ ] Configure Tailwind CSS
- [ ] Set up Dexie.js and database schema
- [ ] Create type definitions

**Days 3-5: Core Data Layer**
- [ ] Implement database service
- [ ] Create custom hooks for CRUD operations
- [ ] Seed default departments
- [ ] Test data persistence

### Week 2: UI Development
**Days 1-3: List Management**
- [ ] Build ListSelection component
- [ ] Build ShoppingView component
- [ ] Implement create/delete list functionality
- [ ] Navigation between screens

**Days 4-5: Item Management**
- [ ] Build ItemEntry component
- [ ] Build ItemRow component with checkbox
- [ ] Implement add/delete/check item functionality
- [ ] Department grouping display

### Week 3: Smart Features
**Days 1-2: Recent Items**
- [ ] Track item usage in recent_items table
- [ ] Display recent items in entry screen
- [ ] Quick-add from recent items

**Days 3-5: Visual Polish**
- [ ] Style all components with Tailwind
- [ ] Add progress indicator
- [ ] Implement dark mode
- [ ] Responsive layout adjustments

### Week 4: Sharing & Polish
**Days 1-2: Share Functionality**
- [ ] Format list as text
- [ ] Copy to clipboard
- [ ] System share API integration

**Days 3-4: Department Ordering**
- [ ] Drag-and-drop department reordering
- [ ] Persist custom order
- [ ] Hide empty departments option

**Day 5: Testing & Bug Fixes**
- [ ] Cross-browser testing
- [ ] Mobile web testing
- [ ] Edge case handling
- [ ] Performance optimization

---

## Success Criteria

**MVP is successful if:**
1. ✅ User can create a shopping list
2. ✅ User can add items organized by department
3. ✅ User can check off items while shopping
4. ✅ Data persists across sessions
5. ✅ Works offline (no network needed)
6. ✅ Works on mobile and desktop browsers
7. ✅ No bugs in core workflows
8. ✅ Loads in < 2 seconds
9. ✅ Clean, intuitive UI

---

## Performance Targets

- **Initial Load**: < 2 seconds (first paint)
- **Item Add**: < 100ms from click to visible
- **Item Check**: Instant (< 50ms)
- **List Load**: < 500ms for 100 items
- **App Size**: < 500KB (initial bundle)

---

## Testing Plan

### Manual Testing Scenarios
1. Create new list, add 10 items across departments, check them off
2. Close browser, reopen, verify data persisted
3. Create second list, switch between lists
4. Add item with same name to different lists
5. Check off all items, verify progress shows 100%
6. Share list, verify text formatting
7. Reorder departments, verify order persists
8. Test on mobile device (responsive layout)
9. Toggle dark mode
10. Delete list, verify items also deleted

### Browser Compatibility
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- Mobile Safari (iOS 14+) ✅
- Chrome Mobile (Android 8+) ✅

---

## Privacy Audit Checklist

- [ ] No external API calls in code
- [ ] No analytics/tracking scripts
- [ ] No cookies set
- [ ] No local storage of PII beyond app data
- [ ] IndexedDB not accessible by other domains
- [ ] Content Security Policy configured
- [ ] No third-party CDN dependencies
- [ ] No external font loading
- [ ] Service worker only caches local assets
- [ ] Network tab shows zero external requests

---

## Deployment Options

**Option 1: GitHub Pages (Recommended for MVP)**
- Free static hosting
- HTTPS by default
- Easy deployment via GitHub Actions
- Custom domain support

**Option 2: Self-Hosted**
- User downloads HTML/JS/CSS files
- Runs locally via file:// protocol
- Or hosts on their own server

**Option 3: Vercel/Netlify**
- Free tier sufficient
- Automatic deployments
- CDN edge caching

---

## Next Immediate Steps

1. **Decision Point**: Confirm Web-first approach
2. **Set up dev environment**: Create Vite project
3. **Database setup**: Implement Dexie schema
4. **First component**: Build ShoppingView with hardcoded data
5. **Wire up data**: Connect IndexedDB to components
6. **Iterate**: Add features incrementally

---

## Questions to Answer Before Starting

1. **Where to host initially?** GitHub Pages? Vercel?
2. **Domain name needed?** Or use *.github.io for MVP?
3. **State management preference?** Zustand vs Context API?
4. **Component approach?** Functional components with hooks (recommended)
5. **Testing framework?** Vitest? (or skip for MVP?)

---

Ready to start building? Let's make a clean, fast, privacy-respecting shopping list app! 🚀
