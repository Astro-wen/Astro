---
name: 'Yongge Restaurant Skill'
summary: '一个把「勇哥餐饮创业说」方法论工程化为 Agent Skill 的餐饮创业决策系统：包含 9 篇方法论语料、30+ 真实案例、保本线计算器、快招识别器和街景 360° 选址打分模型。'
stack: ['Agent Skill', 'Python', 'LLM', 'RAG', 'Knowledge Engineering', 'Decision Support', 'CLI Tools']
repo: 'https://github.com/Astro-wen/yongge-restaurant-skill/'
order: -1
featured: true
---

## 概览

这是一个围绕「勇哥餐饮创业说」（梁朝勇）公开内容构建的餐饮创业决策 Agent Skill。项目不是简单复读金句，而是把餐饮创业中的选址、加盟、保本、止损、案例匹配等判断流程，拆成可以被 LLM / Agent 调用的结构化知识、SOP 和可执行工具。

项目的核心目标是：让 Agent 在面对真实创业咨询时，能先算账、再判断、再匹配案例，最后给出明确的下一步动作。

## 核心内容

| 模块 | 内容 |
|------|------|
| 方法论语料 | 9 篇核心语料文档，覆盖人物档案、诊断 SOP、选址方法论、快招识别、品类赛道、金句话术与行业常识 |
| 案例库 | 22 个失败案例 + 5 个成功案例，每个案例按统一字段结构化整理 |
| Skill 入口 | `SKILL.md` 作为 Claude Skills / Cursor / Codex / Cline 等 Agent 环境的加载入口 |
| 工具脚本 | 3 个零依赖 Python 工具：保本线计算、快招风险评分、案例匹配 |
| 决策模型 | 街景 360° 打分模型、加盟红线识别、房租营业额铁律、转让费三标准等 |

## 关键能力

**1. 保本线与斩杀线计算**

输入日营业额、食材成本、房租、人工、投资额和品类后，工具会计算毛利率、日保本线、达成率、预计月利润，并给出红黄绿风险判断。

**2. 快招 / 加盟风险识别**

针对「零加盟费」「6 个月回本」「总部全包」「抖音广告引流」「高额加盟费」等典型话术进行评分，输出风险等级和是否建议放弃。

**3. 街景 360° 选址判断**

模拟勇哥常说的「来，镜头高一点，360 度原地转个圈」：从门头宽度、台阶数量、阴阳街、转让密度、同业浓度、竞品距离、楼层等维度给街景打分。

**4. 真实案例匹配**

用户描述一个店铺困境后，系统会在案例库中匹配相似案例，例如「七层奶茶大厦」「第四代汉堡」「脸盆姐济南果汁」「关起来杀哥」等，再基于案例给出诊断。

## 方法论亮点

| 心智模型 | 一句话解释 |
|----------|------------|
| 保本线 / 斩杀线 | 月固定支出 ÷ 毛利率 = 月保本，达成率过低就该止损 |
| 房租营业额铁律 | 1 万房租大致对应日营业额 3000，否则房租或选址有问题 |
| 三类生意三种逻辑 | 小吃看流量，快餐看复购，早餐看顺路 |
| 转让费三标准 | 3–4 个月赚回、≤ 月租 × 15、当月营收 ≥ 转让费 ÷ 2 |
| 同业浓度黄金区 | 同品类过少说明需求不足，过多说明竞争过载 |

## 工程化思路

这个项目本质上是一次「内容 IP → Agent Skill」的知识工程实验：

1. 从公开信源中整理人物、方法论、案例与话术。
2. 将经验判断拆成 SOP、红线、阈值和评分表。
3. 把高频计算场景写成可执行 Python 工具。
4. 用 `SKILL.md` 作为统一入口，使其可以迁移到 Claude Skills、Cursor、Codex、Cline、Coze、Dify 等不同 Agent 环境。
5. 用真实案例验证工具输出是否符合原方法论的判断风格。

## 相关链接

- [GitHub 仓库](https://github.com/Astro-wen/yongge-restaurant-skill/) — 完整语料、案例库、工具脚本与 Skill 入口
- [corpus/](https://github.com/Astro-wen/yongge-restaurant-skill/tree/main/corpus) — 方法论知识库
- [cases/](https://github.com/Astro-wen/yongge-restaurant-skill/tree/main/cases) — 失败与成功案例库
- [tools/](https://github.com/Astro-wen/yongge-restaurant-skill/tree/main/tools) — 保本线、快招评分、案例匹配工具
