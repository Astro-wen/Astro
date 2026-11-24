import notiqueCover from '@/assets/work/notique/gen-plug.jpg';

/**
 * 产品案例的卡片数据 —— 首页和作品页共用。
 * slug 对应 src/pages/work/<slug>.astro。
 */
export const CASES = [
  {
    slug: 'notique',
    image: notiqueCover,
    imageAlt: 'The Notique pen plugged into a phone',
    tag: { zh: '自己的产品 · 可交互', en: 'My own product · Interactive' },
    title: { zh: 'Notique：一支笔，和笔后面的助理', en: 'Notique: a pen, and the assistant behind it' },
    summary: {
      zh: '一支直接插手机的 AI 录音笔。Pilot 里多了一位真人助理，把对话之后的事做完。',
      en: 'An AI recorder that plugs straight into a phone. In pilot, a human assistant finishes what comes after the conversation.',
    },
    stats: [
      { value: '~400', zh: '录音笔售出', en: 'recorders sold' },
      { value: '~200', zh: '人在 Pilot', en: 'people in the pilot' },
    ],
  },
  {
    slug: 'tiktok-eval',
    image: null,
    imageAlt: '',
    tag: { zh: 'TikTok 实习 · 已脱敏', en: 'TikTok internship · De-identified' },
    title: { zh: '客服机器人答得好不好，这个判断准不准', en: 'Is the chatbot any good, and can we trust that verdict' },
    summary: {
      zh: '人工评估平台、可复算的质量报告，以及自迭代系统里的验收关。',
      en: 'A human evaluation platform, a quality report that can be recomputed, and an acceptance gate for a self-improving system.',
    },
    stats: [
      { value: '~100', zh: '名评审员在用', en: 'reviewers using it' },
      { value: '250–300', zh: '单每小时，此前不足 70', en: 'cases an hour, up from under 70' },
    ],
  },
] as const;
