import { themeAtom } from '@/store/theme'
import { useAtom } from 'jotai'

export function ThemeSwitch() {
  const [theme, setTheme] = useAtom(themeAtom)
  const isDark = theme === 'dark'

  const toggle = () => setTheme(isDark ? 'light' : 'dark')

  return (
    <button
      className="relative size-10 rounded-full border border-white/30 dark:border-white/10 bg-white/20 dark:bg-white/5 backdrop-blur-md shadow-lg flex items-center justify-center transition-colors duration-300 hover:bg-white/40 dark:hover:bg-white/10"
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggle}
    >
      <span className="sr-only">{isDark ? 'Light' : 'Dark'}</span>
      <i className={`iconfont text-lg transition-all duration-300 ${isDark ? 'icon-sun' : 'icon-moon'}`}></i>
    </button>
  )
}
