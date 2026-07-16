/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'ui-avatars.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'JADEL CLINIC',
    NEXT_PUBLIC_APP_TAGLINE: 'Healthcare Powered by AI',
    NEXT_PUBLIC_APP_LOCATION: 'Lagos, Nigeria',
    NEXT_PUBLIC_PHONE: '+234 704 053 4519',
    NEXT_PUBLIC_EMERGENCY: '+234 704 053 4519',
    NEXT_PUBLIC_EMAIL: 'jadelclinic@gmail.com',
    NEXT_PUBLIC_WEBSITE: 'www.jadelclinic.com',
  },
}

module.exports = nextConfig
