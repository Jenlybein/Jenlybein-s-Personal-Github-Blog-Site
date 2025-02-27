/// <reference types="vite/client" />

// jinrishici.d.ts
declare module "jinrishici" {
  export function load(
    callback: (result: any) => void,
    errorCallback?: (error: any) => void
  ): void;
}

declare module "aplayer" {
  const APlayer: any;
  export default APlayer;
}

declare module 'markdown-it-texmath'