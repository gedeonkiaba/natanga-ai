// Metro (bundler React Native) dans le monorepo pnpm.
// Une seule copie de React / React Native dans l'app : les paquets du workspace
// (ex. @natanga/ui, dont le devDependency react est en 18) résolvent ces modules
// depuis l'app, sinon React plante (« Invalid hook call », deux instances).
const path = require('node:path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
const SINGLETONS = ['react', 'react-dom', 'react-native', 'react-native-web'];
const appEntry = path.join(__dirname, 'index.ts');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const isSingleton = SINGLETONS.some((m) => moduleName === m || moduleName.startsWith(`${m}/`));
  if (isSingleton && !context.originModulePath.startsWith(__dirname + path.sep)) {
    return context.resolveRequest({ ...context, originModulePath: appEntry }, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
