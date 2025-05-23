/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env:{
    CONTACT_ADDRESS:process.env.CONTACT_ADDRESS,
  }
};

module.exports = nextConfig;
