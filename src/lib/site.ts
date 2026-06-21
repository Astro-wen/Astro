/**
 * 站点全局常量 —— 单一数据源
 */
export const SITE = {
  name: 'Aaron Wen',
  nameZh: '温思源',
  nameAlias: 'AstroW',
  role: '产品经理',
  roleEn: 'Product Manager',
  url: 'https://astro-wen.github.io',
  description: 'UCLA 在读产品经理，聚焦游戏产品、AI 原生应用与数据驱动增长，具备 TikTok、腾讯游戏等产品实践经历。',
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
