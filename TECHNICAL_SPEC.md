# Simple Shopping List - Technical Specification

## Overview
Simple Shopping List is a privacy-first grocery list application that organizes items by store department/category, making shopping trips more efficient. All data stays local on the user's device.

**Core Principle**: Zero telemetry. All data stays on the user's device. No cloud sync, no analytics, no tracking.

---

## Platform Architecture

### iOS (Native)
- **Language**: Swift 5.9+
- **UI Framework**: SwiftUI
- **Minimum Version**: iOS 15.0+
- **Data Storage**:
  - Core Data (local SQLite database)
  - UserDefaults for app preferences
- **Architecture**: MVVM (Model-View-ViewModel)
- **Security**:
  - App Sandbox enabled
  - No network entitlements

### Android (Native)
- **Language**: Kotlin 1.9+
- **UI Framework**: Jetpack Compose
- **Minimum Version**: Android 8.0 (API 26)+
- **Data Storage**:
  - Room Database (local SQLite)
  - SharedPreferences for app preferences
- **Architecture**: MVVM with Repository pattern
- **Security**:
  - No INTERNET permission in manifest
  - Internal storage only

### Web (Progressive Web App)
- **Framework**: React 18+ with TypeScript
- **UI Library**: Tailwind CSS + shadcn/ui components
- **Data Storage**:
  - IndexedDB (via Dexie.js wrapper)
  - LocalStorage for preferences
- **Build Tool**: Vite
- **Architecture**: Component-based with Context API for state
- **Security**:
  - No external API calls
  - Content Security Policy (CSP) with no external domains
  - Service Worker for offline functionality
- **Deployment**: Static files only, can be self-hosted

---

## Data Models

### Department
```
Department {
  id: UUID
  name: String (e.g., "Produce", "Dairy", "Frozen")
  color: String (hex color)
  icon: String (emoji or icon name)
  sortOrder: Int (for custom ordering)
  isCustom: Boolean (user-created vs default)
  createdAt: DateTime
}
```

### ShoppingList
```
ShoppingList {
  id: UUID
  name: String (e.g., "Weekly Groceries", "Party Supplies")
  createdAt: DateTime
  updatedAt: DateTime
  isActive: Boolean (for archiving old lists)
}
```

### ShoppingItem
```
ShoppingItem {
  id: UUID
  listId: UUID (foreign key to ShoppingList)
  departmentId: UUID? (nullable for uncategorized)
  name: String
  quantity: String? (e.g., "2", "1 lb", "3 cans")
  notes: String?
  isChecked: Boolean (marked as completed)
  checkedAt: DateTime?
  sortOrder: Int (within department)
  createdAt: DateTime
  updatedAt: DateTime
}
```

### RecentItem
```
RecentItem {
  id: UUID
  name: String
  departmentId: UUID?
  useCount: Int
  lastUsedAt: DateTime
}
```

---

## Core Features (MVP)

### 1. Department Management
- Pre-populated default departments:
  - Produce
  - Meat & Seafood
  - Dairy & Eggs
  - Bakery
  - Frozen Foods
  - Canned Goods
  - Snacks
  - Beverages
  - Cleaning Supplies
  - Personal Care
  - Other
- Create custom departments
- Edit department names and appearance
- Reorder departments (drag and drop)
- Delete custom departments

### 2. Shopping List Management
- Create multiple lists
- Rename lists
- Set one list as active
- Archive completed lists
- Delete lists

### 3. Item Management
- Add items with quick-add button
- Assign items to departments
- Set quantity and notes
- Check off items as purchased
- Uncheck items (undo)
- Delete items
- Drag to reorder within department

### 4. Smart Item Entry
- Autocomplete from recent items
- Suggested department based on item name
- Quick add from recent items list
- Bulk add (multiple items at once)

### 5. Shopping Mode View
- Items grouped by department
- Department headers collapsible
- Show only unchecked items option
- Check-off animation
- Progress indicator (X of Y items)
- Share list as text (copy to clipboard)

### 6. Recent Items History
- Track frequently used items
- Quick-add from history
- Search recent items
- Clear history option

---

## Stretch Goals (Post-MVP)

### Smart Suggestions
- Local ML for department auto-assignment
- Learn from user's categorization patterns
- Seasonal suggestions (no data leaves device)

### Advanced Organization
- Sub-categories within departments
- Custom store layouts (department ordering per store)
- Multi-store support (different layouts for different stores)

### Shopping Templates
- Create reusable list templates (e.g., "Weekly Staples")
- Duplicate lists
- Merge lists

### Item Database
- Personal product catalog with prices
- Price tracking over time (manual entry)
- Budget estimation for list

### Sharing (Privacy-Preserving)
- Export list as text/JSON
- Generate QR code for list (local encoding)
- No cloud sync required

---

## User Interface Design Principles

### Mobile (iOS/Android)
1. **Quick Access**: FAB (Floating Action Button) for adding items
2. **Swipe Actions**:
   - Swipe right → Check off item
   - Swipe left → Delete item
3. **Department Sections**: Collapsible accordion style
4. **Clean Design**: Minimal distractions, focus on task
5. **Dark Mode**: Full support with OLED-friendly blacks

### Web
1. **Keyboard Shortcuts**: Enter to add, Space to check, etc.
2. **Responsive Layout**: Mobile-first, scales to tablet/desktop
3. **Touch Friendly**: Large tap targets for mobile web users
4. **Offline First**: Works without internet connection

---

## Security & Privacy Commitments

1. **No Network Access**: Apps will not request network permissions
2. **Local Storage Only**: All data stays on device
3. **No Telemetry**: No usage analytics or tracking
4. **Transparent Data**: Users can export/delete all data
5. **No Account Required**: No sign-up, no login
6. **Data Portability**: Export in JSON format

---

## File Structure (Per Platform)

### iOS
```
SimpleShoppingList-iOS/
├── Models/
│   ├── Department.swift
│   ├── ShoppingList.swift
│   ├── ShoppingItem.swift
│   └── CoreDataStack.swift
├── ViewModels/
│   ├── ShoppingListViewModel.swift
│   ├── DepartmentViewModel.swift
│   └── ItemViewModel.swift
├── Views/
│   ├── ListSelectionView.swift
│   ├── ShoppingView.swift
│   ├── ItemEntryView.swift
│   └── DepartmentSettingsView.swift
└── Services/
    └── DataStore.swift
```

### Android
```
simple-shopping-list-android/
├── data/
│   ├── local/
│   │   ├── database/
│   │   └── dao/
│   ├── models/
│   └── repository/
├── domain/
│   ├── models/
│   └── usecases/
├── presentation/
│   ├── viewmodels/
│   └── screens/
│       ├── lists/
│       ├── shopping/
│       └── departments/
└── utils/
```

### Web
```
simple-shopping-list-web/
├── src/
│   ├── components/
│   │   ├── lists/
│   │   ├── items/
│   │   └── departments/
│   ├── hooks/
│   ├── contexts/
│   │   └── ShoppingContext.tsx
│   ├── services/
│   │   └── database.ts
│   ├── types/
│   └── utils/
├── public/
└── index.html
```

---

## Development Phases

### Phase 1: Foundation (Weeks 1-2)
- Set up project structure for all 3 platforms
- Implement data models and local storage
- Default departments setup

### Phase 2: Core List Functionality (Weeks 3-4)
- Shopping list CRUD
- Item add/edit/delete
- Basic department assignment

### Phase 3: Shopping Mode (Weeks 5-6)
- Grouped view by department
- Check-off functionality
- List management UI

### Phase 4: Smart Features (Weeks 7-8)
- Recent items tracking
- Autocomplete
- Quick-add features

### Phase 5: Polish & UX (Weeks 9-10)
- Animations and transitions
- Swipe gestures
- Drag-and-drop reordering
- Dark mode

### Phase 6: Testing & Release (Weeks 11-12)
- Cross-platform testing
- Performance optimization
- Documentation
- Privacy audit

---

## Testing Strategy

- **Unit Tests**: Business logic and data operations
- **Integration Tests**: Database operations
- **UI Tests**: Core user flows (add item, check off, delete)
- **Privacy Testing**: Verify no network calls
- **Usability Testing**: Test with real shopping scenarios

---

## Dependencies (Minimal)

### iOS
- SwiftUI (built-in)
- Core Data (built-in)

### Android
- Jetpack Compose
- Room Database
- Kotlin Coroutines
- Material 3 Components

### Web
- React 18
- TypeScript
- Dexie.js (IndexedDB wrapper)
- Tailwind CSS
- shadcn/ui components

**Note**: All dependencies must be vetted for privacy (no telemetry)

---

## Distribution

- **iOS**: TestFlight → App Store
- **Android**: APK for sideloading → F-Droid → Google Play
- **Web**: Self-hosted static files, GitHub Pages option

---

## Version 1.0 Success Criteria

1. Create and manage multiple shopping lists
2. Add items with department categorization
3. Check off items during shopping
4. View items organized by department
5. Quick-add from recent items
6. Smooth animations and intuitive UX
7. Zero network requests
8. Works offline (web app via service worker)
9. Data persists across app restarts
10. Fast performance with 500+ items

---

## Accessibility Considerations

- **VoiceOver/TalkBack Support**: All interactive elements labeled
- **Dynamic Type**: Text scales with system font size
- **High Contrast Mode**: Support for accessibility settings
- **Haptic Feedback**: Confirmation for check-off actions
- **Keyboard Navigation**: Full keyboard support on web

---

## Performance Targets

- **App Launch**: < 2 seconds to usable state
- **Item Add**: < 100ms from tap to visible in list
- **List Load**: < 500ms for lists with 100+ items
- **Search**: < 200ms for autocomplete results
- **Database Operations**: < 50ms for single record operations
