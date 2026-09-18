// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

// GitHub Pages：自定义域名，站点在根路径提供服务
// 站点地址：https://aaron.xn--0iv.gay/ （即 aaron.是.gay）
// 注意：site 必须写 Punycode；public/CNAME 必须存在，Actions 部署不会自动生成它

export default defineConfig({
  site: 'https://aaron.xn--0iv.gay',
  trailingSlash: 'ignore',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/drafts/'),
    }),
    tailwind({
      applyBaseStyles: false, // 我们在 global.css 里手动 @tailwind，便于加自定义 base
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});

