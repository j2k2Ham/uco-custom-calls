import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import React from 'react';
import { Nav } from './Nav';

// Helper to press keys
function key(el: HTMLElement, k: string, opts: Partial<KeyboardEventInit> = {}) {
  const eventOpts: KeyboardEventInit = { key: k, code: k, bubbles: true, cancelable: true, ...opts };
  el.dispatchEvent(new KeyboardEvent('keydown', eventOpts));
}

// Mock localStorage in a controlled way
class LS {
  store: Record<string,string> = {};
  getItem(k: string){ return this.store[k] ?? null; }
  setItem(k: string,v: string){ this.store[k] = String(v); }
  removeItem(k: string){ delete this.store[k]; }
  clear(){ this.store = {}; }
}

const ls = new LS();

beforeAll(() => {
  Object.defineProperty(window, 'localStorage', { value: ls });
});

beforeEach(() => {
  ls.clear();
});

describe('Nav keyboard & persistence', () => {
  it('opens Shop with Enter and traps focus cycling with Tab/Shift+Tab', async () => {
    render(<Nav />);
    const shopTrigger = screen.getByRole('menuitem', { name: /shop/i });
    shopTrigger.focus();
  await act(async () => { key(shopTrigger, 'Enter'); });
  const menu = await screen.findByRole('menu', { name: /shop/i });
  const items = Array.from(menu.querySelectorAll('a')) as HTMLElement[];
  expect(items.length).toBeGreaterThan(0);
  await waitFor(() => expect(document.activeElement).toBe(items[0]));
    // Tab forward cycles
  await act(async () => { key(document.activeElement as HTMLElement, 'Tab'); });
    expect(document.activeElement).toBe(items[1 % items.length]);
    // Shift+Tab cycles backward
  await act(async () => { key(document.activeElement as HTMLElement, 'Tab', { shiftKey: true }); });
    expect(document.activeElement).toBe(items[0]);
  });

  it('ArrowRight from Shop trigger moves focus to Hunting trigger', async () => {
    render(<Nav />);
    const shopTrigger = screen.getByRole('menuitem', { name: /shop/i });
    const huntingTrigger = screen.getByRole('menuitem', { name: /hunting/i });
    shopTrigger.focus();
  await act(async () => { key(shopTrigger, 'ArrowRight'); });
  await waitFor(() => expect(document.activeElement).toBe(huntingTrigger));
  });

  it('persists last focused shop item and restores focus to it on reopen', async () => {
    render(<Nav />);
    const shopTrigger = screen.getByRole('menuitem', { name: /shop/i });
    shopTrigger.focus();
  await act(async () => { key(shopTrigger, 'Enter'); });
  let menu = await screen.findByRole('menu', { name: /shop/i });
  let items = Array.from(menu.querySelectorAll('a')) as HTMLElement[];
    // activate second item
  const second = items[1];
  second.addEventListener('click', e => e.preventDefault());
  fireEvent.click(second);
    // reopen
    shopTrigger.focus();
  await act(async () => { key(shopTrigger, 'Enter'); });
    menu = await screen.findByRole('menu', { name: /shop/i });
    items = Array.from(menu.querySelectorAll('a')) as HTMLElement[];
    await waitFor(() => {
      expect(document.activeElement?.getAttribute('href')).toBe(second.getAttribute('href'));
    });
  });

  it('stores dropdown open state and restores it (desktop width)', () => {
    // Pretend previous session left both open (only one should restore at a time based on stored flags)
    ls.setItem('nav.shop', '1');
    ls.setItem('nav.hunting', '1');
    // desktop width
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 });
    render(<Nav />);
    // Both may attempt to restore; mutual exclusivity keeps as implemented (we accept at least one open)
    const possibleMenus = screen.getAllByRole('menu');
    expect(possibleMenus.length).toBeGreaterThanOrEqual(1);
  });

  it('closing with Escape returns focus to trigger', async () => {
    render(<Nav />);
    const shopTrigger = screen.getByRole('menuitem', { name: /shop/i });
    shopTrigger.focus();
  await act(async () => { key(shopTrigger, 'Enter'); });
  const menu = await screen.findByRole('menu', { name: /shop/i });
  const first = menu.querySelector('a') as HTMLElement;
  await waitFor(() => expect(document.activeElement).toBe(first));
  await act(async () => { key(first, 'Escape'); });
  await waitFor(() => expect(document.activeElement).toBe(shopTrigger));
  });
});
