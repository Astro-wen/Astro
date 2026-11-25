/**
 * 数据分析工作 —— 项目页“数据分析”一栏用。
 * 每条都是问题、方法、结果三句话，内容和简历、经历页保持一致。
 * to 是站内路径（经历页的锚点），href 是站外链接。
 */
export const ANALYSES = [
  {
    org: { zh: '腾讯', en: 'Tencent' },
    title: { zh: '论坛里为什么大家只看不发', en: 'Why a forum’s members only read' },
    q: { zh: '腾讯最大的内部游戏论坛，大多数人只看不发。', en: 'In Tencent’s largest internal gaming forum, most members only read.' },
    how: { zh: 'SQL 拆行为，加成员访谈，定位到奖励机制。', en: 'SQL on member behavior plus interviews, traced to the reward design.' },
    out: { zh: '重做奖励后，周贡献者从 358 到 2,400+，首页 DAU +35%，两月留存 +73%。', en: 'After the redesign: weekly contributors 358 to 2,400+, homepage DAU +35%, two-month retention +73%.' },
    to: '/experience#work-tencent-games',
    href: '',
  },
  {
    org: { zh: '腾讯', en: 'Tencent' },
    title: { zh: '人格测试的分享漏斗和 A/B 测试', en: 'A share funnel and A/B test for a personality quiz' },
    q: { zh: '《无畏契约：源能行动》的人格测试，怎样让更多人分享。', en: 'How to get more people to share a “VALORANT Mobile” personality quiz.' },
    how: { zh: '给浏览到分享的整条漏斗埋点，A/B 测试封面和题目。', en: 'Instrumented the view-to-share funnel and A/B tested covers and question sets.' },
    out: { zh: '20 天 20,000+ 人参与，分享率比对照组高 18%。', en: '20,000+ participants in 20 days; share rate up 18% against the control.' },
    to: '/experience#work-tencent-games',
    href: '',
  },
  {
    org: { zh: '米哈游', en: 'HoYoverse' },
    title: { zh: '版本更新到底有没有拉动留存', en: 'Did a version update actually move retention' },
    q: { zh: '版本更新和活动上线后，留存的变化有多少是它们带来的。', en: 'How much of a retention change is caused by a version update or event.' },
    how: { zh: '对照组加活动前趋势，双重差分和事件研究；另用 SQL 和 R 分析 30,000+ 份问卷。', en: 'Difference-in-differences and event-study designs against control groups and pre-event trends, plus 30,000+ survey responses in SQL and R.' },
    out: { zh: '结论用于北美的内容和运营决策。', en: 'Findings guide live operations for North America.' },
    to: '/experience#work-hoyoverse',
    href: '',
  },
  {
    org: { zh: 'TikTok', en: 'TikTok' },
    title: { zh: '一份能让管理层放心看的质量报告', en: 'A quality report leadership could trust' },
    q: { zh: '三个地区的客服机器人版本要放在一起比，指标口径却不统一。', en: 'Chatbot versions in three regions needed one comparison, but metric definitions differed.' },
    how: { zh: '自己发起，用 SQL 和 Python 把每个指标脚本化，再加数值校验。', en: 'Self-initiated. Scripted every metric in SQL and Python, with numeric validation.' },
    out: { zh: '校验拦下 18 处数值错误，管理层发版只看这一份。', en: 'Validation caught 18 numeric errors; leadership approved each release from it.' },
    to: '/experience#work-current',
    href: '',
  },
  {
    org: { zh: 'Notique', en: 'Notique' },
    title: { zh: '用户停在了哪一步', en: 'Where users stopped' },
    q: { zh: '录音笔卖出去了，但不知道用户用到了哪一步。', en: 'Recorders were selling, but how far buyers got was unknown.' },
    how: { zh: 'MySQL 汇总反馈、设备数据和 Amazon 销售，Tableau 看引导漏斗和周留存。', en: 'MySQL unifying feedback, device telemetry and Amazon sales; Tableau for the onboarding funnel and weekly retention.' },
    out: { zh: '使用停在原始转写这一步，于是转向 AI 助理。', en: 'Usage stalled at raw transcripts, which drove the move to an AI assistant.' },
    to: '/experience#work-notique',
    href: '',
  },
  {
    org: { zh: 'UCLA 课程项目', en: 'UCLA course project' },
    title: { zh: '开局 10 分钟能不能预测一局英雄联盟的胜负', en: 'Can the first 10 minutes predict a League of Legends match' },
    q: { zh: '只看前 10 分钟，一局钻石段位比赛的胜负能预测多准。', en: 'How well the first ten minutes predict a Diamond-tier match.' },
    how: { zh: '9,879 场比赛，14 个特征，对比 6 种模型。', en: '9,879 matches, 14 features, six models compared.' },
    out: { zh: '六种模型都在 72% 左右，逻辑回归最好；金币差是最强的预测因子。', en: 'All six landed near 72%, logistic regression best; gold difference was the strongest predictor.' },
    to: '',
    href: 'https://astro-wen.github.io/UCLA_C111_LoL/',
  },
] as const;
