---
kind: work
org: "TikTok"
orgShort: "TIKTOK"
orgZh: "TikTok"
orgEn: "TikTok"
logo: "/logos/tiktok.webp"
role: "产品经理实习生"
roleEn: "Product Manager Intern"
team: "产品基础设施 · 客服平台（CSP）"
teamEn: "Product Infrastructure · Customer Service Platform (CSP)"
tint: "#25F4EE"
start: 2026-06-01
location: "San Jose, CA"
locationZh: "美国 圣何塞"
tags: ["SkillAgent", "LangGraph · ReAct", "SQS/UES", "Manual Annotation"]
featured: true
current: true
---

<div class="i18n-zh">

在 TikTok 智能客服平台（**Customer Service Platform, CSP**）产品基础设施团队实习，工作围绕两条主线——把 AI 客服 Bot 从刚性的固定流程升级为 **Agentic 架构**，以及重建"如何评估客服服务质量、机器评得准不准"这套标准。

撰写 **SkillAgent** 方案设计：用一个 LLM 驱动的智能体，替代 Bot 背后刚性的 JSON 图执行引擎（基于 **LangGraph** 的多 Agent 系统）。把原本以 JSON 图定义的 **SOP** 流程改写为自然语言 **Skill**（对 JSON 图的 Markdown 可读化替代），交给 LLM 通读完整流程、再经 **ReAct** 循环逐步推理与执行；配套共享的函数/工具注册表，以及基于 memory 的多轮上下文恢复。

设计 Agent 运行底座（**harness**）：版本化的 Skill 仓库，配合 **Libra 分桶 A/B 实验**、按 SOP 灰度放量（以 CSAT 与转人工率衡量），接入 **OpenTelemetry / Logfire** 观测 token 成本、延迟与 ReAct 循环，并加入安全护栏（循环上限、重试、人工兜底）——全程对下游零改造。

主导人工标注平台的 **评估新规则（New Rule）迁移**：把标注标准从只给单一总分、与 CSAT 弱相关的老 **GE Rate** 体系，重构为 **用户满意分（UES, User Experience Score）**——由平台视角的 **服务质量分（SQS）** 6 个维度，加上用户视角的 **用户预期达成（User Expectation Fulfillment）** 两部分构成；新增 gating 级联判定、按 Knowledge Source（Skill / FAQ / SOP）分路打分、人工转接结果（Human Result）自动生成，并落地 A/B/C 双盲质控。看板核心指标从 GE Rate 全面切换为 SQS/UES Avg 与 QC Accuracy，人工标注吞吐从约 120 提升到 250–300 单/小时，支撑团队 CSAT（50→60%）与评测准确率（77→83%）目标；前端用规格驱动（spec-driven）AI coding 数天内完成。

</div>

<div class="i18n-en">

Interned on the Product Infrastructure org of TikTok's **Customer Service Platform (CSP)**, working along two throughlines: upgrading the AI customer-service bot from a rigid fixed-flow engine to an **agentic architecture**, and rebuilding how the platform evaluates service quality — and whether that evaluation is itself accurate.

Authored the **SkillAgent** design proposal: an LLM-driven agent that replaces the rigid JSON-graph execution engine behind the bot (a **LangGraph** multi-agent system). SOP flows defined as JSON graphs are recast as natural-language **Skills** (a readable Markdown replacement for the graph) that the LLM reads end-to-end, then plans and executes step by step through a **ReAct** loop — backed by a shared function/tool registry and memory-based multi-turn recovery.

Designed the **agent harness**: a version-controlled Skill repository with **Libra-bucketed A/B experiments** and gradual rollout by SOP (measured on CSAT and human-transfer rate), **OpenTelemetry / Logfire** observability of token cost, latency, and ReAct loops, plus safety guardrails (loop caps, retry, human fallback) — all requiring zero downstream changes.

Led the **New Rule migration** on the Manual Annotation platform: rebuilt the scoring standard from the legacy single-score, CSAT-weakly-correlated **GE Rate** into a two-part **User Experience Score (UES)** — a platform-view **Service Quality Score (SQS)** across 6 dimensions plus a user-view **User Expectation Fulfillment** score — adding gating cascades, Knowledge-Source-based branches (Skill / FAQ / SOP), auto-generated Human Result records for bot-to-human handoffs, and an A/B/C double-blind QC workflow. Migrated the dashboard's core metrics from GE Rate to SQS/UES averages and QC accuracy, lifted annotation throughput ~120→250–300 cases/hour, and underpinned the team's CSAT (50→60%) and eval-accuracy (77→83%) targets; built the frontend via spec-driven AI coding in days.

</div>
