import notiqueCover from '@/assets/work/notique/gen-plug.jpg';
import aiyoCover from '@/assets/work/aiyo/home.jpg';
import evalCover from '@/assets/work/eval/task.png';

/**
 * 产品案例的卡片数据 —— 首页和作品页共用。
 * slug 对应 src/pages/work/<slug>.astro。
 */
export const CASES = [
  {
    slug: 'notique',
    image: notiqueCover,
    imageAlt: 'The Notique pen plugged into a phone',
    tag: { zh: '自己的产品，可交互', en: 'My own product, Interactive' },
    title: { zh: 'Notique：一支笔，和笔后面的助理', en: 'Notique: a pen, and the assistant behind it' },
    summary: {
      zh: '一支直接插手机的 AI 录音笔。Pilot 里多了一位真人助理，把对话之后的事做完。',
      en: 'An AI recorder that plugs straight into a phone. In pilot, a human assistant finishes what comes after the conversation.',
    },
    stats: [
      { value: '~400', zh: '录音笔售出', en: 'recorders sold' },
      { value: '150+', zh: '位经纪人在 Pilot', en: 'agents in the pilot' },
    ],
  },
  {
    slug: 'aiyo',
    image: aiyoCover,
    imageAlt: 'AIYO home screen',
    tag: { zh: '腾讯游戏，可点击', en: 'Tencent Games, click-through' },
    title: { zh: 'AIYO：游戏人的 AI 入口', en: 'AIYO: the AI front door for game makers' },
    summary: {
      zh: '我发起并上线的内部 AI 平台，内容按岗位来分。',
      en: 'An internal AI platform I initiated and shipped, organised by role.',
    },
    stats: [
      { value: '27,000', zh: '日活', en: 'daily active users' },
      { value: '1/3', zh: '腾讯员工在用', en: 'of Tencent employees' },
    ],
  },
  {
    slug: 'orbit',
    image: null,
    imageAlt: '',
    tag: { zh: '', en: '' },
    title: { zh: 'Orbit：会自己迭代的客服机器人', en: 'Orbit: a support bot that improves itself' },
    summary: {
      zh: '我主导的自迭代系统，已在 TikTok 客服上线。它自己找根因，自己验证修复。',
      en: 'The self-improving system I led, live in TikTok’s customer service. It finds root causes and validates its own fixes.',
    },
    stats: [],
  },
  {
    slug: 'eval',
    image: evalCover,
    imageAlt: 'The evaluation platform: reviewer accuracy and a list of scored conversations',
    tag: { zh: '', en: '' },
    title: { zh: 'Human Annotation Platform：给 AI 打分的人，用的平台', en: 'Human Annotation Platform: where people score the AI' },
    summary: {
      zh: 'TikTok 客服 AI 的人工评估平台。我从访谈做到全球上线，前端自己写，替掉了近 100 名评审员用的表格。',
      en: 'The human evaluation platform for TikTok’s customer-service AI. I took it from interviews to global rollout, wrote the frontend, and replaced the spreadsheets nearly 100 reviewers were using.',
    },
    stats: [],
  },
] as const;
