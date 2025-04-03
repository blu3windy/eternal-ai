const { notarize } = require("@electron/notarize");

module.exports = async function notarizing(context) {
  console.log("🔹 afterSign.cjs is running...");
  
  const { electronPlatformName, appOutDir, packager } = context;
  if (electronPlatformName !== "darwin") {
    console.log("Skipping notarization: Not a macOS build.");
    return;
  }

  const appName = packager.appInfo.productFilename;
  console.log(`🔹 App Name: ${appName}`);

  await notarize({
    appBundleId: packager.appInfo.id,
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
    teamId: process.env.APPLE_TEAM_ID
  });

  console.log("✅ Notarization complete!");
};