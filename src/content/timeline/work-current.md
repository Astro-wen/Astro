---
kind: work
org: "TikTok"
orgShort: "TIKTOK"
orgZh: "TikTok（字节跳动）"
orgEn: "TikTok (ByteDance)"
logo: "/logos/tiktok.webp"
role: "AI 产品经理实习生"
roleEn: "AI Product Manager Intern"
team: "客服平台（CSP）"
teamEn: "Customer Service Platform"
tint: "#25F4EE"
start: 2026-06-01
end: 2026-09-18
location: "San Jose, CA"
locationZh: "美国 圣何塞"
highlight: "绩效评估 E+（远超预期）"
highlightEn: "Performance Evaluation: E+ (Significantly Exceeds Expectations)"
tags: ["Multi-Agent", "LLM Evaluation", "LangGraph", "NL Search", "SQL · Python"]
caseStudy: "tiktok-eval"
featured: true
current: false
---

<div class="i18n-zh">

主导 **orbit**：一套会自我改进的多智能体系统，已在 TikTok 客服上线。它能找出 CSAT 等指标波动背后的根因，并验证自己提出的修复，把问题排查从**数天缩短到 30 分钟以内**。

参与设计 **SkillAgent**：用 LLM Agent 替代 LangGraph 客服机器人里的固定流程。从回答质量、模型成本和延迟三方面对比两种方案，决定哪些类型的请求先切到 Agent。

负责**人工评估平台**，为 AI 评测提供可信的人工基准。从访谈运营人员做到全球上线，前端用 React 和 TypeScript 自己写。平台替代了四个团队近 100 名评审员用的表格，单人吞吐从每小时不足 70 单提升到 **250 至 300 单**。

上线会话**自然语言检索**，采用关键词加语义的混合检索，并定义相关性指标和延迟保护。运营人员直接描述想找的案例，不用再手动设置 **21 个以上**的筛选项。

自发搭建**自动化质量报告**，对比三个地区的客服机器人版本。所有指标用 SQL 和 Python 定义并脚本化，校验环节拦下 **18 处数值错误**，让管理层在发版时只看一份报告。

主导客服 AI **隐私过滤服务**上线：把合规要求拆解为 **11 类敏感数据、4 种语言**，以及实时、批处理、对话三类接口，支撑全球生产环境下可审计的脱敏。

</div>

<div class="i18n-en">

Led **"orbit"**, a self-improving multi-agent system now live in TikTok's customer service. It finds the root cause behind a metric shift such as CSAT and validates its own fix, cutting investigations from **days to under 30 minutes**.

Contributed to the design of **"SkillAgent"**, an LLM agent replacing fixed workflows in TikTok's LangGraph support chatbot, and compared the two on quality, model cost, and latency to decide which request types to route to it first.

Owned the **human evaluation platform** behind trusted AI benchmarks from operator interviews to global rollout, writing its React and TypeScript frontend. It replaced spreadsheets for nearly 100 reviewers across four teams and raised throughput from under 70 to **250–300 cases/hour** per reviewer.

Launched **natural-language conversation search** with hybrid keyword and semantic retrieval, defining relevance metrics and latency safeguards so operators describe the cases they need instead of setting **21+ filters**.

Self-initiated an **automated quality report** comparing chatbot versions across three regions. Defined and scripted every metric in SQL and Python, with validation that caught **18 numeric errors**, giving leadership one view for releases.

Led the launch of a **privacy filtering service** for customer-service AI, translating regulatory requirements into **11 sensitive-data categories, 4 languages**, and real-time, batch, and conversation APIs for auditable redaction in global production.

</div>
