export default defineNuxtRouteMiddleware(async (to) => {
  const { user, fetchMe } = useAuth()
  const localePath = useLocalePath()

  // Load session if client-side and empty
  if (import.meta.client && !user.value) {
    await fetchMe()
  }

  const path = to.path
  // Check if path is related to admin
  const isAdminPath = path.match(/\b\/admin\b/)
  const isLoginPage = path.match(/\b\/admin\/login\b/)

  if (isAdminPath) {
    if (!isLoginPage && !user.value) {
      return navigateTo(localePath('/admin/login'))
    }
    if (isLoginPage && user.value) {
      return navigateTo(localePath('/admin'))
    }
  }
})
