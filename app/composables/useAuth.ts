import type { AdminUser } from '../../shared/types/user'

export const useAuth = () => {
  const user = useState<AdminUser | null>('auth-user', () => null)
  const loading = useState<boolean>('auth-loading', () => false)

  const fetchMe = async () => {
    try {
      // TODO: replace with real useFetch/ $fetch to '/api/auth/me' in Phase 3
      if (import.meta.client) {
        const cached = localStorage.getItem('admin-user')
        if (cached) {
          user.value = JSON.parse(cached)
        }
      }
    } catch {
      user.value = null
    }
  }

  const login = async (email: string, password: string) => {
    loading.value = true
    try {
      // TODO: replace with real POST '/api/auth/login' call in Phase 3
      // const response = await $fetch<AdminUser>('/api/auth/login', {
      //   method: 'POST',
      //   body: { email, password }
      // })
      // user.value = response
      
      // Temporary mockup for client-side testing
      if (email === 'admin@portfolio.local' && password === 'password123') {
        const mockUser: AdminUser = {
          id: 'seed-admin-id',
          email,
          createdAt: new Date().toISOString(),
        }
        user.value = mockUser
        if (import.meta.client) {
          localStorage.setItem('admin-user', JSON.stringify(mockUser))
        }
        return true
      }
      throw new Error('Identifiants incorrects')
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    try {
      // TODO: replace with real POST '/api/auth/logout' call in Phase 3
      // await $fetch('/api/auth/logout', { method: 'POST' })
      user.value = null
      if (import.meta.client) {
        localStorage.removeItem('admin-user')
      }
    } finally {
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
