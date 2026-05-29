import { appSettings } from '@/AppSettings'
import { queryClient, queryKeys } from '@/lib/queryClient'
import errorResponse from '@/utils/errorResponse'
import axios, { type AxiosInstance } from 'axios'

const DEFAULT_TIMEOUT_MS = 15_000

export interface AxiosInstanceParams {
  origin: string
  initPath: string
  onUnauthorized?: () => void
}

export const axiosInstance = ({
  origin,
  initPath,
  onUnauthorized,
}: AxiosInstanceParams): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${origin}/${initPath}`,
    timeout: DEFAULT_TIMEOUT_MS,
  })

  instance.interceptors.request.use((config) => {
    const token = appSettings.token

    if (token) config.headers.Authorization = `Bearer ${token}`

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }

    return config
  })

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status

      if (status === 401) {
        appSettings.removeToken()
        queryClient.setQueryData(queryKeys.session, null)
        const redirect =
          onUnauthorized ??
          (() => {
            window.location.href = '/login'
          })
        redirect()
        return Promise.reject(error)
      }
      errorResponse({ error })
      return Promise.reject(error)
    }
  )

  return instance
}
