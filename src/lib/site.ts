/**
 * 站点全局常量 —— 单一数据源
 */
export const SITE = {
  name: 'Aaron Wen',
  nameZh: '温思源',
  nameAlias: 'AstroW',
  role: '产品经理',
  roleEn: 'Product Manager',
  url: 'https://example.github.io',
  description: '产品经理 · UCLA · 专注游戏、AI 原生产品与玩家增长',
  author: 'Aaron Wen',
  location: 'Los Angeles / San Jose',
  locale: 'zh-CN',
  social: {
    github: '',
    x: '',
    linkedin: 'https://www.linkedin.com/in/aaron-wen-60505b2a3/',
    email: 'mailto:linmengfdm@gmail.com',
  },
  nav: [
    { label: '经历', href: '/' },
    { label: '关于', href: '/about' },
    { label: '项目', href: '/projects' },
    { label: '文章', href: '/blog' },
  ],
} as const;

export type SiteConfig = typeof SITE;
