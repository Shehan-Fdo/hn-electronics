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
    
    content = content.replace(/per_page/g, 'limit');
    
    content = content.replace(/product\.id/g, 'product._id');
    content = content.replace(/item\.product\.id/g, 'item.product._id');
    content = content.replace(/category\.id/g, 'category._id');
    content = content.replace(/c\.id/g, 'c._id');
    content = content.replace(/p\.id/g, 'p._id');
    
    content = content.replace(/short_description/g, 'shortDescription');
    content = content.replace(/sale_price/g, 'price');
    content = content.replace(/product\.categories/g, 'product.categoryIds');
    content = content.replace(/product\.attributes/g, '([] as any)'); // stub out attributes
    
    // image fixes
    content = content.replace(/image\.src/g, 'image');
    content = content.replace(/image\.alt/g, 'product.name');
    content = content.replace(/images\[0\]\?\.alt/g, 'name');
    content = content.replace(/images\[0\]\.alt/g, 'name');
    content = content.replace(/images\[0\]\?\.src/g, 'images[0]');
    content = content.replace(/images\[0\]\.src/g, 'images[0]');
    
    // import fixes
    content = content.replace(/, string/g, '');
    content = content.replace(/import \{ string \} from "@\/types\/api";\n/g, '');
    
    // category count fixes (ignore counts since api doesn't return them directly here)
    content = content.replace(/category\.count/g, '0');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Updated ' + filePath);
    }
  }
});
