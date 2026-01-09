/// <reference types="vite/client" />

declare interface Window {
  fbq: (...args: unknown[]) => void;
}

declare const fbq: (...args: unknown[]) => void;
