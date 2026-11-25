/**
 * Steam 数据 —— 只在构建时读取，访客的浏览器不会请求 Steam 接口，key 也不会进页面。
 *
 * 需要两样东西：
 *   1. SITE.social.steam：个人主页地址（/profiles/数字 或 /id/自定义名 都行）
 *   2. 环境变量 STEAM_API_KEY：本地写在 .env，线上放在 GitHub Secrets
 * 缺任何一样，或者接口失败，getSteam() 返回 null，卡片不渲染，构建照常通过。
 */
import { SITE } from './site';

export interface SteamGame {
  appid: number;
  name: string;
  /** 总时长，小时 */
  hours: number;
  /** 过去两周时长，小时；没有就是 0 */
  recentHours: number;
  header: string;
  icon: string;
}

export interface SteamProfile {
  name: string;
  avatar: string;
  url: string;
  /** 'recent' 表示过去两周玩过的，'top' 表示总时长最长的 */
  mode: 'recent' | 'top';
  games: SteamGame[];
}

const API = 'https://api.steampowered.com';
const LIMIT = 3;

async function call<T>(path: string, params: Record<string, string>): Promise<T | null> {
  const url = `${API}/${path}/?${new URLSearchParams(params)}`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

const hours = (minutes?: number) => Math.round((minutes ?? 0) / 60);

function toGame(g: any): SteamGame {
  return {
    appid: g.appid,
    name: g.name,
    hours: hours(g.playtime_forever),
    recentHours: hours(g.playtime_2weeks),
    header: `https://cdn.cloudflare.steamstatic.com/steam/apps/${g.appid}/header.jpg`,
    icon: g.img_icon_url
      ? `https://media.steampowered.com/steamcommunity/public/images/apps/${g.appid}/${g.img_icon_url}.jpg`
      : '',
  };
}

let cached: Promise<SteamProfile | null> | undefined;

export function getSteam(): Promise<SteamProfile | null> {
  cached ??= load();
  return cached;
}

async function load(): Promise<SteamProfile | null> {
  const key = import.meta.env.STEAM_API_KEY ?? process.env.STEAM_API_KEY;
  const profileUrl: string = SITE.social.steam;
  if (!key || !profileUrl) return null;

  let steamid = profileUrl.match(/\/profiles\/(\d+)/)?.[1];
  if (!steamid) {
    const vanity = profileUrl.match(/\/id\/([^/]+)/)?.[1];
    if (!vanity) return null;
    const r = await call<any>('ISteamUser/ResolveVanityURL/v1', { key, vanityurl: vanity });
    steamid = r?.response?.steamid;
  }
  if (!steamid) {
    console.warn('[steam] 没能从主页地址解析出 SteamID，卡片不显示');
    return null;
  }

  const [summary, recent, owned] = await Promise.all([
    call<any>('ISteamUser/GetPlayerSummaries/v2', { key, steamids: steamid }),
    call<any>('IPlayerService/GetRecentlyPlayedGames/v1', { key, steamid, count: String(LIMIT) }),
    call<any>('IPlayerService/GetOwnedGames/v1', { key, steamid, include_appinfo: '1', include_played_free_games: '1' }),
  ]);

  const player = summary?.response?.players?.[0];
  if (!player) {
    console.warn('[steam] 读不到个人资料（key 无效或网络失败），卡片不显示');
    return null;
  }

  const recentGames: any[] = recent?.response?.games ?? [];
  const ownedGames: any[] = owned?.response?.games ?? [];
  const mode = recentGames.length > 0 ? 'recent' : 'top';
  const picked =
    mode === 'recent'
      ? recentGames.slice(0, LIMIT)
      : [...ownedGames].sort((a, b) => (b.playtime_forever ?? 0) - (a.playtime_forever ?? 0)).slice(0, LIMIT);

  if (picked.length === 0) {
    console.warn('[steam] 游戏列表是空的，多半是 Steam 隐私设置里“游戏详情”没有设为公开');
  }

  return {
    name: player.personaname,
    avatar: player.avatarmedium ?? player.avatar,
    url: player.profileurl ?? profileUrl,
    mode,
    games: picked.map(toGame),
  };
}
