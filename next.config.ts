import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 性能优化配置
  compress: true, // 启用gzip压缩
  
  // 图片优化
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30天缓存
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // PWA支持准备
  experimental: {
    // optimizeCss: true, // CSS优化
  },
  
  // 外部包配置
  serverExternalPackages: [],

  // 压缩和优化
  poweredByHeader: false, // 移除 X-Powered-By 头
  
  // 重定向配置
  async redirects() {
    return [
      {
        source: '/discord',
        destination: 'https://discord.gg/E9tEAYNaqK',
        permanent: true
      }
    ];
  },

  // 静态文件缓存
  async headers() {
    return [
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400'
          }
        ]
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400'
          }
        ]
      },
      {
        source: '/(.*\\.(?:jpg|jpeg|png|webp|avif|svg|ico))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
    ];
  },
};

export default nextConfig;
