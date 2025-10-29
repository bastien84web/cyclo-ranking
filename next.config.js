/** @type {import('next').NextConfig} */
const nextConfig = {
  // appDir is now stable in Next.js 14, no need for experimental flag
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Autoriser tous les domaines HTTPS
      },
      {
        protocol: 'http',
        hostname: '**', // Autoriser tous les domaines HTTP (pour le développement)
      }
    ],
    // Alternative plus spécifique si vous préférez lister les domaines
    // domains: [
    //   'www.labisou.com',
    //   'example.com',
    //   'cdn.example.com'
    // ]
  }
}

module.exports = nextConfig
