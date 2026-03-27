/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://dentalys.ai',
  generateRobotsTxt: true,
  exclude: [
    '/dashboard',
    '/dashboard/*',
    '/onboarding',
    '/onboarding/*',
    '/api/*',
  ],
}
