# 📝 Simple Shopping List

**A privacy-first shopping list app that organizes items by department so you can shop efficiently without backtracking.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status: Active Development](https://img.shields.io/badge/Status-Active%20Development-green.svg)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[🌐 Try Demo](http://localhost:5174) • [📖 Documentation](#documentation) • [🤝 Contributing](CONTRIBUTING.md) • [💬 Community](#community)

---

## ✨ Features

### Core Functionality
- ✅ **Create multiple shopping lists** - Organize shopping trips separately
- ✅ **Department-based organization** - Items grouped by store layout (Produce, Dairy, Meat, etc.)
- ✅ **Check off items** - Track progress with visual feedback
- ✅ **Progress tracking** - See how many items you've completed
- ✅ **Recent items** - Quick-add frequently bought items
- ✅ **Offline-first** - Works completely without internet

### Privacy-First Design
- 🔒 **100% local storage** - All data stays on your device
- 🚫 **No tracking** - Zero analytics or telemetry
- 🔐 **No account required** - Just download and use
- 📴 **Offline capable** - No internet connection needed
- 🌐 **No external APIs** - Complete data sovereignty

### Cross-Platform
- 📱 **Mobile-optimized** - Responsive design for phones
- 💻 **Desktop-friendly** - Works great on larger screens
- 🌓 **Dark mode** - Easy on the eyes (auto-detects system preference)

---

## 🚀 Quick Start

### Web App (Try Now!)

The web version works in any modern browser:

```bash
cd web
npm install
npm run dev
```

Then open **http://localhost:5174** in your browser.

### Mobile Apps (Coming Soon)

- 📱 **iOS** - Native SwiftUI app (planned)
- 🤖 **Android** - Native Kotlin/Compose app (planned)

---

## 🎯 Why Simple Shopping List?

### The Problem
Most shopping list apps either:
- 📊 Track your data and sell it to advertisers
- 💰 Require expensive subscriptions
- 🌐 Need constant internet connection
- 🔐 Require accounts and cloud storage
- 🎨 Are cluttered with features you don't need

### Our Solution
Simple Shopping List is different:
- ✅ **Privacy-first** - Your grocery list is nobody's business but yours
- ✅ **Free & open-source** - No hidden costs or premium tiers
- ✅ **Offline-capable** - Works in airplane mode
- ✅ **No account needed** - Download and start using immediately
- ✅ **Clean & focused** - Does one thing well

---

## 📸 Screenshots

### List Selection
Create and manage multiple shopping lists for different trips or purposes.

### Shopping View
Items organized by department - shop in order through the store without backtracking!

### Add Items
Quick item entry with department assignment and recent items for faster input.

---

## 🏗️ Technology Stack

### Web App
- **React 18** + **TypeScript** - Modern, type-safe UI
- **Tailwind CSS** - Clean, responsive styling
- **Dexie.js** - IndexedDB wrapper for local storage
- **Vite** - Lightning-fast development

### iOS (Planned)
- **Swift 5.9+** + **SwiftUI** - Native iOS experience
- **Core Data** - Local SQLite storage

### Android (Planned)
- **Kotlin** + **Jetpack Compose** - Modern Android UI
- **Room Database** - Type-safe SQLite wrapper

---

## 📖 Documentation

### For Users
- **[User Guide](USER_GUIDE_FOR_LEX.md)** - Complete guide with real-world examples
- **[Demo Ready Guide](DEMO_READY.md)** - Quick demo walkthrough

### For Developers
- **[Technical Specification](TECHNICAL_SPEC.md)** - Complete architecture documentation
- **[MVP Plan](MVP_PLAN.md)** - Development roadmap and timeline
- **[Wireframes](WIREFRAMES.md)** - Detailed UI/UX specifications
- **[Visual Design Guide](VISUAL_DESIGN_GUIDE.md)** - Design system and mockups

### Feature Specifications
- **[Smart Collections](SMART_COLLECTIONS_SPEC.md)** - Reusable templates & recommendations
- **[Store Inventory](STORE_INVENTORY_SPEC.md)** - Store integration without privacy loss
- **[Community Sharing](COMMUNITY_SHARING_SPEC.md)** - Decentralized community platform

---

## 🗺️ Roadmap

### ✅ Phase 1: MVP (Completed)
- [x] List creation and management
- [x] Item management with departments
- [x] Check-off functionality
- [x] Progress tracking
- [x] Recent items
- [x] Data persistence
- [x] Responsive design
- [x] Dark mode

### 🚧 Phase 2: Smart Features (In Progress)
- [ ] Collections (reusable templates)
- [ ] Transparent recommendations
- [ ] Share lists as text
- [ ] Export/import data

### 📋 Phase 3: Store Integration
- [ ] Store profiles
- [ ] Product mapping
- [ ] Multi-store shopping
- [ ] In-store navigation
- [ ] Optional price tracking

### 🌍 Phase 4: Community
- [ ] Community collection library
- [ ] Store template sharing
- [ ] QR code sharing
- [ ] Contribution platform

### 📱 Phase 5: Native Apps
- [ ] iOS app (SwiftUI)
- [ ] Android app (Compose)
- [ ] Cross-platform sync (optional, user-controlled)

---

## 🤝 Contributing

We welcome contributions! Whether it's:
- 🐛 Bug reports
- 💡 Feature requests
- 📝 Documentation improvements
- 🎨 Design suggestions
- 💻 Code contributions

Please read our [Contributing Guide](CONTRIBUTING.md) to get started.

### Quick Contribution Steps
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 🏛️ Project Principles

### Privacy First
- **No data collection** - We don't collect, store, or transmit any user data
- **Local storage only** - All data stays on your device
- **No telemetry** - No usage tracking or analytics
- **Transparent algorithms** - All recommendation logic is visible and understandable

### User Control
- **No forced updates** - You control when to update
- **Data portability** - Export your data anytime in open formats
- **Feature toggles** - Disable any feature you don't want
- **No lock-in** - Easy migration to other apps if needed

### Open & Honest
- **Open source** - Full source code available for audit
- **Clear documentation** - No hidden behavior
- **Community-driven** - Built with user feedback
- **No dark patterns** - Straightforward, honest UX

---

## 🛡️ Privacy Guarantees

We make the following **iron-clad privacy commitments**:

1. ✅ **No network permissions** on mobile apps (except downloading the app itself)
2. ✅ **No external API calls** - Everything runs locally
3. ✅ **No user accounts** - No sign-up, no login, no tracking
4. ✅ **No analytics** - We don't know who uses the app or how
5. ✅ **No ads** - Never, ever
6. ✅ **No selling data** - We don't have any data to sell
7. ✅ **Open source** - You can verify all of the above

**Auditable**: The codebase is open source. Anyone can verify these claims.

---

## 📊 Project Status

**Current Version**: 0.1.0 (MVP)

**Platforms**:
- ✅ Web - **Active Development**
- 📋 iOS - **Planned**
- 📋 Android - **Planned**

**Recent Updates**:
- 2025-10-30: MVP web app completed and working
- 2025-10-30: Visual design system created
- 2025-10-30: Future feature specs documented

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**What this means**:
- ✅ Free to use, modify, and distribute
- ✅ Commercial use allowed
- ✅ Can be used in proprietary software
- ⚠️ No warranty provided
- ℹ️ Attribution appreciated but not required

---

## 🌟 Community

### Get Involved
- 💬 **Discussions** - Share ideas and ask questions
- 🐛 **Issues** - Report bugs or request features
- 📢 **Announcements** - Follow for updates
- 🤝 **Contributions** - Help build the app

### Community Guidelines
- Be respectful and inclusive
- Help newcomers
- Share knowledge freely
- Respect privacy
- No spam or self-promotion

---

## 🙏 Acknowledgments

Built with love for people who value:
- Privacy and data sovereignty
- Simple, focused tools
- Open source software
- Honest, transparent technology

**Special Thanks**:
- Everyone who values privacy
- The open-source community
- Early testers and contributors

---

## 📞 Contact & Support

- 🐛 **Bug Reports**: [Open an issue](../../issues)
- 💡 **Feature Requests**: [Open a discussion](../../discussions)
- 📖 **Documentation**: See [docs folder](.)
- 💬 **General Questions**: [Discussions](../../discussions)

---

## 🔗 Links

- **Live Demo**: http://localhost:5174 (when running locally)
- **Documentation**: [See above](#documentation)
- **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **License**: [MIT](LICENSE)
- **Changelog**: [CHANGELOG.md](CHANGELOG.md) (coming soon)

---

## ⭐ Star History

If you find this project useful, please consider giving it a star! It helps others discover the project.

---

**Made with ❤️ for privacy-conscious shoppers everywhere**

*Simple Shopping List - Because your grocery list is nobody's business but yours.*
