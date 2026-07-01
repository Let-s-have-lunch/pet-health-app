const path = require("node:path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(path.resolve("."));

config.resolver.unstable_enablePackageExports = false;

module.exports = withNativeWind(config, {
    input: "./styles/global.css",
});
