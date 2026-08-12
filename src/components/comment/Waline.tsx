import { useEffect, useRef } from 'react'
import { init } from '@waline/client'
import '@waline/client/style'
import './waline-override.css'

export function Waline({ serverURL }: { serverURL: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const walineInst = init({
      el: ref.current,
      serverURL,
      dark: "[data-theme='dark']",
      login: 'force',
      imageUploader: false,
      search: false,
      locale: {
        placeholder: '点此开始评论',
      },
      emoji: ['//unpkg.com/@waline/emojis@1.1.0/bilibili'],
    })

    return () => {
      if (ref.current) {
        walineInst?.destroy()
      }
    }
  }, [serverURL])

  return (
    <div
      className="waline-glass-wrapper backdrop-blur-2xl bg-white/20 dark:bg-white/4 rounded-[64px] border border-white/20 dark:border-white/6 shadow-2xl shadow-black/5 dark:shadow-black/20 p-8 md:p-10"
    >
      <div ref={ref} className="waline-container" />
    </div>
  )
}
