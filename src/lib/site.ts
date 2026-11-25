/**
 * 站点全局常量 —— 单一数据源
 */
export const SITE = {
  name: 'Aaron Wen',
  nameZh: '温思源',
  nameAlias: 'AstroW',
  role: '产品经理，数据工程师 / 分析师',
  roleEn: 'Product Manager, Data Engineer / Analyst',
  url: 'https://astro-wen.github.io',
  description: 'UCLA 在读 AI 产品经理，聚焦 AI 原生产品、游戏与数据驱动增长，具备 TikTok、腾讯 AI 产品实习与 AI 硬件创业经历。',
  author: 'Aaron Wen',
  location: 'Los Angeles / San Jose',
  locale: 'zh-CN',
  social: {
    github: '',
    x: '',
    linkedin: 'https://www.linkedin.com/in/aaron-wen-60505b2a3/',
    email: 'mailto:linmengfdm@gmail.com',
    instagram: 'https://www.instagram.com/linmengfdm/',
    // Steam 个人主页地址，填上后页脚和关于页会自动出现
    steam: 'https://steamcommunity.com/profiles/76561199047942941/',
  },
  nav: [
    { label: '作品', href: '/work' },
    { label: '经历', href: '/experience' },
    { label: '文章', href: '/blog' },
    { label: '关于', href: '/about' },
  ],
} as const;

export type SiteConfig = typeof SITE;
