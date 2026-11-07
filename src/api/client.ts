import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

function resolveBaseUrl(): string {
  const envUrl = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '')
  if (envUrl) return envUrl.replace(/\/api(\/v1)?$/, '')
  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    if (host.includes('josapratama.com') || host.includes('josapratama.cloud')) {
      return 'https://josapratama-api.josapratama.com'
    }
  }
  return ''
}

export const BASE_URL = resolveBaseUrl()

// Public API client — no auth headers needed
export const publicApi = axios.create({
  baseURL: `${BASE_URL}/api/v1/public`,
  headers: { 'Content-Type': 'application/json' },
})

// Admin API client — attaches Bearer token, handles 401
export const adminApi = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // for refresh token cookie
})

// Inject access token on every admin request
adminApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// On 401, try to refresh once then redirect to login
let isRefreshing = false
let failedQueue: Array<{ resolve: (v: string) => void; reject: (e: unknown) => void }> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token!)
  })
  failedQueue = []
}

adminApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config
    const requestUrl = originalRequest?.url || ''
    const isAuthEndpoint = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/refresh')

    if (error.response?.status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return adminApi(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const res = await axios.post(
          `${BASE_URL}/api/v1/auth/refresh`,
          {},
          { withCredentials: true }
        )
        const { access_token, admin } = res.data.data
        useAuthStore.getState().setAccessToken(access_token)
        if (admin) {
          useAuthStore.getState().setAdmin(admin)
        }
        processQueue(null, access_token)
        originalRequest.headers.Authorization = `Bearer ${access_token}`
        return adminApi(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        useAuthStore.getState().logout()
        if (window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login'
        }
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)
