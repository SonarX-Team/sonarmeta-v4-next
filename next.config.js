/** @type {import('next').NextConfig} */
const nextConfig = {
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
