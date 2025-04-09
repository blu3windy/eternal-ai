const { execSync } = require("child_process");
const fs = require("fs");

// 🕒 Generate timestamped version (YYYYMMDD-HHMM)
const now = new Date();
const timestamp = now.toISOString().replace(/[-T:]/g, "").slice(0, 13); // "YYYYMMDD-HHMM"
const version = `1.1.0-${timestamp}`;

console.log(`🚀 Building version: ${version}...`);

// ✅ Update `package.json` with the new version
const packageJsonPath = "./package.json";
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
packageJson.version = version;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log(`✅ Updated package.json version to: ${version}`);

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
const notarizePath = `release/${version}/Vibe-${version}-universal.dmg`;
console.log(`📝 Notarizing: ${notarizePath}...`);
execSync(
  `xcrun notarytool submit "${notarizePath}" --keychain-profile "notarytool-profile" --wait`,
  { stdio: "inherit" }
);
console.log(`📝 Move to release: ${notarizePath}...`);
execSync(
  `cp -R release/${version}/latest-mac.yml ~/Documents/dapps/electron-update-server/updates/latest-mac.yml`,
  { stdio: "inherit" }
);
execSync(
  `cd ~/Documents/dapps/electron-update-server && git add . && git commit -m "Update latest-mac.yml" && git push`,
  { stdio: "inherit" }
);

console.log("✅ Build & notarization complete!"); 