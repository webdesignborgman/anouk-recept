/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dit veld heet "allowedDevOrigins" en staat op rootniveau!
  allowedDevOrigins: [
    "http://192.168.2.32:3000",
    "http://localhost:3000"
  ],
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
};

module.exports = nextConfig;
