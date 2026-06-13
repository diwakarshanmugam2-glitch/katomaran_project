const fs = require('fs');
const path = require('path');

const directories = [
  path.join(__dirname, 'src', 'pages'),
  path.join(__dirname, 'src', 'components')
];

const replacements = [
  { regex: /text-white/g, replacement: 'text-slate-800' },
  { regex: /text-gray-400/g, replacement: 'text-slate-500' },
  { regex: /text-gray-300/g, replacement: 'text-slate-600' },
  { regex: /text-gray-500/g, replacement: 'text-slate-400' },
  { regex: /bg-white\/[0-[9\.]+/g, replacement: 'bg-slate-50' },
  { regex: /border-white\/[0-[9\.]+/g, replacement: 'border-slate-200' },
  
  // Brand colors
  { regex: /text-brand-purple/g, replacement: 'text-indigo-500' },
  { regex: /text-brand-cyan/g, replacement: 'text-blue-500' },
  { regex: /text-brand-pink/g, replacement: 'text-rose-500' },
  { regex: /text-brand-blue/g, replacement: 'text-blue-600' },
  
  { regex: /bg-brand-purple/g, replacement: 'bg-indigo-500' },
  { regex: /bg-brand-cyan/g, replacement: 'bg-blue-500' },
  { regex: /bg-brand-pink/g, replacement: 'bg-rose-500' },

  { regex: /bg-brand-purple\/10/g, replacement: 'bg-indigo-50' },
  { regex: /bg-brand-cyan\/10/g, replacement: 'bg-blue-50' },
  { regex: /bg-brand-pink\/10/g, replacement: 'bg-rose-50' },
  
  { regex: /border-brand-purple\/20/g, replacement: 'border-indigo-100' },
  { regex: /border-brand-cyan\/20/g, replacement: 'border-blue-100' },
  
  // Gradients
  { regex: /bg-gradient-to-r from-brand-purple to-brand-cyan/g, replacement: 'text-gradient' },
  { regex: /bg-gradient-to-r from-brand-cyan to-brand-blue/g, replacement: 'text-gradient' },
  
  // Dark specific elements
  { regex: /bg-bg-dark/g, replacement: 'bg-[#f8fafc]' },
  { regex: /shadow-\[0_0_[^\]]+\]/g, replacement: 'shadow-sm' }, // remove heavy glows
  
  // Fix button text contrast which became slate-800 from text-white replacement
  { regex: /className="btn-primary([^"]*?) text-slate-800"/g, replacement: 'className="btn-primary$1 text-white"' },
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      
      replacements.forEach(({ regex, replacement }) => {
        content = content.replace(regex, replacement);
      });

      // Manual fixes for button contents where text-white was blindly replaced
      content = content.replace(/btn-primary([^>]*?)>[\s\S]*?<\/button>/g, (match) => {
          return match.replace(/text-slate-800/g, 'text-white');
      });
      content = content.replace(/bg-gradient-to-tr from-blue-500 to-indigo-500([^>]*?)>[\s\S]*?<\/div>/g, (match) => {
          return match.replace(/text-slate-800/g, 'text-white');
      });

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

directories.forEach(processDirectory);
console.log('Theme conversion complete.');
