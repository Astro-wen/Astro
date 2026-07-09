// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

// GitHub Pages：项目站点，仓库名 Astro
// 站点地址：https://astro-wen.github.io/Astro/
// 注意：base 必须与仓库名一致，否则线上 CSS/图片会 404，页面变成无样式白板

export default defineConfig({
  site: 'https://astro-wen.github.io',
  base: '/Astro/',
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

