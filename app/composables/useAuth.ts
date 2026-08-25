import type { AdminUser } from '../../shared/types/user'

export const useAuth = () => {
  const user = useState<AdminUser | null>('auth-user', () => null)
  const loading = useState<boolean>('auth-loading', () => false)

  const fetchMe = async () => {
    try {
      const fetcher = useRequestFetch()
      const data = await fetcher<AdminUser | null>('/api/auth/me')
      user.value = data
      return data
    } catch {
      user.value = null
      return null
    }
  }

  const login = async (email: string, password: string) => {
    loading.value = true
    try {
      const response = await $fetch<{ user: AdminUser }>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      user.value = response.user
      return true
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // ignore
    } finally {
      user.value = null
      loading.value = false
    }
  }

  const isAuthenticated = computed(() => !!user.value)

  return {
    user,
    loading,
    isAuthenticated,
    fetchMe,
    login,
    logout,
  }
}
