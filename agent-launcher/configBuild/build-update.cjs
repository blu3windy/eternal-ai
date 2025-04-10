const fs = require('fs');
const { execSync } = require('child_process');
const semver = require('semver');
const yaml = require('js-yaml');
const path = require('path');

const pkgPath = './package.json';
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
const oldVersion = pkg.version;
const newVersion = semver.inc(oldVersion, 'patch'); // bump patch: 1.1.3 -> 1.1.4

if (!newVersion) {
  console.error('❌ Failed to bump version');
  process.exit(1);
}

// ✍️ Update package.json version
pkg.version = newVersion;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
console.log(`🔧 Updated version: ${oldVersion} → ${newVersion}`);

// ✅ Run TypeScript & Vite build
console.log("🏗️ Running TypeScript & Vite build...");
execSync("npx vite build", { stdio: "inherit" });

// ✅ Build Electron app with electron-builder
console.log("📦 Building macOS Universal app...");
execSync(
  `npx electron-builder --mac --universal --publish always`,
  { stdio: "inherit" }
);

// ✅ Notarize app (if enabled)
const notarizePath = `release/${pkg.version}/Vibe-${pkg.version}-universal.dmg`;
console.log(`📝 Notarizing: ${notarizePath}...`);
execSync(
  `xcrun notarytool submit "${notarizePath}" --keychain-profile "notarytool-profile" --wait`,
  { stdio: "inherit" }
);

console.log("✅ Build & notarization complete!"); 

const GITHUB_BASE = 'https://github.com/eternalai-org/eternal-ai/releases/download'; 

const ymlPath = `release/${pkg.version}/latest-mac.yml`; // input
const outputPath = '/Users/wilfred23/Documents/dapps/electron-update-server/updates/latest-mac.yml'; // output

function transformUrls(data, version) {
  const baseUrl = `${GITHUB_BASE}/v${version}`;

  // Update files[].url
  data.files = data.files.map(file => ({
    ...file,
    url: `${baseUrl}/${file.url}`
  }));

  // Update path
  data.path = `${baseUrl}/${path.basename(data.path)}`;

  return data;
}

try {
  const content = fs.readFileSync(ymlPath, 'utf8');
  const data = yaml.load(content);

  const version = data.version;
  const transformed = transformUrls(data, version);

  const newYml = yaml.dump(transformed);
  fs.writeFileSync(outputPath, newYml, 'utf8');

  console.log(`✅ updated latest-mac.yml → ${outputPath}`);
} catch (err) {
  console.error('❌ Failed to process latest-mac.yml', err);
}