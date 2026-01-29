// Create a mapping for icons with theme support
// Each theme (default, halloween, christmas) has its own icon set

const createIconMap = (theme = 'default') => {
  const iconMap = {};
  
  // Add a–z icons
  for (let i = 97; i <= 122; i++) { // ASCII codes for 'a' to 'z'
    const letter = String.fromCharCode(i);
    iconMap[letter] = `/icons/${theme}/${letter}.png`;
  }
  
  // Add 1–107 icons
  for (let i = 1; i <= 107; i++) {
    iconMap[i] = `/icons/${theme}/${i}.png`;
  }
  
  return iconMap;
};

// Default export for backward compatibility
export default createIconMap('default');

// Named export for theme-aware usage
export { createIconMap };
