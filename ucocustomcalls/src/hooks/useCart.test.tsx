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
});
