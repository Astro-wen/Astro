import type { CollectionEntry } from 'astro:content';

type Entry = CollectionEntry<'timeline'>;
const FAR_FUTURE = new Date(8640000000000000);

/** 进行中的排最前，其余按结束时间倒序，再按开始时间倒序。 */
export function sortExperience(entries: Entry[]): Entry[] {
  return [...entries].sort((a, b) => {
    const aEnd = a.data.end ?? FAR_FUTURE;
    const bEnd = b.data.end ?? FAR_FUTURE;
    return bEnd.getTime() - aEnd.getTime() || b.data.start.getTime() - a.data.start.getTime();
  });
}

/** "2026.06 – 2026.09" / "2026.11 – 至今" */
export function formatRange(start: Date, end: Date | undefined, lang: 'zh' | 'en'): string {
  const ym = (d: Date) => `${d.getUTCFullYear()}.${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
  const tail = end ? ym(end) : lang === 'zh' ? '至今' : 'Present';
  return `${ym(start)} – ${tail}`;
}
