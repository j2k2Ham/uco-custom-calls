import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

// Lightweight mock for Headless UI Dialog to avoid portal/focus overhead in tests
vi.mock('@headlessui/react', async (orig) => {
	const loader: unknown = orig;
	const actualModule = typeof loader === 'function' ? await (loader as () => Promise<unknown>)() : {};
	interface DialogProps { open: boolean; onClose: () => void; children: React.ReactNode }
	const DialogRoot = ({ open, onClose, children }: DialogProps) => {
		if (!open) return null;
		return React.createElement(
			'div',
			{ 'data-testid': 'mock-dialog' },
			[
				React.createElement('div', { key: 'backdrop', 'data-testid': 'mock-backdrop', onClick: onClose }),
				React.createElement('div', { key: 'panel' }, children)
			]
		);
	};
	DialogRoot.displayName = 'MockDialog';
	const DialogTitle = ({ children }: { children: React.ReactNode }) => React.createElement('h2', null, children);
	DialogTitle.displayName = 'MockDialogTitle';
	DialogRoot.Title = DialogTitle;
	return { ...(actualModule as Record<string, unknown>), Dialog: DialogRoot };
});

// Central next/link mock to avoid act warnings from prefetch logic
vi.mock('next/link', () => ({
	__esModule: true,
	default: ({ href, children, ...rest }: { href: string | { pathname?: string }; children: React.ReactNode; [k: string]: unknown }) => {
		const resolved = typeof href === 'string' ? href : href?.pathname || '#';
		return React.createElement('a', { href: resolved, ...rest }, children);
	}
}));

// Fail tests on unexpected console errors or selected warnings
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
	console.error = (...args: unknown[]) => {
		originalError(...args);
		throw new Error('Console error detected: ' + args.map(String).join(' '));
	};
	console.warn = (...args: unknown[]) => {
		const message = args.map(String).join(' ');
		if (/not wrapped in act/.test(message)) {
			throw new Error('React act() warning: ' + message);
		}
		originalWarn(...args);
	};
});

afterAll(() => {
	console.error = originalError;
	console.warn = originalWarn;
});
