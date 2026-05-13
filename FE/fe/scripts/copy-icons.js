const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const iconSrc = path.join(rootDir, '../../ICON');
const iconDest = path.join(rootDir, 'public/ICON');

// Ensure public directory exists
const publicDir = path.join(rootDir, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Copy ICON folder if it exists
if (fs.existsSync(iconSrc)) {
  console.log(`Copying ICON folder from ${iconSrc} to ${iconDest}`);
  copyFolderSync(iconSrc, iconDest);
  console.log('ICON folder copied successfully');
} else {
  console.log('ICON folder not found, skipping copy');
}

function copyFolderSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const items = fs.readdirSync(source);

  for (const item of items) {
    const sourcePath = path.join(source, item);
    const targetPath = path.join(target, item);

    if (fs.lstatSync(sourcePath).isDirectory()) {
      copyFolderSync(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}
