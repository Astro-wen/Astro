# FIGMA HANDOFF · v3 · 米色档案纸本风

> Frontend visual tokens and design rules for the personal site.
> 设计语言：**Paper Dossier × VHS Retro Modernism** — 米色牛皮纸 + 黑色硬朗面板 + VHS 四色点缀 + 橙红编号 + 毛笔书法签名。
> 记忆点：Hero RGB 色差姓名 + 毛笔 W clip-path 揭开。

---

## 色彩 Token（全部已落到 `tailwind.config.mjs`）

### Ink · 文字栈（全部带 warm tone，不用纯黑）

| Token | Value | 用途 |
|---|---|---|
| `ink.900` | `#14110C` | 主文字、标题（近黑 + 暖棕） |
| `ink.700` | `#4A4237` | 次文字、正文、段落 |
| `ink.500` | `#8B7E65` | 辅助文字、元信息、日期 |
| `ink.300` | `#C9BFA4` | 极弱、分隔线、占位 |

### Paper · 底栈（米色牛皮纸）

| Token | Value | 用途 |
|---|---|---|
| `paper.DEFAULT` | `#F0E4CE` | 页面底色 = 米色牛皮纸 |
| `paper.card` | `#FAF4E4` | 卡片底 = 米白 |
| `paper.edge` | `#E6D9BE` | 深一档米色、悬停/描边 |

### Brand · 主强调色（孤星橙红）

| Token | Value | 用途 |
|---|---|---|
| `brand.DEFAULT` | `#FF5A3C` | 编号胶条、CTA、链接、当前状态 |
| `brand.hover` | `#E84828` | 链接 hover |
| `brand.dim` | `#B33B26` | 默认下划线、静态标记 |

### VHS · 四色装饰（节制使用）

| Token | Value | 唯一用途 |
|---|---|---|
| `vhs.cyan` | `#2BB3A3` | Hero 背景竖带 / Project 索引（idx %4 == 0） / 教育链接 hover |
| `vhs.yellow` | `#F4C53D` | Hero 背景竖带 / Project 索引（idx %4 == 1） |
| `vhs.blue` | `#3A7BD5` | Hero 背景竖带 / Project 索引（idx %4 == 2） / 经历链接 hover |
| `vhs.red` | `#E63946` | Hero 背景竖带 / Project 索引（idx %4 == 3） / Hero RGB 色差负偏移 |

**使用规则**：VHS 四色只用于上述限定位置，正文、标题、UI 禁用；保持"黑 + 米 + 橙红"三色克制。

### Accent / Warn / Line

| Token | Value | 用途 |
|---|---|---|
| `accent.DEFAULT` | `#C48A3E` | 暖黄褐 · 地点图标 ◉ |
| `accent.hover` | `#D89B4F` | 悬停 |
| `warn` | `#C73E30` | 警示、错误 |
| `line` | `#D4C6A8` | 主分隔线（暖棕浅色） |
| `line-soft` | `#E1D5B8` | 次级分隔线 |

---

## 字体栈（零 Inter，符合 Impeccable 规范）

| Role | Font | 用途 |
|---|---|---|
| `font-sans` | Noto Sans SC / DM Sans / PingFang SC | 正文、UI、中文主体（400/700/900） |
| `font-display` | Archivo Black | 大字号英文标题 / SectionHeader 数字编号 |
| `font-condensed` | Oswald (500/600) | 窄压缩英文副标 / tag |
| `font-brush` | Liu Jian Mao Cao | 毛笔书法签名（AstroW 末字 W static fallback） |
| `font-mono` | JetBrains Mono | 等宽编号、日期、元信息 |

Google Fonts 合并 URL（见 `src/styles/global.css` 顶部 @import）。

---

## 核心组件规则

### SectionHeader 编号胶条（非横幅）
```
┌─────────────────────────────────────────┐
│ 01   粗黑中文标题       [ENGLISH TAG]    │
└─────── 2px 暖黑细分隔线 ─────────────────┘
  副标（text-ink-700）
```
- 左：Archivo Black `text-brand`，2.25–3rem，印刷品锚点
- 中：Noto Sans SC 900，`text-ink-900`，2xl/3xl
- 右：Oswald 500 米底黑字 pill，2px 黑边

### 卡片（Experience/Education/Project/Post）
- `bg-paper-card` + `border-2 border-ink-900` 硬朗零圆角
- hover 切 `border-brand`，80ms，无位移无阴影
- NO.001 胶条：`bg-brand text-paper-card`，2px 黑边，贴左上
- ProjectCard 独有：左侧 6px VHS 色标覆盖黑边（按 idx %4 轮换）

### Hero 三大视觉支柱
1. **VHS 四色背景竖带** —— `clamp(8–16px)` 宽，`mix-blend-mode: multiply`，22% 透明
2. **RGB 色差 H1** —— `--rgb-offset: clamp(1px, 0.2vw, 2px)`，红/青双向 text-shadow
3. **毛笔 W 签名** —— SVG fill path + `clip-path: inset(0 var(--reveal) 0 0)`，630ms 揭开 / 460ms 擦除

---

## 动效约束

| 维度 | 值 |
|---|---|
| Ease | `cubic-bezier(0.16, 1, 0.3, 1)`（指数缓动，禁 bounce/elastic） |
| 微交互 | 80–220ms |
| 大过渡 / Hero 元素 | 320–640ms |
| 毛笔揭开 | 630ms |
| 毛笔擦除 | 460ms |
| 打字速度 | 78ms/char（输入） / 36ms/char（删除） |
| reduced-motion | 全量降级：打字→轮播淡入淡出；RGB 色差→关闭；毛笔 W→静态 |

---

## 反模式防御清单（严禁）

- ❌ Inter / Arial / system-ui 主字体
- ❌ 纯黑 `#000` / 纯白 `#fff`
- ❌ `backdrop-blur` 毛玻璃
- ❌ bounce / elastic 缓动
- ❌ VHS 四色用在标题 / 正文 / UI（仅装饰位）
- ❌ RGB 色差用在 Hero H1 之外的地方
- ❌ 孤星原文复刻（MONITOR CENTER / ROOM NO. / 直播准备中 等）
- ❌ 顶部 sticky MonitorBar 条
- ❌ 卡片圆角 > 0 / 阴影外扩

---

## 焦点态（统一）

```css
:focus-visible {
  outline: 2px solid #FF5A3C;
  outline-offset: 2px;
  border-radius: 2px;
}
```

---

## 版本历史

- **v3** (当前) · 米色档案纸本 × VHS 印刷品现代主义（本次）
- v2 · 深色工业档案风（废弃）
- v1 · 浅色极简（废弃）
