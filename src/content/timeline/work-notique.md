---
kind: work
org: "Notique AI"
orgShort: "NOTIQUE"
orgZh: "Notique AI（创业项目）"
orgEn: "Notique AI (Startup)"
logo: "/logos/notique.png"
role: "联合创始人，产品负责人"
roleEn: "Co-Founder & Head of Product"
team: "AI 录音笔 + 房产经纪人虚拟助理"
teamEn: "AI Recorder + Virtual Assistant for Real Estate Agents"
tint: "#FF0A9C"
start: 2026-03-01
location: "Los Angeles, CA"
locationZh: "美国 洛杉矶"
tags: ["AI Hardware", "Virtual Assistant", "Cloudflare R2, D1, Queues", "LLM Verification", "Tableau"]
caseStudy: "notique"
featured: true
current: true
---

<div class="i18n-zh">

联合创办 **Notique**，面向房产经纪人的软硬件一体 AI 虚拟助理。录音笔已售出**约 400 支**，用来记录与客户的对话，助理再把对话整理成客户记忆和跟进事项，目前有 **150 多位**经纪人在试用。

漏斗分析和 20 多场访谈显示，用户的使用停在了原始转写这一步，于是把产品从录音工具转向 AI 虚拟助理服务。为此搭了一个 MySQL 数据库，汇总用户反馈、设备数据和 Amazon 销售数据，并用 **Tableau** 看新手引导漏斗和周留存。

在 Cloudflare 上设计助理的**数据管线**：带版本的录音和文件存 R2，客户事实存 D1，AI 抽取任务走 Queues 并配 outbox，失败、重试和重复投递都不会丢任务。

设计**校验层**：模型抽取的每条客户事实都要和原始录音核对，通过 schema 检查和确定性校验器把关，没有依据的内容不会出现在经纪人面前，也不会进入客户跟进。

对标 **Plaud AI**（估值 20 亿美元，销量超过 100 万台）的定价、硬件和订阅模式来确定自身定位，并持续跟踪 Amazon 商品页转化、广告 ROAS 和评价口碑。

</div>

<div class="i18n-en">

Co-founded **"Notique"**, a hardware-plus-software AI virtual assistant for real estate agents. Its recorder (**~400 sold**) captures client conversations, which the assistant turns into client memory and follow-ups for **150+ pilot agents**.

After funnel analysis and 20+ interviews showed usage stalled at raw transcripts, pivoted from a recording tool to an AI virtual assistant service. Built a MySQL database unifying user feedback, device telemetry, and Amazon sales data, with **Tableau dashboards** for the onboarding funnel and weekly retention cohorts.

Designed the assistant's **data pipeline** on Cloudflare, keeping versioned recordings and files in R2, client facts in D1, and AI extraction jobs on Queues with an outbox so they survive failures, retries, and duplicate deliveries.

Designed the **verification layer** that checks every client fact the model extracts against its source recording, using schema checks and a deterministic validator so that no unsupported claim reaches an agent or a client follow-up.

Benchmarked Notique against **Plaud AI** ($2B valuation, 1M+ units sold) on pricing, hardware, and subscription economics to shape positioning, and tracked Amazon listing conversion, ad ROAS, and review sentiment.

</div>
