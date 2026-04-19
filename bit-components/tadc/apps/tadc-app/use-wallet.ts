import { useState, useCallback, useEffect } from 'react';

const WALLET_KEY = 'tadc_wallet';
const INV_KEY = 'tadc_inventory';

interface Wallet { coins: number; gems: number; }
interface InvItem { name: string; emoji: string; category: string; count: number; }

function getWallet(): Wallet {
  try { const raw = localStorage.getItem(WALLET_KEY); if (raw) return JSON.parse(raw); } catch { /* */ }
  return { coins: 500, gems: 50 };
}
function saveWallet(w: Wallet) { localStorage.setItem(WALLET_KEY, JSON.stringify(w)); }

function getInventory(): InvItem[] {
  try { const raw = localStorage.getItem(INV_KEY); if (raw) return JSON.parse(raw); } catch { /* */ }
  return [];
}
function saveInventory(inv: InvItem[]) { localStorage.setItem(INV_KEY, JSON.stringify(inv)); }

/**
 * Shared wallet hook — coins, gems, and inventory persist in localStorage
 */
export function useWallet() {
  const [wallet, setWallet] = useState<Wallet>(getWallet);
  const [inventory, setInventory] = useState<InvItem[]>(getInventory);

  useEffect(() => { saveWallet(wallet); }, [wallet]);
  useEffect(() => { saveInventory(inventory); }, [inventory]);

  useEffect(() => {
    const handler = () => { setWallet(getWallet()); setInventory(getInventory()); };
    window.addEventListener('storage', handler);
    const interval = setInterval(() => {
      const cw = getWallet();
      setWallet(prev => (prev.coins !== cw.coins || prev.gems !== cw.gems) ? cw : prev);
      setInventory(getInventory());
    }, 500);
    return () => { window.removeEventListener('storage', handler); clearInterval(interval); };
  }, []);

  const addCoins = useCallback((amount: number) => {
    setWallet(prev => { const next = { ...prev, coins: prev.coins + amount }; saveWallet(next); return next; });
  }, []);

  const addGems = useCallback((amount: number) => {
    setWallet(prev => { const next = { ...prev, gems: prev.gems + amount }; saveWallet(next); return next; });
  }, []);

  const spendCoins = useCallback((amount: number): boolean => {
    const current = getWallet();
    if (current.coins < amount) return false;
    const next = { ...current, coins: current.coins - amount };
    saveWallet(next); setWallet(next); return true;
  }, []);

  const spendGems = useCallback((amount: number): boolean => {
    const current = getWallet();
    if (current.gems < amount) return false;
    const next = { ...current, gems: current.gems - amount };
    saveWallet(next); setWallet(next); return true;
  }, []);

  const addToInventory = useCallback((name: string, emoji: string, category: string) => {
    setInventory(prev => {
      const existing = prev.find(i => i.name === name);
      let next: InvItem[];
      if (existing) { next = prev.map(i => i.name === name ? { ...i, count: i.count + 1 } : i); }
      else { next = [...prev, { name, emoji, category, count: 1 }]; }
      saveInventory(next); return next;
    });
  }, []);

  const useItem = useCallback((name: string): boolean => {
    const inv = getInventory();
    const item = inv.find(i => i.name === name);
    if (!item || item.count <= 0) return false;
    const next = inv.map(i => i.name === name ? { ...i, count: i.count - 1 } : i).filter(i => i.count > 0);
    saveInventory(next); setInventory(next); return true;
  }, []);

  const getItemCount = useCallback((name: string): number => {
    const inv = getInventory();
    return inv.find(i => i.name === name)?.count || 0;
  }, []);

  const hasItem = useCallback((name: string): boolean => {
    const inv = getInventory();
    return (inv.find(i => i.name === name)?.count || 0) > 0;
  }, []);

  return { coins: wallet.coins, gems: wallet.gems, addCoins, addGems, spendCoins, spendGems, inventory, addToInventory, useItem, getItemCount, hasItem };
}
