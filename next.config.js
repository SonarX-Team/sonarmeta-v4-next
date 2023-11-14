/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedForwardedHosts: ["www.sonarmeta.com", "en.sonarmeta.com", "localhost"],
      allowedOrigins: ["www.sonarmeta.com", "en.sonarmeta.com", "localhost"],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sonarmeta.oss-cn-shenzhen.aliyuncs.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.sonarmeta.com",
      },
    ],
  },
};

module.exports = nextConfig;
