import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
const version = packageJson.version;

// Read the ZIP file
const zipPath = path.join(__dirname, `../release/${version}/Vibe-${version}-mac.zip`);
const zipBuffer = fs.readFileSync(zipPath);

// Calculate SHA512
const sha512 = crypto.createHash('sha512').update(zipBuffer).digest('base64');

// Create update info
const updateInfo = {
   version: version,
   files: [
      {
         url: `Vibe-${version}-mac.zip`,
         sha512: sha512,
         size: zipBuffer.length
      }
   ],
   path: `Vibe-${version}-mac.zip`,
   sha512: sha512,
   releaseDate: new Date().toISOString()
};

// Write to latest-mac.yml
const yamlPath = path.join(__dirname, '../release/latest-mac.yml');
fs.writeFileSync(yamlPath, JSON.stringify(updateInfo, null, 2));

console.log('Generated latest-mac.yml successfully'); 