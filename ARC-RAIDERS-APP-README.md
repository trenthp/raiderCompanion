# Arc Raiders Loadout Helper - Application

## 🎮 Overview

A fully functional web application for Arc Raiders players to plan loadouts, track missions, and manage resources. Built with React, TypeScript, and Tailwind CSS.

## ✨ Features Implemented

### ✅ Core Features
- **Homepage** - Landing page with feature cards and recent loadouts
- **Loadout Builder** - Create and manage loadouts with drag-and-drop (in progress)
- **Mission Planner** - Browse missions by map with detailed information
- **Resource Tracker** - Track items needed for quests and upgrades
- **Hideout Progression** - View and plan hideout module upgrades
- **Skill Tree** - Plan character skill builds

### 🛠️ Technical Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom dark theme
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Icons**: Lucide React

### 📦 Project Structure
```
src/
├── components/
│   ├── common/        # Reusable UI components
│   └── layout/        # Layout components (Header, Sidebar)
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── services/          # API and storage services
├── store/             # Zustand store
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Extract the project** (if you received a .tar.gz file):
```bash
tar -xzf arc-raiders-helper.tar.gz
cd arc-raiders-helper
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start the development server**:
```bash
npm run dev
```

The application will open at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 Features Guide

### Homepage
- Quick access to all major features
- View recent loadouts
- Pro tips and helpful information

### Loadout Builder
- Create custom loadouts
- Track weight and stats
- Browse items with search and filters
- Save and share loadouts (coming soon)

### Mission Planner
- Browse missions by map
- View requirements and rewards
- See difficulty ratings
- Add missions to goals

### Resource Tracker
- Set multiple goals (quests, hideout, crafts)
- Consolidated shopping list
- Item source information
- Progress tracking

### Hideout Progression
- View available module upgrades
- See requirements and benefits
- Track completion status

### Skill Tree
- Plan character skills
- Track skill point allocation
- Save and share builds

## 🎨 Customization

### Colors
The app uses a dark theme with these primary colors (defined in `tailwind.config.js`):
- Primary: `#00d4ff` (Electric Blue)
- Secondary: `#ff9900` (Orange)
- Success: `#00ff88` (Green)
- Warning: `#ffdd00` (Yellow)
- Danger: `#ff3366` (Red)

### Adding New Features
1. Create components in `src/components/`
2. Add pages in `src/pages/`
3. Update routing in `src/App.tsx`
4. Add types in `src/types/`

## 🔧 Development Notes

### API Integration
The app is configured to fetch data from:
- **Primary**: MetaForge API (`https://metaforge.app/api/arc-raiders`)
- **Fallback**: RaidTheory GitHub (`https://github.com/RaidTheory/arcraiders-data`)

See `src/services/api.ts` for implementation details.

### State Management
- **Zustand** for app-level state (loadouts, goals, etc.)
- **React Query** for API data caching
- **LocalStorage** for persistence (see `src/services/storage.ts`)

### Type Safety
All types are defined in `src/types/`:
- `api.ts` - API response types
- `loadout.ts` - Loadout and goal types

## 🐛 Known Issues

1. **Drag and Drop**: Not fully implemented yet (placeholder UI ready)
2. **Real API Data**: Currently using mock data for some features
3. **Image Loading**: Item images may not load if not available from API

## 📝 TODO

### High Priority
- [ ] Implement full drag-and-drop for loadout builder
- [ ] Connect to real MetaForge API
- [ ] Add loadout save/load functionality
- [ ] Implement URL sharing for loadouts

### Medium Priority
- [ ] Add filters for mission planner
- [ ] Implement goal aggregation logic
- [ ] Add item comparison feature
- [ ] Create loadout templates

### Low Priority
- [ ] Add animations and transitions
- [ ] Implement dark/light theme toggle
- [ ] Add user accounts (optional)
- [ ] Create mobile app version

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Production deployment
netlify deploy --prod
```

### Manual Build
```bash
npm run build
# Upload the 'dist' folder to your hosting provider
```

## 📄 License

This project uses data from:
- **MetaForge API**: https://metaforge.app/arc-raiders
- **RaidTheory GitHub**: https://github.com/RaidTheory/arcraiders-data

Please provide attribution when using this tool.

Arc Raiders © Embark Studios AB. This is an unofficial community tool.

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 💡 Tips

1. **Performance**: The app uses React Query for caching, so API calls are minimized
2. **Mobile**: The app is responsive and works on mobile devices
3. **Offline**: Basic functionality works offline using cached data
4. **Custom Loadouts**: You can create unlimited loadouts (stored locally)

## 📞 Support

For issues or questions:
- Check the planning documents in `/outputs`
- Review the code comments
- Check the API documentation at MetaForge

## 🎯 Quick Reference

### Key Files
- `src/App.tsx` - Main application component
- `src/services/api.ts` - API service layer
- `src/store/useStore.ts` - Zustand store
- `src/types/` - TypeScript definitions

### Key Commands
- Start dev: `npm run dev`
- Build: `npm run build`
- Install deps: `npm install`

---

**Built with ❤️ for the Arc Raiders community**

*Last updated: November 2025*
