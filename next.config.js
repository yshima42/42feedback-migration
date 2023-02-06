/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  staticPageGenerationTimeout: 600,
};

// importを使うとエラー。公式通りにrequireを使う
// https://github.com/ricokahler/next-plugin-preval#add-to-nextconfigjs
const createNextPluginPreval = require("next-plugin-preval/config");
const withNextPluginPreval = createNextPluginPreval();

module.exports = nextConfig;
module.exports = withNextPluginPreval(nextConfig);
