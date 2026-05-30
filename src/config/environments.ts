export class Environment {
  get getSecretKey() {
    const key = import.meta.env.VITE_SECRET_KEY
    if (!key || key.trim() === '') {
      throw new Error('SECRET_KEY no está definida en las variables de entorno')
    }
    return key
  }
}

export const environment = new Environment()
