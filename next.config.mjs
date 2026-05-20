

import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
  './src/i18n/request.js' 
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  compiler:{
    styledComponents: true,
  },
  transpilePackages: ['styled-components'],
};

export default withNextIntl(nextConfig);