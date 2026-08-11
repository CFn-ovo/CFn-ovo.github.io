import { useCallback, useEffect, useRef, useState } from 'react'
import { animate } from 'framer-motion'
import { getDaysInYear, getDiffInDays, getStartOfDay, getStartOfYear } from '@/utils/date'

interface Props {
  /** 用于强制 Astro 在页面切换时重建 island，确保数据刷新 */
  pathname?: string
}

export function TimelineProgress({ pathname: _pathname }: Props) {
  const [currentYear, setCurrentYear] = useState(0)
  const [dayOfYear, setDayOfYear] = useState(0)
  const [percentOfYear, setPercentOfYear] = useState(0)
  const [percentOfToday, setPercentOfToday] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null)

  const updateInfo = useCallback(() => {
    const now = new Date()
    setCurrentYear(now.getFullYear())

    const pastDays = getDiffInDays(getStartOfYear(now), now)
    setDayOfYear(pastDays)
    setPercentOfYear((pastDays / getDaysInYear(now)) * 100)

    const pastTime = now.getTime() - getStartOfDay(now).getTime()
    setPercentOfToday((pastTime / 86400 / 1000) * 100)
  }, [])

  useEffect(() => {
    // 立即更新一次
    updateInfo()

    // 每秒更新
    intervalRef.current = setInterval(updateInfo, 1000)

    // 监听 Swup 内容替换事件，确保导航后立即刷新
    const handleContentReplaced = () => {
      updateInfo()
    }
    document.addEventListener('swup:contentReplaced', handleContentReplaced)

    // 监听页面可见性变化 — 从其他标签页切回时刷新
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateInfo()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      document.removeEventListener('swup:contentReplaced', handleContentReplaced)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [updateInfo])

  return (
    <>
      <p className="mt-4">
        今天是 {currentYear} 年的第 <CountUp to={dayOfYear} decimals={0} /> 天
      </p>
      <p className="mt-4">
        今年已过 <CountUp to={percentOfYear} decimals={5} />%
      </p>
      <p className="mt-4">
        今天已过 <CountUp to={percentOfToday} decimals={5} />%
      </p>
    </>
  )
}

function CountUp({
  to,
  decimals,
  duration = 0.6,
}: {
  to: number
  decimals: number
  duration?: number
}) {
  const node = useRef<HTMLSpanElement>(null)
  const prev = useRef(0)
  const animRef = useRef<ReturnType<typeof animate>>(null)

  useEffect(() => {
    const el = node.current
    if (!el) return

    // 停止上一次动画
    animRef.current?.stop()

    const control = animate(prev.current, to, {
      duration,
      onUpdate: (value) => {
        el.textContent = value.toFixed(decimals)
      },
    })
    animRef.current = control
    prev.current = to

    return () => {
      control.stop()
    }
  }, [to, decimals, duration])

  return <span ref={node}>{to.toFixed(decimals)}</span>
}
