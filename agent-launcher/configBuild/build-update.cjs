const { execSync } = require("child_process");
const fs = require("fs");

// 🕒 Generate timestamped version (YYYYMMDD-HHMM)
const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const version = `1.1.1`;

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const versionSuffix = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

console.log(`🚀 Building version: ${version}...`);


pkg.version = `${version}-${versionSuffix}`;

// ✅ Update `package.json` with the new version
const packageJsonPath = "./package.json";
fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));
console.log(`✅ Updated package.json version to: ${pkg.version}`);

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