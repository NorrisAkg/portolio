export const useMobileMenu = () => {
  const isOpen = useState('mobileMenuOpen', () => false)
  const open = () => { isOpen.value = true }
  const close = () => { isOpen.value = false }
  return { isOpen, open, close }
}
