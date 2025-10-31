# Simple Shopping List - Wireframes & UI Design

## Screen Flow Overview

```
┌─────────────────┐
│  List Selection │ (Home Screen)
└────────┬────────┘
         │
         ├─→ [New List] ──→ Create List Modal
         │
         └─→ [Select List] ──┐
                              │
                    ┌─────────▼──────────┐
                    │   Shopping View    │ (Main Screen)
                    └─────────┬──────────┘
                              │
                    ├─────────┼─────────┐
                    │         │         │
            [+ Add Item]  [Settings] [Share]
                    │         │
                    ▼         ▼
            Item Entry   Department
               Modal      Settings
```

---

## Screen 1: List Selection (Home Screen)

**Purpose**: Choose which shopping list to work with

```
┌─────────────────────────────────────────┐
│  ☰  Simple Shopping List          ⚙️   │
├─────────────────────────────────────────┤
│                                         │
│  My Lists                               │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 📝 Weekly Groceries               │ │
│  │ 12 items • 3 checked              │ │
│  │ Updated 10 min ago                │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 🎉 Party Supplies                 │ │
│  │ 8 items • 0 checked               │ │
│  │ Updated 2 days ago                │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 🌮 Taco Tuesday                   │ │
│  │ 5 items • 5 checked ✓             │ │
│  │ Completed yesterday               │ │
│  └───────────────────────────────────┘ │
│                                         │
│                                         │
│                                         │
│                                         │
│                 [+ New List]            │
└─────────────────────────────────────────┘
```

**Interactions**:
- Tap list card → Open shopping view for that list
- Swipe left on list → Delete/Archive options
- Long press → Rename list
- [+ New List] → Create list modal

---

## Screen 2: Shopping View (Main Screen)

**Purpose**: View and manage items organized by department

```
┌─────────────────────────────────────────┐
│  ← Weekly Groceries            ⋯  🔗   │
├─────────────────────────────────────────┤
│  Progress: 3 of 12 items  [▓░░░░░░░]   │
│                                         │
│  🥬 Produce (3 items)              ▼   │
│  ┌───────────────────────────────────┐ │
│  │ □ Bananas                         │ │
│  │ □ Apples                          │ │
│  │ □ Lettuce - 1 head                │ │
│  └───────────────────────────────────┘ │
│                                         │
│  🥛 Dairy & Eggs (3 items)         ▼   │
│  ┌───────────────────────────────────┐ │
│  │ ✓ Milk - 2%                       │ │
│  │ ✓ Cheddar cheese - 8oz            │ │
│  │ □ Yogurt - Greek                  │ │
│  └───────────────────────────────────┘ │
│                                         │
│  🥩 Meat & Seafood (2 items)       ▼   │
│  ┌───────────────────────────────────┐ │
│  │ ✓ Chicken breast - 2 lbs          │ │
│  │ □ Ground beef - 1 lb              │ │
│  └───────────────────────────────────┘ │
│                                         │
│  🍞 Bakery (2 items)               ▼   │
│  ┌───────────────────────────────────┐ │
│  │ □ Whole wheat bread               │ │
│  │ □ Bagels - dozen                  │ │
│  └───────────────────────────────────┘ │
│                                         │
│                                    [+]  │
└─────────────────────────────────────────┘
```

**Interactions**:
- Tap checkbox → Check/uncheck item
- Swipe right on item → Quick check
- Swipe left on item → Delete
- Tap item → Edit item modal
- Tap department header → Collapse/expand section
- [+] FAB button → Add item modal
- ⋯ menu → List settings, clear checked items, etc.
- 🔗 share → Share list as text

**States**:
- Checked items have strikethrough and gray color
- Departments show count of total and checked items
- Empty departments can be hidden (toggle in settings)

---

## Screen 3: Add/Edit Item Modal

**Purpose**: Quick item entry with department assignment

```
┌─────────────────────────────────────────┐
│  Add Item                      ✕        │
├─────────────────────────────────────────┤
│                                         │
│  Item Name                              │
│  ┌───────────────────────────────────┐ │
│  │ Bananas_                          │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Recent Items:                          │
│  [Milk] [Eggs] [Bread] [Apples]        │
│                                         │
│  Department                             │
│  ┌───────────────────────────────────┐ │
│  │ 🥬 Produce                    ▼   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Quantity (optional)                    │
│  ┌───────────────────────────────────┐ │
│  │                                   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Notes (optional)                       │
│  ┌───────────────────────────────────┐ │
│  │                                   │ │
│  └───────────────────────────────────┘ │
│                                         │
│                                         │
│          [Cancel]      [Add Item]      │
│                                         │
└─────────────────────────────────────────┘
```

**Interactions**:
- Type in item name → Autocomplete suggestions appear
- Tap recent item chip → Fill name and department
- Select department → Dropdown with all departments
- Department auto-suggested based on item name
- [Add Item] → Saves and returns to shopping view
- [Cancel] → Discard and close

---

## Screen 4: Department Settings

**Purpose**: Customize departments, reorder, add custom ones

```
┌─────────────────────────────────────────┐
│  ← Department Settings                  │
├─────────────────────────────────────────┤
│                                         │
│  Organize Your Store Layout            │
│  Drag to reorder departments            │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ ☰ 🥬 Produce                      │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ ☰ 🥛 Dairy & Eggs                 │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ ☰ 🥩 Meat & Seafood               │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ ☰ 🍞 Bakery                       │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ ☰ ❄️  Frozen Foods                 │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ ☰ 🥫 Canned Goods                 │ │
│  └───────────────────────────────────┘ │
│                                         │
│             [+ Add Department]          │
│                                         │
└─────────────────────────────────────────┘
```

**Interactions**:
- Drag ☰ handle → Reorder departments
- Tap department → Edit name, icon, color
- Swipe left → Delete custom department (defaults can't be deleted)
- [+ Add Department] → Create custom department

---

## Screen 5: Share List Modal

**Purpose**: Export list as text to share via any app

```
┌─────────────────────────────────────────┐
│  Share List                    ✕        │
├─────────────────────────────────────────┤
│                                         │
│  Weekly Groceries                       │
│  ────────────────────────────────────   │
│                                         │
│  🥬 Produce:                            │
│  □ Bananas                              │
│  □ Apples                               │
│  □ Lettuce - 1 head                     │
│                                         │
│  🥛 Dairy & Eggs:                       │
│  ✓ Milk - 2%                            │
│  ✓ Cheddar cheese - 8oz                 │
│  □ Yogurt - Greek                       │
│                                         │
│  🥩 Meat & Seafood:                     │
│  ✓ Chicken breast - 2 lbs               │
│  □ Ground beef - 1 lb                   │
│                                         │
│  🍞 Bakery:                             │
│  □ Whole wheat bread                    │
│  □ Bagels - dozen                       │
│                                         │
│                                         │
│      [Copy to Clipboard]  [Share]      │
│                                         │
└─────────────────────────────────────────┘
```

**Interactions**:
- [Copy to Clipboard] → Copies formatted text
- [Share] → Opens system share sheet (mobile) or copy (web)
- Toggle "Include checked items" option

---

## Color Palette

**Light Mode:**
- Background: #FFFFFF
- Surface: #F8F9FA
- Primary: #2563EB (Blue)
- Secondary: #10B981 (Green)
- Text Primary: #1F2937
- Text Secondary: #6B7280
- Border: #E5E7EB
- Checked Item: #9CA3AF (Gray)

**Dark Mode:**
- Background: #0F1419
- Surface: #1A1F2E
- Primary: #3B82F6 (Lighter Blue)
- Secondary: #34D399 (Lighter Green)
- Text Primary: #F9FAFB
- Text Secondary: #9CA3AF
- Border: #374151
- Checked Item: #6B7280 (Darker Gray)

---

## Typography

**Mobile:**
- Heading 1 (Screen Titles): 28px, Bold
- Heading 2 (Sections): 20px, Semibold
- Body (Items): 16px, Regular
- Caption (Metadata): 14px, Regular
- Button: 16px, Medium

**Web/Desktop:**
- Heading 1: 32px, Bold
- Heading 2: 24px, Semibold
- Body: 18px, Regular
- Caption: 15px, Regular
- Button: 18px, Medium

---

## Animations

1. **Check-off Animation**:
   - Item slides right with fade
   - Checkbox fills with bounce
   - Item text crosses out
   - Duration: 300ms

2. **Add Item**:
   - New item slides up from bottom
   - Duration: 250ms

3. **Delete Item**:
   - Swipe reveals red background
   - Item slides out and collapses
   - Duration: 300ms

4. **Collapse/Expand Department**:
   - Smooth height transition
   - Arrow rotates 180°
   - Duration: 200ms

5. **Modal Appearance**:
   - Slide up from bottom (mobile)
   - Fade in with scale (web)
   - Duration: 250ms

---

## Responsive Design

**Mobile (< 768px)**:
- Single column layout
- FAB button in bottom right
- Full-width items
- Swipe gestures enabled

**Tablet (768px - 1024px)**:
- Two column layout for list selection
- Wider modal dialogs (max 600px)
- Side-by-side department settings

**Desktop (> 1024px)**:
- Three column layout option
- Sidebar for departments/settings
- Keyboard shortcuts enabled
- Hover states on all interactive elements

---

## Accessibility

**Screen Reader Labels**:
- "Check off [item name]" for checkboxes
- "[Department name], [X] items, [Y] checked"
- "Add new item" for FAB
- "Collapse/expand [department]" for headers

**Keyboard Navigation (Web)**:
- Tab: Navigate between items
- Space: Check/uncheck focused item
- Enter: Edit focused item
- N: New item
- ?: Help/keyboard shortcuts

**Touch Targets**:
- Minimum 44x44px (iOS) / 48x48dp (Android)
- Adequate spacing between interactive elements

**Haptic Feedback**:
- Light tap on check-off
- Medium tap on delete
- Success pattern on item added

---

## MVP Feature Priority

### Phase 1: Core Functionality (Must Have)
1. ✅ Create shopping lists
2. ✅ Add items to lists
3. ✅ Assign items to departments
4. ✅ Check off items
5. ✅ View items grouped by department
6. ✅ Delete items
7. ✅ Basic department management

### Phase 2: UX Enhancements (Should Have)
8. ✅ Swipe gestures (check/delete)
9. ✅ Recent items autocomplete
10. ✅ Progress indicator
11. ✅ Collapsible departments
12. ✅ Share list as text
13. ✅ Dark mode

### Phase 3: Polish (Nice to Have)
14. ⚡ Animations and transitions
15. ⚡ Custom department creation
16. ⚡ Drag to reorder departments
17. ⚡ Edit list details
18. ⚡ Archive completed lists
19. ⚡ Bulk add items

---

## Component Hierarchy

```
App
├── ListSelectionView
│   ├── Header
│   ├── ListCard (repeatable)
│   └── NewListButton
│
├── ShoppingView
│   ├── Header
│   │   ├── BackButton
│   │   ├── ListTitle
│   │   └── ActionsMenu (share, settings)
│   ├── ProgressBar
│   ├── DepartmentSection (repeatable)
│   │   ├── DepartmentHeader
│   │   └── ItemRow (repeatable)
│   │       ├── Checkbox
│   │       ├── ItemText
│   │       └── SwipeActions
│   └── AddItemFAB
│
├── ItemEntryModal
│   ├── ItemNameInput
│   ├── RecentItemChips
│   ├── DepartmentSelector
│   ├── QuantityInput
│   ├── NotesInput
│   └── ActionButtons
│
├── DepartmentSettingsView
│   ├── Header
│   ├── DraggableDepartmentList
│   │   └── DepartmentItem (repeatable)
│   └── AddDepartmentButton
│
└── ShareModal
    ├── FormattedListPreview
    └── ShareButtons
```

---

## Data Flow

```
┌──────────────┐
│  IndexedDB   │ (Web)
│  Core Data   │ (iOS)
│  Room DB     │ (Android)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Data Store  │
│  Repository  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  ViewModel/  │
│  Context     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  UI Views/   │
│  Components  │
└──────────────┘
```

---

## Next Steps for Implementation

1. **Set up project structure** for chosen platform (Web first?)
2. **Implement data models** with local storage
3. **Build Shopping View** (main screen first)
4. **Add item entry functionality**
5. **Implement department organization**
6. **Add swipe gestures and interactions**
7. **Polish animations and transitions**
8. **Cross-platform testing**

Ready to start building? Which platform should we tackle first?
- **Web** (fastest to prototype and test)
- **iOS** (if you want native mobile experience first)
- **Android** (native mobile alternative)
