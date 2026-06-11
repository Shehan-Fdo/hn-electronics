const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) walkDir(dirPath, callback);
    else callback(path.join(dir, f));
  });
}

walkDir('./', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    if (filePath.includes('node_modules') || filePath.includes('.next')) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace imports
    content = content.replace(/types\/woocommerce/g, 'types/api');
    content = content.replace(/lib\/woocommerce/g, 'lib/api');
    
    // Replace types
    content = content.replace(/\bWCProduct\b/g, 'Product');
    content = content.replace(/\bWCCategory\b/g, 'Category');
    content = content.replace(/\bWCImage\b/g, 'string');
    
    // Replace property access
    content = content.replace(/\.regular_price/g, '.price');
    content = content.replace(/\.images\[0\]\?\.src/g, '.images[0]');
    content = content.replace(/\.images\[0\]\.src/g, '.images[0]');
    
    // Handle category id vs slug mapping if needed, let's leave .id alone for now and fix manually
    
    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Updated ' + filePath);
    }
  }
});
