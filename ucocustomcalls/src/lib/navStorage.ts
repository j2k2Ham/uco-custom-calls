export const enum NavStorageKey {
  ShopOpen = 'nav.shop',
  HuntingOpen = 'nav.hunting',
  LastShopItem = 'nav.last.shop',
  LastHuntingItem = 'nav.last.hunting'
}

export function getStored(key: NavStorageKey): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
export function setStored(key: NavStorageKey, value: string) {
  try { localStorage.setItem(key, value); } catch {}
}
