import jevPanel from '@/assets/work/side/jev-panel.png';
import myuclaPoster from '@/assets/work/side/myucla-poster.png';

/**
 * 自己动手做的项目 —— 首页和项目页共用。
 * 每个项目的画面都是真实素材：录屏、真机截图、游戏里的角色动画。
 */
export const SIDES = [
  {
    slug: 'better-myucla',
    name: 'Better MyUCLA',
    kind: 'video',
    video: '/media/side/myucla-demo.mp4',
    poster: myuclaPoster,
    alt: {
      zh: '在 MyUCLA 选课计划里把一门课直接拖到前面，底部的条显示还没保存的改动',
      en: 'A class being dragged up the MyUCLA class plan while a bar at the bottom counts unsaved moves',
    },
    summary: {
      zh: 'MyUCLA 的选课计划一次只能把课挪一位，每点一下整页刷新一次。我做了个 Chrome 扩展，把它变成一次拖拽。',
      en: 'The MyUCLA class planner moves a class one place per click, and every click reloads the page. I built a Chrome extension that makes it one drag.',
    },
    href: 'https://astro-wen.github.io/better-myucla-planner/',
    cta: { zh: '看项目', en: 'View project' },
    repo: '',
  },
  {
    slug: 'jev',
    name: 'Jev',
    kind: 'image',
    image: jevPanel,
    alt: {
      zh: 'Jev 的悬浮面板：危险等级、对方的真实意图，和三条排好序的候选回复',
      en: 'The Jev overlay panel: a risk level, what the other person actually wants, and three ranked reply candidates',
    },
    summary: {
      zh: '装在安卓手机上的对话副驾。它读屏幕上的聊天，判断对方想要什么，给出三条排好序的回复，发不发由你。',
      en: 'A conversation co-pilot for Android. It reads the chat on screen, works out what the other person wants, and offers three ranked replies. Sending is always your call.',
    },
    href: 'https://github.com/Astro-wen/jev-chat-jarvis',
    cta: { zh: '看项目', en: 'View project' },
    repo: '',
  },
  {
    slug: 'gym',
    name: 'Ultimate Gym Championship',
    kind: 'sprites',
    alt: {
      zh: '游戏里主角的四个健身动作：卧推、哑铃弯举、跑步机、打沙袋',
      en: 'The four workout animations of the player character: bench press, dumbbell curl, treadmill and punching bag',
    },
    summary: {
      zh: '用 Godot 做的像素潜行游戏。午休 3 分钟练完今天的量，还得躲着巡视的产品经理。',
      en: 'A pixel-art stealth game made in Godot. Finish today’s workout in a three-minute lunch break while dodging the product manager on patrol.',
    },
    href: 'https://github.com/Astro-wen/ultimate-gym-championship',
    cta: { zh: '看项目', en: 'View project' },
    repo: '',
  },
] as const;
