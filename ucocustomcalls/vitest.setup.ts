import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

// Lightweight mock for Headless UI Dialog to avoid portal/focus overhead in tests
vi.mock('@headlessui/react', async (orig) => {
	const actual: any = await (orig as any)();
	return {
		...actual,
		Dialog: ({ open, onClose, children }: any) => {
			if (!open) return null;
			return React.createElement('div', { 'data-testid': 'mock-dialog', onClick: onClose }, children);
		}
	};
});
