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
