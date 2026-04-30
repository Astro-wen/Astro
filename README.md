# Personal Site

基于 **Astro + TypeScript + Tailwind CSS + MDX** 搭建的个人网站，静态部署到 **GitHub Pages**。

- ⚡ 默认零 JS，首屏极快
- 📝 Markdown / MDX 写作，Content Collections 类型安全
- 🧱 组件化 Hero / Timeline / Blog / Projects
- 📡 内置 RSS 与 Sitemap
- 🚀 GitHub Actions 自动构建部署

---

## 快速开始

### 环境要求

- Node.js ≥ 20（见 `.nvmrc`）
- 推荐使用 [pnpm](https://pnpm.io)

### 本地开发

```bash
# 安装依赖（推荐 pnpm）
pnpm install

# 启动开发服务器
pnpm dev
# 默认访问 http://localhost:4321

# 生产构建
pnpm build

# 本地预览构建产物
pnpm preview
```

如果没装 pnpm：

```bash
npm install -g pnpm
```

也可以用 `npm` 或 `yarn`，但 `pnpm` 更快、占用更小。

---

## 项目结构

```text
.
├── .github/workflows/deploy.yml   # GitHub Pages 自动部署
├── public/                        # 静态资源（favicon、OG 图）
├── src/
│   ├── assets/                    # 经 Astro 处理的图片
│   ├── components/                # Astro 组件
│   ├── content/                   # 内容集合
│   │   ├── config.ts              # ⭐ 内容 Schema 定义（Zod）
│   │   ├── blog/                  # 博客文章（.md / .mdx）
│   │   ├── projects/              # 项目条目
│   │   └── timeline/              # 教育/工作经历
│   ├── layouts/                   # 布局（BaseLayout / PostLayout）
│   ├── lib/site.ts                # ⭐ 全站常量（姓名、URL、社交链接）
│   ├── pages/                     # 路由（基于文件系统）
│   └── styles/global.css          # Tailwind + 全局样式
├── astro.config.mjs               # ⭐ Astro 配置（site/base/集成）
├── tailwind.config.mjs            # ⭐ Tailwind token（Figma 阶段在此替换）
└── package.json
```

⭐ 标记的文件是你最常需要修改的地方。

---

## 日常维护

### 1. 修改个人信息

编辑 `src/lib/site.ts`：

```ts
export const SITE = {
  name: '你的名字',
  url: 'https://你的用户名.github.io',
  description: '一句话自我介绍',
  author: '你的名字',
  social: {
    github: 'https://github.com/你的用户名',
    x: 'https://x.com/你的用户名',
    email: 'mailto:you@example.com',
  },
  // ...
};
```

### 2. 新增一篇文章

在 `src/content/blog/` 下新建一个 `.md` 或 `.mdx` 文件：

```markdown
---
title: '文章标题'
date: 2026-05-01
summary: '用一两句话概括这篇文章讲了什么，会显示在列表里。'
tags: ['tag1', 'tag2']
draft: false
---

正文内容...
```

- 文件名即 URL slug（建议用英文短横线）：`my-post.md` → `/blog/my-post`
- `draft: true` 的文章会被列表、RSS、sitemap 排除
- 支持 Markdown 和 MDX（MDX 可嵌入组件）

### 3. 新增一个项目

在 `src/content/projects/` 下新建一个 `.md`：

```markdown
---
name: '项目名'
summary: '一句话说明'
stack: ['TypeScript', 'React']
url: 'https://live-site.com'
repo: 'https://github.com/xxx/xxx'
order: 1           # 数字越小越靠前
featured: true     # 首页是否展示
---

项目详细介绍……
```

### 4. 新增一条 Timeline

在 `src/content/timeline/` 下新建一个 `.md`：

```markdown
---
kind: 'work'          # 'work' 或 'education'
org: '公司/学校名'
role: '职位/学位'
start: 2024-03-01
end: 2026-03-01       # 在职/在读可不填
location: 'Remote'
tags: ['TypeScript']
---

详细描述（可选，当前页面未展示，但数据保留供后续扩展）
```

### 5. 更新 Now 页

直接编辑 `src/pages/now.astro`，修改文件顶部的 `lastUpdated` 日期与正文内容。

---

## 部署到 GitHub Pages

### 一、修改 `astro.config.mjs` 中的 `site` 和 `base`

#### 情况 A：仓库名是 `<你的用户名>.github.io`（用户站点）

```js
export default defineConfig({
  site: 'https://你的用户名.github.io',
  base: '/',
  // ...
});
```

#### 情况 B：仓库名是其他任意名字（项目站点，如 `personal-site`）

```js
export default defineConfig({
  site: 'https://你的用户名.github.io',
  base: '/personal-site',   // ⚠️ 必须和仓库名一致
  // ...
});
```

同时把 `src/lib/site.ts` 中的 `url` 改为 `https://你的用户名.github.io/personal-site`。

### 二、推送代码

```bash
git init
git add .
git commit -m "init personal site"
git branch -M main
git remote add origin git@github.com:你的用户名/仓库名.git
git push -u origin main
```

### 三、在 GitHub 启用 Pages

1. 打开仓库 → **Settings** → 左侧 **Pages**
2. **Source** 选择 **GitHub Actions**（⚠️ 不是 "Deploy from a branch"）
3. 回到仓库 Actions 页，看到 `Deploy to GitHub Pages` 工作流已运行
4. 构建完成后，访问 `https://你的用户名.github.io/`（或带子路径）

### 四、自定义域名（可选）

在 `public/` 下新建 `CNAME` 文件，内容为你的域名（如 `blog.example.com`），然后在域名 DNS 加 CNAME 记录指向 `你的用户名.github.io`。

---

## RSS & Sitemap

- RSS：`/rss.xml` —— 自动包含所有非 draft 文章
- Sitemap：`/sitemap-index.xml` —— 由 `@astrojs/sitemap` 生成

---

## Figma 视觉精修（第二阶段）

当前视觉是结构化占位。等你从 Figma Community 选好模版后，参考 [`FIGMA-HANDOFF.md`](./FIGMA-HANDOFF.md) 按步骤进行视觉替换。

---

## License

MIT
