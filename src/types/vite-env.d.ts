// Tipado de env
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_SECRET_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
