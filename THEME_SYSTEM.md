# Theme System Documentation

## Overview
The Spot It game now has a global theme system that applies consistently across all pages, including during gameplay.

## Features

### 🎨 Global Theme Management
- **ThemeContext** (`src/context/ThemeContext.js`): React Context API manages theme state globally
- **Theme Persistence**: Selected theme is saved to `localStorage` and persists across sessions
- **Real-time Updates**: Theme changes apply instantly to all components

### 🎭 Available Themes
1. **Default (🎯)**: Purple/violet gradients (#667eea to #764ba2)
2. **Halloween (🎃)**: Orange to dark purple (#ff6b35 to #4a1c40) with dark card
3. **Christmas (🎄)**: Red to green (#c94b4b to #165b33) with gold accents

### 🧩 Components

#### ThemeProvider
Wraps the entire app in `src/App.js`:
```javascript
<ThemeProvider>
  <AppContent />
</ThemeProvider>
```

#### useTheme Hook
Access theme anywhere in the app:
```javascript
const { theme, setTheme, currentTheme, themes } = useTheme();
```

#### ThemeSelector Component
- Floating theme switcher displayed on all game pages
- Located at top-left corner
- Shows emoji icons for each theme
- Active theme is highlighted

### 📄 Themed Pages
All pages now use the global theme:
- ✅ Account/Welcome page
- ✅ Lobby (waiting for host)
- ✅ Host view during game
- ✅ Player view during game
- ✅ Winner/Leaderboard screen

### 🎯 "SPOT IT" Badge
A prominent badge displays between the emoji and subtitle:
- Gradient background matching the current theme
- Bold, uppercase text with letter spacing
- Adds visual hierarchy and branding

## Theme Properties
Each theme includes:
- `background`: Gradient for page background
- `cardBg`: Card/container background color
- `primaryColor`: Main brand color
- `secondaryColor`: Secondary brand color
- `accentColor`: Highlight/accent color
- `textColor`: Primary text color
- `lightText`: Secondary text color
- `emoji`: Theme emoji icon
- `name`: Display name

## Usage Example
```javascript
import { useTheme } from './context/ThemeContext';

function MyComponent() {
  const { currentTheme } = useTheme();
  
  return (
    <div style={{ 
      background: currentTheme.background,
      color: currentTheme.textColor 
    }}>
      <h1>Hello!</h1>
    </div>
  );
}
```

## Benefits
- 🎨 Consistent visual experience throughout the game
- 🔄 Easy to add new themes
- 💾 Theme preference remembered
- 🎮 Players can switch themes during gameplay
- 🎯 Enhanced branding with "SPOT IT" badge
