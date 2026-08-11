import { useCallback, useEffect, useRef, useState } from 'react'
import type { CollectionEntry } from 'astro:content'
import { getShortDate } from '@/utils/date'

const RADIUS = 170
const CARD_W = 170
const AUTO_SPEED = 0.018 // 自动旋转速度（度/ms）
const DRAG_SENSITIVITY = 0.35 // 拖拽灵敏度
const INERTIA_DECAY = 0.94 // 惯性衰减系数
const WHEEL_SENSITIVITY = 0.15 // 滚轮灵敏度

interface Props {
  posts: CollectionEntry<'posts'>[]
}

export function PostCarousel({ posts }: Props) {
  const [rotation, setRotation] = useState(0)
  const rotationRef = useRef(0)
  const [isHovering, setIsHovering] = useState(false)

  // 拖拽状态
  const isDragging = useRef(false)
  const dragStartX = useRef(0)
  const dragStartRot = useRef(0)
  const lastDragX = useRef(0)
  const lastDragTime = useRef(0)
  const dragMoved = useRef(false) // 是否发生了拖拽移动（区分点击和拖拽）

  // 惯性 / 自动旋转
  const modeRef = useRef<'auto' | 'drag' | 'inertia' | 'paused'>('auto')
  const velocityRef = useRef(0) // 惯性速度 (deg/ms)
  const rafRef = useRef(0)
  const lastTimeRef = useRef(0)

  // RAF 驱动循环
  const loop = useCallback((time: number) => {
    const delta = lastTimeRef.current ? time - lastTimeRef.current : 16
    lastTimeRef.current = time

    const mode = modeRef.current

    if (mode === 'auto') {
      const next = (rotationRef.current + delta * AUTO_SPEED) % 360
      rotationRef.current = next
      setRotation(next)
    } else if (mode === 'inertia') {
      const v = velocityRef.current
      if (Math.abs(v) < 0.001) {
        // 惯性结束，恢复自动旋转或暂停
        modeRef.current = isHovering ? 'paused' : 'auto'
      } else {
        velocityRef.current *= INERTIA_DECAY
        const next = (rotationRef.current + v * delta) % 360
        rotationRef.current = next
        setRotation(next)
      }
    }
    // 'drag' 模式下由 mousemove 直接控制
    // 'paused' 模式下不旋转

    rafRef.current = requestAnimationFrame(loop)
  }, [])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [loop])

  // 同步 hover 状态到 ref
  useEffect(() => {
    if (!isHovering && modeRef.current === 'paused') {
      modeRef.current = 'auto'
    }
  }, [isHovering])

  // Swup 兼容
  useEffect(() => {
    const handler = () => {
      lastTimeRef.current = 0
      modeRef.current = 'auto'
      velocityRef.current = 0
    }
    document.addEventListener('swup:contentReplaced', handler)
    return () => document.removeEventListener('swup:contentReplaced', handler)
  }, [])

  // ── 鼠标 / 触摸事件 ──
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    isDragging.current = true
    dragMoved.current = false
    dragStartX.current = e.clientX
    dragStartRot.current = rotationRef.current
    lastDragX.current = e.clientX
    lastDragTime.current = performance.now()
    modeRef.current = 'drag'
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return
    const dx = e.clientX - dragStartX.current
    // 超过 4px 才算拖拽，避免误触
    if (Math.abs(dx) > 4) {
      dragMoved.current = true
    }
    const now = performance.now()
    const dt = now - lastDragTime.current
    if (dt > 0) {
      velocityRef.current = ((e.clientX - lastDragX.current) * DRAG_SENSITIVITY) / dt
    }
    lastDragX.current = e.clientX
    lastDragTime.current = now

    const next = ((dragStartRot.current + dx * DRAG_SENSITIVITY) % 360 + 360) % 360
    rotationRef.current = next
    setRotation(next)
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return
    ;(e.target as HTMLElement).releasePointerCapture?.(e.pointerId)
    isDragging.current = false

    if (Math.abs(velocityRef.current) > 0.005) {
      modeRef.current = 'inertia'
    } else {
      modeRef.current = isHovering ? 'paused' : 'auto'
    }
    lastTimeRef.current = 0
  }

  // ── 滚轮旋转 ──
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY * WHEEL_SENSITIVITY
    const next = ((rotationRef.current + delta) % 360 + 360) % 360
    rotationRef.current = next
    setRotation(next)
    // 滚轮后给一点惯性
    velocityRef.current = (delta * 0.005)
    modeRef.current = 'inertia'
    lastTimeRef.current = 0
  }

  // ── 卡片点击拦截（拖拽时不跳转） ──
  const handleCardClick = (e: React.MouseEvent, href: string) => {
    if (dragMoved.current) {
      e.preventDefault()
      return
    }
    // 正常跳转
  }

  const itemAngle = 360 / Math.max(posts.length, 1)

  const getCardVisibility = (cardAngle: number) => {
    const worldAngle = ((cardAngle + rotationRef.current) % 360 + 360) % 360
    const relativeAngle = worldAngle > 180 ? worldAngle - 360 : worldAngle
    const absAngle = Math.abs(relativeAngle)
    const normalized = 1 - absAngle / 180

    return {
      opacity: 0.1 + normalized * 0.9,
      scale: 0.5 + normalized * 0.5,
      blurAmount: Math.max(0, (1 - normalized) * 2.5),
      brightness: 0.3 + normalized * 0.7,
      zIndex: Math.round(normalized * 200),
      isFront: normalized > 0.85,
    }
  }

  // 用 rotation state 触发重渲染，同时实时读取 rotationRef
  const displayRotation = rotation
  const ringDia = RADIUS * 2
  const containerHeight = ringDia + 160

  return (
    <div
      className="relative flex items-center justify-center select-none cursor-grab active:cursor-grabbing"
      style={{
        width: `${ringDia + 100}px`,
        height: `${containerHeight}px`,
        perspective: '800px',
        touchAction: 'none',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      onMouseEnter={() => {
        setIsHovering(true)
        if (modeRef.current === 'auto') {
          modeRef.current = 'paused'
        }
      }}
      onMouseLeave={() => {
        setIsHovering(false)
        if (!isDragging.current && modeRef.current === 'paused') {
          modeRef.current = 'auto'
        }
      }}
    >
      {/* 底部光晕 */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ width: `${ringDia + 40}px` }}
      >
        <div className="w-full rounded-full bg-accent/8 blur-3xl" style={{ height: '40px' }} />
        <div className="w-3/4 mx-auto rounded-full bg-accent/12 blur-2xl -mt-6" style={{ height: '20px' }} />
      </div>

      {/* 外装饰环 */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: `${ringDia + 36}px`,
          height: `${ringDia + 36}px`,
          border: '1.5px solid rgb(var(--color-accent) / 0.15)',
          boxShadow: '0 0 40px rgb(var(--color-accent) / 0.06), inset 0 0 40px rgb(var(--color-accent) / 0.04)',
        }}
      />

      {/* 轨道环 */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: `${ringDia}px`,
          height: `${ringDia}px`,
          border: '1px dashed rgb(var(--color-accent) / 0.2)',
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: `${ringDia - 12}px`,
          height: `${ringDia - 12}px`,
          border: '1px dashed rgb(var(--color-accent) / 0.1)',
        }}
      />

      {/* 辐条 */}
      <div className="absolute top-1/2 left-1/2 pointer-events-none" style={{ width: 0, height: 0 }}>
        {posts.map((_, i) => (
          <div
            key={i}
            className="absolute top-0 left-0 w-px bg-accent/10 origin-center"
            style={{
              height: `${RADIUS - 8}px`,
              transform: `rotate(${itemAngle * i - 90}deg)`,
              transformOrigin: 'top center',
            }}
          />
        ))}
      </div>

      {/* 中心 Hub */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-25 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-lg"
          style={{ width: '36px', height: '36px' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: '20px',
            height: '20px',
            background: 'radial-gradient(circle at 35% 35%, rgb(var(--color-accent) / 0.8), rgb(var(--color-accent) / 0.3))',
            boxShadow: '0 0 16px rgb(var(--color-accent) / 0.4)',
          }}
        />
        <div
          className="absolute rounded-full bg-white/80"
          style={{ width: '5px', height: '5px', top: 'calc(50% - 8px)', left: 'calc(50% - 4px)' }}
        />
      </div>

      {/* 3D 旋转场景 */}
      <div
        className="absolute top-1/2 left-1/2"
        style={{
          width: 0,
          height: 0,
          transformStyle: 'preserve-3d',
          transform: `rotateX(12deg) rotateY(${displayRotation}deg)`,
        }}
      >
        {posts.map((post, i) => {
          const angle = itemAngle * i
          const vis = getCardVisibility(angle)

          return (
            <a
              key={post.id}
              href={`/posts/${post.id}`}
              onClick={(e) => handleCardClick(e, `/posts/${post.id}`)}
              className="absolute block will-change-transform group"
              style={{
                width: `${CARD_W}px`,
                transform: `translate(-50%, -50%) rotateY(${-angle}deg) translateZ(${RADIUS}px)`,
                transformStyle: 'preserve-3d',
                opacity: vis.opacity,
                filter: `blur(${vis.blurAmount}px) brightness(${vis.brightness})`,
                zIndex: vis.zIndex,
                pointerEvents: vis.isFront ? 'auto' : 'none',
              }}
              title={post.data.title}
            >
              {/* 连接臂 */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5">
                <div className="w-1 h-3 rounded-full bg-accent/40" />
                <div className="w-1.5 h-1.5 rounded-full bg-accent/30" />
              </div>

              {/* 卡片 */}
              <div
                className="relative rounded-2xl overflow-hidden
                  bg-white/85 dark:bg-zinc-800/85 backdrop-blur-xl
                  border border-white/50 dark:border-zinc-700/50
                  shadow-lg shadow-black/5 dark:shadow-black/30
                  transition-all duration-500"
                style={{ transform: `scale(${vis.scale})` }}
              >
                {vis.isFront && (
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      boxShadow: 'inset 0 0 20px rgb(var(--color-accent) / 0.12)',
                      border: '1px solid rgb(var(--color-accent) / 0.25)',
                    }}
                  />
                )}

                {post.data.cover ? (
                  <img
                    src={post.data.cover}
                    alt={post.data.title}
                    className="w-full h-24 object-cover"
                    loading="lazy"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-16 bg-linear-to-br from-accent/10 via-accent/5 to-transparent flex items-center justify-center">
                    <i className="iconfont icon-archive text-2xl text-accent/30" />
                  </div>
                )}

                <div className="p-3">
                  <h3 className="text-[13px] font-semibold leading-snug line-clamp-2 text-gray-800 dark:text-gray-100">
                    {post.data.title}
                  </h3>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                    <span className="font-mono tracking-tight">{getShortDate(post.data.date)}</span>
                    {post.data.category && (
                      <span className="px-1.5 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
                        {post.data.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </a>
          )
        })}
      </div>

      {/* 状态提示 */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] text-secondary/50
          transition-opacity duration-300 pointer-events-none whitespace-nowrap"
        style={{ opacity: isHovering ? 1 : 0 }}
      >
        拖拽或滚轮旋转 · 点击卡片阅读
      </div>
    </div>
  )
}
