// 91 symbols, 91 cards, 10 symbols on each cards
// generateDeck: 
// Note: We store icon identifiers (not paths) so themes can be applied dynamically

// export const allIcons = [
//   "a","b","c","d","e","f","g","h","i","j","k","l","m",
//   "n","o","p","q","r","s","t","u","v","w","x","y","z",
//   "1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20",
//   "21","22","23","24","25","26","27","28","29","30",
//   "31","32","33","34","35","36","37","38","39","40",
//   "41","42","43","44","45","46","47","48","49","50",
//   "51","52","53","54","55","56","57","58","59","60",
//   "61","62","63","64","65","66", "67", "68", "69", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "100", "101", "102", "103", "104", "105", "106", "107"

// ];



// export function generateDeck(n = 12) {
//   const deck = [];

//   // First set of n cards
//   for (let i = 0; i < n; i++) {
//     const card = [iconMap[allIcons[0]]]; // all contain S0
//     for (let j = 0; j < n - 1; j++) {
//       card.push(iconMap[allIcons[1 + i * (n - 1) + j]]);
//     }
//     deck.push(card);
//   }
//   // Remaining (n - 1) * (n - 1) cards
//   for (let a = 0; a < n - 1; a++) {
//     for (let b = 0; b < n - 1; b++) {
//       const card = [iconMap[allIcons[1 + a]]];
//       for (let k = 0; k < n - 1; k++) {
//         const symbolIndex = 1 + (n - 1) + k * (n - 1) + ((a * k + b) % (n - 1));
//         card.push(iconMap[allIcons[symbolIndex]]);
//       }
//       deck.push(card);
//     }
//   }

//   return deck;
// }



export const allIcons = [
  "1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20",
  "21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40",
  "41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57"
];



export function generateDeck(n = 8) {
  const deck = [];

  // First set of n cards
  for (let i = 0; i < n; i++) {
    const card = [allIcons[0]]; // all contain S0 - store identifier, not path
    for (let j = 0; j < n - 1; j++) {
      card.push(allIcons[1 + i * (n - 1) + j]);
    }
    deck.push(card);
  }
  // Remaining (n - 1) * (n - 1) cards
  for (let a = 0; a < n - 1; a++) {
    for (let b = 0; b < n - 1; b++) {
      const card = [allIcons[1 + a]];
      for (let k = 0; k < n - 1; k++) {
        const symbolIndex = 1 + (n - 1) + k * (n - 1) + ((a * k + b) % (n - 1));
        card.push(allIcons[symbolIndex]);
      }
      deck.push(card);
    }
  }

  return deck;
}
