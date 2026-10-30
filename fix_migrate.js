const fs = require('fs');
const path = 'c:\\Users\\ramesh.bhagat\\source\\repos\\VSCode\\erp\\backend\\scripts\\migrate.js';
let content = fs.readFileSync(path, 'utf8');

// Find and remove duplicate lines at the end
const lines = content.split('\n');
const lastLines = lines.slice(-4);
console.log('Last 4 lines:', lastLines);

// Remove trailing duplicate lines if they exist
while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
  lines.pop();
}

// Check if last non-empty lines are the duplicate subscription lines
const lastNonEmpty = lines.filter(l => l.trim() !== '');
if (lastNonEmpty.length >= 3 && 
    lastNonEmpty[lastNonEmpty.length - 3].includes('subscription_start_date') &&
    lastNonEmpty[lastNonEmpty.length - 2].includes('subscription_end_date') &&
    lastNonEmpty[lastNonEmpty.length - 1].includes('subscription_duration')) {
  // Remove these 3 lines
  lines.splice(lines.length - 3, 3);
  // Also remove any empty lines before them
  while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
    lines.pop();
  }
}

fs.writeFileSync(path, lines.join('\n') + '\n', 'utf8');
console.log('Fixed migration file');
