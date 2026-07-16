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
    NEXT_PUBLIC_PHONE: '+234 800 123 4567',
    NEXT_PUBLIC_EMERGENCY: '+234 800 999 1122',
    NEXT_PUBLIC_EMAIL: 'appointments@jadelclinic.demo',
    NEXT_PUBLIC_WEBSITE: 'www.jadelclinic.demo',
  },
}

module.exports = nextConfig
