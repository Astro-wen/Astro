import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().max(280),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    summary: z.string(),
    stack: z.array(z.string()).default([]),
    cover: z.string().optional(),
    url: z.string().url().optional(),
    repo: z.string().url().optional(),
    order: z.number().default(0),
    featured: z.boolean().default(false),
  }),
});

const timeline = defineCollection({
  type: 'content',
  schema: z.object({
    kind: z.enum(['education', 'work']),
    org: z.string(),               // 公司/学校显示名（fallback 用，中/英任一皆可）
    orgShort: z.string().optional(), // 左侧大号文字 Logo（如 TIKTOK / TENCENT / UCLA）
    orgZh: z.string().optional(),    // 中文模式显示名（如 "加州大学洛杉矶分校"）
    orgEn: z.string().optional(),    // 英文模式显示名（如 "University of California, Los Angeles"）
    logo: z.string().optional(),     // Logo 图片路径（相对 public/，如 "/logos/tiktok.svg"），缺省用首字母色块
    tint: z.string().optional(),     // Logo 底色 hint（如 "#25F4EE"），缺省用中性深灰
    url: z.string().url().optional(),// 外链（整卡可点击跳转，如学校主页 / 公司主页）
    role: z.string(),                // 职位 / 学位（中文模式显示）
    roleEn: z.string().optional(),   // 英文职位 / 学位（英文模式显示）
    team: z.string().optional(),     // 所在团队 / 部门（中文模式）
    teamEn: z.string().optional(),   // 英文团队 / 部门
    start: z.coerce.date(),
    end: z.coerce.date().optional(), // 为空表示至今
    location: z.string().optional(), // 英文地点（fallback / 英文模式）
    locationZh: z.string().optional(),// 中文地点（如 "美国 洛杉矶"）
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    current: z.boolean().default(false), // 是否为当前进行中（用于右上角状态徽标）
    defaultOpen: z.boolean().optional(), // 折叠卡片是否默认展开（留空由渲染层决定）
  }),
});

export const collections = { blog, projects, timeline };
