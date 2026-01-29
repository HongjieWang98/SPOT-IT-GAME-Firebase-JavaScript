# Theme-Specific Icons Setup Guide

## Overview
The Spot It game now supports different icon sets for each theme (Default, Halloween, Christmas). Each theme will display its own unique set of icons during gameplay.

## Folder Structure
Icons are organized in the following structure:
```
public/icons/
├── default/       # Default theme icons
├── halloween/     # Halloween theme icons (spooky, pumpkins, ghosts, etc.)
└── christmas/     # Christmas theme icons (santa, trees, gifts, etc.)
```

## Icon Requirements

### File Naming Convention
Each theme folder should contain icons with the following names:
- **Numbered icons**: `1.png`, `2.png`, `3.png`, ... up to `57.png` (or more)
- **Letter icons** (optional): `a.png`, `b.png`, `c.png`, ... `z.png`

### Image Specifications
- **Format**: PNG (with transparency recommended)
- **Size**: Recommend 50x50px to 100x100px
- **Background**: Transparent or white
- **Style**: Clear, simple icons that are easy to distinguish

## How to Upload Icons

### Step 1: Prepare Your Icons
Organize your icons into three folders on your computer:
- `default/` - Regular/standard icons
- `halloween/` - Halloween-themed icons (🎃 pumpkins, ghosts, bats, spiders, etc.)
- `christmas/` - Christmas-themed icons (🎄 trees, santa, gifts, snowflakes, etc.)

### Step 2: Upload to the Project
Copy your icon folders to: `/Users/hongjiewang/Documents/Code/spot-it-game-1/public/icons/`

For example, using terminal:
```bash
# From your desktop or wherever your icons are
cp -r /path/to/your/default/* /Users/hongjiewang/Documents/Code/spot-it-game-1/public/icons/default/
cp -r /path/to/your/halloween/* /Users/hongjiewang/Documents/Code/spot-it-game-1/public/icons/halloween/
cp -r /path/to/your/christmas/* /Users/hongjiewang/Documents/Code/spot-it-game-1/public/icons/christmas/
```

Or simply drag and drop the files into the respective folders in VS Code.

## Theme Icon Examples

### Default Theme 🎯
Standard, colorful, general-purpose icons:
- 1.png: Apple
- 2.png: Car
- 3.png: Star
- etc.

### Halloween Theme 🎃
Spooky and fun Halloween icons:
- 1.png: Pumpkin
- 2.png: Ghost
- 3.png: Witch hat
- 4.png: Candy corn
- 5.png: Black cat
- 6.png: Spider
- 7.png: Bat
- etc.

### Christmas Theme 🎄
Festive Christmas icons:
- 1.png: Christmas tree
- 2.png: Santa Claus
- 3.png: Gift box
- 4.png: Snowflake
- 5.png: Candy cane
- 6.png: Reindeer
- 7.png: Ornament
- etc.

## How It Works

1. **Theme Selection**: Users select a theme on the welcome screen
2. **Icon Loading**: The game loads icons from the corresponding theme folder
3. **Gameplay**: All cards display icons from the selected theme
4. **Theme Switching**: Users can switch themes during gameplay using the theme selector

## Current Status

✅ **Completed**:
- Theme-aware icon system created
- Folder structure set up
- Default icons copied to `public/icons/default/`
- Code updated to use themed icons

⏳ **Pending**:
- Upload Halloween-themed icons to `public/icons/halloween/`
- Upload Christmas-themed icons to `public/icons/christmas/`

## Testing

After uploading icons, test by:
1. Starting the game with each theme
2. Verifying icons appear correctly
3. Switching themes during gameplay
4. Checking that icons match the selected theme

## Notes

- The game currently uses icons numbered 1-57 (you saw in the default folder)
- Make sure each theme has the **same number of icons** with the **same filenames**
- Icons must be named exactly as specified (case-sensitive on some systems)
- If an icon is missing, it will show as a broken image
