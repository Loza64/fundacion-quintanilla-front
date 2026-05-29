import type User from '@/models/api/entities/User'
import { appSettings } from '@/AppSettings'
import SessionResponse from '@/models/api/SessionResponse'
import Service from '@/services/core/Service'

export default class UserService extends Service<User> {
  constructor() {
    super({
      origin: appSettings.apiService,
      endpoint: '/users',
    })
  }

  public async login(body: {
    username: string
    password: string
  }): Promise<SessionResponse> {
    const res = await this.axios.post<SessionResponse>('/auth/login', body)
    return res.data
  }

  public async signUp({
    payload,
  }: {
    payload: User
  }): Promise<SessionResponse> {
    const res = await this.axios.post<SessionResponse>('/auth/signup', payload)
    return res.data
  }

  public async profile(): Promise<User> {
    const res = await this.axios.get<User>('/auth/profile')
    return res.data
  }
}
