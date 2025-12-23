/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // {
      //   protocol: 'https',
      //   hostname: process.env.NEXT_PUBLIC_HOSTNAME,
      //   port: process.env.NEXT_PUBLIC_PORT,
      // },
      // {
      //   protocol: 'http',
      //   hostname: 'localhost',
      //   port: '3000',
      // },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

module.exports = nextConfig;
