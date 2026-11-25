// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

// GitHub Pages：项目站点，仓库名 Astro
// 站点地址：https://astro-wen.github.io/Astro/
// 注意：base 必须与仓库名一致，否则线上 CSS/图片会 404，页面变成无样式白板

const BASE = '/Astro';

// 文章里的图片写的是 /media/xxx 这样的根路径。站点挂在 /Astro/ 下，
// 不补上前缀图片就是 404。这里在生成 HTML 时统一补上。
function rehypeBaseImages() {
  const walk = (node) => {
    if (node.type === 'element' && node.tagName === 'img') {
      const src = node.properties?.src;
      if (typeof src === 'string' && src.startsWith('/') && !src.startsWith('//') && !src.startsWith(`${BASE}/`)) {
        node.properties.src = `${BASE}${src}`;
      }
    }
    (node.children ?? []).forEach(walk);
  };
  return (tree) => walk(tree);
}

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
    rehypePlugins: [rehypeBaseImages],
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});

