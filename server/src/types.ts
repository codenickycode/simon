export interface Env {
  db: KVNamespace;
  environment: 'local' | 'prod';
}
