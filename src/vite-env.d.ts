/// <reference types="vite/client" />

import type { PyWebview } from "@defs/PyWebview";

export {};

declare global {
  interface Window {
    pywebview?: PyWebview;
    hasPWV?: boolean;
  }
}