const { execSync } = require("child_process");
const fs = require("fs");


const packageJsonPath = "./package.json";
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

let [major, minor, patch] = pkg.version.split('.').map(Number);

patch++;
if (patch >= 100) {
  patch = 0;
  minor++;
}

pkg.version = `${major}.${minor}.${patch}`;

console.log(`🚀 Building version: ${pkg.version}...`);



// ✅ Update `package.json` with the new version

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