import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

// Lightweight mock for Headless UI Dialog to avoid portal/focus overhead in tests
vi.mock('@headlessui/react', async (orig) => {
	const actual = await (orig as any)();
	const DialogRoot: any = ({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) => {
		if (!open) return null;
		return React.createElement('div', { 'data-testid': 'mock-dialog', onClick: onClose }, children);
	};
	DialogRoot.Title = ({ children }: { children: React.ReactNode }) => React.createElement('h2', null, children);
	return { ...actual, Dialog: DialogRoot };
});

// Central next/link mock to avoid act warnings from prefetch logic
vi.mock('next/link', () => ({
	__esModule: true,
	default: ({ href, children, ...rest }: { href: string | { pathname?: string }; children: React.ReactNode; [k: string]: unknown }) => (
		React.createElement('a', { href: typeof href === 'string' ? href : href?.pathname || '#', ...rest }, children)
	)
}));

// Fail tests on unexpected console errors or selected warnings
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
	console.error = (...args: unknown[]) => {
		originalError(...(args as unknown[]));
		throw new Error('Console error detected: ' + args.map(String).join(' '));
	};
	console.warn = (...args: unknown[]) => {
		const message = args.map(String).join(' ');
		if (/not wrapped in act/.test(message)) {
			throw new Error('React act() warning: ' + message);
		}
		originalWarn(...(args as unknown[]));
	};
});

afterAll(() => {
	console.error = originalError;
	console.warn = originalWarn;
});
