import { menus } from '@/config.json'
import { type ButtonHTMLAttributes, createContext, useContext, useState, forwardRef } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { ThemeSwitch } from '@/components/footer/ThemeSwitch'

const contentVariants = {
  hidden: {
    x: '-100%',
    transition: {
      duration: 0.2,
      ease: 'easeOut' as const,
    },
  },
  visible: {
    x: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
      duration: 0.2,
      ease: 'easeOut' as const,
    },
  },
}

const menuItemVariants = {
  hidden: {
    opacity: 0,
    x: '-100%',
  },
  visible: {
    opacity: 1,
    x: 0,
  },
}

export function HeaderDrawer({ zIndex = 999 }: { zIndex?: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const overlayZIndex = zIndex - 1
  const contentZIndex = zIndex

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <TriggerButton />
      </Dialog.Trigger>

      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-gray-800/40"
                style={{ zIndex: overlayZIndex }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { delay: 0.1 } }}
              ></motion.div>
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                className="fixed left-0 inset-y-0 h-full backdrop-blur-2xl bg-white/70 dark:bg-gray-900/70 rounded-r-[48px] border-r border-y border-white/20 dark:border-white/[0.06] shadow-2xl p-4 flex flex-col justify-center w-[280px] max-w-[80%]"
                style={{ zIndex: contentZIndex }}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <DrawerContext.Provider
                  value={{
                    dismiss() {
                      setIsOpen(false)
                    },
                  }}
                >
                  <DrawerContentImpl />
                </DrawerContext.Provider>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}

const TriggerButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>((props, ref) => {
  return (
    <button
      ref={ref}
      className="size-9 rounded-full shadow-lg shadow-zinc-800/5 border border-primary bg-white/50 dark:bg-zinc-800/50 backdrop-blur"
      type="button"
      aria-label="Open menu"
      {...props}
    >
      <i className="iconfont icon-menu"></i>
    </button>
  )
})

function DrawerContentImpl() {
  const { dismiss } = useContext(DrawerContext)

  return (
    <div className="mt-8 pb-8 overflow-y-auto overflow-x-hidden min-h-0 flex flex-col">
      <ul>
        {menus.map((menu) => (
          <motion.li key={menu.name} variants={menuItemVariants}>
            <a className="inline-flex p-2 space-x-4" href={menu.link} onClick={dismiss}>
              <i className={clsx('iconfont', menu.icon)}></i>
              <span>{menu.name}</span>
            </a>
          </motion.li>
        ))}
      </ul>
      <div className="mt-6 pt-6 border-t border-primary">
        <ThemeSwitch />
      </div>
    </div>
  )
}

const DrawerContext = createContext<{ dismiss(): void }>(null!)
