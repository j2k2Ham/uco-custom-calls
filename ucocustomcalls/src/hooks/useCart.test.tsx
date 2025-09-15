import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { CartProvider, useCart } from './useCart';

function wrapper({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

describe('useCart', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  });
  it('adds an item and increments count and total', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.add({
        id: 'p1',
        slug: 'p1',
        title: 'Call One',
        description: 'Duck call',
        category: 'duck',
        price: 12999,
        images: [{ src: '/img1.jpg', alt: 'img' }],
        inStock: true
      });
    });
    expect(result.current.count).toBe(1);
    expect(result.current.total).toBe(12999);
  });

  it('accumulates quantity on duplicate add', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.add({
        id: 'p1', slug: 'p1', title: 'Call One', description: 'Duck call', category: 'duck', price: 1000, images: [{ src: '/i.jpg', alt: 'i' }], inStock: true
      });
      result.current.add({
        id: 'p1', slug: 'p1', title: 'Call One', description: 'Duck call', category: 'duck', price: 1000, images: [{ src: '/i.jpg', alt: 'i' }], inStock: true
      });
    });
    expect(result.current.count).toBe(2);
    expect(result.current.total).toBe(2000);
  });

  it('removes an item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.add({
        id: 'p2', slug: 'p2', title: 'Call Two', description: 'Duck call', category: 'duck', price: 5000, images: [{ src: '/i2.jpg', alt: 'i2' }], inStock: true
      });
      result.current.remove('p2');
    });
    expect(result.current.count).toBe(0);
    expect(result.current.total).toBe(0);
  });

  it('clears all items', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.add({
        id: 'p3', slug: 'p3', title: 'Call Three', description: 'Duck call', category: 'duck', price: 1000, images: [{ src: '/i3.jpg', alt: 'i3' }], inStock: true
      });
      result.current.add({
        id: 'p4', slug: 'p4', title: 'Call Four', description: 'Duck call', category: 'duck', price: 2000, images: [{ src: '/i4.jpg', alt: 'i4' }], inStock: true
      });
      result.current.clear();
    });
    expect(result.current.count).toBe(0);
    expect(result.current.total).toBe(0);
  });

  it('supports quantity parameter on add', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.add({
        id: 'pq', slug: 'pq', title: 'Qty', description: 'Duck call', category: 'duck', price: 1000, images: [{ src: '/iq.jpg', alt: 'iq' }], inStock: true
      }, 3);
    });
    expect(result.current.count).toBe(3);
    expect(result.current.total).toBe(3000);
  });

  it('remove non-existent id is a no-op', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.add({ id: 'p5', slug: 'p5', title: 'P5', description: 'Duck call', category: 'duck', price: 1000, images: [{ src: '/i5.jpg', alt: 'i5' }], inStock: true });
      result.current.remove('does-not-exist');
    });
    expect(result.current.count).toBe(1);
    expect(result.current.total).toBe(1000);
  });

  it('sets open flag true after add', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.add({ id: 'po', slug: 'po', title: 'P Open', description: 'Duck call', category: 'duck', price: 1000, images: [{ src: '/io.jpg', alt: 'io' }], inStock: true });
    });
    expect(result.current.open).toBe(true);
  });

  it('hydrates from existing localStorage data', () => {
    // Seed storage before hook mounts
    const seeded = [
      { id: 'h1', title: 'Hydrated', price: 500, qty: 2, slug: 'h1' }
    ];
    localStorage.setItem('uco.cart', JSON.stringify(seeded));
    const { result } = renderHook(() => useCart(), { wrapper });
    // Effects run after mount; flush microtask queue
    expect(result.current.count).toBe(2);
    expect(result.current.total).toBe(1000);
  });
});
