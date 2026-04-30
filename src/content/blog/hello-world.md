---
title: 'Hello, world'
date: 2026-04-20
summary: '这是第一篇示例文章，介绍了本站点的写作工作流与 Markdown 支持的一些常见语法。'
tags: ['meta', 'writing']
draft: false
---

欢迎来到我的个人站点。这是一篇示例文章，用来验证 **Markdown 渲染** 与基础排版效果。

## 子标题示例

这里是一段普通段落。可以写 `inline code`，也可以写 [链接](https://example.com)。

### 列表

- 第一项
- 第二项
- 第三项

### 代码块

```ts
function greet(name: string): string {
  return `Hello, ${name}!`;
}

console.log(greet('world'));
```

### 引用

> 简单来说，这个站点的所有文章都是 Markdown 文件，放在 `src/content/blog/` 下即可。

新增文章时：复制本文件，改文件名（英文 slug），改 frontmatter，开始写。
