/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['crimson-odd-woodpecker-368.mypinata.cloud',"via.placeholder.com"],
  },
  reactStrictMode: true,
  env:{
    NEXT_PUBLIC_CONTRACT_ADDRESS:process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  }
};

module.exports = nextConfig;
