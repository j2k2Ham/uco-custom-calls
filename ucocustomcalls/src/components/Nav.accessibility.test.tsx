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

describe('Nav keyboard & focus', () => {
  it('opens Shop with Enter and traps focus cycling with Tab/Shift+Tab', async () => {
    render(<Nav />);
  const shopTrigger = screen.getByRole('button', { name: /shop/i });
    shopTrigger.focus();
  await act(async () => { key(shopTrigger, 'Enter'); });
  const menu = await waitFor(() => {
    const el = shopTrigger.parentElement?.querySelector('ul[aria-labelledby]');
    if(!el) throw new Error('submenu not found');
    return el as HTMLElement;
  });
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
  const shopTrigger = screen.getByRole('button', { name: /shop/i });
  const huntingTrigger = screen.getByRole('button', { name: /hunting/i });
    shopTrigger.focus();
  await act(async () => { key(shopTrigger, 'ArrowRight'); });
  await waitFor(() => expect(document.activeElement).toBe(huntingTrigger));
  });

  it('persists last focused shop item and restores focus to it on reopen', async () => {
    render(<Nav />);
  const shopTrigger = screen.getByRole('button', { name: /shop/i });
    shopTrigger.focus();
  await act(async () => { key(shopTrigger, 'Enter'); });
  let menu = await waitFor(() => {
    const el = shopTrigger.parentElement?.querySelector('ul[aria-labelledby]');
    if(!el) throw new Error('submenu not found');
    return el as HTMLElement;
  });
  const items = Array.from(menu.querySelectorAll('a')) as HTMLElement[];
    // activate second item
  const second = items[1];
  second.addEventListener('click', e => e.preventDefault());
  fireEvent.click(second);
    // reopen
    shopTrigger.focus();
  await act(async () => { key(shopTrigger, 'Enter'); });
  menu = await waitFor(() => {
    const el = shopTrigger.parentElement?.querySelector('ul[aria-labelledby]');
    if(!el) throw new Error('submenu not found');
    return el as HTMLElement;
  });
    await waitFor(() => {
      expect(document.activeElement?.getAttribute('href')).toBe(second.getAttribute('href'));
    });
  });


  it('closing with Escape returns focus to trigger', async () => {
    render(<Nav />);
  const shopTrigger = screen.getByRole('button', { name: /shop/i });
    shopTrigger.focus();
  await act(async () => { key(shopTrigger, 'Enter'); });
  const menu = await waitFor(() => {
    const el = shopTrigger.parentElement?.querySelector('ul[aria-labelledby]');
    if(!el) throw new Error('submenu not found');
    return el as HTMLElement;
  });
  const first = menu.querySelector('a') as HTMLElement;
  await waitFor(() => expect(document.activeElement).toBe(first));
  await act(async () => { key(first, 'Escape'); });
  await waitFor(() => expect(document.activeElement).toBe(shopTrigger));
  });
});
