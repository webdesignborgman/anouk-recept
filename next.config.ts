/** @type {import('next').NextConfig} */
const nextConfig = {
  dev: {
    allowedOrigins: [
      'http://192.168.2.32:3000',    // Jouw lokale IP
      'http://localhost:3000',       // Voor je eigen machine
    ],
  },
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
};

module.exports = nextConfig;
