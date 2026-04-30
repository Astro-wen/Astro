// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

// GitHub Pages：lingangulguli/AstroW-Website
// 站点地址：https://lingangulguli.github.io/AstroW-Website/
// 注意：dev 模式下不设 base，避免 http://localhost 根路径 404；
//       只有 build（部署到 GitHub Pages）时才加 /AstroW-Website 前缀。
const isBuild = process.argv.includes('build');

export default defineConfig({
  site: 'https://lingangulguli.github.io',
  base: isBuild ? '/AstroW-Website' : '/',
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

