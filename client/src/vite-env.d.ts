/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly GIT_BRANCH: string;
  readonly GIT_SHA: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
