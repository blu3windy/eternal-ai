import { notarize } from '@electron/notarize';
import { build } from '../package.json';

export default async function notarizing(context) {
   const { electronPlatformName, appOutDir } = context;
   if (electronPlatformName !== 'darwin') {
      return;
   }

   const appName = context.packager.appInfo.productFilename;
   const appPath = `${appOutDir}/${appName}.app`;

   console.log(`Notarizing ${appPath} with Apple ID...`);

   try {
      await notarize({
         appBundleId: build.appId,
         appPath: appPath,
         appleId: process.env.APPLE_ID,
         appleIdPassword: process.env.APPLE_ID_PASSWORD,
         teamId: process.env.APPLE_TEAM_ID
      });
   } catch (error) {
      console.error('Notarization failed:', error);
      throw error;
   }

   console.log('Notarization completed successfully');
}