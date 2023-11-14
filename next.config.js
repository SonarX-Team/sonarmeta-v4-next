/** @type {import('next').NextConfig} */
const nextConfig = {
  serverActions: {
    allowedOrigins: ["https://www.sonarmeta.com", "https://en.sonarmeta.com", "http://localhost"],
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
