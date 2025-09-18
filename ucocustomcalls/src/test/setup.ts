// Global test setup additions
// Clears localStorage before each test to ensure isolation.
beforeEach(() => {
  if (typeof window !== 'undefined') {
    try { localStorage.clear(); } catch { /* ignore */ }
  }
});
