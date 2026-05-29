import type User from '../api/entities/User'
import type SessionResponse from '../api/SessionResponse'

export default interface SessionType {
  profile?: User
  login: (payload: {
    username: string
    password: string
  }) => Promise<SessionResponse>
  signup: (payload: User) => Promise<SessionResponse>
  saveSession: (session: SessionResponse) => void
  logout: () => void
  loading: {
    profile: boolean
    login: boolean
    signup: boolean
  }
}
