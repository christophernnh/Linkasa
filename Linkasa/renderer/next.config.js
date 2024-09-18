/** @type {import('next').NextConfig} */
module.exports = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if(!isServer){
      config.resolve.fallback = {
        fs: false,
        path: false,
        tls: false,
        net: false,
        dns: false,
        child_process: false
      };
    }
    return config
  },
}
