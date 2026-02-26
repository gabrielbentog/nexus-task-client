/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  // outras variáveis de ambiente podem ser adicionadas aqui
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
