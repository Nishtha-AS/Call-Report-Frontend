/* eslint-disable @typescript-eslint/no-empty-function */
import '@testing-library/jest-dom';

// ---- ResizeObserver (Ionic components, lists, etc.) ----
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
;(global as any).ResizeObserver = ResizeObserver;

// ---- IntersectionObserver (images, virtual lists) ----
class IntersectionObserver {
  root: Element | null = null;
  rootMargin = '';
  thresholds: number[] = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}
;(global as any).IntersectionObserver = IntersectionObserver;

// ---- matchMedia (Ionic reads this for media queries) ----
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),        // deprecated
    removeListener: jest.fn(),     // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// ---- scrollTo no-op (some pages call this) ----
if (!window.scrollTo) {
  // @ts-ignore
  window.scrollTo = () => {};
}

// ---- requestAnimationFrame polyfill (animations/timers) ----
if (!window.requestAnimationFrame) {
  // @ts-ignore
  window.requestAnimationFrame = (cb: FrameRequestCallback) =>
    setTimeout(() => cb(Date.now()), 16) as unknown as number;
}
if (!window.cancelAnimationFrame) {
  // @ts-ignore
  window.cancelAnimationFrame = (id: number) => clearTimeout(id);
}
