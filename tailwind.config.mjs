/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        // ============================================================
        // 字体策略（深色工业档案 × 现代主义印刷）
        //  sans       —— 正文：中文 Noto Sans SC + 英文 Inter（平滑现代）
        //  display    —— 展示标题：Archivo Black（粗到印刷感）
        //  condensed  —— 窄压缩 tag：Oswald
        //  brush      —— 毛笔 fallback（实际 W 用 SVG 手写，不再依赖字体）
        //  mono       —— 编号 / 时间（UI 元数据专用，不用于正文）
        // ============================================================
        sans: [
          '"Noto Sans SC"',
          '"Inter"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Helvetica Neue"',
          'Arial',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          'sans-serif',
        ],
        display: [
          '"Archivo Black"',
          '"Inter"',
          '"Noto Sans SC"',
          '-apple-system',
          '"PingFang SC"',
          'sans-serif',
        ],
        condensed: [
          '"Oswald"',
          '"Archivo Black"',
          'sans-serif',
        ],
        brush: [
          '"Liu Jian Mao Cao"',
          '"Caveat"',
          'cursive',
        ],
        // mono —— 原来是 JetBrains Mono 代码字体；现在改为平滑无衬线
        // （NO.001 胶条 / .section-eyebrow 等真正需要代码感的场景，
        //  在 global.css 里直接硬写 JetBrains Mono，不受此栈影响）
        mono: [
          '"Inter"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Helvetica Neue"',
          'Arial',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Noto Sans SC"',
          'sans-serif',
        ],
      },
      colors: {
        // ============================================================
        // 深色主题（回归）
        // 语义键保持不变：paper / ink / brand / vhs / accent / line
        // 值全部翻成暗底 + 冷白文字
        // ============================================================

        // ink = 文字栈（深色下 900 = 最亮）
        ink: {
          900: '#F0F2F4',  // 主文字
          700: '#9AA3A9',  // 次文字
          500: '#626A70',  // 辅助
          300: '#3F464B',  // 极弱（编号、分隔线）
        },

        // paper = 底栈（深色下 DEFAULT = 主底）
        paper: {
          DEFAULT: '#0B0D0E', // 页面底 = 近黑（warm tone，非 #000）
          card: '#141719',    // 卡片底
          edge: '#1C2023',    // 描边/悬停面板
        },

        // brand = 孤星橙红
        brand: {
          DEFAULT: '#FF5A3C',
          hover: '#FF7359',
          dim: '#B33B26',
        },

        // VHS 四色（Lonetrail 海报色带）
        vhs: {
          cyan: '#29D2C8',
          yellow: '#F4C341',
          blue: '#3A6DB8',
          red: '#E8483D',
        },

        // accent = 次强调
        accent: {
          DEFAULT: '#D4A574',
          hover: '#E0B587',
        },

        warn: '#E46A5C',

        // line = 分隔线
        line: '#2A2F33',
        'line-soft': '#1F2326',
      },
      maxWidth: {
        prose: '65ch',
      },
      boxShadow: {
        // 深色下的硬边（白描边）
        panel: '0 0 0 1px #2A2F33',
        'panel-hover': '0 0 0 1px #FF5A3C',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.ink.900'),
            '--tw-prose-headings': theme('colors.ink.900'),
            '--tw-prose-links': theme('colors.brand.DEFAULT'),
            '--tw-prose-bold': theme('colors.ink.900'),
            '--tw-prose-code': theme('colors.brand.DEFAULT'),
            '--tw-prose-quotes': theme('colors.ink.700'),
            '--tw-prose-hr': theme('colors.line'),
            '--tw-prose-th-borders': theme('colors.line'),
            '--tw-prose-td-borders': theme('colors.line'),
            maxWidth: '65ch',
            a: {
              textDecoration: 'none',
              fontWeight: '500',
              borderBottom: `1px solid ${theme('colors.brand.dim')}`,
              '&:hover': {
                borderBottomColor: theme('colors.brand.DEFAULT'),
                color: theme('colors.brand.DEFAULT'),
              },
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            code: {
              backgroundColor: theme('colors.paper.card'),
              padding: '0.15em 0.4em',
              borderRadius: '0.25rem',
              fontWeight: '500',
              color: theme('colors.brand.DEFAULT'),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
