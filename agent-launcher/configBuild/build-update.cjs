const fs = require('fs');
const { execSync } = require('child_process');
const semver = require('semver');

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

// const GITHUB_BASE = 'https://github.com/eternalai-org/eternal-ai/releases/download'; 