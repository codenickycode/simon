/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly GIT_BRANCH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
