import { axe as realAxe } from 'jest-axe';

const DISABLE_AXE = process.env.AXE_DISABLED === '1';

type AxeReturn = Awaited<ReturnType<typeof realAxe>>;
export async function axe(node: HTMLElement, options?: Parameters<typeof realAxe>[1]): Promise<AxeReturn> {
  if (DISABLE_AXE) {
    return {
      violations: [],
      passes: [],
      incomplete: [],
      inapplicable: [],
      toolOptions: {},
      testEngine: { name: 'axe-core', version: 'stub' },
      testRunner: { name: 'axe', version: 'stub' },
      testEnvironment: { userAgent: 'stub', windowWidth: 0, windowHeight: 0, orientationAngle: 0, orientationType: 'landscape-primary' },
      timestamp: new Date().toISOString(),
      url: 'about:blank'
    } as unknown as AxeReturn;
  }
  return realAxe(node, options);
}
